import { NextResponse } from "next/server";
import { cities } from "@/data/cities";
import { z } from "zod";
import { apiError } from "@/lib/api";

const cityIdSchema = z.string().regex(/^[a-z0-9-]{2,64}$/);

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!cityIdSchema.safeParse(id).success) return apiError("VALIDATION_FAILED", "El identificador de ciudad no es válido.", 400);
  const found = cities.find((item) => item.id === id);
  return found ? NextResponse.json(found) : NextResponse.json({ error: "Ciudad no encontrada" }, { status: 404 });
}
