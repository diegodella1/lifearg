import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "line",
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",
  use: {
    baseURL: "http://127.0.0.1:3465",
    browserName: "chromium",
    launchOptions: { executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] },
    colorScheme: "light",
    locale: "es-AR",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3465",
    url: "http://127.0.0.1:3465",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
