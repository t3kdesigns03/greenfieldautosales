/**
 * Vehicle records written by /admin and stored in Netlify Blobs.
 *
 *   store "inventory"
 *     vehicle:<slug>          JSON VehicleRecord (this file's shape)
 *     photo:<slug>:<index>    WebP bytes, index 0 = cover
 *
 * A record is a full Vehicle (same type as content/vehicles) plus photo
 * metadata. When a record's slug matches a content/vehicles file, the record
 * wins: that's how the admin edits or sells a vehicle that started life in git.
 *
 * Shared by the admin UI (client) and the API routes (server): no Node imports.
 */
import type { Body, Drivetrain, Fuel, Vehicle, VehicleStatus } from "@/content/types";
import { isValidSlug } from "@/lib/slug";

export type StoredPhoto = {
  width: number;
  height: number;
  /** Tiny data: URL for the blur-up placeholder */
  blur?: string;
};

export type VehicleRecord = Vehicle & {
  slug: string;
  photos: StoredPhoto[];
  /** Changes on every photo write; part of the photo URL so caches never serve a stale order. */
  photoVersion: string;
  createdAt: string;
  updatedAt: string;
};

export const BODIES: Body[] = ["truck", "suv", "van", "car"];
export const DRIVETRAINS: Drivetrain[] = ["4x4", "AWD", "FWD", "RWD"];
export const FUELS: Fuel[] = ["Gas", "Diesel", "Flex Fuel", "Hybrid", "Electric"];
export const STATUSES: VehicleStatus[] = ["available", "pending", "sold"];

export const MAX_PHOTOS = 40;
export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

/** The fields the admin form edits. Everything else on a record is carried over untouched. */
export type VehicleInput = {
  slug: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  body: Body;
  price: number | "call";
  miles: number | null;
  drivetrain?: Drivetrain;
  fuel?: Fuel;
  origin?: string;
  highlights?: string[];
  caveat?: string;
  status: VehicleStatus;
  carsForSaleUrl?: string;
};

type Result = { ok: true; value: VehicleInput } | { ok: false; errors: Record<string, string> };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");

/** Validate untrusted input (form or JSON). Returns field-level errors for the form. */
export function parseVehicleInput(raw: Record<string, unknown>): Result {
  const errors: Record<string, string> = {};
  const thisYear = new Date().getFullYear();

  const slug = str(raw.slug).toLowerCase();
  if (!isValidSlug(slug)) errors.slug = "Use lowercase letters, numbers and dashes (e.g. 2019-ford-f-150-xlt).";

  const year = Number(str(raw.year));
  if (!Number.isInteger(year) || year < 1900 || year > thisYear + 2) errors.year = "Enter a 4-digit year.";

  const make = str(raw.make);
  if (!make || make.length > 40) errors.make = "Enter the make.";
  const model = str(raw.model);
  if (!model || model.length > 60) errors.model = "Enter the model.";
  const trim = str(raw.trim);
  if (trim.length > 80) errors.trim = "Keep the trim under 80 characters.";

  const body = str(raw.body) as Body;
  if (!BODIES.includes(body)) errors.body = "Pick truck, SUV, van or car.";

  let price: number | "call" = "call";
  const priceRaw = str(raw.price).replace(/[$,\s]/g, "").toLowerCase();
  if (priceRaw === "call" || raw.price === "call") price = "call";
  else {
    const n = Number(priceRaw);
    if (!priceRaw || !Number.isFinite(n) || n < 0 || n > 10_000_000) errors.price = "Enter a price in dollars, or choose “Call for price”.";
    else price = Math.round(n);
  }

  let miles: number | null = null;
  const milesRaw = str(raw.miles).replace(/[,\s]/g, "");
  if (milesRaw) {
    const n = Number(milesRaw);
    if (!Number.isFinite(n) || n < 0 || n > 3_000_000) errors.miles = "Enter miles as a number, or leave it blank.";
    else miles = Math.round(n);
  }

  const drivetrain = str(raw.drivetrain) as Drivetrain;
  if (drivetrain && !DRIVETRAINS.includes(drivetrain)) errors.drivetrain = "Pick a drivetrain.";
  const fuel = str(raw.fuel) as Fuel;
  if (fuel && !FUELS.includes(fuel)) errors.fuel = "Pick a fuel type.";

  const origin = str(raw.origin).toUpperCase();
  if (origin && !/^[A-Z]{2}$/.test(origin)) errors.origin = "Two-letter state, like TX. Or leave it blank.";

  const hlRaw = Array.isArray(raw.highlights) ? raw.highlights.map(str) : str(raw.highlights).split(/\r?\n/);
  const highlights = hlRaw.map((h) => h.trim()).filter(Boolean);
  if (highlights.length > 12) errors.highlights = "Keep it to 12 highlights or fewer.";
  else if (highlights.some((h) => h.length > 100)) errors.highlights = "Keep each highlight under 100 characters.";

  const caveat = str(raw.caveat);
  if (caveat.length > 400) errors.caveat = "Keep the caveat under 400 characters.";

  const status = (str(raw.status) || "available") as VehicleStatus;
  if (!STATUSES.includes(status)) errors.status = "Pick a status.";

  const carsForSaleUrl = str(raw.carsForSaleUrl);
  if (carsForSaleUrl) {
    try {
      const u = new URL(carsForSaleUrl);
      if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error();
    } catch {
      errors.carsForSaleUrl = "Paste the full listing link, starting with https://";
    }
  }

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      slug,
      year,
      make,
      model,
      ...(trim && { trim }),
      body,
      price,
      miles,
      ...(drivetrain && { drivetrain }),
      ...(fuel && { fuel }),
      ...(origin && { origin }),
      ...(highlights.length && { highlights }),
      ...(caveat && { caveat }),
      status,
      ...(carsForSaleUrl && { carsForSaleUrl }),
    },
  };
}

/** Optional fields the form can clear: removing them from the record when the form sends them empty. */
export const CLEARABLE: (keyof VehicleInput)[] = ["trim", "drivetrain", "fuel", "origin", "highlights", "caveat", "carsForSaleUrl"];

/** Public URL of one stored photo. The version segment busts caches after a reorder. */
export const photoUrl = (slug: string, version: string, index: number) => `/api/photos/${slug}/${version}/${index}.webp`;

export const vehicleKey = (slug: string) => `vehicle:${slug}`;
export const photoKey = (slug: string, index: number) => `photo:${slug}:${index}`;
export const uploadKey = (slug: string, id: string) => `upload:${slug}:${id}`;
