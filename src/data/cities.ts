import type { City, FactorScores } from "@/lib/types";
import { factorSourceIds } from "./sources";

const confidence = { sourceQuality: 82, freshness: 72, coverage: 92, geographicFit: 84 };
const expandingConfidence = { sourceQuality: 76, freshness: 68, coverage: 75, geographicFit: 82 };
const geography: Record<string, readonly [string, number, number]> = {
  "caba": ["02014010", -34.608416, -58.372135], "la-plata": ["0644103015", -34.915496, -57.947988],
  "mar-del-plata": ["0635711003", -38.006449, -57.543838], "tandil": ["06791050", -37.328695, -59.136898],
  "bahia-blanca": ["0605601001", -38.72277, -62.272742], "cordoba": ["1401401003", -31.415046, -64.179114],
  "rio-cuarto": ["14098230", -33.123837, -64.349003], "villa-maria": ["14042170", -32.413504, -63.248329],
  "rosario": ["82084270", -32.947213, -60.633176], "santa-fe": ["82063170", -31.657475, -60.710478],
  "parana": ["30084160", -31.74016, -60.527426], "mendoza": ["50007010", -32.889733, -68.844444],
  "san-rafael": ["5010521002", -34.617775, -68.335645], "san-luis": ["74056150", -33.302086, -66.336855],
  "neuquen": ["58035070", -38.951829, -68.059181], "bariloche": ["6202106001", -41.135808, -71.304339],
  "esquel": ["26035030", -42.917321, -71.321573], "puerto-madryn": ["26007020", -42.767281, -65.036676],
  "ushuaia": ["94015020", -54.807404, -68.303757], "salta": ["6602805003", -24.783198, -65.410251],
  "jujuy": ["38021060", -24.185829, -65.299483], "tucuman": ["90084010", -26.830389, -65.20378],
  "posadas": ["54028030", -27.366426, -55.89398], "corrientes": ["18021020", -27.463345, -58.839473],
  "santa-rosa": ["42021020", -36.620401, -64.29063], "viedma": ["62007090", -40.808368, -62.994929],
  "trelew": ["26077040", -43.253187, -65.309381], "rio-gallegos": ["78021040", -51.623463, -69.215865],
  "formosa": ["34014020", -26.185009, -58.174896], "resistencia": ["22140060", -27.451076, -58.986484],
  "santiago-del-estero": ["86049110", -27.787684, -64.259668], "catamarca": ["10049030", -28.469013, -65.778917],
  "la-rioja": ["46014010", -29.412884, -66.855828], "concordia": ["3001506005", -31.397451, -58.017203],
  "rafaela": ["82021310", -31.252668, -61.491662], "san-martin-de-los-andes": ["58056010", -40.156938, -71.352714],
};

function city(
  id: string,
  name: string,
  province: string,
  region: City["region"],
  archetype: City["archetype"],
  populationLabel: string,
  costRange: string,
  summary: string,
  metrics: FactorScores,
  cityConfidence = confidence,
): City {
  const [georefId, lat, lon] = geography[id];
  return { id, georefId, name, province, region, archetype, populationLabel, costRange, summary, coordinates: { lat, lon }, metrics, confidence: cityConfidence, updatedAt: "2026-08-01", sourceIds: factorSourceIds };
}

