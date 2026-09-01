import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { injected, coinbaseWallet, walletConnect } from "wagmi/connectors";
import sdk from "@farcaster/frame-sdk";

export function farcasterFrameConnector() {
  return injected({
    target() {
      return {
        id: "farcaster",
        name: "Farcaster Wallet",
        icon: "https://warpcast.com/favicon.ico",
        provider() {
          if (typeof window !== "undefined" && (sdk as any)?.wallet?.ethProvider) {
            return (sdk as any).wallet.ethProvider;
          }
          return undefined;
        },
      };
    },
  });
}

function getWagmiConfig() {
  return createConfig({
    chains: [baseSepolia],
    connectors: [
      farcasterFrameConnector(),
      injected(),
      coinbaseWallet({ appName: "Onchain POAPs" }),
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "3fbb6bba6f1de962d911bb5b5c9dba88",
        showQrModal: true,
      }),
    ],
    transports: {
      [baseSepolia.id]: http("https://sepolia.base.org"),
    },
    ssr: true,
  });
}

declare global {
  // eslint-disable-next-line no-var
  var __wagmiConfig: ReturnType<typeof getWagmiConfig> | undefined;
}

export const wagmiConfig =
  process.env.NODE_ENV === "development"
    ? globalThis.__wagmiConfig || (globalThis.__wagmiConfig = getWagmiConfig())
    : getWagmiConfig();
