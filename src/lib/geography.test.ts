import { describe, expect, it } from "vitest";
import { distancePenalty, haversineKm, samePlace } from "./geography";

describe("geographic matching", () => {
  it("calculates great-circle distance between Buenos Aires and Córdoba", () => {
    expect(haversineKm({ lat: -34.6084, lon: -58.3721 }, { lat: -31.415, lon: -64.1791 })).toBeCloseTo(647, -1);
  });

  it("penalizes only distance beyond the selected tolerance", () => {
    expect(distancePenalty(199, "nearby")).toBe(0);
    expect(distancePenalty(400, "nearby")).toBe(4);
    expect(distancePenalty(1_000, "nearby")).toBe(8);
    expect(distancePenalty(5_000, "anywhere")).toBe(0);
  });

  it("matches current city by GeoRef id or normalized locality and province", () => {
    const city = { georefId: "02014010", name: "Buenos Aires", province: "CABA" };
    expect(samePlace(city, { georefId: "02014010", locality: "Ciudad de Buenos Aires", province: "CABA", provinceId: "02", coordinates: { lat: 0, lon: 0 } })).toBe(true);
    expect(samePlace({ ...city, georefId: "other", name: "Córdoba", province: "Córdoba" }, { georefId: "unknown", locality: "Cordoba", province: "Cordoba", provinceId: "14", coordinates: { lat: 0, lon: 0 } })).toBe(true);
  });
});
