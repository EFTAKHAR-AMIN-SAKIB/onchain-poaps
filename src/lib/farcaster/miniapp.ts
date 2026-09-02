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
 * Checks synchronously whether the app is executing inside a Farcaster environment
 * (React Native WebView in mobile Warpcast, or parent iframe in web Warpcast).
 */
export function isInsideFarcasterClient(): boolean {
  if (typeof window === "undefined") return false;
  return (
    Boolean((window as any).ReactNativeWebView) ||
    (window.parent !== window && window.parent !== undefined)
  );
}

/**
 * Initializes the Farcaster Mini App SDK and signals that the app is ready.
 */
export async function initFarcasterMiniApp(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!isInsideFarcasterClient()) return false;

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
 * Returns true if running inside Farcaster frame context.
 */
export async function isFarcasterFrame(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!isInsideFarcasterClient()) return false;

  try {
    const ctx = await sdk.context;
    return Boolean(ctx);
  } catch {
    return false;
  }
}

/**
 * Returns Farcaster user context if available.
 */
export async function getFarcasterContext() {
  if (typeof window === "undefined") return null;
  if (!isInsideFarcasterClient()) return null;

  try {
    return await sdk.context;
  } catch {
    return null;
  }
}

/**
 * Opens a URL safely inside Farcaster client or standard browser tab.
 */
export function openExternalUrl(url: string) {
  if (typeof window === "undefined") return;

  if (isInsideFarcasterClient()) {
    try {
      if (typeof sdk?.actions?.openUrl === "function") {
        sdk.actions.openUrl(url);
        return;
      }
    } catch (err) {
      console.debug("sdk.actions.openUrl failed, falling back to window.open:", err);
    }
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * Composes a new cast with prepopulated text and embed URL.
 * Works natively inside Farcaster Mini Apps (via sdk.actions.composeCast)
 * and directly opens Warpcast composer in browser with zero popup blocker delays.
 */
export function composeFarcasterCast(text: string, embedUrl?: string) {
  if (typeof window === "undefined") return;

  // Sanitize embedUrl if localhost
  let finalEmbed = embedUrl;
  if (finalEmbed && (finalEmbed.includes("localhost") || finalEmbed.includes("127.0.0.1"))) {
    finalEmbed = finalEmbed.replace(
      /https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/,
      "https://onchain-poaps-ebon.vercel.app"
    );
  }

  // 1. If inside native Farcaster client, use native composeCast action
  if (isInsideFarcasterClient()) {
    try {
      if (typeof sdk?.actions?.composeCast === "function") {
        sdk.actions.composeCast({
          text,
          embeds: finalEmbed ? [finalEmbed] : undefined,
        });
        return;
      }
    } catch (err) {
      console.debug("sdk.actions.composeCast failed, falling back to URL:", err);
    }
  }

  // 2. Prepare Warpcast intent URL
  const params = new URLSearchParams();
  params.set("text", text);
  if (finalEmbed) {
    params.set("embeds[]", finalEmbed);
  }
  const warpcastUrl = `https://warpcast.com/~/compose?${params.toString()}`;

  // 3. If in Farcaster frame, use openUrl
  if (isInsideFarcasterClient()) {
    try {
      if (typeof sdk?.actions?.openUrl === "function") {
        sdk.actions.openUrl(warpcastUrl);
        return;
      }
    } catch {}
  }

  // 4. Synchronous browser tab opening (bypasses browser popup blockers)
  window.open(warpcastUrl, "_blank", "noopener,noreferrer");
}
