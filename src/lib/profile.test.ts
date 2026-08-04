import { describe, expect, it } from "vitest";
import { buildProfileFromAnswers } from "@/lib/profile";

describe("buildProfileFromAnswers", () => {
  it("translates quick answers into explicit weights", () => {
    const profile = buildProfileFromAnswers({
      intent: "this_year",
      workMode: "remote",
      budget: "medium",
      household: "couple",
      car: "no",
      lifestyle: ["nature", "walkability", "tranquility"],
      tradeoff: "nature",
    });
    expect(profile.weights.nature).toBe(5);
    expect(profile.weights.walkability).toBe(5);
    expect(profile.weights.culture).toBeLessThan(profile.weights.nature);
  });

  it("makes work mode and car ownership materially affect the profile", () => {
    const hybridWithoutCar = buildProfileFromAnswers({
      intent: "this_year",
      workMode: "hybrid",
      budget: "medium",
      household: "couple",
      car: "no",
      lifestyle: [],
      tradeoff: "balanced",
    });
    const onsiteWithCar = buildProfileFromAnswers({
      intent: "this_year",
      workMode: "onsite",
      budget: "medium",
      household: "couple",
      car: "yes",
      lifestyle: [],
      tradeoff: "balanced",
    });

    expect(hybridWithoutCar.weights.connectivity).toBeGreaterThan(3);
    expect(hybridWithoutCar.weights.walkability).toBe(5);
    expect(onsiteWithCar.weights.mobility).toBe(5);
    expect(onsiteWithCar.weights.connectivity).toBeLessThan(hybridWithoutCar.weights.connectivity);
  });

  it("keeps every extracted factor instead of dropping non-lifestyle signals", () => {
    const profile = buildProfileFromAnswers({
      intent: "exploring",
      workMode: "not_working",
      budget: "flexible",
      household: "solo",
      car: "sometimes",
      lifestyle: ["affordability", "connectivity", "mobility"],
      tradeoff: "balanced",
    });

    expect(profile.weights.affordability).toBe(5);
    expect(profile.weights.connectivity).toBe(5);
    expect(profile.weights.mobility).toBe(5);
  });

  it("applies structured weights extracted from the story", () => {
    const profile = buildProfileFromAnswers({
      intent: "exploring",
      workMode: "not_working",
      budget: "flexible",
      household: "solo",
      car: "sometimes",
      lifestyle: [],
      tradeoff: "balanced",
      extractedWeights: { climate: 5, culture: 4 },
    });

    expect(profile.weights.climate).toBe(5);
    expect(profile.weights.culture).toBe(4);
  });
});
