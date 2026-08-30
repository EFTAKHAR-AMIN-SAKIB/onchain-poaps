"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { baseSepolia } from "viem/chains";
import { BASE_SEPOLIA_CHAIN_ID } from "@/lib/contracts/address";
import { formatAddress, copyToClipboard } from "@/lib/utils/formatting";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { OnchainLogo } from "@/components/brand/OnchainLogo";
import {
  Wallet,
  LogOut,
  ChevronDown,
  AlertTriangle,
  ExternalLink,
  Sun,
  Moon,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Layers,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    }
  }, []);

  const toggleTheme = () => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (root.classList.contains("dark")) {
        root.classList.remove("dark");
        setIsDark(false);
      } else {
        root.classList.add("dark");
        setIsDark(true);
      }
    }
  };

  const handleCopyAddress = async () => {
    if (!address) return;
    const ok = await copyToClipboard(address);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isWrongNetwork = isConnected && chainId !== BASE_SEPOLIA_CHAIN_ID;

  const navLinks = [
    { href: "/explore", label: "Explore" },
    { href: "/create", label: "Create" },
    { href: "/gallery", label: "My POAPs" },
    { href: "/verify", label: "Verify" },
    { href: "/dashboard", label: "Studio" },
    { href: "/docs", label: "Docs" },
  ];

  // Helper to get styled wallet metadata
  const getWalletInfo = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("metamask")) {
      return {
        icon: "🦊",
        badge: "Popular",
        badgeColor: "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300",
        description: "Browser extension or mobile app",
      };
    }
    if (lower.includes("coinbase")) {
      return {
        icon: "🔵",
        badge: "Smart Wallet",
        badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300",
        description: "Passkey & self-custodial wallet",
      };
    }
    if (lower.includes("phantom")) {
      return {
        icon: "👻",
        badge: "Multichain",
        badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
        description: "Solana & EVM wallet extension",
      };
    }
    return {
      icon: "⚡",
      badge: "Detected",
      badgeColor: "bg-lime-100 text-lime-800 dark:bg-lime-950/60 dark:text-lime-300",
      description: "Standard web3 provider",
    };
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 dark:bg-neutral-950/85 backdrop-blur-xl border-b border-neutral-200/60 dark:border-neutral-800/80 transition-colors">
      {/* Wrong Network Warning Banner */}
      {isWrongNetwork && (
        <div className="w-full bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-center text-xs font-medium text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Connected to unsupported network.</span>
          <button
            onClick={() => switchChain({ chainId: baseSepolia.id })}
            className="underline font-bold hover:text-amber-950 dark:hover:text-white transition-colors ml-1"
          >
            Switch to Base Sepolia
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center group shrink-0 transition-transform duration-200 hover:opacity-90">
          <OnchainLogo size="md" />
        </Link>

        {/* Center: Navigation Links (Floating Pill Layout) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/60">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-neutral-800/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Theme Toggle & Wallet Connect */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-10 h-10 rounded-full border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-xs"
          >
            {isDark ? (
              <Moon className="w-4 h-4 text-lime-400" />
            ) : (
              <Sun className="w-4 h-4 text-neutral-700" />
            )}
          </button>

          {/* Connect / Account Button */}
          {isConnected && address ? (
            <button
              onClick={() => setWalletModalOpen(true)}
              className="flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-mono font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-xs"
            >
              <div className="w-2 h-2 rounded-full bg-lime-400 dark:bg-lime-600 animate-pulse" />
              <span>{formatAddress(address)}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          ) : (
            <button
              onClick={() => setWalletModalOpen(true)}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-xs"
            >
              <Wallet className="w-4 h-4 text-lime-400 dark:text-lime-600" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>

      {/* Responsive Centered Wallet Connection Modal */}
      <Dialog
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        title={isConnected ? "Wallet Account" : "Connect a Wallet"}
        description={
          isConnected
            ? "Your active onchain identity on Base Sepolia"
            : "Select your preferred provider to interact with Onchain POAPs."
        }
        maxWidth="md"
      >
        {isConnected && address ? (
          /* Connected State Card */
          <div className="space-y-4 text-left">
            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold uppercase text-neutral-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  Active Identity
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300 text-[10px] font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
                  Base Sepolia (84532)
                </span>
              </div>

              {/* Address with copy button */}
              <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800">
                <span className="font-mono text-xs sm:text-sm font-bold text-neutral-900 dark:text-white break-all truncate">
                  {address}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0"
                  title="Copy full address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                href={`https://sepolia.basescan.org/address/${address}`}
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <button className="w-full py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-750 transition-colors flex items-center justify-center gap-1.5 shadow-xs">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>BaseScan</span>
                </button>
              </a>

              <button
                onClick={() => {
                  disconnect();
                  setWalletModalOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-950/80 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>
        ) : (
          /* Connect Options List */
          <div className="space-y-2.5 text-left max-h-[380px] overflow-y-auto pr-1">
            {connectors.map((connector) => {
              const info = getWalletInfo(connector.name);
              return (
                <button
                  key={connector.uid}
                  disabled={isPending}
                  onClick={() => {
                    connect({ connector });
                    setWalletModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all group shadow-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 flex items-center justify-center text-lg shadow-xs group-hover:scale-105 transition-transform">
                      {info.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-neutral-900 dark:text-white">
                          {connector.name}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full ${info.badgeColor}`}
                        >
                          {info.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {info.description}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white font-semibold flex items-center gap-1">
                    Connect →
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </Dialog>
    </header>
  );
}
