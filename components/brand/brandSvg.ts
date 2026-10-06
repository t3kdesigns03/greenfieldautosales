/**
 * Greenfield Auto Sales brand art as SVG markup strings.
 *
 * One source of truth for every place the logo appears:
 *   - <Badge>/<Wordmark> components inline these (server-rendered, no image request)
 *   - app/icon.svg, apple-icon and the Open Graph image use the static versions
 *
 * Every id is prefixed with `uid` so several logos can share a page (the
 * header renders separate mobile/desktop copies, one of them display:none —
 * shared gradient ids would break the visible one in Chrome/Firefox).
 *
 * Motion (CSS only, so the reduced-motion rule in globals.css stops it):
 *   .gas-prism  — prismatic light travelling around the GREENFIELD letter edges
 *   .gas-glint  — Spyder-style light sweep across the chrome G and the letters
 */
import { badge as B, wordmark as W } from "./brandPaths";

const f = (n: number) => +n.toFixed(2);

/* Palette — keep in sync with the tokens in app/globals.css */
export const brandHex = {
  night: "#0A0A0C",
  red: "#E3101D",
  redDeep: "#7A0810",
  chrome: "#C7CCD4",
  white: "#F2F3F5",
};

function foldGradient(id: string, flag: (typeof B.flags)[number]) {
  const stops = flag.folds
    .map(([u, sh]) => {
      const light = sh > 0;
      return `<stop offset="${u}" stop-color="${light ? "#fff" : "#000"}" stop-opacity="${f(Math.abs(sh) * (light ? 0.22 : 0.42))}"/>`;
    })
    .join("");
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${flag.foldX[0]}" y1="0" x2="${flag.foldX[1]}" y2="0">${stops}</linearGradient>`;
}

function flagsMarkup(uid: string) {
  return B.flags
    .map((fl, i) => {
      const [bx, by, tx, ty] = fl.pole;
      return `<g class="gas-flag">
  <line x1="${bx}" y1="${by}" x2="${tx}" y2="${ty}" stroke="#000" stroke-width="6" stroke-linecap="round" opacity=".7"/>
  <line x1="${bx}" y1="${by}" x2="${tx}" y2="${ty}" stroke="#c9ced6" stroke-width="3.2" stroke-linecap="round"/>
  <circle cx="${tx}" cy="${ty}" r="4" fill="#eef1f5" stroke="#000" stroke-width="1.5"/>
  <path d="${fl.outline}" fill="none" stroke="#000" stroke-width="4" stroke-linejoin="round" opacity=".8"/>
  <path d="${fl.light}" fill="#eceff3"/>
  <path d="${fl.dark}" fill="#1b1c21"/>
  <path d="${fl.outline}" fill="url(#${uid}-f${i})"/>
  <path d="${fl.outline}" fill="none" stroke="#9aa0a9" stroke-width=".8" stroke-linejoin="round"/>
</g>`;
    })
    .join("");
}

export type BadgeOptions = {
  /** Crossed flags flying behind the hex. Off for tiny sizes (favicon). */
  flags?: boolean;
  /** Light sweep across the chrome G. */
  glint?: boolean;
};

/** viewBox for the badge — wider when the flags fly out behind it. */
export const badgeViewBox = (flags = true) => (flags ? "-36 -26 272 244" : "0 0 200 220");

