import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, mutationOriginError, parseRequest, rateLimitError } from "@/lib/api";
import { getServiceSupabase } from "@/lib/server/supabase";
import { actorId, rateLimitActor } from "@/lib/server/session";
import { allowRequest } from "@/lib/server/rate-limit";
import { eventNames } from "@/lib/events";

const propertyValue = z.union([z.string().max(160), z.number().finite(), z.boolean()]);
const batchSchema = z.object({
  sessionId: z.string().uuid().nullable().optional(),
  consentScope: z.literal("analytics"),
  consentPolicyVersion: z.string().min(1).max(40),
  events: z.array(z.object({
    eventId: z.string().min(8).max(80),
    event: z.enum(eventNames),
    occurredAt: z.string().datetime(),
    properties: z.record(z.string().max(60), propertyValue).default({}),
  })).min(1).max(20),
});

export async function POST(request: Request) {
  const originError = mutationOriginError(request);
  if (originError) return originError;
  const actor = actorId(request);
  if (!await allowRequest("API_GENERAL_LIMITER", `events:${await rateLimitActor(request)}`)) return rateLimitError("Demasiados eventos. Reintentá en un minuto.");
  const parsed = await parseRequest(request, batchSchema);
  if ("response" in parsed) return parsed.response;
  const db = getServiceSupabase();
  let persisted = false;
  let analyticsSessionId: string | null = null;
  if (db) {
    await db.from("anonymous_users").upsert({ id: actor, last_seen_at: new Date().toISOString() });
    let ownedSessionId: string | null = null;
    if (parsed.data.sessionId) {
      const { data: ownedSession } = await db.from("search_sessions").select("id").eq("id", parsed.data.sessionId).eq("anonymous_user_id", actor).maybeSingle();
      ownedSessionId = ownedSession?.id ?? null;
      analyticsSessionId = ownedSessionId;
    }
    const rows = parsed.data.events.map((event) => ({
      id: event.eventId,
      anonymous_user_id: actor,
      session_id: ownedSessionId,
      event: event.event,
      occurred_at: event.occurredAt,
      app_version: process.env.NEXT_PUBLIC_APP_VERSION ?? "dev",
      consent_scope: parsed.data.consentScope,
      consent_policy_version: parsed.data.consentPolicyVersion,
      properties: event.properties,
    }));
    const { error } = await db.from("product_events").upsert(rows, { onConflict: "id", ignoreDuplicates: true });
    if (error) return apiError("INTERNAL_ERROR", "No pudimos registrar la medición.", 500);
    persisted = true;
  }
  if (process.env.POSTHOG_API_KEY && process.env.POSTHOG_HOST) {
    await Promise.allSettled(parsed.data.events.map((event) => fetch(new URL("/capture/", process.env.POSTHOG_HOST!), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ api_key: process.env.POSTHOG_API_KEY, event: event.event, properties: { distinct_id: actor, session_id: analyticsSessionId ?? undefined, app_version: process.env.NEXT_PUBLIC_APP_VERSION ?? "dev", consent_policy_version: parsed.data.consentPolicyVersion, ...event.properties } }),
      signal: AbortSignal.timeout(2_000),
    })));
  }
  return NextResponse.json({ accepted: true, persisted, forwarded: Boolean(process.env.POSTHOG_API_KEY && process.env.POSTHOG_HOST) }, { status: 202 });
}
