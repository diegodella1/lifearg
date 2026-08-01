# Life Match Argentina

MVP funcional del motor de decisión definido en el PRD. Entrega onboarding anónimo, interpretación opcional con IA, top 5 determinístico y explicable, comparación, favoritos locales, eventos seudónimos y dashboard de salud.

## Desarrollo

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`. Dashboard: `http://localhost:3000/admin`.

La aplicación funciona sin credenciales: usa extracción local por palabras clave y guarda favoritos/eventos en `localStorage`. Con `OPENAI_API_KEY`, `/api/preferences/extract` usa Structured Outputs y conserva fallback local ante cualquier fallo.

## Verificación

```bash
npm test
npm run typecheck
npm run data:validate
npm run build
npm audit
```

## Arquitectura

- `src/app`: páginas y Route Handlers.
- `src/components`: experiencia pública y dashboard.
- `src/lib/matching.ts`: ranking determinístico `rules-v1.1.0`, con distancia opcional calculada localmente.
- `src/lib/taxes.ts`: estimación local de aportes y Monotributo con valores oficiales fechados.
- `src/data/cities.ts`: snapshot editorial comparativo `ar-24-2026-08`.
- `supabase/migrations`: esquema PostgreSQL/PostGIS, RLS y vistas operativas.
- `scripts/validate-data.mjs`: quality gate mínimo del catálogo.

## Datos y límites

Los índices actuales son valores editoriales comparativos dentro de las 24 ciudades, no estadísticas absolutas. Antes de publicar comercialmente deben reemplazarse/validarse mediante pipeline documentado:

1. Georef v2 para IDs y geometrías.
2. INDEC para población.
3. Open-Meteo ERA5-Land para clima.
4. Snapshot OSM para servicios, cultura, naturaleza y caminabilidad.
5. ENACOM solo como proxy histórico de tecnologías disponibles.
6. Rangos de costo curados con evidencia, tamaño de muestra y caducidad.

No afirmar seguridad, calidad domiciliaria de internet ni disponibilidad futura. El score expresa compatibilidad con preferencias; confianza expresa cobertura/frescura.

## Producción gestionada

1. Crear proyecto Supabase y aplicar `supabase/migrations/0001_initial.sql`.
2. Configurar variables de `.env.example` en Vercel.
3. Proteger `/admin` con Supabase Auth antes de exponer el dominio.
4. Enviar taxonomía de `src/lib/analytics.ts` a PostHog mediante proxy server-side; excluir texto y PII.
5. Configurar Sentry, backups y prueba de restauración.
6. Ejecutar revisión legal/licencias y evaluación de 30 perfiles antes de activar marketing.

## Cloudflare Workers

El despliegue productivo usa OpenNext y el Custom Domain `lifearg.diegodella.ar`:

```bash
npm run preview:cloudflare
npm run deploy:cloudflare
```

`wrangler.jsonc` habilita `nodejs_compat`, assets estáticos, observabilidad y TLS/DNS automático mediante Custom Domain. Para rollback: `npx wrangler rollback`.

Supabase es opcional: sin sus variables, sesiones y eventos operan en modo efímero. Para persistencia, configurar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y el secret `SUPABASE_SERVICE_ROLE_KEY` antes del despliegue.

## Privacidad

Texto libre se procesa y descarta. `Reiniciar` elimina favoritos y eventos locales. La migración separa cuenta/PII de recomendaciones y activa RLS para datos privados. Producción debe completar consentimiento versionado, exportación y borrado dentro del procedimiento legal definido.

La localidad actual y los importes del estimador fiscal se usan sólo en el dispositivo y no se envían a Supabase ni a analítica. Los enlaces de alquiler son salidas hacia proveedores; no se scrapean ni republican avisos.
