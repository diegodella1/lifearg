import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const connectSources = ["'self'", process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.POSTHOG_HOST, "https://*.sentry.io"].filter(Boolean).join(" ");
const scriptSources = ["'self'", "'unsafe-inline'", process.env.NODE_ENV === "development" ? "'unsafe-eval'" : null].filter(Boolean).join(" ");
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  `connect-src ${connectSources}`,
  "font-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob:",
  "object-src 'none'",
  `script-src ${scriptSources}`,
  "style-src 'self' 'unsafe-inline'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  typedRoutes: true,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "Content-Security-Policy", value: contentSecurityPolicy },
        { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
      ],
    }];
  },
};

export default withSentryConfig(nextConfig, {
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  sourcemaps: { deleteSourcemapsAfterUpload: true },
});
