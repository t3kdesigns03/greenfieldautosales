/**
 * npm run photos:folders — makes an empty public/inventory/<slug>/raw/ folder
 * for every live vehicle, so you know exactly where to drop its photos.
 */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { liveVehicles } from "../lib/inventory";

for (const v of liveVehicles()) {
  const dir = path.join(process.cwd(), "public", "inventory", v.slug, "raw");
  mkdirSync(dir, { recursive: true });
  const keep = path.join(dir, ".gitkeep");
  if (!existsSync(keep)) writeFileSync(keep, "");
  console.log(`  public/inventory/${v.slug}/raw/  ${v.images.length ? `(${v.images.length} photos live)` : "(no photos yet)"}`);
}
