"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useSwitchChain } from "wagmi";
import { baseSepolia } from "viem/chains";
import { BASE_SEPOLIA_CHAIN_ID } from "@/lib/contracts/address";
import { formatAddress } from "@/lib/utils/formatting";
import { OnchainLogo } from "@/components/brand/OnchainLogo";
import { WalletModal } from "./WalletModal";
import {
  Wallet,
  ChevronDown,
  AlertTriangle,
  Sun,
  Moon,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { address, isConnected, chainId } = useAccount();
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

      {/* Modern Sleek Wallet Connection Modal */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />
    </header>
  );
}
