"use client";

import React, { useState, useEffect } from "react";
import { getCreatorTimelockStatus, getSignatureTimelockStatus } from "@/lib/utils/time";
import { Clock, Lock } from "lucide-react";

export interface TimelockBadgeProps {
  createdAtSeconds: number;
  type: "creator" | "signature";
}

export function TimelockBadge({ createdAtSeconds, type }: TimelockBadgeProps) {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const status =
    type === "creator"
      ? getCreatorTimelockStatus(createdAtSeconds)
      : getSignatureTimelockStatus(createdAtSeconds);

  if (status.isExpired) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-xs font-mono">
        <Lock className="w-3 h-3" />
        <span>{type === "creator" ? "Creator Window Closed" : "Signature Window Expired"}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-mono">
      <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 animate-pulse" />
      <span>
        {type === "creator" ? "Creator Controls: " : "Claim Window: "}
        <strong className="text-amber-900 dark:text-amber-200">{status.formattedRemaining}</strong>
      </span>
    </div>
  );
}
