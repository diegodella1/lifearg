"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, ChevronDown, Database, GitCompareArrows, MapPin, Menu, PartyPopper, RotateCcw, Share2, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { cities, factorLabels } from "@/data/cities";
import { rankCities } from "@/lib/matching";
import { buildProfileFromAnswers } from "@/lib/profile";
import { analyticsConsent, clearLocalData, setAnalyticsConsent, track } from "@/lib/analytics";
import { readStoredJson, writeStoredJson } from "@/lib/storage";
import type { Factor, MatchResult, QuickAnswers, RelocationTolerance, UserOrigin } from "@/lib/types";
import type { RuntimeCapabilities } from "@/lib/server/capabilities";
import Link from "next/link";
import { ResultsMap } from "./results-map";
import { DecisionToolkit } from "./decision-toolkit";
import { InfoFooter } from "./info-chrome";

type Stage = "landing" | "intent" | "story" | "basics" | "origin" | "priorities" | "results";

const stages: Stage[] = ["intent", "story", "basics", "origin", "priorities"];
const lifestyleOptions: Array<{ value: QuickAnswers["lifestyle"][number]; label: string; note: string }> = [
  { value: "nature", label: "Naturaleza cerca", note: "verde, agua o montaña" },
  { value: "walkability", label: "Moverme a pie", note: "menos dependencia del auto" },
  { value: "tranquility", label: "Ritmo tranquilo", note: "menos fricción cotidiana" },
  { value: "culture", label: "Vida cultural", note: "salidas, gastronomía y agenda" },
  { value: "services", label: "Servicios completos", note: "salud, educación y comercios" },
  { value: "climate", label: "Clima amable", note: "temperaturas moderadas" },
];

const initialAnswers: QuickAnswers = {
  intent: "exploring",
  workMode: "remote",
  budget: "medium",
  household: "couple",
  car: "sometimes",
  lifestyle: ["nature", "tranquility"],
  tradeoff: "balanced",
  narrative: "",
};

function Choice<T extends string>({ active, value, title, detail, onChange }: { active: boolean; value: T; title: string; detail?: string; onChange: (value: T) => void }) {
  return (
    <button className={`choice ${active ? "choice--active" : ""}`} onClick={() => onChange(value)} type="button">
      <span className="choice__mark">{active ? <Check aria-hidden="true" size={15} /> : null}</span>
      <span><strong>{title}</strong>{detail ? <small>{detail}</small> : null}</span>
    </button>
  );
}

const disabledCapabilities: RuntimeCapabilities = { accounts: false, ai: false, analytics: false, monitoring: false };

