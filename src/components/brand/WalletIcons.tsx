"use client";

import React from "react";
import { clsx } from "clsx";

export interface WalletIconProps {
  className?: string;
  size?: number;
}

/**
 * Official MetaMask Fox Logo with rounded squircle
 */
export function MetaMaskIcon({ className, size = 38 }: WalletIconProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className={clsx(
        "rounded-xl bg-white flex items-center justify-center p-0.5 shadow-sm shrink-0 overflow-hidden",
        className
      )}
    >
      <img
        src="/wallets/metamask.png"
        alt="MetaMask"
        width={size}
        height={size}
        className="w-full h-full object-contain select-none pointer-events-none"
        loading="eager"
      />
    </div>
  );
}

/**
 * Official Farcaster / Warpcast Wallet Logo Vector
 */
export function FarcasterWalletIcon({ className, size = 38 }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0 rounded-xl overflow-hidden shadow-sm", className)}
    >
      <rect width="100" height="100" rx="22" fill="#855DCD" />
      <path
        d="M27 28 H73 C75.2 28 77 29.8 77 32 V68 C77 69.1 76.1 70 75 70 H65 C63.9 70 63 69.1 63 68 V52 C63 49.8 61.2 48 59 48 H41 C38.8 48 37 49.8 37 52 V68 C37 69.1 36.1 70 35 70 H25 C23.9 70 23 69.1 23 68 V32 C23 29.8 24.8 28 27 28 Z"
        fill="white"
      />
      <rect x="34" y="36" width="10" height="9" rx="2" fill="#855DCD" />
      <rect x="56" y="36" width="10" height="9" rx="2" fill="#855DCD" />
    </svg>
  );
}

/**
 * Official Coinbase Wallet Logo Vector
 */
export function CoinbaseWalletIcon({ className, size = 38 }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0 rounded-xl overflow-hidden shadow-sm", className)}
    >
      <rect width="100" height="100" rx="22" fill="#0052FF" />
      <path
        d="M50 20C33.4315 20 20 33.4315 20 50C20 66.5685 33.4315 80 50 80C66.5685 80 80 66.5685 80 50C80 33.4315 66.5685 20 50 20ZM38.5 42C38.5 39.5147 40.5147 37.5 43 37.5H57C59.4853 37.5 61.5 39.5147 61.5 42V58C61.5 60.4853 59.4853 62.5 57 62.5H43C40.5147 62.5 38.5 60.4853 38.5 58V42Z"
        fill="white"
      />
    </svg>
  );
}

/**
 * Official Rainbow Wallet Logo Vector
 */
export function RainbowIcon({ className, size = 38 }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0 rounded-xl overflow-hidden shadow-sm", className)}
    >
      <rect width="100" height="100" rx="22" fill="#0E1428" />
      <path
        d="M20 76 C20 42 46 26 80 26"
        stroke="#FF334B"
        strokeWidth="6.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M24 80 C24 48 50 32 80 32"
        stroke="#FF9000"
        strokeWidth="6.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M28 84 C28 54 53 38 80 38"
        stroke="#FFD600"
        strokeWidth="6.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M32 88 C32 60 56 44 80 44"
        stroke="#00E56A"
        strokeWidth="6.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M36 92 C36 66 60 50 80 50"
        stroke="#00B0FF"
        strokeWidth="6.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M40 96 C40 72 63 56 80 56"
        stroke="#7A39FB"
        strokeWidth="6.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Official Phantom Wallet Logo Vector
 */
export function PhantomIcon({ className, size = 38 }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0 rounded-xl overflow-hidden shadow-sm", className)}
    >
      <rect width="128" height="128" rx="28" fill="#AB9FF2" />
      <path
        d="M107.5 68.5C104.5 44 84.5 28 64 28C41 28 22.5 46.5 22.5 70C22.5 89.5 37 99.5 51 99.5C59 99.5 62.5 95 67 95C72 95 75 99.5 84 99.5C95.5 99.5 109 88.5 107.5 68.5ZM49.5 65C46.5 65 44 62.5 44 59.5C44 56.5 46.5 54 49.5 54C52.5 54 55 56.5 55 59.5C55 62.5 52.5 65 49.5 65ZM78.5 65C75.5 65 73 62.5 73 59.5C73 56.5 75.5 54 78.5 54C81.5 54 84 56.5 84 59.5C84 62.5 81.5 65 78.5 65Z"
        fill="#FFFDF8"
      />
    </svg>
  );
}

/**
 * Official Rabby Wallet Logo Vector
 */
