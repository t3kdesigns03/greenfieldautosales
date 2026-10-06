/**
 * Where the site reads inventory from. Server only.
 *
 *   1. Netlify Blobs (store "inventory", keys vehicle:<slug>) — written by /admin
 *   2. content/vehicles/*.ts — anything whose slug is NOT in Blobs
 *
 * Photos: a Blobs record's own photos (photo:<slug>:<i>, served by
 * /api/photos/...). If a record has none, or the vehicle is content-only, the
 * `npm run photos` output in content/photos.generated.ts is used, so the CLI
 * path keeps working for vehicles already in content/vehicles.
 *
 * If Blobs can't be reached (e.g. a build without a Blobs context) the site
 * falls back to content files only and logs it; pages revalidate shortly after.
 */
import { cache } from "react";
import { inventory } from "@/content/inventory";
import { photos as cliPhotos } from "@/content/photos.generated";
import type { Vehicle, VehicleImage } from "@/content/types";
import { defaultSlug, toLiveList, type LiveVehicle } from "@/lib/inventory";
import { inventoryStore } from "@/lib/store";
import { photoUrl, type VehicleRecord } from "@/lib/vehicleRecord";

export type Source = "blobs" | "content";

export type ResolvedVehicle = {
  v: Vehicle & { slug: string };
  images: VehicleImage[];
  source: Source;
  /** True when a Blobs record replaces a content/vehicles file with the same slug */
  overridesContent: boolean;
  record?: VehicleRecord;
};

/** content/vehicles, each with its slug resolved. Throws on duplicate slugs (a content mistake). */
export function contentVehicles(): (Vehicle & { slug: string })[] {
  const seen = new Set<string>();
  return inventory.map((v) => {
    const slug = defaultSlug(v);
    if (seen.has(slug) && v.status !== "sold") {
      throw new Error(`Two vehicles share the slug "${slug}". Give one a unique \`slug\` in content/vehicles/.`);
    }
    seen.add(slug);
    return { ...v, slug };
  });
}

/** All vehicle records in Blobs. Errors are logged and treated as "none". */
export async function blobRecords(opts: { throwOnError?: boolean } = {}): Promise<VehicleRecord[]> {
  try {
    const store = inventoryStore();
    const keys = await store.list("vehicle:");
    const recs = await Promise.all(keys.map((k) => store.getJSON<VehicleRecord>(k)));
    return recs.filter((r): r is VehicleRecord => Boolean(r && r.slug));
  } catch (err) {
    if (opts.throwOnError) throw err;
    console.error("[inventory] Netlify Blobs unavailable; showing content/vehicles only.", err);
    return [];
  }
}

export function recordImages(r: VehicleRecord): VehicleImage[] {
  return (r.photos ?? []).map((p, i) => ({
    src: photoUrl(r.slug, r.photoVersion, i),
    width: p.width,
    height: p.height,
    blur: p.blur,
  }));
}

function merge(records: VehicleRecord[]): ResolvedVehicle[] {
  const content = contentVehicles();
  const contentSlugs = new Set(content.map((v) => v.slug));
  const bySlug = new Map(records.map((r) => [r.slug, r]));

  const fromBlobs: ResolvedVehicle[] = records.map((r) => {
    const { photos: _p, photoVersion: _pv, createdAt: _c, updatedAt: _u, ...v } = r;
    const own = recordImages(r);
    return {
      v: v as Vehicle & { slug: string },
      images: own.length ? own : (cliPhotos[r.slug] ?? []),
      source: "blobs",
      overridesContent: contentSlugs.has(r.slug),
      record: r,
    };
  });
  const fromContent: ResolvedVehicle[] = content
    .filter((v) => !bySlug.has(v.slug))
    .map((v) => ({ v, images: v.images?.length ? v.images : (cliPhotos[v.slug] ?? []), source: "content", overridesContent: false }));

  return [...fromBlobs, ...fromContent];
}

/** Every vehicle (live and sold), Blobs first. Deduped per request. */
export const allVehicles = cache(async (): Promise<ResolvedVehicle[]> => merge(await blobRecords()));

/** What the public site renders: not sold, newest listed first. */
export const getLiveVehicles = cache(async (): Promise<LiveVehicle[]> => toLiveList(await allVehicles()));

export async function getLiveVehicle(slug: string): Promise<LiveVehicle | undefined> {
  return (await getLiveVehicles()).find((v) => v.slug === slug);
}

/** Sold units from content/vehicles/sold.ts, for the home-page "Sold here" strip. */
export function soldStripVehicles() {
  return inventory.filter((v) => v.status === "sold").map((v) => ({ ...v, name: `${v.year} ${v.make} ${v.model}` }));
}

/** For /admin: everything (live + sold), plus whether Blobs could be read. Never cached. */
export async function adminInventory() {
  let blobsError: string | null = null;
  let records: VehicleRecord[] = [];
  let storeKind: string | null = null;
  try {
    const store = inventoryStore();
    storeKind = store.kind;
    records = await blobRecords({ throwOnError: true });
  } catch (err) {
    blobsError = err instanceof Error ? err.message : String(err);
  }
  return { vehicles: merge(records), blobsError, storeKind };
}
