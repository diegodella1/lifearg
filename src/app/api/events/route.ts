import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, parseRequest } from "@/lib/api";
import { getServiceSupabase } from "@/lib/server/supabase";
import { actorId } from "@/lib/server/session";
import { allowRequest } from "@/lib/server/rate-limit";
import { eventNames } from "@/lib/events";

const propertyValue = z.union([z.string().max(160), z.number().finite(), z.boolean()]);
const batchSchema = z.object({
  sessionId: z.string().uuid().nullable().optional(),
  consentScope: z.literal("analytics"),
  events: z.array(z.object({
    eventId: z.string().min(8).max(80),
    event: z.enum(eventNames),
    occurredAt: z.string().datetime(),
    properties: z.record(z.string().max(60), propertyValue).default({}),
  })).min(1).max(20),
});

export async function POST(request: Request) {
  const actor = actorId(request);
  if (!await allowRequest("API_GENERAL_LIMITER", `events:${actor}`)) return apiError("RATE_LIMITED", "Demasiados eventos. Reintentá en un minuto.", 429);
  const parsed = await parseRequest(request, batchSchema);
  if ("response" in parsed) return parsed.response;
  const db = getServiceSupabase();
  if (!db) return NextResponse.json({ accepted: true, persisted: false }, { status: 202 });

  await db.from("anonymous_users").upsert({ id: actor, last_seen_at: new Date().toISOString() });
  const rows = parsed.data.events.map((event) => ({
    id: event.eventId,
    anonymous_user_id: actor,
    session_id: parsed.data.sessionId ?? null,
    event: event.event,
    occurred_at: event.occurredAt,
    app_version: process.env.NEXT_PUBLIC_APP_VERSION ?? "dev",
    consent_scope: parsed.data.consentScope,
    properties: event.properties,
  }));
  const { error } = await db.from("product_events").upsert(rows, { onConflict: "id", ignoreDuplicates: true });
  if (error) return apiError("INTERNAL_ERROR", "No pudimos registrar la medición.", 500);
  return NextResponse.json({ accepted: true, persisted: true }, { status: 202 });
}
