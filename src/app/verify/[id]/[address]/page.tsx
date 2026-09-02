"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { isAddress, getAddress } from "viem";
import {
  PoapEventData,
  fetchPoapEvent,
  checkBalanceOf,
  checkHasClaimed,
} from "@/lib/contracts/client";
import { ONCHAIN_POAPS_ADDRESS, BASE_SEPOLIA_EXPLORER } from "@/lib/contracts/address";
import { copyToClipboard } from "@/lib/utils/formatting";
import { composeFarcasterCast } from "@/lib/farcaster/miniapp";
import { PoapBadge3D } from "@/components/poap/PoapBadge3D";
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  Loader2,
} from "lucide-react";

export default function VerifiedCertificatePage() {
  const params = useParams();
  const eventId = Number(params?.id || 0);
  const rawAddress = (params?.address as string) || "";

  const [eventData, setEventData] = useState<PoapEventData | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [hasClaimed, setHasClaimed] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const isValidAddr = isAddress(rawAddress, { strict: false });
  const checksummedAddress = isValidAddr ? getAddress(rawAddress) : null;

  useEffect(() => {
    async function verify() {
      if (!checksummedAddress) {
        setLoading(false);
        return;
      }
      try {
        const data = await fetchPoapEvent(eventId);
        setEventData(data);

        const bal = await checkBalanceOf(checksummedAddress, eventId);
        const claimed = await checkHasClaimed(eventId, checksummedAddress);
        setBalance(bal);
        setHasClaimed(claimed);
      } catch (err) {
        console.error("Verification query error:", err);
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [eventId, checksummedAddress]);

  const isVerified = balance > 0 || hasClaimed;

  const handleCopyLink = async () => {
    if (typeof window !== "undefined") {
      const ok = await copyToClipboard(window.location.href);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleShareCast = () => {
    const text = `Verified onchain attendance certificate for ${eventData?.name || "Event #" + eventId}! Stored 100% on @base 🔵`;
    const addr = checksummedAddress || rawAddress;
    const url =
      typeof window !== "undefined"
        ? window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
          ? `https://onchain-poaps-ebon.vercel.app/verify/${eventId}/${addr}`
          : window.location.href
        : `https://onchain-poaps-ebon.vercel.app/verify/${eventId}/${addr}`;
    composeFarcasterCast(text, url);
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900 dark:text-white mx-auto" />
        <p className="text-xs font-mono text-neutral-500">
          Running cryptographic verification against Base Sepolia...
        </p>
      </div>
    );
  }

  if (!isValidAddr || !checksummedAddress || !eventData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-card">
        <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          Verification Failed
        </h2>
        <p className="text-xs text-neutral-500">
          Invalid address or event ID specified.
        </p>
        <Link href="/verify">
          <button className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold">
            Back to Verify Tool
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8 text-center text-neutral-900 dark:text-neutral-100">
      {/* Back Link */}
      <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-neutral-800 pb-4">
        <Link
          href="/verify"
          className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Verify Tool
        </Link>
        <span
          className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${
            isVerified
              ? "bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300"
              : "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300"
          }`}
        >
          {isVerified ? "Cryptographically Verified" : "Unverified"}
        </span>
      </div>

      {/* Verified Certificate Card */}
      <div className="p-8 sm:p-12 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card space-y-8 relative text-left">
        {/* Status Pill */}
        <div className="flex items-center justify-center">
          {isVerified ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300 rounded-full font-mono text-xs font-semibold tracking-wider uppercase">
              <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              Verified Onchain Attendance
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 rounded-full font-mono text-xs font-semibold tracking-wider uppercase">
              <XCircle className="w-4 h-4 text-rose-600" />
              No Record Found in Wallet
            </div>
          )}
        </div>

        {/* Artwork */}
        <div className="flex justify-center my-4">
          <PoapBadge3D svgContent={eventData.rawSvg} size="lg" interactive={true} />
        </div>

        {/* Certificate Titles */}
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <h1 className="font-bold text-3xl sm:text-4xl tracking-tight text-neutral-900 dark:text-white">
            {eventData.name}
          </h1>
          {eventData.description && (
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {eventData.description}
            </p>
          )}
        </div>

        {/* Verified Traits Table */}
        <div className="p-6 bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-750 rounded-2xl max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase font-bold">ATTENDEE WALLET</span>
            <span className="text-neutral-900 dark:text-white font-semibold break-all text-[11px]">
              {checksummedAddress}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase font-bold">ONCHAIN TOKEN BALANCE</span>
            <span className="text-neutral-900 dark:text-white font-semibold text-[11px] bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300 px-2 py-0.5 rounded-md inline-block">
              {balance} Token{balance === 1 ? "" : "s"} ({eventData.isSoulbound ? "Soulbound" : "Transferable"})
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase font-bold">EVENT IDENTIFIER</span>
            <span className="text-neutral-900 dark:text-white font-semibold text-[11px]">
              Event #{eventData.eventId}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase font-bold">CAIP-2 MULTICHAIN ID</span>
            <span className="text-neutral-900 dark:text-white truncate block text-[11px]">
              {eventData.multichainId}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase font-bold">NETWORK</span>
            <span className="text-neutral-900 dark:text-white text-[11px] font-semibold">Base Sepolia (Chain ID 84532)</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase font-bold">CONTRACT ADDRESS</span>
            <a
              href={`${BASE_SEPOLIA_EXPLORER}/address/${ONCHAIN_POAPS_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline truncate block text-[11px] font-semibold flex items-center gap-1"
            >
              {ONCHAIN_POAPS_ADDRESS} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-750 flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Copied Link</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleShareCast}
            className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share to Farcaster</span>
          </button>
        </div>
      </div>
    </div>
  );
}
