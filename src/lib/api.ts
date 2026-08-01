import { NextResponse } from "next/server";
import type { ZodType } from "zod";

export type ApiErrorCode = "INVALID_JSON" | "VALIDATION_FAILED" | "FORBIDDEN" | "RATE_LIMITED" | "NOT_CONFIGURED" | "UPSTREAM_UNAVAILABLE" | "INTERNAL_ERROR";

export function apiError(code: ApiErrorCode, message: string, status: number, details?: unknown, headers?: HeadersInit) {
  return NextResponse.json({ error: { code, message, ...(details ? { details } : {}) } }, { status, headers });
}

export function rateLimitError(message: string) {
  return apiError("RATE_LIMITED", message, 429, undefined, { "Retry-After": "60" });
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

export function trustedMutationOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin) return origin === new URL(request.url).origin;
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite) return fetchSite === "same-origin" || fetchSite === "none";
  return process.env.NODE_ENV !== "production";
}

export function mutationOriginError(request: Request) {
  return trustedMutationOrigin(request) ? null : apiError("FORBIDDEN", "Origen de solicitud no permitido.", 403);
}
