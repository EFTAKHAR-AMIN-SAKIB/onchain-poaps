"use client";

import React from "react";
import { OptimizationResult } from "@/lib/svg/optimizer";
import { formatBytes } from "@/lib/utils/formatting";
import { Zap, ShieldCheck } from "lucide-react";

export interface SvgOptimizerPanelProps {
  optimization: OptimizationResult;
}

export function SvgOptimizerPanel({ optimization }: SvgOptimizerPanelProps) {
  const bytes = optimization.optimizedBytes;
  const kb = bytes / 1024;

  let badgeColor = "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
  let tierLabel = "Ultra Low Gas (< 1 KB)";

  if (kb > 3) {
    badgeColor = "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800";
    tierLabel = "Heavy Payload (> 3 KB)";
  } else if (kb > 1) {
    badgeColor = "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    tierLabel = "Optimal Inscription (1-3 KB)";
  }

  return (
    <div className="w-full p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 space-y-4 text-left shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-lime-600 dark:text-lime-400" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
            SSTORE2 Gas Optimizer
          </span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${badgeColor}`}
        >
          {tierLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 space-y-1">
          <span className="text-[10px] text-neutral-400 uppercase block">Size Onchain</span>
          <span className="text-base font-bold text-neutral-900 dark:text-white block">
            {formatBytes(optimization.optimizedBytes)}
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
            Saved {optimization.percentageSaved}% gas bytes
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 space-y-1">
          <span className="text-[10px] text-neutral-400 uppercase block">Est. SSTORE2 Cost</span>
          <span className="text-base font-bold text-blue-600 dark:text-blue-400 block">
            ~{optimization.estimatedGas.toLocaleString()} gas
          </span>
          <span className="text-[10px] text-neutral-400">
            Permanent Base storage
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>Sanitized • No external bitmap or script references</span>
      </div>
    </div>
  );
}