export function MatcherExperience({ capabilities = disabledCapabilities }: { capabilities?: RuntimeCapabilities }) {
  const [stage, setStage] = useState<Stage>("landing");
  const [answers, setAnswers] = useState(initialAnswers);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [rejected, setRejected] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [chips, setChips] = useState<Factor[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [consent, setConsent] = useState<boolean | null>(null);
  const [aiConsent, setAiConsent] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setFavorites(readStoredJson<string[]>("life-match:favorites", []));
      setSessionId(readStoredJson<string | null>("life-match:session-id", null));
      setConsent(analyticsConsent());
      try {
        const draft = JSON.parse(window.sessionStorage.getItem("life-match:quiz-draft") ?? "null") as { version?: number; answers?: QuickAnswers } | null;
        if (draft?.version === 1 && draft.answers && Array.isArray(draft.answers.lifestyle)) setAnswers(draft.answers);
      } catch { window.sessionStorage.removeItem("life-match:quiz-draft"); }
    });
    track("landing_viewed");
    if (capabilities.accounts) {
      void fetch("/api/account/favorites", { cache: "no-store" }).then(async (response) => {
        if (!response.ok) return;
        const body = await response.json() as { cityIds?: string[] };
        if (body.cityIds?.length) {
          setFavorites((current) => [...new Set([...current, ...body.cityIds!])]);
        }
      }).catch(() => undefined);
      if (new URLSearchParams(window.location.search).get("auth") === "confirmed") {
        void fetch("/api/account/claim", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }).catch(() => undefined);
        const cleanedUrl = new URL(window.location.href);
        cleanedUrl.searchParams.delete("auth");
        window.history.replaceState({}, "", `${cleanedUrl.pathname}${cleanedUrl.search}${cleanedUrl.hash}`);
      }
    }
    return () => window.cancelAnimationFrame(frame);
  }, [capabilities.accounts]);

  useEffect(() => {
    if (stage !== "landing" && stage !== "results") window.sessionStorage.setItem("life-match:quiz-draft", JSON.stringify({ version: 1, answers }));
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      if (stage === "landing" || stage === "results") return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [answers, stage]);

  const profile = useMemo(() => buildProfileFromAnswers(answers), [answers]);
  const results = useMemo(() => rankCities(profile, cities, { origin: answers.origin, tolerance: answers.relocationTolerance }), [profile, answers.origin, answers.relocationTolerance]);
  const progress = stage === "landing" || stage === "results" ? 0 : ((stages.indexOf(stage) + 1) / stages.length) * 100;
  const currentStep = stages.indexOf(stage) + 1;

  const next = () => {
    const index = stages.indexOf(stage);
    track("question_answered", { step: stage });
    if (index < stages.length - 1) setStage(stages[index + 1]);
    else {
      track("onboarding_completed");
      track("recommendations_generated", { count: 5, algorithm_version: "rules-v1.1.0", origin_provided: Boolean(answers.origin), relocation_tolerance: answers.relocationTolerance ?? "none" });
      void fetch("/api/recommendations", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...(sessionId ? { sessionId } : {}), profile, ...(answers.origin ? { origin: answers.origin, relocationTolerance: answers.relocationTolerance } : {}) }) }).catch(() => undefined);
      setStage("results");
    }
  };
  const back = () => {
    const index = stages.indexOf(stage);
    setStage(index <= 0 ? "landing" : stages[index - 1]);
  };

  const skipOptionalStage = () => {
    if (stage === "origin") setAnswers((current) => ({ ...current, origin: undefined, relocationTolerance: undefined }));
    next();
  };

  async function interpretStory() {
    if (!answers.narrative?.trim()) return next();
    track("free_text_submitted", { char_bucket: answers.narrative.length < 100 ? "short" : "long" });
    setExtracting(true);
    try {
      const response = await fetch("/api/preferences/extract", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: answers.narrative, ...(capabilities.ai && aiConsent ? { aiConsent: true } : {}) }) });
      const data = await response.json();
      const extracted = (data.preferences ?? []).filter((item: { confidence: number }) => item.confidence >= 0.6).map((item: { factor: Factor }) => item.factor);
      setChips(extracted);
      const lifestyle = extracted.filter((factor: Factor) => ["nature", "culture", "walkability", "tranquility", "climate", "services"].includes(factor));
      setAnswers((current) => ({ ...current, lifestyle: [...new Set([...current.lifestyle, ...lifestyle])] as QuickAnswers["lifestyle"] }));
    } finally {
      setExtracting(false);
      next();
    }
  }

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const nextValue = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      writeStoredJson("life-match:favorites", nextValue);
      if (capabilities.accounts) void fetch("/api/account/favorites", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ cityIds: nextValue }) }).catch(() => undefined);
      track(current.includes(id) ? "city_unsaved" : "city_saved", { city_id: id });
      return nextValue;
    });
  }

  function toggleCompare(id: string) {
    track("comparison_city_added", { city_id: id });
    setCompare((current) => {
      const nextValue = current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current;
      const url = new URL(window.location.href);
      if (nextValue.length) url.searchParams.set("compare", nextValue.join(","));
      else url.searchParams.delete("compare");
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
      return nextValue;
    });
  }

  async function startOnboarding() {
    track("onboarding_started");
    setStage("intent");
    if (sessionId) return;
    try {
      const response = await fetch("/api/sessions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ intent: answers.intent }) });
      if (!response.ok) return;
      const body = await response.json() as { sessionId: string };
      setSessionId(body.sessionId);
      writeStoredJson("life-match:session-id", body.sessionId);
    } catch { /* Offline onboarding remains available. */ }
  }

  if (stage === "landing") return <><Landing onStart={() => { void startOnboarding(); }} />{capabilities.analytics && consent === null && <ConsentBanner onChoose={(value) => { setAnalyticsConsent(value); setConsent(value); }} />}</>;
  if (stage === "results") return (
    <Results
      results={results}
      favorites={favorites}
      compare={compare}
      expanded={expanded}
      showAll={showAll}
      onFavorite={toggleFavorite}
      onCompare={toggleCompare}
      rejected={rejected}
      onReject={(id) => { setRejected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); track("city_rejected", { city_id: id, reason_code: "not_for_me" }); }}
      onExpand={(id) => setExpanded(expanded === id ? null : id)}
      onShowAll={() => setShowAll(true)}
      onRefine={() => setStage("priorities")}
      onReset={() => { clearLocalData(); window.sessionStorage.removeItem("life-match:quiz-draft"); setAnswers(initialAnswers); setFavorites([]); setCompare([]); setStage("landing"); }}
      origin={answers.origin}
      accountsAvailable={capabilities.accounts}
    />
  );

  return (
    <main className="quiz-shell" id="main-content">
      <header className="quiz-header">
        <button aria-label="Volver al inicio" className="brand brand--small" onClick={() => setStage("landing")}>LM<span>·</span>AR</button>
        <div className="progress-block"><div aria-label={`Paso ${currentStep} de ${stages.length}`} aria-valuemax={stages.length} aria-valuemin={1} aria-valuenow={currentStep} className="progress-wrap" role="progressbar"><span style={{ transform: `scaleX(${progress / 100})` }} /></div><small>{currentStep} / {stages.length}</small></div>
        {stage === "story" || stage === "origin" ? <button className="quiz-skip" onClick={skipOptionalStage} type="button">Saltar</button> : <span className="progress-copy">unos {Math.max(10, 50 - stages.indexOf(stage) * 12)} segundos</span>}
      </header>
      <section className="quiz-card">
        {stage === "intent" && <Intent answers={answers} setAnswers={setAnswers} />}
        {stage === "story" && <Story aiAvailable={capabilities.ai} aiConsent={aiConsent} answers={answers} setAiConsent={setAiConsent} setAnswers={setAnswers} chips={chips} />}
        {stage === "basics" && <Basics answers={answers} setAnswers={setAnswers} />}
        {stage === "origin" && <Origin answers={answers} setAnswers={setAnswers} />}
        {stage === "priorities" && <Priorities answers={answers} setAnswers={setAnswers} />}
        <footer className="quiz-actions">
          <button className="button button--ghost" onClick={back}><ArrowLeft aria-hidden="true" size={18} /> Atrás</button>
          <button className="button button--primary" disabled={extracting || (stage === "origin" && Boolean(answers.origin) && !answers.relocationTolerance)} onClick={stage === "story" ? interpretStory : next}>
            {extracting ? "Interpretando…" : stage === "priorities" ? "Ver mis ciudades" : "Continuar"} <ArrowRight aria-hidden="true" size={18} />
          </button>
        </footer>
      </section>
      <p className="privacy-note">Tus respuestas quedan en este dispositivo. Sin registro.</p>
    </main>
  );
}

