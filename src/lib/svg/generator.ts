export type BadgeShape =
  | "circle"
  | "scallop"
  | "hexagon"
  | "octagon"
  | "orbital"
  | "shield"
  | "ticket"
  | "signal"
  | "gear"
  | "star";

export type BadgeTheme =
  | "museum-gold"
  | "electric-base"
  | "obsidian-silver"
  | "emerald-heritage"
  | "crimson-seal"
  | "amethyst-velvet"
  | "amber-ember"
  | "cyber-teal"
  | "custom";

export interface ColorScheme {
  id: BadgeTheme;
  name: string;
  bgDark: string;
  bgGrad: string;
  primary: string;
  secondary: string;
  text: string;
  glow: string;
}

export const BADGE_THEMES: Record<string, ColorScheme> = {
  "museum-gold": {
    id: "museum-gold" as BadgeTheme,
    name: "Archival Gold",
    bgDark: "#11100c",
    bgGrad: "#262013",
    primary: "#d4af37",
    secondary: "#f3e5ab",
    text: "#fff8db",
    glow: "rgba(212,175,55,0.3)",
  },
  "electric-base": {
    id: "electric-base" as BadgeTheme,
    name: "Base Cobalt",
    bgDark: "#060b18",
    bgGrad: "#0c1b38",
    primary: "#0052ff",
    secondary: "#6698ff",
    text: "#ffffff",
    glow: "rgba(0,82,255,0.4)",
  },
  "obsidian-silver": {
    id: "obsidian-silver" as BadgeTheme,
    name: "Obsidian Slate",
    bgDark: "#0a0a0c",
    bgGrad: "#1f2228",
    primary: "#e2e8f0",
    secondary: "#94a3b8",
    text: "#ffffff",
    glow: "rgba(226,232,240,0.25)",
  },
  "emerald-heritage": {
    id: "emerald-heritage" as BadgeTheme,
    name: "Emerald Heritage",
    bgDark: "#06150e",
    bgGrad: "#0e2e1f",
    primary: "#10b981",
    secondary: "#6ee7b7",
    text: "#ecfdf5",
    glow: "rgba(16,185,129,0.35)",
  },
  "crimson-seal": {
    id: "crimson-seal" as BadgeTheme,
    name: "Wax Crimson",
    bgDark: "#18070a",
    bgGrad: "#330f16",
    primary: "#e11d48",
    secondary: "#fda4af",
    text: "#fff1f2",
    glow: "rgba(225,29,72,0.35)",
  },
  "amethyst-velvet": {
    id: "amethyst-velvet" as BadgeTheme,
    name: "Amethyst Velvet",
    bgDark: "#12081c",
    bgGrad: "#27123d",
    primary: "#8b5cf6",
    secondary: "#c4b5fd",
    text: "#f5f3ff",
    glow: "rgba(139,92,246,0.35)",
  },
  "amber-ember": {
    id: "amber-ember" as BadgeTheme,
    name: "Amber Ember",
    bgDark: "#180e04",
    bgGrad: "#341f0a",
    primary: "#f59e0b",
    secondary: "#fde68a",
    text: "#fffbeb",
    glow: "rgba(245,158,11,0.35)",
  },
  "cyber-teal": {
    id: "cyber-teal" as BadgeTheme,
    name: "Cyber Neon",
    bgDark: "#051619",
    bgGrad: "#0b2e35",
    primary: "#06b6d4",
    secondary: "#67e8f9",
    text: "#ecfeff",
    glow: "rgba(6,182,212,0.35)",
  },
};

export interface BadgeConfig {
  shape: BadgeShape;
  theme: BadgeTheme;
  customColor?: string;
  title: string;
  subtitle?: string;
  dateOrYear?: string;
  iconType: "emoji" | "initials" | "vector";
  iconValue: string;
  pattern?: "dots" | "rays" | "rings" | "stars" | "grid" | "clean";
  hasInnerDashedRing?: boolean;
}

