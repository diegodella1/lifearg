import "server-only";

export const anonymousCookie = "life_match_anonymous_id";

export function readCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") ?? "";
  for (const item of cookie.split(";")) {
    const [key, ...parts] = item.trim().split("=");
    if (key === name) return decodeURIComponent(parts.join("="));
  }
  return null;
}

export function actorId(request: Request) {
  const existing = readCookie(request, anonymousCookie);
  return existing && /^[0-9a-f-]{36}$/i.test(existing) ? existing : crypto.randomUUID();
}
