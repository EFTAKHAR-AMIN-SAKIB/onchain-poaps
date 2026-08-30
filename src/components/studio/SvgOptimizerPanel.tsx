"use client";

import React from "react";
import { OptimizationResult } from "@/lib/svg/optimizer";
import { formatBytes } from "@/lib/utils/formatting";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export interface SvgOptimizerPanelProps {
  optimization: OptimizationResult;
}

export function SvgOptimizerPanel({ optimization }: SvgOptimizerPanelProps) {
  const bytes = optimization.optimizedBytes;
  const kb = bytes / 1024;

  return (
    <div className="w-full p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 space-y-4 text-left shadow-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-lime-600 dark:text-lime-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
            ONCHAIN STORAGE
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Optimized for onchain storage</span>
        </div>
      </div>

      {/* 4-Stat Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800">
          <span className="text-[10px] text-neutral-400 uppercase block">SVG SIZE</span>
          <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300 block mt-0.5">
            {formatBytes(optimization.originalBytes)}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800">
          <span className="text-[10px] text-neutral-400 uppercase block">OPTIMIZED</span>
          <span className="text-sm font-bold text-neutral-900 dark:text-white block mt-0.5">
            {formatBytes(optimization.optimizedBytes)}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800">
          <span className="text-[10px] text-neutral-400 uppercase block">SAVED</span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
            {optimization.percentageSaved}%
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800">
          <span className="text-[10px] text-neutral-400 uppercase block">EST. GAS</span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400 block mt-0.5 truncate">
            ~{optimization.estimatedGas.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-sans">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>Self-contained SVG with zero external dependencies. Pure Base SSTORE2 bytecode.</span>
      </div>
    </div>
  );
}
