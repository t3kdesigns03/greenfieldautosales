import type { Body } from "@/content/inventory";
import type { LiveVehicle } from "@/lib/inventory";

export type SortKey = "newest" | "price-asc" | "price-desc" | "miles-asc" | "year-desc";

export const sortLabels: Record<SortKey, string> = {
  newest: "Newest listed",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "miles-asc": "Lowest miles",
  "year-desc": "Newest year",
};

export type Filters = {
  q: string;
  body: Body[];
  make: string[];
  drive: string[];
  fuel: string[];
  color: string[];
  priceMax: number | null;
  yearMin: number | null;
  milesMax: number | null;
  saved: boolean;
  sort: SortKey;
};

export const EMPTY_FILTERS: Filters = {
  q: "",
  body: [],
  make: [],
  drive: [],
  fuel: [],
  color: [],
  priceMax: null,
  yearMin: null,
  milesMax: null,
  saved: false,
  sort: "newest",
};

export const PRICE_STEPS = [7500, 10000, 15000, 20000, 25000, 30000, 40000];
export const MILES_STEPS = [50000, 75000, 100000, 150000, 200000];

const BODIES: Body[] = ["truck", "suv", "van", "car"];

const list = (sp: URLSearchParams, k: string) =>
  (sp.get(k) ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
const num = (sp: URLSearchParams, k: string) => {
  const v = Number(sp.get(k));
  return Number.isFinite(v) && v > 0 ? v : null;
};

/** URL → filters. Also accepts the v0 `?type=truck` form (old Carsforsale redirect targets). */
export function parseFilters(sp: URLSearchParams): Filters {
  const body = [...list(sp, "body"), ...list(sp, "type")].filter((b): b is Body => (BODIES as string[]).includes(b));
  const sort = (sp.get("sort") ?? "newest") as SortKey;
  return {
    q: sp.get("q") ?? "",
    body: [...new Set(body)],
    make: list(sp, "make"),
    drive: list(sp, "drive"),
    fuel: list(sp, "fuel"),
    color: list(sp, "color"),
    priceMax: num(sp, "max"),
    yearMin: num(sp, "year"),
    milesMax: num(sp, "miles"),
    saved: sp.get("saved") === "1",
    sort: sort in sortLabels ? sort : "newest",
  };
}

export function filtersToQuery(f: Filters) {
  const p = new URLSearchParams();
  if (f.q) p.set("q", f.q);
  if (f.body.length) p.set("body", f.body.join(","));
  if (f.make.length) p.set("make", f.make.join(","));
  if (f.drive.length) p.set("drive", f.drive.join(","));
  if (f.fuel.length) p.set("fuel", f.fuel.join(","));
  if (f.color.length) p.set("color", f.color.join(","));
  if (f.priceMax !== null) p.set("max", String(f.priceMax));
  if (f.yearMin !== null) p.set("year", String(f.yearMin));
  if (f.milesMax !== null) p.set("miles", String(f.milesMax));
  if (f.saved) p.set("saved", "1");
  if (f.sort !== "newest") p.set("sort", f.sort);
  return p.toString();
}

export function activeCount(f: Filters) {
  return (
    f.body.length +
    f.make.length +
    f.drive.length +
    f.fuel.length +
    f.color.length +
    (f.priceMax !== null ? 1 : 0) +
    (f.yearMin !== null ? 1 : 0) +
    (f.milesMax !== null ? 1 : 0) +
    (f.saved ? 1 : 0)
  );
}

export function applyFilters(all: LiveVehicle[], f: Filters, saved: string[]) {
  const words = f.q.toLowerCase().split(/\s+/).filter(Boolean);
  const out = all.filter((v) => {
    if (f.saved && !saved.includes(v.slug)) return false;
    if (f.body.length && !f.body.includes(v.body)) return false;
    if (f.make.length && !f.make.includes(v.make)) return false;
    if (f.drive.length && !(v.drivetrain && f.drive.includes(v.drivetrain))) return false;
    if (f.fuel.length && !(v.fuel && f.fuel.includes(v.fuel))) return false;
    if (f.color.length && !(v.exterior && f.color.includes(v.exterior))) return false;
    // A "call for price" unit can't honestly be shown as under a price cap.
    if (f.priceMax !== null && (v.price === "call" || v.price > f.priceMax)) return false;
    if (f.yearMin !== null && v.year < f.yearMin) return false;
    if (f.milesMax !== null && (v.miles === null || v.miles > f.milesMax)) return false;
    if (words.length) {
      const hay = [v.title, v.body, v.bodyStyle, v.engine, v.drivetrain, v.fuel, v.exterior, v.origin, ...(v.highlights ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!words.every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  const price = (v: LiveVehicle) => (v.price === "call" ? Infinity : v.price);
  const miles = (v: LiveVehicle) => v.miles ?? Infinity;
  const sorters: Record<SortKey, (a: LiveVehicle, b: LiveVehicle) => number> = {
    newest: (a, b) => b.listingId - a.listingId,
    "price-asc": (a, b) => price(a) - price(b),
    "price-desc": (a, b) => (b.price === "call" ? -1 : a.price === "call" ? 1 : price(b) - price(a)),
    "miles-asc": (a, b) => miles(a) - miles(b),
    "year-desc": (a, b) => b.year - a.year || b.listingId - a.listingId,
  };
  return out.sort(sorters[f.sort]);
}

/** Swatch colors for the color filter (listing color names → hex). */
export const swatch: Record<string, string> = {
  White: "#F3F3F1",
  Black: "#121212",
  Silver: "#C3C7CB",
  Gray: "#6E7377",
  Grey: "#6E7377",
  Red: "#B3261E",
  Blue: "#2457A6",
  Green: "#2F6B3A",
  Tan: "#C9B18A",
  Beige: "#D8C8A8",
  Brown: "#6B4A2F",
  Gold: "#C4A15A",
  Orange: "#D2691E",
  Yellow: "#E8C547",
  Maroon: "#5E1F24",
};
