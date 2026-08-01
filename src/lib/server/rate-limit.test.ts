import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getCloudflareContext: vi.fn() }));

vi.mock("@opennextjs/cloudflare", () => ({ getCloudflareContext: mocks.getCloudflareContext }));

import { allowRequest } from "./rate-limit";

describe("Cloudflare rate limiting", () => {
  beforeEach(() => mocks.getCloudflareContext.mockReset());

  it("returns the configured limiter decision", async () => {
    const limit = vi.fn().mockResolvedValue({ success: false });
    mocks.getCloudflareContext.mockReturnValue({ env: { API_GENERAL_LIMITER: { limit } } });

    await expect(allowRequest("API_GENERAL_LIMITER", "events:actor-1")).resolves.toBe(false);
    expect(limit).toHaveBeenCalledWith({ key: "events:actor-1" });
  });

  it("allows requests when the binding is unavailable", async () => {
    mocks.getCloudflareContext.mockReturnValue({ env: {} });

    await expect(allowRequest("API_AUTH_LIMITER", "auth:actor-1")).resolves.toBe(true);
  });

  it("fails open outside the Cloudflare runtime", async () => {
    mocks.getCloudflareContext.mockReturnValue({});

    await expect(allowRequest("API_EXPENSIVE_LIMITER", "match:actor-1")).resolves.toBe(true);
  });
});
