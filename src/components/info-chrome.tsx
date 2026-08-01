"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function InfoHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = [{ href: "/como-funciona", label: "Cómo funciona" }, { href: "/fuentes", label: "Fuentes" }, { href: "/acerca-de", label: "Acerca de" }] as const;
  return <header className="info-header"><Link className="brand" href="/" translate="no">LIFE MATCH <i>ARGENTINA</i></Link><button aria-expanded={open} aria-label={open ? "Cerrar menú" : "Abrir menú"} className="nav-toggle" onClick={() => setOpen((current) => !current)} type="button">{open ? <X aria-hidden="true" size={21}/> : <Menu aria-hidden="true" size={21}/>}</button><nav aria-label="Información del servicio" className={open ? "is-open" : ""}>{links.map((link) => <Link aria-current={pathname === link.href ? "page" : undefined} href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</nav><Link className="button button--ink info-header__cta" href="/">Crear mi mapa</Link></header>;
}

export function InfoFooter() {
  return <footer className="info-footer"><div><span className="brand" translate="no">LIFE MATCH <i>ARGENTINA</i></span><p>Una herramienta exploratoria para armar una shortlist de ciudades, entender por qué aparecen y decidir qué investigar después.</p></div><nav aria-label="Enlaces del pie"><Link href="/como-funciona">Cómo funciona</Link><Link href="/fuentes">Fuentes y método</Link><Link href="/acerca-de">Acerca de</Link><Link href="/">Crear mi mapa</Link></nav><small>Los resultados no reemplazan una investigación personal, visita ni asesoramiento profesional.</small></footer>;
}
