"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  BadgeConfig,
  BadgeStyle,
  BadgeShape,
  AcrylicPreset,
  AcrylicMaterial,
  AcrylicDepth,
  AcrylicReflection,
  AcrylicGlow,
  ColorPreset,
  ACRYLIC_PRESETS,
  COLOR_PRESETS,
  VECTOR_ICONS,
  generateBadgeSvg,
} from "@/lib/svg/generator";
import { optimizeSvg, OptimizationResult } from "@/lib/svg/optimizer";
import { sanitizeSvg } from "@/lib/svg/sanitizer";
import { PoapAcrylicPreview } from "./PoapAcrylicPreview";
import { SvgOptimizerPanel } from "./SvgOptimizerPanel";
import { Input, Textarea } from "@/components/ui/Input";
import {
  Sparkles,
  Palette,
  Layers,
  Type,
  Wand2,
  Upload,
  BookOpen,
  Sun,
  Shield,
} from "lucide-react";

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

  // Config State
  const [config, setConfig] = useState<BadgeConfig>({
    style: "acrylic",
    preset: "crystal",
    shape: "medal",
    material: "crystal",
    depth: "deep",
    reflection: "soft",
    glow: "soft",
    colorPreset: "lime",
    customColor: "#84cc16",
    title: initialTitle,
    subtitle: "I WAS THERE",
    dateOrYear: initialDate,
    location: "NEW YORK, USA",
    iconValue: "sparkle",
    hasInnerDashedRing: true,
  });

  const [customSvgInput, setCustomSvgInput] = useState("");
  const [customSvgError, setCustomSvgError] = useState<string | null>(null);
  const [currentSvg, setCurrentSvg] = useState<string>("");
  const [optimization, setOptimization] = useState<OptimizationResult | null>(null);

  // Safety ref to eliminate infinite re-render cycles
  const onSvgChangeRef = useRef(onSvgChange);
  useEffect(() => {
    onSvgChangeRef.current = onSvgChange;
  }, [onSvgChange]);

  // Sync Studio SVG updates
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

  // Handle Custom SVG input
  const handleCustomSvgChange = useCallback((rawSvg: string) => {
    setCustomSvgInput(rawSvg);
    if (!rawSvg.trim()) {
      setCustomSvgError(null);
      return;
    }

    const check = sanitizeSvg(rawSvg);
    if (!check.isValid) {
      setCustomSvgError(check.error || "SVG failed security validation.");
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

  const styles: Array<{ id: BadgeStyle; label: string; desc: string }> = [
    { id: "acrylic", label: "Acrylic", desc: "Translucent museum plaque (Signature)" },
    { id: "glass", label: "Glass", desc: "Ultra-clear polished crystal" },
    { id: "classic", label: "Classic", desc: "Heritage enamel medallion" },
    { id: "metal", label: "Metal", desc: "Brushed titanium finish" },
    { id: "paper", label: "Paper", desc: "Embossed archival print" },
    { id: "pixel", label: "Pixel", desc: "Crisp onchain digital grid" },
  ];

  const handleStyleSelect = (styleId: BadgeStyle) => {
    if (styleId === "glass") {
      setConfig((prev) => ({
        ...prev,
        style: "glass",
        material: "clear",
        reflection: "high",
        glow: "soft",
      }));
    } else if (styleId === "classic") {
      setConfig((prev) => ({
        ...prev,
        style: "classic",
        preset: "pearl",
        colorPreset: "amber",
        shape: "scallop",
        material: "frosted",
        reflection: "soft",
        glow: "off",
      }));
    } else if (styleId === "metal") {
      setConfig((prev) => ({
        ...prev,
        style: "metal",
        preset: "crystal",
        colorPreset: "obsidian",
        material: "crystal",
        reflection: "high",
        glow: "off",
      }));
    } else if (styleId === "paper") {
      setConfig((prev) => ({
        ...prev,
        style: "paper",
        preset: "pearl",
        shape: "round",
        material: "frosted",
        reflection: "none",
        glow: "off",
      }));
    } else if (styleId === "pixel") {
      setConfig((prev) => ({
        ...prev,
        style: "pixel",
        preset: "midnight",
        colorPreset: "lime",
        shape: "ticket",
        material: "crystal",
        reflection: "soft",
        glow: "soft",
      }));
    } else {
      // acrylic
      setConfig((prev) => ({
        ...prev,
        style: "acrylic",
        material: "crystal",
        depth: "deep",
        reflection: "soft",
        glow: "soft",
      }));
    }
  };

  const shapes: Array<{ id: BadgeShape; label: string; icon: string }> = [
    { id: "medal", label: "Medal Plaque", icon: "🏛️" },
    { id: "round", label: "Puck Disc", icon: "⚪" },
    { id: "scallop", label: "Stamp Edge", icon: "💮" },
    { id: "hexagon", label: "Hexagon", icon: "⬡" },
    { id: "ticket", label: "Cartridge", icon: "🎟️" },
    { id: "shield", label: "Shield Crest", icon: "🛡️" },
    { id: "orbital", label: "Orbital Rings", icon: "🪐" },
    { id: "star", label: "Star Crystal", icon: "⭐" },
  ];

  const materials: Array<{ id: AcrylicMaterial; label: string }> = [
    { id: "crystal", label: "Crystal (Pure)" },
    { id: "frosted", label: "Frosted (Matte)" },
    { id: "clear", label: "Clear (Reflective)" },
    { id: "iridescent", label: "Iridescent (Prism)" },
  ];

  const depths: Array<{ id: AcrylicDepth; label: string }> = [
    { id: "thin", label: "Thin (4mm)" },
    { id: "medium", label: "Medium (8mm)" },
    { id: "deep", label: "Deep (14mm Bevel)" },
  ];

  const reflections: Array<{ id: AcrylicReflection; label: string }> = [
    { id: "none", label: "None" },
    { id: "soft", label: "Soft Glare" },
    { id: "high", label: "High Specular" },
  ];

  const glows: Array<{ id: AcrylicGlow; label: string }> = [
    { id: "off", label: "Off" },
    { id: "soft", label: "Soft Aura" },
    { id: "ambient", label: "Ambient Bloom" },
  ];

  const handleRandomize = () => {
    const styleKeys = styles.map((s) => s.id);
    const presetKeys = Object.keys(ACRYLIC_PRESETS) as AcrylicPreset[];
    const shapeKeys = shapes.map((s) => s.id);
    const iconKeys = Object.keys(VECTOR_ICONS);
    const colorKeys = Object.keys(COLOR_PRESETS) as ColorPreset[];

    const randStyle = styleKeys[Math.floor(Math.random() * styleKeys.length)];
    const randPreset = presetKeys[Math.floor(Math.random() * presetKeys.length)];
    const randShape = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
    const randIcon = iconKeys[Math.floor(Math.random() * iconKeys.length)];
    const randColor = colorKeys[Math.floor(Math.random() * colorKeys.length)];

    setConfig((prev) => ({
      ...prev,
      style: randStyle,
      preset: randPreset,
      shape: randShape,
      iconValue: randIcon,
      colorPreset: randColor,
    }));
  };

  return (
    <div className="space-y-8 text-neutral-900 dark:text-neutral-100">
      {/* Top Tab Switcher */}
      <div className="flex bg-neutral-100 dark:bg-neutral-850 p-1.5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 max-w-md mx-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("studio")}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === "studio"
              ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
              : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-lime-500" />
          <span>Acrylic Studio</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
            activeTab === "upload"
              ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
              : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload / Paste SVG</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Floating Acrylic Preview & Optimizer */}
        <div className="lg:col-span-5 space-y-5 sticky top-24">
          <PoapAcrylicPreview
            svgContent={currentSvg}
            sizeBytes={optimization?.optimizedBytes}
          />

          {/* SSTORE2 Gas Optimizer Stats */}
          {optimization && <SvgOptimizerPanel optimization={optimization} />}

          {/* "Why SVG?" Educational Card */}
          <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase text-neutral-800 dark:text-neutral-200">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>Why 100% Vector SVG?</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans">
              Your POAP artwork is stored directly as bytecode in Base Sepolia smart contract storage via SSTORE2. It does not depend on IPFS or external hosting.
            </p>
            <div className="pt-1">
              <Link
                href="/docs/svg-architecture"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Learn more in Docs →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Studio Design Controls */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {activeTab === "upload" ? (
            /* Upload SVG Panel */
            <div className="p-6 sm:p-8 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card space-y-5">
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-neutral-500" />
                  Custom Vector Upload & Validator
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Upload an existing SVG file or paste raw vector code. Automatically sanitized with DOMPurify and optimized for Base bytecode storage.
                </p>
              </div>

              <div className="p-8 border-2 border-dashed border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-850 rounded-2xl text-center space-y-2">
                <input
                  type="file"
                  id="customSvgFileInput"
                  accept=".svg,image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="customSvgFileInput"
                  className="cursor-pointer flex flex-col items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium"
                >
                  <Upload className="w-6 h-6 text-neutral-400" />
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Click to choose .SVG file
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Max 24 KB (gas optimal &lt; 3 KB)
                  </span>
                </label>
              </div>

              <Textarea
                label="Or Paste Raw SVG Code"
                rows={7}
                placeholder="<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>...</svg>"
                value={customSvgInput}
                onChange={(e) => handleCustomSvgChange(e.target.value)}
                error={customSvgError || undefined}
                helperText="Inline JavaScript and external raster images are strictly rejected."
              />
            </div>
          ) : (
            /* POAP Acrylic Studio Controls */
            <div className="space-y-6">
              {/* 1. Visual Style System */}
              <div className="p-6 sm:p-7 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-lime-500" />
                    1. VISUAL STYLE SYSTEM ({styles.length})
                  </div>
                  <button
                    type="button"
                    onClick={handleRandomize}
                    className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Wand2 className="w-3 h-3 text-lime-500" />
                    Randomize
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {styles.map((st) => {
                    const isSelected = config.style === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => handleStyleSelect(st.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs scale-101"
                            : "bg-neutral-50 dark:bg-neutral-850 border-neutral-200/70 dark:border-neutral-800 hover:bg-neutral-100 text-neutral-800 dark:text-neutral-200"
                        }`}
                      >
                        <div className="font-bold text-xs flex items-center justify-between">
                          <span>{st.label}</span>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 dark:bg-lime-600" />
                          )}
                        </div>
                        <div
                          className={`text-[10px] truncate mt-0.5 ${
                            isSelected
                              ? "text-neutral-300 dark:text-neutral-600"
                              : "text-neutral-400"
                          }`}
                        >
                          {st.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Curated Presets */}
              <div className="p-6 sm:p-7 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card space-y-3">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-neutral-400" />
                  2. ACRYLIC CURATED PRESETS ({Object.keys(ACRYLIC_PRESETS).length})
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {Object.entries(ACRYLIC_PRESETS).map(([key, item]) => {
                    const isSelected = config.preset === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          setConfig({
                            ...config,
                            preset: key as AcrylicPreset,
                            material: key === "frosted" ? "frosted" : key === "aurora" ? "iridescent" : "crystal",
                          })
                        }
                        className={`p-3 rounded-2xl border flex flex-col justify-between text-left transition-all ${
                          isSelected
                            ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs scale-102"
                            : "bg-neutral-50 dark:bg-neutral-850 border-neutral-200/70 dark:border-neutral-800 hover:bg-neutral-100"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-xs shrink-0"
                            style={{ backgroundColor: item.accentColor }}
                          />
                          <span className="font-bold text-xs truncate">{item.name}</span>
                        </div>
                        <div
                          className={`text-[10px] line-clamp-1 ${
                            isSelected
                              ? "text-neutral-300 dark:text-neutral-600"
                              : "text-neutral-400"
                          }`}
                        >
                          {item.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Acrylic Material, Depth & Reflection Controls */}
              <div className="p-6 sm:p-7 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card space-y-4">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-neutral-400" />
                  3. MATERIAL, DEPTH & REFLECTION
                </div>

                <div className="space-y-3">
                  {/* Material */}
                  <div>
                    <span className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Translucency Material:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {materials.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setConfig({ ...config, material: m.id })}
                          className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-center ${
                            config.material === m.id
                              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold border-neutral-900 dark:border-white shadow-xs"
                              : "bg-neutral-50 dark:bg-neutral-850 text-neutral-600 dark:text-neutral-400 border-neutral-200/70 dark:border-neutral-800"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Depth Slab */}
                  <div>
                    <span className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Acrylic Thickness & Depth:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {depths.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setConfig({ ...config, depth: d.id })}
                          className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-center ${
                            config.depth === d.id
                              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold border-neutral-900 dark:border-white shadow-xs"
                              : "bg-neutral-50 dark:bg-neutral-850 text-neutral-600 dark:text-neutral-400 border-neutral-200/70 dark:border-neutral-800"
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reflection */}
                  <div>
                    <span className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Specular Light Glare:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {reflections.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setConfig({ ...config, reflection: r.id })}
                          className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-center ${
                            config.reflection === r.id
                              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold border-neutral-900 dark:border-white shadow-xs"
                              : "bg-neutral-50 dark:bg-neutral-850 text-neutral-600 dark:text-neutral-400 border-neutral-200/70 dark:border-neutral-800"
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Outer Glow Halo */}
                  <div>
                    <span className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Outer Aura Glow:
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {glows.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setConfig({ ...config, glow: g.id })}
                          className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-center ${
                            config.glow === g.id
                              ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold border-neutral-900 dark:border-white shadow-xs"
                              : "bg-neutral-50 dark:bg-neutral-850 text-neutral-600 dark:text-neutral-400 border-neutral-200/70 dark:border-neutral-800"
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Shape System */}
              <div className="p-6 sm:p-7 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card space-y-3">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-neutral-400" />
                  4. PLAQUE GEOMETRY SHAPES ({shapes.length})
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {shapes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setConfig({ ...config, shape: s.id })}
                      className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all text-xs ${
                        config.shape === s.id
                          ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold border-neutral-900 dark:border-white shadow-xs"
                          : "bg-neutral-50 dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300 border-neutral-200/70 dark:border-neutral-800 hover:bg-neutral-100"
                      }`}
                    >
                      <span className="text-lg">{s.icon}</span>
                      <span className="truncate font-medium">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Accent Color Palette */}
              <div className="p-6 sm:p-7 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card space-y-3">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-neutral-400" />
                  5. ACCENT ENAMEL & COLOR TONE
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {Object.entries(COLOR_PRESETS).map(([key, col]) => {
                    const isSelected = config.colorPreset === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() =>
                          setConfig({
                            ...config,
                            colorPreset: key as ColorPreset,
                            customColor: col.hex,
                          })
                        }
                        className={`p-2.5 rounded-2xl border flex items-center gap-2 transition-all text-xs ${
                          isSelected
                            ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold border-neutral-900 dark:border-white shadow-xs"
                            : "bg-neutral-50 dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300 border-neutral-200/70 dark:border-neutral-800 hover:bg-neutral-100"
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className="truncate">{col.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Input */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, colorPreset: "custom" })}
                    className={`px-3.5 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                      config.colorPreset === "custom"
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs"
                        : "bg-neutral-50 dark:bg-neutral-850 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    <span>Custom Hex:</span>
                    <input
                      type="color"
                      value={config.customColor || "#84cc16"}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          colorPreset: "custom",
                          customColor: e.target.value,
                        })
                      }
                      className="w-5 h-5 rounded bg-transparent border-0 cursor-pointer"
                    />
                  </button>
                </div>
              </div>

              {/* 6. Center Vector Mark & Glyphs */}
              <div className="p-6 sm:p-7 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card space-y-3">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                  6. CENTER ENGRAVED VECTOR GLYPH ({Object.keys(VECTOR_ICONS).length})
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {Object.entries(VECTOR_ICONS).map(([key, iconItem]) => {
                    const isSelected = config.iconValue === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setConfig({ ...config, iconValue: key })}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-1 text-xs transition-all ${
                          isSelected
                            ? "bg-lime-100 dark:bg-lime-950/60 border-lime-400 dark:border-lime-700 text-neutral-900 dark:text-white font-semibold shadow-xs scale-105"
                            : "bg-neutral-50 dark:bg-neutral-850 border-neutral-200/70 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
                        }`}
                      >
                        <div
                          className="w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                          dangerouslySetInnerHTML={{
                            __html: `<svg viewBox="0 0 80 80">${iconItem.path}</svg>`,
                          }}
                        />
                        <span className="text-[10px] truncate max-w-full font-medium">
                          {iconItem.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 7. Engraved Typography & Content */}
              <div className="p-6 sm:p-7 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl shadow-card space-y-4">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-neutral-400" />
                  7. ENGRAVED TYPOGRAPHY & TAGS
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                        Event Title Inscription
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400">
                        {config.title.length}/48
                      </span>
                    </div>
                    <Input
                      value={config.title}
                      maxLength={48}
                      onChange={(e) => setConfig({ ...config, title: e.target.value })}
                      placeholder="e.g. ETH GLOBAL 2026"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                        Main Bottom Claim Tagline
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400">
                        {(config.subtitle || "").length}/24
                      </span>
                    </div>
                    <Input
                      value={config.subtitle || ""}
                      maxLength={24}
                      onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                      placeholder="e.g. I WAS THERE"
                    />
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                      Location / Region Inscription
                    </span>
                    <Input
                      value={config.location || ""}
                      maxLength={32}
                      onChange={(e) => setConfig({ ...config, location: e.target.value })}
                      placeholder="e.g. NEW YORK, USA"
                    />
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                      Year / Date Stamp
                    </span>
                    <Input
                      value={config.dateOrYear || ""}
                      maxLength={16}
                      onChange={(e) => setConfig({ ...config, dateOrYear: e.target.value })}
                      placeholder="e.g. 2026"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    id="hasInnerDashedRing"
                    checked={config.hasInnerDashedRing !== false}
                    onChange={(e) =>
                      setConfig({ ...config, hasInnerDashedRing: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-0"
                  />
                  <label htmlFor="hasInnerDashedRing" className="cursor-pointer">
                    Include inner concentric target reticle ring
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
