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
];

export const factorSourceIds: Record<Factor, string[]> = {
  affordability: ["editorial-cost-v1"],
  connectivity: ["enacom", "osm"],
  climate: ["open-meteo"],
  services: ["osm", "indec-censo-2022"],
  mobility: ["osm", "ourairports"],
  nature: ["osm", "georef"],
  culture: ["osm", "indec-censo-2022"],
  walkability: ["osm", "georef"],
  tranquility: ["osm", "indec-censo-2022"],
};

export function sourcesForFactor(factor: Factor) {
  return dataSources.filter((source) => factorSourceIds[factor].includes(source.id));
}