// Snapshot editorial v1. Los índices son comparativos dentro del universo MVP (0–100), no estadísticas absolutas.
export const cities: City[] = [
  city("caba", "Buenos Aires", "CABA", "centro", "metropolis", "+3 M", "USD 900–1.450", "Máxima oferta cultural y de servicios, con costo y ritmo urbano altos.", { affordability: 28, connectivity: 96, climate: 63, services: 100, mobility: 95, nature: 38, culture: 100, walkability: 96, tranquility: 24 }),
  city("la-plata", "La Plata", "Buenos Aires", "centro", "capital", "700–900 mil", "USD 650–980", "Ciudad universitaria planificada, conectada con AMBA y de escala más amable.", { affordability: 55, connectivity: 86, climate: 64, services: 88, mobility: 80, nature: 48, culture: 82, walkability: 86, tranquility: 52 }),
  city("mar-del-plata", "Mar del Plata", "Buenos Aires", "centro", "coastal", "600–800 mil", "USD 620–980", "Mar, servicios completos y vida urbana con fuerte estacionalidad.", { affordability: 58, connectivity: 82, climate: 78, services: 88, mobility: 72, nature: 86, culture: 85, walkability: 82, tranquility: 52 }),
  city("tandil", "Tandil", "Buenos Aires", "centro", "nature", "100–200 mil", "USD 560–850", "Escala intermedia, sierras cercanas y distancias cotidianas moderadas.", { affordability: 67, connectivity: 78, climate: 76, services: 74, mobility: 55, nature: 92, culture: 65, walkability: 74, tranquility: 82 }),
  city("bahia-blanca", "Bahía Blanca", "Buenos Aires", "centro", "intermediate", "300–400 mil", "USD 560–860", "Polo regional con universidad, salud y servicios; clima ventoso y seco.", { affordability: 70, connectivity: 82, climate: 59, services: 84, mobility: 70, nature: 55, culture: 70, walkability: 72, tranquility: 65 }),
  city("cordoba", "Córdoba", "Córdoba", "centro", "metropolis", "+1 M", "USD 650–1.000", "Gran ecosistema profesional y cultural, cerca de sierras pero con tráfico y calor.", { affordability: 61, connectivity: 92, climate: 63, services: 96, mobility: 88, nature: 76, culture: 94, walkability: 72, tranquility: 40 }),
  city("rio-cuarto", "Río Cuarto", "Córdoba", "centro", "intermediate", "150–250 mil", "USD 520–790", "Centro universitario y agroindustrial manejable, con servicios regionales.", { affordability: 75, connectivity: 78, climate: 62, services: 76, mobility: 60, nature: 58, culture: 65, walkability: 74, tranquility: 74 }),
  city("villa-maria", "Villa María", "Córdoba", "centro", "intermediate", "80–120 mil", "USD 500–750", "Ciudad compacta y conectada en el centro del país, de ritmo cotidiano simple.", { affordability: 80, connectivity: 76, climate: 65, services: 70, mobility: 62, nature: 56, culture: 60, walkability: 78, tranquility: 79 }),
  city("rosario", "Rosario", "Santa Fe", "litoral", "metropolis", "+1 M", "USD 620–950", "Gran vida urbana sobre el Paraná, amplia oferta cultural y universitaria.", { affordability: 62, connectivity: 90, climate: 57, services: 94, mobility: 84, nature: 70, culture: 94, walkability: 86, tranquility: 35 }),
  city("santa-fe", "Santa Fe", "Santa Fe", "litoral", "capital", "400–600 mil", "USD 560–840", "Capital ribereña con servicios completos y escala intermedia.", { affordability: 72, connectivity: 82, climate: 52, services: 86, mobility: 70, nature: 72, culture: 76, walkability: 76, tranquility: 61 }),
  city("parana", "Paraná", "Entre Ríos", "litoral", "capital", "250–350 mil", "USD 540–820", "Barrancas, verde y servicios de capital en un ritmo más tranquilo.", { affordability: 74, connectivity: 79, climate: 55, services: 80, mobility: 65, nature: 82, culture: 72, walkability: 70, tranquility: 72 }),
  city("mendoza", "Mendoza", "Mendoza", "cuyo", "capital", "800 mil–1 M", "USD 650–1.050", "Ciudad arbolada, vino y montaña con aeropuerto y servicios metropolitanos.", { affordability: 58, connectivity: 88, climate: 76, services: 92, mobility: 86, nature: 94, culture: 88, walkability: 82, tranquility: 58 }),
  city("san-rafael", "San Rafael", "Mendoza", "cuyo", "nature", "100–200 mil", "USD 520–800", "Naturaleza cuyana y escala relajada, con menor conectividad regional.", { affordability: 77, connectivity: 72, climate: 79, services: 70, mobility: 58, nature: 96, culture: 62, walkability: 70, tranquility: 86 }),
  city("san-luis", "San Luis", "San Luis", "cuyo", "capital", "150–250 mil", "USD 520–790", "Capital compacta, seca y cercana a sierras, con buena infraestructura urbana.", { affordability: 78, connectivity: 81, climate: 77, services: 77, mobility: 66, nature: 88, culture: 62, walkability: 73, tranquility: 82 }),
  city("neuquen", "Neuquén", "Neuquén", "patagonia", "capital", "300–450 mil", "USD 780–1.200", "Polo económico patagónico con servicios fuertes, costo alto y entorno árido.", { affordability: 42, connectivity: 88, climate: 63, services: 90, mobility: 83, nature: 77, culture: 76, walkability: 68, tranquility: 52 }),
  city("bariloche", "Bariloche", "Río Negro", "patagonia", "nature", "120–180 mil", "USD 850–1.350", "Lagos y montaña excepcionales, con costo y estacionalidad exigentes.", { affordability: 32, connectivity: 76, climate: 72, services: 76, mobility: 78, nature: 100, culture: 76, walkability: 61, tranquility: 72 }),
  city("esquel", "Esquel", "Chubut", "patagonia", "nature", "30–50 mil", "USD 600–900", "Ciudad pequeña junto a bosque andino, muy tranquila y con servicios limitados.", { affordability: 62, connectivity: 66, climate: 68, services: 58, mobility: 55, nature: 99, culture: 48, walkability: 70, tranquility: 94 }),
  city("puerto-madryn", "Puerto Madryn", "Chubut", "patagonia", "coastal", "100–150 mil", "USD 650–980", "Costa patagónica, fauna y escala intermedia con clima ventoso.", { affordability: 56, connectivity: 75, climate: 70, services: 70, mobility: 64, nature: 97, culture: 62, walkability: 73, tranquility: 79 }),
  city("ushuaia", "Ushuaia", "Tierra del Fuego", "patagonia", "nature", "70–100 mil", "USD 950–1.500", "Paisaje austral único y servicios sólidos, con aislamiento y costo elevados.", { affordability: 24, connectivity: 76, climate: 55, services: 72, mobility: 72, nature: 100, culture: 62, walkability: 62, tranquility: 80 }),
  city("salta", "Salta", "Salta", "norte", "capital", "600–750 mil", "USD 540–840", "Capital histórica con cultura fuerte, aeropuerto y acceso a paisajes diversos.", { affordability: 73, connectivity: 82, climate: 72, services: 86, mobility: 82, nature: 90, culture: 91, walkability: 78, tranquility: 55 }),
  city("jujuy", "San Salvador de Jujuy", "Jujuy", "norte", "capital", "300–400 mil", "USD 500–760", "Capital compacta, cultural y próxima a quebradas y yungas.", { affordability: 79, connectivity: 74, climate: 73, services: 77, mobility: 68, nature: 94, culture: 84, walkability: 70, tranquility: 68 }),
  city("tucuman", "San Miguel de Tucumán", "Tucumán", "norte", "metropolis", "800 mil–1 M", "USD 520–800", "Centro denso del NOA con gran oferta de servicios, cultura y vida urbana.", { affordability: 77, connectivity: 84, climate: 52, services: 91, mobility: 74, nature: 78, culture: 90, walkability: 79, tranquility: 38 }),
  city("posadas", "Posadas", "Misiones", "litoral", "capital", "300–450 mil", "USD 540–820", "Costanera activa, verde subtropical y servicios de capital fronteriza.", { affordability: 73, connectivity: 80, climate: 48, services: 82, mobility: 72, nature: 85, culture: 78, walkability: 76, tranquility: 64 }),
  city("corrientes", "Corrientes", "Corrientes", "litoral", "capital", "350–500 mil", "USD 520–800", "Identidad cultural marcada y vida sobre el Paraná, con verano intenso.", { affordability: 76, connectivity: 78, climate: 45, services: 82, mobility: 70, nature: 80, culture: 86, walkability: 74, tranquility: 62 }),
  city("santa-rosa", "Santa Rosa", "La Pampa", "centro", "capital", "100–150 mil", "USD 520–790", "Capital pampeana compacta, de ritmo tranquilo y servicios regionales.", { affordability: 77, connectivity: 76, climate: 63, services: 75, mobility: 63, nature: 62, culture: 64, walkability: 75, tranquility: 84 }, expandingConfidence),
  city("viedma", "Viedma", "Río Negro", "patagonia", "capital", "80–120 mil", "USD 580–880", "Capital patagónica junto al río, cercana al mar y de escala cotidiana amable.", { affordability: 68, connectivity: 72, climate: 70, services: 72, mobility: 61, nature: 88, culture: 61, walkability: 73, tranquility: 85 }, expandingConfidence),
  city("trelew", "Trelew", "Chubut", "patagonia", "intermediate", "100–130 mil", "USD 570–860", "Centro de servicios del valle inferior del Chubut, conectado con costa y fauna.", { affordability: 69, connectivity: 76, climate: 65, services: 73, mobility: 70, nature: 83, culture: 62, walkability: 70, tranquility: 76 }, expandingConfidence),
  city("rio-gallegos", "Río Gallegos", "Santa Cruz", "patagonia", "capital", "100–140 mil", "USD 760–1.150", "Capital austral de servicios sólidos, clima exigente y grandes distancias.", { affordability: 43, connectivity: 72, climate: 48, services: 78, mobility: 69, nature: 84, culture: 60, walkability: 62, tranquility: 78 }, expandingConfidence),
  city("formosa", "Formosa", "Formosa", "litoral", "capital", "250–350 mil", "USD 480–730", "Capital ribereña verde, accesible y calurosa, con servicios de alcance provincial.", { affordability: 82, connectivity: 71, climate: 42, services: 75, mobility: 66, nature: 82, culture: 69, walkability: 71, tranquility: 70 }, expandingConfidence),
  city("resistencia", "Resistencia", "Chaco", "litoral", "capital", "350–450 mil", "USD 500–760", "Polo cultural y universitario del nordeste, de clima cálido y escala metropolitana.", { affordability: 79, connectivity: 78, climate: 43, services: 83, mobility: 74, nature: 68, culture: 84, walkability: 73, tranquility: 57 }, expandingConfidence),
  city("santiago-del-estero", "Santiago del Estero", "Santiago del Estero", "norte", "capital", "300–450 mil", "USD 470–720", "Ciudad histórica de costo contenido, servicios de capital y veranos intensos.", { affordability: 84, connectivity: 74, climate: 40, services: 78, mobility: 70, nature: 60, culture: 78, walkability: 74, tranquility: 64 }, expandingConfidence),
  city("catamarca", "San Fernando del Valle de Catamarca", "Catamarca", "norte", "capital", "150–220 mil", "USD 490–750", "Capital de valle y montaña, compacta y tranquila, con menor conectividad aérea.", { affordability: 81, connectivity: 70, climate: 66, services: 75, mobility: 62, nature: 92, culture: 74, walkability: 72, tranquility: 82 }, expandingConfidence),
  city("la-rioja", "La Rioja", "La Rioja", "cuyo", "capital", "180–250 mil", "USD 490–760", "Capital seca y soleada junto a sierras, con costos moderados y ritmo calmo.", { affordability: 80, connectivity: 72, climate: 65, services: 76, mobility: 65, nature: 88, culture: 68, walkability: 72, tranquility: 80 }, expandingConfidence),
  city("concordia", "Concordia", "Entre Ríos", "litoral", "intermediate", "170–230 mil", "USD 490–750", "Ciudad termal sobre el Uruguay, de costo accesible y fuerte identidad regional.", { affordability: 82, connectivity: 75, climate: 54, services: 74, mobility: 67, nature: 82, culture: 70, walkability: 73, tranquility: 72 }, expandingConfidence),
  city("rafaela", "Rafaela", "Santa Fe", "centro", "intermediate", "100–130 mil", "USD 520–780", "Centro productivo compacto, ordenado y conectado dentro del corredor santafesino.", { affordability: 78, connectivity: 80, climate: 58, services: 78, mobility: 72, nature: 60, culture: 66, walkability: 78, tranquility: 78 }, expandingConfidence),
  city("san-martin-de-los-andes", "San Martín de los Andes", "Neuquén", "patagonia", "nature", "35–50 mil", "USD 880–1.350", "Bosque, lago y montaña con calidad paisajística excepcional y vivienda exigente.", { affordability: 28, connectivity: 70, climate: 69, services: 61, mobility: 60, nature: 100, culture: 64, walkability: 67, tranquility: 88 }, expandingConfidence),
];

export const CITY_DATA_SNAPSHOT_ID = "ar-36-2026-08";
export const CITY_CATALOG_SIZE = cities.length;

export const factorLabels = {
  affordability: "Costo compatible",
  connectivity: "Conectividad remota",
  climate: "Clima",
  services: "Servicios",
  mobility: "Movilidad regional",
  nature: "Acceso a naturaleza",
  culture: "Vida cultural",
  walkability: "Vida caminable",
  tranquility: "Tranquilidad",
} as const;
