"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { BadgeCanvas } from "@/components/studio/BadgeCanvas";
import { OptimizationResult } from "@/lib/svg/optimizer";

export interface StepArtworkProps {
  initialSvg?: string;
  initialTitle?: string;
  onComplete: (svgCode: string, optimization: OptimizationResult) => void;
}

export function StepArtwork({
  initialTitle = "ETH GLOBAL 2026",
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
        initialTitle={initialTitle}
        onSvgChange={handleSvgChange}
      />
    </div>
  );
}
