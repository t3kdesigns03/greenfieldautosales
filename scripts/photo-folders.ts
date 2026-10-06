/**
 * npm run photos:folders — makes an empty public/inventory/<slug>/raw/ folder
 * for every live vehicle in content/vehicles, so you know where to drop its
 * photos for `npm run photos`.
 *
 * Vehicles added in /admin don't need this: their photos are uploaded there
 * and stored in Netlify Blobs.
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { inventory } from "../content/inventory";
import { photos } from "../content/photos.generated";
import { defaultSlug } from "../lib/inventory";

for (const v of inventory.filter((x) => x.status !== "sold")) {
  const slug = defaultSlug(v);
  const dir = path.join(process.cwd(), "public", "inventory", slug, "raw");
  mkdirSync(dir, { recursive: true });
  const keep = path.join(dir, ".gitkeep");
  if (!existsSync(keep)) writeFileSync(keep, "");
  const n = photos[slug]?.length ?? 0;
  console.log(`  public/inventory/${slug}/raw/  ${n ? `(${n} photos live)` : "(no photos yet)"}`);
}
