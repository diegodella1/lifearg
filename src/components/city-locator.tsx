import { argentinaOutlinePath, projectArgentinaPoint } from "@/lib/map-projection";
import type { City } from "@/lib/types";

const coordinateFormatter = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

export function CityLocator({ city }: { city: City }) {
  const point = projectArgentinaPoint(city.coordinates);
  return <div className="city-locator"><svg aria-label={`Ubicación de ${city.name} en Argentina`} role="img" viewBox="0 0 360 640"><path className="city-locator__country" d={argentinaOutlinePath}/><path className="city-locator__contour" d="M115 155 C190 180 240 165 292 190 M92 285 C170 315 250 292 297 320 M104 425 C170 450 222 442 258 470"/><line className="city-locator__axis" x1="28" x2="332" y1={point.y} y2={point.y}/><line className="city-locator__axis" x1={point.x} x2={point.x} y1="18" y2="622"/><circle className="city-locator__pulse" cx={point.x} cy={point.y} r="16"/><circle className="city-locator__pin" cx={point.x} cy={point.y} r="7"/></svg><div><span>COORDENADAS</span><b>{coordinateFormatter.format(city.coordinates.lat)} · {coordinateFormatter.format(city.coordinates.lon)}</b><small>{city.region} · Argentina</small></div></div>;
}
