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
  for (const factor of answers.lifestyle) weights[factor] = 5;
  if (answers.workMode === "remote") weights.connectivity = 5;
  if (answers.household === "family") weights.services = 5;
  if (answers.car === "no") weights.walkability = 5;
  if (answers.budget === "low") weights.affordability = 5;
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
