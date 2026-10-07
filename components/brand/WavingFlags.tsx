"use client";

import { useEffect, useRef } from "react";

/**
 * Two crossed checkered flags, drawn on a canvas and waving continuously.
 * Sits behind the header logo (badge + wordmark), echoing the original
 * Greenfield logo with its crossed flags behind the name.
 *
 * Each flag is a cloth mesh: a wave runs from the pole out to the free end,
 * the checks bend with the fabric, and light/shadow travels across the folds.
 * On load the poles rise, the cloths unfurl, and a shockwave + sparks fire
 * as the badge lands. Hovering or tapping the logo (".gas-logo") speeds the
 * wave up and throws another burst of sparks.
 * One frame is drawn when the user prefers reduced motion. The loop pauses
 * while the tab is hidden or the canvas is off screen.
 */

type Side = -1 | 1; // -1 = flag flies to the left, 1 = to the right

const COLS = 5; // checks along the fly
const ROWS = 4; // checks down the hoist
const SUB_U = 8; // subdivisions per check, along the fly (smooth curves)
const SUB_V = 3;

const LIGHT = "#eceef2";
const DARK = "#2a2c31";

type Geo = {
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
function geometry(w: number, h: number, side: Side): Geo {
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
function point(g: Geo, t: number, u: number, v: number): [number, number] {
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

function slope(g: Geo, t: number, u: number, v: number) {
  return Math.cos(phaseAt(g, t, u, v)) * Math.min(1, u * 2.2);
}

function tracePatch(ctx: CanvasRenderingContext2D, g: Geo, t: number, u0: number, u1: number, v0: number, v1: number, su: number, sv: number) {
  let p = point(g, t, u0, v0);
  ctx.moveTo(p[0], p[1]);
  for (let k = 1; k <= su; k++) {
    p = point(g, t, u0 + ((u1 - u0) * k) / su, v0);
    ctx.lineTo(p[0], p[1]);
  }
  for (let k = 1; k <= sv; k++) {
    p = point(g, t, u1, v0 + ((v1 - v0) * k) / sv);
    ctx.lineTo(p[0], p[1]);
  }
  for (let k = su - 1; k >= 0; k--) {
    p = point(g, t, u0 + ((u1 - u0) * k) / su, v1);
    ctx.lineTo(p[0], p[1]);
  }
  for (let k = sv - 1; k >= 1; k--) {
    p = point(g, t, u0, v0 + ((v1 - v0) * k) / sv);
    ctx.lineTo(p[0], p[1]);
  }
  ctx.closePath();
}

function drawPole(ctx: CanvasRenderingContext2D, g: Geo, scale: number) {
  const [tx, ty] = g.top;
  const [fx, fy] = g.foot;
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(0,0,0,.75)";
  ctx.lineWidth = 4.2 * scale;
  ctx.beginPath();
  ctx.moveTo(fx, fy);
  ctx.lineTo(tx, ty);
  ctx.stroke();
  const grad = ctx.createLinearGradient(tx - 3, 0, tx + 3, 0);
  grad.addColorStop(0, "#8d939c");
  grad.addColorStop(0.5, "#f4f6f9");
  grad.addColorStop(1, "#7c828b");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2.2 * scale;
  ctx.beginPath();
  ctx.moveTo(fx, fy);
  ctx.lineTo(tx, ty);
  ctx.stroke();
  // finial
  const r = 3.4 * scale;
  const fg = ctx.createRadialGradient(tx - r * 0.35, ty - r * 0.35, r * 0.1, tx, ty, r);
  fg.addColorStop(0, "#ffffff");
  fg.addColorStop(1, "#9aa1ab");
  ctx.fillStyle = fg;
  ctx.strokeStyle = "rgba(0,0,0,.8)";
  ctx.lineWidth = 1.2 * scale;
  ctx.beginPath();
  ctx.arc(tx, ty, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawFlag(ctx: CanvasRenderingContext2D, g: Geo, t: number, scale: number) {
  drawPole(ctx, g, scale);

  // Cloth silhouette over a cheap offset shadow (canvas shadowBlur is too
  // slow to run every frame on phones).
  ctx.save();
  ctx.translate(0, 2.5 * scale);
  ctx.beginPath();
  tracePatch(ctx, g, t, 0, 1, 0, 1, COLS * SUB_U, ROWS * SUB_V);
  ctx.fillStyle = "rgba(0,0,0,.5)";
  ctx.fill();
  ctx.restore();
  ctx.beginPath();
  tracePatch(ctx, g, t, 0, 1, 0, 1, COLS * SUB_U, ROWS * SUB_V);
  ctx.fillStyle = LIGHT;
  ctx.fill();

  // Dark checks, each traced as one curved patch (no seams inside a check).
  ctx.beginPath();
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      if ((i + j) % 2) continue;
      tracePatch(ctx, g, t, i / COLS, (i + 1) / COLS, j / ROWS, (j + 1) / ROWS, SUB_U, SUB_V);
    }
  }
  ctx.fillStyle = DARK;
  ctx.fill();

  // Light and shadow across the folds: a gradient along the fly whose stops
  // follow the cloth's slope, so highlights travel with the waves.
  const N = 40;
  const p0 = point(g, t, 0, 0.5);
  const p1 = point(g, t, 1, 0.5);
  const ex = p1[0] - p0[0];
  const ey = p1[1] - p0[1];
  const span = ex * ex + ey * ey || 1;
  const shade = ctx.createLinearGradient(p0[0], p0[1], p1[0], p1[1]);
  let last = 0;
  for (let k = 0; k <= N; k++) {
    const u = k / N;
    const p = point(g, t, u, 0.5);
    const off = Math.min(1, Math.max(last, ((p[0] - p0[0]) * ex + (p[1] - p0[1]) * ey) / span));
    last = off;
    const sl = slope(g, t, u, 0.5);
    shade.addColorStop(off, sl > 0 ? `rgba(255,255,255,${(sl * 0.22).toFixed(3)})` : `rgba(0,0,0,${(-sl * 0.45).toFixed(3)})`);
  }
  ctx.beginPath();
  tracePatch(ctx, g, t, 0, 1, 0, 1, COLS * SUB_U, ROWS * SUB_V);
  ctx.fillStyle = shade;
  ctx.fill();

  // Hem
  ctx.beginPath();
  tracePatch(ctx, g, t, 0, 1, 0, 1, COLS * SUB_U, ROWS * SUB_V);
  ctx.strokeStyle = "rgba(0,0,0,.7)";
  ctx.lineWidth = 1.1 * scale;
  ctx.lineJoin = "round";
  ctx.stroke();
}

type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; hue: string };
type Ring = { x: number; y: number; age: number };

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeOutBack = (x: number) => 1 + 2.4 * Math.pow(x - 1, 3) + 1.4 * Math.pow(x - 1, 2);
const SPARK_HUES = ["#ffffff", "#ffd2d5", "#ff2a36", "#ff7a3a", "#ff2a36"];

export default function WavingFlags({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    // Wave clock. Runs faster while the logo is hovered / tapped (".gas-logo" revs).
    let clock = 0;
    let speed = 1;
    let last = performance.now();
    const logo = canvas.closest<HTMLElement>(".gas-logo");
    // Line the unfurl up with the badge's CSS entrance, which starts at first
    // paint (before this runs). If hydration was slow, still show the unfurl.
    const badgeAnim = Array.from(logo?.querySelectorAll<SVGElement>(".gas-badge") ?? [])
      .flatMap((n) => n.getAnimations?.() ?? [])
      .find((a) => a.currentTime != null);
    const cssAge = badgeAnim ? Number(badgeAnim.currentTime) / 1000 : 0;
    const born = last - Math.min(cssAge, 0.35) * 1000;
    // Entrance: poles rise, cloth unfurls, then a shockwave + sparks as the badge lands.
    let intro = !reduce.matches;
    let landed = false;
    let wasRevving = false;
    // Adaptive quality: if frames run long on a slow phone, drop the canvas
    // resolution and draw every other frame (30fps waves still read as smooth).
    let frameEma = 16.7;
    let lite = false;
    let skip = false;
    let sparks: Spark[] = [];
    let rings: Ring[] = [];

    /** Centre of the visible badge, in canvas pixels. */
    const badgeCentre = (): [number, number] | null => {
      const el = Array.from(logo?.querySelectorAll<SVGElement>(".gas-badge") ?? []).find((n) => n.getClientRects().length > 0);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      const c = canvas.getBoundingClientRect();
      return [b.left + b.width / 2 - c.left, b.top + b.height / 2 - c.top];
    };
    const burst = (count: number, power: number) => {
      const at = badgeCentre();
      if (!at) return;
      const k = Math.max(0.7, Math.min(1.5, h / 90));
      rings.push({ x: at[0], y: at[1], age: 0 });
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = (90 + Math.random() * 220) * power * k;
        const max = 0.45 + Math.random() * 0.55;
        sparks.push({
          x: at[0] + Math.cos(a) * 14 * k,
          y: at[1] + Math.sin(a) * 14 * k,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v - 60 * k,
          life: max,
          max,
          hue: SPARK_HUES[i % SPARK_HUES.length],
        });
      }
    };

    const drawFx = (dt: number, scale: number) => {
      if (!sparks.length && !rings.length) return;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      rings = rings.filter((r) => (r.age += dt) < 0.6);
      for (const r of rings) {
        const k = r.age / 0.6;
        ctx.strokeStyle = `rgba(255,60,70,${(1 - k).toFixed(3)})`;
        ctx.lineWidth = (3.5 * (1 - k) + 0.6) * scale;
        ctx.shadowColor = "rgba(255,40,50,.9)";
        ctx.shadowBlur = 14 * scale;
        ctx.beginPath();
        ctx.arc(r.x, r.y, (18 + 90 * easeOutCubic(k)) * scale, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      sparks = sparks.filter((p) => (p.life -= dt) > 0);
      for (const p of sparks) {
        p.vy += 420 * scale * dt;
        p.vx *= 1 - 1.2 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        ctx.globalAlpha = Math.min(1, (p.life / p.max) * 1.6);
        ctx.strokeStyle = p.hue;
        ctx.lineWidth = 1.7 * scale;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 0.035, p.y - p.vy * 0.035);
        ctx.stroke();
      }
      ctx.restore();
    };

    const draw = (t: number, age = 9, dt = 0) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!w || !h) return;
      const scale = Math.max(0.75, Math.min(1.4, h / 90));
      const pole = easeOutCubic(clamp01((age - 0.05) / 0.5));
      const cloth = Math.max(0.02, easeOutBack(clamp01((age - 0.35) / 0.85)));
      for (const side of [-1, 1] as const) {
        const g = geometry(w, h, side);
        if (pole < 1 || cloth < 1) {
          g.top = [g.foot[0] + (g.top[0] - g.foot[0]) * pole, g.foot[1] + (g.top[1] - g.foot[1]) * pole];
          g.fly = [g.fly[0] * cloth, g.fly[1] * cloth];
          g.amp *= Math.min(1, cloth);
        }
        if (pole > 0.02) drawFlag(ctx, g, t, scale);
      }
      drawFx(dt, scale);
    };

    const frame = (now: number) => {
      const raw = now - last;
      frameEma += (raw - frameEma) * 0.08;
      if (!lite && !intro && frameEma > 24) {
        lite = true;
        resize();
      }
      if (lite && (skip = !skip) && !sparks.length) {
        raf = visible && !reduce.matches ? requestAnimationFrame(frame) : 0;
        return;
      }
      const dt = Math.min(0.05, raw / 1000);
      last = now;
      const age = intro ? (now - born) / 1000 : 9;
      if (intro && age > 2) intro = false;
      if (intro && !landed && age > 0.62) {
        landed = true;
        burst(34, 1.15);
      }
      const revving = !!logo && (logo.dataset.rev === "1" || logo.matches(":hover"));
      if (revving && !wasRevving) burst(26, 1);
      wasRevving = revving;
      speed += ((revving ? 2.6 : 1) - speed) * Math.min(1, dt * 4);
      clock += dt * speed;
      draw(clock, age, dt);
      raf = visible && !reduce.matches ? requestAnimationFrame(frame) : 0;
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce.matches) {
        intro = false;
        sparks = [];
        rings = [];
        draw(0.6);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.25 : 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (!raf) draw(reduce.matches ? 0.6 : clock);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(raf), (raf = 0);
    });
    io.observe(canvas);
    reduce.addEventListener("change", start);
    resize();
    start();
    canvas.dataset.ready = "1";

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      reduce.removeEventListener("change", start);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
