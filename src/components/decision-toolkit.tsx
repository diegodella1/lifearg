"use client";

import { Calculator, GitCompareArrows, Home, X } from "lucide-react";
import { useState } from "react";
import type { MatchResult } from "@/lib/types";
import { RentalExplorer } from "./rental-explorer";
import { TaxEstimator } from "./tax-estimator";

type Tool = "rentals" | "taxes" | "compare";

export function DecisionToolkit({ results, selectedCityId, onSelectCity, compared, onRemoveComparison }: { results: MatchResult[]; selectedCityId: string; onSelectCity: (id: string) => void; compared: MatchResult[]; onRemoveComparison: (id: string) => void }) {
  const [activeTool, setActiveTool] = useState<Tool>("rentals");
  const tools: Array<{ id: Tool; label: string; icon: typeof Home; badge?: number }> = [
    { id: "rentals", label: "Alquileres", icon: Home },
    { id: "taxes", label: "Impuestos", icon: Calculator },
    { id: "compare", label: "Comparar", icon: GitCompareArrows, badge: compared.length },
  ];

  function handleTabKey(event: React.KeyboardEvent<HTMLButtonElement>, current: Tool) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const index = tools.findIndex((tool) => tool.id === current);
    const nextIndex = event.key === "ArrowRight" ? (index + 1) % tools.length : (index - 1 + tools.length) % tools.length;
    const nextTool = tools[nextIndex].id;
    setActiveTool(nextTool);
    document.getElementById(`tool-tab-${nextTool}`)?.focus();
  }

  return <section className="decision-toolkit" aria-labelledby="decision-title">
    <header className="decision-toolkit__intro"><div><p className="eyebrow">DE LA INTUICIÓN A LA DECISIÓN</p><h2 id="decision-title">Tu mesa de decisión.</h2></div><p>Tomá una ciudad como punto de partida y cruzá vivienda, carga fiscal y diferencias concretas sin perder el hilo del match.</p></header>
    <div aria-label="Herramientas de decisión" className="tool-tabs" role="tablist">{tools.map(({ id, label, icon: Icon, badge }) => <button aria-controls={`tool-panel-${id}`} aria-selected={activeTool === id} className={activeTool === id ? "is-active" : ""} id={`tool-tab-${id}`} key={id} onClick={() => setActiveTool(id)} onKeyDown={(event) => handleTabKey(event, id)} role="tab" tabIndex={activeTool === id ? 0 : -1} type="button"><Icon aria-hidden="true" size={18}/><span>{label}</span>{badge !== undefined && <small>{badge}</small>}</button>)}</div>
    <div aria-labelledby={`tool-tab-${activeTool}`} className="tool-panel" id={`tool-panel-${activeTool}`} role="tabpanel">
      {activeTool === "rentals" && <RentalExplorer onSelectCity={onSelectCity} results={results} selectedCityId={selectedCityId}/>} 
      {activeTool === "taxes" && <TaxEstimator onSelectCity={onSelectCity} results={results} selectedCityId={selectedCityId}/>} 
      {activeTool === "compare" && <ComparePanel onRemove={onRemoveComparison} results={compared}/>} 
    </div>
  </section>;
}

function ComparePanel({ results, onRemove }: { results: MatchResult[]; onRemove: (id: string) => void }) {
  return <section className="compare-tray" aria-labelledby="compare-title"><header><div><span>COMPARADOR</span><h3 id="compare-title">{results.length} de 3 ciudades</h3></div><small>{results.length ? "Elegí otra ciudad desde la shortlist para completar la lectura." : "Usá el botón Comparar de cada resultado para sumar hasta 3 ciudades."}</small></header>{results.length ? <div className="compare-grid">{results.map((result) => <article key={result.city.id}><button aria-label={`Quitar ${result.city.name} de la comparación`} type="button" onClick={() => onRemove(result.city.id)}><X aria-hidden="true" size={16}/></button><h4>{result.city.name}</h4><strong>{result.match}<small>/100</small></strong><p>{result.city.costRange}</p><dl><div><dt>Naturaleza</dt><dd>{result.city.metrics.nature}</dd></div><div><dt>Servicios</dt><dd>{result.city.metrics.services}</dd></div><div><dt>Caminable</dt><dd>{result.city.metrics.walkability}</dd></div></dl></article>)}</div> : <div className="compare-empty"><GitCompareArrows aria-hidden="true" size={28}/><p>Todavía no elegiste ciudades para comparar.</p></div>}</section>;
}
