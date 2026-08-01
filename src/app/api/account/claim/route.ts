import { NextResponse } from "next/server";
import { apiError, mutationOriginError } from "@/lib/api";
import { anonymousCookie, readCookie } from "@/lib/server/session";
import { getServiceSupabase } from "@/lib/server/supabase";
import { currentUser } from "@/lib/server/session-auth";

export async function POST(request: Request) {
  const originError = mutationOriginError(request);
  if (originError) return originError;
  const [user, anonymousUserId, db] = await Promise.all([currentUser(), Promise.resolve(readCookie(request, anonymousCookie)), Promise.resolve(getServiceSupabase())]);
  if (!user) return apiError("FORBIDDEN", "Iniciá sesión para sincronizar tus resultados.", 401);
  if (!db) return apiError("NOT_CONFIGURED", "La sincronización no está configurada.", 503);
  if (!anonymousUserId) return NextResponse.json({ claimed: 0 });
  const { data, error } = await db.from("search_sessions").update({ account_id: user.id }).eq("anonymous_user_id", anonymousUserId).is("account_id", null).select("id");
  if (error) return apiError("INTERNAL_ERROR", "No pudimos sincronizar tus resultados.", 500);
  return NextResponse.json({ claimed: data?.length ?? 0 });
}
