"use client";

import React from "react";
import Link from "next/link";
import { PoapEventData } from "@/lib/contracts/client";
import { PoapBadge3D } from "./PoapBadge3D";
import { formatEventDate, formatAddress } from "@/lib/utils/formatting";
import { Calendar, MapPin, User, ArrowRight, Check } from "lucide-react";

export interface PoapCardProps {
  event: PoapEventData;
  isOwned?: boolean;
}

export function PoapCard({ event, isOwned = false }: PoapCardProps) {
  const hasAllowlist =
    event.allowlistRoot &&
    event.allowlistRoot !== "0x0000000000000000000000000000000000000000000000000000000000000000";

  return (
    <Link
      href={`/poap/${event.eventId}`}
      className="group relative bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 shadow-card hover:shadow-card-hover hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-200 flex flex-col justify-between text-left hover:-translate-y-1"
    >
      {/* Top Badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-mono text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded-full">
          #{event.eventId}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {isOwned && (
            <span className="bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300 text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-2.5 h-2.5" /> Owned
            </span>
          )}
          {event.isSoulbound ? (
            <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-mono font-medium uppercase px-2 py-0.5 rounded-full">
              Soulbound
            </span>
          ) : (
            <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-mono font-medium uppercase px-2 py-0.5 rounded-full">
              Transferable
            </span>
          )}
          {event.isPublic ? (
            <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full">
              Public
            </span>
          ) : hasAllowlist ? (
            <span className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full">
              Allowlist
            </span>
          ) : (
            <span className="bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full">
              Signature
            </span>
          )}
        </div>
      </div>

      {/* 3D Badge Centerpiece */}
      <div className="my-4 flex items-center justify-center py-2">
        <PoapBadge3D
          svgContent={event.rawSvg}
          size="md"
          interactive={false}
          fallbackTitle={event.name}
          className="group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
        />
      </div>

      {/* Content Info */}
      <div className="space-y-3 mt-2">
        <div>
          <h3 className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {event.name}
          </h3>
          {event.description && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
              {event.description}
            </p>
          )}
        </div>

        {/* Metadata */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          {event.eventDate > 0 && (
            <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>{formatEventDate(event.eventDate)}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-neutral-500 flex items-center gap-1 font-mono">
              <User className="w-3 h-3 text-neutral-400" />
              {formatAddress(event.creator)}
            </span>
            <span className="font-mono text-neutral-700 dark:text-neutral-300 font-semibold bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md text-[10px]">
              {event.totalSupply ?? 0} MINTED
            </span>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="pt-2 flex items-center justify-between text-xs font-semibold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors border-t border-neutral-100 dark:border-neutral-800">
          <span>View Details & Mint</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
