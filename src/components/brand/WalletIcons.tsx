"use client";

import React from "react";
import { clsx } from "clsx";

export interface WalletIconProps {
  className?: string;
  size?: number;
}

/**
 * Official MetaMask Fox Logo Vector
 */
export function MetaMaskIcon({ className, size = 28 }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 318.6 318.6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0", className)}
    >
      <path
        d="M274.1 35.5L174.6 109.4L193 65.8L274.1 35.5Z"
        fill="#E2761B"
        stroke="#E2761B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44.4 35.5L124.6 66.3L143.9 109.4L44.4 35.5Z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M238.3 206.8L209.9 250.3L268.2 266.3L284.8 207.7L238.3 206.8Z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33.9 207.7L50.4 266.3L108.7 250.3L80.3 206.8L33.9 207.7Z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M103.6 138.2L87.5 162.5L144.9 165L143 108.9L103.6 138.2Z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M214.9 138.2L175.1 108.4L173.6 165L231.1 162.5L214.9 138.2Z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M108.7 250.3L138.6 235.3L113.8 208L108.7 250.3Z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M179.9 235.3L209.9 250.3L204.8 208L179.9 235.3Z"
        fill="#E4761B"
        stroke="#E4761B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M179.9 235.3L144.5 259.9L144.2 287.5L179.9 235.3Z"
        fill="#D7C1B3"
        stroke="#D7C1B3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M138.6 235.3L174.3 287.5L174.1 259.9L138.6 235.3Z"
        fill="#D7C1B3"
        stroke="#D7C1B3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M144.5 259.9L138.6 235.3L108.7 250.3L144.2 287.5L144.5 259.9Z"
        fill="#233447"
        stroke="#233447"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M174.1 259.9L174.3 287.5L209.9 250.3L179.9 235.3L174.1 259.9Z"
        fill="#233447"
        stroke="#233447"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M87.5 162.5L112.5 210.8L113.8 208L87.5 162.5Z"
        fill="#CD6116"
        stroke="#CD6116"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M204.8 208L206.1 210.8L231.1 162.5L204.8 208Z"
        fill="#CD6116"
        stroke="#CD6116"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M144.9 165L87.5 162.5L112.5 210.8L144.9 165Z"
        fill="#161616"
        stroke="#161616"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M173.6 165L206.1 210.8L231.1 162.5L173.6 165Z"
        fill="#161616"
        stroke="#161616"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M112.5 210.8L138.6 235.3L144.9 165L112.5 210.8Z"
        fill="#763D16"
        stroke="#763D16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M206.1 210.8L173.6 165L179.9 235.3L206.1 210.8Z"
        fill="#763D16"
        stroke="#763D16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M144.9 165L173.6 165L175.1 108.4L143 108.9L144.9 165Z"
        fill="#F6851B"
        stroke="#F6851B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M144.9 165L144.5 259.9L174.1 259.9L173.6 165L144.9 165Z"
        fill="#F6851B"
        stroke="#F6851B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Official Coinbase Wallet Logo Vector
 */
export function CoinbaseWalletIcon({ className, size = 28 }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0", className)}
    >
      <rect width="100" height="100" rx="24" fill="#0052FF" />
      <path
        d="M50 20C33.4315 20 20 33.4315 20 50C20 66.5685 33.4315 80 50 80C66.5685 80 80 66.5685 80 50C80 33.4315 66.5685 20 50 20ZM38.5 42C38.5 39.5147 40.5147 37.5 43 37.5H57C59.4853 37.5 61.5 39.5147 61.5 42V58C61.5 60.4853 59.4853 62.5 57 62.5H43C40.5147 62.5 38.5 60.4853 38.5 58V42Z"
        fill="white"
      />
    </svg>
  );
}

/**
 * Official Phantom Wallet Logo Vector
 */
export function PhantomIcon({ className, size = 28 }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0", className)}
    >
      <rect width="128" height="128" rx="30" fill="#AB9FF2" />
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
export function RabbyIcon({ className, size = 28 }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0", className)}
    >
      <rect width="100" height="100" rx="24" fill="#8697FF" />
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
export function WalletConnectIcon({ className, size = 28 }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0", className)}
    >
      <rect width="100" height="100" rx="24" fill="#3B99FC" />
      <path
        d="M28.5 39.5C40.5 28 60 28 71.5 39.5L73 41C74 42 74 43.5 73 44.5L67.5 50C67 50.5 66 50.5 65.5 50L63.5 48C56 40.5 44 40.5 36.5 48L34.5 50C34 50.5 33 50.5 32.5 50L27 44.5C26 43.5 26 42 27 41L28.5 39.5ZM78.5 46.5L83.5 51.5C84.5 52.5 84.5 54 83.5 55L61.5 77C60.5 78 59 78 58 77L50 69C49.5 68.5 49 68.5 48.5 69L40.5 77C39.5 78 38 78 37 77L15 55C14 54 14 52.5 15 51.5L20 46.5C21 45.5 22.5 45.5 23.5 46.5L31.5 54.5C32 55 33 55 33.5 54.5L41.5 46.5C42.5 45.5 44 45.5 45 46.5L50 51.5C50.5 52 51.5 52 52 51.5L57 46.5C58 45.5 59.5 45.5 60.5 46.5L68.5 54.5C69 55 70 55 70.5 54.5L78.5 46.5Z"
        fill="white"
      />
    </svg>
  );
}

/**
 * Generic Injected / Browser Extension Vector
 */
export function InjectedWalletIcon({ className, size = 28 }: WalletIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0", className)}
    >
      <rect width="100" height="100" rx="24" fill="#101115" />
      <path
        d="M28 36C28 31.5817 31.5817 28 36 28H64C68.4183 28 72 31.5817 72 36V64C72 68.4183 68.4183 72 64 72H36C31.5817 72 28 68.4183 28 64V36Z"
        stroke="#C8FF00"
        strokeWidth="5"
      />
      <circle cx="60" cy="50" r="4.5" fill="#C8FF00" />
      <path
        d="M40 50H52"
        stroke="#C8FF00"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Dynamically resolves the best brand icon component for any wallet connector
 */
export function WalletBrandIcon({
  name,
  size = 28,
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
  if (lower.includes("coinbase")) {
    return <CoinbaseWalletIcon size={size} className={className} />;
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
  return <InjectedWalletIcon size={size} className={className} />;
}
