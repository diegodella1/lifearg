"use client";

import { useState } from "react";
import type { GeoPoint, MatchResult, UserOrigin } from "@/lib/types";

const outline: GeoPoint[] = [
  { lat: -21.8, lon: -66.4 }, { lat: -22.2, lon: -62.7 }, { lat: -25.6, lon: -57.8 }, { lat: -27.5, lon: -55.7 },
  { lat: -30.6, lon: -57.8 }, { lat: -34.6, lon: -58.5 }, { lat: -39.0, lon: -62.0 }, { lat: -42.2, lon: -63.6 },
  { lat: -46.2, lon: -65.7 }, { lat: -50.2, lon: -68.0 }, { lat: -54.9, lon: -67.7 }, { lat: -52.2, lon: -72.3 },
  { lat: -46.0, lon: -71.8 }, { lat: -40.3, lon: -71.7 }, { lat: -36.0, lon: -70.4 }, { lat: -31.0, lon: -69.6 },
  { lat: -26.3, lon: -68.6 }, { lat: -22.1, lon: -67.0 },
];

function project(point: GeoPoint) {
  return { x: 28 + ((point.lon + 73.5) / 20) * 304, y: 18 + ((-21.5 - point.lat) / 34) * 604 };
}

const outlinePath = `${outline.map((point, index) => { const { x, y } = project(point); return `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`; }).join(" ")} Z`;

export function ResultsMap({ results, origin }: { results: MatchResult[]; origin?: UserOrigin }) {
  const [activeId, setActiveId] = useState(results[0]?.city.id ?? "");
  const originPoint = origin ? project(origin.coordinates) : null;
  const active = results.find((result) => result.city.id === activeId) ?? results[0];

  function focusResult(id: string) {
    setActiveId(id);
    document.getElementById(`result-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return <aside className="results-map" aria-labelledby="results-map-title">
    <header><p className="eyebrow">CARTOGRAFÍA PERSONAL</p><h2 id="results-map-title">Tu mapa posible</h2><p>{origin ? `Desde ${origin.locality}, ${origin.province}` : "Cinco puntos para empezar a explorar"}</p></header>
    <svg viewBox="0 0 360 640" role="img" aria-label="Mapa de Argentina con las ciudades recomendadas">
      <path className="map-country" d={outlinePath}/>
      <path className="map-contour" d="M115 155 C190 180 240 165 292 190 M92 285 C170 315 250 292 297 320 M104 425 C170 450 222 442 258 470"/>
      {originPoint && results.map((result) => { const destination = project(result.city.coordinates); return <line className="map-route" key={`route-${result.city.id}`} x1={originPoint.x} y1={originPoint.y} x2={destination.x} y2={destination.y}/>; })}
      {originPoint && <g className="map-origin"><circle cx={originPoint.x} cy={originPoint.y} r="7"/><circle cx={originPoint.x} cy={originPoint.y} r="13"/></g>}
      {results.map((result) => {
        const point = project(result.city.coordinates);
        const activePin = result.city.id === active?.city.id;
        return <g aria-label={`${result.rank}. ${result.city.name}, match ${result.match}`} className={`map-result-pin ${activePin ? "is-active" : ""}`} key={result.city.id} onClick={() => focusResult(result.city.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") focusResult(result.city.id); }} role="button" tabIndex={0} transform={`translate(${point.x} ${point.y})`}>
          <circle r={activePin ? 18 : 14}/><text textAnchor="middle" y="4">{result.rank}</text>
        </g>;
      })}
    </svg>
    {active && <div className="map-caption"><span>0{active.rank}</span><div><b>{active.city.name}</b><small>{active.city.province}{active.distanceKm !== null ? ` · ${active.distanceKm.toLocaleString("es-AR")} km` : ""}</small></div><strong>{active.match}</strong></div>}
    <small className="map-attribution">Ubicaciones: Servicio Georef · trazado ilustrativo</small>
  </aside>;
}
