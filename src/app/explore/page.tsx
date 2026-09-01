"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { PoapEventData, fetchAllPoapEvents } from "@/lib/contracts/client";
import { PoapCard } from "@/components/poap/PoapCard";
import { Search, Plus } from "lucide-react";

export default function ExplorePage() {
  const [events, setEvents] = useState<PoapEventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "public" | "allowlist" | "soulbound" | "transferable">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "supply">("newest");

  useEffect(() => {
    async function loadAllEvents() {
      try {
        setLoading(true);
        const data = await fetchAllPoapEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load explore events:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAllEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = evt.name.toLowerCase().includes(q);
          const matchesDesc = evt.description.toLowerCase().includes(q);
          const matchesLoc = evt.location.toLowerCase().includes(q);
          const matchesCreator = evt.creator.toLowerCase().includes(q);
          const matchesId = evt.eventId.toString() === q.replace("#", "");
          if (!matchesName && !matchesDesc && !matchesLoc && !matchesCreator && !matchesId) {
            return false;
          }
        }

        // Category filter
        if (filterType === "public") return evt.isPublic;
        if (filterType === "allowlist") {
          return (
            evt.allowlistRoot &&
            evt.allowlistRoot !== "0x0000000000000000000000000000000000000000000000000000000000000000"
          );
        }
        if (filterType === "soulbound") return evt.isSoulbound;
        if (filterType === "transferable") return !evt.isSoulbound;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.eventId - a.eventId;
        if (sortBy === "oldest") return a.eventId - b.eventId;
        if (sortBy === "supply") return (b.totalSupply || 0) - (a.totalSupply || 0);
        return 0;
      });
  }, [events, searchQuery, filterType, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10 text-neutral-900 dark:text-neutral-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80 dark:border-neutral-800 text-left">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            ONCHAIN REGISTRY
          </span>
          <h1 className="font-bold text-3xl sm:text-4xl tracking-tight text-neutral-900 dark:text-white">
            Explore All POAPs
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Browse all attendance badges inscribed permanently on Base Sepolia bytecode.
          </p>
        </div>

        <Link
          href="/create"
          className="px-4.5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create a POAP</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-3 shadow-card">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 text-xs font-medium">
          {[
            { id: "all", label: "All Events" },
            { id: "public", label: "Public Mint" },
            { id: "allowlist", label: "Allowlist" },
            { id: "soulbound", label: "Soulbound" },
            { id: "transferable", label: "Transferable" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                filterType === tab.id
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold shadow-xs"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 rounded-xl text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 rounded-xl text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:border-neutral-400 transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="supply">Highest Supply</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-84 rounded-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 animate-pulse flex items-center justify-center text-xs font-mono text-neutral-400"
            >
              Reading contract state...
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-16 text-center space-y-3">
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            No POAPs match your filter or search query.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterType("all");
            }}
            className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <PoapCard key={evt.eventId} event={evt} />
          ))}
        </div>
      )}
    </div>
  );
}
