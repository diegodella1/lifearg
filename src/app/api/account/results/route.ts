import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { getServiceSupabase } from "@/lib/server/supabase";
import { currentUser } from "@/lib/server/session-auth";

export async function GET() {
  const user = await currentUser();
  const db = getServiceSupabase();
  if (!user) return apiError("FORBIDDEN", "Iniciá sesión para ver tu historial.", 401);
  if (!db) return apiError("NOT_CONFIGURED", "La sincronización no está configurada.", 503);
  const { data, error } = await db.from("search_sessions").select("id,intent,completed_at,recommendation_runs(id,created_at,confidence,recommendation_items(city_id,rank,match_score,confidence))").eq("account_id", user.id).order("created_at", { ascending: false }).limit(10);
  if (error) return apiError("INTERNAL_ERROR", "No pudimos cargar tu historial.", 500);
  return NextResponse.json({ sessions: data }, { headers: { "Cache-Control": "private, no-store" } });
}
