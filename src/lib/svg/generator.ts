export type BadgeStyle =
  | "acrylic"
  | "glass"
  | "classic"
  | "metal"
  | "paper"
  | "pixel";

export type BadgeShape =
  | "round"
  | "scallop"
  | "hexagon"
  | "medal"
  | "ticket"
  | "shield"
  | "orbital"
  | "star";

export type AcrylicPreset =
  | "crystal"
  | "frosted"
  | "aurora"
  | "midnight"
  | "pearl"
  | "base-blue"
  | "lime-glass"
  | "violet-glass";

export type AcrylicMaterial = "crystal" | "frosted" | "clear" | "iridescent";
export type AcrylicDepth = "thin" | "medium" | "deep";
export type AcrylicReflection = "none" | "soft" | "high";
export type AcrylicGlow = "off" | "soft" | "ambient";

export type ColorPreset =
  | "crystal"
  | "lime"
  | "ice-blue"
  | "aurora"
  | "violet"
  | "rose"
  | "amber"
  | "obsidian"
  | "custom";

export interface BadgeConfig {
  style: BadgeStyle;
  preset: AcrylicPreset;
  shape: BadgeShape;
  material: AcrylicMaterial;
  depth: AcrylicDepth;
  reflection: AcrylicReflection;
  glow: AcrylicGlow;
  colorPreset: ColorPreset;
  customColor?: string;
  title: string;
  subtitle?: string;
  dateOrYear?: string;
  location?: string;
  iconValue: string;
  hasInnerDashedRing?: boolean;
}

export const ACRYLIC_PRESETS: Record<
  AcrylicPreset,
  {
    name: string;
    description: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    textColor: string;
    isDark: boolean;
  }
> = {
  crystal: {
    name: "Crystal",
    description: "Pure transparent acrylic with clean diamond reflections",
    primaryColor: "#ffffff",
    secondaryColor: "#e2e8f0",
    accentColor: "#3b82f6",
    textColor: "#0f172a",
    isDark: false,
  },
  frosted: {
    name: "Frosted",
    description: "Matte diffuse translucent glass slab",
    primaryColor: "#f8fafc",
    secondaryColor: "#cbd5e1",
    accentColor: "#64748b",
    textColor: "#1e293b",
    isDark: false,
  },
  aurora: {
    name: "Aurora",
    description: "Ethereal prismatic rainbow dispersion across the face",
    primaryColor: "#f5f3ff",
    secondaryColor: "#c4b5fd",
    accentColor: "#ec4899",
    textColor: "#1e1b4b",
    isDark: false,
  },
  midnight: {
    name: "Midnight",
    description: "Deep obsidian smoked acrylic with silver highlights",
    primaryColor: "#0f172a",
    secondaryColor: "#1e293b",
    accentColor: "#38bdf8",
    textColor: "#f8fafc",
    isDark: true,
  },
  pearl: {
    name: "Pearl",
    description: "Warm lustrous alabaster with subtle golden sheen",
    primaryColor: "#fffdf5",
    secondaryColor: "#fef08a",
    accentColor: "#eab308",
    textColor: "#451a03",
    isDark: false,
  },
  "base-blue": {
    name: "Base Blue",
    description: "Signature Base ecosystem cobalt acrylic slab",
    primaryColor: "#eff6ff",
    secondaryColor: "#93c5fd",
    accentColor: "#0052ff",
    textColor: "#172554",
    isDark: false,
  },
  "lime-glass": {
    name: "Lime Glass",
    description: "High-vibe neon lime translucent commemorative plaque",
    primaryColor: "#f7fee7",
    secondaryColor: "#bef264",
    accentColor: "#65a30d",
    textColor: "#14532d",
    isDark: false,
  },
  "violet-glass": {
    name: "Violet Glass",
    description: "Vibrant amethyst acrylic with violet edge refraction",
    primaryColor: "#faf5ff",
    secondaryColor: "#d8b4fe",
    accentColor: "#9333ea",
    textColor: "#3b0764",
    isDark: false,
  },
};

