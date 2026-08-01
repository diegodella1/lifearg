import Link from "next/link";

export function InfoHeader() {
  return <header className="info-header"><Link className="brand" href="/">LIFE MATCH <i>ARGENTINA</i></Link><nav aria-label="Información del servicio"><Link href="/como-funciona">Cómo funciona</Link><Link href="/fuentes">Fuentes</Link><Link href="/acerca-de">Acerca de</Link></nav><Link className="button button--ink info-header__cta" href="/">Crear mi mapa</Link></header>;
}

export function InfoFooter() {
  return <footer className="info-footer"><div><span className="brand">LIFE MATCH <i>ARGENTINA</i></span><p>Una herramienta exploratoria para armar una shortlist de ciudades, entender por qué aparecen y decidir qué investigar después.</p></div><nav aria-label="Enlaces del pie"><Link href="/como-funciona">Cómo funciona</Link><Link href="/fuentes">Fuentes y método</Link><Link href="/acerca-de">Acerca de</Link><Link href="/">Crear mi mapa</Link></nav><small>Los resultados no reemplazan una investigación personal, visita ni asesoramiento profesional.</small></footer>;
}
