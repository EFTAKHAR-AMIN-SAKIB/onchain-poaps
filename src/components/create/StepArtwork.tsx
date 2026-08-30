"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { BadgeCanvas } from "@/components/studio/BadgeCanvas";
import { SvgOptimizerPanel } from "@/components/studio/SvgOptimizerPanel";
import { sanitizeSvg } from "@/lib/svg/sanitizer";
import { optimizeSvg, OptimizationResult } from "@/lib/svg/optimizer";
import { Textarea } from "@/components/ui/Input";
import { PoapBadge3D } from "@/components/poap/PoapBadge3D";
import { Sparkles, Upload, Code2, AlertTriangle, CheckCircle2 } from "lucide-react";

export interface StepArtworkProps {
  initialSvg?: string;
  initialTitle?: string;
  onComplete: (svgCode: string, optimization: OptimizationResult) => void;
}

export function StepArtwork({
  initialSvg = "",
  initialTitle = "ETH GLOBAL DENVER",
  onComplete,
}: StepArtworkProps) {
  const [tab, setTab] = useState<"studio" | "upload" | "paste">("studio");
  const [rawPastedSvg, setRawPastedSvg] = useState<string>(initialSvg);
  const [currentSvg, setCurrentSvg] = useState<string>(initialSvg);
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const handleStudioSvg = useCallback((svgCode: string, opt: OptimizationResult) => {
    setCurrentSvg(svgCode);
    setOptimization(opt);
    setValidationError(null);
    if (onCompleteRef.current) {
      onCompleteRef.current(svgCode, opt);
    }
  }, []);

  const handleCustomSvgInput = useCallback((code: string) => {
    setRawPastedSvg(code);
    const sanitized = sanitizeSvg(code);
    if (!sanitized.isValid || !sanitized.sanitizedSvg) {
      setValidationError(sanitized.error || "Invalid SVG code.");
      return;
    }

    setValidationError(null);
    const opt = optimizeSvg(sanitized.sanitizedSvg);
    setCurrentSvg(opt.optimizedSvg);
    setOptimization(opt);
    if (onCompleteRef.current) {
      onCompleteRef.current(opt.optimizedSvg, opt);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".svg") && file.type !== "image/svg+xml") {
      setValidationError("Please select a valid .svg file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleCustomSvgInput(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 text-neutral-900 dark:text-neutral-100">
      {/* Mode Selector */}
      <div className="flex bg-neutral-100 dark:bg-neutral-850 p-1 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 max-w-md mx-auto text-xs font-medium">
        <button
          type="button"
          onClick={() => setTab("studio")}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            tab === "studio"
              ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold shadow-xs"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-lime-500" />
          POAP Studio
        </button>
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            tab === "upload"
              ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold shadow-xs"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload SVG
        </button>
        <button
          type="button"
          onClick={() => setTab("paste")}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            tab === "paste"
              ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold shadow-xs"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          Paste Code
        </button>
      </div>

      {/* Tab 1: Studio */}
      {tab === "studio" && (
        <BadgeCanvas
          initialTitle={initialTitle}
          onSvgChange={handleStudioSvg}
        />
      )}

      {/* Tab 2: File Upload */}
      {tab === "upload" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border-2 border-dashed border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors text-center space-y-4 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 mx-auto flex items-center justify-center text-neutral-600 dark:text-neutral-300">
              <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-neutral-900 dark:text-white">
                Upload your vector SVG artwork
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Drag and drop your .svg file from Figma, Illustrator, or Sketch
              </p>
            </div>
            <label className="inline-block cursor-pointer">
              <input
                type="file"
                accept=".svg,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="inline-flex items-center px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-xs transition-all">
                Choose .SVG File
              </span>
            </label>
          </div>

          {validationError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {currentSvg && (
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-card space-y-4 text-center">
              <div className="text-xs font-mono font-semibold uppercase text-neutral-500">
                Uploaded Badge Preview
              </div>
              <div className="flex justify-center my-2">
                <PoapBadge3D svgContent={currentSvg} size="lg" interactive={true} />
              </div>
              {optimization && <SvgOptimizerPanel optimization={optimization} />}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Paste Code */}
      {tab === "paste" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-card space-y-4">
            <Textarea
              label="Paste Clean Vector SVG Markup"
              rows={8}
              placeholder="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>...</svg>"
              value={rawPastedSvg}
              onChange={(e) => handleCustomSvgInput(e.target.value)}
              error={validationError || undefined}
              helperText="Scripts, events, and raster images are automatically stripped."
            />
          </div>

          {currentSvg && !validationError && (
            <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-card space-y-4 text-center">
              <div className="text-xs font-mono font-semibold uppercase text-neutral-500">
                Parsed Badge Preview
              </div>
              <div className="flex justify-center my-2">
                <PoapBadge3D svgContent={currentSvg} size="lg" interactive={true} />
              </div>
              {optimization && <SvgOptimizerPanel optimization={optimization} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
