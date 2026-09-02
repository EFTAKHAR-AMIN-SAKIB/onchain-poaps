"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { BadgeShape, VECTOR_ICONS } from "@/lib/svg/generator";

export interface ShapeShowcase {
  id: BadgeShape;
  shapeName: string;
  shapeCategory: string;
  shapeEmoji: string;
  title: string;
  subtitle: string;
  location: string;
  coords: string;
  year: string;
  tokenId: string;
  merkleRoot: string;
  accentColor: string;
  auraColor: string;
  presetName: string;
  materialName: string;
  glyphIcon: "hackathon" | "event" | "lightning" | "shield" | "lock" | "trophy" | "sparkle" | "crown";
  // Geometry sizing & contours
  widthClass: string;
  heightClass: string;
  borderRadius: string;
  clipPath?: string;
}

export const SHAPE_SHOWCASES: ShapeShowcase[] = [
  {
    id: "medal",
    shapeName: "Medal Plaque",
    shapeCategory: "Squircle Plaque",
    shapeEmoji: "🏛️",
    title: "ETH GLOBAL 2026",
    subtitle: "I WAS THERE",
    location: "CANNES, FRANCE",
    coords: "43.5528° N, 7.0174° E",
    year: "2026",
    tokenId: "101",
    merkleRoot: "0x8f2b...9a4c",
    accentColor: "#3b82f6",
    auraColor: "from-blue-200/50 via-cyan-200/40 to-indigo-200/40 dark:from-blue-900/30 dark:via-cyan-900/20 dark:to-indigo-900/20",
    presetName: "Crystal Diamond",
    materialName: "Pure Transparent Acrylic",
    glyphIcon: "hackathon",
    widthClass: "w-[280px] sm:w-[320px] md:w-[340px]",
    heightClass: "h-[390px] sm:h-[430px] md:h-[450px]",
    borderRadius: "rounded-[2.5rem]",
  },
  {
    id: "round",
    shapeName: "Puck Disc",
    shapeCategory: "Circular Lens",
    shapeEmoji: "🟣",
    title: "DEVCON 7",
    subtitle: "INFINITE GARDEN",
    location: "BANGKOK, THAILAND",
    coords: "13.7563° N, 100.5018° E",
    year: "2026",
    tokenId: "102",
    merkleRoot: "0x77c4...bb09",
    accentColor: "#ec4899",
    auraColor: "from-pink-200/50 via-purple-200/40 to-indigo-200/40 dark:from-pink-900/30 dark:via-purple-900/20 dark:to-indigo-900/20",
    presetName: "Aurora Dispersion",
    materialName: "Prismatic Iridescent Glass",
    glyphIcon: "event",
    widthClass: "w-[300px] sm:w-[340px] md:w-[360px]",
    heightClass: "h-[300px] sm:h-[340px] md:h-[360px]",
    borderRadius: "rounded-full",
  },
  {
    id: "hexagon",
    shapeName: "Hexagon Prism",
    shapeCategory: "Faceted Polygon",
    shapeEmoji: "⬡",
    title: "BASE CAMP 2026",
    subtitle: "ONCHAIN BUILDER",
    location: "SAN FRANCISCO, USA",
    coords: "37.7749° N, 122.4194° W",
    year: "2026",
    tokenId: "103",
    merkleRoot: "0x3e1a...55d2",
    accentColor: "#0052ff",
    auraColor: "from-blue-200/50 via-lime-200/40 to-sky-200/40 dark:from-blue-900/30 dark:via-lime-900/20 dark:to-sky-900/20",
    presetName: "Base Cobalt Slab",
    materialName: "Clear Reflective Acrylic",
    glyphIcon: "lightning",
    widthClass: "w-[290px] sm:w-[330px] md:w-[350px]",
    heightClass: "h-[340px] sm:h-[380px] md:h-[400px]",
    borderRadius: "rounded-2xl",
    clipPath: "polygon(50% 0%, 98% 25%, 98% 75%, 50% 100%, 2% 75%, 2% 25%)",
  },
  {
    id: "shield",
    shapeName: "Shield Crest",
    shapeCategory: "Security Armor",
    shapeEmoji: "🛡️",
    title: "SECURITY WAR ROOM",
    subtitle: "WHITEHAT ALLIANCE",
    location: "ZURICH, SWITZERLAND",
    coords: "47.3769° N, 8.5417° E",
    year: "2026",
    tokenId: "104",
    merkleRoot: "0x44d1...ff78",
    accentColor: "#38bdf8",
    auraColor: "from-slate-300/50 via-cyan-200/40 to-blue-200/40 dark:from-slate-800/40 dark:via-cyan-900/20 dark:to-blue-900/20",
    presetName: "Smoked Midnight",
    materialName: "Smoked Obsidian Glass",
    glyphIcon: "shield",
    widthClass: "w-[280px] sm:w-[320px] md:w-[340px]",
    heightClass: "h-[360px] sm:h-[400px] md:h-[420px]",
    borderRadius: "rounded-3xl",
    clipPath: "polygon(50% 0%, 97% 12%, 97% 64%, 50% 100%, 3% 64%, 3% 12%)",
  },
  {
    id: "ticket",
    shapeName: "Cartridge Ticket",
    shapeCategory: "Notched Pass",
    shapeEmoji: "🎟️",
    title: "BASE TESTNET GENESIS",
    subtitle: "TESTNET VANGUARD",
    location: "BASE SEPOLIA / EVM",
    coords: "84532 CAIP-2 EIP155",
    year: "2026",
    tokenId: "105",
    merkleRoot: "0x91fa...12cc",
    accentColor: "#84cc16",
    auraColor: "from-lime-200/50 via-emerald-200/40 to-teal-200/40 dark:from-lime-900/30 dark:via-emerald-900/20 dark:to-teal-900/20",
    presetName: "Lime Glass",
    materialName: "Translucent Lime Plaque",
    glyphIcon: "lock",
    widthClass: "w-[270px] sm:w-[310px] md:w-[330px]",
    heightClass: "h-[380px] sm:h-[420px] md:h-[440px]",
    borderRadius: "rounded-2xl",
    clipPath: "polygon(0% 0%, 100% 0%, 100% 42%, 90% 50%, 100% 58%, 100% 100%, 0% 100%, 0% 58%, 10% 50%, 0% 42%)",
  },
  {
    id: "scallop",
    shapeName: "Stamp Edge",
    shapeCategory: "Postage Perforated",
    shapeEmoji: "🌸",
    title: "GITCOIN RETRO GALA",
    subtitle: "PUBLIC GOODS HERO",
    location: "AUSTIN, TEXAS, USA",
    coords: "30.2672° N, 97.7431° W",
    year: "2026",
    tokenId: "106",
    merkleRoot: "0x62cc...e810",
    accentColor: "#f59e0b",
    auraColor: "from-amber-200/50 via-orange-200/40 to-yellow-200/40 dark:from-amber-900/30 dark:via-orange-900/20 dark:to-yellow-900/20",
    presetName: "Pearl Alabaster",
    materialName: "Lustrous Gold Alabaster",
    glyphIcon: "trophy",
    widthClass: "w-[280px] sm:w-[320px] md:w-[340px]",
    heightClass: "h-[360px] sm:h-[400px] md:h-[420px]",
    borderRadius: "rounded-2xl",
    clipPath: "polygon(4% 0%, 96% 0%, 100% 4%, 100% 96%, 96% 100%, 4% 100%, 0% 96%, 0% 4%)",
  },
  {
    id: "orbital",
    shapeName: "Orbital Rings",
    shapeCategory: "Planetary Cosmic",
    shapeEmoji: "🪐",
    title: "ONCHAIN AI SUMMIT",
    subtitle: "AUTONOMOUS AGENTS",
    location: "TOKYO, JAPAN",
    coords: "35.6762° N, 139.6503° E",
    year: "2026",
    tokenId: "107",
    merkleRoot: "0x11ab...66ee",
    accentColor: "#9333ea",
    auraColor: "from-purple-200/50 via-fuchsia-200/40 to-violet-200/40 dark:from-purple-900/30 dark:via-fuchsia-900/20 dark:to-violet-900/20",
    presetName: "Violet Glass",
    materialName: "Amethyst Refraction Slab",
    glyphIcon: "sparkle",
    widthClass: "w-[300px] sm:w-[340px] md:w-[360px]",
    heightClass: "h-[320px] sm:h-[360px] md:h-[380px]",
    borderRadius: "rounded-[3rem]",
  },
  {
    id: "star",
    shapeName: "Star Crystal",
    shapeCategory: "Faceted Star",
    shapeEmoji: "⭐",
    title: "FOUNDERS GENESIS",
    subtitle: "DAY ONE BUILDER",
    location: "LONDON, UK",
    coords: "51.5074° N, 0.1278° W",
    year: "2026",
    tokenId: "108",
    merkleRoot: "0x89ee...4311",
    accentColor: "#eab308",
    auraColor: "from-amber-200/50 via-yellow-200/40 to-lime-200/40 dark:from-amber-900/30 dark:via-yellow-900/20 dark:to-lime-900/20",
    presetName: "Gold Diamond",
    materialName: "Star Faceted Crystal",
    glyphIcon: "crown",
    widthClass: "w-[290px] sm:w-[330px] md:w-[350px]",
    heightClass: "h-[330px] sm:h-[370px] md:h-[390px]",
    borderRadius: "rounded-2xl",
    clipPath: "polygon(50% 0%, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%, 0% 50%, 35% 35%)",
  },
];

