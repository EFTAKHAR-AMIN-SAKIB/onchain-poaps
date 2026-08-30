"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAccount, useWriteContract } from "wagmi";
import confetti from "canvas-confetti";
import { PoapEventData, fetchPoapEvent, publicClient } from "@/lib/contracts/client";
import { ONCHAIN_POAPS_ADDRESS, BASE_SEPOLIA_EXPLORER, MAX_CREATOR_MINT_BATCH_SIZE } from "@/lib/contracts/address";
import { ONCHAIN_POAPS_ABI } from "@/lib/contracts/abi";
import { parseAllowlistInput } from "@/lib/crypto/merkle";
import { parseContractError } from "@/lib/utils/errorHandling";
import { getCreatorTimelockStatus } from "@/lib/utils/time";
import { formatAddress } from "@/lib/utils/formatting";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  Send,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ShieldAlert,
  Loader2,
  Lock,
  ExternalLink,
  Fuel,
} from "lucide-react";

export default function CreatorDropPage() {
  const params = useParams();
  const eventId = Number(params?.id || 0);

  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [eventData, setEventData] = useState<PoapEventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rawText, setRawText] = useState("");
  const [parsedAddresses, setParsedAddresses] = useState<`0x${string}`[]>([]);
  const [invalidCount, setInvalidCount] = useState(0);
  const [txState, setTxState] = useState<"idle" | "signing" | "broadcasting" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPoapEvent(eventId);
        setEventData(data);
      } catch (err) {
        console.error("Failed to load event for creator drop:", err);
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

  const timelock = eventData ? getCreatorTimelockStatus(eventData.createdAt) : null;

  const handleTextChange = (text: string) => {
    setRawText(text);
    const parsed = parseAllowlistInput(text);
    setParsedAddresses(parsed.validAddresses);
    setInvalidCount(parsed.invalidEntries.length);
  };

  const handleExecuteBatchDrop = async () => {
    if (parsedAddresses.length === 0) return;
    if (parsedAddresses.length > MAX_CREATOR_MINT_BATCH_SIZE) {
      setErrorMessage(`Batch exceeds the contract limit of ${MAX_CREATOR_MINT_BATCH_SIZE} recipients.`);
      return;
    }

    try {
      setTxState("signing");
      setErrorMessage(null);

      const hash = await writeContractAsync({
        address: ONCHAIN_POAPS_ADDRESS,
        abi: ONCHAIN_POAPS_ABI,
        functionName: "creatorMint",
        args: [BigInt(eventId), parsedAddresses],
      });

      setTxHash(hash);
      setTxState("broadcasting");

      await publicClient.waitForTransactionReceipt({ hash });
      setTxState("success");

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#d4af37", "#0052ff", "#ffffff", "#10b981"],
        });
      } catch {}
    } catch (err: unknown) {
      console.error("Batch drop error:", err);
      setTxState("error");
      setErrorMessage(parseContractError(err));
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4af37] mx-auto" />
        <p className="text-xs font-mono text-slate-400">Loading creator drop console...</p>
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
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link
          href={`/poap/${eventId}`}
          className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Event #{eventId}
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="gold">Creator Mint Drop</Badge>
          {timelock && (
            <span className="text-xs font-mono text-amber-300">
              Timelock: {timelock.formattedRemaining}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 text-center sm:text-left">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">
          Direct Creator Drop (Batch Mint)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Directly inscribe and deliver POAP badges to attendee wallets for{" "}
          <strong className="text-slate-200">{eventData.name}</strong> without requiring attendees to pay gas.
        </p>
      </div>

      {/* Recipient Input Card */}
      <div className="p-6 rounded-2xl bg-[#12141a] border border-white/10 space-y-4 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#0052ff]" />
            Recipient Wallet Addresses
          </span>
          <span className="text-xs font-mono text-slate-400">
            Max 101 addresses per batch
          </span>
        </div>

        <Textarea
          rows={6}
          placeholder="0x1234...5678&#10;0xabcd...ef01"
          value={rawText}
          onChange={(e) => handleTextChange(e.target.value)}
          helperText="Already-claimed addresses are automatically skipped by contract logic without reverting."
        />

        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-black/40 border border-white/5 text-center text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block">Recipients in Batch</span>
            <span className={`text-base font-bold ${parsedAddresses.length > MAX_CREATOR_MINT_BATCH_SIZE ? "text-rose-400" : "text-emerald-400"}`}>
              {parsedAddresses.length} / {MAX_CREATOR_MINT_BATCH_SIZE}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Invalid Lines</span>
            <span className="text-base font-bold text-rose-400">
              {invalidCount}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 space-y-3">
          <Button
            variant="gold"
            size="lg"
            className="w-full"
            onClick={handleExecuteBatchDrop}
            disabled={
              !isCreator ||
              parsedAddresses.length === 0 ||
              parsedAddresses.length > MAX_CREATOR_MINT_BATCH_SIZE ||
              timelock?.isExpired ||
              txState === "signing" ||
              txState === "broadcasting"
            }
            isLoading={txState === "signing" || txState === "broadcasting"}
          >
            <Send className="w-4 h-4 mr-1.5 text-black" />
            Deliver {parsedAddresses.length} Badges
          </Button>

          {!isCreator && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Only the event creator ({formatAddress(eventData.creator)}) can execute batch drops.</span>
            </div>
          )}

          {timelock?.isExpired && (
            <div className="p-3 rounded-lg bg-slate-800 border border-white/10 text-xs text-slate-400 flex items-center gap-2">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Creator control timelock (30 days) has expired for this event.</span>
            </div>
          )}

          {txState === "success" && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Batch successfully minted on Base Sepolia!
              </span>
              {txHash && (
                <a
                  href={`${BASE_SEPOLIA_EXPLORER}/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline flex items-center gap-1 font-mono"
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
    </div>
  );
}
