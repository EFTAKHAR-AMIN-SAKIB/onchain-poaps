export interface OptimizationResult {
  originalSvg: string;
  optimizedSvg: string;
  originalBytes: number;
  optimizedBytes: number;
  bytesSaved: number;
  percentageSaved: number;
  estimatedGas: number;
  estimatedGasSaved: number;
}

/**
 * Optimizes and minifies SVG code in a browser-safe, deterministic manner.
 */
export function optimizeSvg(rawSvg: string): OptimizationResult {
  const originalBytes = new TextEncoder().encode(rawSvg).length;

  let cleaned = rawSvg;

  // 1. Remove XML declaration and doctypes
  cleaned = cleaned.replace(/<\?xml[\s\S]*?\?>/gi, "");
  cleaned = cleaned.replace(/<!DOCTYPE[\s\S]*?>/gi, "");

  // 2. Remove comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, "");

  // 3. Remove editor metadata (Inkscape, Illustrator, Figma, Sketch)
  cleaned = cleaned.replace(/<(sodipodi|inkscape|illustrator):[\s\S]*?\/>/gi, "");
  cleaned = cleaned.replace(/<\/(sodipodi|inkscape|illustrator):[\s\S]*?>/gi, "");
  cleaned = cleaned.replace(/\s*(xmlns:inkscape|xmlns:sodipodi|xmlns:sketch|xmlns:a)="[^"]*"/gi, "");
  cleaned = cleaned.replace(/\s*(inkscape:[a-z-]+|sodipodi:[a-z-]+)="[^"]*"/gi, "");

  // 4. Remove empty data attributes & unnecessary namespaces
  cleaned = cleaned.replace(/\s*data-[a-z0-9-]+="[^"]*"/gi, "");
  cleaned = cleaned.replace(/\s*id="[^"]*"/gi, (match) => {
    // Keep IDs if referenced by url(#id) or textPath
    return match;
  });

  // 5. Consolidate consecutive whitespace
  cleaned = cleaned.replace(/\s+/g, " ");

  // 6. Remove space around tags
  cleaned = cleaned.replace(/>\s+</g, "><");

  // 7. Remove trailing whitespace before tag closure
  cleaned = cleaned.replace(/\s+\/>/g, "/>");
  cleaned = cleaned.replace(/\s+>/g, ">");

  // 8. Round excessively long decimals in coordinates (e.g. 12.3456789 -> 12.35)
  cleaned = cleaned.replace(/(\d+\.\d{3,})/g, (num) => {
    const parsed = parseFloat(num);
    return isNaN(parsed) ? num : String(Math.round(parsed * 100) / 100);
  });

  const optimizedSvg = cleaned.trim();
  const optimizedBytes = new TextEncoder().encode(optimizedSvg).length;
  const bytesSaved = Math.max(0, originalBytes - optimizedBytes);
  const percentageSaved = originalBytes > 0 ? (bytesSaved / originalBytes) * 100 : 0;

  // Base SSTORE2 write deployment cost calculation:
  // ~200 gas per byte + Base contract creation overhead
  const SSTORE2_GAS_PER_BYTE = 200;
  const BASE_TX_GAS = 45000;
  const estimatedGas = BASE_TX_GAS + optimizedBytes * SSTORE2_GAS_PER_BYTE;
  const estimatedGasSaved = bytesSaved * SSTORE2_GAS_PER_BYTE;

  return {
    originalSvg: rawSvg,
    optimizedSvg,
    originalBytes,
    optimizedBytes,
    bytesSaved,
    percentageSaved: Math.round(percentageSaved * 10) / 10,
    estimatedGas,
    estimatedGasSaved,
  };
}
