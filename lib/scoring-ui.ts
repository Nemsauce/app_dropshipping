import { clampScore } from "@/lib/formatters";

export type UiTone =
  | "muted"
  | "demand"
  | "opportunity"
  | "competition"
  | "risk"
  | "review"
  | "intelligence";

type MarketOpportunityParams = {
  recommendedMarket?: string | null;
  opportunityCo?: boolean;
  opportunityMx?: boolean;
};

function normalizeValue(value: string | null | undefined): string {
  return value
    ? value.trim().replace(/[-\s]+/g, "_").replace(/\+/g, "AND").toUpperCase()
    : "";
}

export function getDemandTone(score: number): UiTone {
  const normalizedScore = clampScore(score);

  if (normalizedScore <= 29) {
    return "muted";
  }

  if (normalizedScore <= 49) {
    return "review";
  }

  if (normalizedScore <= 69) {
    return "demand";
  }

  return "opportunity";
}

export function getCompetitionTone(score: number): UiTone {
  const normalizedScore = clampScore(score);

  if (normalizedScore <= 25) {
    return "opportunity";
  }

  if (normalizedScore <= 55) {
    return "competition";
  }

  return "risk";
}

export function getConfidenceTone(score: number): UiTone {
  const normalizedScore = clampScore(score);

  if (normalizedScore <= 49) {
    return "risk";
  }

  if (normalizedScore <= 74) {
    return "review";
  }

  return "intelligence";
}

export function getRiskTone(risk: string | null | undefined): UiTone {
  const normalizedRisk = risk?.trim().toUpperCase() ?? "";

  if (normalizedRisk === "LOW") {
    return "opportunity";
  }

  if (normalizedRisk === "MEDIUM") {
    return "competition";
  }

  if (normalizedRisk === "REVIEW") {
    return "review";
  }

  if (normalizedRisk === "HIGH") {
    return "risk";
  }

  return "muted";
}

export function normalizeRecommendationLabel(
  recommendation: string | null | undefined,
): string {
  const normalizedRecommendation = (recommendation ?? "")
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .toUpperCase();

  if (normalizedRecommendation === "PRIORITY TEST") {
    return "PRIORITY TEST";
  }

  if (normalizedRecommendation === "SMALL TEST") {
    return "SMALL TEST";
  }

  if (normalizedRecommendation === "MANUAL REVIEW") {
    return "MANUAL REVIEW";
  }

  if (normalizedRecommendation === "IGNORE") {
    return "IGNORE";
  }

  if (normalizedRecommendation === "REJECT") {
    return "REJECT";
  }

  return normalizedRecommendation || "UNKNOWN";
}

export function getRecommendationTone(
  recommendation: string | null | undefined,
): UiTone {
  const label = normalizeRecommendationLabel(recommendation);

  if (label === "PRIORITY TEST") {
    return "opportunity";
  }

  if (label === "SMALL TEST") {
    return "demand";
  }

  if (label === "MANUAL REVIEW" || label === "REVIEW MANUALLY") {
    return "review";
  }

  if (label === "IGNORE" || label === "REJECT") {
    return "risk";
  }

  return "muted";
}

export function getCompetitionLabel(score: number): string {
  const normalizedScore = clampScore(score);

  if (normalizedScore === 0) {
    return "No visible competition";
  }

  if (normalizedScore <= 25) {
    return "Low visible competition";
  }

  if (normalizedScore <= 55) {
    return "Medium visible competition";
  }

  return "High visible competition";
}

export function getDemandLabel(score: number): string {
  const normalizedScore = clampScore(score);

  if (normalizedScore <= 29) {
    return "No strong signal";
  }

  if (normalizedScore <= 49) {
    return "Weak demand signal";
  }

  if (normalizedScore <= 69) {
    return "Good demand signal";
  }

  return "Strong demand signal";
}

export function getMarketOpportunityLabel({
  recommendedMarket,
  opportunityCo,
  opportunityMx,
}: MarketOpportunityParams): string {
  const normalizedMarket = normalizeValue(recommendedMarket);

  if (normalizedMarket === "CO") {
    return "Test Colombia";
  }

  if (normalizedMarket === "MX") {
    return "Test Mexico";
  }

  if (normalizedMarket === "CO_AND_MX_REVIEW") {
    return "Review both markets";
  }

  if (normalizedMarket === "GLOBAL_DEMAND_BUT_LOCAL_COMPETITION_HIGH") {
    return "Demand exists, competition high";
  }

  if (normalizedMarket === "WEAK_GLOBAL_DEMAND_REVIEW") {
    return "Weak global demand, review manually";
  }

  if (normalizedMarket === "NO_GLOBAL_DEMAND_SIGNAL") {
    return "No global demand signal";
  }

  if (opportunityCo && opportunityMx) {
    return "Review both markets";
  }

  if (opportunityCo) {
    return "Test Colombia";
  }

  if (opportunityMx) {
    return "Test Mexico";
  }

  return "Manual review";
}
