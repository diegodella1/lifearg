import type { Factor } from "@/lib/types";

export type DataSource = {
  id: string;
  name: string;
  url: string;
  license: string;
  observedAt: string;
  granularity: string;
  limitation: string;
};

export const dataSources: DataSource[] = [
  { id: "georef", name: "Servicio Georef", url: "https://www.argentina.gob.ar/georef", license: "CC BY 4.0", observedAt: "2026-08-01", granularity: "localidad/municipio", limitation: "Centroides aproximados; límites administrativos no siempre coinciden con aglomerados urbanos." },
  { id: "indec-censo-2022", name: "INDEC Censo 2022", url: "https://www.indec.gob.ar/indec/web/Nivel4-Tema-2-41-165", license: "Fuente oficial", observedAt: "2022-05-18", granularity: "localidad/aglomerado", limitation: "Población de baja frecuencia; no describe dinámica reciente." },
  { id: "enacom", name: "ENACOM — conectividad", url: "https://www.datos.gob.ar/dataset/enacom-conectividad-al-servicio-internet", license: "Datos Argentina", observedAt: "2026-07-31", granularity: "localidad", limitation: "Disponibilidad tecnológica declarada no garantiza calidad domiciliaria." },
  { id: "open-meteo", name: "Open-Meteo Historical", url: "https://open-meteo.com/en/docs/historical-weather-api", license: "CC BY 4.0", observedAt: "2026-07-31", granularity: "coordenada/modelo", limitation: "Reanálisis climático; resolución no representa microclimas barriales." },
  { id: "osm", name: "OpenStreetMap", url: "https://www.openstreetmap.org/copyright", license: "ODbL", observedAt: "2026-07-31", granularity: "POI/red vial", limitation: "Cobertura desigual entre ciudades; cantidad no equivale a calidad." },
  { id: "ourairports", name: "OurAirports", url: "https://ourairports.com/data/", license: "Dominio público", observedAt: "2026-07-31", granularity: "aeropuerto", limitation: "Ubicación no confirma frecuencia ni operación comercial actual." },
  { id: "editorial-cost-v1", name: "Rangos editoriales de alquiler", url: "/fuentes#costos", license: "Metodología Life Match", observedAt: "2026-07-31", granularity: "ciudad", limitation: "Estimación exploratoria; falta muestra homogénea licenciada por ciudad." },
  { id: "arca-monotributo-2026-08", name: "ARCA — categorías del Monotributo", url: "https://arca.gob.ar/monotributo/categorias.asp", license: "Fuente oficial", observedAt: "2026-08-01", granularity: "nacional/categoría", limitation: "La cuota depende además de actividad, adherentes y otros parámetros de encuadre." },
  { id: "argentina-aportes", name: "Argentina.gob.ar — aportes del trabajador", url: "https://www.argentina.gob.ar/node/12243", license: "Fuente oficial", observedAt: "2026-08-01", granularity: "nacional", limitation: "El 17 % básico no contempla Ganancias, topes previsionales ni convenios particulares." },
  { id: "smn", name: "Servicio Meteorológico Nacional — datos abiertos", url: "https://www.smn.gob.ar/descarga-de-datos", license: "Fuente oficial", observedAt: "2026-08-01", granularity: "estación meteorológica", limitation: "Una estación puede estar alejada del centro urbano y no representa microclimas barriales." },
  { id: "refes", name: "REFES/SISA — establecimientos de salud", url: "https://www.argentina.gob.ar/salud/sisa", license: "Fuente oficial", observedAt: "2026-08-01", granularity: "establecimiento/localidad", limitation: "Cantidad y tipología no miden tiempos de espera, disponibilidad de turnos ni calidad percibida." },
  { id: "deis", name: "DEIS — estadísticas de salud", url: "https://www.argentina.gob.ar/salud/deis/datos", license: "Fuente oficial", observedAt: "2026-08-01", granularity: "provincia/departamento", limitation: "Varios indicadores no alcanzan granularidad de localidad y se usan sólo como contexto." },
  { id: "georef-educacion", name: "Georef — establecimientos educativos y universidades", url: "https://www.argentina.gob.ar/georef/referencia-completa-de-la-api-georef-v-2", license: "Fuente oficial abierta", observedAt: "2026-08-01", granularity: "establecimiento/localidad", limitation: "Presencia física no describe vacantes, orientación, jornada ni calidad educativa." },
  { id: "anac", name: "ANAC — datos abiertos aeronáuticos", url: "https://datos.anac.gob.ar/", license: "Fuente oficial", observedAt: "2026-08-01", granularity: "aeropuerto/ruta", limitation: "Infraestructura aeroportuaria no garantiza frecuencia, precio ni continuidad de vuelos." },
  { id: "cnrt", name: "CNRT — transporte automotor y ferroviario", url: "https://www.argentina.gob.ar/cnrt", license: "Fuente oficial", observedAt: "2026-08-01", granularity: "servicio/terminal", limitation: "Cobertura publicada puede cambiar y no equivale a puntualidad o calidad del servicio." },
  { id: "indec-ipc-vivienda", name: "INDEC — IPC vivienda y servicios", url: "https://www.indec.gob.ar/indec/web/Nivel4-Tema-3-5-31", license: "Fuente oficial", observedAt: "2026-08-01", granularity: "región", limitation: "Variación regional útil para contexto; no reemplaza precios de alquiler observados por ciudad." },
  { id: "arca-ganancias", name: "ARCA — Impuesto a las Ganancias", url: "https://www.arca.gob.ar/gananciasYBienes/ganancias/", license: "Fuente oficial", observedAt: "2026-08-01", granularity: "nacional/contribuyente", limitation: "Deducciones, escalas y retenciones dependen de situación personal y período fiscal." },
  { id: "comarb", name: "Comisión Arbitral — Convenio Multilateral", url: "https://www.ca.gov.ar/", license: "Fuente oficial", observedAt: "2026-08-01", granularity: "interjurisdiccional", limitation: "Aplicación depende de actividad y distribución real de ingresos entre jurisdicciones." },
  { id: "rentas-provinciales", name: "Administraciones tributarias provinciales", url: "/fuentes#impuestos", license: "Fuentes oficiales jurisdiccionales", observedAt: "2026-08-01", granularity: "provincia/actividad", limitation: "Alícuotas, mínimos, exenciones y regímenes cambian por provincia y actividad; requieren cálculo jurisdiccional." },
  { id: "wikimedia-commons", name: "Wikimedia Commons — material visual", url: "https://commons.wikimedia.org/", license: "Licencia por archivo", observedAt: "2026-08-01", granularity: "archivo/ubicación", limitation: "Cada imagen exige validar autoría, licencia, representación del lugar y fecha antes de publicar." },
];

export const factorSourceIds: Record<Factor, string[]> = {
  affordability: ["editorial-cost-v1", "indec-ipc-vivienda"],
  connectivity: ["enacom", "osm"],
  climate: ["open-meteo", "smn"],
  services: ["osm", "indec-censo-2022", "refes", "deis", "georef-educacion"],
  mobility: ["osm", "ourairports", "anac", "cnrt"],
  nature: ["osm", "georef"],
  culture: ["osm", "indec-censo-2022", "georef-educacion"],
  walkability: ["osm", "georef"],
  tranquility: ["osm", "indec-censo-2022"],
};

export function sourcesForFactor(factor: Factor) {
  return dataSources.filter((source) => factorSourceIds[factor].includes(source.id));
}
