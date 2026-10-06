import type { NextConfig } from "next";

/**
 * CUTOVER NOTE — redirects are NOT active in v1.
 *
 * Inventory stays on Carsforsale (https://www.greenfieldautosales.net) for now.
 * When Luke is ready to point greenfieldautosales.net at this site, add
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
};

export default nextConfig;
