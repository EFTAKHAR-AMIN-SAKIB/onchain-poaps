"use client";

import React, { useState } from "react";
import { Hex } from "viem";
import { parseAllowlistInput, buildMerkleTree, MerkleTreeResult } from "@/lib/crypto/merkle";
import { Textarea } from "@/components/ui/Input";
import {
  Globe,
  Users,
  QrCode,
  Send,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export type DistributionMethod = "public" | "allowlist" | "signature" | "creator";

export interface DistributionConfig {
  method: DistributionMethod;
  isSoulbound: boolean;
  isPublic: boolean;
  allowlistRoot: Hex;
  allowlistRawText?: string;
  allowlistResult?: MerkleTreeResult;
  flags: number; // 0, 1, 2, 3
}

export interface StepDistributionProps {
  config: DistributionConfig;
  onChange: (config: DistributionConfig) => void;
}

export function StepDistribution({ config, onChange }: StepDistributionProps) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [allowlistInput, setAllowlistInput] = useState(config.allowlistRawText || "");
  const [merkleResult, setMerkleResult] = useState<MerkleTreeResult | null>(config.allowlistResult || null);

  const calculateFlags = (isPublic: boolean, isSoulbound: boolean): number => {
    if (isSoulbound && isPublic) return 3;
    if (isPublic) return 2;
    if (isSoulbound) return 1;
    return 0;
  };

  const handleSelectMethod = (method: DistributionMethod) => {
    const isPublic = method === "public";
    const flags = calculateFlags(isPublic, config.isSoulbound);
    onChange({
      ...config,
      method,
      isPublic,
      flags,
    });
  };

  const handleToggleSoulbound = (isSoulbound: boolean) => {
    const flags = calculateFlags(config.isPublic, isSoulbound);
    onChange({
      ...config,
      isSoulbound,
      flags,
    });
  };

  const handleAllowlistTextChange = (text: string) => {
    setAllowlistInput(text);
    const parsed = parseAllowlistInput(text);
    if (parsed.validAddresses.length > 0) {
      const tree = buildMerkleTree(parsed.validAddresses);
      setMerkleResult(tree);
      onChange({
        ...config,
        allowlistRoot: tree.root,
        allowlistRawText: text,
        allowlistResult: tree,
      });
    } else {
      setMerkleResult(null);
      onChange({
        ...config,
        allowlistRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
        allowlistRawText: text,
        allowlistResult: undefined,
      });
    }
  };

  const distributionOptions = [
    {
      id: "public" as const,
      title: "Open to Everyone",
      subtitle: "Public Mint",
      description:
        "Anyone with a wallet can claim 1 POAP immediately. You can toggle public mint on or off anytime during the 30-day creator window.",
      icon: Globe,
      colorBg: "bg-lime-100 dark:bg-lime-950/50",
      colorText: "text-lime-700 dark:text-lime-300",
      badge: "Most Popular",
    },
    {
      id: "allowlist" as const,
      title: "Selected Guests",
      subtitle: "Allowlist (Merkle Tree)",
      description:
        "Upload a guest list of wallet addresses. Only invited wallets with cryptographic Merkle proofs can claim.",
      icon: Users,
      colorBg: "bg-purple-100 dark:bg-purple-950/50",
      colorText: "text-purple-700 dark:text-purple-300",
      badge: "Curated",
    },
    {
      id: "signature" as const,
      title: "Live Event Mode",
      subtitle: "Signature & QR Passes",
      description:
        "Generate ECDSA signature claim passes and display full-screen QR codes on event screens. Valid for 37 days.",
      icon: QrCode,
      colorBg: "bg-sky-100 dark:bg-sky-950/50",
      colorText: "text-sky-700 dark:text-sky-300",
      badge: "Conferences",
    },
    {
      id: "creator" as const,
      title: "Direct Delivery",
      subtitle: "Creator Batch Drop",
      description:
        "Directly airdrop tokens to up to 101 attendee wallets per transaction. Recipients don't need to pay gas.",
      icon: Send,
      colorBg: "bg-orange-100 dark:bg-orange-950/50",
      colorText: "text-orange-700 dark:text-orange-300",
      badge: "Zero Friction",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-neutral-900 dark:text-neutral-100">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Distribution Strategy & Rules
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Choose how attendees will receive this POAP and set token transferability.
        </p>
      </div>

      {/* 1. Distribution Method Cards */}
      <div className="space-y-3">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
          How should people receive this POAP?
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {distributionOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = config.method === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectMethod(opt.id)}
                className={`p-6 rounded-3xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-md -translate-y-0.5"
                    : "bg-white dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 shadow-card"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        isSelected
                          ? "bg-white/10 dark:bg-neutral-900/10 text-white dark:text-neutral-900"
                          : `${opt.colorBg} ${opt.colorText}`
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-white/20 dark:bg-neutral-900/10 text-white dark:text-neutral-900"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      {opt.badge}
                    </span>
                  </div>
                  <h3
                    className={`text-sm font-bold ${
                      isSelected ? "text-white dark:text-neutral-900" : "text-neutral-900 dark:text-white"
                    }`}
                  >
                    {opt.title}
                  </h3>
                  <div
                    className={`text-xs font-mono mt-0.5 ${
                      isSelected ? "text-lime-300 dark:text-lime-700" : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    {opt.subtitle}
                  </div>
                  <p
                    className={`text-xs mt-2 leading-relaxed ${
                      isSelected ? "text-neutral-300 dark:text-neutral-600" : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    {opt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Allowlist Upload Subsection */}
      {config.method === "allowlist" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                Upload Guest List (Addresses)
              </span>
            </div>
            <span className="text-xs text-neutral-400">
              CSV, TXT, or paste
            </span>
          </div>

          <Textarea
            rows={5}
            placeholder="Paste addresses separated by commas or new lines:&#10;0x1234...5678&#10;0xabcd...ef01"
            value={allowlistInput}
            onChange={(e) => handleAllowlistTextChange(e.target.value)}
            helperText="You can also update this allowlist root once after creation in your Creator Dashboard."
          />

          {merkleResult && merkleResult.entries.length > 0 && (
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 space-y-2 border border-neutral-200/70 dark:border-neutral-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Valid Guest Addresses:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {merkleResult.entries.length} valid
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500">Computed Merkle Root:</span>
                <span className="font-mono text-[11px] text-neutral-700 dark:text-neutral-300 truncate max-w-[280px]">
                  {merkleResult.root}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Transferability Choice */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-card space-y-4">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
          Token Transferability
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleToggleSoulbound(true)}
            className={`p-5 rounded-2xl border text-left transition-all ${
              config.isSoulbound
                ? "bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 shadow-xs"
                : "bg-neutral-50 dark:bg-neutral-850 border-neutral-200/70 dark:border-neutral-800 hover:bg-neutral-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                Soulbound (Recommended)
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Non-transferable. Permanently bound to the recipient's wallet. Ideal for authentic Proof of Attendance.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleToggleSoulbound(false)}
            className={`p-5 rounded-2xl border text-left transition-all ${
              !config.isSoulbound
                ? "bg-neutral-100 dark:bg-neutral-800 border-neutral-400 dark:border-neutral-600 shadow-xs"
                : "bg-neutral-50 dark:bg-neutral-850 border-neutral-200/70 dark:border-neutral-800 hover:bg-neutral-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Unlock className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                Transferable Token
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Tradable ERC-1155 token. Can be transferred or traded between wallets.
            </p>
          </button>
        </div>
      </div>

      {/* 3. Technical Contract Bit Flags Expandable Section */}
      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full flex items-center justify-between text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            Technical Details (Solidity Bit Flags & Timelocks)
          </span>
          {showTechnicalDetails ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showTechnicalDetails && (
          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 space-y-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <div className="flex items-center justify-between">
              <span>Calculated Contract Flag:</span>
              <span className="font-bold text-neutral-900 dark:text-white">
                flags = {config.flags} (
                {config.flags === 0
                  ? "Private & Transferable"
                  : config.flags === 1
                  ? "Private & Soulbound"
                  : config.flags === 2
                  ? "Public & Transferable"
                  : "Public & Soulbound"}
                )
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Creator Timelock:</span>
              <span className="text-neutral-800 dark:text-neutral-200">30 days from registration</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Signature Claim Window:</span>
              <span className="text-neutral-800 dark:text-neutral-200">37 days (30d + 7d grace)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Allowlist Merkle Root:</span>
              <span className="text-neutral-800 dark:text-neutral-200 truncate max-w-[200px]">
                {config.allowlistRoot}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
