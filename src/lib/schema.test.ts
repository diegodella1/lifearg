import { describe, expect, it } from "vitest";
import { preferenceProfileV2Schema } from "./schema";

describe("PreferenceProfileV2", () => {
  it("keeps currency, hard limits and confirmation explicit", () => {
    const profile = preferenceProfileV2Schema.parse({
      intent: "this_year",
      work: { mode: "remote", internetCriticality: 5 },
      household: { adultsRange: "2", children: "none" },
      budget: { currency: "ARS", monthlyRangeId: "medium", hardLimit: true },
      mobility: { hasCar: "no", avoidCarDependency: 5, airportImportance: 2 },
      preferences: [{ factor: "nature", value: "high", weight: 5, hardConstraint: false, origin: "text", extractionConfidence: 0.72, confirmed: true }],
    });
    expect(profile.budget.currency).toBe("ARS");
    expect(profile.preferences[0].confirmed).toBe(true);
  });
});