function ConsentBanner({ onChoose }: { onChoose: (value: boolean) => void }) {
  return <aside className="consent-banner" aria-label="Preferencias de privacidad"><div><b>Medición opcional</b><p>Podemos guardar acciones anónimas para mejorar matches. Nunca enviamos texto libre ni email.</p></div><button className="button button--ghost" type="button" onClick={() => onChoose(false)}>Sólo esencial</button><button className="button button--ink" type="button" onClick={() => onChoose(true)}>Ayudar a mejorar</button></aside>;
}

function Landing({ onStart }: { onStart: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <>
    <main className="landing" id="main-content">
      <nav className="landing-nav" aria-label="Navegación principal" onKeyDown={(event) => { if (event.key === "Escape") setMenuOpen(false); }}><span className="brand" translate="no">LIFE MATCH <i>ARGENTINA</i></span><button aria-expanded={menuOpen} aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} className="nav-toggle" onClick={() => setMenuOpen((current) => !current)} type="button">{menuOpen ? <X aria-hidden="true" size={21}/> : <Menu aria-hidden="true" size={21}/>}</button><div className={`landing-links ${menuOpen ? "is-open" : ""}`}><Link href="/como-funciona">Cómo funciona</Link><Link href="/fuentes">Fuentes</Link><Link href="/acerca-de">Acerca de</Link><button className="button button--ink landing-links__cta" onClick={onStart} type="button">Crear mi mapa</button></div></nav>
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Un atlas hecho alrededor tuyo</p>
          <h1>¿En qué ciudad argentina <em>vivirías mejor?</em></h1>
          <p className="hero__lead">Contanos qué vida querés. Te mostramos opciones reales, por qué encajan y qué tendrías que resignar.</p>
          <button className="button button--primary button--large" onClick={onStart}>Descubrir mi match <ArrowRight aria-hidden="true" size={20} /></button>
          <span className="microcopy"><Sparkles aria-hidden="true" size={15} /> 45 segundos · sin registro · 24 ciudades</span>
          <div className="hero-tags" aria-hidden="true"><span>#Montaña</span><span>#Ciudad</span><span>#Costa</span></div>
        </div>
        <div className="map-art" aria-hidden="true">
          <span className="map-art__label map-art__label--north">NORTE</span><span className="map-art__label map-art__label--center">CENTRO</span><span className="map-art__label map-art__label--south">PATAGONIA</span>
          <div className="route route--one"/><div className="route route--two"/>
          <MapPin className="pin pin--one"/><MapPin className="pin pin--two"/><MapPin className="pin pin--three"/>
          <div className="match-stamp"><b>86</b><span>tu match</span></div>
        </div>
      </section>
      <section className="method" id="method">
        <p>NO BUSCAMOS “LA MEJOR CIUDAD”</p>
        <h2>Buscamos una vida que te cierre.</h2>
        <div className="method-grid">
          <article><span><SlidersHorizontal aria-hidden="true" size={30}/></span><small>01</small><p><b>Decís qué importa</b>Presupuesto, trabajo y forma de vivir.</p></article>
          <article><span><Database aria-hidden="true" size={30}/></span><small>02</small><p><b>Cruzamos evidencia</b>Datos comparables, fecha y confianza.</p></article>
          <article><span><PartyPopper aria-hidden="true" size={30}/></span><small>03</small><p><b>Ves los trade-offs</b>Cada ventaja junto a su costo real.</p></article>
        </div>
      </section>
    </main>
    <InfoFooter />
  </>;
}

