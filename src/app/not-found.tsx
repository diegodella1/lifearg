import Link from "next/link";

export default function NotFound() {
  return (
    <main className="error-state">
      <p className="eyebrow">RUTA DESCONOCIDA</p>
      <h1>Este lugar no está en el mapa.</h1>
      <p>Volvé al inicio para descubrir ciudades compatibles con tu forma de vivir.</p>
      <Link className="button button--primary" href="/">Ir al inicio</Link>
    </main>
  );
}