export function GlassPlaqueHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Plaque 3D rotation angles in degrees
  const [rotY, setRotY] = useState(-14);
  const [rotX, setRotX] = useState(10);
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [isAutoShapeCycle, setIsAutoShapeCycle] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Orbital motion time (radians)
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [isOrbitHovered, setIsOrbitHovered] = useState(false);

  // Active Shape Showcase State
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const currentShape = SHAPE_SHOWCASES[currentShapeIndex];

  // Auto-Cycle Timer Progress tracking (0 - 100%)
  const [cycleProgress, setCycleProgress] = useState(0);
  const CYCLE_DURATION_MS = 4500;

  // Drag physics tracking
  const dragRef = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    startRotY: -14,
    startRotX: 10,
    lastX: 0,
    lastY: 0,
  });

  const animFrameRef = useRef<number | null>(null);

  // Continuous animation loop for Plaque 360° spin AND Orbital Node Motion
  useEffect(() => {
    let lastTime = performance.now();
    let accumulatedTime = 0;

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // 1. Plaque auto-spin
      if (isAutoSpin && !dragRef.current.isDown) {
        setRotY((prev) => (prev + delta * 16) % 360);
      }

      // 2. Orbital nodes revolution around plaque
      const orbitSpeed = isOrbitHovered ? 0.08 : 0.28;
      setOrbitAngle((prev) => (prev + delta * orbitSpeed) % (Math.PI * 2));

      // 3. Auto shape cycle timer
      if (isAutoShapeCycle && !dragRef.current.isDown) {
        accumulatedTime += delta * 1000;
        const progress = Math.min(100, (accumulatedTime / CYCLE_DURATION_MS) * 100);
        setCycleProgress(progress);

        if (accumulatedTime >= CYCLE_DURATION_MS) {
          accumulatedTime = 0;
          setCycleProgress(0);
          setCurrentShapeIndex((prev) => (prev + 1) % SHAPE_SHOWCASES.length);
        }
      } else {
        accumulatedTime = 0;
        setCycleProgress(0);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoSpin, isAutoShapeCycle, isOrbitHovered]);

  // Pointer event handlers for drag / touch 360° spin
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;

    dragRef.current = {
      isDown: true,
      startX: e.clientX,
      startY: e.clientY,
      startRotY: rotY,
      startRotX: rotX,
      lastX: e.clientX,
      lastY: e.clientY,
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

  const handleSelectShape = (index: number) => {
    setCurrentShapeIndex(index);
    setCycleProgress(0);
  };

  const handleNextShape = () => {
    setCurrentShapeIndex((prev) => (prev + 1) % SHAPE_SHOWCASES.length);
    setCycleProgress(0);
  };

  const handlePrevShape = () => {
    setCurrentShapeIndex((prev) =>
      prev === 0 ? SHAPE_SHOWCASES.length - 1 : prev - 1
    );
    setCycleProgress(0);
  };

  // Orbital Parametric Mathematics
  const ORBIT_CENTER = { x: 280, y: 240 };
  const ORBIT_RX = 228;
  const ORBIT_RY = 142;
  const ORBIT_TILT_RAD = (-22 * Math.PI) / 180;

  const calculateOrbitalPosition = useCallback(
    (offsetAngleRad: number) => {
      const theta = orbitAngle + offsetAngleRad;

      const u = ORBIT_RX * Math.cos(theta);
      const v = ORBIT_RY * Math.sin(theta);

      const cosPhi = Math.cos(ORBIT_TILT_RAD);
      const sinPhi = Math.sin(ORBIT_TILT_RAD);

      const x = ORBIT_CENTER.x + (u * cosPhi - v * sinPhi);
      const y = ORBIT_CENTER.y + (u * sinPhi + v * cosPhi);

      const z = Math.sin(theta);

      const scale = 0.9 + 0.22 * ((z + 1) / 2);
      const opacity = 0.75 + 0.25 * ((z + 1) / 2);
      const zIndex = z > 0 ? 35 : 5;

      return { x, y, z, scale, opacity, zIndex, theta };
    },
    [orbitAngle]
  );

  // 4 Orbital Nodes Configuration
  const orbitalNodes = [
    {
      id: "shield",
      title: "100% Onchain Bytecode",
      angleOffset: 0,
      icon: Shield,
      bg: "bg-[#f4fce3] dark:bg-lime-950/60",
      border: "border-lime-300 dark:border-lime-700",
      glow: "shadow-[0_0_24px_rgba(163,230,53,0.55)]",
      text: "text-lime-700 dark:text-lime-300",
      pos: calculateOrbitalPosition((140 * Math.PI) / 180),
    },
    {
      id: "link",
      title: "CAIP-2 Multichain Reference",
      angleOffset: Math.PI / 2,
      icon: Link2,
      bg: "bg-[#f3e8ff] dark:bg-purple-950/60",
      border: "border-purple-300 dark:border-purple-700",
      glow: "shadow-[0_0_24px_rgba(168,85,247,0.5)]",
      text: "text-purple-700 dark:text-purple-300",
      pos: calculateOrbitalPosition((50 * Math.PI) / 180),
    },
    {
      id: "lock",
      title: "Soulbound Immutable Record",
      angleOffset: Math.PI,
      icon: Lock,
      bg: "bg-[#f4fce3] dark:bg-lime-950/60",
      border: "border-lime-300 dark:border-lime-700",
      glow: "shadow-[0_0_24px_rgba(163,230,53,0.55)]",
      text: "text-lime-700 dark:text-lime-300",
      pos: calculateOrbitalPosition((-40 * Math.PI) / 180),
    },
    {
      id: "qr",
      title: "Live Stage QR Mode",
      angleOffset: (3 * Math.PI) / 2,
      icon: QrCode,
      bg: "bg-[#e0f2fe] dark:bg-sky-950/60",
      border: "border-sky-300 dark:border-sky-700",
      glow: "shadow-[0_0_24px_rgba(56,189,248,0.5)]",
      text: "text-sky-700 dark:text-sky-300",
      pos: calculateOrbitalPosition((-130 * Math.PI) / 180),
    },
  ];

  // Dynamic glare calculation
  const normalizedY = ((rotY % 360) + 360) % 360;
  const isFrontFacing = normalizedY < 90 || normalizedY > 270;
  const glareX = 50 + Math.sin((normalizedY * Math.PI) / 180) * 40;
  const glareY = 40 + Math.cos((rotX * Math.PI) / 180) * 15;

  const currentGlyphSvg = VECTOR_ICONS[currentShape.glyphIcon]?.path || "";

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[580px] mx-auto select-none">
      {/* 3D Interactive Stage Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full h-[460px] sm:h-[520px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none ${
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

        {/* Ambient Multi-Color Glow Aura matching active shape colorway */}
        <div
          className={`absolute w-[360px] sm:w-[460px] h-[360px] sm:h-[460px] rounded-full bg-gradient-to-tr ${currentShape.auraColor} blur-3xl -z-10 pointer-events-none transition-all duration-700`}
        />

        {/* SVG Constellation & Orbital Ellipse Network */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          viewBox="0 0 560 560"
          fill="none"
          style={{ zIndex: 10 }}
        >
          {/* Main Primary Orbital Ellipse Track */}
          <ellipse
            cx={ORBIT_CENTER.x}
            cy={ORBIT_CENTER.y}
            rx={ORBIT_RX}
            ry={ORBIT_RY}
            transform={`rotate(-22 ${ORBIT_CENTER.x} ${ORBIT_CENTER.y})`}
            stroke="#d4d4d8"
            strokeWidth="1.2"
            strokeDasharray="4 6"
            className="dark:stroke-neutral-800 opacity-80"
          />

          {/* Secondary Counter-Tilted Outer Ellipse */}
          <ellipse
            cx={ORBIT_CENTER.x}
            cy={ORBIT_CENTER.y}
            rx="215"
            ry="115"
            transform={`rotate(38 ${ORBIT_CENTER.x} ${ORBIT_CENTER.y})`}
            stroke="#e4e4e7"
            strokeWidth="1"
            className="dark:stroke-neutral-850 opacity-50"
          />

          {/* Dynamic Constellation Tether Curves connecting orbiting nodes */}
          <path
            d={`M ${orbitalNodes[0].pos.x} ${orbitalNodes[0].pos.y} Q ${ORBIT_CENTER.x} 100, ${orbitalNodes[1].pos.x} ${orbitalNodes[1].pos.y}`}
            stroke="#cbd5e1"
            strokeWidth="0.8"
            strokeDasharray="2 4"
            className="dark:stroke-neutral-800 opacity-60"
          />
          <path
            d={`M ${orbitalNodes[2].pos.x} ${orbitalNodes[2].pos.y} Q ${ORBIT_CENTER.x} 420, ${orbitalNodes[3].pos.x} ${orbitalNodes[3].pos.y}`}
            stroke="#cbd5e1"
            strokeWidth="0.8"
            strokeDasharray="2 4"
            className="dark:stroke-neutral-800 opacity-60"
          />

          {/* Glowing Constellation Star Particles */}
          <circle cx="160" cy="130" r="2" fill="#a1a1aa" className="animate-pulse" />
          <circle cx="420" cy="115" r="2" fill="#a1a1aa" />
          <circle cx="435" cy="410" r="2" fill="#a1a1aa" className="animate-pulse" />
          <circle cx="130" cy="350" r="2" fill="#a1a1aa" />
        </svg>

        {/* 4 DYNAMIC MOVING ORBITAL NODES REVOLVING IN 3D SPACE */}
        {orbitalNodes.map((node) => {
          const IconComp = node.icon;
          const { x, y, scale, opacity, zIndex } = node.pos;
          const isHovered = activeNode === node.id;

          return (
            <div
              key={node.id}
              style={{
                position: "absolute",
                left: `${(x / 560) * 100}%`,
                top: `${(y / 560) * 100}%`,
                transform: `translate(-50%, -50%) scale(${isHovered ? scale * 1.2 : scale})`,
                opacity: opacity,
                zIndex: zIndex,
                transition: isHovered
                  ? "transform 0.2s ease-out, opacity 0.2s ease-out"
                  : "opacity 0.2s ease-out",
              }}
              className="cursor-pointer group"
              onMouseEnter={() => {
                setActiveNode(node.id);
                setIsOrbitHovered(true);
              }}
              onMouseLeave={() => {
                setActiveNode(null);
                setIsOrbitHovered(false);
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleNextShape();
              }}
            >
              <div className="relative">
                {/* Node Pill Badge */}
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${node.bg} border ${node.border} ${node.glow} ${node.text} flex items-center justify-center transition-transform duration-200`}
                >
                  <IconComp className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </div>

                {/* Tooltip Card */}
                {isHovered && (
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-neutral-900 text-white text-[10px] font-mono rounded-lg whitespace-nowrap shadow-xl z-50 pointer-events-none">
                    {node.title}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* 360-DEGREE ROTATING 3D GLASS PLAQUE WITH DYNAMIC MORPHING GEOMETRY */}
        <div
          className="relative z-20 transition-transform ease-out flex items-center justify-center"
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transformStyle: "preserve-3d",
            transitionDuration: isDragging ? "0ms" : "150ms",
          }}
        >
          {/* Realistic Ground Shadow beneath Plaque */}
          <div
            className="absolute -bottom-10 left-6 right-6 h-12 bg-black/25 dark:bg-black/60 rounded-full blur-2xl -z-20 pointer-events-none transition-all duration-500"
            style={{
              transform: "rotateX(90deg) translateZ(-40px) scale(1.1)",
            }}
          />

          {/* Plaque 3D Slab Thickness Core Layer */}
          <div
            className={`absolute inset-0 ${currentShape.borderRadius} pointer-events-none -z-10 transition-all duration-500`}
            style={{
              clipPath: currentShape.clipPath,
              transform: "translateZ(-14px)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(200,225,255,0.45) 40%, rgba(180,210,240,0.65) 80%, rgba(140,180,220,0.85) 100%)",
              boxShadow:
                "12px 18px 36px rgba(0,0,0,0.14), 4px 6px 12px rgba(0,0,0,0.08)",
            }}
          />

          {/* ================= FRONT SIDE ================= */}
          <div
            className={`relative ${currentShape.widthClass} ${currentShape.heightClass} ${currentShape.borderRadius} overflow-hidden p-6 sm:p-7 flex flex-col justify-between items-center text-center border border-white/90 dark:border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12),_inset_0_1px_2px_rgba(255,255,255,0.95),_inset_0_-2px_4px_rgba(0,0,0,0.04)] transition-all duration-500`}
            style={{
              clipPath: currentShape.clipPath,
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.88) 0%, rgba(248,250,252,0.78) 45%, rgba(241,245,249,0.84) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              transform: "translateZ(12px)",
              backfaceVisibility: "hidden",
            }}
          >
            {/* Holographic Prismatic Rainbow Flare */}
            <div
              className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full pointer-events-none opacity-45 mix-blend-color-dodge blur-xl transition-all duration-500"
              style={{
                background: `linear-gradient(135deg, ${currentShape.accentColor}80 0%, rgba(168,85,247,0.5) 40%, rgba(236,72,153,0.5) 70%, rgba(234,179,8,0.5) 100%)`,
              }}
            />

            {/* Specular Glare Reflection Layer */}
            <div
              className={`pointer-events-none absolute inset-0 ${currentShape.borderRadius} z-30 transition-opacity duration-200`}
              style={{
                clipPath: currentShape.clipPath,
                background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.25) 30%, transparent 65%)`,
                opacity: isFrontFacing ? 0.65 : 0.1,
              }}
            />

            {/* Front Header */}
            <div className="space-y-1 z-20 pt-1">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className="text-lime-500 font-bold text-xs">✦</span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  {currentShape.shapeName}
                </span>
                <span className="text-lime-500 font-bold text-xs">✦</span>
              </div>

              <h2 className="font-extrabold text-base sm:text-lg tracking-wider text-neutral-900 uppercase font-sans">
                {currentShape.title}
              </h2>

              <div className="text-[10px] font-mono font-medium tracking-widest text-neutral-500 uppercase">
                {currentShape.location}
              </div>
              <div className="text-[9px] font-mono text-neutral-400 tracking-wider">
                {currentShape.coords}
              </div>
            </div>

            {/* Centerpiece: Concentric Circular Medallion Lens with Dynamic Vector Glyph */}
            <div className="relative my-1 z-20 flex items-center justify-center">
              <div
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center p-2.5 shadow-[inset_0_3px_6px_rgba(255,255,255,0.9),_inset_0_-3px_6px_rgba(0,0,0,0.08),_0_10px_25px_rgba(0,0,0,0.06)] transition-all duration-300"
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
                  className="w-22 h-22 sm:w-28 sm:h-28 rounded-full flex items-center justify-center p-2 shadow-[inset_0_2px_4px_rgba(255,255,255,0.95),_inset_0_-2px_4px_rgba(0,0,0,0.06)]"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(248,250,252,0.9) 50%, rgba(226,232,240,0.95) 100%)",
                    border: "1.5px solid rgba(255,255,255,0.9)",
                  }}
                >
                  {/* Center Bullseye Disc with Vector Glyph */}
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),_0_2px_4px_rgba(255,255,255,0.8)] text-neutral-800 p-2"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(241,245,249,0.95) 0%, rgba(203,213,225,0.75) 100%)",
                    }}
                  >
                    <div
                      className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full text-neutral-800"
                      dangerouslySetInnerHTML={{
                        __html: `<svg viewBox="0 0 80 80">${currentGlyphSvg}</svg>`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Front Inscription Footer */}
            <div className="space-y-0.5 z-20 pb-1">
              <div className="font-extrabold text-lg sm:text-xl tracking-tight text-neutral-900 uppercase font-sans">
                {currentShape.subtitle}
              </div>
              <div className="text-[10px] font-mono tracking-wider text-neutral-500">
                Minted onchain • {currentShape.year}
              </div>
              <div className="text-[9px] font-mono tracking-wider text-neutral-400">
                Forever verifiable
              </div>
            </div>
          </div>

          {/* ================= REVERSE BACK SIDE ================= */}
          <div
            className={`absolute inset-0 ${currentShape.widthClass} ${currentShape.heightClass} ${currentShape.borderRadius} overflow-hidden p-6 sm:p-7 flex flex-col justify-between items-center text-center border border-white/90 dark:border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] transition-all duration-500`}
            style={{
              clipPath: currentShape.clipPath,
              background:
                "linear-gradient(145deg, rgba(248,250,252,0.94) 0%, rgba(241,245,249,0.88) 45%, rgba(226,232,240,0.92) 100%)",
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

            {/* Back Header */}
            <div className="space-y-1.5 z-20 pt-1 w-full">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5 px-1">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-400">
                  TOKEN #{currentShape.tokenId}
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
            <div className="w-full bg-white/75 rounded-2xl p-3 sm:p-4 border border-neutral-200/80 text-left space-y-1.5 z-20 shadow-xs">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>GEOMETRY SHAPE</span>
                <span className="text-neutral-900 font-bold uppercase">
                  {currentShape.shapeName}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>SSTORE2 POINTER</span>
                <span className="text-neutral-900 font-bold">0x7f4a...ba89</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>MERKLE ROOT</span>
                <span className="text-neutral-900 font-bold">{currentShape.merkleRoot}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>STORAGE GAS</span>
                <span className="text-emerald-600 font-bold">-88.4% SAVED</span>
              </div>
              <div className="pt-1 border-t border-neutral-200/60 flex items-center justify-between text-[9px] font-mono text-neutral-400">
                <span>STANDALONE CAIP-2</span>
                <span>eip155:84532</span>
              </div>
            </div>

            {/* Back Footer: Inscription Seal */}
            <div className="space-y-0.5 z-20 pb-1">
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

      {/* Floating 360° Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 z-30">
        {/* Drag Hint Pill */}
        <div className="px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5 shadow-xs">
          <RotateCw className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 animate-spin-slow" />
          <span>Drag to spin 360°</span>
        </div>

        {/* Auto-Spin 360 Toggle */}
        <button
          onClick={() => setIsAutoSpin(!isAutoSpin)}
          className="px-3 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
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
          className="px-3 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
          title="Reset viewing angle"
        >
          <RotateCcw className="w-3 h-3 text-neutral-500" />
          <span>Reset</span>
        </button>

        {/* Switch Shape Button */}
        <button
          onClick={handleNextShape}
          className="px-3.5 py-1.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[11px] font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          title="Switch POAP shape preview"
        >
          <Sparkles className="w-3 h-3 text-lime-400 dark:text-lime-600" />
          <span>Switch ({currentShapeIndex + 1}/{SHAPE_SHOWCASES.length})</span>
        </button>
      </div>
    </div>
  );
}
