"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="es">
      <body>
        <main className="error-state">
          <p>Life Match Argentina</p>
          <h1>Esta página no pudo cargar.</h1>
          <button onClick={reset}>Reintentar</button>
        </main>
      </body>
    </html>
  );
}
