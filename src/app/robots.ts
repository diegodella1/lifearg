import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.APP_BASE_URL ?? "https://lifearg.diegodella.ar";
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/auth/"] }, sitemap: `${baseUrl}/sitemap.xml`, host: baseUrl };
}
