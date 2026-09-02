"use client";

import React, { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import {
  Calendar,
  MapPin,
  Globe,
  FileText,
  Tag,
  Sparkles,
  Wand2,
  Shuffle,
  Lightbulb,
} from "lucide-react";
import {
  SAMPLE_CATEGORIES,
  SampleEventTemplate,
} from "@/lib/templates/sampleEvents";

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
  onRandomizeIdea?: (category?: string) => void;
  onSelectTemplate?: (template: SampleEventTemplate) => void;
}

export function StepDetails({
  formData,
  errors,
  artworkSvg,
  onChange,
  onRandomizeIdea,
}: StepDetailsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isShuffling, setIsShuffling] = useState(false);

  const handleTriggerRandomize = (cat?: string) => {
    const selectedCat = cat || activeCategory;
    setIsShuffling(true);
    if (onRandomizeIdea) {
      onRandomizeIdea(selectedCat);
    }
    setTimeout(() => setIsShuffling(false), 400);
  };

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId);
    handleTriggerRandomize(catId);
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-neutral-900 dark:text-neutral-100">
      {/* Header with Title and Quick Randomize Pill */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-4xl mx-auto text-center sm:text-left">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Event Details & Metadata
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            These details are permanently inscribed into the Base Sepolia smart contract storage.
          </p>
        </div>

        {onRandomizeIdea && (
          <button
            type="button"
            onClick={() => handleTriggerRandomize()}
            className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-lime-400/20 dark:bg-lime-950/60 border border-lime-400/60 dark:border-lime-700/60 text-lime-800 dark:text-lime-300 hover:bg-lime-400/30 dark:hover:bg-lime-900/50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
          >
            <Shuffle
              className={`w-3.5 h-3.5 text-lime-600 dark:text-lime-400 ${
                isShuffling ? "animate-spin" : ""
              }`}
            />
            <span>🎲 Randomize Idea</span>
          </button>
        )}
      </div>

      {/* Interactive Inspiration & Category Chips Bar */}
      {onRandomizeIdea && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850/80 border border-neutral-200/80 dark:border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Explore Realistic Sample Ideas by Category:</span>
            </div>
            <span className="text-[11px] text-neutral-400 hidden sm:inline">
              Click any category to load a curated template
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {SAMPLE_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold shadow-xs"
                      : "bg-white dark:bg-neutral-800 border border-neutral-200/70 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-750"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-start">
        {/* Left Column: Compact Live POAP Plaque Summary */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-card flex lg:flex-col items-center gap-3.5 sm:gap-4 text-left lg:text-center">
            <div className="w-16 h-16 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center drop-shadow-md">
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

            <div className="space-y-0.5 sm:space-y-1 sm:border-t sm:border-neutral-100 sm:dark:border-neutral-800 sm:pt-3 w-full">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 hidden sm:flex items-center justify-center gap-1.5 mb-1">
                <Sparkles className="w-3 h-3 text-lime-500" />
                <span>COLLECTIBLE SUMMARY</span>
              </div>
              <div className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white truncate">
                {formData.name || "Untitled Event"}
              </div>
              <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 truncate">
                {formData.location || "Location TBD"} • {formData.eventDate || "Date TBD"}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Inputs */}
        <div className="lg:col-span-8 p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-card space-y-4 sm:space-y-6 text-left">
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
              placeholder="e.g. ETHGlobal Cannes 2026 Opening Night"
              value={formData.name}
              onChange={(e) => onChange("name", e.target.value)}
              maxLength={128}
              error={errors.name}
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              The primary title stored in the smart contract and displayed on collector feeds.
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
            <p className="text-[11px] text-neutral-400 mt-1">
              Provides context to holders when inspecting their onchain badge history.
            </p>
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
                placeholder="e.g. Cannes, France or Discord Stage"
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
              placeholder="https://ethglobal.com/events/cannes"
              value={formData.externalUrl}
              onChange={(e) => onChange("externalUrl", e.target.value)}
              maxLength={128}
              error={errors.externalUrl}
            />
            <p className="text-[11px] text-neutral-400 mt-1">
              Link to event website, registration page, or project portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
