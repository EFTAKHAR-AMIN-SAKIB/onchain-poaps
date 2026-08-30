"use client";

import React, { useRef, useState } from "react";
import { clsx } from "clsx";

export interface PoapBadge3DProps {
  svgContent?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
}

export function PoapBadge3D({
  svgContent,
  className,
  size = "md",
  interactive = true,
}: PoapBadge3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -14;
    const rotY = ((x - centerX) / centerX) * 14;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setRotateX(0);
    setRotateY(0);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  const sizeClasses = {
    sm: "w-28 h-28",
    md: "w-48 h-48",
    lg: "w-72 h-72",
    xl: "w-96 h-96 max-w-full",
  };

  return (
    <div
      style={{ perspective: 1000 }}
      className={clsx("relative inline-block select-none", className)}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: interactive && rotateX === 0 && rotateY === 0 ? "transform 0.5s ease-out" : "transform 0.1s ease-out",
        }}
        className={clsx(
          "relative rounded-full overflow-hidden shadow-2xl flex items-center justify-center p-2 bg-[#0c0d12] border border-white/10 group",
          sizeClasses[size]
        )}
      >
        {/* Dynamic Specular Glare Overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.4) 0%, rgba(212,175,55,0.2) 25%, transparent 60%)`,
            opacity: glarePosition.opacity,
          }}
        />

        {/* SVG Container */}
        {svgContent ? (
          <div
            className="w-full h-full rounded-full overflow-hidden flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="w-full h-full rounded-full bg-[#161820] flex items-center justify-center text-slate-500 font-mono text-xs text-center p-4">
            Loading Artwork...
          </div>
        )}
      </div>
    </div>
  );
}
