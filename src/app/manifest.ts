import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Life Match Argentina", short_name: "Life Match", description: "Una shortlist explicable de ciudades argentinas para tu próxima vida.", start_url: "/", display: "standalone", background_color: "#f3efe5", theme_color: "#f3efe5", lang: "es-AR" };
}
