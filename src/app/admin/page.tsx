import Link from "next/link";
import { notFound } from "next/navigation";
import { cities, CITY_DATA_SNAPSHOT_ID } from "@/data/cities";
import { currentAdmin } from "@/lib/server/session-auth";
import { getServiceSupabase } from "@/lib/server/supabase";

export const dynamic = "force-dynamic";

function average(values: number[]) { return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length); }

export default async function AdminPage() {
  if (!await currentAdmin()) notFound();
  const db = getServiceSupabase();
  const { data: funnelRows } = db ? await db.from("dashboard_event_funnel").select("event,event_count").order("day", { ascending: false }).limit(900) : { data: [] };
  const funnel = (funnelRows ?? []).reduce<Record<string, number>>((totals, row) => {
    totals[row.event] = (totals[row.event] ?? 0) + Number(row.event_count);
    return totals;
  }, {});
  const generated = funnel.recommendations_generated ?? 0;
  const saved = funnel.city_saved ?? 0;
  const avgCoverage = average(cities.map((city) => city.confidence.coverage));
  const avgFreshness = average(cities.map((city) => city.confidence.freshness));
  const regions = Object.entries(cities.reduce<Record<string, typeof cities>>((groups, city) => {
    groups[city.region] = [...(groups[city.region] ?? []), city];
    return groups;
  }, {}));
  return <main className="admin-page">
    <header><div><p className="eyebrow">OPERACIÓN · SNAPSHOT {CITY_DATA_SNAPSHOT_ID}</p><h1>Pulso del producto</h1></div><Link href="/">Volver al producto →</Link></header>
    <section className="admin-kpis">
        <article><span>Ciudades publicadas</span><b>{cities.length}</b><small>próximo objetivo: 60</small></article>
      <article><span>Cobertura media</span><b>{avgCoverage}%</b><small>quality gate aprobado</small></article>
      <article><span>Frescura media</span><b>{avgFreshness}%</b><small>alquiler requiere revisión mensual</small></article>
      <article><span>Motor activo</span><b>v1.1</b><small>determinístico</small></article>
    </section>
    <div className="admin-grid">
      <section className="admin-panel"><h2>Cobertura territorial</h2>{regions.map(([region, items]) => <div className="health-row" key={region}><span>{region}</span><i><b style={{width:`${(items?.length ?? 0) / cities.length * 100 * 3}%`}}/></i><strong>{items?.length}</strong></div>)}</section>
      <section className="admin-panel"><h2>Estado de fuentes</h2><ul><li><span>Georef v2</span><b className="status status--good">Operativa</b></li><li><span>Open-Meteo</span><b className="status status--good">Operativa</b></li><li><span>OSM snapshot</span><b className="status status--good">Revisado</b></li><li><span>ENACOM localidad</span><b className="status status--warn">Proxy histórico</b></li><li><span>Rangos editoriales</span><b className="status status--warn">Revisión mensual</b></li></ul></section>
      <section className="admin-panel admin-panel--wide"><h2>Quality gate por ciudad</h2><div className="city-health">{cities.map((city) => <div key={city.id}><span>{city.name}<small>{city.province}</small></span><b>{city.confidence.coverage}%</b><i className="status status--good">Publicada</i></div>)}</div></section>
      <section className="admin-panel admin-panel--wide"><h2>Funnel · ventana de retención</h2><div className="admin-kpis admin-kpis--nested"><article><span>Inicios</span><b>{funnel.onboarding_started ?? 0}</b></article><article><span>Resultados</span><b>{generated}</b></article><article><span>Guardados</span><b>{saved}</b></article><article><span>Strong acceptance</span><b>{generated ? Math.round(saved / generated * 100) : 0}%</b></article></div><small>Eventos consentidos, agregados y con retención máxima de 90 días.</small></section>
    </div>
    <p className="admin-empty">Las vistas operativas muestran sólo agregados. No se exponen texto libre, email ni localidad.</p>
  </main>;
}
