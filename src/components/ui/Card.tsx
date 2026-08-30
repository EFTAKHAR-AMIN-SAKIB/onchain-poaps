"use client";

import React, { HTMLAttributes } from "react";
import { clsx } from "clsx";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "gold" | "base" | "none";
  hoverable?: boolean;
}

export function Card({
  className,
  glow = "none",
  hoverable = false,
  children,
  ...props
}: CardProps) {
  const glowStyles = {
    none: "",
    gold: "hover:border-lime-400 dark:hover:border-lime-500/40 hover:shadow-glow",
    base: "hover:border-blue-400 dark:hover:border-blue-500/40 hover:shadow-glow-purple",
  };

  return (
    <div
      className={clsx(
        "rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-6 transition-all duration-200 shadow-card",
        hoverable && "hover:-translate-y-1 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-card-hover",
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
