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
} from "@/lib/svg/generator";
import { EventDetailsForm } from "@/components/create/StepDetails";

export interface SampleEventTemplate {
  id: string;
  category: "hackathon" | "conference" | "dao" | "community" | "gaming";
  categoryLabel: string;
  name: string;
  subtitle: string;
  description: string;
  eventDate: string; // YYYY-MM-DD
  dateOrYear: string;
  location: string;
  locationPlaque: string;
  externalUrl: string;
  badge: {
    style: BadgeStyle;
    preset: AcrylicPreset;
    shape: BadgeShape;
    material: AcrylicMaterial;
    depth: AcrylicDepth;
    reflection: AcrylicReflection;
    glow: AcrylicGlow;
    colorPreset: ColorPreset;
    customColor?: string;
    iconValue: string;
    hasInnerDashedRing: boolean;
  };
}

export const SAMPLE_CATEGORIES = [
  { id: "all", label: "All Ideas", icon: "✨" },
  { id: "hackathon", label: "Hackathons", icon: "🚀" },
  { id: "conference", label: "Conferences", icon: "🌐" },
  { id: "dao", label: "DAOs & Governance", icon: "🏛️" },
  { id: "community", label: "Communities & Meetups", icon: "💎" },
  { id: "gaming", label: "Gaming & Art", icon: "🎮" },
] as const;

