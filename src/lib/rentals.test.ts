import { describe, expect, it } from "vitest";
import { buildRentalLinks, rentalAdjustment } from "./rentals";

describe("rental exploration", () => {
  it("builds provider links for a selected city and filters", () => {
    const links = buildRentalLinks({ id: "mar-del-plata", name: "Mar del Plata", province: "Buenos Aires" }, {
      mode: "both", propertyType: "apartment", bedrooms: "2", currency: "USD", maxMonthlyRent: 900,
    });
    expect(links.map((link) => link.provider)).toEqual(["Mercado Libre", "Zonaprop", "Airbnb"]);
    expect(links.every((link) => link.url.startsWith("https://"))).toBe(true);
  });

  it("uses a bounded, confidence-weighted rental adjustment", () => {
    expect(rentalAdjustment({ medianMonthlyPrice: 500, maxMonthlyRent: 700, sampleSize: 20 })).toBe(5);
    expect(rentalAdjustment({ medianMonthlyPrice: 1_400, maxMonthlyRent: 700, sampleSize: 20 })).toBe(-5);
    expect(rentalAdjustment({ medianMonthlyPrice: 500, maxMonthlyRent: 700, sampleSize: 4 })).toBe(0);
  });
});
