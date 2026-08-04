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

export type GeoPoint = { lat: number; lon: number };
export type RelocationTolerance = "nearby" | "regional" | "far" | "anywhere";
export type UserOrigin = {
  georefId: string;
  locality: string;
  province: string;
  provinceId: string;
  coordinates: GeoPoint;
};

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
  georefId: string;
  name: string;
  province: string;
  region: "centro" | "cuyo" | "litoral" | "norte" | "patagonia";
  archetype: "metropolis" | "capital" | "intermediate" | "nature" | "coastal";
  populationLabel: string;
  costRange: string;
  summary: string;
  coordinates: GeoPoint;
  metrics: FactorScores;
  confidence: {
    sourceQuality: number;
    freshness: number;
    coverage: number;
    geographicFit: number;
  };
  updatedAt: string;
  sourceIds: Partial<Record<Factor, string[]>>;
};

export type PreferenceValue = string | number | boolean;

export type ConfirmedPreference = {
  factor: Factor;
  value: PreferenceValue;
  weight: number;
  hardConstraint: boolean;
  origin: "tap" | "text" | "tradeoff";
  extractionConfidence: number;
  confirmed: boolean;
};

export type PreferenceProfileV2 = {
  intent: UserProfile["intent"];
  work: { mode: UserProfile["workMode"]; internetCriticality: number };
  household: { adultsRange: "1" | "2" | "3_plus"; children: "none" | "current" | "planned" | "prefer_not" };
  budget: { currency: "ARS" | "USD"; monthlyRangeId: "low" | "medium" | "high" | "flexible"; hardLimit: boolean };
  mobility: { hasCar: UserProfile["car"]; avoidCarDependency: number; airportImportance: number };
  preferences: ConfirmedPreference[];
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
  baseMatch: number;
  distanceKm: number | null;
  distancePenalty: number;
  rentalAdjustment: number;
  isCurrentCity: boolean;
  confidence: number;
  confidenceLabel: "alta" | "media" | "baja";
  reasons: string[];
  tradeoffs: string[];
  contributions: Contribution[];
  algorithmVersion: string;
  dataSnapshotId: string;
};

export type QuickAnswers = Omit<UserProfile, "weights" | "narrative"> & {
  lifestyle: Factor[];
  tradeoff: "nature" | "culture" | "affordability" | "connectivity" | "balanced";
  narrative?: string;
  extractedWeights?: Partial<Record<Factor, number>>;
  origin?: UserOrigin;
  relocationTolerance?: RelocationTolerance;
};

export type RentalPreferences = {
  mode: "long_term" | "temporary" | "both";
  propertyType: "apartment" | "house" | "any";
  bedrooms: "studio" | "1" | "2" | "3_plus" | "any";
  currency: "ARS" | "USD";
  maxMonthlyRent?: number;
};
