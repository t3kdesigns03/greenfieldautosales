/**
 * Geometry of the two crossed, waving checkered flags that sit behind the
 * Greenfield logo. Shared by the live canvas (WavingFlags.tsx) and the still
 * SVG used for generated images (brandSvg.ts → lockupSvg), so every copy of
 * the logo has the same flags. Pure math, no DOM.
 */

export type Side = -1 | 1; // -1 = flag flies to the left, 1 = to the right

export const COLS = 5; // checks along the fly
export const ROWS = 4; // checks down the hoist
export const SUB_U = 8; // subdivisions per check, along the fly (smooth curves)
export const SUB_V = 3;

export const LIGHT = "#eceef2";
export const DARK = "#2a2c31";

export type Geo = {
  top: [number, number]; // pole tip
  foot: [number, number]; // pole foot
  hoist: number; // 0..1 of the pole length the cloth is attached along
  fly: [number, number]; // vector from the hoist to the free end (px)
  amp: number; // wave amplitude at the free end (px)
  period: number; // seconds per wave
  waves: number; // waves visible across the cloth
  phase: number;
};

/**
 * Proportions follow the original greenfieldautosales.net logo: two poles
 * crossed low and centred, finials up top, and each cloth falling away
 * outward and down from the top of its pole.
 */
export function geometry(w: number, h: number, side: Side): Geo {
  const cx = w * 0.62; // centred under the wordmark, like the original
  return {
    top: [cx + side * w * 0.085, h * 0.07],
    foot: [cx - side * w * 0.035, h * 1.02],
    hoist: 0.52,
    fly: [side * w * 0.28, h * 0.34],
    amp: h * 0.08,
    period: side < 0 ? 2.1 : 2.35,
    waves: 1.15,
    phase: side < 0 ? 0 : 1.7,
  };
}

const phaseAt = (g: Geo, t: number, u: number, v: number) =>
  2 * Math.PI * (g.waves * u - t / g.period) + 0.75 * v + g.phase;

/** Point on the cloth: u = 0 at the pole → 1 at the free end, v = 0 top → 1 bottom. */
export function point(g: Geo, t: number, u: number, v: number): [number, number] {
  const hx = g.top[0] + (g.foot[0] - g.top[0]) * g.hoist * v;
  const hy = g.top[1] + (g.foot[1] - g.top[1]) * g.hoist * v;
  const len = Math.hypot(g.fly[0], g.fly[1]);
  const dx = g.fly[0] / len;
  const dy = g.fly[1] / len;
  // normal to the fly direction, pointing up
  let nx = dy;
  let ny = -dx;
  if (ny > 0) (nx = -nx), (ny = -ny);
  const ph = phaseAt(g, t, u, v);
  const a = g.amp * Math.pow(u, 1.15) * Math.sin(ph);
  // The cloth bunches toward the pole on each crest (foreshortening).
  const along = u * len - len * 0.08 * u * (1 - Math.cos(ph)) * 0.5;
  return [hx + dx * along + nx * a, hy + dy * along + ny * a];
}

export function slope(g: Geo, t: number, u: number, v: number) {
  return Math.cos(phaseAt(g, t, u, v)) * Math.min(1, u * 2.2);
}

/** Outline of a patch of cloth (u0..u1 along the fly, v0..v1 down the hoist), as points. */
export function patchPoints(g: Geo, t: number, u0: number, u1: number, v0: number, v1: number, su: number, sv: number) {
  const pts: [number, number][] = [point(g, t, u0, v0)];
  for (let k = 1; k <= su; k++) pts.push(point(g, t, u0 + ((u1 - u0) * k) / su, v0));
  for (let k = 1; k <= sv; k++) pts.push(point(g, t, u1, v0 + ((v1 - v0) * k) / sv));
  for (let k = su - 1; k >= 0; k--) pts.push(point(g, t, u0 + ((u1 - u0) * k) / su, v1));
  for (let k = sv - 1; k >= 1; k--) pts.push(point(g, t, u0, v0 + ((v1 - v0) * k) / sv));
  return pts;
}

