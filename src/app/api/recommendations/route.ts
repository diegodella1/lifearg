import { NextResponse } from "next/server";
import { cities, CITY_DATA_SNAPSHOT_ID } from "@/data/cities";
import { MATCHING_ALGORITHM_VERSION, rankCities } from "@/lib/matching";
import { profileSchema } from "@/lib/schema";
import { z } from "zod";
import { mutationOriginError, parseRequest, rateLimitError } from "@/lib/api";
import { actorId, rateLimitActor } from "@/lib/server/session";
import { allowRequest } from "@/lib/server/rate-limit";
import { getServiceSupabase } from "@/lib/server/supabase";

const requestSchema = z.union([
  profileSchema,
  z.object({
    sessionId: z.string().uuid().optional(),
    profile: profileSchema,
    origin: z.object({
      georefId: z.string().min(1).max(80),
      locality: z.string().min(1).max(120),
      province: z.string().min(1).max(120),
      provinceId: z.string().min(1).max(80),
      coordinates: z.object({ lat: z.number().min(-56).max(-21), lon: z.number().min(-74).max(-53) }),
    }).optional(),
    relocationTolerance: z.enum(["nearby", "regional", "far", "anywhere"]).optional(),
  }),
]);

export async function POST(request: Request) {
  const originError = mutationOriginError(request);
  if (originError) return originError;
  const actor = actorId(request);
  if (!await allowRequest("API_EXPENSIVE_LIMITER", `recommend:${await rateLimitActor(request)}`)) return rateLimitError("Generaste muchos mapas. Reintentá en un minuto.");
  const parsed = await parseRequest(request, requestSchema);
  if ("response" in parsed) return parsed.response;
  const profile = "profile" in parsed.data ? parsed.data.profile : parsed.data;
  const suppliedSessionId = "sessionId" in parsed.data ? parsed.data.sessionId ?? null : null;
  const origin = "origin" in parsed.data ? parsed.data.origin : undefined;
  const relocationTolerance = "relocationTolerance" in parsed.data ? parsed.data.relocationTolerance : undefined;
  const runId = crypto.randomUUID();
  const results = rankCities(profile, cities, { origin, tolerance: relocationTolerance });
  const db = getServiceSupabase();
  let persisted = false;

  if (db && suppliedSessionId) {
    const { data: ownedSession } = await db.from("search_sessions").select("id").eq("id", suppliedSessionId).eq("anonymous_user_id", actor).maybeSingle();
    if (ownedSession) {
      const profileSnapshotId = crypto.randomUUID();
      const persistableProfile = { ...profile };
      delete persistableProfile.narrative;
      const { error: profileError } = await db.from("profile_snapshots").insert({ id: profileSnapshotId, session_id: suppliedSessionId, payload: persistableProfile });
      if (!profileError) {
        const confidence = Math.round(results.reduce((sum, result) => sum + result.confidence, 0) / results.length);
        const { error: runError } = await db.from("recommendation_runs").insert({ id: runId, session_id: suppliedSessionId, profile_snapshot_id: profileSnapshotId, data_snapshot_id: CITY_DATA_SNAPSHOT_ID, algorithm_version_id: MATCHING_ALGORITHM_VERSION, confidence });
        if (!runError) {
          const { error: itemsError } = await db.from("recommendation_items").insert(results.map((result) => ({ id: crypto.randomUUID(), run_id: runId, city_id: result.city.id, rank: result.rank, match_score: result.match, confidence: result.confidence, contributions: result.contributions, tradeoffs: result.tradeoffs })));
          if (!itemsError) {
            await db.from("search_sessions").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", suppliedSessionId).eq("anonymous_user_id", actor);
            persisted = true;
          }
        }
      }
    }
  }

  return NextResponse.json({ runId, results, persisted }, { headers: { "Cache-Control": "no-store" } });
}
