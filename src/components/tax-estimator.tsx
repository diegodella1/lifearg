"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, CircleAlert } from "lucide-react";
import { estimatePersonalTaxes, type TaxStatus } from "@/lib/taxes";
import type { MatchResult } from "@/lib/types";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export function TaxEstimator({ results, selectedCityId, onSelectCity }: { results: MatchResult[]; selectedCityId: string; onSelectCity: (id: string) => void }) {
  const [status, setStatus] = useState<TaxStatus>("employee");
  const [monthlyGross, setMonthlyGross] = useState<number | undefined>();
  const city = results.find((result) => result.city.id === selectedCityId)?.city ?? results[0]?.city;
  const estimate = useMemo(() => monthlyGross === undefined ? null : estimatePersonalTaxes({ status, monthlyGross }), [monthlyGross, status]);

  if (!city) return null;
  return <section className="tax-estimator" aria-labelledby="tax-title">
    <div className="tax-intro"><p className="eyebrow">CUÁNTO QUEDA EN MANO</p><h2 id="tax-title">Impuestos y aportes, sin falsa precisión.</h2><p>Estimación personal nacional con valores vigentes. Elegir ciudad identifica la jurisdicción, pero no inventa una alícuota provincial sin conocer tu actividad.</p></div>
    <div className="tax-layout">
      <div className="tax-controls">
        <label><span>Ciudad evaluada</span><select autoComplete="off" name="tax_city" value={city.id} onChange={(event) => onSelectCity(event.target.value)}>{results.map((result) => <option key={result.city.id} value={result.city.id}>{result.city.name}, {result.city.province}</option>)}</select></label>
        <label><span>Situación</span><select autoComplete="off" name="tax_status" value={status} onChange={(event) => setStatus(event.target.value as TaxStatus)}><option value="employee">Empleado/a en relación de dependencia</option><option value="monotributo_services">Monotributista de servicios</option><option value="no_work_income">Sin ingreso laboral</option></select></label>
        {status !== "no_work_income" && <label><span>{status === "employee" ? "Sueldo bruto mensual" : "Facturación mensual promedio"}</span><input autoComplete="off" inputMode="numeric" min="0" max="1000000000" name="monthly_gross" placeholder="Ejemplo: 1500000…" type="number" value={monthlyGross ?? ""} onChange={(event) => setMonthlyGross(event.target.value ? Number(event.target.value) : undefined)}/></label>}
        <div className="tax-jurisdiction"><CircleAlert aria-hidden="true" size={17}/><p><b>{city.province}:</b> Ingresos Brutos y tasas locales no están incluidos. Dependen de actividad, régimen, exenciones y domicilio fiscal.</p></div>
      </div>
      <div className="tax-result" aria-live="polite">
        {!estimate && status !== "no_work_income" ? <div className="tax-empty"><Calculator aria-hidden="true" size={28}/><p>Ingresá un monto para ver el orden de magnitud mensual.</p></div> : <TaxResult status={status} estimate={estimate ?? estimatePersonalTaxes({ status, monthlyGross: 0 })}/>} 
      </div>
    </div>
    <p className="tax-status"><b>Orientativo, no asesoramiento fiscal.</b> Valores consultados el 1/08/2026. Revisá supuestos y fuentes antes de decidir. <Link href="/fuentes">Ver fuentes →</Link></p>
  </section>;
}

function TaxResult({ status, estimate }: { status: TaxStatus; estimate: ReturnType<typeof estimatePersonalTaxes> }) {
  if (estimate.monthlyTotal === null) return <div className="tax-empty tax-empty--warn"><CircleAlert aria-hidden="true" size={28}/><p><b>Fuera del rango estimable.</b>{estimate.notes[0]}</p></div>;
  return <div><span className="tax-result__label">ESTIMADO MENSUAL</span><strong>{money.format(estimate.monthlyTotal)}</strong><small>{estimate.effectiveRate}% del ingreso informado{estimate.category ? ` · categoría ${estimate.category}` : ""}</small>
    {estimate.breakdown.length > 0 && <dl>{estimate.breakdown.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{money.format(item.amount)}</dd></div>)}</dl>}
    <p>{status === "no_work_income" ? "Sin impuesto laboral recurrente estimado." : estimate.notes[0]}</p>
  </div>;
}
