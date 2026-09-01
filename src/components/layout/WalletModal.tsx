"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { baseSepolia } from "viem/chains";
import {
  MetaMaskIcon,
  CoinbaseWalletIcon,
  RainbowIcon,
  WalletConnectIcon,
  BrowserWalletIcon,
  FarcasterWalletIcon,
} from "@/components/brand/WalletIcons";
import { formatAddress, copyToClipboard } from "@/lib/utils/formatting";
import { BASE_SEPOLIA_EXPLORER } from "@/lib/contracts/address";
import { isFarcasterFrame } from "@/lib/farcaster/miniapp";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  LogOut,
  Loader2,
  AlertCircle,
} from "lucide-react";

export interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WalletItemConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  downloadUrl?: string;
  match: (connectorName: string, connectorId?: string) => boolean;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pendingWalletId, setPendingWalletId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const [isInFrame, setIsInFrame] = useState(false);

  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    setMounted(true);
    async function checkFrame() {
      const inFrame = await isFarcasterFrame();
      setIsInFrame(inFrame);
    }
    checkFrame();
  }, []);

  // Close on Escape key & lock body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setErrorMessage(null);
      setInstallPrompt(null);
      setPendingWalletId(null);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset pending state when connect settles
  useEffect(() => {
    if (!isPending) {
      setPendingWalletId(null);
    }
  }, [isPending]);

  // Automatically close on successful connection
  useEffect(() => {
    if (isConnected && pendingWalletId) {
      const timer = setTimeout(() => {
        onClose();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isConnected, pendingWalletId, onClose]);

  if (!isOpen || !mounted) return null;

  const handleCopyAddress = async () => {
    if (!address) return;
    const ok = await copyToClipboard(address);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Recommended Wallets matching the reference design exactly
  const RECOMMENDED_WALLETS: WalletItemConfig[] = [
    ...(isInFrame
      ? [
          {
            id: "farcaster",
            name: "Farcaster Wallet",
            icon: <FarcasterWalletIcon size={38} />,
            match: (name: string, id?: string) => {
              const lower = name.toLowerCase();
              const lowerId = (id || "").toLowerCase();
              return lower.includes("farcaster") || lowerId.includes("farcaster");
            },
          },
        ]
      : []),
    {
      id: "metamask",
      name: "MetaMask",
      icon: <MetaMaskIcon size={38} />,
      downloadUrl: "https://metamask.io/download/",
      match: (name, id) => {
        const lower = name.toLowerCase();
        const lowerId = (id || "").toLowerCase();
        return (
          lower.includes("metamask") ||
          lowerId.includes("metamask") ||
          lowerId === "io.metamask"
        );
      },
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      icon: <CoinbaseWalletIcon size={38} />,
      downloadUrl: "https://www.coinbase.com/wallet",
      match: (name, id) => {
        const lower = name.toLowerCase();
        const lowerId = (id || "").toLowerCase();
        return (
          lower.includes("coinbase") ||
          lowerId.includes("coinbase") ||
          lowerId === "com.coinbase.wallet"
        );
      },
    },
    {
      id: "rainbow",
      name: "Rainbow",
      icon: <RainbowIcon size={38} />,
      downloadUrl: "https://rainbow.me/",
      match: (name, id) => {
        const lower = name.toLowerCase();
        const lowerId = (id || "").toLowerCase();
        return (
          lower.includes("rainbow") ||
          lowerId.includes("rainbow") ||
          lowerId === "me.rainbow"
        );
      },
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      icon: <WalletConnectIcon size={38} />,
      match: (name, id) => {
        const lower = name.toLowerCase();
        const lowerId = (id || "").toLowerCase();
        return (
          lower.includes("walletconnect") ||
          lowerId.includes("walletconnect") ||
          lowerId === "walletconnect"
        );
      },
    },
    {
      id: "injected",
      name: "Browser Wallet",
      icon: <BrowserWalletIcon size={38} />,
      match: (name, id) => {
        const lower = name.toLowerCase();
        const lowerId = (id || "").toLowerCase();
        return (
          lower.includes("injected") ||
          lower.includes("browser") ||
          lowerId === "injected"
        );
      },
    },
  ];

  const handleWalletSelect = (wallet: WalletItemConfig) => {
    setErrorMessage(null);
    setInstallPrompt(null);
    setPendingWalletId(wallet.id);

    // 1. Try finding an exact matching connector
    let targetConnector = connectors.find((c) =>
      wallet.match(c.name, c.id)
    );

    // 2. Specific fallbacks
    if (!targetConnector) {
      if (wallet.id === "farcaster") {
        const fcConn = connectors.find(
          (c) => c.id === "farcaster" || c.name.toLowerCase().includes("farcaster")
        );
        if (fcConn) targetConnector = fcConn;
      } else if (wallet.id === "metamask") {
        const isMobile =
          typeof navigator !== "undefined" &&
          /android|iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
        const hasMetaMask =
          typeof window !== "undefined" && (window as any).ethereum?.isMetaMask;

        if (isMobile && !hasMetaMask) {
          const host = window.location.host;
          const path = window.location.pathname;
          window.location.href = `https://metamask.app.link/dapp/${host}${path}`;
          return;
        }

        // Look for injected connector if user has MetaMask extension
        const injectedConn = connectors.find((c) =>
          c.name.toLowerCase().includes("injected") || c.id === "injected"
        );
        if (typeof window !== "undefined" && hasMetaMask && injectedConn) {
          targetConnector = injectedConn;
        } else if (injectedConn) {
          targetConnector = injectedConn;
        } else if (wallet.downloadUrl) {
          setPendingWalletId(null);
          setInstallPrompt({ name: wallet.name, url: wallet.downloadUrl });
          return;
        }
      } else if (wallet.id === "rainbow") {
        const injectedConn = connectors.find((c) =>
          c.name.toLowerCase().includes("injected") || c.id === "injected"
        );
        if (typeof window !== "undefined" && (window as any).ethereum?.isRainbow && injectedConn) {
          targetConnector = injectedConn;
        } else {
          // Rainbow can connect via WalletConnect
          const wcConn = connectors.find((c) =>
            c.name.toLowerCase().includes("walletconnect") || c.id.includes("walletconnect")
          );
          if (wcConn) {
            targetConnector = wcConn;
          } else if (wallet.downloadUrl) {
            setPendingWalletId(null);
            setInstallPrompt({ name: wallet.name, url: wallet.downloadUrl });
            return;
          }
        }
      } else if (wallet.id === "injected") {
        // Fallback to any injected provider
        targetConnector = connectors.find(
          (c) => c.name.toLowerCase().includes("injected") || c.id === "injected"
        );
      }
    }

    if (targetConnector) {
      try {
        connect(
          { connector: targetConnector },
          {
            onError: (err) => {
              console.warn("Wallet connection error:", err);
              setPendingWalletId(null);
              if (
                err.message.includes("rejected") ||
                err.message.includes("User rejected") ||
                err.message.includes("denied")
              ) {
                setErrorMessage("Connection request was cancelled in your wallet.");
              } else if (wallet.downloadUrl && (err.message.toLowerCase().includes("not found") || (err as any)?.name?.includes("NotFound"))) {
                setInstallPrompt({ name: wallet.name, url: wallet.downloadUrl });
              } else {
                setErrorMessage(err.message || "Failed to connect. Please try again.");
              }
            },
          }
        );
      } catch (err: any) {
        setPendingWalletId(null);
        setErrorMessage(err?.message || "Failed to initiate wallet connection.");
      }
    } else if (wallet.downloadUrl) {
      setPendingWalletId(null);
      setInstallPrompt({ name: wallet.name, url: wallet.downloadUrl });
    } else {
      setPendingWalletId(null);
      setErrorMessage(`${wallet.name} is not detected in your browser.`);
    }
  };

  const isWrongNetwork = isConnected && chainId !== baseSepolia.id;

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[380px] bg-[#18191b] border border-[#2e3038] rounded-[24px] shadow-2xl shadow-black/80 transition-all z-10 text-white my-auto animate-scale-in overflow-hidden p-6">
        {/* Header */}
        <div className="relative flex items-center justify-center mb-5">
          <h3 className="font-bold text-[17px] sm:text-[18px] text-white tracking-tight text-center">
            {isConnected ? "Connected Account" : "Connect a Wallet"}
          </h3>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#2a2b30] hover:bg-[#383a42] text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isConnected && address ? (
          /* ================= Connected State View ================= */
          <div className="space-y-4 text-left">
            {/* Identity Card */}
            <div className="p-4 rounded-2xl bg-[#121316] border border-[#2a2c34] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold uppercase text-neutral-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Wallet
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 text-[10px] font-mono font-semibold border border-emerald-800/60">
                  Base Sepolia (84532)
                </span>
              </div>

              {/* Formatted Address Box */}
              <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-[#1c1d22] border border-[#2e3038]">
                <span className="font-mono text-sm font-bold text-white tracking-wide">
                  {formatAddress(address)}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="p-1.5 rounded-lg bg-[#282a32] hover:bg-[#343640] text-neutral-300 hover:text-white transition-colors shrink-0 flex items-center gap-1 text-xs"
                  title="Copy full address"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[11px] text-emerald-400 font-mono">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px] text-neutral-400 font-mono">Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Full checksum address preview */}
              <p className="text-[11px] text-neutral-500 font-mono break-all px-1">
                {address}
              </p>
            </div>

            {/* Wrong Network Notification */}
            {isWrongNetwork && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-2">
                <span>Wrong network detected.</span>
                <button
                  onClick={() => switchChain({ chainId: baseSepolia.id })}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-colors"
                >
                  Switch Chain
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <a
                href={`${BASE_SEPOLIA_EXPLORER}/address/${address}`}
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <button className="w-full py-2.5 rounded-xl border border-[#2e3038] bg-[#22242a] hover:bg-[#2b2d35] text-xs font-semibold text-neutral-200 transition-colors flex items-center justify-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>BaseScan</span>
                </button>
              </a>

              <button
                onClick={() => {
                  disconnect();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl border border-rose-900/50 bg-rose-950/30 hover:bg-rose-950/60 text-xs font-semibold text-rose-400 transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        ) : (
          /* ================= Connect Options View ================= */
          <div className="text-left">
            {/* Inline Error or Installation Feedback Banner */}
            {errorMessage && (
              <div className="mb-3 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div className="flex-1 text-[12px] leading-relaxed">{errorMessage}</div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-neutral-400 hover:text-white shrink-0 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {installPrompt && (
              <div className="mb-3 p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 text-blue-300 text-xs flex items-start justify-between gap-2 animate-fade-in">
                <div>
                  <div className="font-semibold text-white">
                    {installPrompt.name} not detected
                  </div>
                  <a
                    href={installPrompt.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-blue-400 hover:text-blue-300 font-medium inline-block mt-0.5"
                  >
                    Click here to install {installPrompt.name} &rarr;
                  </a>
                </div>
                <button
                  onClick={() => setInstallPrompt(null)}
                  className="text-neutral-400 hover:text-white shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* "Recommended" Section Label */}
            <div className="text-xs font-semibold text-neutral-400 mb-2 px-1 tracking-wide">
              Recommended
            </div>

            {/* List of 5 Wallets matching Reference Screenshot */}
            <div className="space-y-1.5">
              {RECOMMENDED_WALLETS.map((wallet) => {
                const isConnectingThis = pendingWalletId === wallet.id && isPending;

                return (
                  <button
                    key={wallet.id}
                    disabled={isPending}
                    onClick={() => handleWalletSelect(wallet)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.08] active:scale-[0.98] transition-all group cursor-pointer text-left disabled:opacity-60"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Squircle Branded Icon */}
                      <div className="shrink-0">{wallet.icon}</div>

                      {/* Wallet Name */}
                      <span className="font-semibold text-[15px] text-white group-hover:text-white transition-colors">
                        {wallet.name}
                      </span>
                    </div>

                    {/* Pending state spinner */}
                    {isConnectingThis && (
                      <Loader2 className="w-4 h-4 text-blue-400 animate-spin mr-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Subtle Divider Line */}
            <div className="border-t border-[#262830] mt-5 pt-4 flex items-center justify-between px-1">
              <span className="text-[13px] text-neutral-400 font-medium">
                New to Ethereum wallets?
              </span>
              <a
                href="https://ethereum.org/en/wallets/"
                target="_blank"
                rel="noreferrer"
                className="text-[13px] font-semibold text-[#3b82f6] hover:text-[#60a5fa] transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
