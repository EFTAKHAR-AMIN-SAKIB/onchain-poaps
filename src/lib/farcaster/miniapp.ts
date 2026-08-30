import sdk from "@farcaster/frame-sdk";

export interface FarcasterUserContext {
  fid?: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  location?: {
    placeId: string;
    description: string;
  };
}

/**
 * Initializes the Farcaster Mini App SDK and signals that the app is ready.
 */
export async function initFarcasterMiniApp(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const isFrame = await sdk.context;
    if (isFrame) {
      await sdk.actions.ready();
      return true;
    }
    return false;
  } catch (err) {
    console.debug("Farcaster SDK init skipped outside of Mini App context:", err);
    return false;
  }
}

/**
 * Opens a URL safely inside Farcaster client or standard browser tab.
 */
export function openExternalUrl(url: string) {
  try {
    sdk.actions.openUrl(url);
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/**
 * Composes a new cast with prepopulated text and embed URL.
 */
export function composeFarcasterCast(text: string, embedUrl?: string) {
  const params = new URLSearchParams();
  params.set("text", text);
  if (embedUrl) {
    params.set("embeds[]", embedUrl);
  }
  const warpcastUrl = `https://warpcast.com/~/compose?${params.toString()}`;
  openExternalUrl(warpcastUrl);
}
