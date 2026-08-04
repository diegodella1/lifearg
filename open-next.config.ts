import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig();

// Next 16 can omit instrumentation.js from standalone output while retaining
// its trace manifest. Repair that output before OpenNext creates the bundle.
config.buildCommand = "npm run build:cloudflare:next";

export default config;
