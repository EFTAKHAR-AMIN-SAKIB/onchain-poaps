"use client";

import React, { useEffect, useState } from "react";
import { WagmiProvider, useAccount, useConnect } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/contracts/wagmi";
import { initFarcasterMiniApp, isFarcasterFrame } from "@/lib/farcaster/miniapp";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30, // 30 seconds
    },
  },
});

function FarcasterAutoConnect() {
  const { isConnected } = useAccount();
  const { connectors, connect } = useConnect();

  useEffect(() => {
    async function attemptAutoConnect() {
      if (isConnected || typeof window === "undefined") return;
      const inFrame = await isFarcasterFrame();
      if (inFrame) {
        const fcConn = connectors.find(
          (c) => c.id === "farcaster" || c.name.toLowerCase().includes("farcaster")
        );
        if (fcConn) {
          try {
            connect({ connector: fcConn });
          } catch (e) {
            console.debug("Farcaster auto-connect check:", e);
          }
        }
      }
    }
    attemptAutoConnect();
  }, [isConnected, connectors, connect]);

  return null;
}

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initFarcasterMiniApp();
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FarcasterAutoConnect />
        {mounted ? children : <div className="min-h-screen bg-[#0a0b0d] text-white opacity-0" />}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
