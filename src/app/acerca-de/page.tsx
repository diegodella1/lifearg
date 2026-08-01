import Link from "next/link";
import { InfoFooter, InfoHeader } from "@/components/info-chrome";

export const metadata = { title: "Acerca de | Life Match Argentina", description: "Por qué existe Life Match Argentina y qué principios guían sus recomendaciones." };

export default function AboutPage() {
  return <main className="info-page" id="main-content"><InfoHeader />
    <section className="info-hero info-hero--about"><p className="eyebrow">ACERCA DE LIFE MATCH</p><h1>Elegir ciudad no debería empezar con 40 pestañas abiertas.</h1><p>La información para mudarse está fragmentada: alquileres por un lado, clima por otro, recomendaciones personales por todos lados. Life Match la convierte en una conversación ordenada sobre la vida que querés sostener.</p><Link className="button button--primary button--large" href="/">Crear mi mapa</Link></section>
    <section className="about-manifesto"><p className="eyebrow">POR QUÉ EXISTE</p><blockquote>“No buscamos la mejor ciudad de Argentina. Buscamos futuros posibles que cierren con tu realidad.”</blockquote><p>Una buena recomendación no oculta costos ni presenta preferencias como hechos. Te muestra por qué una opción aparece, dónde están los datos débiles y qué tendrías que resignar.</p></section>
    <section className="principles-grid"><article><span>01</span><h2>Compatibilidad, no podio</h2><p>Una ciudad puede encajar con un perfil y no con otro. No existe un ranking universal.</p></article><article><span>02</span><h2>Trade-offs visibles</h2><p>Naturaleza, servicios, costo y conectividad compiten. Mostramos ventajas junto a sus límites.</p></article><article><span>03</span><h2>Datos con contexto</h2><p>Cada señal necesita fuente, fecha, alcance y nivel de confianza. Desconocido nunca significa cero.</p></article><article><span>04</span><h2>Privacidad por diseño</h2><p>Podés usar el producto sin cuenta. Texto libre se descarta y analítica requiere elección explícita.</p></article></section>
    <section className="current-state"><div><p className="eyebrow">ESTADO ACTUAL</p><h2>Beta en construcción, método abierto.</h2></div><p>El universo inicial cubre 24 ciudades. El motor es determinístico. Parte del snapshot sigue siendo editorial mientras se completa pipeline trazable; esa limitación aparece publicada, no escondida.</p><Link href="/fuentes">Revisar estado de fuentes →</Link></section>
    <section className="info-final-cta"><p className="eyebrow">PROBALO CON TU REALIDAD</p><h2>Menos búsqueda dispersa. Mejores preguntas.</h2><Link className="button button--primary button--large" href="/">Descubrir mis ciudades</Link></section><InfoFooter />
  </main>;
}
