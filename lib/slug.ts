/** URL slug helpers. No imports, so client components (admin editor) can use them. */

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Default slug for a vehicle: year-make-model-trim. */
export const vehicleSlug = (v: { year?: number | string; make?: string; model?: string; trim?: string }) =>
  slugify([v.year, v.make, v.model, v.trim].filter((x) => x !== undefined && x !== "").join(" "));

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const isValidSlug = (s: string) => s.length > 0 && s.length <= 80 && SLUG_RE.test(s);
