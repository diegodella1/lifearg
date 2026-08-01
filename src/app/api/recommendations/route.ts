import { NextResponse } from "next/server";
import { cities } from "@/data/cities";
import { rankCities } from "@/lib/matching";
import { profileSchema } from "@/lib/schema";
import { z } from "zod";
import { apiError, parseRequest } from "@/lib/api";
import { actorId } from "@/lib/server/session";
import { allowRequest } from "@/lib/server/rate-limit";
import { getServiceSupabase } from "@/lib/server/supabase";

const requestSchema = z.union([
  profileSchema,
  z.object({ sessionId: z.string().uuid(), profile: profileSchema }),
]);

export async function POST(request: Request) {
  const actor = actorId(request);
  if (!await allowRequest("API_EXPENSIVE_LIMITER", `recommend:${actor}`)) return apiError("RATE_LIMITED", "Generaste muchos mapas. Reintentá en un minuto.", 429);
  const parsed = await parseRequest(request, requestSchema);
  if ("response" in parsed) return parsed.response;
  const profile = "profile" in parsed.data ? parsed.data.profile : parsed.data;
  const suppliedSessionId = "sessionId" in parsed.data ? parsed.data.sessionId : null;
  const runId = crypto.randomUUID();
  const results = rankCities(profile, cities);
  const db = getServiceSupabase();

  if (db && suppliedSessionId) {
    const profileSnapshotId = crypto.randomUUID();
    const { error: profileError } = await db.from("profile_snapshots").insert({ id: profileSnapshotId, session_id: suppliedSessionId, payload: profile });
    if (!profileError) {
      const confidence = Math.round(results.reduce((sum, result) => sum + result.confidence, 0) / results.length);
      const { error: runError } = await db.from("recommendation_runs").insert({ id: runId, session_id: suppliedSessionId, profile_snapshot_id: profileSnapshotId, data_snapshot_id: "ar-24-2026-08", algorithm_version_id: "rules-v1.1.0", confidence });
      if (!runError) {
        await db.from("recommendation_items").insert(results.map((result) => ({ id: crypto.randomUUID(), run_id: runId, city_id: result.city.id, rank: result.rank, match_score: result.match, confidence: result.confidence, contributions: result.contributions, tradeoffs: result.tradeoffs })));
        await db.from("search_sessions").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", suppliedSessionId).eq("anonymous_user_id", actor);
      }
    }
  }

  return NextResponse.json({ runId, results, persisted: Boolean(db && suppliedSessionId) }, { headers: { "Cache-Control": "no-store" } });
}
