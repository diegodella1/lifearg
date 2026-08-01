import { z } from "zod";

export const factorSchema = z.enum([
  "affordability", "connectivity", "climate", "services", "mobility",
  "nature", "culture", "walkability", "tranquility",
]);

export const profileSchema = z.object({
  intent: z.enum(["exploring", "this_year", "leaving", "comparing"]),
  workMode: z.enum(["remote", "hybrid", "onsite", "not_working"]),
  budget: z.enum(["low", "medium", "high", "flexible"]),
  household: z.enum(["solo", "couple", "family", "prefer_not"]),
  car: z.enum(["yes", "no", "sometimes"]),
  weights: z.object({
    affordability: z.number().int().min(0).max(5),
    connectivity: z.number().int().min(0).max(5),
    climate: z.number().int().min(0).max(5),
    services: z.number().int().min(0).max(5),
    mobility: z.number().int().min(0).max(5),
    nature: z.number().int().min(0).max(5),
    culture: z.number().int().min(0).max(5),
    walkability: z.number().int().min(0).max(5),
    tranquility: z.number().int().min(0).max(5),
  }),
  narrative: z.string().max(1000).optional(),
});

export const extractionSchema = z.object({
  preferences: z.array(z.object({
    factor: factorSchema,
    weight: z.number().int().min(0).max(5),
    evidence: z.string().max(160),
    confidence: z.number().min(0).max(1),
  })).max(8),
});

export const preferenceProfileV2Schema = z.object({
  intent: z.enum(["exploring", "this_year", "leaving", "comparing"]),
  work: z.object({ mode: z.enum(["remote", "hybrid", "onsite", "not_working"]), internetCriticality: z.number().int().min(0).max(5) }),
  household: z.object({ adultsRange: z.enum(["1", "2", "3_plus"]), children: z.enum(["none", "current", "planned", "prefer_not"]) }),
  budget: z.object({ currency: z.enum(["ARS", "USD"]), monthlyRangeId: z.enum(["low", "medium", "high", "flexible"]), hardLimit: z.boolean() }),
  mobility: z.object({ hasCar: z.enum(["yes", "no", "sometimes"]), avoidCarDependency: z.number().int().min(0).max(5), airportImportance: z.number().int().min(0).max(5) }),
  preferences: z.array(z.object({
    factor: factorSchema,
    value: z.union([z.string().max(80), z.number().finite(), z.boolean()]),
    weight: z.number().int().min(0).max(5),
    hardConstraint: z.boolean(),
    origin: z.enum(["tap", "text", "tradeoff"]),
    extractionConfidence: z.number().min(0).max(1),
    confirmed: z.boolean(),
  })).max(20),
});
