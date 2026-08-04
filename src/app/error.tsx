"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="error-state">
      <p className="eyebrow">ALGO NO CERRÓ</p>
      <h1>No pudimos cargar tu mapa.</h1>
      <p>Tus respuestas siguen en este dispositivo. Reintentá; si falla otra vez, volvé al inicio.</p>
      <div>
        <button className="button button--primary" onClick={reset}>Reintentar</button>
        <Link className="button button--outline" href="/">Volver al inicio</Link>
      </div>
    </main>
  );
}
