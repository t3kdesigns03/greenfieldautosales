/**
 * The logo as data URIs for generated images (apple-icon, Open Graph card).
 * Server-only (uses Buffer). Art comes from components/brand/brandSvg.ts.
 */
import { LOCKUP, iconSvg, lockupSvg } from "@/components/brand/brandSvg";

const toDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

/** Compact badge (hex + G, no flags) — app icons. */
export const markDataUri = toDataUri(iconSvg());
/** The standard header lockup (flags + badge + wordmark), still — social cards. */
export const lockupDataUri = toDataUri(lockupSvg());
export const lockupSize = LOCKUP;