export const COLOR_PRESETS: Record<
  ColorPreset,
  { name: string; hex: string; text: string }
> = {
  crystal: { name: "Crystal", hex: "#ffffff", text: "#0f172a" },
  lime: { name: "Lime", hex: "#84cc16", text: "#14532d" },
  "ice-blue": { name: "Ice Blue", hex: "#0052ff", text: "#172554" },
  aurora: { name: "Aurora", hex: "#ec4899", text: "#500724" },
  violet: { name: "Violet", hex: "#9333ea", text: "#3b0764" },
  rose: { name: "Rose", hex: "#f43f5e", text: "#4c0519" },
  amber: { name: "Amber", hex: "#f59e0b", text: "#451a03" },
  obsidian: { name: "Obsidian", hex: "#0f172a", text: "#ffffff" },
  custom: { name: "Custom", hex: "#84cc16", text: "#0f172a" },
};

// Curated Vector Icons Path Library (Clean self-contained SVG paths centered in 80x80 box)
export const VECTOR_ICONS: Record<string, { label: string; path: string }> = {
  trophy: {
    label: "Trophy",
    path: '<path d="M 24 16 L 56 16 L 56 36 C 56 46 48 54 40 54 C 32 54 24 46 24 36 Z M 24 24 L 14 24 C 10 24 8 28 8 32 C 8 38 12 42 18 42 L 24 42 M 56 24 L 66 24 C 70 24 72 28 72 32 C 72 38 68 42 62 42 L 56 42 M 40 54 L 40 64 M 28 64 L 52 64" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  star: {
    label: "Star",
    path: '<path d="M 40 10 L 48 28 L 68 30 L 52 44 L 57 64 L 40 53 L 23 64 L 28 44 L 12 30 L 32 28 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>',
  },
  sparkle: {
    label: "Sparkles",
    path: '<path d="M 40 12 C 40 28 40 28 56 40 C 40 52 40 52 40 68 C 40 52 40 52 24 40 C 40 28 40 28 40 12 Z M 60 16 C 60 22 60 22 66 26 C 60 30 60 30 60 36 C 60 30 60 30 54 26 C 60 22 60 22 60 16 Z" fill="currentColor"/>',
  },
  event: {
    label: "Event Globe",
    path: '<circle cx="40" cy="40" r="28" fill="none" stroke="currentColor" stroke-width="3.5"/><ellipse cx="40" cy="40" rx="14" ry="28" fill="none" stroke="currentColor" stroke-width="3"/><line x1="12" y1="40" x2="68" y2="40" stroke="currentColor" stroke-width="3"/><line x1="16" y1="26" x2="64" y2="26" stroke="currentColor" stroke-width="2.5"/><line x1="16" y1="54" x2="64" y2="54" stroke="currentColor" stroke-width="2.5"/>',
  },
  community: {
    label: "Community",
    path: '<circle cx="40" cy="26" r="10" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M 22 58 C 22 46 30 40 40 40 C 50 40 58 46 58 58" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><circle cx="18" cy="30" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M 8 54 C 8 46 14 42 20 42" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="62" cy="30" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M 72 54 C 72 46 66 42 60 42" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>',
  },
  hackathon: {
    label: "Rocket / Hackathon",
    path: '<path d="M 40 10 C 48 18 56 30 54 48 L 48 52 L 40 46 L 32 52 L 26 48 C 24 30 32 18 40 10 Z M 26 48 L 14 56 L 22 42 M 54 48 L 66 56 L 58 42 M 40 26 A 4 4 0 1 0 40 34 A 4 4 0 1 0 40 26 M 34 58 L 40 68 L 46 58" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  shield: {
    label: "Security Shield",
    path: '<path d="M 40 12 C 58 12 66 18 66 32 C 66 52 40 68 40 68 C 40 68 14 52 14 32 C 14 18 22 12 40 12 Z M 40 24 L 40 54 M 26 36 L 40 48 L 54 36" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>',
  },
  lock: {
    label: "Soulbound Lock",
    path: '<rect x="20" y="32" width="40" height="34" rx="8" fill="none" stroke="currentColor" stroke-width="3.5"/><path d="M 28 32 L 28 22 C 28 15 33 10 40 10 C 47 10 52 15 52 22 L 52 32" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><circle cx="40" cy="46" r="4" fill="currentColor"/><path d="M 40 50 L 40 56" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
  },
  pin: {
    label: "Location Pin",
    path: '<path d="M 40 12 C 28 12 18 22 18 34 C 18 48 40 68 40 68 C 40 68 62 48 62 34 C 62 22 52 12 40 12 Z" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="40" cy="32" r="7" fill="none" stroke="currentColor" stroke-width="3"/>',
  },
  calendar: {
    label: "Calendar",
    path: '<rect x="16" y="18" width="48" height="48" rx="8" fill="none" stroke="currentColor" stroke-width="3.5"/><line x1="16" y1="32" x2="64" y2="32" stroke="currentColor" stroke-width="3"/><line x1="28" y1="12" x2="28" y2="22" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="52" y1="12" x2="52" y2="22" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><circle cx="30" cy="44" r="2.5" fill="currentColor"/><circle cx="40" cy="44" r="2.5" fill="currentColor"/><circle cx="50" cy="44" r="2.5" fill="currentColor"/>',
  },
  crown: {
    label: "Crown / Achievement",
    path: '<path d="M 14 56 L 66 56 L 66 48 L 60 24 L 46 38 L 40 16 L 34 38 L 20 24 L 14 48 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="14" cy="56" r="2" fill="currentColor"/><circle cx="40" cy="14" r="3" fill="currentColor"/><circle cx="20" cy="22" r="2.5" fill="currentColor"/><circle cx="60" cy="22" r="2.5" fill="currentColor"/>',
  },
  lightning: {
    label: "Lightning Speed",
    path: '<path d="M 44 10 L 22 36 L 38 36 L 30 70 L 58 38 L 42 38 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>',
  },
};

