import { factorLabels } from "@/data/cities";
import { distancePenalty, haversineKm, samePlace } from "./geography";
import { FACTORS, type City, type Contribution, type Factor, type MatchResult, type RelocationTolerance, type UserOrigin, type UserProfile } from "./types";

type MatchingContext = { origin?: UserOrigin; tolerance?: RelocationTolerance };

function budgetCompatibility(profile: UserProfile, city: City): number {
  if (profile.budget === "flexible") return 100;
  const minimum = profile.budget === "low" ? 70 : profile.budget === "medium" ? 45 : 20;
  return city.metrics.affordability >= minimum ? 100 : Math.max(0, 100 - (minimum - city.metrics.affordability) * 3);
}

function confidenceFor(city: City): number {
  const values = Object.values(city.confidence);
  return Math.round(Math.pow(values.reduce((total, value) => total * value / 100, 1), 1 / values.length) * 100);
}

function labelConfidence(score: number): MatchResult["confidenceLabel"] {
  return score >= 78 ? "alta" : score >= 58 ? "media" : "baja";
}

function contribution(profile: UserProfile, city: City, factor: Factor): Contribution {
  const compatibility = factor === "affordability" ? budgetCompatibility(profile, city) : city.metrics[factor];
  const weight = profile.weights[factor];
  return { factor, label: factorLabels[factor], compatibility, weight, points: compatibility * weight };
}

function buildResult(profile: UserProfile, city: City, context: MatchingContext): Omit<MatchResult, "rank"> {
  const contributions = FACTORS.map((factor) => contribution(profile, city, factor));
  const weightSum = contributions.reduce((sum, item) => sum + item.weight, 0);
  const baseMatch = Math.round(contributions.reduce((sum, item) => sum + item.points, 0) / weightSum);
  const distanceKm = context.origin ? haversineKm(context.origin.coordinates, city.coordinates) : null;
  const relocationPenalty = distanceKm !== null && context.tolerance ? distancePenalty(distanceKm, context.tolerance) : 0;
  const match = Math.max(0, baseMatch - relocationPenalty);
  const confidence = confidenceFor(city);
  const ordered = [...contributions].sort((a, b) => b.points - a.points);
  const reasons = ordered.filter((item) => item.compatibility >= 65).slice(0, 3).map((item) => item.label);
  const tradeoffs = [...contributions]
    .sort((a, b) => a.compatibility - b.compatibility)
    .filter((item) => item.compatibility < 65)
    .slice(0, 2)
    .map((item) => `${item.label}: menor ajuste para tu perfil`);

  return {
    city,
    match,
    baseMatch,
    distanceKm,
    distancePenalty: relocationPenalty,
    rentalAdjustment: 0,
    isCurrentCity: context.origin ? samePlace(city, context.origin) : false,
    confidence,
    confidenceLabel: labelConfidence(confidence),
    reasons: reasons.length === 3 ? reasons : ordered.slice(0, 3).map((item) => item.label),
    tradeoffs: tradeoffs.length ? tradeoffs : ["Sin trade-offs críticos detectados"],
    contributions,
    algorithmVersion: "rules-v1.1.0",
    dataSnapshotId: "ar-24-2026-08",
  };
}

export function rankCities(profile: UserProfile, sourceCities: City[], context: MatchingContext = {}): MatchResult[] {
  const eligibleCities = profile.budget === "low"
    ? sourceCities.filter((city) => city.metrics.affordability >= 70)
    : sourceCities;
  const scored = eligibleCities.map((city) => buildResult(profile, city, context)).sort((a, b) => b.match - a.match || b.confidence - a.confidence || a.city.id.localeCompare(b.city.id));
  const selected: typeof scored = [];

  for (const candidate of scored) {
    const sameArchetype = selected.filter((item) => item.city.archetype === candidate.city.archetype).length;
    if (sameArchetype < 2 || selected.length >= 4) selected.push(candidate);
    if (selected.length === 5) break;
  }

  if (selected.length < 5) {
    for (const candidate of scored) {
      if (!selected.includes(candidate)) selected.push(candidate);
      if (selected.length === 5) break;
    }
  }

  return selected
    .sort((a, b) => b.match - a.match)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}
