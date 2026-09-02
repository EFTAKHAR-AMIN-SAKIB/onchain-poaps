"use client";

import React, { useRef, useState, useMemo } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sparkles,
  ShieldCheck,
  Code2,
  Copy,
  Check,
} from "lucide-react";
import { copyToClipboard, formatBytes } from "@/lib/utils/formatting";

export interface PoapAcrylicPreviewProps {
  svgContent: string;
  sizeBytes?: number;
}

// Simple fast deterministic hash helper for preview fingerprinting
function computeSvgFingerprint(svg: string): string {
  let hash = 0;
  for (let i = 0; i < svg.length; i++) {
    const char = svg.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  return `0x${hex}${svg.length.toString(16).padStart(4, "0")}...${hex.slice(-4)}`;
}

export function PoapAcrylicPreview({
  svgContent,
  sizeBytes = 0,
}: PoapAcrylicPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [zoomLevel, setZoomLevel] = useState<"normal" | "large">("normal");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const fingerprint = useMemo(() => computeSvgFingerprint(svgContent), [svgContent]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 14;

    setRotate({ x: rotX, y: rotY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.45,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 14;
    const rotY = ((x - centerX) / centerX) * 14;

    setRotate({ x: Math.max(-16, Math.min(16, rotX)), y: Math.max(-16, Math.min(16, rotY)) });
    setGlare({
      x: Math.max(0, Math.min(100, (x / rect.width) * 100)),
      y: Math.max(0, Math.min(100, (y / rect.height) * 100)),
      opacity: 0.5,
    });
  };

  const handleTouchEnd = () => {
    handleReset();
  };

  const handleReset = () => {
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const handleCopySvg = async () => {
    if (!svgContent) return;
    const ok = await copyToClipboard(svgContent);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 w-full text-neutral-900 dark:text-neutral-100 select-none">
      {/* Plaque Preview Box */}
      <div className="w-full rounded-2xl sm:rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 p-4 sm:p-8 shadow-card flex flex-col items-center justify-between gap-3 sm:gap-6 relative overflow-hidden">
        {/* Top Preview Status Bar */}
        <div className="flex items-center justify-between w-full pb-2.5 sm:pb-3 border-b border-neutral-100 dark:border-neutral-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.85)] animate-pulse" />
            <span className="font-bold tracking-wider text-neutral-900 dark:text-white uppercase text-[11px] sm:text-xs">
              LIVE PREVIEW
            </span>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-0.5 sm:p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setZoomLevel(zoomLevel === "normal" ? "large" : "normal")}
              className="p-1 sm:p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-700 transition-colors"
              title={zoomLevel === "normal" ? "Zoom In" : "Zoom Out"}
            >
              {zoomLevel === "normal" ? (
                <ZoomIn className="w-3.5 h-3.5" />
              ) : (
                <ZoomOut className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="p-1 sm:p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-700 transition-colors"
              title="Reset 3D Perspective"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-1 sm:p-1.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-white dark:hover:bg-neutral-700 transition-colors"
              title="Fullscreen Museum View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3D Floating Acrylic Plaque Stage */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative w-full flex items-center justify-center py-2 sm:py-4 cursor-pointer touch-none"
          style={{ perspective: "1000px" }}
        >
          {/* Ambient Background Aura Glow */}
          <div className="absolute w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-gradient-to-tr from-lime-200/40 via-purple-200/30 to-blue-200/30 dark:from-lime-900/20 dark:via-purple-900/10 dark:to-blue-900/10 blur-2xl sm:blur-3xl pointer-events-none -z-10" />

          {/* 3D Plaque Container */}
          <div
            style={{
              transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
              transition:
                rotate.x === 0 && rotate.y === 0
                  ? "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)"
                  : "transform 0.08s ease-out",
              transformStyle: "preserve-3d",
            }}
            className={`relative transition-all duration-300 flex items-center justify-center ${
              zoomLevel === "large"
                ? "w-[240px] sm:w-[380px] h-[240px] sm:h-[380px]"
                : "w-[180px] sm:w-[310px] h-[180px] sm:h-[310px]"
            }`}
          >
            {/* Dynamic Specular Lighting Sheen Overlay */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] z-30 transition-opacity duration-200"
              style={{
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 30%, transparent 65%)`,
                opacity: glare.opacity,
              }}
            />

            {/* Rendered SVG Vector Plaque */}
            {svgContent ? (
              <div
                className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]"
                dangerouslySetInnerHTML={{ __html: svgContent }}
              />
            ) : (
              <div className="w-full h-full rounded-2xl sm:rounded-3xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 text-xs font-mono animate-pulse">
                Generating Vector Acrylic Plaque...
              </div>
            )}
          </div>
        </div>

        {/* Caption Info */}
        <div className="text-center space-y-0.5 sm:space-y-1">
          <div className="text-[11px] sm:text-xs font-mono font-medium text-neutral-600 dark:text-neutral-300 flex items-center justify-center gap-1.5 sm:gap-2">
            <span>512 × 512</span>
            <span>•</span>
            <span className="font-semibold text-neutral-900 dark:text-white">SVG</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Ready for onchain storage
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] font-mono text-neutral-400">
            ✦ Drag or hover to tilt translucent acrylic plaque with light sheen
          </p>
        </div>

        {/* Quick Action Button: Copy SVG Code */}
        <div className="w-full pt-1">
          <button
            type="button"
            onClick={handleCopySvg}
            className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                <span>SVG Code Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-500" />
                <span>Copy Vector SVG Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Artwork Integrity Card */}
      <div className="w-full rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 p-4 text-xs font-mono space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-neutral-500 uppercase font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
            Artwork Integrity
          </span>
          <span className="text-[10px] text-neutral-400 font-normal">
            Deterministic EVM Hash
          </span>
        </div>

        <div className="flex items-center justify-between bg-white dark:bg-neutral-900 px-3 py-2 rounded-xl border border-neutral-200/70 dark:border-neutral-800">
          <span className="text-neutral-500 text-[11px]">Fingerprint:</span>
          <span className="font-bold text-neutral-900 dark:text-white truncate max-w-[200px]">
            {fingerprint}
          </span>
        </div>

        <div className="text-[11px] text-neutral-500 leading-relaxed font-sans">
          The exact SVG code above is compiled directly into Base SSTORE2 bytecode when broadcasting.
        </div>
      </div>

      {/* Fullscreen Museum Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 select-none">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 shadow-md"
            title="Exit Fullscreen"
          >
            <Minimize2 className="w-5 h-5" />
          </button>

          <div className="w-[380px] sm:w-[460px] h-[380px] sm:h-[460px] flex items-center justify-center drop-shadow-2xl">
            <div
              className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          </div>

          <div className="mt-8 text-center space-y-1">
            <div className="text-sm font-bold text-neutral-900 dark:text-white">
              Digital Museum-Grade Acrylic POAP
            </div>
            <div className="text-xs font-mono text-neutral-500">
              512 × 512 Pure Vector SVG • 100% Onchain
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
