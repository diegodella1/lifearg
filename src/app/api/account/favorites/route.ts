import { NextResponse } from "next/server";
import { z } from "zod";
import { apiError, mutationOriginError, parseRequest } from "@/lib/api";
import { getServiceSupabase } from "@/lib/server/supabase";
import { currentUser } from "@/lib/server/session-auth";

const favoritesSchema = z.object({ cityIds: z.array(z.string().min(1).max(80)).max(24) });

async function accountContext() {
  return { user: await currentUser(), db: getServiceSupabase() };
}

export async function GET() {
  const { user, db } = await accountContext();
  if (!user) return apiError("FORBIDDEN", "Iniciá sesión para ver tus favoritos.", 401);
  if (!db) return apiError("NOT_CONFIGURED", "La sincronización no está configurada.", 503);
  const { data, error } = await db.from("favorites").select("city_id").eq("account_id", user.id).order("created_at");
  if (error) return apiError("INTERNAL_ERROR", "No pudimos cargar tus favoritos.", 500);
  return NextResponse.json({ cityIds: data.map((item) => item.city_id) }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function PUT(request: Request) {
  const originError = mutationOriginError(request);
  if (originError) return originError;
  const parsed = await parseRequest(request, favoritesSchema);
  if ("response" in parsed) return parsed.response;
  const { user, db } = await accountContext();
  if (!user) return apiError("FORBIDDEN", "Iniciá sesión para sincronizar favoritos.", 401);
  if (!db) return apiError("NOT_CONFIGURED", "La sincronización no está configurada.", 503);
  const { error: deleteError } = await db.from("favorites").delete().eq("account_id", user.id);
  if (deleteError) return apiError("INTERNAL_ERROR", "No pudimos actualizar tus favoritos.", 500);
  if (parsed.data.cityIds.length) {
    const { error } = await db.from("favorites").insert(parsed.data.cityIds.map((cityId) => ({ account_id: user.id, city_id: cityId })));
    if (error) return apiError("INTERNAL_ERROR", "No pudimos actualizar tus favoritos.", 500);
  }
  return NextResponse.json({ cityIds: parsed.data.cityIds });
}
