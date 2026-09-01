"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import Link from "next/link";
import {
  PoapEventData,
  fetchAllPoapEvents,
  publicClient,
} from "@/lib/contracts/client";
import { ONCHAIN_POAPS_ADDRESS, BASE_SEPOLIA_EXPLORER } from "@/lib/contracts/address";
import { ONCHAIN_POAPS_ABI } from "@/lib/contracts/abi";
import { parseContractError } from "@/lib/utils/errorHandling";
import { getCreatorTimelockStatus } from "@/lib/utils/time";
import { formatEventDate } from "@/lib/utils/formatting";
import { PoapBadge3D } from "@/components/poap/PoapBadge3D";
import {
  Plus,
  QrCode,
  Users,
  Send,
  Globe,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

export default function CreatorDashboardPage() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [createdEvents, setCreatedEvents] = useState<PoapEventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingEventId, setTogglingEventId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCreatedEvents() {
      if (!address) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const events = await fetchAllPoapEvents();
        const userCreated = events.filter(
          (e): e is PoapEventData =>
            e.creator.toLowerCase() === address.toLowerCase()
        );
        setCreatedEvents(userCreated);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCreatedEvents();
  }, [address]);

  const handleTogglePublic = async (eventId: number, currentPublic: boolean) => {
    try {
      setTogglingEventId(eventId);
      setActionError(null);

      const hash = await writeContractAsync({
        address: ONCHAIN_POAPS_ADDRESS,
        abi: ONCHAIN_POAPS_ABI,
        functionName: "updateEventPublic",
        args: [BigInt(eventId), !currentPublic],
      });

      await publicClient.waitForTransactionReceipt({ hash });

      setCreatedEvents((prev) =>
        prev.map((e) => (e.eventId === eventId ? { ...e, isPublic: !currentPublic } : e))
      );
    } catch (err: unknown) {
      console.error("Toggle public error:", err);
      setActionError(parseContractError(err));
    } finally {
      setTogglingEventId(null);
    }
  };

  const totalMintedAcrossAll = createdEvents.reduce(
    (acc, e) => acc + (e.totalSupply || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10 text-neutral-900 dark:text-neutral-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200/80 dark:border-neutral-800 pb-4 text-left">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            HOST CONSOLE
          </span>
          <h1 className="font-bold text-3xl sm:text-4xl tracking-tight text-neutral-900 dark:text-white">
            Creator Studio
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Manage your registered events, live QR passes, guest allowlists, and batch drops.
          </p>
        </div>

        <Link href="/create">
          <button className="px-4.5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all">
            <Plus className="w-4 h-4" />
            <span>Create New POAP</span>
          </button>
        </Link>
      </div>

      {actionError && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Metrics Row */}
      {isConnected && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl shadow-card space-y-1 text-left">
            <span className="text-xs font-mono font-semibold text-neutral-500 uppercase">
              Events Created
            </span>
            <div className="text-3xl font-bold text-neutral-900 dark:text-white">
              {createdEvents.length}
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl shadow-card space-y-1 text-left">
            <span className="text-xs font-mono font-semibold text-neutral-500 uppercase">
              Total Badges Claimed
            </span>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {totalMintedAcrossAll}
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl shadow-card space-y-1 text-left">
            <span className="text-xs font-mono font-semibold text-neutral-500 uppercase">
              Network Authority
            </span>
            <div className="text-xs font-mono text-neutral-900 dark:text-white font-semibold pt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime-500 shadow-[0_0_6px_rgba(132,204,22,0.8)]" />
              Base Sepolia (84532)
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-6 text-left">
        <h2 className="font-bold text-2xl tracking-tight text-neutral-900 dark:text-white">
          Your Registered Events
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-44 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl animate-pulse flex items-center justify-center text-xs font-mono text-neutral-400"
              >
                Scanning creator storage...
              </div>
            ))}
          </div>
        ) : !isConnected ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-16 text-center space-y-3 shadow-card">
            <Sparkles className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">Connect Your Wallet</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Connect the creator wallet you used to register POAPs to manage distribution settings.
            </p>
          </div>
        ) : createdEvents.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-16 text-center space-y-4 shadow-card">
            <Sparkles className="w-10 h-10 text-neutral-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">No Events Created Yet</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                You have not registered any POAP events from this wallet address yet.
              </p>
            </div>
            <Link href="/create">
              <button className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold">
                Create Your First POAP
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {createdEvents.map((evt) => {
              const timelock = getCreatorTimelockStatus(evt.createdAt);
              return (
                <div
                  key={evt.eventId}
                  className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card hover:shadow-card-hover transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-5">
                    <PoapBadge3D svgContent={evt.rawSvg} size="sm" interactive={false} />
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full font-semibold">
                          #{evt.eventId}
                        </span>
                        <h3 className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white">
                          {evt.name}
                        </h3>
                        {evt.isSoulbound ? (
                          <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-medium uppercase">
                            Soulbound
                          </span>
                        ) : (
                          <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-mono px-2 py-0.5 rounded-full font-medium uppercase">
                            Transferable
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                        <span>{formatEventDate(evt.eventDate)}</span>
                        <span>•</span>
                        <span>{evt.totalSupply || 0} minted</span>
                        <span>•</span>
                        <span className={timelock.isExpired ? "text-rose-500" : "text-neutral-700 dark:text-neutral-300 font-medium"}>
                          {timelock.formattedRemaining}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto text-xs">
                    <button
                      onClick={() => handleTogglePublic(evt.eventId, evt.isPublic)}
                      disabled={timelock.isExpired || togglingEventId === evt.eventId}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        evt.isPublic
                          ? "bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300 border-lime-200 dark:border-lime-800"
                          : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5 inline mr-1" />
                      {evt.isPublic ? "Public: ON" : "Public: OFF"}
                    </button>

                    <Link href={`/poap/${evt.eventId}/live`}>
                      <button className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-750 flex items-center gap-1">
                        <QrCode className="w-3.5 h-3.5" /> Live QR
                      </button>
                    </Link>

                    <Link href={`/poap/${evt.eventId}/allowlist`}>
                      <button className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-750 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> Allowlist
                      </button>
                    </Link>

                    <Link href={`/poap/${evt.eventId}/drop`}>
                      <button className="px-3.5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold hover:bg-neutral-800 flex items-center gap-1">
                        <Send className="w-3.5 h-3.5" /> Drop
                      </button>
                    </Link>

                    <Link href={`/poap/${evt.eventId}`}>
                      <button className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold hover:bg-neutral-50 text-neutral-900 dark:text-white">
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