export function generateBadgeSvg(config: BadgeConfig): string {
  let theme = BADGE_THEMES[config.theme] || BADGE_THEMES["museum-gold"];
  if (config.theme === "custom" && config.customColor) {
    const col = config.customColor;
    theme = {
      id: "custom",
      name: "Custom Color",
      bgDark: "#090a0f",
      bgGrad: "#171a24",
      primary: col,
      secondary: col,
      text: "#ffffff",
      glow: "rgba(255,255,255,0.2)",
    };
  }

  const {
    shape = "scallop",
    title = "EVENT ATTENDANCE",
    subtitle = "PROOF OF ATTENDANCE",
    dateOrYear = "2026",
    iconType = "emoji",
    iconValue = "🏆",
    pattern = "rays",
    hasInnerDashedRing = true,
  } = config;

  // Sanitize texts for SVG inclusion
  const cleanTitle = (title || "ONCHAIN POAP").toUpperCase().replace(/[<>&"]/g, "");
  const cleanSubtitle = (subtitle || "BASE SEPOLIA").toUpperCase().replace(/[<>&"]/g, "");
  const cleanDate = (dateOrYear || "2026").toUpperCase().replace(/[<>&"]/g, "");

  // Generate Base Shape Path
  let shapePath = "";
  if (shape === "circle") {
    shapePath = '<circle cx="200" cy="200" r="185" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="6"/>';
  } else if (shape === "scallop") {
    // 16-point scalloped stamp
    let d = "";
    const cx = 200;
    const cy = 200;
    const points = 16;
    for (let i = 0; i < points; i++) {
      const angle = (i * 2 * Math.PI) / points;
      const nextAngle = ((i + 1) * 2 * Math.PI) / points;
      const midAngle = (angle + nextAngle) / 2;
      const rOuter = 190;
      const rInner = 175;

      const x1 = cx + rOuter * Math.cos(angle);
      const y1 = cy + rOuter * Math.sin(angle);
      const xMid = cx + rInner * Math.cos(midAngle);
      const yMid = cy + rInner * Math.sin(midAngle);

      if (i === 0) d += `M ${x1} ${y1} `;
      d += `Q ${xMid} ${yMid} ${cx + rOuter * Math.cos(nextAngle)} ${cy + rOuter * Math.sin(nextAngle)} `;
    }
    shapePath = `<path d="${d}Z" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="6"/>`;
  } else if (shape === "hexagon") {
    // 6-sided sharp polygon
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 - Math.PI / 6;
      pts.push(`${200 + 190 * Math.cos(a)},${200 + 190 * Math.sin(a)}`);
    }
    shapePath = `<polygon points="${pts.join(" ")}" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="6"/>`;
  } else if (shape === "octagon") {
    // 8-sided faceted medallion
    const pts = [];
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 - Math.PI / 8;
      pts.push(`${200 + 190 * Math.cos(a)},${200 + 190 * Math.sin(a)}`);
    }
    shapePath = `<polygon points="${pts.join(" ")}" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="6"/>`;
  } else if (shape === "orbital") {
    shapePath = `
      <circle cx="200" cy="200" r="175" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="6"/>
      <ellipse cx="200" cy="200" rx="195" ry="90" fill="none" stroke="${theme.primary}" stroke-width="3" transform="rotate(-25 200 200)" opacity="0.6"/>
      <ellipse cx="200" cy="200" rx="195" ry="90" fill="none" stroke="${theme.primary}" stroke-width="2" stroke-dasharray="4,6" transform="rotate(35 200 200)" opacity="0.4"/>
    `;
  } else if (shape === "shield") {
    shapePath = `
      <path d="M 200 15 C 310 15 385 45 385 140 C 385 270 200 385 200 385 C 200 385 15 270 15 140 C 15 45 90 15 200 15 Z" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="6"/>
    `;
  } else if (shape === "ticket") {
    // Ticket notch badge
    shapePath = `
      <path d="M 30 50 Q 30 20 60 20 L 340 20 Q 370 20 370 50 L 370 160 A 40 40 0 0 0 370 240 L 370 350 Q 370 380 340 380 L 60 380 Q 30 380 30 350 L 30 240 A 40 40 0 0 0 30 160 Z" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="5"/>
    `;
  } else if (shape === "signal") {
    // Cyber notch square (like competitor 2)
    shapePath = `
      <rect x="20" y="20" width="360" height="360" rx="24" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="6"/>
      <rect x="35" y="35" width="330" height="330" rx="16" fill="none" stroke="${theme.primary}" stroke-width="2" opacity="0.4"/>
    `;
  } else if (shape === "gear") {
    // 12-tooth cogwheel gear badge
    let gd = "";
    for (let i = 0; i < 12; i++) {
      const a1 = (i * 2 * Math.PI) / 12;
      const a2 = ((i + 0.5) * 2 * Math.PI) / 12;
      const a3 = ((i + 1) * 2 * Math.PI) / 12;
      const rOut = 192;
      const rIn = 172;
      const p1x = 200 + rOut * Math.cos(a1);
      const p1y = 200 + rOut * Math.sin(a1);
      const p2x = 200 + rIn * Math.cos(a2);
      const p2y = 200 + rIn * Math.sin(a2);
      if (i === 0) gd += `M ${p1x} ${p1y} `;
      gd += `L ${p2x} ${p2y} L ${200 + rOut * Math.cos(a3)} ${200 + rOut * Math.sin(a3)} `;
    }
    shapePath = `<path d="${gd}Z" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="5"/>`;
  } else {
    // Star badge (8 points)
    let sd = "";
    for (let i = 0; i < 16; i++) {
      const a = (i * Math.PI) / 8 - Math.PI / 2;
      const r = i % 2 === 0 ? 190 : 155;
      const px = 200 + r * Math.cos(a);
      const py = 200 + r * Math.sin(a);
      if (i === 0) sd += `M ${px} ${py} `;
      else sd += `L ${px} ${py} `;
    }
    shapePath = `<path d="${sd}Z" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="5"/>`;
  }

  // Pattern Overlay
  let patternContent = "";
  if (pattern === "rays") {
    patternContent = `
      <g stroke="${theme.primary}" stroke-width="1.2" opacity="0.15">
        ${Array.from({ length: 16 })
          .map((_, i) => `<line x1="200" y1="200" x2="${200 + 175 * Math.cos((i * Math.PI) / 8)}" y2="${200 + 175 * Math.sin((i * Math.PI) / 8)}"/>`)
          .join("")}
      </g>
    `;
  } else if (pattern === "dots") {
    patternContent = `
      <g fill="${theme.primary}" opacity="0.25">
        ${Array.from({ length: 24 })
          .map((_, i) => `<circle cx="${200 + 145 * Math.cos((i * Math.PI) / 12)}" cy="${200 + 145 * Math.sin((i * Math.PI) / 12)}" r="2.5"/>`)
          .join("")}
      </g>
    `;
  } else if (pattern === "rings") {
    patternContent = `
      <circle cx="200" cy="200" r="145" fill="none" stroke="${theme.primary}" stroke-width="1.5" opacity="0.25"/>
      <circle cx="200" cy="200" r="115" fill="none" stroke="${theme.primary}" stroke-width="1" stroke-dasharray="3,4" opacity="0.3"/>
    `;
  } else if (pattern === "stars") {
    patternContent = `
      <g fill="${theme.primary}" opacity="0.35">
        <polygon points="200,60 203,70 213,73 203,76 200,86 197,76 187,73 197,70" />
        <polygon points="340,200 330,203 327,213 324,203 314,200 324,197 327,187 330,197" />
        <polygon points="60,200 70,203 73,213 76,203 86,200 76,197 73,187 70,197" />
      </g>
    `;
  } else if (pattern === "grid") {
    patternContent = `
      <g stroke="${theme.primary}" stroke-width="1" opacity="0.12">
        <line x1="80" y1="120" x2="320" y2="120"/>
        <line x1="80" y1="280" x2="320" y2="280"/>
        <line x1="120" y1="80" x2="120" y2="320"/>
        <line x1="280" y1="80" x2="280" y2="320"/>
      </g>
    `;
  }

  // Inner dashed ring
  const dashedRing = hasInnerDashedRing
    ? `<circle cx="200" cy="200" r="158" fill="none" stroke="${theme.primary}" stroke-width="1.8" stroke-dasharray="5,5" opacity="0.55"/>`
    : "";

  // Center Emblem Content
  let centerContent = "";
  if (iconType === "emoji") {
    centerContent = `<text x="200" y="218" text-anchor="middle" font-size="64" font-family="-apple-system, sans-serif">${iconValue || "🏆"}</text>`;
  } else if (iconType === "initials") {
    centerContent = `
      <circle cx="200" cy="200" r="54" fill="${theme.bgDark}" stroke="${theme.primary}" stroke-width="3"/>
      <text x="200" y="213" text-anchor="middle" font-family="Newsreader, Georgia, serif" font-weight="900" font-size="34" fill="${theme.text}" letter-spacing="2">${iconValue || "ETH"}</text>
    `;
  } else {
    // Vector marks (Sparkle, Check, Pin, Lightning, Diamond, Base)
    if (iconValue === "sparkle") {
      centerContent = `
        <polygon points="200,140 212,188 260,200 212,212 200,260 188,212 140,200 188,188" fill="${theme.primary}"/>
        <circle cx="200" cy="200" r="8" fill="#ffffff"/>
      `;
    } else if (iconValue === "lightning") {
      centerContent = `
        <polygon points="210,140 165,210 200,210 190,260 235,190 200,190" fill="${theme.primary}"/>
      `;
    } else if (iconValue === "pin") {
      centerContent = `
        <path d="M 200 150 C 180 150 165 165 165 185 C 165 210 200 250 200 250 C 200 250 235 210 235 185 C 235 165 220 150 200 150 Z" fill="${theme.primary}"/>
        <circle cx="200" cy="185" r="10" fill="${theme.bgDark}"/>
      `;
    } else if (iconValue === "check") {
      centerContent = `
        <circle cx="200" cy="200" r="48" fill="${theme.bgDark}" stroke="${theme.primary}" stroke-width="4"/>
        <polyline points="180,200 195,215 225,185" fill="none" stroke="${theme.primary}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    } else {
      // Default star
      centerContent = `
        <polygon points="200,150 215,185 250,185 222,205 233,240 200,220 167,240 178,205 150,185 185,185" fill="${theme.primary}"/>
      `;
    }
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="38%" r="62%">
      <stop offset="0%" stop-color="${theme.bgGrad}"/>
      <stop offset="100%" stop-color="${theme.bgDark}"/>
    </radialGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.secondary}"/>
      <stop offset="50%" stop-color="${theme.primary}"/>
      <stop offset="100%" stop-color="${theme.secondary}"/>
    </linearGradient>
    <path id="topArc" d="M 65 200 A 135 135 0 1 1 335 200" fill="none"/>
    <path id="bottomArc" d="M 335 200 A 135 135 0 0 1 65 200" fill="none"/>
  </defs>

  <!-- Shape Base -->
  ${shapePath}

  <!-- Pattern Decor -->
  ${patternContent}

  <!-- Dashed Ring -->
  ${dashedRing}

  <!-- Center Emblem -->
  ${centerContent}

  <!-- Curved Typography -->
  <text font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-weight="900" font-size="13" fill="${theme.text}" letter-spacing="3.5">
    <textPath href="#topArc" startOffset="50%" text-anchor="middle">
      ${cleanTitle}
    </textPath>
  </text>

  <text font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-weight="800" font-size="11" fill="${theme.secondary}" letter-spacing="3">
    <textPath href="#bottomArc" startOffset="50%" text-anchor="middle">
      ${cleanDate} • ${cleanSubtitle}
    </textPath>
  </text>
</svg>
  `.trim();
}