export function generateBadgeSvg(config: BadgeConfig): string {
  const style = config.style || "acrylic";
  const preset = ACRYLIC_PRESETS[config.preset] || ACRYLIC_PRESETS["crystal"];
  const colorPreset = COLOR_PRESETS[config.colorPreset] || COLOR_PRESETS["crystal"];
  
  // Section 5: Color Tone Resolution
  const effectiveAccent =
    config.colorPreset === "custom" && config.customColor
      ? config.customColor
      : colorPreset.hex !== "#ffffff"
      ? colorPreset.hex
      : preset.accentColor;

  const isDark = style === "classic" ? true : style === "metal" ? false : preset.isDark;
  const textColor =
    style === "classic"
      ? "#fef08a"
      : style === "metal"
      ? "#0f172a"
      : style === "paper"
      ? "#292524"
      : isDark
      ? "#ffffff"
      : preset.textColor;

  const mutedTextColor =
    style === "classic"
      ? "rgba(254,240,138,0.75)"
      : style === "metal"
      ? "rgba(15,23,42,0.65)"
      : style === "paper"
      ? "rgba(41,37,36,0.65)"
      : isDark
      ? "rgba(255,255,255,0.65)"
      : "rgba(15,23,42,0.65)";

  // Section 7: Typography & Inscriptions
  const cleanTitle = (config.title || "ONCHAIN POAP").trim().replace(/[<>&"]/g, "");
  const cleanSubtitle = (config.subtitle || "I WAS THERE").trim().replace(/[<>&"]/g, "");
  const cleanDate = (config.dateOrYear || "2026").trim().replace(/[<>&"]/g, "");
  const cleanLocation = (config.location || "BASE SEPOLIA").trim().replace(/[<>&"]/g, "");
  const titleFontSize = cleanTitle.length > 26 ? 12 : cleanTitle.length > 18 ? 13.5 : 15;
  const locCombined = `${cleanLocation.toUpperCase()} • ${cleanDate}`;
  const locFontSize = locCombined.length > 34 ? 8 : locCombined.length > 26 ? 8.5 : 9.5;

  // Section 3: Material, Depth, Reflection, Glow Settings
  let depthOffset = config.depth === "deep" ? 14 : config.depth === "medium" ? 8 : 4;
  let bevelWidth = config.depth === "deep" ? 4 : config.depth === "medium" ? 2.5 : 1.5;

  if (style === "glass") {
    depthOffset = config.depth === "deep" ? 10 : config.depth === "medium" ? 6 : 3;
    bevelWidth = 2;
  } else if (style === "classic") {
    depthOffset = config.depth === "deep" ? 12 : config.depth === "medium" ? 8 : 4;
    bevelWidth = 5;
  } else if (style === "metal") {
    depthOffset = config.depth === "deep" ? 14 : config.depth === "medium" ? 10 : 5;
    bevelWidth = 3.5;
  } else if (style === "paper") {
    depthOffset = config.depth === "deep" ? 6 : config.depth === "medium" ? 3 : 1.5;
    bevelWidth = 1.5;
  } else if (style === "pixel") {
    depthOffset = config.depth === "deep" ? 12 : config.depth === "medium" ? 8 : 4;
    bevelWidth = 4;
  }

  // Material Opacities
  let opacityBase =
    config.material === "crystal"
      ? "0.85"
      : config.material === "frosted"
      ? "0.95"
      : config.material === "clear"
      ? "0.68"
      : "0.90";

  let reflectionOpacity =
    config.reflection === "high" ? "0.65" : config.reflection === "soft" ? "0.35" : "0.0";

  if (style === "glass") {
    opacityBase = config.material === "frosted" ? "0.65" : "0.45";
    reflectionOpacity = config.reflection === "none" ? "0.0" : "0.75";
  } else if (style === "classic") {
    opacityBase = "1.0";
    reflectionOpacity = config.reflection === "high" ? "0.4" : "0.2";
  } else if (style === "metal") {
    opacityBase = "1.0";
    reflectionOpacity = config.reflection === "none" ? "0.0" : "0.7";
  } else if (style === "paper") {
    opacityBase = "1.0";
    reflectionOpacity = "0.05";
  } else if (style === "pixel") {
    opacityBase = "0.95";
    reflectionOpacity = config.reflection === "high" ? "0.35" : "0.15";
  }

  // Glow Halo Settings
  const glow = config.glow || "soft";
  const glowOpacity = glow === "ambient" ? 0.6 : glow === "soft" ? 0.35 : 0;

  // Section 4: Plaque Geometry Paths (512x512 Canvas Centered at 256, 256)
  const cx = 256;
  const cy = 256;
  const r = 210;

  let mainShapePath = "";
  let depthShapePath = "";

  if (config.shape === "round") {
    mainShapePath = `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
    depthShapePath = `<circle cx="${cx + depthOffset}" cy="${cy + depthOffset}" r="${r}"/>`;
  } else if (config.shape === "scallop") {
    const points = 16;
    let dMain = "";
    let dDepth = "";
    for (let i = 0; i < points; i++) {
      const a1 = (i * 2 * Math.PI) / points;
      const a2 = ((i + 1) * 2 * Math.PI) / points;
      const aMid = (a1 + a2) / 2;
      const rOut = 215;
      const rIn = 195;

      const x1 = cx + rOut * Math.cos(a1);
      const y1 = cy + rOut * Math.sin(a1);
      const xMid = cx + rIn * Math.cos(aMid);
      const yMid = cy + rIn * Math.sin(aMid);
      const x2 = cx + rOut * Math.cos(a2);
      const y2 = cy + rOut * Math.sin(a2);

      if (i === 0) {
        dMain += `M ${x1} ${y1} `;
        dDepth += `M ${x1 + depthOffset} ${y1 + depthOffset} `;
      }
      dMain += `Q ${xMid} ${yMid} ${x2} ${y2} `;
      dDepth += `Q ${xMid + depthOffset} ${yMid + depthOffset} ${x2 + depthOffset} ${y2 + depthOffset} `;
    }
    mainShapePath = `<path d="${dMain}Z"/>`;
    depthShapePath = `<path d="${dDepth}Z"/>`;
  } else if (config.shape === "hexagon") {
    const ptsMain = [];
    const ptsDepth = [];
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 - Math.PI / 6;
      ptsMain.push(`${cx + 215 * Math.cos(a)},${cy + 215 * Math.sin(a)}`);
      ptsDepth.push(`${cx + depthOffset + 215 * Math.cos(a)},${cy + depthOffset + 215 * Math.sin(a)}`);
    }
    mainShapePath = `<polygon points="${ptsMain.join(" ")}"/>`;
    depthShapePath = `<polygon points="${ptsDepth.join(" ")}"/>`;
  } else if (config.shape === "medal") {
    mainShapePath = `<rect x="66" y="46" width="380" height="420" rx="48"/>`;
    depthShapePath = `<rect x="${66 + depthOffset}" y="${46 + depthOffset}" width="380" height="420" rx="48"/>`;
  } else if (config.shape === "ticket") {
    const dTicket = `M 60 70 Q 60 40 90 40 L 422 40 Q 452 40 452 70 L 452 206 A 50 50 0 0 0 452 306 L 452 442 Q 452 472 422 472 L 90 472 Q 60 472 60 442 L 60 306 A 50 50 0 0 0 60 206 Z`;
    mainShapePath = `<path d="${dTicket}"/>`;
    depthShapePath = `<path d="${dTicket}" transform="translate(${depthOffset}, ${depthOffset})"/>`;
  } else if (config.shape === "shield") {
    const dShield = `M 256 36 C 386 36 462 70 462 176 C 462 320 256 466 256 466 C 256 466 50 320 50 176 C 50 70 126 36 256 36 Z`;
    mainShapePath = `<path d="${dShield}"/>`;
    depthShapePath = `<path d="${dShield}" transform="translate(${depthOffset}, ${depthOffset})"/>`;
  } else if (config.shape === "orbital") {
    mainShapePath = `
      <circle cx="${cx}" cy="${cy}" r="195"/>
      <ellipse cx="${cx}" cy="${cy}" rx="235" ry="105" fill="none" stroke="${effectiveAccent}" stroke-width="2.5" stroke-dasharray="6,8" transform="rotate(-25 ${cx} ${cy})" opacity="0.6"/>
      <ellipse cx="${cx}" cy="${cy}" rx="215" ry="90" fill="none" stroke="${effectiveAccent}" stroke-width="1.5" transform="rotate(35 ${cx} ${cy})" opacity="0.4"/>
    `;
    depthShapePath = `<circle cx="${cx + depthOffset}" cy="${cy + depthOffset}" r="195"/>`;
  } else {
    let dStar = "";
    let dStarDepth = "";
    for (let i = 0; i < 16; i++) {
      const a = (i * Math.PI) / 8 - Math.PI / 2;
      const rPoint = i % 2 === 0 ? 218 : 175;
      const px = cx + rPoint * Math.cos(a);
      const py = cy + rPoint * Math.sin(a);
      if (i === 0) {
        dStar += `M ${px} ${py} `;
        dStarDepth += `M ${px + depthOffset} ${py + depthOffset} `;
      } else {
        dStar += `L ${px} ${py} `;
        dStarDepth += `L ${px + depthOffset} ${py + depthOffset} `;
      }
    }
    mainShapePath = `<path d="${dStar}Z"/>`;
    depthShapePath = `<path d="${dStarDepth}Z"/>`;
  }

  // Section 6: Center Vector Glyphs (Curated Vector Icons)
  const iconEntry = VECTOR_ICONS[config.iconValue] || VECTOR_ICONS["trophy"];
  const centerIconSvg = `
    <g transform="translate(${cx - 40}, ${cy - 40})" color="${style === "classic" ? "#fef08a" : effectiveAccent}">
      ${iconEntry.path}
    </g>
  `;

  // Section 1 & 2: Dynamic Gradients & Shaders
  let defsGradients = "";
  let backgroundSpecialLayer = "";

  if (style === "acrylic") {
    defsGradients = `
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${preset.primaryColor}" stop-opacity="${opacityBase}"/>
        <stop offset="50%" stop-color="${preset.secondaryColor}" stop-opacity="${Number(opacityBase) * 0.85}"/>
        <stop offset="100%" stop-color="${preset.primaryColor}" stop-opacity="${Number(opacityBase) * 0.95}"/>
      </linearGradient>
      <linearGradient id="bevelBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
        <stop offset="35%" stop-color="${effectiveAccent}" stop-opacity="0.6"/>
        <stop offset="70%" stop-color="#ffffff" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${isDark ? "#38bdf8" : "#94a3b8"}" stop-opacity="0.8"/>
      </linearGradient>
    `;
  } else if (style === "glass") {
    defsGradients = `
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5"/>
        <stop offset="50%" stop-color="${effectiveAccent}" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.35"/>
      </linearGradient>
      <linearGradient id="bevelBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="1.0"/>
        <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.7"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.9"/>
      </linearGradient>
    `;
  } else if (style === "classic") {
    defsGradients = `
      <radialGradient id="bodyGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#26231d"/>
        <stop offset="70%" stop-color="#141310"/>
        <stop offset="100%" stop-color="#080806"/>
      </radialGradient>
      <linearGradient id="bevelBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="50%" stop-color="#d4af37"/>
        <stop offset="100%" stop-color="#854d0e"/>
      </linearGradient>
    `;
    let rays = "";
    for (let i = 0; i < 24; i++) {
      const a = (i * 2 * Math.PI) / 24;
      const x1 = cx + 70 * Math.cos(a);
      const y1 = cy + 70 * Math.sin(a);
      const x2 = cx + 180 * Math.cos(a);
      const y2 = cy + 180 * Math.sin(a);
      rays += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#d4af37" stroke-width="0.8" opacity="0.25"/>`;
    }
    backgroundSpecialLayer = `<g>${rays}</g>`;
  } else if (style === "metal") {
    defsGradients = `
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc"/>
        <stop offset="25%" stop-color="#cbd5e1"/>
        <stop offset="50%" stop-color="#f1f5f9"/>
        <stop offset="75%" stop-color="#94a3b8"/>
        <stop offset="100%" stop-color="#e2e8f0"/>
      </linearGradient>
      <linearGradient id="bevelBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="50%" stop-color="#475569"/>
        <stop offset="100%" stop-color="#ffffff"/>
      </linearGradient>
    `;
    backgroundSpecialLayer = `
      <circle cx="${cx}" cy="${cy}" r="170" fill="none" stroke="#64748b" stroke-width="1" stroke-dasharray="2 3" opacity="0.4"/>
      <circle cx="${cx}" cy="${cy}" r="140" fill="none" stroke="#64748b" stroke-width="1" stroke-dasharray="3 4" opacity="0.3"/>
    `;
  } else if (style === "paper") {
    defsGradients = `
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fffdfa"/>
        <stop offset="50%" stop-color="#fdf6ee"/>
        <stop offset="100%" stop-color="#f5ede0"/>
      </linearGradient>
      <linearGradient id="bevelBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#d6c5ad"/>
        <stop offset="100%" stop-color="#b8a184"/>
      </linearGradient>
    `;
    backgroundSpecialLayer = `
      <circle cx="${cx}" cy="${cy}" r="185" fill="none" stroke="#b8a184" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.6"/>
    `;
  } else if (style === "pixel") {
    defsGradients = `
      <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
      <linearGradient id="bevelBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${effectiveAccent}"/>
        <stop offset="100%" stop-color="#38bdf8"/>
      </linearGradient>
      <pattern id="pixelGrid" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      </pattern>
    `;
    backgroundSpecialLayer = `
      <rect x="76" y="56" width="360" height="400" rx="36" fill="url(#pixelGrid)"/>
    `;
  }

  // Holographic Iridescent Dispersion Layer
  const iridescentLayer =
    config.material === "iridescent" || config.preset === "aurora" || style === "glass"
      ? `
      <!-- Holographic Prism Corner Gradient -->
      <g opacity="0.45" style="mix-blend-mode: color-dodge;">
        <circle cx="420" cy="420" r="140" fill="url(#prismGrad)" />
      </g>
    `
      : "";

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    ${defsGradients}

    <!-- Depth Thickness Shadow Gradient -->
    <linearGradient id="depthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${isDark ? "#000000" : "#94a3b8"}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${isDark ? "#000000" : "#64748b"}" stop-opacity="0.6"/>
    </linearGradient>

    <!-- Specular Light Reflection Gradient -->
    <linearGradient id="specularGrad" x1="0%" y1="0%" x2="70%" y2="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="${reflectionOpacity}"/>
      <stop offset="45%" stop-color="#ffffff" stop-opacity="${Number(reflectionOpacity) * 0.25}"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>

    <!-- Prismatic Rainbow Flare -->
    <radialGradient id="prismGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.8"/>
      <stop offset="35%" stop-color="#8b5cf6" stop-opacity="0.6"/>
      <stop offset="70%" stop-color="#ec4899" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#eab308" stop-opacity="0"/>
    </radialGradient>

    <!-- Ambient Base Floor Contact Shadow -->
    <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0.22"/>
      <stop offset="60%" stop-color="#000000" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <!-- Ambient Outer Halo Glow -->
    <radialGradient id="ambientGlowGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${effectiveAccent}" stop-opacity="${glowOpacity}"/>
      <stop offset="60%" stop-color="${effectiveAccent}" stop-opacity="${glowOpacity * 0.4}"/>
      <stop offset="100%" stop-color="${effectiveAccent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- 0. Ambient Outer Halo Glow (if enabled) -->
  ${glowOpacity > 0 ? `<circle cx="${cx}" cy="${cy}" r="248" fill="url(#ambientGlowGrad)"/>` : ""}

  <!-- 1. Ambient Contact Drop Shadow -->
  <ellipse cx="256" cy="478" rx="200" ry="24" fill="url(#floorShadow)" />

  <!-- 2. 3D Depth Slab Layer -->
  <g fill="url(#depthGrad)">
    ${depthShapePath}
  </g>

  <!-- 3. Main Plaque Body -->
  <g fill="url(#bodyGrad)" stroke="url(#bevelBorderGrad)" stroke-width="${bevelWidth}">
    ${mainShapePath}
  </g>

  <!-- 4. Special Texture Layer (Rays, Grooves, Grid, Parchment) -->
  ${backgroundSpecialLayer}

  <!-- 5. Holographic Iridescent Dispersion Flare (if selected) -->
  ${iridescentLayer}

  <!-- 6. Inner Stepped Concentric Frosted Lens -->
  <g transform="translate(0, 0)">
    <!-- Outer Frosted Ring -->
    <circle cx="${cx}" cy="${cy}" r="92" fill="${
      style === "classic"
        ? "rgba(212,175,55,0.1)"
        : style === "metal"
        ? "rgba(0,0,0,0.06)"
        : isDark
        ? "rgba(255,255,255,0.06)"
        : "rgba(255,255,255,0.6)"
    }" stroke="${style === "classic" ? "#d4af37" : effectiveAccent}" stroke-width="1.2" stroke-opacity="0.5"/>
    
    ${
      config.hasInnerDashedRing !== false
        ? `<circle cx="${cx}" cy="${cy}" r="82" fill="none" stroke="${
            style === "classic"
              ? "#fef08a"
              : isDark
              ? "rgba(255,255,255,0.3)"
              : "rgba(15,23,42,0.25)"
          }" stroke-width="1" stroke-dasharray="3 4"/>`
        : ""
    }

    <!-- Middle Raised Beveled Dial -->
    <circle cx="${cx}" cy="${cy}" r="64" fill="${
      style === "classic"
        ? "rgba(30,28,22,0.9)"
        : style === "metal"
        ? "rgba(241,245,249,0.9)"
        : isDark
        ? "rgba(255,255,255,0.1)"
        : "rgba(255,255,255,0.85)"
    }" stroke="${style === "classic" ? "#d4af37" : "#ffffff"}" stroke-width="1.5" stroke-opacity="0.7"/>

    <!-- Center Reticle Ticks -->
    <line x1="${cx - 64}" y1="${cy}" x2="${cx - 56}" y2="${cy}" stroke="${style === "classic" ? "#d4af37" : effectiveAccent}" stroke-width="1.5" opacity="0.6"/>
    <line x1="${cx + 56}" y1="${cy}" x2="${cx + 64}" y2="${cy}" stroke="${style === "classic" ? "#d4af37" : effectiveAccent}" stroke-width="1.5" opacity="0.6"/>
    <line x1="${cx}" y1="${cy - 64}" x2="${cx}" y2="${cy - 56}" stroke="${style === "classic" ? "#d4af37" : effectiveAccent}" stroke-width="1.5" opacity="0.6"/>
    <line x1="${cx}" y1="${cy + 56}" x2="${cx}" y2="${cy + 64}" stroke="${style === "classic" ? "#d4af37" : effectiveAccent}" stroke-width="1.5" opacity="0.6"/>

    <!-- Center Vector Glyphs / Mark -->
    ${centerIconSvg}
  </g>

  <!-- 7. Inscribed Vector Typography & Markings -->
  <!-- Top ✦ Sparkle Emblem -->
  <text x="${cx}" y="98" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="900" fill="${style === "classic" ? "#fef08a" : effectiveAccent}">✦</text>

  <!-- Event Title -->
  <text x="${cx}" y="124" text-anchor="middle" font-family="${style === "pixel" ? "'Courier New', monospace" : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"}" font-size="${titleFontSize}" font-weight="800" letter-spacing="${style === "pixel" ? "1" : "1.5"}" fill="${textColor}">
    ${cleanTitle.length > 34 ? cleanTitle.slice(0, 32) + "..." : cleanTitle}
  </text>

  <!-- Location & Coordinates Tag -->
  <text x="${cx}" y="142" text-anchor="middle" font-family="'SF Mono', Menlo, Monaco, Consolas, monospace" font-size="${locFontSize}" font-weight="600" letter-spacing="0.8" fill="${mutedTextColor}">
    ${locCombined.length > 40 ? locCombined.slice(0, 38) + "..." : locCombined}
  </text>

  <!-- Bottom Main Inscription: I WAS THERE / Subtitle -->
  <text x="${cx}" y="386" text-anchor="middle" font-family="${style === "pixel" ? "'Courier New', monospace" : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"}" font-size="16" font-weight="900" letter-spacing="${style === "pixel" ? "1.5" : "2"}" fill="${textColor}">
    ${cleanSubtitle.toUpperCase()}
  </text>

  <!-- Sub-label: Minted onchain • Base -->
  <text x="${cx}" y="406" text-anchor="middle" font-family="'SF Mono', Menlo, Monaco, Consolas, monospace" font-size="9" font-weight="600" letter-spacing="1.2" fill="${mutedTextColor}">
    MINTED ONCHAIN • BASE SEPOLIA
  </text>

  <!-- Verification Seal -->
  <text x="${cx}" y="420" text-anchor="middle" font-family="'SF Mono', Menlo, Monaco, Consolas, monospace" font-size="8" font-weight="500" letter-spacing="1" fill="${mutedTextColor}">
    FOREVER VERIFIABLE • ZERO IPFS
  </text>

  <!-- 8. Specular Diagonal Glass Sheen Reflection -->
  <path d="M 90 70 L 380 70 L 150 430 L 90 430 Z" fill="url(#specularGrad)" pointer-events="none"/>
</svg>
`.trim();
}
