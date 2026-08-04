import { readFile } from "node:fs/promises";

const cityText = await readFile(new URL("../src/data/cities.ts", import.meta.url), "utf8");
const sourceText = await readFile(new URL("../src/data/sources.ts", import.meta.url), "utf8");
const requiredFactors = ["affordability", "connectivity", "climate", "services", "mobility", "nature", "culture", "walkability", "tranquility"];
const cityLines = cityText.split("\n").filter((line) => line.trimStart().startsWith("city(\""));
const cityIds = cityLines.map((line) => line.match(/city\("([^"]+)"/)?.[1]).filter(Boolean);
const sourceIds = [...sourceText.matchAll(/\{ id: "([^"]+)"/g)].map((match) => match[1]);
const referencedSourceIds = [...sourceText.matchAll(/(?:affordability|connectivity|climate|services|mobility|nature|culture|walkability|tranquility): \[([^\]]+)\]/g)]
  .flatMap((match) => [...match[1].matchAll(/"([^"]+)"/g)].map((idMatch) => idMatch[1]));

function duplicates(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

if (cityIds.length < 30) throw new Error(`Catalog regression: expected at least 30 cities, found ${cityIds.length}`);
if (duplicates(cityIds).length) throw new Error(`Duplicate city ids: ${duplicates(cityIds).join(", ")}`);
if (duplicates(sourceIds).length) throw new Error(`Duplicate source ids: ${duplicates(sourceIds).join(", ")}`);

for (const line of cityLines) {
  const cityId = line.match(/city\("([^"]+)"/)?.[1] ?? "unknown";
  const missingFactors = requiredFactors.filter((factor) => !line.includes(`${factor}:`));
  if (missingFactors.length) throw new Error(`${cityId} missing factors: ${missingFactors.join(", ")}`);
  for (const score of [...line.matchAll(/(?:affordability|connectivity|climate|services|mobility|nature|culture|walkability|tranquility): (\d+)/g)].map((match) => Number(match[1]))) {
    if (score < 0 || score > 100) throw new Error(`${cityId} has score outside 0..100: ${score}`);
  }
  if (!cityText.includes(`"${cityId}": ["`)) throw new Error(`${cityId} has no Georef mapping`);
}

const unknownSourceIds = [...new Set(referencedSourceIds.filter((id) => !sourceIds.includes(id)))];
if (unknownSourceIds.length) throw new Error(`Unknown factor source ids: ${unknownSourceIds.join(", ")}`);
if (sourceIds.length < 15) throw new Error(`Source regression: expected at least 15 sources, found ${sourceIds.length}`);

console.log(`Quality gate OK: ${cityIds.length} cities, ${requiredFactors.length} factors, ${sourceIds.length} sources.`);
