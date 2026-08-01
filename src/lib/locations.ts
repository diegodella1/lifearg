import type { UserOrigin } from "./types";

type GeorefResponse = {
  localidades?: Array<{
    id?: unknown;
    nombre?: unknown;
    provincia?: { id?: unknown; nombre?: unknown };
    centroide?: { lat?: unknown; lon?: unknown };
  }>;
};

export function normalizeGeorefLocations(input: unknown): UserOrigin[] {
  const rows = (input as GeorefResponse | null)?.localidades;
  if (!Array.isArray(rows)) return [];
  return rows.flatMap((row) => {
    const valid = typeof row.id === "string" && typeof row.nombre === "string" && typeof row.provincia?.id === "string" && typeof row.provincia.nombre === "string" && typeof row.centroide?.lat === "number" && typeof row.centroide.lon === "number";
    return valid ? [{ georefId: row.id as string, locality: row.nombre as string, province: row.provincia!.nombre as string, provinceId: row.provincia!.id as string, coordinates: { lat: row.centroide!.lat as number, lon: row.centroide!.lon as number } }] : [];
  });
}
