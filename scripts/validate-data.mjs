import { readFile } from "node:fs/promises";

const text = await readFile(new URL("../src/data/cities.ts", import.meta.url), "utf8");
const cityCalls = (text.match(/city\("/g) ?? []).length;
const requiredFactors = ["affordability", "connectivity", "climate", "services", "mobility", "nature", "culture", "walkability", "tranquility"];
const missing = requiredFactors.filter((factor) => !text.includes(`${factor}:`));
if (cityCalls !== 24) throw new Error(`Expected 24 cities, found ${cityCalls}`);
if (missing.length) throw new Error(`Missing factors: ${missing.join(", ")}`);
console.log(`Quality gate OK: ${cityCalls} cities, ${requiredFactors.length} factors.`);
