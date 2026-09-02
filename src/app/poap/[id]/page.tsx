"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAccount, useWriteContract } from "wagmi";
import confetti from "canvas-confetti";
import {
  PoapEventData,
  fetchPoapEvent,
  checkHasClaimed,
  checkBalanceOf,
  publicClient,
} from "@/lib/contracts/client";
import { ONCHAIN_POAPS_ADDRESS, BASE_SEPOLIA_EXPLORER } from "@/lib/contracts/address";
import { ONCHAIN_POAPS_ABI } from "@/lib/contracts/abi";
import { parseContractError } from "@/lib/utils/errorHandling";
import { formatAddress, formatEventDate, copyToClipboard } from "@/lib/utils/formatting";
import { extractClaimParams } from "@/lib/crypto/signature";
import { composeFarcasterCast } from "@/lib/farcaster/miniapp";
import { PoapBadge3D } from "@/components/poap/PoapBadge3D";
import { EligibilityCard } from "@/components/poap/EligibilityCard";
import { TimelockBadge } from "@/components/poap/TimelockBadge";
import { Dialog } from "@/components/ui/Dialog";
import { Input, Textarea } from "@/components/ui/Input";
import {
  ExternalLink,
  Calendar,
  MapPin,
  Share2,
  Copy,
  Check,
  QrCode,
  Users,
  Settings,
  Globe,
  Layers,
  Send,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function PoapDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = Number(params?.id || 0);

  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [eventData, setEventData] = useState<PoapEventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  // Mint modal & claim states
  const [mintModalOpen, setMintModalOpen] = useState(false);
  const [mintMode, setMintMode] = useState<"public" | "allowlist" | "signature">("public");
  const [merkleProofInput, setMerkleProofInput] = useState<string>("");
  const [customSignature, setCustomSignature] = useState<string>("");
  const [txState, setTxState] = useState<"idle" | "signing" | "broadcasting" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Parse signature from query param if present
  const queryClaim = extractClaimParams(searchParams);
  const hasQuerySignature = !!queryClaim.signature;

  const isCreator = Boolean(
    isConnected &&
    address &&
    eventData?.creator &&
    address.toLowerCase() === eventData.creator.toLowerCase()
  );

  const hasAllowlist =
    eventData?.allowlistRoot &&
    eventData.allowlistRoot !== "0x0000000000000000000000000000000000000000000000000000000000000000";

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const data = await fetchPoapEvent(eventId);
        setEventData(data);

        if (address) {
          const claimed = await checkHasClaimed(eventId, address);
          const balance = await checkBalanceOf(address, eventId);
          setHasClaimed(claimed);
          setUserBalance(balance);
        }
      } catch (err) {
        console.error("Failed to load POAP detail:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [eventId, address]);

  // Set default mint mode based on URL or event availability
  useEffect(() => {
    if (queryClaim.signature) {
      setMintMode("signature");
      setCustomSignature(queryClaim.signature);
    } else if (eventData?.isPublic) {
      setMintMode("public");
    } else if (hasAllowlist) {
      setMintMode("allowlist");
    } else {
      setMintMode("signature");
    }
  }, [queryClaim.signature, eventData?.isPublic, hasAllowlist]);

  const handleClaim = async () => {
    if (!isConnected || !address) {
      setErrorMessage("Please connect your wallet first.");
      return;
    }

    try {
      setTxState("signing");
      setErrorMessage(null);

      let hash: `0x${string}`;

      if (mintMode === "public") {
        hash = await writeContractAsync({
          address: ONCHAIN_POAPS_ADDRESS,
          abi: ONCHAIN_POAPS_ABI,
          functionName: "mint",
          args: [BigInt(eventId)],
        });
      } else if (mintMode === "allowlist") {
        let proofArray: `0x${string}`[] = [];
        try {
          if (merkleProofInput.trim().startsWith("[")) {
            proofArray = JSON.parse(merkleProofInput.trim());
          } else {
            proofArray = merkleProofInput
              .split(/[\r\n,;]+/)
              .map((s) => s.trim())
              .filter((s) => s.startsWith("0x")) as `0x${string}`[];
          }
        } catch {
          throw new Error("Invalid proof format. Please provide an array of bytes32 hashes.");
        }

        hash = await writeContractAsync({
          address: ONCHAIN_POAPS_ADDRESS,
          abi: ONCHAIN_POAPS_ABI,
          functionName: "allowlistMint",
          args: [BigInt(eventId), proofArray],
        });
      } else {
        const sigToUse = (customSignature || queryClaim.signature || "").trim() as `0x${string}`;
        if (!sigToUse || !sigToUse.startsWith("0x")) {
          throw new Error("Please provide a valid 0x... creator ECDSA signature.");
        }

        hash = await writeContractAsync({
          address: ONCHAIN_POAPS_ADDRESS,
          abi: ONCHAIN_POAPS_ABI,
          functionName: "mintWithSignature",
          args: [BigInt(eventId), sigToUse],
        });
      }

      setTxHash(hash);
      setTxState("broadcasting");

      await publicClient.waitForTransactionReceipt({ hash });
      setTxState("success");
      setHasClaimed(true);
      setUserBalance((prev) => prev + 1);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#bef264", "#3b82f6", "#8b5cf6", "#ec4899"],
        });
      } catch {}
    } catch (err: unknown) {
      console.error("Claim error:", err);
      setTxState("error");
      setErrorMessage(parseContractError(err));
    }
  };

  const handleShareCast = () => {
    const text = `I'm claiming my onchain POAP for ${eventData?.name || "Event #" + eventId}! Stored 100% on @base 🔵`;
    const url =
      typeof window !== "undefined"
        ? window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
          ? `https://onchain-poaps-ebon.vercel.app/poap/${eventId}`
          : window.location.href
        : `https://onchain-poaps-ebon.vercel.app/poap/${eventId}`;
    composeFarcasterCast(text, url);
  };

  const handleCopyClaimLink = async () => {
    if (typeof window !== "undefined") {
      const ok = await copyToClipboard(window.location.href);
      if (ok) {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900 dark:text-white mx-auto" />
        <p className="text-xs font-mono text-neutral-400">
          Reading POAP #{eventId} from Base Sepolia contract...
        </p>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-card p-8">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">POAP Not Found</h2>
        <p className="text-xs text-neutral-500">
          Event #{eventId} does not exist on the Base Sepolia contract.
        </p>
        <Link href="/explore">
          <button className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold">
            Browse All POAPs
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-8 py-4 sm:py-12 space-y-6 sm:space-y-10 pb-28 text-neutral-900 dark:text-neutral-100">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-3 text-xs font-mono text-neutral-500 border-b border-neutral-200/80 dark:border-neutral-800 pb-3 sm:pb-4">
        <div className="flex items-center gap-2 font-medium">
          <Link href="/explore" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Explore
          </Link>
          <span>/</span>
          <span className="text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded-full font-semibold">
            Event #{eventData.eventId}
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap font-mono">
          <TimelockBadge createdAtSeconds={eventData.createdAt} type="creator" />
          <TimelockBadge createdAtSeconds={eventData.createdAt} type="signature" />
        </div>
      </div>

      {/* Main Collectible Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Left Column: 3D Badge & Actions */}
        <div className="lg:col-span-5 flex flex-col items-center gap-4 sm:gap-6 lg:sticky lg:top-24">
          <div className="p-4 sm:p-8 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl sm:rounded-3xl shadow-card flex flex-col items-center w-full">
            <PoapBadge3D svgContent={eventData.rawSvg} size="xl" interactive={true} />

            <div className="flex items-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 flex-wrap justify-center font-mono">
              {eventData.isSoulbound ? (
                <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full">
                  Soulbound
                </span>
              ) : (
                <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[10px] font-medium uppercase px-2.5 py-1 rounded-full">
                  Transferable
                </span>
              )}
              {eventData.isPublic ? (
                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full">
                  Public Mint Open
                </span>
              ) : hasAllowlist ? (
                <span className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full">
                  Allowlist Protected
                </span>
              ) : (
                <span className="bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full">
                  Signature Pass
                </span>
              )}
            </div>
          </div>

          {/* Social Share & Copy Links */}
          <div className="flex gap-2.5 sm:gap-3 w-full">
            <button
              type="button"
              onClick={handleShareCast}
              className="flex-1 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold rounded-xl text-neutral-900 dark:text-white shadow-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Farcaster</span>
            </button>
            <button
              type="button"
              onClick={handleCopyClaimLink}
              className="flex-1 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold rounded-xl shadow-xs hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-lime-400 dark:text-lime-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* Creator Management Quick Bar */}
          {isCreator && (
            <div className="w-full p-4 sm:p-5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl sm:rounded-3xl shadow-card space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <Settings className="w-4 h-4" />
                  Creator Management
                </span>
                <span className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full uppercase">
                  Host
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href={`/poap/${eventId}/live`}>
                  <button className="w-full py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white rounded-xl hover:bg-neutral-50 flex items-center justify-center gap-1">
                    <QrCode className="w-3 h-3" /> Live QR
                  </button>
                </Link>
                <Link href={`/poap/${eventId}/allowlist`}>
                  <button className="w-full py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white rounded-xl hover:bg-neutral-50 flex items-center justify-center gap-1">
                    <Users className="w-3 h-3" /> Allowlist
                  </button>
                </Link>
                <Link href={`/poap/${eventId}/drop`} className="col-span-2">
                  <button className="w-full py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold rounded-xl hover:bg-neutral-800 flex items-center justify-center gap-1">
                    <Send className="w-3 h-3 text-lime-400 dark:text-lime-600" /> Batch Drop (Max 101)
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Event Details, Eligibility & Claim Hub */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-7 text-left">
          {/* Header & Meta */}
          <div className="space-y-2.5 sm:space-y-3">
            <h1 className="font-bold text-2xl sm:text-4xl lg:text-5xl tracking-tight text-neutral-900 dark:text-white leading-tight">
              {eventData.name}
            </h1>
            {eventData.description && (
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl font-normal">
                {eventData.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2.5 sm:pt-3 text-xs text-neutral-700 dark:text-neutral-300 font-medium border-t border-neutral-100 dark:border-neutral-800">
              {eventData.eventDate > 0 && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-neutral-400" />
                  <span>{formatEventDate(eventData.eventDate)}</span>
                </div>
              )}
              {eventData.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  <span>{eventData.location}</span>
                </div>
              )}
              {eventData.externalUrl && (
                <a
                  href={eventData.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  <Globe className="w-4 h-4" />
                  <span>Official Website</span>
                </a>
              )}
            </div>
          </div>

          {/* Smart Eligibility Checker */}
          <EligibilityCard
            event={eventData}
            isConnected={isConnected}
            userAddress={address}
            hasClaimed={hasClaimed}
            hasValidSignature={hasQuerySignature}
            isCreator={isCreator}
          />

          {/* Claim / Mint CTA Box */}
          <div className="p-4 sm:p-6 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl sm:rounded-3xl shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-base font-bold text-neutral-900 dark:text-white">
                  Claim Attendance Memory
                </div>
                <div className="text-xs text-neutral-500 font-mono mt-0.5">
                  Total Supply: <span className="font-semibold text-neutral-900 dark:text-white">{eventData.totalSupply}</span> claimed
                </div>
              </div>

              {hasClaimed ? (
                <Link href={`/verify/${eventId}/${address}`}>
                  <button className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold flex items-center gap-1.5 shadow-xs">
                    <span>View Certificate</span>
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => setMintModalOpen(true)}
                  disabled={!isConnected}
                  className="px-6 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-xs transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-lime-400 dark:text-lime-600" />
                  <span>Claim POAP</span>
                </button>
              )}
            </div>
          </div>

          {/* Onchain Proof Table */}
          <div className="p-4 sm:p-6 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl sm:rounded-3xl shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-neutral-400" />
                Onchain Cryptographic Proof
              </span>
              <a
                href={`${BASE_SEPOLIA_EXPLORER}/address/${ONCHAIN_POAPS_ADDRESS}#code`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
              >
                BaseScan Contract <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3.5 bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-750 rounded-2xl space-y-1">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase font-bold">CAIP-2 Multichain ID</span>
                <span className="text-neutral-900 dark:text-white font-semibold truncate block text-[11px]">
                  {eventData.multichainId}
                </span>
              </div>

              <div className="p-3.5 bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-750 rounded-2xl space-y-1">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase font-bold">Creator Address</span>
                <a
                  href={`${BASE_SEPOLIA_EXPLORER}/address/${eventData.creator}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-900 dark:text-white hover:text-blue-600 font-semibold truncate block text-[11px]"
                >
                  {eventData.creator}
                </a>
              </div>

              <div className="p-3.5 bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-750 rounded-2xl space-y-1">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase font-bold">SSTORE2 Vector Pointer</span>
                <span className="text-neutral-900 dark:text-white font-semibold truncate block text-[11px]">
                  {eventData.svgImagePointer}
                </span>
              </div>

              <div className="p-3.5 bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-750 rounded-2xl space-y-1">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase font-bold">Allowlist Merkle Root</span>
                <span className="text-neutral-900 dark:text-white font-semibold truncate block text-[11px]">
                  {eventData.allowlistRoot}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal Dialog */}
      <Dialog
        isOpen={mintModalOpen}
        onClose={() => setMintModalOpen(false)}
        title={`Claim POAP #${eventId}`}
        description="Verify parameters and submit transaction on Base Sepolia."
      >
        {txState === "success" ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-2xl bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300 mx-auto flex items-center justify-center font-bold shadow-xs">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">POAP Successfully Claimed!</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Your token is now permanently held in your connected wallet.
              </p>
            </div>
            {txHash && (
              <a
                href={`${BASE_SEPOLIA_EXPLORER}/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                View on BaseScan <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <div className="pt-2 flex gap-2">
              <Link href={`/verify/${eventId}/${address}`} className="flex-1">
                <button className="w-full py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold">
                  View Certificate
                </button>
              </Link>
              <button
                className="flex-1 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white"
                onClick={() => setMintModalOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mint Method Tabs */}
            <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl text-xs font-mono font-medium">
              <button
                type="button"
                onClick={() => setMintMode("public")}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  mintMode === "public" ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold shadow-xs" : "text-neutral-600 dark:text-neutral-400"
                }`}
              >
                PUBLIC MINT
              </button>
              <button
                type="button"
                onClick={() => setMintMode("allowlist")}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  mintMode === "allowlist" ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold shadow-xs" : "text-neutral-600 dark:text-neutral-400"
                }`}
              >
                ALLOWLIST
              </button>
              <button
                type="button"
                onClick={() => setMintMode("signature")}
                className={`flex-1 py-1.5 rounded-lg transition-colors ${
                  mintMode === "signature" ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold shadow-xs" : "text-neutral-600 dark:text-neutral-400"
                }`}
              >
                SIGNATURE
              </button>
            </div>

            {mintMode === "allowlist" && (
              <Textarea
                label="Your Merkle Proof Hashes"
                rows={3}
                placeholder='["0x1234...", "0x5678..."]'
                value={merkleProofInput}
                onChange={(e) => setMerkleProofInput(e.target.value)}
                helperText="Paste your branch proof hashes array exported from the Allowlist Manager."
              />
            )}

            {mintMode === "signature" && (
              <Input
                label="Creator ECDSA Signature (0x...)"
                placeholder="0x..."
                value={customSignature}
                onChange={(e) => setCustomSignature(e.target.value)}
                helperText="Cryptographic signature generated by the event host."
              />
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                className="w-full py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold uppercase tracking-wider"
                onClick={handleClaim}
                disabled={txState === "signing" || txState === "broadcasting"}
              >
                {txState === "signing" ? (
                  <>Confirm in Wallet...</>
                ) : txState === "broadcasting" ? (
                  <>Minting POAP...</>
                ) : (
                  <>Confirm & Claim Badge</>
                )}
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
