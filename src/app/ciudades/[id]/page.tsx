import Link from "next/link";
import { notFound } from "next/navigation";
import { cities, CITY_CATALOG_SIZE, factorLabels } from "@/data/cities";
import { dataSources } from "@/data/sources";
import { FACTORS } from "@/lib/types";
import { CityLocator } from "@/components/city-locator";
import { CityPostcard } from "@/components/city-postcard";
import type { Metadata } from "next";

export function generateStaticParams() { return cities.map((city) => ({ id: city.id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const city = cities.find((item) => item.id === id);
  if (!city) return {};
  const title = `Vivir en ${city.name} | Life Match Argentina`;
  return { title, description: city.summary, alternates: { canonical: `/ciudades/${city.id}` }, openGraph: { type: "article", locale: "es_AR", title, description: city.summary } };
}

export default async function CityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const city = cities.find((item) => item.id === id);
  if (!city) notFound();
  const formattedDate = new Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${city.updatedAt}T00:00:00Z`));

  return <main className="city-page" id="main-content">
    <header><Link className="brand" href="/">LIFE MATCH <i>ARGENTINA</i></Link><Link href="/fuentes">Fuentes y método →</Link></header>
    <section className="city-hero"><div><p className="eyebrow">{city.province} · {city.region}</p><h1>{city.name}</h1><p>{city.summary}</p></div><aside className="city-dossier"><CityPostcard city={city}/><CityLocator city={city}/><div className="city-cost"><span>Rango mensual estimado</span><b>{city.costRange}</b><small>Snapshot al {formattedDate}</small></div></aside></section>
    <section className="city-metrics"><header><h2>Señales comparables</h2><p>Índices 0–100 dentro de estas {CITY_CATALOG_SIZE} ciudades. No son estadísticas absolutas.</p></header>{FACTORS.map((factor) => <article key={factor}><div><h3>{factorLabels[factor]}</h3><strong>{city.metrics[factor]}</strong></div><meter aria-label={`${factorLabels[factor]}: ${city.metrics[factor]} de 100`} min="0" max="100" value={city.metrics[factor]}>{city.metrics[factor]}</meter><small>{city.sourceIds[factor]?.map((sourceId) => dataSources.find((source) => source.id === sourceId)?.name).filter(Boolean).join(" · ")}</small></article>)}</section>
    <footer className="city-footer"><p>¿Querés saber cómo encaja con tu vida?</p><Link className="button button--primary" href="/">Crear mi mapa</Link></footer>
  </main>;
}
