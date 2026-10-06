/**
 * The logo as data URIs for generated images (apple-icon, Open Graph card).
 * Server-only (uses Buffer). Art comes from components/brand/brandSvg.ts.
 */
import { badgeSvg, iconSvg, wordmarkSvg } from "@/components/brand/brandSvg";

const toDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

/** Compact badge (hex + G, no flags) — app icons. */
export const markDataUri = toDataUri(iconSvg());
/** Full badge with the crossed flags — social cards. */
export const badgeDataUri = toDataUri(badgeSvg());
/** Still GREENFIELD / AUTO SALES wordmark — social cards. */
export const wordmarkDataUri = toDataUri(wordmarkSvg());
