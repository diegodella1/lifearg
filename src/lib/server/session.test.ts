import { afterEach, describe, expect, it, vi } from "vitest";
import { actorId, anonymousCookie, readCookie } from "./session";

function requestWithCookie(cookie?: string) {
  return new Request("https://lifearg.example", { headers: cookie ? { cookie } : undefined });
}

describe("anonymous sessions", () => {
  afterEach(() => vi.restoreAllMocks());

  it("reads and decodes cookie values", () => {
    const request = requestWithCookie("theme=light; intent=vivir%20cerca%3Dmar");

    expect(readCookie(request, "intent")).toBe("vivir cerca=mar");
    expect(readCookie(request, "missing")).toBeNull();
  });

  it("reuses a valid anonymous actor identifier", () => {
    const id = "123e4567-e89b-12d3-a456-426614174000";

    expect(actorId(requestWithCookie(`${anonymousCookie}=${id}`))).toBe(id);
  });

  it("generates an identifier when cookie is absent or invalid", () => {
    const generated = "00000000-0000-4000-8000-000000000001";
    const randomUUID = vi.spyOn(crypto, "randomUUID").mockReturnValue(generated);

    expect(actorId(requestWithCookie(`${anonymousCookie}=not-a-uuid`))).toBe(generated);
    expect(randomUUID).toHaveBeenCalledOnce();
  });
});
