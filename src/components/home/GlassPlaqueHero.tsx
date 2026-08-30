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

export function GlassPlaqueHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Plaque 3D rotation angles in degrees
  const [rotY, setRotY] = useState(-14);
  const [rotX, setRotX] = useState(10);
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  // Orbital motion time (radians)
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [isOrbitHovered, setIsOrbitHovered] = useState(false);

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

  // Continuous animation loop for Plaque 360° spin AND Orbital Node Motion
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // 1. Plaque auto-spin
      if (isAutoSpin && !dragRef.current.isDown) {
        setRotY((prev) => (prev + delta * 16) % 360);
      }

      // 2. Orbital nodes revolution around plaque (~18s full period)
      // Slow down to gentle cruise speed when hovering over a node
      const orbitSpeed = isOrbitHovered ? 0.08 : 0.28;
      setOrbitAngle((prev) => (prev + delta * orbitSpeed) % (Math.PI * 2));

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoSpin, isOrbitHovered]);

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

  // Orbital Parametric Mathematics
  // Center (280, 240), Semi-major axis Rx = 230, Semi-minor axis Ry = 140, Tilt phi = -22deg
  const ORBIT_CENTER = { x: 280, y: 240 };
  const ORBIT_RX = 228;
  const ORBIT_RY = 142;
  const ORBIT_TILT_RAD = (-22 * Math.PI) / 180;

  const calculateOrbitalPosition = useCallback(
    (offsetAngleRad: number) => {
      const theta = orbitAngle + offsetAngleRad;

      // Coordinate on untilted ellipse
      const u = ORBIT_RX * Math.cos(theta);
      const v = ORBIT_RY * Math.sin(theta);

      // Rotate by orbit plane tilt angle
      const cosPhi = Math.cos(ORBIT_TILT_RAD);
      const sinPhi = Math.sin(ORBIT_TILT_RAD);

      const x = ORBIT_CENTER.x + (u * cosPhi - v * sinPhi);
      const y = ORBIT_CENTER.y + (u * sinPhi + v * cosPhi);

      // Depth z: range -1 to 1. Positive means in front of plaque, negative means behind
      const z = Math.sin(theta);

      // Scale & opacity based on depth
      const scale = 0.9 + 0.22 * ((z + 1) / 2);
      const opacity = 0.75 + 0.25 * ((z + 1) / 2);
      const zIndex = z > 0 ? 35 : 5; // Layer in front or behind the 3D acrylic plaque

      return { x, y, z, scale, opacity, zIndex, theta };
    },
    [orbitAngle]
  );

  // 4 Orbital Nodes Configuration with 90° angular offsets
  const orbitalNodes = [
    {
      id: "shield",
      title: "100% Onchain Bytecode",
      angleOffset: 0, // Top-Left start region
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
      angleOffset: Math.PI / 2, // Top-Right region
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
      angleOffset: Math.PI, // Bottom-Right region
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
      angleOffset: (3 * Math.PI) / 2, // Bottom-Left region
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

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[580px] mx-auto select-none">
      {/* 3D Interactive Stage Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full h-[480px] sm:h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none ${
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
        <div className="absolute w-[360px] sm:w-[460px] h-[360px] sm:h-[460px] rounded-full bg-gradient-to-tr from-lime-200/50 via-purple-200/40 to-blue-200/40 dark:from-lime-900/30 dark:via-purple-900/20 dark:to-blue-900/20 blur-3xl -z-10 pointer-events-none" />

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
                setCurrentEventIndex((prev) => (prev + 1) % sampleEvents.length);
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

        {/* 360-DEGREE ROTATING 3D GLASS CARTRIDGE PLAQUE */}
        <div
          className="relative z-20 transition-transform ease-out"
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transformStyle: "preserve-3d",
            transitionDuration: isDragging ? "0ms" : "150ms",
          }}
        >
          {/* Realistic Ground Shadow beneath Plaque */}
          <div
            className="absolute -bottom-10 left-6 right-6 h-12 bg-black/25 dark:bg-black/60 rounded-full blur-2xl -z-20 pointer-events-none"
            style={{
              transform: "rotateX(90deg) translateZ(-40px) scale(1.1)",
            }}
          />

          {/* Plaque 3D Slab Thickness Core Layer */}
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

            {/* Back Header */}
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

      {/* Floating 360° Controls Bar */}
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
