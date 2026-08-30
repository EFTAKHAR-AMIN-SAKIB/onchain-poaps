"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAccount, useSignMessage } from "wagmi";
import QRCode from "qrcode";
import { PoapEventData, fetchPoapEvent } from "@/lib/contracts/client";
import { BASE_SEPOLIA_CHAIN_ID } from "@/lib/contracts/address";
import {
  computeSignatureMessageHash,
  buildClaimUrl,
} from "@/lib/crypto/signature";
import { getSignatureTimelockStatus } from "@/lib/utils/time";
import { copyToClipboard, formatAddress } from "@/lib/utils/formatting";
import { PoapBadge3D } from "@/components/poap/PoapBadge3D";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  QrCode,
  Maximize2,
  Minimize2,
  Download,
  Copy,
  Check,
  Clock,
  KeyRound,
  Sparkles,
  ArrowLeft,
  ShieldAlert,
  Loader2,
} from "lucide-react";

export default function LiveEventPage() {
  const params = useParams();
  const eventId = Number(params?.id || 0);

  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [eventData, setEventData] = useState<PoapEventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recipientInput, setRecipientInput] = useState<string>("");
  const [generatedSignature, setGeneratedSignature] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [claimUrl, setClaimUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signError, setSignError] = useState<string | null>(null);

  const projectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPoapEvent(eventId);
        setEventData(data);
        if (typeof window !== "undefined") {
          const defaultUrl = `${window.location.origin}/poap/${eventId}`;
          setClaimUrl(defaultUrl);
          const qr = await QRCode.toDataURL(defaultUrl, {
            width: 512,
            margin: 2,
            color: { dark: "#000000", light: "#ffffff" },
          });
          setQrDataUrl(qr);
        }
      } catch (err) {
        console.error("Failed to load event for live mode:", err);
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

  const timelock = eventData
    ? getSignatureTimelockStatus(eventData.createdAt)
    : null;

  const handleGenerateSignature = async () => {
    if (!recipientInput.trim() || !recipientInput.startsWith("0x")) {
      setSignError("Please enter a valid recipient 0x Ethereum address.");
      return;
    }

    try {
      setIsSigning(true);
      setSignError(null);

      // Compute raw 32-byte message hash
      const messageHash = computeSignatureMessageHash(
        eventId,
        BASE_SEPOLIA_CHAIN_ID,
        recipientInput.trim() as `0x${string}`
      );

      // Creator signs via EIP-191 personal_sign
      const sig = await signMessageAsync({
        message: { raw: messageHash as `0x${string}` },
      });

      setGeneratedSignature(sig);

      // Build target claim URL
      const origin = typeof window !== "undefined" ? window.location.origin : "https://onchain-poaps.vercel.app";
      const targetUrl = buildClaimUrl(
        origin,
        eventId,
        sig as `0x${string}`,
        recipientInput.trim() as `0x${string}`
      );
      setClaimUrl(targetUrl);

      // Generate QR
      const qr = await QRCode.toDataURL(targetUrl, {
        width: 512,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
      setQrDataUrl(qr);
    } catch (err: unknown) {
      console.error("Sign error:", err);
      setSignError(err instanceof Error ? err.message : "Failed to sign pass.");
    } finally {
      setIsSigning(false);
    }
  };

  const toggleFullscreen = () => {
    if (!projectorRef.current) return;
    if (!document.fullscreenElement) {
      projectorRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(claimUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQrPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `POAP_${eventId}_Live_Pass.png`;
    a.click();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4af37] mx-auto" />
        <p className="text-xs font-mono text-slate-400">Loading live event console...</p>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link
          href={`/poap/${eventId}`}
          className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Event #{eventId}
        </Link>
        <div className="flex items-center gap-2">
          <Badge variant="live">Live Event Console</Badge>
          {timelock && (
            <span className="text-xs font-mono text-amber-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {timelock.formattedRemaining}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Fullscreen Projector Display Screen */}
        <div className="lg:col-span-7 space-y-4">
          <div
            ref={projectorRef}
            className={`rounded-3xl bg-gradient-to-b from-[#121620] to-[#08090c] border border-white/15 p-8 sm:p-12 shadow-2xl flex flex-col items-center justify-between text-center relative ${
              isFullscreen ? "h-screen justify-center gap-8 bg-black" : "min-h-[560px]"
            }`}
          >
            {/* Top Event Title in Projector */}
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                Live Attendance Claim
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100 max-w-lg">
                {eventData.name}
              </h2>
              {eventData.location && (
                <p className="text-xs text-slate-400 font-mono">
                  {eventData.location}
                </p>
              )}
            </div>

            {/* High-Contrast QR Code Card */}
            <div className="my-6 p-4 bg-white rounded-2xl shadow-2xl inline-block border-4 border-[#d4af37]">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Scan to Claim POAP"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-slate-400 font-mono text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Instruction Footer in Projector */}
            <div className="space-y-1">
              <div className="text-sm font-bold text-slate-100 flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#e5c158]" />
                Scan with mobile camera to claim your onchain memory
              </div>
              <p className="text-xs text-slate-500 font-mono">
                100% Onchain • Base Sepolia • 1 per attendee
              </p>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Toggle Fullscreen Projector"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Projector Controls Bar */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={toggleFullscreen}
            >
              <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
              Fullscreen Screen Mode
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={downloadQrPng}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download QR PNG
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                  Copied Link
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy Claim URL
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Column: Signature Pass Generator for Creator */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="p-6 rounded-2xl bg-[#12141a] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#0052ff]" />
                Authorized Signature Generator
              </span>
              <Badge variant={isCreator ? "gold" : "default"}>
                {isCreator ? "Creator Access" : "Host Only"}
              </Badge>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Generate an EIP-191 cryptographic attendance pass for a specific wallet address without sending an onchain transaction.
            </p>

            <div className="space-y-3 pt-2">
              <Input
                label="Attendee Wallet Address (0x...)"
                placeholder="0x1234...5678"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                error={signError || undefined}
              />

              <Button
                variant="gold"
                size="md"
                className="w-full"
                onClick={handleGenerateSignature}
                disabled={!isCreator || isSigning}
                isLoading={isSigning}
              >
                <KeyRound className="w-4 h-4 mr-1.5 text-black" />
                Sign Attendance Pass (Zero Gas)
              </Button>

              {!isCreator && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Only the event creator ({formatAddress(eventData.creator)}) can generate authorized signatures.
                  </span>
                </div>
              )}
            </div>

            {generatedSignature && (
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>Pass Signed Successfully!</span>
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px] text-slate-400 break-all">
                  Signature: {generatedSignature}
                </div>
                <div className="text-[11px] text-[#6698ff] break-all pt-1">
                  Claim URL: {claimUrl}
                </div>
              </div>
            )}
          </div>

          {/* 37-Day Validity Details */}
          <div className="p-5 rounded-2xl bg-[#0e1017] border border-white/10 space-y-2 text-xs font-mono text-slate-400">
            <div className="font-bold text-slate-200 uppercase tracking-wider">
              Signature Claim Window Rules
            </div>
            <p className="text-[11px] leading-relaxed">
              Signatures for this event are valid for <strong>37 days</strong> from creation (30-day creator timelock + 7-day grace period). After 37 days, signature minting is permanently closed by contract rules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
