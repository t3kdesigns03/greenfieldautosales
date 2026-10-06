import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/**
 * Search visibility is OFF by default. This is a pre-launch build, so it must
 * not show up in Google until it's really live. To allow indexing (at cutover),
 * set NEXT_PUBLIC_ALLOW_INDEXING="true" in Netlify's environment variables.
 */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
