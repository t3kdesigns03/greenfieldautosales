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
/* ---------------------------------------------------------------------------
 * Badge interior: a red-and-black checkered flag rippling behind the G.
 * Built once at module load (pure geometry, no randomness → same on server
 * and client).
 * ------------------------------------------------------------------------- */
const CHECK = 25; // check size, badge units
const RIPPLE = (2 * Math.PI) / 150; // one ripple every 150 units (the .gas-cloth loop distance)
/** Cloth ripple applied to every check corner. */
function cloth(x: number, y: number): [number, number] {
  return [x + 3.2 * Math.sin(y * 0.05 + 0.6), y + 6.5 * Math.sin(x * RIPPLE + y * 0.012)];
}
const CHECKS_DARK = (() => {
  const out: string[] = [];
  const n = 4; // points per edge, so the checks bend with the cloth
  for (let i = -1; i < 9; i++) {
    for (let j = -1; j < 10; j++) {
      if ((i + j) % 2 === 0) continue;
      const x0 = i * CHECK - 12;
      const y0 = j * CHECK - 6;
      const pts: [number, number][] = [];
      for (let k = 0; k < n; k++) pts.push(cloth(x0 + (CHECK * k) / n, y0));
      for (let k = 0; k < n; k++) pts.push(cloth(x0 + CHECK, y0 + (CHECK * k) / n));
      for (let k = 0; k < n; k++) pts.push(cloth(x0 + CHECK - (CHECK * k) / n, y0 + CHECK));
      for (let k = 0; k < n; k++) pts.push(cloth(x0, y0 + CHECK - (CHECK * k) / n));
      out.push("M" + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L") + "Z");
    }
  }
  return out.join("");
})();
/** Light/shadow bands that follow the ripple (two periods so the animation loops). */
const CLOTH_SHADE = (() => {
  const stops: string[] = [];
  const N = 48;
  for (let k = 0; k <= N; k++) {
    const x = (600 * k) / N - 250; // gradient spans x = -250..350 (four ripples)
    const c = Math.cos(x * RIPPLE + 0.9);
    stops.push(
      c > 0
        ? `<stop offset="${f(k / N)}" stop-color="#fff" stop-opacity="${f(c * 0.2)}"/>`
        : `<stop offset="${f(k / N)}" stop-color="#000" stop-opacity="${f(-c * 0.5)}"/>`,
    );
  }
  return stops.join("");
})();
const hexPts = (r: number, cx = 100, cy = 110) =>
  [-90, -30, 30, 90, 150, 210].map((a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)] as const);
const hexPath = (r: number) => "M" + hexPts(r).map(([x, y]) => `${f(x)} ${f(y)}`).join("L") + "Z";
const HEX_NEON = hexPath(88.5);
const BOLTS = hexPts(98);

