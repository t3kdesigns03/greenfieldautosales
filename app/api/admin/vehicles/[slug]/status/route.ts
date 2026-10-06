import { guardAdminRequest } from "@/lib/adminAuth";
import { contentVehicles } from "@/lib/inventoryData";
import { revalidateInventory } from "@/lib/revalidateInventory";
import { inventoryStore } from "@/lib/store";
import { isValidSlug } from "@/lib/slug";
import { STATUSES, vehicleKey, type VehicleRecord } from "@/lib/vehicleRecord";
import type { VehicleStatus } from "@/content/types";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

/**
 * POST /api/admin/vehicles/<slug>/status  { status: "available" | "pending" | "sold" }
 * Used by "Mark sold" on the admin list. A content/vehicles car gets a Blobs
 * record (copied from its file) so the change sticks without a redeploy.
 */
export async function POST(req: Request, { params }: Ctx) {
  const denied = await guardAdminRequest(req);
  if (denied) return denied;

  const { slug } = await params;
  if (!isValidSlug(slug)) return Response.json({ ok: false, error: "Bad slug." }, { status: 400 });

  let status: VehicleStatus;
  try {
    status = ((await req.json()) as { status: VehicleStatus }).status;
  } catch {
    return Response.json({ ok: false, error: "Bad request." }, { status: 400 });
  }
  if (!STATUSES.includes(status)) return Response.json({ ok: false, error: "Bad status." }, { status: 422 });

  const store = inventoryStore();
  const now = new Date().toISOString();
  const existing = await store.getJSON<VehicleRecord>(vehicleKey(slug));
  let record: VehicleRecord;
  if (existing) {
    record = { ...existing, status, updatedAt: now };
  } else {
    const fromContent = contentVehicles().find((v) => v.slug === slug);
    if (!fromContent) return Response.json({ ok: false, error: "Not found." }, { status: 404 });
    const { images: _images, ...v } = fromContent;
    record = { ...v, status, photos: [], photoVersion: "0", createdAt: now, updatedAt: now };
  }
  await store.setJSON(vehicleKey(slug), record);
  revalidateInventory(slug);
  return Response.json({ ok: true, slug, status });
}
