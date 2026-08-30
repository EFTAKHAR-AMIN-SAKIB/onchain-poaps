import React from "react";
import Link from "next/link";
import { ONCHAIN_POAPS_ADDRESS, BASE_SEPOLIA_EXPLORER } from "@/lib/contracts/address";
import { ExternalLink } from "lucide-react";

import { OnchainLogo } from "@/components/brand/OnchainLogo";

export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-150 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-12 px-4 sm:px-8 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
            <OnchainLogo size="md" />
          </Link>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">
            Proof of Attendance protocol storing 100% vector SVG artwork and event metadata directly on Base Sepolia bytecode. Zero IPFS or centralized server dependencies.
          </p>

          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400 pt-1">
            <span className="w-2 h-2 rounded-full bg-lime-500" />
            <span>Base Contract:</span>
            <a
              href={`${BASE_SEPOLIA_EXPLORER}/address/${ONCHAIN_POAPS_ADDRESS}#code`}
              target="_blank"
              rel="noreferrer"
              className="text-neutral-900 dark:text-white hover:underline flex items-center gap-1 font-semibold truncate max-w-[150px]"
            >
              0xC324...9de6 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Links: Protocol */}
        <div className="md:col-span-3 space-y-3">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            PROTOCOL & ACTIONS
          </div>
          <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            <li>
              <Link href="/explore" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                Explore POAPs
              </Link>
            </li>
            <li>
              <Link href="/create" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                POAP Studio & Create
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                My Collection
              </Link>
            </li>
            <li>
              <Link href="/verify" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                Zero-Trust Verification
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                Creator Studio
              </Link>
            </li>
          </ul>
        </div>

        {/* Links: Developer Specs */}
        <div className="md:col-span-4 space-y-3">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            DEVELOPER SPECS
          </div>
          <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
            <li>
              <Link href="/docs" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                21-Topic Documentation
              </Link>
            </li>
            <li>
              <Link href="/technical" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                Technical Contract Explorer
              </Link>
            </li>
            <li>
              <a
                href="https://miniapps.farcaster.xyz/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1"
              >
                Farcaster Mini App v2 Spec <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a
                href="https://sepolia.basescan.org/address/0xC3249356a483fbe17d5355D39105D2eA666d9de6#code"
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1"
              >
                BaseScan Contract Source <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-neutral-200/60 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400 dark:text-neutral-500">
        <div>© 2026 Onchain POAPs. Open source under MIT License.</div>
        <div className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200 font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>BUILT FOR THE BASE ECOSYSTEM</span>
        </div>
      </div>
    </footer>
  );
}
