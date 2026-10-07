/**
 * Writes app/icon.svg (the browser-tab favicon) from the same art as the site
 * badge, so it never drifts from the logo. Run: npx tsx scripts/brand/write-icon.ts
 */
import { writeFileSync } from "node:fs";
import { iconSvg } from "../../components/brand/brandSvg";

writeFileSync("app/icon.svg", iconSvg() + "\n");
console.log("wrote app/icon.svg");
