/**
 * Inventory types and pure helpers — safe to import from client components.
 * Reading the actual inventory (Netlify Blobs + content/vehicles) lives in
 * lib/inventoryData.ts, which is server-only.
 */
import type { Body, Vehicle, VehicleImage } from "@/content/types";
import { slugify } from "@/lib/slug";

export { slugify };

export type LiveVehicle = Vehicle & {
  slug: string;
  title: string;
  /** "2023 Toyota Tundra" */
  name: string;
  images: VehicleImage[];
  /** Top-3 most recently listed units */
  isNew: boolean;
};

/** Miles at or above this get the honest "high miles" note on the detail page. */
export const HIGH_MILES = 150_000;

export const bodyLabels: Record<Body, { one: string; many: string }> = {
  truck: { one: "Truck", many: "Trucks" },
  suv: { one: "SUV", many: "SUVs" },
  car: { one: "Car", many: "Cars" },
  van: { one: "Van", many: "Vans" },
};

export const stateNames: Record<string, string> = {
  TX: "Texas",
  NM: "New Mexico",
  FL: "Florida",
  AZ: "Arizona",
  OK: "Oklahoma",
  CA: "California",
  NV: "Nevada",
  GA: "Georgia",
};

const titleOf = (v: Vehicle) => [v.year, v.make, v.model, v.trim].filter(Boolean).join(" ");

function decorate(v: Vehicle & { slug: string }, images: VehicleImage[], newest: Set<number>): LiveVehicle {
  const name = `${v.year} ${v.make} ${v.model}`;
  return {
    ...v,
    name,
    title: titleOf(v),
    isNew: newest.has(v.listingId),
    images: images.map((im, i) => ({ ...im, alt: im.alt ?? `${name}${i === 0 ? "" : `, photo ${i + 1}`}` })),
  };
}

export const defaultSlug = (v: Vehicle) => v.slug ?? slugify(titleOf(v));

/**
 * Turn resolved vehicles (each with its final slug + images) into the list the
 * site renders: sold units dropped, most recently listed first, top 3 flagged new.
 */
export function toLiveList(items: { v: Vehicle & { slug: string }; images: VehicleImage[] }[]): LiveVehicle[] {
  const live = items.filter(({ v }) => v.status !== "sold");
  const newest = new Set(
    [...live].sort((a, b) => b.v.listingId - a.v.listingId).slice(0, 3).map(({ v }) => v.listingId),
  );
  return live.map(({ v, images }) => decorate(v, images, newest)).sort((a, b) => b.listingId - a.listingId);
}

export function formatPrice(price: Vehicle["price"]) {
  if (price === "call") return "Call for price";
  return `$${price.toLocaleString("en-US")}`;
}

export function formatMiles(miles: number | null) {
  if (miles === null) return "Miles: call to ask";
  return `${miles.toLocaleString("en-US")} mi`;
}

export function shortMiles(miles: number | null) {
  if (miles === null) return "Miles TBD";
  return miles >= 1000 ? `${Math.round(miles / 1000)}k mi` : `${miles} mi`;
}

export const isHighMiles = (v: Vehicle) => v.miles !== null && v.miles >= HIGH_MILES;

/**
 * Pull a short list of "worth knowing" features out of the long options list
 * for the detail page. Matches on the listing's own wording only.
 */
const KEY_FEATURES: [RegExp, string, string][] = [
  [/apple carplay/i, "Apple CarPlay", "phone"],
  [/android auto/i, "Android Auto", "phone"],
  [/remote (engine )?start/i, "Remote start", "key"],
  [/heated steering/i, "Heated steering wheel", "flame"],
  [/adaptive (stop and go )?cruise/i, "Adaptive cruise", "gauge"],
  [/lane centering|lane guidance/i, "Lane centering", "road"],
  [/camera system - rearview|backup camera/i, "Backup camera", "camera"],
  [/wireless charging/i, "Wireless charging", "bolt"],
  [/power operated|sensor-activated|power liftgate/i, "Power liftgate", "door"],
  [/dual power sliding/i, "Power sliding doors", "door"],
  [/running boards/i, "Running boards", "step"],
  [/tow\/haul/i, "Tow/haul mode", "hitch"],
  [/trailer brake controller/i, "Trailer brake controller", "hitch"],
  [/trailer hitch|receiver hitch/i, "Trailer hitch", "hitch"],
  [/towing mirrors/i, "Towing mirrors", "hitch"],
  [/4wd selector - electronic hi-lo/i, "Electronic 4WD hi/lo", "mountain"],
  [/locking differential/i, "Locking rear diff", "mountain"],
  [/magnetic|air suspension/i, "Adaptive suspension", "mountain"],
  [/third row|7-passenger|7 passenger/i, "Third-row seating", "seat"],
  [/satellite radio|siriusxm/i, "SiriusXM", "radio"],
  [/bluetooth/i, "Bluetooth", "radio"],
  [/push-button start/i, "Push-button start", "key"],
  [/proximity entry|keypad entry/i, "Keyless entry", "key"],
  [/leather/i, "Leather trim", "seat"],
  [/t-tops?/i, "T-tops", "sun"],
  [/service body/i, "Service body", "wrench"],
  [/dual rear wheels|drw/i, "Dual rear wheels", "wheel"],
  [/high roof|roof height - high/i, "High roof", "box"],
  [/brembo/i, "Brembo brakes", "wheel"],
];

export function keyFeatures(v: Vehicle, max = 8) {
  const hay = [...(v.features ?? []), ...(v.highlights ?? []), v.description ?? ""];
  const out: { label: string; icon: string }[] = [];
  for (const [re, label, icon] of KEY_FEATURES) {
    if (out.length >= max) break;
    if (out.some((o) => o.label === label)) continue;
    if (hay.some((h) => re.test(h))) out.push({ label, icon });
  }
  return out;
}

/** Options for filter UIs, derived from live inventory. */
export function facets(list: LiveVehicle[]) {
  const count = <T extends string>(get: (v: LiveVehicle) => T | undefined) => {
    const m = new Map<T, number>();
    for (const v of list) {
      const k = get(v);
      if (k) m.set(k, (m.get(k) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
  };
  const years = list.map((v) => v.year);
  const prices = list.map((v) => v.price).filter((p): p is number => typeof p === "number");
  return {
    makes: count((v) => v.make),
    bodies: count((v) => v.body),
    drivetrains: count((v) => v.drivetrain),
    fuels: count((v) => v.fuel),
    colors: count((v) => v.exterior),
    yearMin: Math.min(...years),
    yearMax: Math.max(...years),
    priceMax: Math.max(...prices),
  };
}
