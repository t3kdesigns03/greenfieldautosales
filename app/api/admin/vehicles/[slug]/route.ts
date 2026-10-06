import { guardAdminRequest } from "@/lib/adminAuth";
import { contentVehicles } from "@/lib/inventoryData";
import { revalidateInventory } from "@/lib/revalidateInventory";
import { inventoryStore } from "@/lib/store";
import { isValidSlug } from "@/lib/slug";
import {
  CLEARABLE,
  MAX_PHOTOS,
  parseVehicleInput,
  photoKey,
  uploadKey,
  vehicleKey,
  type StoredPhoto,
  type VehicleRecord,
} from "@/lib/vehicleRecord";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

type PhotoItem =
  | { kind: "existing"; index: number }
  | { kind: "upload"; id: string; width: number; height: number; blur?: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const fail = (status: number, error: string, errors?: Record<string, string>) =>
  Response.json({ ok: false, error, ...(errors && { errors }) }, { status });

function cleanPhotoMeta(p: { width: unknown; height: unknown; blur?: unknown }): StoredPhoto | null {
  const width = Number(p.width);
  const height = Number(p.height);
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 4000 || height > 4000) return null;
  const blur = typeof p.blur === "string" && /^data:image\/(webp|jpeg|png);base64,[a-z0-9+/=]+$/i.test(p.blur) && p.blur.length < 4000 ? p.blur : undefined;
  return { width, height, ...(blur && { blur }) };
}

/**
 * PUT /api/admin/vehicles/<slug>
 * { mode: "create" | "update", fields: {…form fields}, photos: PhotoItem[] }
 *
 * Writes vehicle:<slug> and photo:<slug>:0..n-1 (first = cover), deletes any
 * leftover photo indexes and staged uploads, then revalidates the public pages.
 * Updating a vehicle that only exists in content/vehicles creates a Blobs record
 * for it (which then wins over the file).
 */
export async function PUT(req: Request, { params }: Ctx) {
  const denied = await guardAdminRequest(req);
  if (denied) return denied;

  const { slug } = await params;
  if (!isValidSlug(slug)) return fail(400, "Bad slug.");

  let body: { mode?: unknown; fields?: unknown; photos?: unknown };
  try {
    body = await req.json();
  } catch {
    return fail(400, "Bad request.");
  }
  const mode = body.mode === "create" ? "create" : body.mode === "update" ? "update" : null;
  if (!mode) return fail(400, "Bad request.");

  const parsed = parseVehicleInput({ ...((body.fields ?? {}) as Record<string, unknown>), slug });
  if (!parsed.ok) return fail(422, "Check the highlighted fields.", parsed.errors);
  const input = parsed.value;

  const store = inventoryStore();
  const existing = await store.getJSON<VehicleRecord>(vehicleKey(slug));
  const fromContent = contentVehicles().find((v) => v.slug === slug);

  if (mode === "create" && (existing || fromContent)) {
    return fail(409, "That slug is already used.", { slug: "Already used by another vehicle. Add something to make it unique (e.g. the color)." });
  }
  if (mode === "update" && !existing && !fromContent) return fail(404, "That vehicle doesn't exist any more.");

  // ---- photos ----
  const items = Array.isArray(body.photos) ? (body.photos as PhotoItem[]) : [];
  if (items.length > MAX_PHOTOS) return fail(422, `Up to ${MAX_PHOTOS} photos per vehicle.`);
  const oldPhotos = existing?.photos ?? [];

  const meta: StoredPhoto[] = [];
  for (const it of items) {
    if (it?.kind === "existing" && Number.isInteger(it.index) && it.index >= 0 && it.index < oldPhotos.length) {
      meta.push(oldPhotos[it.index]);
    } else if (it?.kind === "upload" && typeof it.id === "string" && UUID.test(it.id)) {
      const m = cleanPhotoMeta(it);
      if (!m) return fail(422, "A photo's size info was missing. Remove it and add it again.");
      meta.push(m);
    } else {
      return fail(422, "The photo list didn't make sense. Reload the page and try again.");
    }
  }

  const unchanged =
    items.length === oldPhotos.length && items.every((it, i) => it.kind === "existing" && it.index === i);

  let photoVersion = existing?.photoVersion ?? "0";
  if (!unchanged) {
    // Read everything first, so a missing staged upload aborts before anything is overwritten.
    const bytes = await Promise.all(
      items.map((it) => store.getBytes(it.kind === "existing" ? photoKey(slug, it.index) : uploadKey(slug, it.id))),
    );
    if (bytes.some((b) => !b)) return fail(409, "A photo didn't finish uploading. Save again.");
    for (let i = 0; i < bytes.length; i++) await store.setBytes(photoKey(slug, i), bytes[i]!);
    for (let j = items.length; j < oldPhotos.length; j++) await store.delete(photoKey(slug, j));
    photoVersion = Date.now().toString(36);
  }

  // ---- record ----
  const now = new Date().toISOString();
  const base: Record<string, unknown> = existing ? { ...existing } : fromContent ? { ...fromContent } : {};
  delete base.images; // photos live in Blobs now (CLI photos still show while a record has none)
  for (const k of CLEARABLE) if (!(k in input)) delete base[k];

  const record: VehicleRecord = {
    ...(base as Partial<VehicleRecord>),
    ...input,
    slug,
    listingId: (base.listingId as number | undefined) ?? Math.floor(Date.now() / 1000),
    photos: meta,
    photoVersion,
    createdAt: (existing?.createdAt as string | undefined) ?? now,
    updatedAt: now,
  };
  await store.setJSON(vehicleKey(slug), record);

  // Clear staged uploads for this slug (used ones, and any abandoned ones).
  const staged = await store.list(`upload:${slug}:`);
  await Promise.all(staged.map((k) => store.delete(k)));

  revalidateInventory(slug);
  return Response.json({ ok: true, slug, photos: meta.length });
}
