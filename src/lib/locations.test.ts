import { describe, expect, it } from "vitest";
import { normalizeGeorefLocations } from "./locations";

describe("GeoRef locations", () => {
  it("normalizes valid localities and discards incomplete rows", () => {
    expect(normalizeGeorefLocations({ localidades: [
      { id: "1", nombre: "Posadas", provincia: { id: "54", nombre: "Misiones" }, centroide: { lat: -27.36, lon: -55.89 } },
      { id: "2", nombre: "Incomplete" },
    ] })).toEqual([{ georefId: "1", locality: "Posadas", province: "Misiones", provinceId: "54", coordinates: { lat: -27.36, lon: -55.89 } }]);
  });
});
