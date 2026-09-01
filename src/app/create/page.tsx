"use client";

import React, { useState, useCallback } from "react";
import { StepArtwork } from "@/components/create/StepArtwork";
import { StepDetails, EventDetailsForm } from "@/components/create/StepDetails";
import { StepDistribution, DistributionConfig } from "@/components/create/StepDistribution";
import { StepPreview } from "@/components/create/StepPreview";
import { BadgeConfig, generateBadgeSvg } from "@/lib/svg/generator";
import { optimizeSvg, OptimizationResult } from "@/lib/svg/optimizer";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";

export default function CreatePage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Initial Badge & Event Config
  const [badgeConfig, setBadgeConfig] = useState<BadgeConfig>({
    style: "acrylic",
    preset: "crystal",
    shape: "medal",
    material: "crystal",
    depth: "deep",
    reflection: "soft",
    glow: "soft",
    colorPreset: "lime",
    customColor: "#84cc16",
    title: "Testing 1",
    subtitle: "I WAS THERE",
    dateOrYear: new Date().getFullYear().toString(),
    location: "NEW YORK, USA",
    iconValue: "sparkle",
    hasInnerDashedRing: true,
  });

  const [isCustomSvg, setIsCustomSvg] = useState(false);

  // Initial SVG state generated from badgeConfig
  const [artworkSvg, setArtworkSvg] = useState<string>(() => {
    const raw = generateBadgeSvg({
      style: "acrylic",
      preset: "crystal",
      shape: "medal",
      material: "crystal",
      depth: "deep",
      reflection: "soft",
      glow: "soft",
      colorPreset: "lime",
      customColor: "#84cc16",
      title: "Testing 1",
      subtitle: "I WAS THERE",
      dateOrYear: new Date().getFullYear().toString(),
      location: "NEW YORK, USA",
      iconValue: "sparkle",
      hasInnerDashedRing: true,
    });
    return optimizeSvg(raw).optimizedSvg;
  });

  const [optimization, setOptimization] = useState<OptimizationResult | null>(() => {
    const raw = generateBadgeSvg({
      style: "acrylic",
      preset: "crystal",
      shape: "medal",
      material: "crystal",
      depth: "deep",
      reflection: "soft",
      glow: "soft",
      colorPreset: "lime",
      customColor: "#84cc16",
      title: "Testing 1",
      subtitle: "I WAS THERE",
      dateOrYear: new Date().getFullYear().toString(),
      location: "NEW YORK, USA",
      iconValue: "sparkle",
      hasInnerDashedRing: true,
    });
    return optimizeSvg(raw);
  });

  const [details, setDetails] = useState<EventDetailsForm>({
    name: "Testing 1",
    description: "Commemorating active participation, innovation, and attendance at the event.",
    eventDate: new Date().toISOString().split("T")[0],
    location: "New York, USA",
    externalUrl: "https://ethglobal.com",
  });

  const [detailsErrors, setDetailsErrors] = useState<Partial<Record<keyof EventDetailsForm, string>>>({});

  const [distribution, setDistribution] = useState<DistributionConfig>({
    method: "public",
    isSoulbound: true,
    isPublic: true,
    allowlistRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
    flags: 3, // public + soulbound
  });

  const steps = [
    { num: 1, title: "Artwork", subtitle: "Acrylic Studio" },
    { num: 2, title: "Details", subtitle: "Event Metadata" },
    { num: 3, title: "Distribution", subtitle: "Access & Rules" },
    { num: 4, title: "Review", subtitle: "Onchain Register" },
  ];

  // Callback when SVG is generated in studio or uploaded
  const handleArtworkChange = useCallback((svgCode: string, opt: OptimizationResult) => {
    setArtworkSvg(svgCode);
    setOptimization(opt);
  }, []);

  // Sync Studio changes with details form
  const handleBadgeConfigChange = useCallback((newConfig: BadgeConfig) => {
    setBadgeConfig(newConfig);
    setIsCustomSvg(false);

    // Keep metadata form in sync with Studio inputs
    setDetails((prev) => ({
      ...prev,
      name: newConfig.title || prev.name,
      location: newConfig.location || prev.location,
    }));

    const raw = generateBadgeSvg(newConfig);
    const opt = optimizeSvg(raw);
    setArtworkSvg(opt.optimizedSvg);
    setOptimization(opt);
  }, []);

  const handleCustomSvgChange = useCallback((svgCode: string, isCustom: boolean) => {
    setIsCustomSvg(isCustom);
    if (isCustom) {
      const opt = optimizeSvg(svgCode);
      setArtworkSvg(opt.optimizedSvg);
      setOptimization(opt);
    }
  }, []);

  // Real-time bidirectional sync when user edits details form
  const handleDetailChange = useCallback((field: keyof EventDetailsForm, value: string) => {
    setDetails((prev) => {
      const next = { ...prev, [field]: value };

      // If using studio-generated badge, dynamically regenerate and optimize the SVG in real time!
      if (!isCustomSvg) {
        setBadgeConfig((prevConfig) => {
          const updatedConfig: BadgeConfig = {
            ...prevConfig,
            title: field === "name" ? (value.trim() || "ONCHAIN POAP") : prevConfig.title,
            location: field === "location" ? (value.trim().toUpperCase() || "ONCHAIN") : prevConfig.location,
            dateOrYear: field === "eventDate"
              ? (value ? value.split("-")[0] : prevConfig.dateOrYear)
              : prevConfig.dateOrYear,
          };
          const raw = generateBadgeSvg(updatedConfig);
          const opt = optimizeSvg(raw);
          setArtworkSvg(opt.optimizedSvg);
          setOptimization(opt);
          return updatedConfig;
        });
      }

      return next;
    });

    setDetailsErrors((prev) => {
      if (prev[field]) {
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return prev;
    });
  }, [isCustomSvg]);

  const validateDetailsStep = (): boolean => {
    const errs: Partial<Record<keyof EventDetailsForm, string>> = {};
    if (!details.name.trim()) {
      errs.name = "Event name is required.";
    } else if (details.name.length > 128) {
      errs.name = "Event name cannot exceed 128 characters.";
    }

    if (details.description.length > 512) {
      errs.description = "Description cannot exceed 512 characters.";
    }

    if (details.location.length > 128) {
      errs.location = "Location cannot exceed 128 characters.";
    }

    if (details.externalUrl.length > 128) {
      errs.externalUrl = "URL cannot exceed 128 characters.";
    }

    setDetailsErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!artworkSvg) {
        alert("Please generate or upload an SVG badge before proceeding.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateDetailsStep()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10 text-neutral-900 dark:text-neutral-100">
      {/* Header matching exact copy requirements */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-neutral-900 dark:text-white uppercase font-sans">
          CREATE A POAP
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 font-normal">
          Design a collectible that lives permanently onchain.
        </p>
      </div>

      {/* 4-Step Progress System */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-1.5 shadow-card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
          {steps.map((step) => {
            const isDone = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <button
                key={step.num}
                type="button"
                onClick={() => {
                  if (step.num < currentStep) setCurrentStep(step.num as any);
                  else if (step.num === 2 && currentStep === 1 && artworkSvg) setCurrentStep(2);
                  else if (step.num === 3 && currentStep === 2 && validateDetailsStep()) setCurrentStep(3);
                }}
                className={`p-3 rounded-xl text-left transition-all ${
                  isCurrent
                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs font-semibold"
                    : isDone
                    ? "bg-neutral-50 dark:bg-neutral-850 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100"
                    : "text-neutral-400 dark:text-neutral-600 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
                      isCurrent
                        ? "bg-lime-400 text-neutral-900"
                        : isDone
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                        : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {isDone ? <Check className="w-3 h-3" /> : step.num}
                  </div>
                  <div className="text-xs font-semibold truncate">
                    {step.title}
                  </div>
                </div>
                <div className="text-[10px] opacity-70 mt-1 truncate pl-7 font-mono">
                  {step.subtitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <div>
        {currentStep === 1 && (
          <StepArtwork
            config={badgeConfig}
            onConfigChange={handleBadgeConfigChange}
            isCustomSvg={isCustomSvg}
            onCustomSvgChange={handleCustomSvgChange}
            initialTitle={details.name}
            onComplete={handleArtworkChange}
          />
        )}

        {currentStep === 2 && (
          <StepDetails
            formData={details}
            errors={detailsErrors}
            artworkSvg={artworkSvg}
            onChange={handleDetailChange}
          />
        )}

        {currentStep === 3 && (
          <StepDistribution
            config={distribution}
            artworkSvg={artworkSvg}
            onChange={(cfg) => setDistribution(cfg)}
          />
        )}

        {currentStep === 4 && (
          <StepPreview
            details={details}
            distribution={distribution}
            artworkSvg={artworkSvg}
            optimization={optimization}
          />
        )}

        {/* Step Navigation Bar */}
        <div className="max-w-4xl mx-auto pt-8 mt-8 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-750 flex items-center gap-1.5 transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 && (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold flex items-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-xs"
            >
              <span>Next: {steps[currentStep].title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
