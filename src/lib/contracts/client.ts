import { createPublicClient, http, Hex, getAddress } from "viem";
import { baseSepolia } from "viem/chains";
import { ONCHAIN_POAPS_ADDRESS } from "./address";
import { ONCHAIN_POAPS_ABI } from "./abi";

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL || "https://sepolia.base.org"),
});

export interface PoapEventData {
  eventId: number;
  name: string;
  description: string;
  eventDate: number;
  location: string;
  allowlistRoot: Hex;
  svgImagePointer: string;
  creator: string;
  createdAt: number;
  externalUrl: string;
  isSoulbound: boolean;
  isPublic: boolean;
  rawSvg?: string;
  totalSupply: number;
  multichainId: string; // CAIP-2 eip155:84532:...
}

export interface PoapMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: Array<{ trait_type: string; value: string | number | boolean }>;
}

/**
 * Safely decodes a Base64 string to a UTF-8 string across both browser and Node.js
 */
function decodeBase64Utf8(base64Str: string): string {
  try {
    const cleanBase64 = base64Str.trim().replace(/\s/g, "");
    if (typeof window !== "undefined") {
      const binary = atob(cleanBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder("utf-8").decode(bytes);
    } else {
      return Buffer.from(cleanBase64, "base64").toString("utf-8");
    }
  } catch {
    try {
      return typeof window !== "undefined"
        ? atob(base64Str)
        : Buffer.from(base64Str, "base64").toString("utf-8");
    } catch {
      return "";
    }
  }
}

/**
 * Robust JSON parser that handles raw unescaped control characters in JSON strings.
 */
function safeJsonParse<T>(rawString: string): T | null {
  if (!rawString) return null;
  try {
    return JSON.parse(rawString);
  } catch {
    try {
      // Sanitize raw unescaped newlines, tabs, and control characters (ASCII 0x00-0x1F)
      const sanitized = rawString.replace(/[\u0000-\u001F]+/g, (match) => {
        if (match === "\n") return "\\n";
        if (match === "\r") return "\\r";
        if (match === "\t") return "\\t";
        return " ";
      });
      return JSON.parse(sanitized);
    } catch (err) {
      console.warn("safeJsonParse failed to parse JSON:", err);
      return null;
    }
  }
}

/**
 * Reads total number of registered POAP events from the smart contract.
 */
export async function getTotalEvents(): Promise<number> {
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
 * Decodes the onchain JSON metadata returned by uri(eventId).
 */
export function decodeMetadataUri(uriString: string): {
  metadata: PoapMetadata | null;
  svgString: string | null;
} {
  try {
    if (!uriString) return { metadata: null, svgString: null };

    let jsonText = "";

    if (uriString.startsWith("data:application/json;base64,")) {
      const base64Json = uriString.replace(/^data:application\/json;base64,/, "");
      jsonText = decodeBase64Utf8(base64Json);
    } else if (uriString.startsWith("data:application/json;utf8,")) {
      jsonText = decodeURIComponent(uriString.replace(/^data:application\/json;utf8,/, ""));
    } else if (uriString.startsWith("data:application/json,")) {
      jsonText = decodeURIComponent(uriString.replace(/^data:application\/json,/, ""));
    } else if (uriString.trim().startsWith("{")) {
      jsonText = uriString;
    } else {
      // Attempt base64 decode directly
      jsonText = decodeBase64Utf8(uriString);
    }

    const metadata = safeJsonParse<PoapMetadata>(jsonText);
    let svgString: string | null = null;

    if (metadata && metadata.image) {
      if (metadata.image.startsWith("data:image/svg+xml;base64,")) {
        const base64Svg = metadata.image.replace(/^data:image\/svg\+xml;base64,/, "");
        svgString = decodeBase64Utf8(base64Svg);
      } else if (metadata.image.startsWith("data:image/svg+xml;utf8,")) {
        svgString = decodeURIComponent(metadata.image.replace(/^data:image\/svg\+xml;utf8,/, ""));
      } else if (metadata.image.startsWith("data:image/svg+xml,")) {
        svgString = decodeURIComponent(metadata.image.replace(/^data:image\/svg\+xml,/, ""));
      } else if (metadata.image.trim().startsWith("<svg")) {
        svgString = metadata.image;
      }
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
export async function checkHasClaimed(eventId: number, userAddress: string): Promise<boolean> {
  try {
    const claimed = await publicClient.readContract({
      address: ONCHAIN_POAPS_ADDRESS,
      abi: ONCHAIN_POAPS_ABI,
      functionName: "hasClaimed",
      args: [BigInt(eventId), userAddress as Hex],
    });
    return Boolean(claimed);
  } catch (err) {
    console.error("Error checking hasClaimed:", err);
    return false;
  }
}

/**
 * Checks if public mint is active (within 30-day window).
 */
export async function checkIsPublicMintActive(eventId: number): Promise<boolean> {
  try {
    const active = await publicClient.readContract({
      address: ONCHAIN_POAPS_ADDRESS,
      abi: ONCHAIN_POAPS_ABI,
      functionName: "isPublicMintActive",
      args: [BigInt(eventId)],
    });
    return Boolean(active);
  } catch (err) {
    console.error("Error checking isPublicMintActive:", err);
    return false;
  }
}

/**
 * Checks if signature mint is active (within 37-day window).
 */
export async function checkIsSignatureMintActive(eventId: number): Promise<boolean> {
  try {
    const active = await publicClient.readContract({
      address: ONCHAIN_POAPS_ADDRESS,
      abi: ONCHAIN_POAPS_ABI,
      functionName: "isSignatureMintActive",
      args: [BigInt(eventId)],
    });
    return Boolean(active);
  } catch (err) {
    console.error("Error checking isSignatureMintActive:", err);
    return false;
  }
}
