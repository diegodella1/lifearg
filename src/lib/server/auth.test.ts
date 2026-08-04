import { afterEach, describe, expect, it, vi } from "vitest";
import { adminEmailAllowed } from "./auth";

describe("admin access policy", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("denies access when no allowlist is configured", () => {
    vi.stubEnv("ADMIN_EMAIL_ALLOWLIST", "");
    expect(adminEmailAllowed("owner@example.com")).toBe(false);
  });

  it("matches normalized emails from the explicit allowlist", () => {
    vi.stubEnv("ADMIN_EMAIL_ALLOWLIST", "owner@example.com, ops@example.com");
    expect(adminEmailAllowed(" OWNER@example.com ")).toBe(true);
    expect(adminEmailAllowed("visitor@example.com")).toBe(false);
  });
});
