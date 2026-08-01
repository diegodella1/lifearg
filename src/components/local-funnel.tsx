"use client";

import { useEffect, useState } from "react";

type EventRecord = { event: string };

export function LocalFunnel() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  useEffect(() => {
    setEvents(JSON.parse(window.localStorage.getItem("life-match:events") ?? "[]"));
  }, []);
  const count = (name: string) => events.filter((event) => event.event === name).length;
  const generated = count("recommendations_generated");
  const strong = count("city_saved");
  return <section className="admin-panel admin-panel--wide"><h2>Funnel de este dispositivo</h2><div className="admin-kpis admin-kpis--nested"><article><span>Inicios</span><b>{count("onboarding_started")}</b></article><article><span>Resultados</span><b>{generated}</b></article><article><span>Guardados</span><b>{strong}</b></article><article><span>Strong acceptance</span><b>{generated ? Math.round(strong / generated * 100) : 0}%</b></article></div><small>Modo local de desarrollo. En producción, PostHog agrega sesiones y aplica umbral n≥20.</small></section>;
}
