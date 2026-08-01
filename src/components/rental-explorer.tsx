"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Home } from "lucide-react";
import { buildRentalLinks } from "@/lib/rentals";
import type { MatchResult, RentalPreferences } from "@/lib/types";

const defaults: RentalPreferences = { mode: "both", propertyType: "any", bedrooms: "any", currency: "ARS" };

export function RentalExplorer({ results, selectedCityId, onSelectCity }: { results: MatchResult[]; selectedCityId: string; onSelectCity: (id: string) => void }) {
  const [preferences, setPreferences] = useState(defaults);
  const city = results.find((result) => result.city.id === selectedCityId)?.city ?? results[0]?.city;
  const links = useMemo(() => city ? buildRentalLinks(city, preferences) : [], [city, preferences]);

  if (!city) return null;
  return <section className="rental-explorer" aria-labelledby="rental-title">
    <div className="rental-intro"><p className="eyebrow">DEL MATCH A LA CALLE</p><h2 id="rental-title">Alquileres para probar la idea.</h2><p>Ajustá la búsqueda y abrí oferta actual. Los precios cambian; verificá siempre condiciones en el portal.</p></div>
    <div className="rental-controls">
      <label><span>Ciudad</span><select autoComplete="off" name="rental_city" value={city.id} onChange={(event) => onSelectCity(event.target.value)}>{results.map((result) => <option key={result.city.id} value={result.city.id}>{result.city.name}</option>)}</select></label>
      <label><span>Modalidad</span><select autoComplete="off" name="rental_mode" value={preferences.mode} onChange={(event) => setPreferences({ ...preferences, mode: event.target.value as RentalPreferences["mode"] })}><option value="both">Permanente + temporal</option><option value="long_term">Permanente</option><option value="temporary">Temporal</option></select></label>
      <label><span>Propiedad</span><select autoComplete="off" name="rental_property" value={preferences.propertyType} onChange={(event) => setPreferences({ ...preferences, propertyType: event.target.value as RentalPreferences["propertyType"] })}><option value="any">Cualquiera</option><option value="apartment">Departamento</option><option value="house">Casa</option></select></label>
      <label><span>Dormitorios</span><select autoComplete="off" name="rental_bedrooms" value={preferences.bedrooms} onChange={(event) => setPreferences({ ...preferences, bedrooms: event.target.value as RentalPreferences["bedrooms"] })}><option value="any">Cualquiera</option><option value="studio">Ambiente único</option><option value="1">1 dormitorio</option><option value="2">2 dormitorios</option><option value="3_plus">3 o más</option></select></label>
      <label><span>Moneda</span><select autoComplete="off" name="rental_currency" value={preferences.currency} onChange={(event) => setPreferences({ ...preferences, currency: event.target.value as RentalPreferences["currency"] })}><option value="ARS">ARS</option><option value="USD">USD</option></select></label>
      <label><span>Máximo mensual</span><input autoComplete="off" inputMode="numeric" min="1" max={preferences.currency === "ARS" ? 100000000 : 100000} name="rental_maximum" placeholder="Ejemplo: 800000…" type="number" value={preferences.maxMonthlyRent ?? ""} onChange={(event) => setPreferences({ ...preferences, maxMonthlyRent: event.target.value ? Number(event.target.value) : undefined })}/></label>
    </div>
    <div className="rental-links">{links.filter((link) => preferences.mode === "long_term" ? link.provider !== "Airbnb" : preferences.mode === "temporary" ? link.provider !== "Zonaprop" : true).map((link) => <a href={link.url} key={link.provider} rel="noreferrer" target="_blank"><Home aria-hidden="true" size={20}/><span><b>{link.provider}</b><small>{link.note}</small></span><ExternalLink aria-hidden="true" size={17}/></a>)}</div>
    <p className="rental-status"><b>Integración en vivo en preparación.</b> Hasta autorizar la API de Mercado Libre, estos enlaces no modifican tu porcentaje de match.</p>
  </section>;
}