/** Inner markup (no <svg> wrapper) of the speed badge. */
export function badgeInner(uid: string, { flags = true, glint = false }: BadgeOptions = {}) {
  const [vx, vy] = B.vp;
  const g = flags ? B.g : B.gIcon;
  const gb = flags ? B.gBox : B.gIconBox;
  const horizon = f((vy - 18) / 184);
  return `<defs>
  <clipPath id="${uid}-clip"><path d="${B.hexInner}"/></clipPath>
  <clipPath id="${uid}-gclip"><path d="${g}"/></clipPath>
  <linearGradient id="${uid}-sky" gradientUnits="userSpaceOnUse" x1="0" y1="18" x2="0" y2="202">
    <stop offset="0" stop-color="#1a0709"/><stop offset="${horizon}" stop-color="#3a0d12"/><stop offset="${f(horizon + 0.004)}" stop-color="#121215"/><stop offset="1" stop-color="#060607"/>
  </linearGradient>
  <radialGradient id="${uid}-glow" cx="${vx}" cy="${vy}" r="70" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#ff3b3b" stop-opacity=".55"/><stop offset=".45" stop-color="#c3121c" stop-opacity=".18"/><stop offset="1" stop-color="#c3121c" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="${uid}-asph" gradientUnits="userSpaceOnUse" x1="0" y1="${vy}" x2="0" y2="214">
    <stop offset="0" stop-color="#3a3d44"/><stop offset=".5" stop-color="#202227"/><stop offset="1" stop-color="#121316"/>
  </linearGradient>
  <linearGradient id="${uid}-haze" gradientUnits="userSpaceOnUse" x1="0" y1="${vy}" x2="0" y2="214">
    <stop offset="0" stop-color="#0b0b0d" stop-opacity=".85"/><stop offset=".22" stop-color="#0b0b0d" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="${uid}-frame" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ff5a5f"/><stop offset=".35" stop-color="#e3101d"/><stop offset=".62" stop-color="#8e0a12"/><stop offset=".8" stop-color="#ff3a44"/><stop offset="1" stop-color="#7a0810"/>
  </linearGradient>
  <linearGradient id="${uid}-chrome" gradientUnits="userSpaceOnUse" x1="0" y1="${gb[1]}" x2="0" y2="${gb[3]}">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".28" stop-color="#d9dde3"/><stop offset=".47" stop-color="#7d838d"/><stop offset=".5" stop-color="#3b3f46"/><stop offset=".56" stop-color="#9aa1ab"/><stop offset=".8" stop-color="#eef1f5"/><stop offset="1" stop-color="#8b9099"/>
  </linearGradient>
  <linearGradient id="${uid}-sweep" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  ${flags ? foldGradient(`${uid}-f0`, B.flags[0]) + foldGradient(`${uid}-f1`, B.flags[1]) : ""}
</defs>
${flags ? flagsMarkup(uid) : ""}
<path d="${B.hexOuter}" fill="#050506"/>
<g clip-path="url(#${uid}-clip)">
  <rect width="200" height="220" fill="url(#${uid}-sky)"/>
  <rect width="200" height="220" fill="url(#${uid}-glow)"/>
  <path d="${B.asphalt}" fill="url(#${uid}-asph)"/>
  <path d="${B.curbsRed}" fill="#e3101d"/>
  <path d="${B.curbsWhite}" fill="#f1f3f6"/>
  <path d="${B.dashes}" fill="#f1f3f6" opacity=".9"/>
  <rect y="${vy}" width="200" height="140" fill="url(#${uid}-haze)"/>
</g>
<path d="${g}" fill="#000" opacity=".55" transform="translate(1.5 4)"/>
<path d="${g}" fill="url(#${uid}-chrome)" stroke="#0a0a0c" stroke-width="${flags ? 2.4 : 3}" stroke-linejoin="round" paint-order="stroke"/>
${glint ? `<g clip-path="url(#${uid}-gclip)"><rect class="gas-glint gas-glint--g" x="${gb[0] - 70}" y="${gb[1] - 10}" width="46" height="${gb[3] - gb[1] + 20}" fill="url(#${uid}-sweep)"/></g>` : ""}
<path d="${B.hexEdge}" fill="none" stroke="url(#${uid}-frame)" stroke-width="10" stroke-linejoin="round"/>
<path d="${B.hexInner}" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="1.5"/>
<path d="${B.hexOuter}" fill="none" stroke="#ff8a8f" stroke-opacity=".35" stroke-width="1"/>`;
}

/** Prismatic palette for the GREENFIELD edge — chrome white drifting through cool and warm tints. */
const PRISM = ["#ffffff", "#9feaff", "#b9a4ff", "#ff9ccf", "#ffd88a"];

