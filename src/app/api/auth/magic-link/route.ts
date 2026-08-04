import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { apiError, mutationOriginError, parseRequest, rateLimitError } from "@/lib/api";
import { rateLimitActor } from "@/lib/server/session";
import { allowRequest } from "@/lib/server/rate-limit";

const bodySchema = z.object({ email: z.string().email().max(254) });

export async function POST(request: Request) {
  const originError = mutationOriginError(request);
  if (originError) return originError;
  if (!await allowRequest("API_AUTH_LIMITER", `magic-link:${await rateLimitActor(request)}`)) return rateLimitError("Pediste demasiados enlaces. Esperá un minuto.");
  const parsed = await parseRequest(request, bodySchema);
  if ("response" in parsed) return parsed.response;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return apiError("NOT_CONFIGURED", "Sincronización por email todavía no está disponible.", 503);
  const supabase = createClient(url, key);
  const origin = process.env.APP_BASE_URL ?? new URL(request.url).origin;
  const { error } = await supabase.auth.signInWithOtp({ email: parsed.data.email, options: { emailRedirectTo: new URL("/auth/callback", origin).toString() } });
  if (error) return apiError("INTERNAL_ERROR", "No pudimos enviar el enlace. Revisá el email o reintentá.", 502);
  return NextResponse.json({ ok: true });
}
