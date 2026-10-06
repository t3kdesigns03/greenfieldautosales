import { revalidatePath } from "next/cache";

/** After an /admin write: rebuild every page that shows inventory. */
export function revalidateInventory(slug?: string) {
  revalidatePath("/");
  revalidatePath("/inventory");
  if (slug) revalidatePath(`/inventory/${slug}`);
  revalidatePath("/sitemap.xml");
}
