import { NextResponse } from "next/server";
import { cities } from "@/data/cities";
import { rankCities } from "@/lib/matching";
import { profileSchema } from "@/lib/schema";

export async function POST(request: Request) {
  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Perfil inválido", details: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json({
    runId: crypto.randomUUID(),
    results: rankCities(parsed.data, cities),
  });
}
