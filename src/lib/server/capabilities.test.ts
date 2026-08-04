import { afterEach, describe, expect, it, vi } from "vitest";
import { runtimeCapabilities } from "./capabilities";

describe("runtime capabilities", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("keeps optional production promises disabled without complete configuration", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "");
    vi.stubEnv("OPENAI_API_KEY", "");

    expect(runtimeCapabilities()).toEqual({ accounts: false, ai: false, analytics: false, monitoring: false });
  });

  it("enables accounts only when every required Supabase credential exists", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
    vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service");

    expect(runtimeCapabilities().accounts).toBe(true);
  });
});
