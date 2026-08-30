"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { baseSepolia } from "viem/chains";
import { BASE_SEPOLIA_CHAIN_ID } from "@/lib/contracts/address";
import { formatAddress } from "@/lib/utils/formatting";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import {
  Wallet,
  LogOut,
  ChevronDown,
  AlertTriangle,
  ExternalLink,
  Sun,
  Moon,
  Plus,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

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

  const isWrongNetwork = isConnected && chainId !== BASE_SEPOLIA_CHAIN_ID;

  const navLinks = [
    { href: "/explore", label: "Explore" },
    { href: "/create", label: "Create" },
    { href: "/gallery", label: "My POAPs" },
    { href: "/verify", label: "Verify" },
    { href: "/dashboard", label: "Studio" },
    { href: "/docs", label: "Docs" },
  ];

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
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105">
            <div className="w-3 h-3 rounded-full bg-lime-400 dark:bg-lime-500 shadow-[0_0_8px_rgba(163,230,53,0.85)]" />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight text-neutral-900 dark:text-white uppercase font-sans">
            Onchain POAPs
          </span>
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
              <Moon className="w-4 h-4 text-neutral-300" />
            ) : (
              <Sun className="w-4 h-4 text-neutral-700" />
            )}
          </button>

          {/* Connect / Account Button */}
          {isConnected && address ? (
            <button
              onClick={() => setWalletModalOpen(true)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-mono font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-xs"
            >
              <div className="w-2 h-2 rounded-full bg-lime-400 dark:bg-lime-600 animate-pulse" />
              <span>{formatAddress(address)}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          ) : (
            <button
              onClick={() => setWalletModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-xs"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>

      {/* Wallet Connection Modal */}
      <Dialog
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        title={isConnected ? "Account Details" : "Connect Wallet"}
        description={
          isConnected
            ? "Your active wallet connection on Base Sepolia"
            : "Connect your Ethereum wallet to mint, distribute, and collect Onchain POAPs."
        }
      >
        {isConnected && address ? (
          <div className="space-y-4 text-left">
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="text-[11px] font-mono text-neutral-500 uppercase font-semibold">
                Connected Wallet
              </div>
              <div className="font-mono text-sm font-semibold text-neutral-900 dark:text-white break-all">
                {address}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs">
                <span className="text-neutral-500 font-medium">Network:</span>
                <span className="font-mono text-neutral-900 dark:text-white font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-lime-500" />
                  Base Sepolia (84532)
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={`https://sepolia.basescan.org/address/${address}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1"
              >
                <Button variant="outline" size="sm" className="w-full font-medium">
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  BaseScan
                </Button>
              </a>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 font-medium"
                onClick={() => {
                  disconnect();
                  setWalletModalOpen(false);
                }}
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 text-left">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => {
                  connect({ connector });
                  setWalletModalOpen(false);
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-850 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white text-lime-400 dark:text-neutral-900 flex items-center justify-center font-bold">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {connector.name}
                    </div>
                    <div className="text-[11px] text-neutral-500">
                      Standard browser extension or mobile wallet
                    </div>
                  </div>
                </div>
                <span className="text-xs text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white font-medium">
                  Connect →
                </span>
              </button>
            ))}
          </div>
        )}
      </Dialog>
    </header>
  );
}
