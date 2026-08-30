/**
 * Translates smart contract custom errors, RPC errors, and wallet exceptions
 * into clear, actionable human explanations.
 */
export function parseContractError(error: unknown): string {
  if (!error) return "An unknown error occurred.";

  const errorString = typeof error === "object" ? JSON.stringify(error) : String(error);
  const errorMessage = error instanceof Error ? error.message : errorString;

  // Custom Contract Reverts
  if (
    errorMessage.includes("POAP__AlreadyClaimed") ||
    errorString.includes("POAP__AlreadyClaimed") ||
    errorMessage.includes("0x6a2c2b3e")
  ) {
    return "This wallet has already claimed this POAP. Each wallet is strictly limited to 1 claim per event.";
  }

  if (
    errorMessage.includes("POAP__EventNotPublic") ||
    errorString.includes("POAP__EventNotPublic")
  ) {
    return "Public mint is currently closed for this event. You may need an allowlist spot or creator signature.";
  }

  if (
    errorMessage.includes("POAP__AllowlistNotEnabled") ||
    errorString.includes("POAP__AllowlistNotEnabled")
  ) {
    return "Allowlist minting is not enabled for this event (no allowlist root set).";
  }

  if (
    errorMessage.includes("POAP__OnlyCreator") ||
    errorString.includes("POAP__OnlyCreator")
  ) {
    return "Only the original event creator has permission to perform this management action.";
  }

  if (
    errorMessage.includes("POAP__TimeLockExpired") ||
    errorString.includes("POAP__TimeLockExpired")
  ) {
    return "The creator control timelock (30 days) or signature claim window (37 days) has expired.";
  }

  if (
    errorMessage.includes("POAP__RootAlreadySet") ||
    errorString.includes("POAP__RootAlreadySet")
  ) {
    return "The allowlist Merkle root has already been set once. Contract rules prevent modifying it again.";
  }

  if (
    errorMessage.includes("POAP__SoulboundNotTransferable") ||
    errorString.includes("POAP__SoulboundNotTransferable")
  ) {
    return "This POAP is Soulbound (non-transferable). It is permanently bound to the minted wallet.";
  }

  if (
    errorMessage.includes("POAP__InvalidValue") ||
    errorString.includes("POAP__InvalidValue")
  ) {
    if (errorMessage.includes("proof") || errorString.includes("proof")) {
      return "Invalid allowlist proof: your connected wallet address is not in the allowlist for this event.";
    }
    if (errorMessage.includes("signer") || errorString.includes("signer")) {
      return "Invalid signature: the claim pass was not signed by the event creator or was signed for a different address/chain.";
    }
    if (errorMessage.includes("recipients") || errorString.includes("recipients")) {
      return "Recipient list exceeds the maximum batch limit of 101 addresses.";
    }
    if (errorMessage.includes("name") || errorString.includes("name")) {
      return "Event name must be between 1 and 128 characters.";
    }
    if (errorMessage.includes("svg") || errorString.includes("svg")) {
      return "Valid SVG artwork string is required.";
    }
    return "Contract validation failed: one of the input parameters is invalid.";
  }

  // Wallet and RPC errors
  if (
    errorMessage.includes("User rejected") ||
    errorMessage.includes("User denied") ||
    errorMessage.includes("user rejected action")
  ) {
    return "Transaction was cancelled in your wallet.";
  }

  if (
    errorMessage.includes("insufficient funds") ||
    errorMessage.includes("exceeds the balance")
  ) {
    return "Insufficient Base Sepolia ETH to cover network gas fees. You can get free testnet ETH from a Base Sepolia faucet.";
  }

  if (errorMessage.includes("ChainMismatchError") || errorMessage.includes("wrong network")) {
    return "Please switch your wallet network to Base Sepolia (Chain ID: 84532).";
  }

  return errorMessage.length > 200 ? errorMessage.slice(0, 200) + "..." : errorMessage;
}
