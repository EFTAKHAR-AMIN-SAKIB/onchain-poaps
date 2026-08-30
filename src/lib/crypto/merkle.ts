import { getAddress, isAddress, encodePacked, keccak256, Hex, toHex, fromHex } from "viem";

export interface AllowlistEntry {
  address: `0x${string}`;
  leaf: Hex;
  proof: Hex[];
  index: number;
}

export interface MerkleTreeResult {
  root: Hex;
  leaves: Hex[];
  entries: AllowlistEntry[];
  totalValid: number;
  totalInvalid: number;
  totalDuplicates: number;
  invalidEntries: string[];
}

/**
 * Computes the OpenZeppelin-compatible leaf hash for an address:
 * keccak256(abi.encodePacked(address))
 */
export function hashAddressLeaf(address: string): Hex {
  const checksummed = getAddress(address.trim());
  return keccak256(encodePacked(["address"], [checksummed]));
}

/**
 * Combines two 32-byte hashes in sorted order, matching OpenZeppelin's MerkleProof.verify:
 * a < b ? keccak256(abi.encodePacked(a, b)) : keccak256(abi.encodePacked(b, a))
 */
export function hashPair(a: Hex, b: Hex): Hex {
  const aBig = BigInt(a);
  const bBig = BigInt(b);
  const [first, second] = aBig <= bBig ? [a, b] : [b, a];
  return keccak256(encodePacked(["bytes32", "bytes32"], [first, second]));
}

/**
 * Verifies a Merkle proof against a root and leaf using OpenZeppelin's sorted-pair rule.
 */
export function verifyMerkleProof(proof: Hex[], root: Hex, leaf: Hex): boolean {
  let computedHash = leaf;
  for (const proofElement of proof) {
    computedHash = hashPair(computedHash, proofElement);
  }
  return computedHash.toLowerCase() === root.toLowerCase();
}

/**
 * Parses raw text, CSV, or TXT content and extracts unique, valid Ethereum addresses.
 */
export function parseAllowlistInput(rawText: string): {
  validAddresses: `0x${string}`[];
  invalidEntries: string[];
  duplicateCount: number;
} {
  const lines = rawText.split(/[\r\n,; \t]+/);
  const seen = new Set<string>();
  const validAddresses: `0x${string}`[] = [];
  const invalidEntries: string[] = [];
  let duplicateCount = 0;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Check if valid address format
    if (isAddress(trimmed, { strict: false })) {
      try {
        const checksummed = getAddress(trimmed);
        const lower = checksummed.toLowerCase();
        if (seen.has(lower)) {
          duplicateCount++;
        } else {
          seen.add(lower);
          validAddresses.push(checksummed);
        }
      } catch {
        invalidEntries.push(trimmed);
      }
    } else {
      // Check if line contains a 0x address pattern
      const match = trimmed.match(/0x[a-fA-F0-9]{40}/);
      if (match && isAddress(match[0], { strict: false })) {
        try {
          const checksummed = getAddress(match[0]);
          const lower = checksummed.toLowerCase();
          if (seen.has(lower)) {
            duplicateCount++;
          } else {
            seen.add(lower);
            validAddresses.push(checksummed);
          }
        } catch {
          invalidEntries.push(trimmed);
        }
      } else {
        invalidEntries.push(trimmed);
      }
    }
  }

  return {
    validAddresses,
    invalidEntries,
    duplicateCount,
  };
}

/**
 * Builds an OpenZeppelin-compatible Merkle Tree from an array of addresses.
 */
export function buildMerkleTree(addresses: `0x${string}`[]): MerkleTreeResult {
  if (addresses.length === 0) {
    return {
      root: "0x0000000000000000000000000000000000000000000000000000000000000000",
      leaves: [],
      entries: [],
      totalValid: 0,
      totalInvalid: 0,
      totalDuplicates: 0,
      invalidEntries: [],
    };
  }

  // Deduplicate and checksum
  const uniqueAddresses = Array.from(new Set(addresses.map((a) => getAddress(a))));
  const leaves = uniqueAddresses.map((addr) => hashAddressLeaf(addr));

  // Build tree levels
  const layers: Hex[][] = [leaves];
  while (layers[layers.length - 1].length > 1) {
    const currentLayer = layers[layers.length - 1];
    const nextLayer: Hex[] = [];

    for (let i = 0; i < currentLayer.length; i += 2) {
      if (i + 1 < currentLayer.length) {
        nextLayer.push(hashPair(currentLayer[i], currentLayer[i + 1]));
      } else {
        // If odd element, promote to next layer
        nextLayer.push(currentLayer[i]);
      }
    }
    layers.push(nextLayer);
  }

  const root = layers[layers.length - 1][0] || "0x0000000000000000000000000000000000000000000000000000000000000000";

  // Generate proofs for each leaf
  const entries: AllowlistEntry[] = uniqueAddresses.map((address, index) => {
    const leaf = leaves[index];
    const proof: Hex[] = [];
    let currentIdx = index;

    for (let layerIdx = 0; layerIdx < layers.length - 1; layerIdx++) {
      const layer = layers[layerIdx];
      const isRightNode = currentIdx % 2 === 1;
      const pairIdx = isRightNode ? currentIdx - 1 : currentIdx + 1;

      if (pairIdx < layer.length) {
        proof.push(layer[pairIdx]);
      }
      currentIdx = Math.floor(currentIdx / 2);
    }

    return {
      address,
      leaf,
      proof,
      index,
    };
  });

  return {
    root,
    leaves,
    entries,
    totalValid: uniqueAddresses.length,
    totalInvalid: 0,
    totalDuplicates: 0,
    invalidEntries: [],
  };
}

/**
 * Generates downloadable JSON containing all allowlist proofs.
 */
export function exportAllowlistJSON(merkleResult: MerkleTreeResult, eventId?: number | string): string {
  return JSON.stringify(
    {
      eventId: eventId ? Number(eventId) : undefined,
      root: merkleResult.root,
      totalEntries: merkleResult.entries.length,
      generatedAt: new Date().toISOString(),
      entries: merkleResult.entries.map((e) => ({
        address: e.address,
        proof: e.proof,
      })),
    },
    null,
    2
  );
}

/**
 * Generates downloadable CSV containing address and serialized proof.
 */
export function exportAllowlistCSV(merkleResult: MerkleTreeResult): string {
  const header = "address,proof\n";
  const rows = merkleResult.entries.map((e) => `"${e.address}","${JSON.stringify(e.proof)}"`).join("\n");
  return header + rows;
}
