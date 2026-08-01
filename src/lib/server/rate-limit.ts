import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type RateLimitBinding = { limit(input: { key: string }): Promise<{ success: boolean }> };
type RateLimitName = "API_GENERAL_LIMITER" | "API_EXPENSIVE_LIMITER" | "API_AUTH_LIMITER";

export async function allowRequest(bindingName: RateLimitName, key: string) {
  try {
    const { env } = getCloudflareContext() as unknown as { env: Record<RateLimitName, RateLimitBinding | undefined> };
    const binding = env[bindingName];
    return binding ? (await binding.limit({ key })).success : true;
  } catch {
    return true;
  }
}
