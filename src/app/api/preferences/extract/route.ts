import { NextResponse } from "next/server";
import { z } from "zod";
import { extractPreferences } from "@/lib/extract";
import { apiError, parseRequest } from "@/lib/api";
import { actorId } from "@/lib/server/session";
import { allowRequest } from "@/lib/server/rate-limit";

const requestSchema = z.object({ text: z.string().trim().min(3).max(1000) });

export async function POST(request: Request) {
  const actor = actorId(request);
  if (!await allowRequest("API_EXPENSIVE_LIMITER", `extract:${actor}`)) return apiError("RATE_LIMITED", "Demasiadas interpretaciones. Reintentá en un minuto.", 429);
  const parsed = await parseRequest(request, requestSchema);
  if ("response" in parsed) return parsed.response;
  return NextResponse.json(await extractPreferences(parsed.data.text), { headers: { "Cache-Control": "no-store" } });
}
