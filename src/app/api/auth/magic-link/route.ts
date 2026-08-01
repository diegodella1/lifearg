import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const bodySchema = z.object({ email: z.string().email().max(254) });

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: "Sincronización por email no configurada" }, { status: 503 });
  const supabase = createClient(url, key);
  const origin = new URL(request.url).origin;
  const { error } = await supabase.auth.signInWithOtp({ email: parsed.data.email, options: { emailRedirectTo: origin } });
  if (error) return NextResponse.json({ error: "No pudimos enviar el enlace" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