function Intent({ answers, setAnswers }: FormProps) {
  return <div><p className="step">01 — TU MOMENTO</p><h2>¿Qué te trae por acá?</h2><p className="question-note">No cambia qué podés ver. Nos ayuda a entender cuán concreta es la búsqueda.</p><div className="choice-grid">
    <Choice active={answers.intent === "exploring"} value="exploring" title="Estoy explorando" detail="Quiero abrir posibilidades" onChange={(intent) => setAnswers({ ...answers, intent })}/>
    <Choice active={answers.intent === "this_year"} value="this_year" title="Quiero mudarme este año" detail="La decisión ya está en marcha" onChange={(intent) => setAnswers({ ...answers, intent })}/>
    <Choice active={answers.intent === "leaving"} value="leaving" title="Quiero irme de mi ciudad" detail="Sé qué quiero dejar atrás" onChange={(intent) => setAnswers({ ...answers, intent })}/>
    <Choice active={answers.intent === "comparing"} value="comparing" title="Comparo lugares concretos" detail="Necesito ordenar opciones" onChange={(intent) => setAnswers({ ...answers, intent })}/>
  </div></div>;
}

function Story({ answers, setAnswers, chips, aiAvailable, aiConsent, setAiConsent }: FormProps & { chips: Factor[]; aiAvailable: boolean; aiConsent: boolean; setAiConsent: (value: boolean) => void }) {
  return <div><p className="step">02 — LA VIDA QUE QUERÉS</p><h2>Imaginá un buen martes.</h2><p className="question-note">¿Qué pasa alrededor tuyo? ¿Qué no puede faltar? Podés saltear este paso.</p>
    <textarea aria-label="Descripción de la vida que buscás" autoComplete="off" className="story-input" name="lifestyle_story" value={answers.narrative} maxLength={1000} onChange={(event) => setAnswers({ ...answers, narrative: event.target.value })} placeholder="Ejemplo: trabajo desde casa, camino con mi perro y quiero verde cerca…" />
    {chips.length > 0 && <div className="chips">{chips.map((factor) => <span key={factor}>{factorLabels[factor]}</span>)}</div>}
    {aiAvailable && <label className="ai-consent"><input checked={aiConsent} name="ai_processing_consent" onChange={(event) => setAiConsent(event.target.checked)} type="checkbox"/><span><b>Interpretar este texto con IA</b><small>Opcional. Se envía sólo para esta interpretación y no se guarda.</small></span></label>}
    <p className="field-hint">{aiAvailable && aiConsent ? "La descripción se procesa con IA y se descarta." : "La descripción se interpreta localmente en este dispositivo."} Nunca inferimos datos sensibles.</p>
  </div>;
}

