import Link from "next/link";
import { dataSources, factorSourceIds } from "@/data/sources";
import { factorLabels } from "@/data/cities";
import { FACTORS } from "@/lib/types";
import { InfoFooter, InfoHeader } from "@/components/info-chrome";

export const metadata = { title: "Fuentes y método | Life Match Argentina", description: "Fuentes, fechas, límites y metodología detrás de los matches de Life Match Argentina." };
const dateFormatter = new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeZone: "UTC" });

export default function SourcesPage() {
  return <main className="info-page" id="main-content"><InfoHeader />
    <section className="info-hero"><p className="eyebrow">FUENTES Y MÉTODO</p><h1>Datos útiles porque muestran sus límites.</h1><p>Cada match combina índices comparativos dentro de 24 ciudades. Publicamos de dónde sale cada señal, cuándo fue observada y qué no permite afirmar.</p><div className="info-hero__actions"><Link className="button button--primary" href="/">Crear mi mapa</Link><Link className="button button--outline" href="/como-funciona">Entender el proceso</Link></div></section>
    <section className="snapshot-status"><div><span>SNAPSHOT ACTIVO</span><b>ar-24-2026-08</b></div><div><span>COBERTURA</span><b>24 ciudades</b></div><div><span>MOTOR</span><b>rules-v1.1.0</b></div><div><span>ESTADO</span><b>Distancia explicable</b></div></section>
    <section className="methodology-section"><h2>Qué alimenta cada factor</h2><p className="section-lead">Los valores 0–100 permiten comparar este universo; no equivalen a porcentajes absolutos ni garantizan experiencia individual.</p><div className="source-grid">{FACTORS.map((factor) => <article key={factor}><span>{factorLabels[factor]}</span><p>{factorSourceIds[factor].map((id) => dataSources.find((source) => source.id === id)?.name).filter(Boolean).join(" · ")}</p></article>)}</div></section>
    <section className="methodology-section" id="costos"><h2>Fuentes, fechas y advertencias</h2><div className="source-list">{dataSources.map((source) => <article key={source.id}><div><h3>{source.name}</h3><span>{source.license} · observado {dateFormatter.format(new Date(`${source.observedAt}T00:00:00Z`))}</span></div><p>{source.limitation}</p><a href={source.url} rel={source.url.startsWith("http") ? "noreferrer" : undefined} target={source.url.startsWith("http") ? "_blank" : undefined}>Abrir referencia ↗</a></article>)}</div></section>
    <section className="cost-method"><p className="eyebrow">COSTOS Y ALQUILER</p><h2>Es el dato más volátil y el mayor límite actual.</h2><p>Los rangos actuales son estimaciones editoriales para exploración. Los enlaces de alquiler llevan a cada proveedor y todavía no alteran el match. Una integración futura sólo ajustará el resultado con muestra, fecha y moneda comparables. No scrapeamos ni republicamos anuncios contra sus términos.</p></section>
    <section className="methodology-section"><h2>Cómo publicamos un snapshot</h2><ol className="publication-flow"><li><b>Conservar raw</b><span>Archivo original, fecha y checksum.</span></li><li><b>Normalizar territorio</b><span>Localidad, municipio y aglomerado no se mezclan silenciosamente.</span></li><li><b>Validar</b><span>Nulos, duplicados, unidades, outliers, licencia y frescura.</span></li><li><b>Revisar</b><span>Quality gate automático más revisión editorial.</span></li><li><b>Publicar o bloquear</b><span>Snapshot atómico; versión anterior disponible para rollback.</span></li></ol></section>
    <section className="not-a-promise"><p className="eyebrow">INTERPRETACIÓN RESPONSABLE</p><h2>No hay score nacional de seguridad.</h2><p>No usamos cantidad de comisarías, noticias o testimonios como sustituto del riesgo delictivo. Tampoco afirmamos “buen internet” cuando una fuente sólo indica tecnología disponible.</p></section>
    <section className="info-final-cta"><p className="eyebrow">MÉTODO ANTES QUE MAGIA</p><h2>Creá tu mapa y revisá cada razón.</h2><Link className="button button--primary button--large" href="/">Descubrir mis ciudades</Link></section><InfoFooter />
  </main>;
}
