import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, parseRequest } from "@/lib/api";
import { normalizeGeorefLocations } from "@/lib/locations";
import { allowRequest } from "@/lib/server/rate-limit";
import { actorId } from "@/lib/server/session";

const searchSchema = z.object({ query: z.string().trim().min(3).max(80) });

export async function POST(request: Request) {
  const actor = actorId(request);
  if (!await allowRequest("API_GENERAL_LIMITER", `locations:${actor}`)) return apiError("RATE_LIMITED", "Hiciste demasiadas búsquedas. Reintentá en un minuto.", 429);
  const parsed = await parseRequest(request, searchSchema);
  if ("response" in parsed) return parsed.response;

  const url = new URL("https://apis.datos.gob.ar/georef/api/localidades");
  url.search = new URLSearchParams({ nombre: parsed.data.query, max: "8", campos: "id,nombre,provincia,centroide" }).toString();
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(2_500), cache: "no-store" });
    if (!response.ok) throw new Error(`GeoRef ${response.status}`);
    const locations = normalizeGeorefLocations(await response.json());
    return NextResponse.json({ locations, attribution: "Servicio Georef – argentina.gob.ar/georef" }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return apiError("UPSTREAM_UNAVAILABLE", "No pudimos buscar localidades ahora. Podés saltear este paso.", 503);
  }
}
