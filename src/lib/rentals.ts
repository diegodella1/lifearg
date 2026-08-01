import type { RentalPreferences } from "./types";

type RentalCity = { id: string; name: string; province: string };
export type RentalLink = { provider: "Mercado Libre" | "Zonaprop" | "Airbnb"; url: string; note: string };

function slug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function buildRentalLinks(city: RentalCity, preferences: RentalPreferences): RentalLink[] {
  const place = `${city.name} ${city.province}`;
  const housing = preferences.propertyType === "apartment" ? "departamento" : preferences.propertyType === "house" ? "casa" : "inmueble";
  const query = encodeURIComponent(`${housing} alquiler ${place}`);
  const citySlug = slug(`${city.name}-${city.province}`);
  return [
    { provider: "Mercado Libre", url: `https://listado.mercadolibre.com.ar/inmuebles/alquiler/${query}`, note: "Alquiler permanente y temporal" },
    { provider: "Zonaprop", url: `https://www.zonaprop.com.ar/inmuebles-alquiler-${citySlug}.html`, note: "Oferta inmobiliaria permanente" },
    { provider: "Airbnb", url: `https://www.airbnb.com.ar/s/${encodeURIComponent(`${city.name}, Argentina`)}/homes`, note: "Estadías para probar la ciudad" },
  ];
}

export function rentalAdjustment(input: { medianMonthlyPrice: number; maxMonthlyRent: number; sampleSize: number }) {
  if (input.sampleSize < 5 || input.maxMonthlyRent <= 0) return 0;
  const priceFit = input.medianMonthlyPrice <= input.maxMonthlyRent
    ? 100
    : Math.max(0, 100 - ((input.medianMonthlyPrice - input.maxMonthlyRent) / input.maxMonthlyRent) * 100);
  const confidence = Math.min(1, input.sampleSize / 20);
  return Math.max(-5, Math.min(5, Math.round(((priceFit - 50) / 10) * confidence)));
}