function Basics({ answers, setAnswers }: FormProps) {
  return <div><p className="step">03 — TU REALIDAD</p><h2>Lo que tiene que cerrar.</h2><div className="basics-grid">
    <SelectField label="Modalidad de trabajo" value={answers.workMode} onChange={(workMode) => setAnswers({ ...answers, workMode })} options={[['remote','Remoto'],['hybrid','Híbrido'],['onsite','Presencial'],['not_working','No trabajo']]}/>
    <SelectField label="Presupuesto mensual" value={answers.budget} onChange={(budget) => setAnswers({ ...answers, budget })} options={[['low','Ajustado'],['medium','Intermedio'],['high','Amplio'],['flexible','Flexible']]}/>
    <SelectField label="Hogar" value={answers.household} onChange={(household) => setAnswers({ ...answers, household })} options={[['solo','Vivo solo/a'],['couple','En pareja'],['family','Con familia'],['prefer_not','Prefiero no decir']]}/>
    <SelectField label="Auto" value={answers.car} onChange={(car) => setAnswers({ ...answers, car })} options={[['yes','Sí'],['no','No'],['sometimes','A veces']]}/>
  </div><p className="field-hint">Usamos rangos, nunca pedimos ingreso exacto.</p></div>;
}

const toleranceOptions: Array<{ value: RelocationTolerance; label: string; note: string }> = [
  { value: "nearby", label: "Hasta 200 km", note: "Quedarme cerca" },
  { value: "regional", label: "Hasta 700 km", note: "Moverme dentro de una zona amplia" },
  { value: "far", label: "Hasta 1.500 km", note: "Puedo irme lejos" },
  { value: "anywhere", label: "Cualquier distancia", note: "La cercanía no pesa" },
];

function Origin({ answers, setAnswers }: FormProps) {
  const [query, setQuery] = useState(answers.origin?.locality ?? "");
  const [locations, setLocations] = useState<UserOrigin[]>([]);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  function selectLocation(location: UserOrigin) {
    setAnswers({ ...answers, origin: location });
    setQuery(location.locality);
    setLocations([]);
    setActiveIndex(-1);
  }

  function handleLocationKeys(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!locations.length) return;
    if (event.key === "ArrowDown") { event.preventDefault(); setActiveIndex((current) => (current + 1) % locations.length); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActiveIndex((current) => current <= 0 ? locations.length - 1 : current - 1); }
    if (event.key === "Enter" && activeIndex >= 0) { event.preventDefault(); selectLocation(locations[activeIndex]); }
    if (event.key === "Escape") { setLocations([]); setActiveIndex(-1); }
  }

  useEffect(() => {
    if (query.trim().length < 3 || query === answers.origin?.locality) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearching(true); setMessage("");
      try {
        const response = await fetch("/api/locations", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query }), signal: controller.signal });
        if (!response.ok) throw new Error("location search failed");
        const body = await response.json() as { locations: UserOrigin[] };
        setLocations(body.locations); setActiveIndex(body.locations.length ? 0 : -1);
        if (!body.locations.length) setMessage("No encontramos coincidencias. Probá con otra forma del nombre.");
      } catch {
        if (!controller.signal.aborted) {
          const term = query.toLocaleLowerCase("es");
          const fallbackLocations = cities.filter((city) => `${city.name} ${city.province}`.toLocaleLowerCase("es").includes(term)).slice(0, 8).map((city) => ({ georefId: city.georefId, locality: city.name, province: city.province, provinceId: city.georefId.slice(0, 2), coordinates: city.coordinates }));
          setLocations(fallbackLocations); setActiveIndex(fallbackLocations.length ? 0 : -1);
          setMessage("GeoRef no respondió. Mostramos coincidencias del catálogo.");
        }
      } finally { if (!controller.signal.aborted) setSearching(false); }
    }, 300);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [query, answers.origin?.locality]);

  return <div><p className="step">04 — TU PUNTO DE PARTIDA</p><h2>¿Dónde vivís ahora?</h2><p className="question-note">Es opcional. Sirve para calcular distancia; la localidad queda en este dispositivo.</p>
    <div className="location-search"><label><span>Localidad argentina</span><input aria-activedescendant={activeIndex >= 0 ? `location-option-${activeIndex}` : undefined} aria-autocomplete="list" aria-controls="location-options" aria-expanded={locations.length > 0} autoComplete="off" name="current_location" onChange={(event) => { setQuery(event.target.value); setLocations([]); setActiveIndex(-1); setMessage(""); if (answers.origin) setAnswers({ ...answers, origin: undefined, relocationTolerance: undefined }); }} onKeyDown={handleLocationKeys} placeholder="Ejemplo: Posadas, Misiones…" role="combobox" value={query}/></label>{searching && <small aria-live="polite">Buscando…</small>}
      {locations.length > 0 && <ul id="location-options" role="listbox">{locations.map((location, index) => <li key={location.georefId} role="presentation"><button aria-selected={activeIndex === index} id={`location-option-${index}`} onClick={() => selectLocation(location)} onMouseMove={() => setActiveIndex(index)} role="option" type="button"><MapPin aria-hidden="true" size={17}/><span><b>{location.locality}</b><small>{location.province}</small></span></button></li>)}</ul>}
      {message && <small aria-live="polite">{message}</small>}
    </div>
    {answers.origin && <div className="origin-confirmed"><p><MapPin aria-hidden="true" size={18}/><span><b>{answers.origin.locality}</b><small>{answers.origin.province}</small></span><button type="button" onClick={() => { setAnswers({ ...answers, origin: undefined, relocationTolerance: undefined }); setQuery(""); }}>Cambiar</button></p><h3>¿Hasta dónde te mudarías?</h3><div className="choice-grid">{toleranceOptions.map((option) => <Choice active={answers.relocationTolerance === option.value} detail={option.note} key={option.value} onChange={(relocationTolerance) => setAnswers({ ...answers, relocationTolerance })} title={option.label} value={option.value}/>)}</div></div>}
    {!answers.origin && <p className="field-hint">Podés continuar sin elegir una localidad; el ranking mantendrá sus otros factores.</p>}
  </div>;
}

