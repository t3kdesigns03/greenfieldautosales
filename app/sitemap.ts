import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { liveVehicles } from "@/lib/inventory";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/inventory", "/trade", "/about", "/contact", "/financing"].map((p) => ({
    url: `${site.url}${p}`,
    changeFrequency: (p === "/inventory" || p === "" ? "daily" : "monthly") as "daily" | "monthly",
    priority: p === "" ? 1 : p === "/inventory" ? 0.9 : 0.6,
  }));
  const cars = liveVehicles().map((v) => ({
    url: `${site.url}/inventory/${v.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [...pages, ...cars];
}
