"use client";

import React from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Calendar, MapPin, Globe, FileText, Tag, Sparkles } from "lucide-react";

export interface EventDetailsForm {
  name: string;
  description: string;
  eventDate: string; // YYYY-MM-DD
  location: string;
  externalUrl: string;
}

export interface StepDetailsProps {
  formData: EventDetailsForm;
  errors: Partial<Record<keyof EventDetailsForm, string>>;
  artworkSvg?: string;
  onChange: (field: keyof EventDetailsForm, value: string) => void;
}

export function StepDetails({
  formData,
  errors,
  artworkSvg,
  onChange,
}: StepDetailsProps) {
  return (
    <div className="space-y-8 text-neutral-900 dark:text-neutral-100">
      {/* Header */}
      <div className="text-center space-y-1.5 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Event Details & Metadata
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          These details are permanently inscribed into the Base Sepolia contract.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Compact Live POAP Plaque Summary */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-card text-center space-y-4">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-lime-500" />
              <span>COLLECTIBLE SUMMARY</span>
            </div>

            {/* Rendered Compact SVG */}
            <div className="w-48 h-48 mx-auto flex items-center justify-center drop-shadow-md">
              {artworkSvg ? (
                <div
                  className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: artworkSvg }}
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-mono text-neutral-400">
                  No Artwork
                </div>
              )}
            </div>

            {/* Live Name */}
            <div className="space-y-1 border-t border-neutral-100 dark:border-neutral-800 pt-3">
              <div className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                {formData.name || "Untitled Event"}
              </div>
              <div className="text-[11px] font-mono text-neutral-400 truncate">
                {formData.location || "Location TBD"} • {formData.eventDate || "Date TBD"}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Inputs */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-card space-y-6 text-left">
          {/* Name */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                Event Name <span className="text-lime-600 dark:text-lime-400">*</span>
              </span>
              <span className="font-mono text-[11px] text-neutral-400">
                {formData.name.length} / 128
              </span>
            </div>
            <Input
              placeholder="e.g. ETHGlobal Denver 2026 Opening Night"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              maxLength={128}
              error={errors.name}
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              The primary title stored in the smart contract.
            </p>
          </div>

          {/* Description */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-neutral-400" />
                Event Description (Optional)
              </span>
              <span className="font-mono text-[11px] text-neutral-400">
                {formData.description.length} / 512
              </span>
            </div>
            <Textarea
              rows={3}
              placeholder="A brief summary of what happened, who attended, and why this memory is significant..."
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
              maxLength={512}
              error={errors.description}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Event Date */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                Event Date
              </span>
              <Input
                type="date"
                value={formData.eventDate}
                onChange={(e) => onChange("eventDate", e.target.value)}
                error={errors.eventDate}
              />
            </div>

            {/* Location */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  Location
                </span>
                <span className="font-mono text-[11px] text-neutral-400">
                  {formData.location.length} / 128
                </span>
              </div>
              <Input
                placeholder="e.g. Denver, CO or Discord Stage"
                value={formData.location}
                onChange={(e) => onChange("location", e.target.value)}
                maxLength={128}
                error={errors.location}
              />
            </div>
          </div>

          {/* External URL */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-neutral-400" />
                External Website / Project Link
              </span>
              <span className="font-mono text-[11px] text-neutral-400">
                {formData.externalUrl.length} / 128
              </span>
            </div>
            <Input
              placeholder="https://ethglobal.com/events/denver"
              value={formData.externalUrl}
              onChange={(e) => onChange("externalUrl", e.target.value)}
              maxLength={128}
              error={errors.externalUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
