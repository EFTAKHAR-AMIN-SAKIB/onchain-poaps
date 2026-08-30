import {
  createPublicClient,
  http,
  fallback,
  decodeEventLog,
  getAddress,
  Hex,
} from "viem";
import { baseSepolia } from "viem/chains";
import { ONCHAIN_POAPS_ADDRESS, BASE_SEPOLIA_RPC_URLS } from "./address";
import { ONCHAIN_POAPS_ABI } from "./abi";

export interface PoapEventData {
  eventId: number;
  name: string;
  description: string;
  eventDate: number;
  location: string;
  allowlistRoot: Hex;
  svgImagePointer: string;
  creator: `0x${string}`;
  createdAt: number;
  externalUrl: string;
  isSoulbound: boolean;
  isPublic: boolean;
  rawSvg?: string;
  totalSupply?: number;
  multichainId?: string;
}

export interface PoapMetadata {
  name: string;
  description: string;
  image: string; // data:image/svg+xml;base64,...
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string;
    display_type?: string;
  }>;
}

// Create redundant fallback public client for high reliability
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: fallback(
    BASE_SEPOLIA_RPC_URLS.map((url) =>
      http(url, {
        batch: {
          batchSize: 100,
          wait: 20,
        },
      })
    )
  ),
});

/**
 * Fetches total number of registered events from contract.
 */
export async function fetchTotalEvents(): Promise<number> {
  try {
    const total = await publicClient.readContract({
      address: ONCHAIN_POAPS_ADDRESS,
      abi: ONCHAIN_POAPS_ABI,
      functionName: "totalEvents",
    });
    return Number(total);
  } catch (err) {
    console.error("Error reading totalEvents:", err);
    return 0;
  }
}

/**
 * Decodes the onchain Base64 JSON metadata returned by uri(eventId).
 */
export function decodeMetadataUri(uriString: string): { metadata: PoapMetadata | null; svgString: string | null } {
  try {
    if (!uriString) return { metadata: null, svgString: null };

    // Format is: data:application/json;base64,...
    const base64Json = uriString.replace(/^data:application\/json;base64,/, "");
    const jsonText = typeof window !== "undefined" ? atob(base64Json) : Buffer.from(base64Json, "base64").toString("utf-8");
    const metadata: PoapMetadata = JSON.parse(jsonText);

    let svgString: string | null = null;
    if (metadata.image && metadata.image.startsWith("data:image/svg+xml;base64,")) {
      const base64Svg = metadata.image.replace(/^data:image\/svg\+xml;base64,/, "");
      svgString = typeof window !== "undefined" ? atob(base64Svg) : Buffer.from(base64Svg, "base64").toString("utf-8");
    }

    return { metadata, svgString };
  } catch (err) {
    console.error("Error decoding metadata URI:", err);
    return { metadata: null, svgString: null };
  }
}

/**
 * Fetches complete event data for a given event ID directly from onchain storage.
 */
export async function fetchPoapEvent(eventId: number): Promise<PoapEventData | null> {
  try {
    const eventTuple = await publicClient.readContract({
      address: ONCHAIN_POAPS_ADDRESS,
      abi: ONCHAIN_POAPS_ABI,
      functionName: "events",
      args: [BigInt(eventId)],
    });

    const [
      name,
      description,
      eventDate,
      location,
      allowlistRoot,
      svgImage,
      creator,
      createdAt,
      externalUrl,
      isSoulbound,
      isPublic,
    ] = eventTuple;

    let rawSvg: string | undefined;
    try {
      const uriResult = await publicClient.readContract({
        address: ONCHAIN_POAPS_ADDRESS,
        abi: ONCHAIN_POAPS_ABI,
        functionName: "uri",
        args: [BigInt(eventId)],
      });
      const decoded = decodeMetadataUri(uriResult);
      if (decoded.svgString) {
        rawSvg = decoded.svgString;
      }
    } catch (e) {
      console.debug("Could not fetch URI for event:", eventId, e);
    }

    let totalSupply = 0;
    try {
      const supply = await publicClient.readContract({
        address: ONCHAIN_POAPS_ADDRESS,
        abi: ONCHAIN_POAPS_ABI,
        functionName: "totalSupply",
        args: [BigInt(eventId)],
      });
      totalSupply = Number(supply);
    } catch {
      totalSupply = 0;
    }

    return {
      eventId,
      name,
      description,
      eventDate: Number(eventDate),
      location,
      allowlistRoot: allowlistRoot as Hex,
      svgImagePointer: svgImage,
      creator: getAddress(creator),
      createdAt: Number(createdAt),
      externalUrl,
      isSoulbound,
      isPublic,
      rawSvg,
      totalSupply,
      multichainId: `eip155:${baseSepolia.id}:${ONCHAIN_POAPS_ADDRESS}:${eventId}`,
    };
  } catch (err) {
    console.error(`Failed to fetch POAP event #${eventId}:`, err);
    return null;
  }
}

/**
 * Checks if a specific address has claimed an event.
 */
export async function checkHasClaimed(eventId: number, userAddress: `0x${string}`): Promise<boolean> {
  try {
    return await publicClient.readContract({
      address: ONCHAIN_POAPS_ADDRESS,
      abi: ONCHAIN_POAPS_ABI,
      functionName: "hasClaimed",
      args: [BigInt(eventId), getAddress(userAddress)],
    });
  } catch {
    return false;
  }
}

/**
 * Checks the balance of an address for a specific POAP event ID.
 */
export async function checkBalanceOf(userAddress: `0x${string}`, eventId: number): Promise<number> {
  try {
    const balance = await publicClient.readContract({
      address: ONCHAIN_POAPS_ADDRESS,
      abi: ONCHAIN_POAPS_ABI,
      functionName: "balanceOf",
      args: [getAddress(userAddress), BigInt(eventId)],
    });
    return Number(balance);
  } catch {
    return 0;
  }
}
