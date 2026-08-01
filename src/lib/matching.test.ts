import { describe, expect, it } from "vitest";
import { cities } from "@/data/cities";
import { rankCities } from "@/lib/matching";
import type { UserProfile } from "@/lib/types";

const getProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  intent: "exploring",
  workMode: "remote",
  budget: "medium",
  household: "couple",
  car: "sometimes",
  weights: {
    affordability: 4,
    connectivity: 5,
    climate: 3,
    services: 3,
    mobility: 2,
    nature: 5,
    culture: 2,
    walkability: 3,
    tranquility: 4,
  },
  ...overrides,
});

describe("rankCities", () => {
  it("is deterministic and returns five ranked cities", () => {
    const first = rankCities(getProfile(), cities);
    const second = rankCities(getProfile(), cities);
    expect(first).toEqual(second);
    expect(first).toHaveLength(5);
    expect(first.map((item) => item.match)).toEqual(
      [...first].map((item) => item.match).sort((a, b) => b - a),
    );
  });

  it("moves affordable cities up for a low budget profile", () => {
    const results = rankCities(getProfile({ budget: "low" }), cities);
    expect(results[0].city.metrics.affordability).toBeGreaterThanOrEqual(70);
  });

  it("returns grounded reasons and trade-offs", () => {
    const [result] = rankCities(getProfile(), cities);
    expect(result.reasons).toHaveLength(3);
    expect(result.tradeoffs.length).toBeGreaterThanOrEqual(1);
    expect(result.contributions.every((item) => item.factor in result.city.metrics)).toBe(true);
  });

  it("reports low confidence when city data has weak coverage", () => {
    const weakCity = {
      ...cities[0],
      confidence: { ...cities[0].confidence, coverage: 20 },
    };
    const [result] = rankCities(getProfile(), [weakCity]);
    expect(result.confidenceLabel).toBe("baja");
  });
});
