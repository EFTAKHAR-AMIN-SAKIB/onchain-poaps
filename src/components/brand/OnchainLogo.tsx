"use client";

import React from "react";
import { clsx } from "clsx";

export interface OnchainLogoProps {
  className?: string;
  variant?: "full" | "symbol";
  theme?: "auto" | "light" | "dark" | "monochrome-black" | "monochrome-white";
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * 12-point scalloped rosette seal generator path
 * Exactly matching the Brand Guide PDF (01 - 10)
 */
const SCALLOP_SEAL_PATH = (() => {
  const points = 12;
  const cx = 50;
  const cy = 50;
  const rOuter = 46;
  const rInner = 38;
  let d = "";

  for (let i = 0; i < points; i++) {
    const a1 = (i * 2 * Math.PI) / points - Math.PI / 2;
    const a2 = ((i + 1) * 2 * Math.PI) / points - Math.PI / 2;
    const aMid = (a1 + a2) / 2;

    const x1 = cx + rOuter * Math.cos(a1);
    const y1 = cy + rOuter * Math.sin(a1);
    const xMid = cx + rInner * Math.cos(aMid);
    const yMid = cy + rInner * Math.sin(aMid);
    const x2 = cx + rOuter * Math.cos(a2);
    const y2 = cy + rOuter * Math.sin(a2);

    if (i === 0) {
      d += `M ${x1.toFixed(2)} ${y1.toFixed(2)} `;
    }
    d += `Q ${xMid.toFixed(2)} ${yMid.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)} `;
  }
  return d + "Z";
})();

/**
 * OnchainSymbol — Standalone brand mark
 * Scalloped seal with lime center disc and bold diagonal chain link
 */
export function OnchainSymbol({
  className,
  size = 32,
  variant = "color",
}: {
  className?: string;
  size?: number | string;
  variant?: "color" | "monochrome-black" | "monochrome-white";
}) {
  const isMonoWhite = variant === "monochrome-white";
  const isMonoBlack = variant === "monochrome-black";

  const sealColor = isMonoWhite ? "#ffffff" : isMonoBlack ? "#000000" : "#101115";
  const discColor = isMonoWhite ? "transparent" : isMonoBlack ? "transparent" : "#C8FF00";
  const linkColor = isMonoWhite ? "#ffffff" : isMonoBlack ? "#000000" : "#101115";

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx("shrink-0 select-none", className)}
      aria-label="Onchain POAPs Symbol"
    >
      {/* 1. Outer 12-point Scalloped Rosette Seal */}
      <path
        d={SCALLOP_SEAL_PATH}
        fill={sealColor}
        stroke={isMonoWhite ? "#ffffff" : isMonoBlack ? "#000000" : "none"}
        strokeWidth={isMonoWhite || isMonoBlack ? 2 : 0}
      />

      {/* 2. Inner Lime Core Disc */}
      <circle
        cx="50"
        cy="50"
        r="28.5"
        fill={discColor}
        stroke={isMonoWhite ? "#ffffff" : isMonoBlack ? "#000000" : "none"}
        strokeWidth={isMonoWhite || isMonoBlack ? 2 : 0}
      />

      {/* 3. Center Diagonal Chain Link Icon (Tilted 45°) */}
      <g transform="translate(50, 50) rotate(-45) translate(-50, -50)">
        {/* Top-Right Loop */}
        <path
          d="M 44 40 L 32 40 C 26.5 40 22 44.5 22 50 C 22 55.5 26.5 60 32 60 L 44 60 C 49.5 60 54 55.5 54 50"
          stroke={linkColor}
          strokeWidth="6.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Bottom-Left Loop */}
        <path
          d="M 56 60 L 68 60 C 73.5 60 78 55.5 78 50 C 78 44.5 73.5 40 68 40 L 56 40 C 50.5 40 46 44.5 46 50"
          stroke={linkColor}
          strokeWidth="6.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}

/**
 * OnchainLogo — Official Primary Horizontal Brand Lockup
 * Recreated with exact vector precision according to Brand Implementation Guide:
 * [Symbol] + ONCHΛIN (with lime core O and chevron A) + — P O A P S —
 */
export function OnchainLogo({
  className,
  variant = "full",
  theme = "auto",
  size = "md",
}: OnchainLogoProps) {
  if (variant === "symbol") {
    const symbolSizes = {
      sm: 24,
      md: 32,
      lg: 40,
      xl: 48,
    };
    return (
      <OnchainSymbol
        size={symbolSizes[size]}
        className={className}
        variant={
          theme === "monochrome-white"
            ? "monochrome-white"
            : theme === "monochrome-black"
            ? "monochrome-black"
            : "color"
        }
      />
    );
  }

  const heightClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
    xl: "h-14",
  };

  const symbolSizes = {
    sm: 30,
    md: 36,
    lg: 44,
    xl: 52,
  };

  const isDarkClass =
    theme === "dark"
      ? "text-white"
      : theme === "light"
      ? "text-[#101115]"
      : "text-[#101115] dark:text-white";

  const ruleColorClass =
    theme === "dark"
      ? "bg-neutral-600"
      : theme === "light"
      ? "bg-neutral-400"
      : "bg-neutral-400 dark:bg-neutral-600";

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-3 select-none",
        heightClasses[size],
        className
      )}
    >
      {/* Symbol Seal Mark */}
      <OnchainSymbol
        size={symbolSizes[size]}
        variant={
          theme === "monochrome-white"
            ? "monochrome-white"
            : theme === "monochrome-black"
            ? "monochrome-black"
            : "color"
        }
      />

      {/* Vector Wordmark Lockup */}
      <div className="flex flex-col justify-center text-left">
        {/* Top: ONCHΛIN with styled O core and Lambda A */}
        <div
          className={clsx(
            "font-black tracking-tight leading-none font-sans flex items-center gap-0.5",
            isDarkClass,
            size === "sm"
              ? "text-base tracking-wider"
              : size === "md"
              ? "text-lg tracking-wider"
              : size === "lg"
              ? "text-xl tracking-widest"
              : "text-2xl tracking-widest"
          )}
        >
          {/* Custom Stylized Letter O with Lime Center Pupil */}
          <span className="relative inline-flex items-center justify-center">
            <span>O</span>
            <span className="absolute w-1.5 h-1.5 rounded-full bg-[#C8FF00] shadow-[0_0_4px_rgba(200,255,0,0.8)]" />
          </span>
          <span>NCH</span>
          {/* Stylized Chevron Lambda Λ for A */}
          <span className="inline-block transform scale-y-95">Λ</span>
          <span>IN</span>
        </div>

        {/* Bottom: — P O A P S — Flanked Line Lockup */}
        <div className="flex items-center gap-2 mt-1">
          <span className={clsx("h-[1px] flex-1 min-w-[12px]", ruleColorClass)} />
          <span
            className={clsx(
              "font-mono font-bold tracking-[0.28em] text-[8px] sm:text-[9px] uppercase leading-none",
              theme === "dark"
                ? "text-neutral-300"
                : theme === "light"
                ? "text-neutral-600"
                : "text-neutral-600 dark:text-neutral-300"
            )}
          >
            POAPS
          </span>
          <span className={clsx("h-[1px] flex-1 min-w-[12px]", ruleColorClass)} />
        </div>
      </div>
    </div>
  );
}