export type WordmarkOptions = {
  /** Travelling prismatic edge + light sweep. Off = a still frame of the same look. */
  animated?: boolean;
};

export const wordmarkViewBox = "0 0 600 150";

/** Inner markup of the GREENFIELD / AUTO SALES wordmark. */
export function wordmarkInner(uid: string, { animated = true }: WordmarkOptions = {}) {
  const [, by0, , by1] = W.greenfieldBox;
  const [, ay0, , ay1] = W.autoSalesBox;
  const { rule } = W;
  // Two identical periods, 600 units each: sliding the fill by one period loops seamlessly.
  const stops: string[] = [];
  for (let p = 0; p < 2; p++) {
    PRISM.forEach((c, k) => stops.push(`<stop offset="${f((p + k / PRISM.length) / 2)}" stop-color="${c}"/>`));
  }
  stops.push(`<stop offset="1" stop-color="${PRISM[0]}"/>`);

  return `<defs>
  <linearGradient id="${uid}-red" gradientUnits="userSpaceOnUse" x1="0" y1="${by0}" x2="0" y2="${by1}">
    <stop offset="0" stop-color="#ff7a7f"/><stop offset=".3" stop-color="#f0202b"/><stop offset=".52" stop-color="#a50b15"/><stop offset=".56" stop-color="#d4121d"/><stop offset=".85" stop-color="#ff3a44"/><stop offset="1" stop-color="#b10c16"/>
  </linearGradient>
  <linearGradient id="${uid}-prism" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1200" y2="140">${stops.join("")}</linearGradient>
  <mask id="${uid}-edge" maskUnits="userSpaceOnUse" x="-20" y="-20" width="640" height="190">
    <path d="${W.greenfield}" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/>
  </mask>
  <linearGradient id="${uid}-silver" gradientUnits="userSpaceOnUse" x1="0" y1="${ay0}" x2="0" y2="${ay1}">
    <stop offset="0" stop-color="#f4f6f9"/><stop offset=".5" stop-color="#9aa1ab"/><stop offset=".55" stop-color="#6c727c"/><stop offset="1" stop-color="#d6dae0"/>
  </linearGradient>
  <linearGradient id="${uid}-rule" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#e3101d" stop-opacity="0"/><stop offset=".15" stop-color="#e3101d"/><stop offset=".85" stop-color="#e3101d"/><stop offset="1" stop-color="#e3101d" stop-opacity="0"/>
  </linearGradient>
  <clipPath id="${uid}-letters"><path d="${W.greenfield}"/></clipPath>
  <linearGradient id="${uid}-sweep" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
</defs>
<path d="${W.greenfield}" fill="none" stroke="#000" stroke-width="9" stroke-linejoin="round"/>
<path d="${W.greenfield}" fill="url(#${uid}-red)"/>
${animated ? `<g clip-path="url(#${uid}-letters)"><rect class="gas-glint gas-glint--wm" x="-160" y="0" width="90" height="110" fill="url(#${uid}-sweep)"/></g>` : ""}
<g mask="url(#${uid}-edge)"><rect class="${animated ? "gas-prism" : ""}" x="0" y="0" width="1200" height="150" fill="url(#${uid}-prism)"/></g>
<rect x="${rule.x1}" y="${rule.y}" width="${rule.x2 - rule.x1}" height="3" fill="url(#${uid}-rule)"/>
<path d="${W.autoSales}" fill="url(#${uid}-silver)"/>`;
}

const svgOpen = (viewBox: string, w: number, h: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${w}" height="${h}">`;

/** Standalone, still SVG documents for generated images (icons, social cards). */
export const iconSvg = () => `${svgOpen(badgeViewBox(false), 200, 220)}${badgeInner("i", { flags: false })}</svg>`;
export const badgeSvg = () => `${svgOpen(badgeViewBox(true), 272, 244)}${badgeInner("b", { flags: true })}</svg>`;
export const wordmarkSvg = () => `${svgOpen(wordmarkViewBox, 600, 150)}${wordmarkInner("w", { animated: false })}</svg>`;
