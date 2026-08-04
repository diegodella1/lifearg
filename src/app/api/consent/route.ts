import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, mutationOriginError, parseRequest, rateLimitError } from "@/lib/api";
import { allowRequest } from "@/lib/server/rate-limit";
import { actorId, anonymousCookie, rateLimitActor } from "@/lib/server/session";
import { getServiceSupabase } from "@/lib/server/supabase";

const consentSchema = z.object({ purpose: z.literal("analytics"), granted: z.boolean(), policyVersion: z.string().min(1).max(40) });

export async function POST(request: Request) {
  const originError = mutationOriginError(request);
  if (originError) return originError;
  if (!await allowRequest("API_GENERAL_LIMITER", `consent:${await rateLimitActor(request)}`)) return rateLimitError("Demasiados cambios de consentimiento.");
  const parsed = await parseRequest(request, consentSchema);
  if ("response" in parsed) return parsed.response;
  const db = getServiceSupabase();
  if (!db) return NextResponse.json({ recorded: false }, { status: 202 });
  const anonymousUserId = actorId(request);
  await db.from("anonymous_users").upsert({ id: anonymousUserId, last_seen_at: new Date().toISOString() });
  const { error } = await db.from("consent_records").insert({ anonymous_user_id: anonymousUserId, purpose: parsed.data.purpose, granted: parsed.data.granted, policy_version: parsed.data.policyVersion });
  if (error) return apiError("INTERNAL_ERROR", "No pudimos registrar tu preferencia de privacidad.", 500);
  const response = NextResponse.json({ recorded: true }, { status: 201 });
  response.cookies.set(anonymousCookie, anonymousUserId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return response;
}
