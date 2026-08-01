import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => window.localStorage.setItem("life-match:analytics-consent", "false"));
});

test("landing keeps the editorial atlas hierarchy", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /¿En qué ciudad argentina/i })).toBeVisible();
  await expect(page).toHaveScreenshot("landing.png", { animations: "disabled" });
});

test("quiz and decision table remain visually stable", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /descubrir mi match/i }).click();
  for (const heading of [/¿Qué te trae por acá\?/i, /Imaginá un buen martes/i, /Lo que tiene que cerrar/i, /¿Dónde vivís ahora\?/i]) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await page.getByRole("button", { name: /continuar/i }).click();
  }
  await expect(page.getByRole("heading", { name: /Elegí hasta cuatro prioridades/i })).toBeVisible();
  await page.getByRole("button", { name: /ver mis ciudades/i }).click();
  await expect(page.getByRole("heading", { name: /tu mesa de decisión/i })).toBeVisible();
  await expect(page).toHaveScreenshot("results-shortlist.png", { animations: "disabled" });
  await page.getByRole("heading", { name: /tu mesa de decisión/i }).scrollIntoViewIfNeeded();
  await expect(page).toHaveScreenshot("results-toolkit.png", { animations: "disabled" });
});

for (const route of ["/como-funciona", "/fuentes", "/acerca-de", "/ciudades/mendoza"] as const) {
  test(`${route} keeps the public visual system`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page).toHaveScreenshot(`${route.replaceAll("/", "-").slice(1)}.png`, { animations: "disabled" });
  });
}