/** Shading stops along the fly (offset 0..1, rgba) so highlights follow the waves. */
export function shadeStops(g: Geo, t: number, n = 40) {
  const p0 = point(g, t, 0, 0.5);
  const p1 = point(g, t, 1, 0.5);
  const ex = p1[0] - p0[0];
  const ey = p1[1] - p0[1];
  const span = ex * ex + ey * ey || 1;
  const stops: [number, string][] = [];
  let last = 0;
  for (let k = 0; k <= n; k++) {
    const u = k / n;
    const p = point(g, t, u, 0.5);
    const off = Math.min(1, Math.max(last, ((p[0] - p0[0]) * ex + (p[1] - p0[1]) * ey) / span));
    last = off;
    const sl = slope(g, t, u, 0.5);
    stops.push([off, sl > 0 ? `rgba(255,255,255,${(sl * 0.22).toFixed(3)})` : `rgba(0,0,0,${(-sl * 0.45).toFixed(3)})`]);
  }
  return { from: p0, to: p1, stops };
}

const f2 = (n: number) => +n.toFixed(2);
const pathOf = (pts: [number, number][]) => "M" + pts.map(([x, y]) => `${f2(x)} ${f2(y)}`).join("L") + "Z";

/**
 * Still SVG markup (no <svg> wrapper) of both flags in a w × h box at wave time t.
 * Same look as the canvas: chrome poles + finials, offset shadow, checks,
 * fold shading, dark hem.
 */
export function flagsSvgMarkup(uid: string, w: number, h: number, t = 0.6) {
  const scale = Math.max(0.75, Math.min(1.4, h / 90));
  let defs = "";
  let body = "";
  ([-1, 1] as const).forEach((side, i) => {
    const g = geometry(w, h, side);
    const [tx, ty] = g.top;
    const [fx, fy] = g.foot;
    const outline = pathOf(patchPoints(g, t, 0, 1, 0, 1, COLS * SUB_U, ROWS * SUB_V));
    const checks: string[] = [];
    for (let c = 0; c < COLS; c++)
      for (let r = 0; r < ROWS; r++)
        if ((c + r) % 2 === 0) checks.push(pathOf(patchPoints(g, t, c / COLS, (c + 1) / COLS, r / ROWS, (r + 1) / ROWS, SUB_U, SUB_V)));
    const sh = shadeStops(g, t);
    defs += `<linearGradient id="${uid}-s${i}" gradientUnits="userSpaceOnUse" x1="${f2(sh.from[0])}" y1="${f2(sh.from[1])}" x2="${f2(sh.to[0])}" y2="${f2(sh.to[1])}">${sh.stops
      .map(([o, c]) => {
        const m = /rgba\((\d+),(\d+),(\d+),([\d.]+)\)/.exec(c)!;
        return `<stop offset="${f2(o)}" stop-color="rgb(${m[1]},${m[2]},${m[3]})" stop-opacity="${m[4]}"/>`;
      })
      .join("")}</linearGradient>`;
    defs += `<radialGradient id="${uid}-k${i}" cx="${f2(tx - 1.2 * scale)}" cy="${f2(ty - 1.2 * scale)}" r="${f2(3.4 * scale)}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#9aa1ab"/></radialGradient>`;
    body += `<line x1="${f2(fx)}" y1="${f2(fy)}" x2="${f2(tx)}" y2="${f2(ty)}" stroke="#000" stroke-opacity=".75" stroke-width="${f2(4.2 * scale)}" stroke-linecap="round"/>
<line x1="${f2(fx)}" y1="${f2(fy)}" x2="${f2(tx)}" y2="${f2(ty)}" stroke="#cfd3da" stroke-width="${f2(2.2 * scale)}" stroke-linecap="round"/>
<circle cx="${f2(tx)}" cy="${f2(ty)}" r="${f2(3.4 * scale)}" fill="url(#${uid}-k${i})" stroke="#000" stroke-opacity=".8" stroke-width="${f2(1.2 * scale)}"/>
<path d="${outline}" fill="#000" fill-opacity=".5" transform="translate(0 ${f2(2.5 * scale)})"/>
<path d="${outline}" fill="${LIGHT}"/>
<path d="${checks.join("")}" fill="${DARK}"/>
<path d="${outline}" fill="url(#${uid}-s${i})"/>
<path d="${outline}" fill="none" stroke="#000" stroke-opacity=".7" stroke-width="${f2(1.1 * scale)}" stroke-linejoin="round"/>`;
  });
  return `<defs>${defs}</defs>${body}`;
}
