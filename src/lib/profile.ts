import type { Factor, QuickAnswers, UserProfile } from "./types";

const baseWeights: Record<Factor, number> = {
  affordability: 3,
  connectivity: 3,
  climate: 2,
  services: 2,
  mobility: 2,
  nature: 2,
  culture: 2,
  walkability: 2,
  tranquility: 2,
};

export function buildProfileFromAnswers(answers: QuickAnswers): UserProfile {
  const weights = { ...baseWeights };

  if (answers.workMode === "remote") weights.connectivity = 5;
  if (answers.workMode === "hybrid") {
    weights.connectivity = 4;
    weights.mobility = 4;
  }
  if (answers.workMode === "onsite") {
    weights.connectivity = 2;
    weights.mobility = 5;
  }
  if (answers.workMode === "not_working") weights.connectivity = 2;

  if (answers.household === "family") weights.services = 5;
  if (answers.car === "no") weights.walkability = 5;
  if (answers.car === "sometimes") weights.mobility = Math.max(weights.mobility, 4);
  if (answers.car === "yes") weights.mobility = 5;

  if (answers.budget === "low") weights.affordability = 5;
  if (answers.budget === "medium") weights.affordability = 4;
  if (answers.budget === "high") weights.affordability = 2;
  if (answers.budget === "flexible") weights.affordability = 1;

  for (const factor of answers.lifestyle) weights[factor] = 5;
  for (const [factor, weight] of Object.entries(answers.extractedWeights ?? {})) {
    const typedFactor = factor as Factor;
    weights[typedFactor] = Math.max(weights[typedFactor], weight ?? 0);
  }
  if (answers.tradeoff !== "balanced") weights[answers.tradeoff] = 5;

  return {
    intent: answers.intent,
    workMode: answers.workMode,
    budget: answers.budget,
    household: answers.household,
    car: answers.car,
    weights,
    narrative: answers.narrative,
  };
}