export const SAMPLE_EVENTS: SampleEventTemplate[] = [
  {
    id: "ethglobal-cannes",
    category: "hackathon",
    categoryLabel: "Hackathon",
    name: "ETHGlobal Cannes 2026",
    subtitle: "BUIDL TILL DAWN",
    description:
      "Commemorating 36 hours of intense hacking, zero-knowledge smart contract creation, and decentralized protocol innovation on the French Riviera.",
    eventDate: "2026-07-18",
    dateOrYear: "2026",
    location: "Cannes, France",
    locationPlaque: "CANNES, FRANCE",
    externalUrl: "https://ethglobal.com/events/cannes",
    badge: {
      style: "acrylic",
      preset: "crystal",
      shape: "medal",
      material: "crystal",
      depth: "deep",
      reflection: "high",
      glow: "soft",
      colorPreset: "ice-blue",
      iconValue: "hackathon",
      hasInnerDashedRing: true,
    },
  },
  {
    id: "base-superhack",
    category: "hackathon",
    categoryLabel: "Hackathon",
    name: "Base Camp Superhack",
    subtitle: "ONCHAIN BUILDER",
    description:
      "Awarded to verified hackers and developers building next-generation consumer crypto apps, social frames, and autonomous AI agents on Base.",
    eventDate: "2026-06-20",
    dateOrYear: "2026",
    location: "San Francisco, CA",
    locationPlaque: "SAN FRANCISCO, CA",
    externalUrl: "https://base.org/camp",
    badge: {
      style: "acrylic",
      preset: "base-blue",
      shape: "hexagon",
      material: "clear",
      depth: "deep",
      reflection: "soft",
      glow: "ambient",
      colorPreset: "lime",
      iconValue: "lightning",
      hasInnerDashedRing: true,
    },
  },
  {
    id: "zk-summit-berlin",
    category: "hackathon",
    categoryLabel: "Hackathon",
    name: "ZK Cryptography Hackathon",
    subtitle: "ZERO KNOWLEDGE",
    description:
      "Honoring builders who designed and deployed novel cryptographic proof systems, recursive SNARKs, and private onchain identity primitives.",
    eventDate: "2026-05-12",
    dateOrYear: "2026",
    location: "Berlin, Germany",
    locationPlaque: "BERLIN, GERMANY",
    externalUrl: "https://zkhack.dev",
    badge: {
      style: "acrylic",
      preset: "midnight",
      shape: "shield",
      material: "frosted",
      depth: "deep",
      reflection: "soft",
      glow: "soft",
      colorPreset: "obsidian",
      iconValue: "shield",
      hasInnerDashedRing: true,
    },
  },
  {
    id: "devcon-southeast-asia",
    category: "conference",
    categoryLabel: "Conference",
    name: "Devcon Southeast Asia",
    subtitle: "INFINITE GARDEN",
    description:
      "In celebration of uniting the global Ethereum community for core protocol research, cryptoeconomics, and open-source alignment.",
    eventDate: "2026-11-14",
    dateOrYear: "2026",
    location: "Bangkok, Thailand",
    locationPlaque: "BANGKOK, THAILAND",
    externalUrl: "https://devcon.org",
    badge: {
      style: "acrylic",
      preset: "aurora",
      shape: "round",
      material: "iridescent",
      depth: "medium",
      reflection: "high",
      glow: "ambient",
      colorPreset: "aurora",
      iconValue: "event",
      hasInnerDashedRing: true,
    },
  },
  {
    id: "modular-summit-denver",
    category: "conference",
    categoryLabel: "Conference",
    name: "Modular Summit 2026",
    subtitle: "SCALE THE WORLD",
    description:
      "Proof of attendance for the premier technical gathering on data availability sampling, shared sequencers, and appchain architectures.",
    eventDate: "2026-08-04",
    dateOrYear: "2026",
    location: "Denver, Colorado",
    locationPlaque: "DENVER, CO, USA",
    externalUrl: "https://modularsummit.dev",
    badge: {
      style: "acrylic",
      preset: "lime-glass",
      shape: "scallop",
      material: "crystal",
      depth: "deep",
      reflection: "soft",
      glow: "soft",
      colorPreset: "lime",
      iconValue: "star",
      hasInnerDashedRing: true,
    },
  },
  {
    id: "crypto-ai-tokyo",
    category: "conference",
    categoryLabel: "Conference",
    name: "Onchain AI & Robotics Forum",
    subtitle: "AUTONOMOUS AGENTS",
    description:
      "Issued to attendees exploring the frontier of verifiable onchain AI agents, decentralized compute clusters, and machine-to-machine micropayments.",
    eventDate: "2026-10-09",
    dateOrYear: "2026",
    location: "Tokyo, Japan",
    locationPlaque: "TOKYO, JAPAN",
    externalUrl: "https://cryptoai-summit.io",
    badge: {
      style: "acrylic",
      preset: "violet-glass",
      shape: "orbital",
      material: "iridescent",
      depth: "deep",
      reflection: "high",
      glow: "ambient",
      colorPreset: "violet",
      iconValue: "lightning",
      hasInnerDashedRing: true,
    },
  },
  {
    id: "optimism-superchain-assembly",
    category: "dao",
    categoryLabel: "DAO & Governance",
    name: "Superchain Governance Assembly",
    subtitle: "CITIZENS UNITED",
    description:
      "Recognizing active governance delegates, badgeholders, and contributors steering public goods funding and collective onchain decision-making.",
    eventDate: "2026-09-28",
    dateOrYear: "2026",
    location: "Seoul, South Korea",
    locationPlaque: "SEOUL, S. KOREA",
    externalUrl: "https://optimism.io/assembly",
    badge: {
      style: "acrylic",
      preset: "crystal",
      shape: "medal",
      material: "crystal",
      depth: "medium",
      reflection: "soft",
      glow: "soft",
      colorPreset: "rose",
      iconValue: "community",
      hasInnerDashedRing: true,
    },
  },
  {
    id: "gitcoin-retro-funding",
    category: "dao",
    categoryLabel: "DAO & Governance",
    name: "Gitcoin Public Goods Gala",
    subtitle: "PUBLIC GOODS HERO",
    description:
      "Celebration of quadratic funding donors and open-source project leads building resilient, censorship-resistant public software.",
    eventDate: "2026-05-30",
    dateOrYear: "2026",
    location: "Austin, Texas",
    locationPlaque: "AUSTIN, TX, USA",
    externalUrl: "https://gitcoin.co",
    badge: {
      style: "acrylic",
      preset: "pearl",
      shape: "scallop",
      material: "clear",
      depth: "deep",
      reflection: "soft",
      glow: "soft",
      colorPreset: "amber",
      iconValue: "trophy",
      hasInnerDashedRing: true,
    },
  },
  {
    id: "founders-day-london",
    category: "community",
    categoryLabel: "Community",
    name: "Onchain Founders Genesis",
    subtitle: "DAY ONE BUILDER",
    description:
      "An intimate gathering of early-stage protocol founders, venture angels, and smart contract architects building on Ethereum Layer 2s.",
    eventDate: "2026-06-15",
    dateOrYear: "2026",
    location: "London, UK",
    locationPlaque: "LONDON, UK",
    externalUrl: "https://onchainpoaps.xyz",
    badge: {
      style: "acrylic",
      preset: "pearl",
      shape: "star",
      material: "crystal",
      depth: "deep",
      reflection: "high",
      glow: "ambient",
      colorPreset: "amber",
      iconValue: "crown",
      hasInnerDashedRing: true,
    },
  },
  {
    id: "farcaster-miniapp-jam",
    category: "community",
    categoryLabel: "Community",
    name: "Farcaster Mini App Jam",
    subtitle: "CAST & BUIDL",
    description:
      "Gathering of developers and social graph designers creating viral interactive Frames and Mini Apps across the Farcaster ecosystem.",
    eventDate: "2026-07-25",
    dateOrYear: "2026",
    location: "Warpcast / Global Online",
    locationPlaque: "WARPCAST / ONLINE",
    externalUrl: "https://warpcast.com",
    badge: {
      style: "acrylic",
      preset: "violet-glass",
      shape: "round",
      material: "iridescent",
      depth: "deep",
      reflection: "soft",
      glow: "ambient",
      colorPreset: "violet",
      iconValue: "sparkle",
      hasInnerDashedRing: true,
    },
  },
  {
    id: "whitehat-war-room",
    category: "community",
    categoryLabel: "Community",
    name: "Security CTF & Audit War Room",
    subtitle: "WHITEHAT ALLIANCE",
    description:
      "Commemorating security researchers, fuzzing experts, and formal verification specialists participating in live smart contract exploit prevention.",
    eventDate: "2026-08-22",
    dateOrYear: "2026",
    location: "Zurich, Switzerland",
    locationPlaque: "ZURICH, SWITZERLAND",
    externalUrl: "https://cantina.xyz",
    badge: {
      style: "acrylic",
      preset: "midnight",
      shape: "shield",
      material: "crystal",
      depth: "deep",
      reflection: "high",
      glow: "soft",
      colorPreset: "obsidian",
      iconValue: "shield",
      hasInnerDashedRing: true,
    },
  },
  {
    id: "generative-art-paris",
    category: "gaming",
    categoryLabel: "Gaming & Art",
    name: "Cypherpunk Generative Art Night",
    subtitle: "NIGHT OF ARTISTS",
    description:
      "Commemorating an evening of live algorithmic audiovisual synthesis, generative vector projections, and onchain collector drops in Paris.",
    eventDate: "2026-10-24",
    dateOrYear: "2026",
    location: "Paris, France",
    locationPlaque: "PARIS, FRANCE",
    externalUrl: "https://artblocks.io",
    badge: {
      style: "acrylic",
      preset: "violet-glass",
      shape: "orbital",
      material: "iridescent",
      depth: "deep",
      reflection: "high",
      glow: "ambient",
      colorPreset: "rose",
      iconValue: "sparkle",
      hasInnerDashedRing: true,
    },
  },
  {
    id: "autonomous-worlds-kyoto",
    category: "gaming",
    categoryLabel: "Gaming & Art",
    name: "Autonomous Worlds Arena Cup",
    subtitle: "GUILD CHAMPION",
    description:
      "Awarded to strategic guild commanders and tacticians competing in fully onchain physics engines and persistent universe tournaments.",
    eventDate: "2026-11-02",
    dateOrYear: "2026",
    location: "Kyoto, Japan",
    locationPlaque: "KYOTO, JAPAN",
    externalUrl: "https://mud.dev",
    badge: {
      style: "acrylic",
      preset: "crystal",
      shape: "medal",
      material: "crystal",
      depth: "deep",
      reflection: "soft",
      glow: "soft",
      colorPreset: "lime",
      iconValue: "trophy",
      hasInnerDashedRing: true,
    },
  },
  {
    id: "base-testnet-genesis",
    category: "community",
    categoryLabel: "Community",
    name: "Base Sepolia Genesis Tester",
    subtitle: "TESTNET VANGUARD",
    description:
      "Official commemorative soulbound proof for early testnet innovators stress-testing smart contract factories and SSTORE2 vector compression.",
    eventDate: "2026-04-10",
    dateOrYear: "2026",
    location: "Base Sepolia / Onchain",
    locationPlaque: "BASE SEPOLIA",
    externalUrl: "https://sepolia.basescan.org",
    badge: {
      style: "acrylic",
      preset: "base-blue",
      shape: "ticket",
      material: "clear",
      depth: "medium",
      reflection: "soft",
      glow: "soft",
      colorPreset: "ice-blue",
      iconValue: "lock",
      hasInnerDashedRing: true,
    },
  },
];

