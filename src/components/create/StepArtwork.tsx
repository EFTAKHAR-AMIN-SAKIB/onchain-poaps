"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { BadgeConfig } from "@/lib/svg/generator";
import { BadgeCanvas } from "@/components/studio/BadgeCanvas";
import { OptimizationResult } from "@/lib/svg/optimizer";

export interface StepArtworkProps {
  config?: BadgeConfig;
  onConfigChange?: (config: BadgeConfig) => void;
  isCustomSvg?: boolean;
  onCustomSvgChange?: (svgCode: string, isCustom: boolean) => void;
  initialSvg?: string;
  initialTitle?: string;
  onComplete: (svgCode: string, optimization: OptimizationResult) => void;
}

export function StepArtwork({
  config,
  onConfigChange,
  isCustomSvg,
  onCustomSvgChange,
  initialTitle = "ONCHAIN POAP",
  onComplete,
}: StepArtworkProps) {
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const handleSvgChange = useCallback((svgCode: string, opt: OptimizationResult) => {
    if (onCompleteRef.current) {
      onCompleteRef.current(svgCode, opt);
    }
  }, []);

  return (
    <div className="w-full">
      <BadgeCanvas
        config={config}
        onConfigChange={onConfigChange}
        isCustomSvg={isCustomSvg}
        onCustomSvgChange={onCustomSvgChange}
        initialTitle={initialTitle}
        onSvgChange={handleSvgChange}
      />
    </div>
  );
}
