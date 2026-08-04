import "server-only";

export type RuntimeCapabilities = {
  accounts: boolean;
  ai: boolean;
  analytics: boolean;
  monitoring: boolean;
};

export function runtimeCapabilities(): RuntimeCapabilities {
  const accounts = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY);
  return {
    accounts,
    ai: Boolean(process.env.OPENAI_API_KEY),
    analytics: Boolean(process.env.POSTHOG_API_KEY && process.env.POSTHOG_HOST),
    monitoring: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),
  };
}
