"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAccount, useWriteContract } from "wagmi";
import { decodeEventLog } from "viem";
import confetti from "canvas-confetti";
import { ONCHAIN_POAPS_ADDRESS, BASE_SEPOLIA_EXPLORER } from "@/lib/contracts/address";
import { ONCHAIN_POAPS_ABI } from "@/lib/contracts/abi";
import { publicClient } from "@/lib/contracts/client";
import { parseContractError } from "@/lib/utils/errorHandling";
import { formatEventDate, formatBytes } from "@/lib/utils/formatting";
import { PoapBadge3D } from "@/components/poap/PoapBadge3D";
import { Badge } from "@/components/ui/Badge";
import { EventDetailsForm } from "./StepDetails";
import { DistributionConfig } from "./StepDistribution";
import { OptimizationResult } from "@/lib/svg/optimizer";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ShieldAlert,
  Loader2,
} from "lucide-react";

export interface StepPreviewProps {
  artworkSvg: string;
  optimization: OptimizationResult | null;
  details: EventDetailsForm;
  distribution: DistributionConfig;
}

export function StepPreview({
  artworkSvg,
  optimization,
  details,
  distribution,
}: StepPreviewProps) {
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [txState, setTxState] = useState<"idle" | "signing" | "broadcasting" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [createdEventId, setCreatedEventId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!isConnected) {
      setErrorMessage("Please connect your wallet first.");
      return;
    }

    try {
      setTxState("signing");
      setErrorMessage(null);

      const eventDateTimestamp = details.eventDate
        ? BigInt(Math.floor(new Date(details.eventDate).getTime() / 1000))
        : 0n;

      const hash = await writeContractAsync({
        address: ONCHAIN_POAPS_ADDRESS,
        abi: ONCHAIN_POAPS_ABI,
        functionName: "registerEvent",
        args: [
          details.name.trim(),
          details.description.trim(),
          eventDateTimestamp,
          details.location.trim(),
          distribution.allowlistRoot,
          artworkSvg.trim(),
          details.externalUrl.trim(),
          distribution.flags,
        ],
      });

      setTxHash(hash);
      setTxState("broadcasting");

      // Wait for receipt & parse NewEvent log to extract eventId
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      let foundId: number | null = null;
      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: ONCHAIN_POAPS_ABI,
            data: log.data,
            topics: log.topics,
          });
          if (decoded.eventName === "NewEvent") {
            const args = decoded.args as { eventId: bigint; name: string };
            foundId = Number(args.eventId);
            break;
          }
        } catch {
          // not our event log
        }
      }

      // Fallback: if not parsed from receipt, query totalEvents
      if (!foundId) {
        const total = await publicClient.readContract({
          address: ONCHAIN_POAPS_ADDRESS,
          abi: ONCHAIN_POAPS_ABI,
          functionName: "totalEvents",
        });
        foundId = Number(total);
      }

      setCreatedEventId(foundId);
      setTxState("success");

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#84cc16", "#3b82f6", "#a855f7", "#ec4899"],
        });
      } catch {}
    } catch (err: unknown) {
      console.error("Registration error:", err);
      setTxState("error");
      setErrorMessage(parseContractError(err));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-neutral-900 dark:text-neutral-100">
      {/* Success View */}
      {txState === "success" && createdEventId !== null ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-neutral-900 border border-emerald-500/40 text-center space-y-6 shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              POAP Successfully Registered Onchain!
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Your memory is permanently inscribed on Base Sepolia as{" "}
              <strong className="text-neutral-900 dark:text-white font-mono">Event #{createdEventId}</strong>.
            </p>
          </div>

          <div className="flex justify-center my-4">
            <PoapBadge3D svgContent={artworkSvg} size="md" />
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 max-w-md mx-auto space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-neutral-500">Event ID:</span>
              <span className="font-bold text-neutral-900 dark:text-white">#{createdEventId}</span>
            </div>
            {txHash && (
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Transaction:</span>
                <a
                  href={`${BASE_SEPOLIA_EXPLORER}/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {txHash.slice(0, 10)}...{txHash.slice(-6)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href={`/poap/${createdEventId}`}>
              <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 shadow-xs">
                <Sparkles className="w-4 h-4 text-lime-400 dark:text-lime-600" />
                <span>View POAP & Distribution Hub</span>
              </button>
            </Link>
            {distribution.method === "signature" && (
              <Link href={`/poap/${createdEventId}/live`}>
                <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-semibold hover:bg-neutral-50 shadow-xs">
                  Open Live Event Projector Mode
                </button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* Preview & Confirmation View */
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Preview & Confirm Onchain Inscription
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Review your artwork, metadata, and distribution settings before broadcasting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-card items-center">
            {/* Artwork 3D Display */}
            <div className="md:col-span-5 flex flex-col items-center justify-center gap-3">
              <PoapBadge3D svgContent={artworkSvg} size="md" />
              {optimization && (
                <span className="text-[11px] font-mono text-neutral-400">
                  Storage size: {formatBytes(optimization.optimizedBytes)}
                </span>
              )}
            </div>

            {/* Metadata Summary Table */}
            <div className="md:col-span-7 space-y-4 text-left">
              <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  {details.name || "Untitled POAP"}
                </h3>
                {details.description && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mt-1">
                    {details.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs font-mono">
                <div>
                  <span className="text-neutral-400 block text-[10px]">TRANSFERABILITY</span>
                  <Badge variant={distribution.isSoulbound ? "soulbound" : "default"}>
                    {distribution.isSoulbound ? "Soulbound" : "Transferable"}
                  </Badge>
                </div>

                <div>
                  <span className="text-neutral-400 block text-[10px]">DISTRIBUTION</span>
                  <Badge variant={distribution.isPublic ? "public" : "allowlist"}>
                    {distribution.method.toUpperCase()}
                  </Badge>
                </div>

                {details.eventDate && (
                  <div>
                    <span className="text-neutral-400 block text-[10px]">EVENT DATE</span>
                    <span className="text-neutral-800 dark:text-neutral-200">
                      {formatEventDate(
                        Math.floor(new Date(details.eventDate).getTime() / 1000)
                      )}
                    </span>
                  </div>
                )}

                {details.location && (
                  <div>
                    <span className="text-neutral-400 block text-[10px]">LOCATION</span>
                    <span className="text-neutral-800 dark:text-neutral-200 truncate block">
                      {details.location}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-neutral-400 block text-[10px]">CONTRACT BIT FLAGS</span>
                  <span className="text-neutral-900 dark:text-white font-bold">flags = {distribution.flags}</span>
                </div>

                <div>
                  <span className="text-neutral-400 block text-[10px]">NETWORK</span>
                  <span className="text-neutral-800 dark:text-neutral-200">Base Sepolia (84532)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Important Onchain Permanence Warning */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-left">
              <div className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                Permanent Onchain Inscription
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                Once registered, the SVG artwork and metadata will be permanently stored on Base Sepolia. The creator control window will be active for 30 days.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleRegister}
              disabled={txState === "signing" || txState === "broadcasting"}
              className="w-full py-4 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-50 transition-all shadow-xs flex items-center justify-center gap-2"
            >
              {txState === "signing" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirm in Wallet...</span>
                </>
              ) : txState === "broadcasting" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Inscribing on Base Sepolia...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-lime-400 dark:text-lime-600" />
                  <span>Register POAP on Base Sepolia</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