/** Inner markup (no <svg> wrapper) of the speed badge. */
export function badgeInner(uid: string, { flags = true, glint = false }: BadgeOptions = {}) {
  const g = flags ? B.g : B.gIcon;
  const gb = flags ? B.gBox : B.gIconBox;
  const live = glint; // animated copy (header): cloth light, running border light
  return `<defs>
  <clipPath id="${uid}-clip"><path d="${B.hexInner}"/></clipPath>
  <clipPath id="${uid}-gclip"><path d="${g}"/></clipPath>
  <linearGradient id="${uid}-red" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ff3a45"/><stop offset=".55" stop-color="#d10f1b"/><stop offset="1" stop-color="#7a0810"/>
  </linearGradient>
  <linearGradient id="${uid}-shade" gradientUnits="userSpaceOnUse" x1="-250" y1="0" x2="350" y2="0">${CLOTH_SHADE}</linearGradient>
  <radialGradient id="${uid}-vig" cx="100" cy="112" r="96" gradientUnits="userSpaceOnUse">
    <stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/>
  </radialGradient>
  <radialGradient id="${uid}-pool" cx="${f((gb[0] + gb[2]) / 2)}" cy="${f((gb[1] + gb[3]) / 2)}" r="${f((gb[2] - gb[0]) * 0.62)}" gradientUnits="userSpaceOnUse">
    <stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="${uid}-bezel" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".22" stop-color="#9ba1aa"/><stop offset=".45" stop-color="#f3f5f8"/><stop offset=".62" stop-color="#4a4f57"/><stop offset=".82" stop-color="#d8dce2"/><stop offset="1" stop-color="#6d737c"/>
  </linearGradient>
  <linearGradient id="${uid}-chrome" gradientUnits="userSpaceOnUse" x1="0" y1="${gb[1]}" x2="0" y2="${gb[3]}">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".28" stop-color="#d9dde3"/><stop offset=".47" stop-color="#7d838d"/><stop offset=".5" stop-color="#3b3f46"/><stop offset=".56" stop-color="#9aa1ab"/><stop offset=".8" stop-color="#eef1f5"/><stop offset="1" stop-color="#8b9099"/>
  </linearGradient>
  <linearGradient id="${uid}-sweep" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <filter id="${uid}-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
  <filter id="${uid}-soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2"/></filter>
  ${flags ? foldGradient(`${uid}-f0`, B.flags[0]) + foldGradient(`${uid}-f1`, B.flags[1]) : ""}
</defs>
${flags ? flagsMarkup(uid) : ""}
<path class="gas-neon" d="${B.hexEdge}" fill="none" stroke="#ff1f2c" stroke-width="16" stroke-linejoin="round" filter="url(#${uid}-blur)" opacity=".75"/>
<path d="${B.hexOuter}" fill="#050506"/>
<g clip-path="url(#${uid}-clip)">
  <rect x="-10" y="-10" width="220" height="240" fill="url(#${uid}-red)"/>
  <path d="${CHECKS_DARK}" fill="#0b0b0d"/>
  <rect class="${live ? "gas-cloth" : ""}" x="-250" y="-10" width="600" height="240" fill="url(#${uid}-shade)"/>
  <rect x="-10" y="-10" width="220" height="240" fill="url(#${uid}-vig)"/>
  <rect x="-10" y="-10" width="220" height="240" fill="url(#${uid}-pool)"/>
</g>
<g class="gas-g">
<path d="${g}" fill="#000" opacity=".85" filter="url(#${uid}-soft)" transform="translate(1 3)"/>
<path d="${g}" fill="url(#${uid}-chrome)" stroke="#050506" stroke-width="${flags ? 4 : 4.5}" stroke-linejoin="round" paint-order="stroke"/>
${glint ? `<g clip-path="url(#${uid}-gclip)"><rect class="gas-glint gas-glint--g" x="${gb[0] - 70}" y="${gb[1] - 10}" width="46" height="${gb[3] - gb[1] + 20}" fill="url(#${uid}-sweep)"/></g>` : ""}
</g>
<path d="${B.hexEdge}" fill="none" stroke="#000" stroke-width="13" stroke-linejoin="round"/>
<path d="${B.hexEdge}" fill="none" stroke="url(#${uid}-bezel)" stroke-width="10" stroke-linejoin="round"/>
<path d="${B.hexEdge}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1" stroke-linejoin="round" transform="translate(0 -1.2)"/>
<path d="${HEX_NEON}" fill="none" stroke="#ff2a36" stroke-width="5" stroke-linejoin="round" filter="url(#${uid}-soft)"/>
<path d="${HEX_NEON}" fill="none" stroke="#ff6870" stroke-width="2" stroke-linejoin="round"/>
${BOLTS.map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="3.1" fill="#1a1b1f"/><circle cx="${f(x - 0.5)}" cy="${f(y - 0.5)}" r="1.9" fill="#e9ecf0"/>`).join("")}
${live ? `<path class="gas-comet" d="${B.hexEdge}" pathLength="100" fill="none" stroke="#ff8a90" stroke-opacity=".45" stroke-width="7" stroke-linecap="round" stroke-dasharray="9 91"/><path class="gas-comet" d="${B.hexEdge}" pathLength="100" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-dasharray="9 91"/>` : ""}`;
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
    <stop offset="0" stop-color="#ffffff"/><stop offset=".48" stop-color="#eef1f5"/><stop offset=".52" stop-color="#b9bfc8"/><stop offset="1" stop-color="#f7f8fa"/>
  </linearGradient>
  <filter id="${uid}-halo" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="7"/></filter>
  <filter id="${uid}-neon" x="-10%" y="-40%" width="120%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
  <linearGradient id="${uid}-rule" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#e3101d" stop-opacity="0"/><stop offset=".15" stop-color="#e3101d"/><stop offset=".85" stop-color="#e3101d"/><stop offset="1" stop-color="#e3101d" stop-opacity="0"/>
  </linearGradient>
  <clipPath id="${uid}-letters"><path d="${W.greenfield}"/></clipPath>
  <linearGradient id="${uid}-sweep" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
</defs>
<g filter="url(#${uid}-halo)" opacity=".85"><path d="${W.greenfield}" fill="#000" stroke="#000" stroke-width="16" stroke-linejoin="round"/><path d="${W.autoSales}" fill="#000" stroke="#000" stroke-width="16" stroke-linejoin="round"/></g>
<path class="gas-neon gas-neon--wm" d="${W.greenfield}" fill="none" stroke="#ff1f2c" stroke-width="7" stroke-linejoin="round" filter="url(#${uid}-neon)" opacity=".7"/>
<path d="${W.greenfield}" fill="none" stroke="#000" stroke-width="9" stroke-linejoin="round"/>
<path d="${W.greenfield}" fill="url(#${uid}-red)"/>
${animated ? `<g clip-path="url(#${uid}-letters)"><rect class="gas-glint gas-glint--wm" x="-160" y="0" width="90" height="110" fill="url(#${uid}-sweep)"/></g>` : ""}
<g mask="url(#${uid}-edge)"><rect class="${animated ? "gas-prism" : ""}" x="0" y="0" width="1200" height="150" fill="url(#${uid}-prism)"/></g>
<rect x="${rule.x1}" y="${rule.y - 1}" width="${rule.x2 - rule.x1}" height="5" fill="url(#${uid}-rule)" filter="url(#${uid}-neon)" opacity=".8"/>
<rect x="${rule.x1}" y="${rule.y}" width="${rule.x2 - rule.x1}" height="2.5" fill="url(#${uid}-rule)"/>
<path d="${W.autoSales}" fill="none" stroke="#000" stroke-width="8" stroke-linejoin="round"/>
<path d="${W.autoSales}" fill="url(#${uid}-silver)"/>`;
}

const svgOpen = (viewBox: string, w: number, h: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${w}" height="${h}">`;

/** Standalone, still SVG documents for generated images (icons, social cards). */
export const iconSvg = () => `${svgOpen(badgeViewBox(false), 200, 220)}${badgeInner("i", { flags: false })}</svg>`;
export const badgeSvg = () => `${svgOpen(badgeViewBox(true), 272, 244)}${badgeInner("b", { flags: true })}</svg>`;
export const wordmarkSvg = () => `${svgOpen(wordmarkViewBox, 600, 150)}${wordmarkInner("w", { animated: false })}</svg>`;
