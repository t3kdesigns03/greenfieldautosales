import { inventoryStore } from "@/lib/store";
import { isValidSlug } from "@/lib/slug";
import { photoKey } from "@/lib/vehicleRecord";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string; v: string; file: string }> };

/**
 * GET /api/photos/<slug>/<version>/<index>.webp — one vehicle photo from Netlify Blobs.
 * The version segment changes whenever that vehicle's photos change, so each
 * URL can be cached forever.
 */
export async function GET(_req: Request, { params }: Ctx) {
  const { slug, v, file } = await params;
  const m = /^(\d{1,3})\.webp$/.exec(file);
  if (!isValidSlug(slug) || !/^[a-z0-9]{1,40}$/i.test(v) || !m) return new Response("Not found", { status: 404 });

  const data = await inventoryStore().getBytes(photoKey(slug, Number(m[1])));
  if (!data) return new Response("Not found", { status: 404 });

  return new Response(data, {
    headers: {
      "content-type": "image/webp",
      "cache-control": "public, max-age=31536000, immutable",
      "netlify-cdn-cache-control": "public, max-age=31536000, immutable",
    },
  });
}
