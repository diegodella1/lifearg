import type { MetadataRoute } from "next";
import { cities } from "@/data/cities";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_BASE_URL ?? "https://lifearg.diegodella.ar";
  const publicPages = ["", "/como-funciona", "/fuentes", "/acerca-de", "/metodologia"];
  return [
    ...publicPages.map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: "monthly" as const, priority: path ? 0.7 : 1 })),
    ...cities.map((city) => ({ url: `${baseUrl}/ciudades/${city.id}`, lastModified: new Date(`${city.updatedAt}T00:00:00Z`), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
