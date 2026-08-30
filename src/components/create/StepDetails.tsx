"use client";

import React from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Calendar, MapPin, Globe, FileText, Tag } from "lucide-react";

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
  onChange: (field: keyof EventDetailsForm, value: string) => void;
}

export function StepDetails({ formData, errors, onChange }: StepDetailsProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-neutral-900 dark:text-neutral-100">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Event Details & Inscription
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          These details are permanently stored onchain with your POAP metadata.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-card space-y-5">
        {/* Name */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
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
        </div>

        {/* Description */}
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
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
            <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5 flex items-center gap-1.5">
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
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
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
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
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
  );
}
