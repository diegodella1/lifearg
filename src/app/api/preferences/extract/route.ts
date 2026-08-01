import { NextResponse } from "next/server";
import { z } from "zod";
import { extractPreferences } from "@/lib/extract";

const requestSchema = z.object({ text: z.string().trim().min(3).max(1000) });

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Descripción inválida" }, { status: 400 });
  return NextResponse.json(await extractPreferences(parsed.data.text));
}
