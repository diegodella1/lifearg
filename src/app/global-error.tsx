"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body>
        <main className="error-state" id="main-content">
          <p className="eyebrow">ALGO NO CERRÓ</p>
          <h1>Esta página no pudo cargar.</h1>
          <p>Reintentá ahora. Si el problema continúa, volvé a abrir Life Match desde el inicio.</p>
          <div><button className="button button--primary" onClick={reset}>Reintentar</button><Link className="button button--outline" href="/">Volver al inicio</Link></div>
        </main>
      </body>
    </html>
  );
}