function Priorities({ answers, setAnswers }: FormProps) {
  return <div><p className="step">05 — LO QUE MÁS PESA</p><h2>Elegí hasta cuatro prioridades.</h2><div className="priority-grid">{lifestyleOptions.map((option) => <Choice key={option.value} active={answers.lifestyle.includes(option.value)} value={option.value} title={option.label} detail={option.note} onChange={(value) => setAnswers({ ...answers, lifestyle: answers.lifestyle.includes(value) ? answers.lifestyle.filter((item) => item !== value) : answers.lifestyle.length < 4 ? [...answers.lifestyle, value] : answers.lifestyle })}/>)}</div>
    <p className="tradeoff-label">Si tuvieras que inclinar la balanza…</p><div className="segmented">{([['nature','Más naturaleza'],['balanced','Ambas importan'],['culture','Más ciudad']] as const).map(([value,label]) => <button type="button" key={value} className={answers.tradeoff === value ? "active" : ""} onClick={() => setAnswers({ ...answers, tradeoff: value })}>{label}</button>)}</div>
  </div>;
}

type FormProps = { answers: QuickAnswers; setAnswers: (answers: QuickAnswers) => void };
function SelectField<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly (readonly [T,string])[]; onChange: (value: T) => void }) {
  return <label className="select-field"><span>{label}</span><select name={label.toLocaleLowerCase("es").replaceAll(" ", "_")} value={value} onChange={(event) => onChange(event.target.value as T)}>{options.map(([id,text]) => <option key={id} value={id}>{text}</option>)}</select><ChevronDown aria-hidden="true" size={18}/></label>;
}

