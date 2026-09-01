"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { PoapEventData, fetchAllPoapEvents, checkBalanceOf } from "@/lib/contracts/client";
import { PoapCard } from "@/components/poap/PoapCard";
import { formatAddress } from "@/lib/utils/formatting";
import { Search, Plus } from "lucide-react";

export default function GalleryPage() {
  const { address, isConnected } = useAccount();

  const [allEvents, setAllEvents] = useState<PoapEventData[]>([]);
  const [collectedEvents, setCollectedEvents] = useState<PoapEventData[]>([]);
  const [createdEvents, setCreatedEvents] = useState<PoapEventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewTab, setViewTab] = useState<"collected" | "created">("collected");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  useEffect(() => {
    async function loadUserMemories() {
      try {
        setLoading(true);
        const validEvents = await fetchAllPoapEvents();
        setAllEvents(validEvents);

        if (address) {
          // Check balances for all events
          const balancePromises = validEvents.map(async (evt) => {
            const bal = await checkBalanceOf(address, evt.eventId);
            return { evt, bal };
          });
          const balanceResults = await Promise.all(balancePromises);
          const owned = balanceResults.filter((r) => r.bal > 0).map((r) => r.evt);
          setCollectedEvents(owned);

          // Check created events
          const created = validEvents.filter(
            (e) => e.creator.toLowerCase() === address.toLowerCase()
          );
          setCreatedEvents(created);
        }
      } catch (err) {
        console.error("Failed to load gallery memories:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUserMemories();
  }, [address]);

  const activeEventsList = viewTab === "collected" ? collectedEvents : createdEvents;

  // Extract available years
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    activeEventsList.forEach((e) => {
      if (e.eventDate > 0) {
        const y = new Date(e.eventDate * 1000).getFullYear().toString();
        years.add(y);
      }
    });
    return Array.from(years).sort().reverse();
  }, [activeEventsList]);

  const filteredEvents = useMemo(() => {
    return activeEventsList.filter((evt) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = evt.name.toLowerCase().includes(q);
        const matchesLoc = evt.location.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc) return false;
      }
      if (selectedYear !== "all" && evt.eventDate > 0) {
        const y = new Date(evt.eventDate * 1000).getFullYear().toString();
        if (y !== selectedYear) return false;
      }
      return true;
    });
  }, [activeEventsList, searchQuery, selectedYear]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10 text-neutral-900 dark:text-neutral-100">
      {/* Header */}
      <div className="space-y-1 text-left pb-4 border-b border-neutral-200/80 dark:border-neutral-800">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
          PERSONAL VAULT
        </span>
        <h1 className="font-bold text-3xl sm:text-4xl tracking-tight text-neutral-900 dark:text-white">
          My POAP Collection
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          {isConnected && address ? (
            <>
              Memories collected and registered by{" "}
              <span className="font-mono text-neutral-900 dark:text-white font-semibold">{formatAddress(address)}</span> on Base Sepolia.
            </>
          ) : (
            "Connect your wallet to browse your collected POAPs and event history."
          )}
        </p>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-3 shadow-card">
        <div className="flex gap-1.5 text-xs font-medium">
          <button
            onClick={() => setViewTab("collected")}
            className={`px-4 py-2 rounded-xl transition-all ${
              viewTab === "collected"
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            Collected ({collectedEvents.length})
          </button>
          <button
            onClick={() => setViewTab("created")}
            className={`px-4 py-2 rounded-xl transition-all ${
              viewTab === "created"
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold shadow-xs"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            Created ({createdEvents.length})
          </button>
        </div>

        {/* Search & Year Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
            />
          </div>

          {availableYears.length > 0 && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 rounded-xl text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 transition-colors"
            >
              <option value="all">All Years</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-84 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 animate-pulse flex items-center justify-center text-xs font-mono text-neutral-400"
            >
              Scanning wallet tokens...
            </div>
          ))}
        </div>
      ) : !isConnected ? (
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-16 text-center space-y-4">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Please connect your wallet to view your personal POAP collection.
          </p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-16 text-center space-y-4">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {viewTab === "collected"
              ? "You haven't claimed any Onchain POAPs with this wallet yet."
              : "You haven't created any POAPs yet."}
          </p>
          <div className="flex items-center justify-center gap-3">
            {viewTab === "collected" ? (
              <Link href="/explore">
                <button className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold">
                  Browse Events
                </button>
              </Link>
            ) : (
              <Link href="/create">
                <button className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Create First POAP</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <PoapCard
              key={evt.eventId}
              event={evt}
              isOwned={collectedEvents.some((c) => c.eventId === evt.eventId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
