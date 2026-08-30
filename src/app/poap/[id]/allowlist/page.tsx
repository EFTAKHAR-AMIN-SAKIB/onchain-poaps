"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAccount, useWriteContract } from "wagmi";
import { Hex } from "viem";
import { PoapEventData, fetchPoapEvent, publicClient } from "@/lib/contracts/client";
import { ONCHAIN_POAPS_ADDRESS, BASE_SEPOLIA_EXPLORER } from "@/lib/contracts/address";
import { ONCHAIN_POAPS_ABI } from "@/lib/contracts/abi";
import {
  parseAllowlistInput,
  buildMerkleTree,
  MerkleTreeResult,
  exportAllowlistJSON,
  exportAllowlistCSV,
} from "@/lib/crypto/merkle";
import { parseContractError } from "@/lib/utils/errorHandling";
import { getCreatorTimelockStatus } from "@/lib/utils/time";
import { formatAddress } from "@/lib/utils/formatting";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ShieldAlert,
  Loader2,
  Lock,
  ExternalLink,
} from "lucide-react";

export default function AllowlistManagerPage() {
  const params = useParams();
  const eventId = Number(params?.id || 0);

  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [eventData, setEventData] = useState<PoapEventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rawText, setRawText] = useState("");
  const [merkleResult, setMerkleResult] = useState<MerkleTreeResult | null>(null);
  const [txState, setTxState] = useState<"idle" | "signing" | "broadcasting" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPoapEvent(eventId);
        setEventData(data);
      } catch (err) {
        console.error("Failed to load event for allowlist manager:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [eventId]);

  const isCreator =
    isConnected &&
    address &&
    eventData?.creator &&
    address.toLowerCase() === eventData.creator.toLowerCase();

  const isRootAlreadySet =
    eventData?.allowlistRoot &&
    eventData.allowlistRoot !== "0x0000000000000000000000000000000000000000000000000000000000000000";

  const timelock = eventData ? getCreatorTimelockStatus(eventData.createdAt) : null;

  const handleTextChange = (text: string) => {
    setRawText(text);
    const parsed = parseAllowlistInput(text);
    if (parsed.validAddresses.length > 0) {
      const tree = buildMerkleTree(parsed.validAddresses);
      tree.totalInvalid = parsed.invalidEntries.length;
      tree.totalDuplicates = parsed.duplicateCount;
      tree.invalidEntries = parsed.invalidEntries;
      setMerkleResult(tree);
    } else {
      setMerkleResult(null);
    }
  };

  const handleUpdateOnchainRoot = async () => {
    if (!merkleResult || !merkleResult.root) return;
    try {
      setTxState("signing");
      setErrorMessage(null);

      const hash = await writeContractAsync({
        address: ONCHAIN_POAPS_ADDRESS,
        abi: ONCHAIN_POAPS_ABI,
        functionName: "updateAllowlistRoot",
        args: [BigInt(eventId), merkleResult.root],
      });

      setTxHash(hash);
      setTxState("broadcasting");

      await publicClient.waitForTransactionReceipt({ hash });
      setTxState("success");
      setEventData((prev) => (prev ? { ...prev, allowlistRoot: merkleResult.root } : null));
    } catch (err: unknown) {
      console.error("Update root error:", err);
      setTxState("error");
      setErrorMessage(parseContractError(err));
    }
  };

  const downloadJSON = () => {
    if (!merkleResult) return;
    const jsonStr = exportAllowlistJSON(merkleResult, eventId);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `POAP_${eventId}_Allowlist_Proofs.json`;
    a.click();
  };

  const downloadCSV = () => {
    if (!merkleResult) return;
    const csvStr = exportAllowlistCSV(merkleResult);
    const blob = new Blob([csvStr], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `POAP_${eventId}_Allowlist_Proofs.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4af37] mx-auto" />
        <p className="text-xs font-mono text-slate-400">Loading allowlist manager...</p>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-slate-400">Event #{eventId} does not exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link
          href={`/poap/${eventId}`}
          className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Event #{eventId}
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="allowlist">Allowlist Manager</Badge>
          {isRootAlreadySet && <Badge variant="verified">Root Set Onchain</Badge>}
        </div>
      </div>

      <div className="space-y-3 text-center sm:text-left">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">
          Allowlist & Merkle Tree Manager
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Manage the authorized guest list for <strong className="text-slate-200">{eventData.name}</strong>.
          Compute cryptographic Merkle trees and publish roots to Base Sepolia.
        </p>
      </div>

      {/* Contract Restrictions Card */}
      <div className="p-4 rounded-xl bg-[#141824] border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        <div className="space-y-1">
          <span className="text-slate-400 block text-[10px]">CURRENT ONCHAIN ROOT</span>
          <span className="text-slate-200 truncate block text-[11px]">
            {eventData.allowlistRoot}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-slate-400 block text-[10px]">ONE-TIME UPDATE RULE</span>
          <span className={isRootAlreadySet ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
            {isRootAlreadySet ? "Root Already Set (Locked)" : "Available to Set Once"}
          </span>
        </div>
      </div>

      {/* Guest List Textarea */}
      <div className="p-6 rounded-2xl bg-[#12141a] border border-white/10 space-y-4 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            Paste or Import Addresses
          </span>
          <span className="text-xs text-slate-400">
            Accepts CSV, TXT, or line breaks
          </span>
        </div>

        <Textarea
          rows={6}
          placeholder="0x71C...3921&#10;0x28A...94F1&#10;0x55C...82A9"
          value={rawText}
          onChange={(e) => handleTextChange(e.target.value)}
          helperText="Addresses are automatically checksummed, deduplicated, and validated."
        />

        {merkleResult && (
          <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-black/40 border border-white/5 text-center text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">Valid Guests</span>
              <span className="text-base font-bold text-emerald-400">
                {merkleResult.totalValid}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Duplicates</span>
              <span className="text-base font-bold text-amber-400">
                {merkleResult.totalDuplicates}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Invalid Lines</span>
              <span className="text-base font-bold text-rose-400">
                {merkleResult.totalInvalid}
              </span>
            </div>
          </div>
        )}

        {merkleResult && merkleResult.entries.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={downloadJSON}
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export Proofs JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={downloadCSV}
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export Proofs CSV
              </Button>
            </div>

            {/* Set Root Onchain Action */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Computed Merkle Root:</span>
                <span className="text-[#e5c158] font-bold truncate max-w-[280px]">
                  {merkleResult.root}
                </span>
              </div>

              {isRootAlreadySet ? (
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-white/10 text-slate-400 text-xs flex items-center gap-2">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>
                    The allowlist root for this event has already been set onchain. Smart contract rules restrict updates to 1 time per event.
                  </span>
                </div>
              ) : (
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full"
                  onClick={handleUpdateOnchainRoot}
                  disabled={!isCreator || txState === "signing" || txState === "broadcasting"}
                  isLoading={txState === "signing" || txState === "broadcasting"}
                >
                  Publish Merkle Root to Contract
                </Button>
              )}

              {txState === "success" && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Root successfully published!
                  </span>
                  {txHash && (
                    <a
                      href={`${BASE_SEPOLIA_EXPLORER}/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="underline flex items-center gap-1"
                    >
                      View on BaseScan <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
