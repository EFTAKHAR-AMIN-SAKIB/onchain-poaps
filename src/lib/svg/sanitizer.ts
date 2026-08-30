import DOMPurify from "dompurify";

export interface SvgValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedSvg?: string;
}

/**
 * Validates and sanitizes raw SVG code to prevent XSS and malformed payloads.
 */
export function sanitizeSvg(rawSvg: string): SvgValidationResult {
  if (!rawSvg || typeof rawSvg !== "string") {
    return { isValid: false, error: "SVG content cannot be empty." };
  }

  const trimmed = rawSvg.trim();

  // Basic check for SVG tag
  if (!trimmed.toLowerCase().includes("<svg") || !trimmed.toLowerCase().includes("</svg>")) {
    return { isValid: false, error: "Content must contain valid <svg> and </svg> tags." };
  }

  // Check for dangerous keywords
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /on\w+\s*=/gi, // onerror, onload, onclick, etc.
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return {
        isValid: false,
        error: "SVG contains unsafe active content (scripts, event handlers, or data URLs).",
      };
    }
  }

  try {
    let sanitized = trimmed;
    if (typeof window !== "undefined") {
      sanitized = DOMPurify.sanitize(trimmed, {
        USE_PROFILES: { svg: true, svgFilters: true },
        ADD_TAGS: ["use", "textPath", "animate", "animateTransform"],
        ADD_ATTR: ["viewBox", "xmlns", "xmlns:xlink", "href", "xlink:href", "startOffset", "text-anchor"],
      });
    }

    if (!sanitized || !sanitized.includes("<svg")) {
      return { isValid: false, error: "Sanitization resulted in invalid SVG content." };
    }

    // Ensure xmlns is present for standalone rendering
    if (!sanitized.includes('xmlns="http://www.w3.org/2000/svg"')) {
      sanitized = sanitized.replace(/<svg\b([^>]*)>/i, '<svg xmlns="http://www.w3.org/2000/svg" $1>');
    }

    return {
      isValid: true,
      sanitizedSvg: sanitized,
    };
  } catch (err: unknown) {
    return {
      isValid: false,
      error: err instanceof Error ? err.message : "Failed to sanitize SVG content.",
    };
  }
}
