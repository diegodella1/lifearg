import { NextResponse } from "next/server";
import { runtimeCapabilities } from "@/lib/server/capabilities";

export function GET() {
  return NextResponse.json(runtimeCapabilities(), { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } });
}
