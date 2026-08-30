"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Shield,
  QrCode,
  Link2,
  Lock,
  RotateCw,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
} from "lucide-react";

export function GlassPlaqueHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotation angles in degrees
  const [rotY, setRotY] = useState(-14);
  const [rotX, setRotX] = useState(10);
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Drag physics tracking
  const dragRef = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    startRotY: -14,
    startRotX: 10,
    lastX: 0,
    lastY: 0,
    velocity: 0,
  });

  const animFrameRef = useRef<number | null>(null);

  // Sample POAP memories to switch between
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const sampleEvents = [
    {
      title: "ETH GLOBAL 2025",
      location: "NEW YORK, USA",
      coords: "40.7128° N, 74.0060° W",
      badgeText: "I WAS THERE",
      year: "2025",
      id: "101",
      merkleRoot: "0x8f2b...9a4c",
      color: "lime",
    },
    {
      title: "BASE CAMP 2026",
      location: "SAN FRANCISCO, USA",
      coords: "37.7749° N, 122.4194° W",
      badgeText: "I WAS THERE",
      year: "2026",
      id: "102",
      merkleRoot: "0x3e1a...55d2",
      color: "blue",
    },
    {
      title: "DEVCON 7",
      location: "BANGKOK, THAILAND",
      coords: "13.7563° N, 100.5018° E",
      badgeText: "I WAS THERE",
      year: "2024",
      id: "103",
      merkleRoot: "0x77c4...bb09",
      color: "purple",
    },
  ];

  const currentEvent = sampleEvents[currentEventIndex];

  // Auto-spin animation loop
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isAutoSpin && !dragRef.current.isDown) {
        setRotY((prev) => (prev + delta * 18) % 360);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoSpin]);

  // Pointer event handlers for drag / touch 360° spin
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag with primary mouse button or touch
    if (e.button !== 0 && e.pointerType === "mouse") return;

    dragRef.current = {
      isDown: true,
      startX: e.clientX,
      startY: e.clientY,
      startRotY: rotY,
      startRotX: rotX,
      lastX: e.clientX,
      lastY: e.clientY,
      velocity: 0,
    };
    setIsDragging(true);

    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDown) return;

    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;

    // 1px move corresponds to ~0.55 deg rotation
    const newRotY = dragRef.current.startRotY + deltaX * 0.55;
    const newRotX = Math.max(
      -35,
      Math.min(35, dragRef.current.startRotX - deltaY * 0.4)
    );

    setRotY(newRotY);
    setRotX(newRotX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.isDown) return;
    dragRef.current.isDown = false;
    setIsDragging(false);

    if (containerRef.current) {
      try {
        containerRef.current.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handleResetAngle = () => {
    setRotY(-14);
    setRotX(10);
  };

  // Calculate dynamic glare based on rotation
  const normalizedY = ((rotY % 360) + 360) % 360;
  const isFrontFacing = normalizedY < 90 || normalizedY > 270;
  const glareX = 50 + Math.sin((normalizedY * Math.PI) / 180) * 40;
  const glareY = 40 + Math.cos((rotX * Math.PI) / 180) * 15;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[580px] mx-auto select-none">
      {/* 3D Interactive Stage Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full h-[470px] sm:h-[530px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none ${
          isDragging ? "cursor-grabbing" : ""
        }`}
        style={{ perspective: "1400px" }}
      >
        {/* Background Dot Grid Matrix */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 -z-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, #94a3b8 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(circle at 50% 50%, black 35%, transparent 75%)",
          }}
        />

        {/* Ambient Multi-Color Pastel Glow Aura */}
        <div className="absolute w-[340px] sm:w-[440px] h-[340px] sm:h-[440px] rounded-full bg-gradient-to-tr from-lime-200/50 via-purple-200/40 to-blue-200/40 dark:from-lime-900/30 dark:via-purple-900/20 dark:to-blue-900/20 blur-3xl -z-10 pointer-events-none" />

        {/* Constellation & Orbital Network (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-visible"
          viewBox="0 0 560 560"
          fill="none"
        >
          {/* Orbital Ellipse 1 */}
          <ellipse
            cx="280"
            cy="280"
            rx="245"
            ry="145"
            transform="rotate(-20 280 280)"
            stroke="#d4d4d8"
            strokeWidth="1"
            strokeDasharray="4 6"
            className="dark:stroke-neutral-800 opacity-70"
          />

          {/* Orbital Ellipse 2 */}
          <ellipse
            cx="280"
            cy="280"
            rx="210"
            ry="110"
            transform="rotate(35 280 280)"
            stroke="#e4e4e7"
            strokeWidth="1"
            className="dark:stroke-neutral-850 opacity-60"
          />

          {/* Connecting Constellation Curves */}
          <path
            d="M 90 120 Q 180 80, 270 120 T 460 170"
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="2 4"
            className="dark:stroke-neutral-800"
          />
          <path
            d="M 120 420 Q 240 480, 380 430 T 470 360"
            stroke="#e2e8f0"
            strokeWidth="1"
            strokeDasharray="2 4"
            className="dark:stroke-neutral-800"
          />

          {/* Glowing Constellation Stars */}
          <circle cx="160" cy="140" r="2.5" fill="#a1a1aa" className="animate-pulse" />
          <circle cx="410" cy="120" r="2" fill="#a1a1aa" />
          <circle cx="430" cy="420" r="2.5" fill="#a1a1aa" className="animate-pulse" />
          <circle cx="140" cy="340" r="2" fill="#a1a1aa" />
        </svg>

        {/* 4 Interactive Orbital Feature Nodes */}
        {/* 1. Top-Left Node: Shield */}
        <div
          className="absolute top-6 left-6 sm:top-8 sm:left-12 z-30 group cursor-pointer"
          onMouseEnter={() => setActiveNode("shield")}
          onMouseLeave={() => setActiveNode(null)}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentEventIndex((prev) => (prev + 1) % sampleEvents.length);
          }}
        >
          <div className="relative">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#f4fce3] dark:bg-lime-950/60 border border-lime-300 dark:border-lime-700 shadow-[0_0_20px_rgba(163,230,53,0.45)] flex items-center justify-center text-lime-700 dark:text-lime-300 transition-transform duration-200 group-hover:scale-115">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            {activeNode === "shield" && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-mono rounded-lg whitespace-nowrap shadow-lg z-40">
                100% Onchain Bytecode
              </div>
            )}
          </div>
        </div>

        {/* 2. Top-Right Node: Link */}
        <div
          className="absolute top-14 right-6 sm:top-18 sm:right-10 z-30 group cursor-pointer"
          onMouseEnter={() => setActiveNode("link")}
          onMouseLeave={() => setActiveNode(null)}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentEventIndex((prev) => (prev + 1) % sampleEvents.length);
          }}
        >
          <div className="relative">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#f3e8ff] dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700 shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center text-purple-700 dark:text-purple-300 transition-transform duration-200 group-hover:scale-115">
              <Link2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            {activeNode === "link" && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-mono rounded-lg whitespace-nowrap shadow-lg z-40">
                CAIP-2 Multichain Reference
              </div>
            )}
          </div>
        </div>

        {/* 3. Bottom-Left Node: QR Code */}
        <div
          className="absolute bottom-12 left-4 sm:bottom-16 sm:left-8 z-30 group cursor-pointer"
          onMouseEnter={() => setActiveNode("qr")}
          onMouseLeave={() => setActiveNode(null)}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentEventIndex((prev) => (prev + 1) % sampleEvents.length);
          }}
        >
          <div className="relative">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#e0f2fe] dark:bg-sky-950/60 border border-sky-300 dark:border-sky-700 shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center justify-center text-sky-700 dark:text-sky-300 transition-transform duration-200 group-hover:scale-115">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            {activeNode === "qr" && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-mono rounded-lg whitespace-nowrap shadow-lg z-40">
                Live Stage QR Mode
              </div>
            )}
          </div>
        </div>

        {/* 4. Bottom-Right Node: Lock */}
        <div
          className="absolute bottom-8 right-8 sm:bottom-12 sm:right-14 z-30 group cursor-pointer"
          onMouseEnter={() => setActiveNode("lock")}
          onMouseLeave={() => setActiveNode(null)}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentEventIndex((prev) => (prev + 1) % sampleEvents.length);
          }}
        >
          <div className="relative">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#f4fce3] dark:bg-lime-950/60 border border-lime-300 dark:border-lime-700 shadow-[0_0_20px_rgba(163,230,53,0.45)] flex items-center justify-center text-lime-700 dark:text-lime-300 transition-transform duration-200 group-hover:scale-115">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            {activeNode === "lock" && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-mono rounded-lg whitespace-nowrap shadow-lg z-40">
                Soulbound Immutable Record
              </div>
            )}
          </div>
        </div>

        {/* 360-DEGREE ROTATING 3D GLASS CARTRIDGE */}
        <div
          className="relative z-20 transition-transform ease-out"
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transformStyle: "preserve-3d",
            transitionDuration: isDragging ? "0ms" : "150ms",
          }}
        >
          {/* Ground Contact Shadow beneath Plaque */}
          <div
            className="absolute -bottom-10 left-6 right-6 h-12 bg-black/25 dark:bg-black/60 rounded-full blur-2xl -z-20 pointer-events-none"
            style={{
              transform: "rotateX(90deg) translateZ(-40px) scale(1.1)",
            }}
          />

          {/* Plaque 3D Slab Thickness Core */}
          <div
            className="absolute inset-0 rounded-[2.5rem] pointer-events-none -z-10"
            style={{
              transform: "translateZ(-14px)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(200,225,255,0.4) 40%, rgba(180,210,240,0.6) 80%, rgba(140,180,220,0.8) 100%)",
              boxShadow:
                "12px 18px 36px rgba(0,0,0,0.14), 4px 6px 12px rgba(0,0,0,0.08)",
            }}
          />

          {/* ================= FRONT SIDE ================= */}
          <div
            className="relative w-[280px] sm:w-[320px] md:w-[340px] h-[410px] sm:h-[450px] md:h-[470px] rounded-[2.5rem] overflow-hidden p-6 sm:p-8 flex flex-col justify-between items-center text-center border border-white/90 dark:border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12),_inset_0_1px_2px_rgba(255,255,255,0.95),_inset_0_-2px_4px_rgba(0,0,0,0.04)]"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.88) 0%, rgba(248,250,252,0.75) 45%, rgba(241,245,249,0.82) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              transform: "translateZ(12px)",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Holographic Prismatic Rainbow Flare (Bottom-Right) */}
            <div
              className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full pointer-events-none opacity-45 mix-blend-color-dodge blur-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.5) 0%, rgba(168,85,247,0.5) 40%, rgba(236,72,153,0.5) 70%, rgba(234,179,8,0.5) 100%)",
              }}
            />

            {/* Specular Glare Reflection Layer */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[2.5rem] z-30 transition-opacity duration-200"
              style={{
                background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 30%, transparent 65%)`,
                opacity: isFrontFacing ? 0.6 : 0.1,
              }}
            />

            {/* Front Header */}
            <div className="space-y-1.5 z-20 pt-1">
              <div className="flex justify-center mb-1">
                <span className="text-lime-500 font-bold text-sm tracking-widest">
                  ✦
                </span>
              </div>

              <h2 className="font-extrabold text-base sm:text-lg tracking-wider text-neutral-900 uppercase font-sans">
                {currentEvent.title}
              </h2>

              <div className="text-[10px] font-mono font-medium tracking-widest text-neutral-500 uppercase">
                {currentEvent.location}
              </div>
              <div className="text-[9px] font-mono text-neutral-400 tracking-wider">
                {currentEvent.coords}
              </div>
            </div>

            {/* Centerpiece: Concentric Circular Medallion Lens */}
            <div className="relative my-2 z-20 flex items-center justify-center">
              <div
                className="w-34 h-34 sm:w-42 sm:h-42 rounded-full flex items-center justify-center p-2.5 shadow-[inset_0_3px_6px_rgba(255,255,255,0.9),_inset_0_-3px_6px_rgba(0,0,0,0.08),_0_10px_25px_rgba(0,0,0,0.06)]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(241,245,249,0.9) 60%, rgba(226,232,240,0.85) 100%)",
                  border: "1px solid rgba(255,255,255,0.8)",
                }}
              >
                {/* Reticle Tick Ring */}
                <div className="absolute inset-2 rounded-full border border-dashed border-neutral-300/70 pointer-events-none" />

                {/* Middle Ring */}
                <div
                  className="w-26 h-26 sm:w-32 sm:h-32 rounded-full flex items-center justify-center p-3 shadow-[inset_0_2px_4px_rgba(255,255,255,0.95),_inset_0_-2px_4px_rgba(0,0,0,0.06)]"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(248,250,252,0.9) 50%, rgba(226,232,240,0.95) 100%)",
                    border: "1.5px solid rgba(255,255,255,0.9)",
                  }}
                >
                  {/* Center Bullseye Disc */}
                  <div
                    className="w-12 h-12 sm:w-15 sm:h-15 rounded-full flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),_0_2px_4px_rgba(255,255,255,0.8)]"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(241,245,249,0.9) 0%, rgba(203,213,225,0.7) 100%)",
                    }}
                  >
                    <div className="w-5 h-5 rounded-full bg-white/90 shadow-inner flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-neutral-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Front Inscription Footer */}
            <div className="space-y-1 z-20 pb-1">
              <div className="font-extrabold text-xl sm:text-2xl tracking-tight text-neutral-900 uppercase font-sans">
                {currentEvent.badgeText}
              </div>
              <div className="text-[10px] font-mono tracking-wider text-neutral-500">
                Minted onchain
              </div>
              <div className="text-[9px] font-mono tracking-wider text-neutral-400">
                Forever verifiable
              </div>
            </div>
          </div>

          {/* ================= REVERSE BACK SIDE ================= */}
          <div
            className="absolute inset-0 w-[280px] sm:w-[320px] md:w-[340px] h-[410px] sm:h-[450px] md:h-[470px] rounded-[2.5rem] overflow-hidden p-6 sm:p-8 flex flex-col justify-between items-center text-center border border-white/90 dark:border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)]"
            style={{
              background:
                "linear-gradient(145deg, rgba(248,250,252,0.92) 0%, rgba(241,245,249,0.85) 45%, rgba(226,232,240,0.9) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              transform: "rotateY(180deg) translateZ(12px)",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Holographic Circuit Pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, #3b82f6 2px, transparent 2px), radial-gradient(circle at 80% 70%, #ec4899 2px, transparent 2px)",
                backgroundSize: "28px 28px",
              }}
            />

            {/* Back Header: Protocol Badges */}
            <div className="space-y-2 z-20 pt-2 w-full">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2 px-1">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-400">
                  TOKEN #{currentEvent.id}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-lime-100 text-lime-800 text-[10px] font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                  BASE SEPOLIA
                </span>
              </div>
              <div className="font-mono text-xs font-bold text-neutral-800">
                ERC-1155 IMMUTABLE STORAGE
              </div>
            </div>

            {/* Back Center: Smart Contract Verification Matrix */}
            <div className="w-full bg-white/70 rounded-2xl p-4 border border-neutral-200/80 text-left space-y-2 z-20 shadow-xs">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>SSTORE2 POINTER</span>
                <span className="text-neutral-900 font-bold">0x7f4a...ba89</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>MERKLE ROOT</span>
                <span className="text-neutral-900 font-bold">{currentEvent.merkleRoot}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>STORAGE GAS</span>
                <span className="text-emerald-600 font-bold">-88.4% SAVED</span>
              </div>
              <div className="pt-1.5 border-t border-neutral-200/60 flex items-center justify-between text-[9px] font-mono text-neutral-400">
                <span>STANDALONE CAIP-2</span>
                <span>eip155:84532</span>
              </div>
            </div>

            {/* Back Footer: Inscription Seal */}
            <div className="space-y-1 z-20 pb-2">
              <div className="text-[11px] font-mono font-bold tracking-widest text-neutral-700 uppercase">
                ONCHAIN MEMORIES PROTOCOL
              </div>
              <div className="text-[9px] font-mono text-neutral-400">
                Zero IPFS • Direct EVM Verification
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Floating 360° Controls Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 z-30">
        {/* Drag Hint Pill */}
        <div className="px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5 shadow-xs">
          <RotateCw className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 animate-spin-slow" />
          <span>Drag to spin 360°</span>
        </div>

        {/* Auto-Spin Toggle Button */}
        <button
          onClick={() => setIsAutoSpin(!isAutoSpin)}
          className="px-3 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-1.5 shadow-xs transition-colors"
          title={isAutoSpin ? "Pause 360° auto-spin" : "Play 360° auto-spin"}
        >
          {isAutoSpin ? (
            <>
              <Pause className="w-3 h-3 text-neutral-500" />
              <span>Auto-Spin</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-lime-600" />
              <span>Resume Spin</span>
            </>
          )}
        </button>

        {/* Reset Angle Button */}
        <button
          onClick={handleResetAngle}
          className="px-3 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-1 shadow-xs transition-colors"
          title="Reset viewing angle"
        >
          <RotateCcw className="w-3 h-3 text-neutral-500" />
          <span>Reset</span>
        </button>

        {/* Switch POAP Sample Memory Button */}
        <button
          onClick={() => setCurrentEventIndex((prev) => (prev + 1) % sampleEvents.length)}
          className="px-3 py-1.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[11px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center gap-1.5 shadow-xs transition-colors"
          title="Switch POAP memory preview"
        >
          <Sparkles className="w-3 h-3 text-lime-400 dark:text-lime-600" />
          <span>Switch ({currentEventIndex + 1}/3)</span>
        </button>
      </div>
    </div>
  );
}
