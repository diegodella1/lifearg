import { NextResponse } from "next/server";
import { cities } from "@/data/cities";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const found = cities.find((item) => item.id === id);
  return found ? NextResponse.json(found) : NextResponse.json({ error: "Ciudad no encontrada" }, { status: 404 });
}
