"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchTotalEvents,
  fetchPoapEvent,
  PoapEventData,
  publicClient,
} from "@/lib/contracts/client";
import { ONCHAIN_POAPS_ADDRESS, BASE_SEPOLIA_EXPLORER } from "@/lib/contracts/address";
import { ONCHAIN_POAPS_ABI } from "@/lib/contracts/abi";
import { formatAddress } from "@/lib/utils/formatting";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Code2,
  ExternalLink,
  Search,
  Database,
  FileCode,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";

export default function TechnicalExplorerPage() {
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [inspectorEventId, setInspectorEventId] = useState<string>("0");
  const [inspectedEvent, setInspectedEvent] = useState<PoapEventData | null>(null);
  const [rawUri, setRawUri] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadStats() {
      const total = await fetchTotalEvents();
      setTotalEvents(total);
      handleInspect(0);
    }
    loadStats();
  }, []);

  const handleInspect = async (idNum: number) => {
    try {
      setLoading(true);
      const data = await fetchPoapEvent(idNum);
      setInspectedEvent(data);

      const uriResult = await publicClient.readContract({
        address: ONCHAIN_POAPS_ADDRESS,
        abi: ONCHAIN_POAPS_ABI,
        functionName: "uri",
        args: [BigInt(idNum)],
      });
      setRawUri(uriResult);
    } catch (err) {
      console.error("Inspect error:", err);
      setInspectedEvent(null);
      setRawUri("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <Terminal className="w-5 h-5 text-[#0052ff]" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
            Developer & Protocol Inspection
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100">
          Technical Contract Explorer
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Directly inspect smart contract storage slots, SSTORE2 pointers, ABI interfaces, and CAIP-2 multichain state on Base Sepolia.
        </p>
      </div>

      {/* Contract Constants Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl bg-[#12141a] border border-white/10 space-y-1">
          <span className="text-slate-400 text-[10px] block uppercase">CONTRACT ADDRESS</span>
          <a
            href={`${BASE_SEPOLIA_EXPLORER}/address/${ONCHAIN_POAPS_ADDRESS}#code`}
            target="_blank"
            rel="noreferrer"
            className="text-[#0052ff] hover:underline font-bold text-[11px] truncate block"
          >
            {ONCHAIN_POAPS_ADDRESS}
          </a>
        </div>

        <div className="p-4 rounded-xl bg-[#12141a] border border-white/10 space-y-1">
          <span className="text-slate-400 text-[10px] block uppercase">NETWORK & CHAIN ID</span>
          <span className="text-slate-200 font-bold block text-[11px]">
            Base Sepolia (84532)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#12141a] border border-white/10 space-y-1">
          <span className="text-slate-400 text-[10px] block uppercase">TOTAL REGISTERED EVENTS</span>
          <span className="text-[#e5c158] font-bold block text-[11px]">
            {totalEvents} (0-indexed genesis)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#12141a] border border-white/10 space-y-1">
          <span className="text-slate-400 text-[10px] block uppercase">CREATOR TIMELOCK</span>
          <span className="text-slate-200 font-bold block text-[11px]">
            30 Days (2,592,000s)
          </span>
        </div>
      </div>

      {/* Onchain Event Inspector */}
      <div className="p-6 rounded-2xl bg-[#12141a] border border-white/10 space-y-6 text-left">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Database className="w-4 h-4 text-[#0052ff]" />
            Onchain Event Inspector
          </span>

          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              placeholder="Event ID"
              value={inspectorEventId}
              onChange={(e) => setInspectorEventId(e.target.value)}
              className="w-24 px-3 py-1.5 rounded-lg bg-[#0a0b0d] border border-white/10 text-xs font-mono text-slate-100"
            />
            <Button
              variant="gold"
              size="sm"
              onClick={() => handleInspect(parseInt(inspectorEventId || "0", 10))}
              isLoading={loading}
            >
              Inspect
            </Button>
          </div>
        </div>

        {inspectedEvent ? (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 block">name (string)</span>
                <span className="text-slate-100 font-bold">{inspectedEvent.name}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 block">creator (address)</span>
                <span className="text-slate-100 font-bold">{inspectedEvent.creator}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 block">svgImage (SSTORE2 pointer)</span>
                <span className="text-[#6698ff] font-bold">{inspectedEvent.svgImagePointer}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 block">allowlistRoot (bytes32)</span>
                <span className="text-[#e5c158] font-bold truncate block">
                  {inspectedEvent.allowlistRoot}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 block">isSoulbound (bool)</span>
                <span className="text-purple-300 font-bold">{String(inspectedEvent.isSoulbound)}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 block">isPublic (bool)</span>
                <span className="text-emerald-400 font-bold">{String(inspectedEvent.isPublic)}</span>
              </div>
            </div>

            {rawUri && (
              <div className="space-y-1 pt-2">
                <span className="text-xs font-mono text-slate-400">Raw uri(eventId) Output:</span>
                <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-[11px] font-mono text-slate-400 break-all max-h-36 overflow-y-auto">
                  {rawUri}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-xs font-mono text-slate-400">
            No event data for ID #{inspectorEventId}.
          </div>
        )}
      </div>

      {/* ABI Reference Section */}
      <div className="p-6 rounded-2xl bg-[#12141a] border border-white/10 space-y-4 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-[#d4af37]" />
            Complete Contract ABI Specification ({ONCHAIN_POAPS_ABI.length} items)
          </span>
          <Badge variant="default">Solidity ^0.8.20</Badge>
        </div>

        <div className="p-4 rounded-xl bg-black/60 border border-white/5 max-h-72 overflow-y-auto font-mono text-[11px] text-slate-300">
          <pre>{JSON.stringify(ONCHAIN_POAPS_ABI, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
