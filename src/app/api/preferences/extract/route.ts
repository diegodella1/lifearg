import { NextResponse } from "next/server";
import { z } from "zod";
import { extractPreferences } from "@/lib/extract";
import { mutationOriginError, parseRequest, rateLimitError } from "@/lib/api";
import { rateLimitActor } from "@/lib/server/session";
import { allowRequest } from "@/lib/server/rate-limit";

const requestSchema = z.object({ text: z.string().trim().min(3).max(1000), aiConsent: z.literal(true).optional() });

export async function POST(request: Request) {
  const originError = mutationOriginError(request);
  if (originError) return originError;
  if (!await allowRequest("API_EXPENSIVE_LIMITER", `extract:${await rateLimitActor(request)}`)) return rateLimitError("Demasiadas interpretaciones. Reintentá en un minuto.");
  const parsed = await parseRequest(request, requestSchema);
  if ("response" in parsed) return parsed.response;
  return NextResponse.json(await extractPreferences(parsed.data.text, parsed.data.aiConsent === true), { headers: { "Cache-Control": "no-store" } });
}
