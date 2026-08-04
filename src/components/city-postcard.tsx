import type { CSSProperties } from "react";
import type { City } from "@/lib/types";

const regionLabels: Record<City["region"], string> = {
  centro: "LLANURA CENTRAL",
  cuyo: "CORDILLERA",
  litoral: "RÍOS DEL LITORAL",
  norte: "NORTE ARGENTINO",
  patagonia: "SUR PATAGÓNICO",
};

export function CityPostcard({ city, compact = false }: { city: City; compact?: boolean }) {
  const longitudePosition = Math.round(((city.coordinates.lon + 74) / 21) * 64 + 18);
  const latitudePosition = Math.round(((city.coordinates.lat + 56) / 35) * 45 + 16);
  const style = {
    "--postcard-x": `${Math.max(14, Math.min(82, longitudePosition))}%`,
    "--postcard-y": `${Math.max(12, Math.min(62, latitudePosition))}%`,
  } as CSSProperties;

  return (
    <figure
      aria-label={`Postal ilustrada de ${city.name}, ${city.province}`}
      className={`city-postcard city-postcard--${city.region} city-postcard--${city.archetype} ${compact ? "city-postcard--compact" : ""}`}
      role="img"
      style={style}
    >
      <div className="city-postcard__scene" aria-hidden="true">
        <span className="city-postcard__sun" />
        <span className="city-postcard__land city-postcard__land--back" />
        <span className="city-postcard__land city-postcard__land--front" />
        <span className="city-postcard__route" />
        <b>{city.name.slice(0, 2).toLocaleUpperCase("es")}</b>
      </div>
      <figcaption><span>{regionLabels[city.region]}</span><small>Ilustración editorial · coordenadas Georef</small></figcaption>
    </figure>
  );
}
