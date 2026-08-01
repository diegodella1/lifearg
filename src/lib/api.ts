import { NextResponse } from "next/server";
import type { ZodType } from "zod";

export type ApiErrorCode = "INVALID_JSON" | "VALIDATION_FAILED" | "RATE_LIMITED" | "NOT_CONFIGURED" | "INTERNAL_ERROR";

export function apiError(code: ApiErrorCode, message: string, status: number, details?: unknown) {
  return NextResponse.json({ error: { code, message, ...(details ? { details } : {}) } }, { status });
}

export async function parseRequest<T>(request: Request, schema: ZodType<T>) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { response: apiError("INVALID_JSON", "El cuerpo debe ser JSON válido.", 400) } as const;
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return { response: apiError("VALIDATION_FAILED", "Revisá los datos enviados.", 400, parsed.error.flatten()) } as const;
  }
  return { data: parsed.data } as const;
}
