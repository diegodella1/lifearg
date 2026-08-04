"use client";
import { argentinaOutlinePath, projectArgentinaPoint } from "@/lib/map-projection";
import type { MatchResult, UserOrigin } from "@/lib/types";

export function ResultsMap({ results, origin, selectedCityId, onSelectCity }: { results: MatchResult[]; origin?: UserOrigin; selectedCityId: string; onSelectCity: (id: string) => void }) {
  const originPoint = origin ? projectArgentinaPoint(origin.coordinates) : null;
  const active = results.find((result) => result.city.id === selectedCityId) ?? results[0];

  function focusResult(id: string) {
    onSelectCity(id);
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    document.getElementById(`result-${id}`)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }

  return <aside className="results-map" aria-labelledby="results-map-title">
    <header><p className="eyebrow">CARTOGRAFÍA PERSONAL</p><h2 id="results-map-title">Tu mapa posible</h2><p>{origin ? `Desde ${origin.locality}, ${origin.province}` : "Cinco puntos para empezar a explorar"}</p></header>
    <svg viewBox="0 0 360 640" role="group" aria-label="Mapa de Argentina con las ciudades recomendadas">
      <path className="map-country" d={argentinaOutlinePath}/>
      <path className="map-contour" d="M115 155 C190 180 240 165 292 190 M92 285 C170 315 250 292 297 320 M104 425 C170 450 222 442 258 470"/>
      {originPoint && results.map((result) => { const destination = projectArgentinaPoint(result.city.coordinates); return <line className="map-route" key={`route-${result.city.id}`} x1={originPoint.x} y1={originPoint.y} x2={destination.x} y2={destination.y}/>; })}
      {originPoint && <g className="map-origin"><circle cx={originPoint.x} cy={originPoint.y} r="7"/><circle cx={originPoint.x} cy={originPoint.y} r="13"/></g>}
      {results.map((result) => {
        const point = projectArgentinaPoint(result.city.coordinates);
        const activePin = result.city.id === active?.city.id;
        return <g aria-label={`${result.rank}. ${result.city.name}, match ${result.match}`} aria-pressed={activePin} className={`map-result-pin ${activePin ? "is-active" : ""}`} key={result.city.id} onClick={() => focusResult(result.city.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); focusResult(result.city.id); } }} role="button" tabIndex={0} transform={`translate(${point.x} ${point.y})`}>
          <circle r={activePin ? 18 : 14}/><text textAnchor="middle" y="4">{result.rank}</text>
        </g>;
      })}
    </svg>
    {active && <div className="map-caption"><span>0{active.rank}</span><div><b>{active.city.name}</b><small>{active.city.province}{active.distanceKm !== null ? ` · ${active.distanceKm.toLocaleString("es-AR")} km` : ""}</small></div><strong>{active.match}</strong></div>}
    <small className="map-attribution">Ubicaciones: Servicio Georef · trazado ilustrativo</small>
  </aside>;
}