function Results({ results, origin, favorites, compare, rejected, expanded, showAll, accountsAvailable, onFavorite, onCompare, onReject, onExpand, onShowAll, onRefine, onReset }: { results: MatchResult[]; origin?: UserOrigin; favorites: string[]; compare: string[]; rejected: string[]; expanded: string | null; showAll: boolean; accountsAvailable: boolean; onFavorite: (id: string) => void; onCompare: (id: string) => void; onReject: (id: string) => void; onExpand: (id: string) => void; onShowAll: () => void; onRefine: () => void; onReset: () => void }) {
  const [selectedCityId, setSelectedCityId] = useState(() => {
    const requested = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("city");
    return requested && results.some((result) => result.city.id === requested) ? requested : results[0]?.city.id ?? "";
  });
  const [notice, setNotice] = useState("");
  const [lastRejected, setLastRejected] = useState<string | null>(null);
  function selectCity(id: string) {
    setSelectedCityId(id);
    const url = new URL(window.location.href);
    url.searchParams.set("city", id);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }
  function rejectCity(id: string) {
    const restoring = rejected.includes(id);
    onReject(id);
    setLastRejected(restoring ? null : id);
    setNotice(restoring ? "Ciudad restaurada." : "Ciudad descartada de esta shortlist.");
  }
  async function shareCity(result: MatchResult) {
    const url = new URL(window.location.href);
    url.searchParams.set("city", result.city.id);
    const nativeShare = (navigator as unknown as { share?: (data: ShareData) => Promise<void> }).share;
    try {
      if (nativeShare) await nativeShare.call(navigator, { title: `${result.city.name} · Life Match Argentina`, url: url.toString() });
      else await navigator.clipboard.writeText(url.toString());
      setNotice(nativeShare ? "Enlace compartido." : "Enlace copiado.");
      track("result_shared", { city_id: result.city.id });
    } catch { setNotice("No pudimos compartir el enlace. Reintentá."); }
  }
  const visible = showAll ? results : results.slice(0, 3);
  const compared = results.filter((result) => compare.includes(result.city.id));
  return <main className="results-page" id="main-content"><header className="results-nav"><span className="brand" translate="no">LIFE MATCH <i>ARGENTINA</i></span><div><button className="button button--ghost" onClick={() => { if (window.confirm("¿Reiniciar el mapa y borrar tus respuestas locales?")) onReset(); }}><RotateCcw aria-hidden="true" size={16}/> Reiniciar</button><button className="button button--ink" onClick={onRefine}>Afinar resultados</button></div></header>
    <section className="results-intro"><p className="eyebrow">TU MAPA POSIBLE</p><h1>Encontramos lugares<br/>que hablan tu idioma.</h1><p>El porcentaje compara tus prioridades contra el snapshot actual. Confianza indica cobertura y frescura, no certeza sobre tu futuro.</p></section>
    <section className="results-grid"><ResultsMap onSelectCity={selectCity} origin={origin} results={results} selectedCityId={selectedCityId}/><section className="result-list">{visible.map((result) => <article className={`result-card ${result.rank === 1 ? "result-card--hero" : ""} ${selectedCityId === result.city.id ? "result-card--selected" : ""} ${rejected.includes(result.city.id) ? "result-card--rejected" : ""}`} id={`result-${result.city.id}`} key={result.city.id}>
      <div className="rank">0{result.rank}</div><div className="score"><b>{result.match}</b><span>/100<br/>MATCH</span></div>
      <div className="result-main"><p className="city-meta">{result.city.province} · {result.city.populationLabel}{result.isCurrentCity ? " · TU PUNTO DE PARTIDA" : ""}</p><h2><Link href={`/ciudades/${result.city.id}`} onClick={() => track("city_opened", { city_id: result.city.id, rank: result.rank })}>{result.city.name}</Link></h2><p>{result.city.summary}</p>{result.distanceKm !== null && <p className="distance-note"><MapPin aria-hidden="true" size={15}/>{result.distanceKm.toLocaleString("es-AR")} km desde tu localidad{result.distancePenalty ? ` · −${result.distancePenalty} puntos por distancia` : " · dentro de tu rango"}</p>}<div className="reason-row">{result.reasons.map((reason) => <span key={reason}><Check aria-hidden="true" size={14}/>{reason}</span>)}</div>
        <button aria-expanded={expanded === result.city.id} className="explain-toggle" onClick={() => onExpand(result.city.id)}>Cómo llegamos a este match <ChevronDown aria-hidden="true" size={16}/></button>
        {expanded === result.city.id && <div className="explanation"><div className="metrics">{[...result.contributions].sort((a,b)=>b.points-a.points).slice(0,6).map((item) => <div key={item.factor}><span>{item.label}</span><i><b style={{ width: `${item.compatibility}%` }}/></i><strong>{Math.round(item.compatibility)}</strong></div>)}</div><p><b>Cuidado con:</b> {result.tradeoffs.join(" · ")}</p><small>Modelo {result.algorithmVersion} · Snapshot {result.dataSnapshotId} · Datos al {result.city.updatedAt}</small></div>}
      </div>
      <aside className="result-side"><span className={`confidence confidence--${result.confidenceLabel}`}>Confianza {result.confidenceLabel}</span><b>{result.city.costRange}</b><small>rango mensual estimado</small><button className="result-select" onClick={() => selectCity(result.city.id)} type="button">{selectedCityId === result.city.id ? "Ciudad activa" : "Usar en herramientas"}</button><div><button aria-label={`Guardar ${result.city.name}`} aria-pressed={favorites.includes(result.city.id)} className={favorites.includes(result.city.id) ? "active" : ""} onClick={() => onFavorite(result.city.id)}><Bookmark aria-hidden="true" size={18}/><span>Guardar</span></button><button aria-label={`Comparar ${result.city.name}`} aria-pressed={compare.includes(result.city.id)} className={compare.includes(result.city.id) ? "active" : ""} onClick={() => onCompare(result.city.id)}><GitCompareArrows aria-hidden="true" size={18}/><span>Comparar</span></button><button aria-label={`${rejected.includes(result.city.id) ? "Restaurar" : "Descartar"} ${result.city.name}`} aria-pressed={rejected.includes(result.city.id)} className={rejected.includes(result.city.id) ? "active" : ""} onClick={() => rejectCity(result.city.id)}><X aria-hidden="true" size={18}/><span>{rejected.includes(result.city.id) ? "Restaurar" : "Descartar"}</span></button><button aria-label={`Compartir ${result.city.name}`} onClick={() => { void shareCity(result); }}><Share2 aria-hidden="true" size={18}/><span>Compartir</span></button></div></aside>
    </article>)}
    {!showAll && <button className="button button--outline show-more" onClick={onShowAll}>Ver los 5 matches <ArrowRight aria-hidden="true" size={18}/></button>}</section></section>
    <DecisionToolkit compared={compared} onRemoveComparison={onCompare} onSelectCity={selectCity} results={results} selectedCityId={selectedCityId}/>{accountsAvailable && <PostValuePanel/>}<footer className="methodology-note">Índices editoriales comparativos. No garantizan disponibilidad, precios futuros ni satisfacción. <Link href="/fuentes">Ver fuentes, alcance y fecha →</Link></footer>{notice && <div className="status-toast" role="status"><span>{notice}</span>{lastRejected && <button type="button" onClick={() => { onReject(lastRejected); setLastRejected(null); setNotice("Ciudad restaurada."); }}>Deshacer</button>}<button aria-label="Cerrar aviso" type="button" onClick={() => setNotice("")}><X aria-hidden="true" size={16}/></button></div>}
  </main>;
}

