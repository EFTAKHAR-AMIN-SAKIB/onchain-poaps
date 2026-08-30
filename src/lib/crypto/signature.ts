import { encodePacked, keccak256, recoverAddress, Hex, getAddress } from "viem";

/**
 * Computes the raw 32-byte message hash:
 * keccak256(abi.encodePacked(uint256(eventId), uint256(chainId), address(recipient)))
 */
export function computeSignatureMessageHash(
  eventId: number | bigint,
  chainId: number | bigint,
  recipient: `0x${string}`
): Hex {
  const checksummedRecipient = getAddress(recipient);
  return keccak256(
    encodePacked(
      ["uint256", "uint256", "address"],
      [BigInt(eventId), BigInt(chainId), checksummedRecipient]
    )
  );
}

/**
 * Recovers the signer address from the ECDSA signature and message components.
 */
export async function recoverSignerAddress(
  eventId: number | bigint,
  chainId: number | bigint,
  recipient: `0x${string}`,
  signature: Hex
): Promise<`0x${string}`> {
  const messageHash = computeSignatureMessageHash(eventId, chainId, recipient);
  const recovered = await recoverAddress({
    hash: messageHash,
    signature,
  });
  return getAddress(recovered);
}

/**
 * Constructs a shareable claim URL containing eventId, signature, and optional recipient.
 */
export function buildClaimUrl(
  origin: string,
  eventId: number | bigint,
  signature: Hex,
  recipient?: `0x${string}`
): string {
  const url = new URL(`/poap/${eventId}`, origin);
  url.searchParams.set("sig", signature);
  if (recipient) {
    url.searchParams.set("recipient", getAddress(recipient));
  }
  return url.toString();
}

/**
 * Extracts signature parameters from URL search query.
 */
export function extractClaimParams(searchParams: URLSearchParams): {
  signature: Hex | null;
  recipient: `0x${string}` | null;
} {
  const sigParam = searchParams.get("sig") || searchParams.get("signature");
  const recipientParam = searchParams.get("recipient") || searchParams.get("address");

  let signature: Hex | null = null;
  if (sigParam && sigParam.startsWith("0x") && (sigParam.length === 132 || sigParam.length === 130)) {
    signature = sigParam as Hex;
  }

  let recipient: `0x${string}` | null = null;
  if (recipientParam && recipientParam.startsWith("0x") && recipientParam.length === 42) {
    try {
      recipient = getAddress(recipientParam);
    } catch {
      recipient = null;
    }
  }

  return { signature, recipient };
}
