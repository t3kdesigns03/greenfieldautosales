import { randomUUID } from "node:crypto";
import { guardAdminRequest } from "@/lib/adminAuth";
import { inventoryStore } from "@/lib/store";
import { isValidSlug } from "@/lib/slug";
import { MAX_PHOTO_BYTES, uploadKey } from "@/lib/vehicleRecord";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/uploads?slug=<slug>   body: one WebP image (already resized in the browser)
 *
 * Photos go up one at a time (a Netlify function request is capped at a few MB)
 * into a staging key, upload:<slug>:<id>. Saving the vehicle then moves them to
 * photo:<slug>:<index> in the final order and removes the staged copies.
 */
export async function POST(req: Request) {
  const denied = await guardAdminRequest(req);
  if (denied) return denied;

  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  if (!isValidSlug(slug)) return Response.json({ ok: false, error: "Bad slug." }, { status: 400 });

  const buf = await req.arrayBuffer();
  if (buf.byteLength === 0 || buf.byteLength > MAX_PHOTO_BYTES) {
    return Response.json({ ok: false, error: "Each photo must be under 4 MB after resizing." }, { status: 413 });
  }
  const head = new Uint8Array(buf, 0, 12);
  const tag = (a: number, b: number) => String.fromCharCode(...head.slice(a, b));
  if (tag(0, 4) !== "RIFF" || tag(8, 12) !== "WEBP") {
    return Response.json({ ok: false, error: "Photos must be WebP (the page converts them for you)." }, { status: 415 });
  }

  const id = randomUUID();
  await inventoryStore().setBytes(uploadKey(slug, id), buf);
  return Response.json({ ok: true, id });
}