function PostValuePanel() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setMessage("Enviando…"); setSubmitting(true);
    try {
      const response = await fetch("/api/auth/magic-link", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
      const body = await response.json() as { error?: string | { message?: string } };
      const errorMessage = typeof body.error === "string" ? body.error : body.error?.message;
      setMessage(response.ok ? "Revisá tu email para sincronizar." : errorMessage ?? "No pudimos enviar el enlace. Reintentá.");
      if (response.ok) track("email_capture_submitted", { benefit: "sync" });
    } catch { setMessage("No pudimos enviar el enlace. Revisá tu conexión y reintentá."); }
    finally { setSubmitting(false); }
  }
  return <section className="post-value"><div><p className="eyebrow">SEGUÍ EXPLORANDO</p><h2>Guardá tu mapa entre dispositivos.</h2><p>Opcional. Tus resultados ya están disponibles sin cuenta.</p></div><form onSubmit={submit}><input aria-label="Email" autoComplete="email" name="email" required spellCheck={false} type="email" value={email} onChange={(event)=>setEmail(event.target.value)} placeholder="vos@ejemplo.com…"/><button className="button button--primary" disabled={submitting} type="submit">{submitting ? "Enviando…" : "Enviar enlace"}</button><small aria-live="polite">{message}</small></form><div className="feedback"><span>¿Estos matches te resultaron relevantes?</span><button type="button" onClick={()=>track("match_feedback_submitted",{relevance:5})}>Sí</button><button type="button" onClick={()=>track("match_feedback_submitted",{relevance:1})}>Todavía no</button></div></section>;
}
