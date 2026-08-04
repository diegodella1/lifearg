import type { City, GeoPoint, RelocationTolerance, UserOrigin } from "./types";

const toleranceKm: Record<RelocationTolerance, number> = {
  nearby: 200,
  regional: 700,
  far: 1_500,
  anywhere: Number.POSITIVE_INFINITY,
};

export function haversineKm(from: GeoPoint, to: GeoPoint) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const earthRadiusKm = 6_371;
  const latDelta = radians(to.lat - from.lat);
  const lonDelta = radians(to.lon - from.lon);
  const a = Math.sin(latDelta / 2) ** 2 + Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(lonDelta / 2) ** 2;
  return Math.round(earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function distancePenalty(distanceKm: number, tolerance: RelocationTolerance) {
  const limit = toleranceKm[tolerance];
  if (!Number.isFinite(limit) || distanceKm <= limit) return 0;
  return Math.min(8, Math.round(((distanceKm - limit) / limit) * 4));
}

function normalized(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").replace(/[^a-z0-9]/g, "");
}

export function samePlace(city: Pick<City, "georefId" | "name" | "province">, origin: UserOrigin) {
  if (city.georefId === origin.georefId) return true;
  return normalized(city.name) === normalized(origin.locality) && normalized(city.province) === normalized(origin.province);
}