export function RabbyIcon({ className, size = 38 }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0 rounded-xl overflow-hidden shadow-sm", className)}
    >
      <rect width="100" height="100" rx="22" fill="#8697FF" />
      <path
        d="M32 30C28 30 25 33 25 37V63C25 67 28 70 32 70H68C72 70 75 67 75 63V37C75 33 72 30 68 30H32ZM40 45C42.7614 45 45 47.2386 45 50C45 52.7614 42.7614 55 40 55C37.2386 55 35 52.7614 35 50C35 47.2386 37.2386 45 40 45ZM60 45C62.7614 45 65 47.2386 65 50C65 52.7614 62.7614 55 60 55C57.2386 55 55 52.7614 55 50C55 47.2386 57.2386 45 60 45Z"
        fill="white"
      />
    </svg>
  );
}

/**
 * Official WalletConnect Logo Vector
 */
export function WalletConnectIcon({ className, size = 38 }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0 rounded-xl overflow-hidden shadow-sm", className)}
    >
      <rect width="100" height="100" rx="22" fill="#3B99FC" />
      <path
        d="M28.5 39.5C40.5 28 60 28 71.5 39.5L73 41C74 42 74 43.5 73 44.5L67.5 50C67 50.5 66 50.5 65.5 50L63.5 48C56 40.5 44 40.5 36.5 48L34.5 50C34 50.5 33 50.5 32.5 50L27 44.5C26 43.5 26 42 27 41L28.5 39.5ZM78.5 46.5L83.5 51.5C84.5 52.5 84.5 54 83.5 55L61.5 77C60.5 78 59 78 58 77L50 69C49.5 68.5 49 68.5 48.5 69L40.5 77C39.5 78 38 78 37 77L15 55C14 54 14 52.5 15 51.5L20 46.5C21 45.5 22.5 45.5 23.5 46.5L31.5 54.5C32 55 33 55 33.5 54.5L41.5 46.5C42.5 45.5 44 45.5 45 46.5L50 51.5C50.5 52 51.5 52 52 51.5L57 46.5C58 45.5 59.5 45.5 60.5 46.5L68.5 54.5C69 55 70 55 70.5 54.5L78.5 46.5Z"
        fill="white"
      />
    </svg>
  );
}

/**
 * Clean Modern Browser Wallet / Injected Icon matching the reference design
 */
export function BrowserWalletIcon({ className, size = 38 }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0 rounded-xl overflow-hidden shadow-sm", className)}
    >
      {/* Dark container matching screenshot */}
      <rect width="100" height="100" rx="22" fill="#181A22" />
      {/* Wallet body */}
      <rect x="22" y="32" width="56" height="40" rx="9" fill="white" />
      {/* Dark interior slit */}
      <rect x="25" y="36" width="50" height="3" rx="1.5" fill="#181A22" opacity="0.15" />
      {/* Credit card peeking from slot */}
      <rect x="30" y="25" width="40" height="16" rx="4" fill="#0052FF" />
      <rect x="34" y="29" width="12" height="4" rx="1" fill="white" opacity="0.8" />
      {/* Front flap and clasp */}
      <path
        d="M22 44 H78"
        stroke="#E2E8F0"
        strokeWidth="1.5"
      />
      <rect x="62" y="44" width="16" height="15" rx="5" fill="#0052FF" />
      <circle cx="68" cy="51.5" r="2.5" fill="white" />
    </svg>
  );
}

/**
 * Generic Injected fallback
 */
export const InjectedWalletIcon = BrowserWalletIcon;

/**
 * Dynamically resolves the best brand icon component for any wallet connector
 */
export function WalletBrandIcon({
  name,
  size = 38,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const lower = name.toLowerCase();
  if (lower.includes("metamask")) {
    return <MetaMaskIcon size={size} className={className} />;
  }
  if (lower.includes("farcaster") || lower.includes("warpcast")) {
    return <FarcasterWalletIcon size={size} className={className} />;
  }
  if (lower.includes("coinbase")) {
    return <CoinbaseWalletIcon size={size} className={className} />;
  }
  if (lower.includes("rainbow")) {
    return <RainbowIcon size={size} className={className} />;
  }
  if (lower.includes("phantom")) {
    return <PhantomIcon size={size} className={className} />;
  }
  if (lower.includes("rabby")) {
    return <RabbyIcon size={size} className={className} />;
  }
  if (lower.includes("walletconnect")) {
    return <WalletConnectIcon size={size} className={className} />;
  }
  return <BrowserWalletIcon size={size} className={className} />;
}
