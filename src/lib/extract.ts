import OpenAI from "openai";
import { extractionSchema } from "./schema";

const keywordMap = {
  nature: ["naturaleza", "montaña", "mar", "verde", "sender", "aire libre"],
  culture: ["cultura", "teatro", "cine", "música", "restaurante", "noche"],
  walkability: ["caminar", "caminable", "sin auto", "bicicleta"],
  tranquility: ["tranquilo", "silencio", "calma", "seguro"],
  climate: ["clima", "fresco", "frío", "calor", "templado"],
  connectivity: ["internet", "remoto", "wifi", "conectividad"],
  affordability: ["barato", "económico", "presupuesto", "alquiler"],
  services: ["hospital", "salud", "escuela", "servicios"],
} as const;

export function extractLocally(text: string) {
  const normalized = text.toLocaleLowerCase("es");
  return extractionSchema.parse({
    preferences: Object.entries(keywordMap)
      .filter(([, words]) => words.some((word) => normalized.includes(word)))
      .slice(0, 8)
      .map(([factor, words]) => ({
        factor,
        weight: 5,
        evidence: words.find((word) => normalized.includes(word)) ?? factor,
        confidence: 0.72,
      })),
  });
}

export async function extractPreferences(text: string, aiConsent = false) {
  if (!process.env.OPENAI_API_KEY || !aiConsent) return { ...extractLocally(text), mode: "local" as const };

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5.6-luna",
      input: [
        { role: "system", content: "Extraé solo preferencias explícitas sobre dónde vivir. No infieras datos sensibles. Respondé JSON válido con preferences: factor, weight 0-5, evidence breve, confidence 0-1." },
        { role: "user", content: text },
      ],
      text: { format: { type: "json_schema", name: "preferences", strict: true, schema: { type: "object", additionalProperties: false, properties: { preferences: { type: "array", maxItems: 8, items: { type: "object", additionalProperties: false, properties: { factor: { type: "string", enum: ["affordability", "connectivity", "climate", "services", "mobility", "nature", "culture", "walkability", "tranquility"] }, weight: { type: "integer", minimum: 0, maximum: 5 }, evidence: { type: "string" }, confidence: { type: "number", minimum: 0, maximum: 1 } }, required: ["factor", "weight", "evidence", "confidence"] } } }, required: ["preferences"] } } },
    });
    return { ...extractionSchema.parse(JSON.parse(response.output_text)), mode: "openai" as const };
  } catch {
    return { ...extractLocally(text), mode: "fallback" as const };
  }
}
