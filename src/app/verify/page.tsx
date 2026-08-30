"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { isAddress, getAddress } from "viem";
import { Input } from "@/components/ui/Input";
import { ShieldCheck, Search, Database, Layers, ExternalLink } from "lucide-react";

export default function VerifySearchPage() {
  const router = useRouter();
  const [addressInput, setAddressInput] = useState("");
  const [eventIdInput, setEventIdInput] = useState("0");
  const [error, setError] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedAddress = addressInput.trim();
    const eventIdNum = parseInt(eventIdInput.trim(), 10);

    if (!isAddress(trimmedAddress, { strict: false })) {
      setError("Please provide a valid Ethereum wallet address (0x...).");
      return;
    }

    if (isNaN(eventIdNum) || eventIdNum < 0) {
      setError("Please provide a valid numeric Event ID.");
      return;
    }

    setError(null);
    const checksummed = getAddress(trimmedAddress);
    router.push(`/verify/${eventIdNum}/${checksummed}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16 space-y-10 text-center text-neutral-900 dark:text-neutral-100">
      <div className="space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-lime-100 dark:bg-lime-950/50 text-lime-700 dark:text-lime-300 mx-auto flex items-center justify-center font-bold shadow-xs">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="font-bold text-3xl sm:text-4xl tracking-tight text-neutral-900 dark:text-white">
          Zero-Trust Verification
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">
          Cryptographically verify whether any wallet holds an Onchain POAP with verifiable Base Sepolia receipts.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleVerify}
        className="p-8 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl space-y-6 text-left shadow-card"
      >
        <div className="space-y-4">
          <Input
            label="Holder Wallet Address (0x...)"
            placeholder="0x1234567890abcdef..."
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            error={error || undefined}
          />

          <Input
            label="POAP Event ID (#)"
            placeholder="0"
            type="number"
            min="0"
            value={eventIdInput}
            onChange={(e) => setEventIdInput(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Verify Onchain Proof</span>
        </button>
      </form>

      {/* Protocol Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-2">
        <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl shadow-card space-y-1.5">
          <div className="text-xs font-semibold text-neutral-900 dark:text-white">100% Direct RPC</div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Directly reads contract storage without third-party indexed servers.
          </p>
        </div>
        <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl shadow-card space-y-1.5">
          <div className="text-xs font-semibold text-neutral-900 dark:text-white">CAIP-2 Identifiers</div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Multi-chain interoperable standard across Ethereum L1 & Layer 2 networks.
          </p>
        </div>
        <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl shadow-card space-y-1.5">
          <div className="text-xs font-semibold text-neutral-900 dark:text-white">BaseScan Receipts</div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Every verification links directly to the immutable transaction block log.
          </p>
        </div>
      </div>
    </div>
  );
}
