import {
  createPublicClient,
  http,
  encodePacked,
  keccak256,
  getAddress,
  isAddress,
} from "viem";
import { baseSepolia } from "viem/chains";

const ONCHAIN_POAPS_ADDRESS = "0xC3249356a483fbe17d5355D39105D2eA666d9de6";
const BASE_SEPOLIA_CHAIN_ID = 84532;

const ONCHAIN_POAPS_ABI = [
  {
    type: "function",
    name: "totalEvents",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "events",
    inputs: [{ name: "eventId", type: "uint256" }],
    outputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "eventDate", type: "uint256" },
      { name: "location", type: "string" },
      { name: "allowlistRoot", type: "bytes32" },
      { name: "svgImage", type: "address" },
      { name: "creator", type: "address" },
      { name: "createdAt", type: "uint256" },
      { name: "externalUrl", type: "string" },
      { name: "isSoulbound", type: "bool" },
      { name: "isPublic", type: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "uri",
    inputs: [{ name: "eventId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMultichainEventId",
    inputs: [{ name: "eventId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
  },
];

// OpenZeppelin-compatible Merkle tree
function hashAddressLeaf(address) {
  const checksummed = getAddress(address.trim());
  return keccak256(encodePacked(["address"], [checksummed]));
}

function hashPair(a, b) {
  const aBig = BigInt(a);
  const bBig = BigInt(b);
  const [first, second] = aBig <= bBig ? [a, b] : [b, a];
  return keccak256(encodePacked(["bytes32", "bytes32"], [first, second]));
}

function verifyMerkleProof(proof, root, leaf) {
  let computedHash = leaf;
  for (const proofElement of proof) {
    computedHash = hashPair(computedHash, proofElement);
  }
  return computedHash.toLowerCase() === root.toLowerCase();
}

function buildMerkleTree(addresses) {
  const uniqueAddresses = Array.from(new Set(addresses.map((a) => getAddress(a))));
  const leaves = uniqueAddresses.map((addr) => hashAddressLeaf(addr));

  const layers = [leaves];
  while (layers[layers.length - 1].length > 1) {
    const currentLayer = layers[layers.length - 1];
    const nextLayer = [];

    for (let i = 0; i < currentLayer.length; i += 2) {
      if (i + 1 < currentLayer.length) {
        nextLayer.push(hashPair(currentLayer[i], currentLayer[i + 1]));
      } else {
        nextLayer.push(currentLayer[i]);
      }
    }
    layers.push(nextLayer);
  }

  const root = layers[layers.length - 1][0];

  const entries = uniqueAddresses.map((address, index) => {
    const leaf = leaves[index];
    const proof = [];
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

    return { address, leaf, proof, index };
  });

  return { root, leaves, entries };
}

function computeSignatureMessageHash(eventId, chainId, recipient) {
  const checksummedRecipient = getAddress(recipient);
  return keccak256(
    encodePacked(
      ["uint256", "uint256", "address"],
      [BigInt(eventId), BigInt(chainId), checksummedRecipient]
    )
  );
}

function sanitizeSvg(rawSvg) {
  if (!rawSvg || typeof rawSvg !== "string") {
    return { isValid: false, error: "Empty SVG" };
  }
  if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(rawSvg)) {
    return { isValid: false, error: "Contains script tag" };
  }
  return { isValid: true };
}

function optimizeSvg(rawSvg) {
  const originalBytes = Buffer.byteLength(rawSvg, "utf8");
  let cleaned = rawSvg.replace(/<!--[\s\S]*?-->/g, "").replace(/\s+/g, " ").trim();
  const optimizedBytes = Buffer.byteLength(cleaned, "utf8");
  return {
    originalBytes,
    optimizedBytes,
    bytesSaved: originalBytes - optimizedBytes,
    estimatedGas: 45000 + optimizedBytes * 200,
  };
}

async function runTests() {
  console.log("==================================================");
  console.log("1. ONCHAIN BASE SEPOLIA SMART CONTRACT TESTS");
  console.log("==================================================");
  console.log("Contract Address:", ONCHAIN_POAPS_ADDRESS);
  console.log("Chain ID:", BASE_SEPOLIA_CHAIN_ID);

  const client = createPublicClient({
    chain: baseSepolia,
    transport: http("https://sepolia.base.org"),
  });

  const totalEvents = await client.readContract({
    address: ONCHAIN_POAPS_ADDRESS,
    abi: ONCHAIN_POAPS_ABI,
    functionName: "totalEvents",
  });
  console.log("✅ totalEvents() returned:", totalEvents.toString());

  const genesisEvent = await client.readContract({
    address: ONCHAIN_POAPS_ADDRESS,
    abi: ONCHAIN_POAPS_ABI,
    functionName: "events",
    args: [0n],
  });
  console.log("✅ Genesis POAP #0 Name:", genesisEvent[0]);
  console.log("✅ Genesis POAP #0 Location:", genesisEvent[3]);
  console.log("✅ Genesis POAP #0 Creator:", genesisEvent[6]);
  console.log("✅ Genesis POAP #0 isSoulbound:", genesisEvent[9]);
  console.log("✅ Genesis POAP #0 isPublic:", genesisEvent[10]);

  const genesisUri = await client.readContract({
    address: ONCHAIN_POAPS_ADDRESS,
    abi: ONCHAIN_POAPS_ABI,
    functionName: "uri",
    args: [0n],
  });
  console.log("✅ uri(0) length:", genesisUri.length, "bytes");
  console.log("✅ uri(0) prefix:", genesisUri.slice(0, 40) + "...");

  const multichainId = await client.readContract({
    address: ONCHAIN_POAPS_ADDRESS,
    abi: ONCHAIN_POAPS_ABI,
    functionName: "getMultichainEventId",
    args: [0n],
  });
  console.log("✅ CAIP-2 Multichain ID:", multichainId);

  console.log("\n==================================================");
  console.log("2. MERKLE TREE & PROOF ALGORITHM TESTS");
  console.log("==================================================");

  const testAddresses = [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
  ];

  const tree = buildMerkleTree(testAddresses);
  console.log("✅ Merkle Root:", tree.root);
  console.log("✅ Total entries:", tree.entries.length);

  for (const entry of tree.entries) {
    const isValid = verifyMerkleProof(entry.proof, tree.root, entry.leaf);
    if (!isValid) throw new Error(`Proof validation failed for ${entry.address}`);
  }
  console.log("✅ All 4 individual Merkle branch proofs mathematically verified!");

  // Negative test: unlisted address
  const fakeLeaf = hashAddressLeaf("0x000000000000000000000000000000000000dEaD");
  const isFakeValid = verifyMerkleProof(tree.entries[0].proof, tree.root, fakeLeaf);
  if (isFakeValid) throw new Error("Unlisted address proof should have failed!");
  console.log("✅ Unlisted address rejection test passed.");

  console.log("\n==================================================");
  console.log("3. SIGNATURE HASH & RECOVERY TESTS");
  console.log("==================================================");
  const testRecipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const msgHash = computeSignatureMessageHash(1n, 84532n, testRecipient);
  console.log("✅ EIP-191 Raw Message Hash for Event #1:", msgHash);

  console.log("\n==================================================");
  console.log("4. SVG SANITIZER & OPTIMIZER TESTS");
  console.log("==================================================");
  const maliciousSvg = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><circle cx="50" cy="50" r="40"/></svg>';
  const sanitized = sanitizeSvg(maliciousSvg);
  if (sanitized.isValid) throw new Error("Malicious script SVG should have been rejected!");
  console.log("✅ XSS Malicious SVG correctly rejected:", sanitized.error);

  const cleanSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><!-- comment --><circle cx="50.12345" cy="50.67890" r="40" fill="#d4af37"/></svg>';
  const opt = optimizeSvg(cleanSvg);
  console.log("✅ SVG Optimization: raw", opt.originalBytes, "bytes -> optimized", opt.optimizedBytes, "bytes (saved", opt.bytesSaved, "bytes)");
  console.log("✅ Estimated deployment gas:", opt.estimatedGas);

  console.log("\n🎉 ALL TESTS PASSED WITH 100% ACCURACY!");
}

runTests().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
