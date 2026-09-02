"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PoapEventData, fetchTotalEvents, fetchPoapEventsBatch } from "@/lib/contracts/client";
import { PoapCard } from "@/components/poap/PoapCard";
import { GlassPlaqueHero } from "@/components/home/GlassPlaqueHero";
import {
  ArrowRight,
  Globe,
  Users,
  QrCode,
  Send,
  Shield,
  CloudOff,
  Lock,
  LayoutGrid,
} from "lucide-react";

export default function HomePage() {
  const [recentEvents, setRecentEvents] = useState<PoapEventData[]>([]);
  const [totalEventsCount, setTotalEventsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Active mint method state for interactive card hover
  const [activeMintMode, setActiveMintMode] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const total = await fetchTotalEvents();
        setTotalEventsCount(total);

        const idsToFetch: number[] = [];
        for (let i = total; i >= 0 && idsToFetch.length < 6; i--) {
          idsToFetch.push(i);
        }

        const results = await fetchPoapEventsBatch(idsToFetch);
        setRecentEvents(results);
      } catch (err) {
        console.error("Failed to load homepage events:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const mintMethods = [
    {
      id: 0,
      step: "01",
      title: "Public Mint",
      shortDesc: "Open to anyone. Self-claim anytime.",
      desc1: "Open to anyone.",
      desc2: "Anyone can mint one.",
      badge: "Free Claim",
      icon: Globe,
      colorBg: "bg-[#eefadc] dark:bg-lime-950/40",
      colorText: "text-[#65a30d] dark:text-lime-400",
      href: "/create?type=public",
    },
    {
      id: 1,
      step: "02",
      title: "Curated Guests",
      shortDesc: "Invite list. Merkle tree verified.",
      desc1: "Allowlist only.",
      desc2: "Invite specific addresses.",
      badge: "Merkle Root",
      icon: Users,
      colorBg: "bg-[#f3e8ff] dark:bg-purple-950/40",
      colorText: "text-[#9333ea] dark:text-purple-400",
      href: "/create?type=allowlist",
    },
    {
      id: 2,
      step: "03",
      title: "Live QR Mode",
      shortDesc: "In-person scan. Dynamic EIP-712.",
      desc1: "Perfect for events.",
      desc2: "Scan and mint on the spot.",
      badge: "EIP-712 Sign",
      icon: QrCode,
      colorBg: "bg-[#e0f2fe] dark:bg-sky-950/40",
      colorText: "text-[#0284c7] dark:text-sky-400",
      href: "/create?type=qr",
    },
    {
      id: 3,
      step: "04",
      title: "Direct Drop",
      shortDesc: "Creator airdrop to recipient wallets.",
      desc1: "You decide.",
      desc2: "Mint directly to recipients.",
      badge: "Multicall Batch",
      icon: Send,
      colorBg: "bg-[#ffedd5] dark:bg-orange-950/40",
      colorText: "text-[#ea580c] dark:text-orange-400",
      href: "/create?type=drop",
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-20 pb-20 overflow-hidden">
      {/* 1. HERO SECTION (Exact pixel-accurate match to design) */}
      <section className="pt-10 sm:pt-14 lg:pt-18 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          {/* Left Column: Headline, Subtext, CTAs, Feature Bullets */}
          <div className="lg:col-span-6 space-y-7 text-left">
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-850 text-[11px] font-mono font-medium tracking-wider text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-800">
              <span className="w-2 h-2 rounded-full bg-lime-500 shadow-[0_0_6px_rgba(132,204,22,0.8)]" />
              <span>TESTING ON BASE SEPOLIA</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1">
              <h1 className="font-extrabold text-5xl sm:text-6xl lg:text-[4.5rem] tracking-tight text-neutral-900 dark:text-white leading-[1.06]">
                Moments live. <br />
                Onchain{" "}
                <span className="bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#ec4899] bg-clip-text text-transparent">
                  forever.
                </span>
              </h1>
            </div>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 max-w-lg leading-relaxed font-normal">
              Create, mint, and collect POAPs with artwork and event details stored directly onchain. Transparent, verifiable, and built to last.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/create">
                <button className="px-6 py-3.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-sm flex items-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-xs hover:gap-3">
                  <span>Create a POAP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/explore">
                <button className="px-6 py-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-all shadow-xs">
                  <span>Explore POAPs</span>
                </button>
              </Link>
            </div>

            {/* Feature Bullets with Icons */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 pt-3 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                <span>100% Onchain</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CloudOff className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                <span>No IPFS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                <span>Soulbound or Transferable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500" />
                <span>Four Ways to Mint</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Encased Glass Plaque Hero Centerpiece */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <GlassPlaqueHero />
          </div>
        </div>
      </section>

      {/* 2. DISTRIBUTE YOUR POAP (Four Ways to Mint modular cards) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto pt-2 sm:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          {/* Left Description Column */}
          <div className="lg:col-span-3 flex flex-col justify-center space-y-1.5 sm:space-y-2 text-left pr-0 sm:pr-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                DISTRIBUTE YOUR POAP
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-700/60 sm:hidden">
                4 WAYS
              </span>
            </div>
            <h2 className="font-bold text-2xl sm:text-3xl tracking-tight text-neutral-900 dark:text-white">
              Four ways to mint
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Choose the distribution method that fits your event.
            </p>
          </div>

          {/* 4 Feature Cards: 2x2 grid on mobile / Farcaster mini app to display all 4 steps completely, 4 cols on desktop */}
          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-4">
            {mintMethods.map((method) => {
              const IconComp = method.icon;
              const isHovered = activeMintMode === method.id;
              return (
                <Link
                  key={method.id}
                  href={method.href}
                  onMouseEnter={() => setActiveMintMode(method.id)}
                  onMouseLeave={() => setActiveMintMode(null)}
                  className={`bg-white dark:bg-neutral-900 border rounded-2xl sm:rounded-3xl p-3 sm:p-6 min-h-[148px] sm:h-56 flex flex-col justify-between transition-all duration-200 group text-left relative overflow-hidden active:scale-[0.98] ${
                    isHovered
                      ? "border-neutral-400 dark:border-neutral-600 shadow-md sm:translate-y-[-2px]"
                      : "border-neutral-200/70 dark:border-neutral-800 shadow-card hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-card-hover sm:hover:translate-y-[-2px]"
                  }`}
                >
                  <div className="space-y-2 sm:space-y-4">
                    {/* Top Row: Icon container + Step Badge */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center ${method.colorBg} ${method.colorText} transition-transform group-hover:scale-105`}
                      >
                        <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800/80 px-1.5 sm:px-2 py-0.5 rounded-md">
                        {method.step}
                      </span>
                    </div>

                    {/* Title & description */}
                    <div className="space-y-0.5 sm:space-y-1">
                      <h3 className="font-bold text-[13px] sm:text-base text-neutral-900 dark:text-white tracking-tight leading-snug">
                        {method.title}
                      </h3>
                      {/* Desktop description */}
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed hidden sm:block">
                        {method.desc1} <br />
                        {method.desc2}
                      </p>
                      {/* Mobile / Farcaster Mini App concise description */}
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug sm:hidden line-clamp-2">
                        {method.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Row / CTA */}
                  <div className="pt-2 flex items-center justify-between border-t border-neutral-100 dark:border-neutral-800/60 sm:border-0 mt-2 sm:mt-0">
                    <span className="text-[9px] font-mono font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500 sm:hidden">
                      {method.badge}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all ml-auto" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. BOTTOM TICKER / PROTOCOL BAR (Exact match to design) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono font-medium tracking-widest text-neutral-400 dark:text-neutral-500">
          <div>ONCHAIN • BASE • ERC-1155</div>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-lime-500 shadow-[0_0_6px_rgba(132,204,22,0.8)]" />
            <span>BUILT FOR MEMORIES THAT LAST</span>
          </div>
          <div>VERIFIABLE • PERMANENT • YOURS</div>
        </div>
      </section>

      {/* 4. RECENT EVENTS REGISTRY */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 text-left">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              ONCHAIN REGISTRY
            </span>
            <h2 className="font-bold text-2xl sm:text-3xl tracking-tight text-neutral-900 dark:text-white">
              Recently Inscribed POAPs
            </h2>
          </div>
          <Link href="/explore">
            <button className="px-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-850 flex items-center gap-1.5 shadow-xs transition-all">
              <span>View All ({totalEventsCount})</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-84 rounded-3xl bg-neutral-100 dark:bg-neutral-900 animate-pulse flex items-center justify-center text-xs font-mono text-neutral-400"
              >
                Reading Base Sepolia contract...
              </div>
            ))}
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="p-12 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-4">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              No events registered yet on the testnet contract.
            </p>
            <Link href="/create">
              <button className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold">
                Create First POAP
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recentEvents.slice(0, 3).map((evt) => (
              <PoapCard key={evt.eventId} event={evt} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