/**
 * Returns a random event template from the sample catalogue, optionally filtered by category.
 */
export function getRandomEventTemplate(
  category?: string,
  excludeId?: string
): SampleEventTemplate {
  let pool = SAMPLE_EVENTS;
  if (category && category !== "all") {
    const filtered = SAMPLE_EVENTS.filter((e) => e.category === category);
    if (filtered.length > 0) pool = filtered;
  }

  if (excludeId && pool.length > 1) {
    pool = pool.filter((e) => e.id !== excludeId);
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex] || SAMPLE_EVENTS[0];
}

/**
 * Converts a SampleEventTemplate into BadgeConfig and EventDetailsForm
 */
export function convertTemplateToState(template: SampleEventTemplate): {
  badgeConfig: BadgeConfig;
  details: EventDetailsForm;
} {
  return {
    badgeConfig: {
      style: template.badge.style,
      preset: template.badge.preset,
      shape: template.badge.shape,
      material: template.badge.material,
      depth: template.badge.depth,
      reflection: template.badge.reflection,
      glow: template.badge.glow,
      colorPreset: template.badge.colorPreset,
      customColor: template.badge.customColor,
      title: template.name,
      subtitle: template.subtitle,
      dateOrYear: template.dateOrYear,
      location: template.locationPlaque,
      iconValue: template.badge.iconValue,
      hasInnerDashedRing: template.badge.hasInnerDashedRing,
    },
    details: {
      name: template.name,
      description: template.description,
      eventDate: template.eventDate,
      location: template.location,
      externalUrl: template.externalUrl,
    },
  };
}
