import type { GeoPoint } from "./types";

const ARGENTINA_OUTLINE: GeoPoint[] = [
  { lat: -21.8, lon: -66.4 }, { lat: -22.2, lon: -62.7 }, { lat: -25.6, lon: -57.8 }, { lat: -27.5, lon: -55.7 },
  { lat: -30.6, lon: -57.8 }, { lat: -34.6, lon: -58.5 }, { lat: -39.0, lon: -62.0 }, { lat: -42.2, lon: -63.6 },
  { lat: -46.2, lon: -65.7 }, { lat: -50.2, lon: -68.0 }, { lat: -54.9, lon: -67.7 }, { lat: -52.2, lon: -72.3 },
  { lat: -46.0, lon: -71.8 }, { lat: -40.3, lon: -71.7 }, { lat: -36.0, lon: -70.4 }, { lat: -31.0, lon: -69.6 },
  { lat: -26.3, lon: -68.6 }, { lat: -22.1, lon: -67.0 },
];

export function projectArgentinaPoint(point: GeoPoint) {
  return { x: 28 + ((point.lon + 73.5) / 20) * 304, y: 18 + ((-21.5 - point.lat) / 34) * 604 };
}

export const argentinaOutlinePath = `${ARGENTINA_OUTLINE.map((point, index) => {
  const { x, y } = projectArgentinaPoint(point);
  return `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
}).join(" ")} Z`;
