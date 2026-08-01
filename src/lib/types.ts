export const FACTORS = [
  "affordability",
  "connectivity",
  "climate",
  "services",
  "mobility",
  "nature",
  "culture",
  "walkability",
  "tranquility",
] as const;

export type Factor = (typeof FACTORS)[number];
export type FactorScores = Record<Factor, number>;

export type UserProfile = {
  intent: "exploring" | "this_year" | "leaving" | "comparing";
  workMode: "remote" | "hybrid" | "onsite" | "not_working";
  budget: "low" | "medium" | "high" | "flexible";
  household: "solo" | "couple" | "family" | "prefer_not";
  car: "yes" | "no" | "sometimes";
  weights: Record<Factor, number>;
  narrative?: string;
};

export type City = {
  id: string;
  name: string;
  province: string;
  region: "centro" | "cuyo" | "litoral" | "norte" | "patagonia";
  archetype: "metropolis" | "capital" | "intermediate" | "nature" | "coastal";
  populationLabel: string;
  costRange: string;
  summary: string;
  metrics: FactorScores;
  confidence: {
    sourceQuality: number;
    freshness: number;
    coverage: number;
    geographicFit: number;
  };
  updatedAt: string;
};

export type Contribution = {
  factor: Factor;
  label: string;
  compatibility: number;
  weight: number;
  points: number;
};

export type MatchResult = {
  city: City;
  rank: number;
  match: number;
  confidence: number;
  confidenceLabel: "alta" | "media" | "baja";
  reasons: string[];
  tradeoffs: string[];
  contributions: Contribution[];
  algorithmVersion: "rules-v1.0.0";
  dataSnapshotId: "ar-24-2026-07";
};

export type QuickAnswers = Omit<UserProfile, "weights" | "narrative"> & {
  lifestyle: Array<"nature" | "culture" | "walkability" | "tranquility" | "climate" | "services">;
  tradeoff: "nature" | "culture" | "affordability" | "connectivity" | "balanced";
  narrative?: string;
};
