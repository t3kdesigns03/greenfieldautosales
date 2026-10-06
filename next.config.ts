import type { NextConfig } from "next";

/**
 * CUTOVER NOTE — redirects are NOT active in v1.
 *
 * Inventory stays on Carsforsale (https://www.greenfieldautosales.net) for now.
 * When the owner is ready to point greenfieldautosales.net at this site, add
 * redirects() for the old Carsforsale paths that have links / search history:
 *
 *   /contact                          -> /contact           (same path, keep)
 *   /home                             -> /
 *   /cars-for-sale                    -> /inventory
 *   /pickup-trucks-for-sale-b100030   -> /inventory?type=truck
 *   /suvs-for-sale-b100037            -> /inventory?type=suv
 *   /sedan-for-sale-b100033           -> /inventory?type=car
 *   /minivans-for-sale-b100024        -> /inventory?type=van
 *   /specials                         -> /inventory
 *   /details/used-:year-:rest/:id     -> /inventory   (or map stock IDs to slugs)
 *
 * IMPORTANT: once the domain moves, every carsForSaleUrl in content/inventory.ts
 * that points at www.greenfieldautosales.net/details/... must be updated to
 * wherever the Carsforsale listings live after cutover, or those deep links
 * will loop back here. See README "Cutover".
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Local WebP (public/inventory/...) needs nothing here. These patterns only
    // matter if a vehicle's `images` point at a remote URL (e.g. a future photo
    // sync or a CDN). Safe to leave in place.
    remotePatterns: [
      { protocol: "https", hostname: "*.carsforsale.com" },
    ],
  },
};

export default nextConfig;
