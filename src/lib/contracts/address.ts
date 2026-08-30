export const ONCHAIN_POAPS_ADDRESS = "0xC3249356a483fbe17d5355D39105D2eA666d9de6" as const;

export const BASE_SEPOLIA_CHAIN_ID = 84532;

export const BASE_SEPOLIA_RPC_URLS = [
  "https://sepolia.base.org",
  "https://base-sepolia-rpc.publicnode.com",
  "https://base-sepolia.gateway.tenderly.co",
] as const;

export const BASE_SEPOLIA_EXPLORER = "https://sepolia.basescan.org" as const;

export const CONTRACT_CREATOR_TIMELOCK_SECONDS = 30 * 24 * 60 * 60; // 30 days
export const SIGNATURE_VALIDITY_WINDOW_SECONDS = 37 * 24 * 60 * 60; // 37 days (30 days + 7 days grace)
export const MAX_CREATOR_MINT_BATCH_SIZE = 101;
