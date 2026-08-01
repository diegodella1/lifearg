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
});
