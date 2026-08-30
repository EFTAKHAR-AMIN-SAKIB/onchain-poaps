"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BadgeConfig,
  BadgeShape,
  BadgeTheme,
  BADGE_THEMES,
  generateBadgeSvg,
} from "@/lib/svg/generator";
import { optimizeSvg, OptimizationResult } from "@/lib/svg/optimizer";
import { sanitizeSvg } from "@/lib/svg/sanitizer";
import { PoapBadge3D } from "@/components/poap/PoapBadge3D";
import { SvgOptimizerPanel } from "./SvgOptimizerPanel";
import { Input, Textarea } from "@/components/ui/Input";
import {
  Sparkles,
  Palette,
  Layers,
  Type,
  Smile,
  Wand2,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Upload,
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils/formatting";

export interface BadgeCanvasProps {
  initialTitle?: string;
  initialDate?: string;
  onSvgChange: (svgCode: string, optimization: OptimizationResult) => void;
}

export function BadgeCanvas({
  initialTitle = "ETH GLOBAL 2026",
  initialDate = "2026",
  onSvgChange,
}: BadgeCanvasProps) {
  const [activeTab, setActiveTab] = useState<"studio" | "upload">("studio");

  const [config, setConfig] = useState<BadgeConfig>({
    shape: "scallop",
    theme: "museum-gold",
    customColor: "#d4af37",
    title: initialTitle,
    subtitle: "PROOF OF ATTENDANCE",
    dateOrYear: initialDate,
    iconType: "emoji",
    iconValue: "🏆",
    pattern: "rays",
    hasInnerDashedRing: true,
  });

  const [customSvgInput, setCustomSvgInput] = useState("");
  const [customSvgError, setCustomSvgError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<"md" | "lg" | "xl">("lg");

  const [currentSvg, setCurrentSvg] = useState<string>("");
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Store callback in ref to prevent infinite re-render loop
  const onSvgChangeRef = useRef(onSvgChange);
  useEffect(() => {
    onSvgChangeRef.current = onSvgChange;
  }, [onSvgChange]);

  // Sync Studio SVG updates safely
  useEffect(() => {
    if (activeTab === "studio") {
      const raw = generateBadgeSvg(config);
      const opt = optimizeSvg(raw);
      setCurrentSvg(opt.optimizedSvg);
      setOptimization(opt);
      if (onSvgChangeRef.current) {
        onSvgChangeRef.current(opt.optimizedSvg, opt);
      }
    }
  }, [config, activeTab]);

  // Handle Custom SVG Input
  const handleCustomSvgChange = useCallback((rawSvg: string) => {
    setCustomSvgInput(rawSvg);
    if (!rawSvg.trim()) {
      setCustomSvgError(null);
      return;
    }

    const check = sanitizeSvg(rawSvg);
    if (!check.isValid) {
      setCustomSvgError(check.error || "SVG failed security checks.");
      return;
    }

    setCustomSvgError(null);
    const opt = optimizeSvg(check.sanitizedSvg || rawSvg);
    setCurrentSvg(opt.optimizedSvg);
    setOptimization(opt);
    if (onSvgChangeRef.current) {
      onSvgChangeRef.current(opt.optimizedSvg, opt);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".svg") && file.type !== "image/svg+xml") {
      setCustomSvgError("Please upload a valid .svg vector file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleCustomSvgChange(content);
    };
    reader.readAsText(file);
  };

  const shapes: Array<{ id: BadgeShape; label: string; icon: string }> = [
    { id: "scallop", label: "Stamp", icon: "💮" },
    { id: "circle", label: "Classic", icon: "⚪" },
    { id: "hexagon", label: "Hexagon", icon: "⬡" },
    { id: "octagon", label: "Medallion", icon: "❂" },
    { id: "orbital", label: "Orbital", icon: "🪐" },
    { id: "shield", label: "Shield", icon: "🛡️" },
    { id: "ticket", label: "Ticket", icon: "🎟️" },
    { id: "signal", label: "Signal", icon: "⬛" },
    { id: "gear", label: "Gear", icon: "⚙️" },
    { id: "star", label: "Star", icon: "⭐" },
  ];

  const presets = [
    {
      name: "Hackathon Winner",
      shape: "scallop" as BadgeShape,
      theme: "museum-gold" as BadgeTheme,
      iconValue: "🏆",
      title: "HACKATHON WINNER",
      pattern: "rays" as const,
    },
    {
      name: "Base Camp Summit",
      shape: "circle" as BadgeShape,
      theme: "electric-base" as BadgeTheme,
      iconValue: "🚀",
      title: "BASE CAMP SUMMIT",
      pattern: "rings" as const,
    },
    {
      name: "VIP Archival Pass",
      shape: "octagon" as BadgeShape,
      theme: "amethyst-velvet" as BadgeTheme,
      iconValue: "👑",
      title: "VIP ARCHIVAL PASS",
      pattern: "stars" as const,
    },
    {
      name: "Cyber Meetup",
      shape: "signal" as BadgeShape,
      theme: "cyber-teal" as BadgeTheme,
      iconValue: "⚡",
      title: "CYBER COMMUNITY",
      pattern: "dots" as const,
    },
  ];

  const vectorMarks = [
    { id: "sparkle", label: "Sparkle Star", icon: "✦" },
    { id: "check", label: "Verified", icon: "✓" },
    { id: "pin", label: "Map Pin", icon: "📍" },
    { id: "lightning", label: "Lightning", icon: "⚡" },
    { id: "star", label: "Classic Star", icon: "★" },
  ];

  const popularEmojis = [
    "🏆",
    "🚀",
    "💎",
    "🎟️",
    "⚡",
    "🏛️",
    "👑",
    "🔥",
    "🎖️",
    "💻",
    "🎨",
    "🛡️",
    "🔮",
    "📜",
    "🌟",
  ];

  const handleCopySvg = async () => {
    if (!currentSvg) return;
    const ok = await copyToClipboard(currentSvg);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRandomize = () => {
    const shapeKeys = shapes.map((s) => s.id);
    const themeKeys = Object.keys(BADGE_THEMES) as BadgeTheme[];
    const patterns = ["dots", "rays", "rings", "stars", "grid", "clean"] as const;
    const randomShape = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
    const randomTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    const randomEmoji = popularEmojis[Math.floor(Math.random() * popularEmojis.length)];

    setConfig((prev) => ({
      ...prev,
      shape: randomShape,
      theme: randomTheme,
      pattern: randomPattern,
      iconType: "emoji",
      iconValue: randomEmoji,
    }));
  };

  return (
    <div className="space-y-6 text-neutral-900 dark:text-neutral-100">
      {/* Mode Switcher */}
      <div className="flex bg-neutral-100 dark:bg-neutral-850 p-1 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 max-w-md mx-auto text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("studio")}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === "studio"
              ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold shadow-xs"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-lime-500" />
          <span>Stamp Studio</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === "upload"
              ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold shadow-xs"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload / Paste SVG</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sticky Viewport with 3D Specular Tilt */}
        <div className="lg:col-span-5 flex flex-col items-center gap-5 sticky top-24">
          <div className="p-8 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card w-full flex flex-col items-center justify-center gap-5 relative overflow-hidden">
            {/* Viewport header controls */}
            <div className="flex items-center justify-between w-full text-xs font-mono font-semibold uppercase tracking-wider text-neutral-500 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <span className="flex items-center gap-1.5 text-neutral-900 dark:text-white font-bold">
                <span className="w-2 h-2 rounded-full bg-lime-500 shadow-[0_0_6px_rgba(132,204,22,0.8)]" />
                Live Badge Preview
              </span>
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setZoomLevel("md")}
                  className={`p-1 rounded ${zoomLevel === "md" ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs" : "text-neutral-500"}`}
                  title="Medium zoom"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel("xl")}
                  className={`p-1 rounded ${zoomLevel === "xl" ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs" : "text-neutral-500"}`}
                  title="Large zoom"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Rendered 3D Badge */}
            <div className="my-2">
              <PoapBadge3D svgContent={currentSvg} size={zoomLevel} interactive={true} />
            </div>

            <span className="text-[11px] font-mono text-neutral-400">
              ✦ Hover to tilt medallion with specular light
            </span>

            {/* Quick Actions */}
            <div className="flex gap-2 w-full pt-1">
              {activeTab === "studio" && (
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <Wand2 className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  Randomize
                </button>
              )}
              <button
                type="button"
                onClick={handleCopySvg}
                className="flex-1 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-lime-400 dark:text-lime-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SSTORE2 Gas Optimizer Stats */}
          {optimization && <SvgOptimizerPanel optimization={optimization} />}
        </div>

        {/* Right Column: Studio Controls */}
        <div className="lg:col-span-7 space-y-5 text-left">
          {activeTab === "upload" ? (
            /* Custom SVG Upload & Code Editor */
            <div className="p-6 sm:p-8 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card space-y-5">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-neutral-500" />
                  Custom Vector Upload
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Upload an existing SVG file or paste raw XML code. Validated and optimized for Base SSTORE2 bytecode storage.
                </p>
              </div>

              <div className="p-8 border-2 border-dashed border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-850 rounded-2xl text-center">
                <input
                  type="file"
                  id="svgFileInput"
                  accept=".svg,image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="svgFileInput"
                  className="cursor-pointer flex flex-col items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  <Upload className="w-6 h-6 text-neutral-400" />
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">Click to upload .SVG file</span>
                  <span className="text-[11px] font-mono text-neutral-400">Max 24 KB (gas optimal &lt; 3 KB)</span>
                </label>
              </div>

              <Textarea
                label="Or Paste Raw SVG Markup"
                rows={7}
                placeholder="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>...</svg>"
                value={customSvgInput}
                onChange={(e) => handleCustomSvgChange(e.target.value)}
                error={customSvgError || undefined}
                helperText="Inline scripts and external bitmap URLs are strictly rejected."
              />
            </div>
          ) : (
            /* POAP Studio Controls */
            <div className="space-y-5">
              {/* Presets Row */}
              <div className="p-6 sm:p-7 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card space-y-3">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-lime-500" />
                  STARTER TEMPLATES
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          shape: preset.shape,
                          theme: preset.theme,
                          iconValue: preset.iconValue,
                          title: preset.title,
                          pattern: preset.pattern,
                        }))
                      }
                      className="p-3 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/80 rounded-2xl text-left hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-xs transition-all text-xs font-medium"
                    >
                      <div className="text-xl">{preset.iconValue}</div>
                      <div className="font-semibold text-neutral-900 dark:text-white mt-1 truncate">
                        {preset.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. Geometry & Shape */}
              <div className="p-6 sm:p-7 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card space-y-3">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-neutral-400" />
                  1. SILHOUETTE SHAPE ({shapes.length} SHAPES)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {shapes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setConfig({ ...config, shape: s.id })}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all text-xs ${
                        config.shape === s.id
                          ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold border-neutral-900 dark:border-white shadow-xs"
                          : "bg-neutral-50 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 border-neutral-200/70 dark:border-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <span className="text-xl">{s.icon}</span>
                      <span className="text-[11px] font-medium">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Color Engine & Enamel */}
              <div className="p-6 sm:p-7 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card space-y-3">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-neutral-400" />
                  2. COLOR ENGINE & ENAMEL
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {Object.entries(BADGE_THEMES).map(([themeId, theme]) => {
                    const isSelected = config.theme === themeId;
                    return (
                      <button
                        key={themeId}
                        onClick={() => setConfig({ ...config, theme: themeId as BadgeTheme })}
                        className={`p-2.5 rounded-2xl border flex items-center gap-2.5 transition-all text-left text-xs ${
                          isSelected
                            ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold border-neutral-900 dark:border-white shadow-xs"
                            : "bg-neutral-50 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 border-neutral-200/70 dark:border-neutral-700 hover:bg-neutral-100 font-medium"
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-sm"
                          style={{ backgroundColor: theme.primary }}
                        />
                        <span className="truncate">{theme.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Input */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setConfig({ ...config, theme: "custom" })}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                      config.theme === "custom"
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs"
                        : "bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    <span>Custom Hex:</span>
                    <input
                      type="color"
                      value={config.customColor || "#d4af37"}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          theme: "custom",
                          customColor: e.target.value,
                        })
                      }
                      className="w-5 h-5 rounded bg-transparent border-0 cursor-pointer"
                    />
                  </button>
                </div>
              </div>

              {/* 3. Graphic Mark / Glyph */}
              <div className="p-6 sm:p-7 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card space-y-4">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-neutral-400" />
                  3. CENTER MARK & EMOJIS
                </div>

                {/* Mark Type Switcher */}
                <div className="flex gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl w-fit text-xs font-medium">
                  <button
                    onClick={() => setConfig({ ...config, iconType: "emoji" })}
                    className={`px-3.5 py-1.5 rounded-lg transition-all ${
                      config.iconType === "emoji"
                        ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold shadow-xs"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                    }`}
                  >
                    Emojis
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, iconType: "vector" })}
                    className={`px-3.5 py-1.5 rounded-lg transition-all ${
                      config.iconType === "vector"
                        ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold shadow-xs"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                    }`}
                  >
                    Vector Marks
                  </button>
                  <button
                    onClick={() => setConfig({ ...config, iconType: "initials" })}
                    className={`px-3.5 py-1.5 rounded-lg transition-all ${
                      config.iconType === "initials"
                        ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold shadow-xs"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                    }`}
                  >
                    Initials
                  </button>
                </div>

                {config.iconType === "emoji" && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {popularEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() =>
                          setConfig({ ...config, iconType: "emoji", iconValue: emoji })
                        }
                        className={`w-11 h-11 rounded-2xl border text-xl flex items-center justify-center transition-all ${
                          config.iconType === "emoji" && config.iconValue === emoji
                            ? "bg-lime-100 dark:bg-lime-950/60 border-lime-400 dark:border-lime-700 scale-110 shadow-xs"
                            : "bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200/70 dark:border-neutral-700 hover:bg-neutral-100"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {config.iconType === "vector" && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1">
                    {vectorMarks.map((m) => (
                      <button
                        key={m.id}
                        onClick={() =>
                          setConfig({ ...config, iconType: "vector", iconValue: m.id })
                        }
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-1 text-xs font-medium ${
                          config.iconType === "vector" && config.iconValue === m.id
                            ? "bg-lime-100 dark:bg-lime-950/60 border-lime-400 dark:border-lime-700 text-neutral-900 dark:text-white font-semibold shadow-xs"
                            : "bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200/70 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
                        }`}
                      >
                        <span className="text-lg">{m.icon}</span>
                        <span className="text-[10px]">{m.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {config.iconType === "initials" && (
                  <div className="pt-1">
                    <Input
                      label="Monogram Initials (1-4 Characters)"
                      placeholder="ETH"
                      maxLength={4}
                      value={config.iconType === "initials" ? config.iconValue : ""}
                      onChange={(e) => {
                        setConfig({
                          ...config,
                          iconType: "initials",
                          iconValue: e.target.value.toUpperCase(),
                        });
                      }}
                    />
                  </div>
                )}
              </div>

              {/* 4. Circular Typography & Inner Details */}
              <div className="p-6 sm:p-7 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card space-y-4">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-neutral-400" />
                  4. CIRCULAR VECTOR TYPOGRAPHY & RINGS
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Arc Title (Top Curvature)"
                    value={config.title}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                    placeholder="EVENT NAME"
                  />
                  <Input
                    label="Bottom Line (Year / Tag)"
                    value={config.dateOrYear}
                    onChange={(e) => setConfig({ ...config, dateOrYear: e.target.value })}
                    placeholder="2026"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    id="innerRingCheck"
                    checked={config.hasInnerDashedRing}
                    onChange={(e) =>
                      setConfig({ ...config, hasInnerDashedRing: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-0"
                  />
                  <label htmlFor="innerRingCheck" className="cursor-pointer">
                    Include inner dashed concentric stamp ring
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
