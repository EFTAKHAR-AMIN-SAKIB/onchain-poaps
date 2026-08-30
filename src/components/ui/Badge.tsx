"use client";

import React from "react";
import { clsx } from "clsx";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "soulbound" | "public" | "allowlist" | "live" | "verified" | "danger";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
}: BadgeProps) {
  const baseStyles = "inline-flex items-center font-mono font-medium rounded-full border";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] tracking-wider",
    md: "px-2.5 py-1 text-xs tracking-wider",
  };

  const variantStyles = {
    default: "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200",
    gold: "bg-lime-100 dark:bg-lime-950/60 border-lime-200 dark:border-lime-800 text-lime-900 dark:text-lime-200",
    soulbound: "bg-purple-100 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200",
    public: "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200",
    allowlist: "bg-blue-100 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200",
    live: "bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 animate-pulse",
    verified: "bg-teal-100 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200",
    danger: "bg-rose-100 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200",
  };

  return (
    <span
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
