import Link from "next/link";
import { cities } from "@/data/cities";
import { LocalFunnel } from "@/components/local-funnel";

function average(values: number[]) { return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length); }

export default function AdminPage() {
  const avgCoverage = average(cities.map((city) => city.confidence.coverage));
  const avgFreshness = average(cities.map((city) => city.confidence.freshness));
  const regions = Object.entries(cities.reduce<Record<string, typeof cities>>((groups, city) => {
    groups[city.region] = [...(groups[city.region] ?? []), city];
    return groups;
  }, {}));
  return <main className="admin-page">
    <header><div><p className="eyebrow">OPERACIÓN · SNAPSHOT ar-24-2026-07</p><h1>Pulso del producto</h1></div><Link href="/">Volver al producto →</Link></header>
    <section className="admin-kpis">
      <article><span>Ciudades publicadas</span><b>{cities.length}</b><small>objetivo: 24</small></article>
      <article><span>Cobertura media</span><b>{avgCoverage}%</b><small>quality gate aprobado</small></article>
      <article><span>Frescura media</span><b>{avgFreshness}%</b><small>alquiler requiere revisión mensual</small></article>
      <article><span>Motor activo</span><b>v1.0</b><small>determinístico</small></article>
    </section>
    <div className="admin-grid">
      <section className="admin-panel"><h2>Cobertura territorial</h2>{regions.map(([region, items]) => <div className="health-row" key={region}><span>{region}</span><i><b style={{width:`${(items?.length ?? 0) / cities.length * 100 * 3}%`}}/></i><strong>{items?.length}</strong></div>)}</section>
      <section className="admin-panel"><h2>Estado de fuentes</h2><ul><li><span>Georef v2</span><b className="status status--good">Operativa</b></li><li><span>Open-Meteo</span><b className="status status--good">Operativa</b></li><li><span>OSM snapshot</span><b className="status status--good">Revisado</b></li><li><span>ENACOM localidad</span><b className="status status--warn">Proxy histórico</b></li><li><span>Rangos editoriales</span><b className="status status--warn">Revisión mensual</b></li></ul></section>
      <section className="admin-panel admin-panel--wide"><h2>Quality gate por ciudad</h2><div className="city-health">{cities.map((city) => <div key={city.id}><span>{city.name}<small>{city.province}</small></span><b>{city.confidence.coverage}%</b><i className="status status--good">Publicada</i></div>)}</div></section>
      <LocalFunnel />
    </div>
    <p className="admin-empty">Con PostHog configurado, este panel pasa a vistas agregadas. Segmentos con menos de 20 sesiones permanecen ocultos.</p>
  </main>;
}
