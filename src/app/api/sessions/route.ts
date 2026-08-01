import { NextResponse } from "next/server";
import { z } from "zod";
import { parseRequest } from "@/lib/api";
import { getServiceSupabase } from "@/lib/server/supabase";
import { actorId, anonymousCookie } from "@/lib/server/session";

const sessionSchema = z.object({ intent: z.enum(["exploring", "this_year", "leaving", "comparing"]).default("exploring") }).default({ intent: "exploring" });

export async function POST(request: Request) {
  const parsed = await parseRequest(request, sessionSchema);
  if ("response" in parsed) return parsed.response;
  const anonymousUserId = actorId(request);
  const sessionId = crypto.randomUUID();
  const db = getServiceSupabase();

  if (db) {
    await db.from("anonymous_users").upsert({ id: anonymousUserId, last_seen_at: new Date().toISOString() });
    const { error } = await db.from("search_sessions").insert({ id: sessionId, anonymous_user_id: anonymousUserId, intent: parsed.data?.intent ?? "exploring" });
    if (error) return NextResponse.json({ error: { code: "INTERNAL_ERROR", message: "No pudimos iniciar la sesión. Reintentá." } }, { status: 500 });
  }

  const response = NextResponse.json({ sessionId, persistence: db ? "supabase" : "ephemeral" }, { status: 201 });
  response.cookies.set(anonymousCookie, anonymousUserId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return response;
}
