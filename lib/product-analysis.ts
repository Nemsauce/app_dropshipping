import { clampScore, formatMarketLabel } from "@/lib/formatters";
import type { ProductOpportunity, Signal } from "@/lib/mock-data";
import { normalizeRecommendationLabel } from "@/lib/scoring-ui";

type ProductDetailSummary = {
  provider: string;
  tier: string;
  launchWindow: string;
  policyRisk: string;
  recommendedMarket: string;
  suggestedAction: string;
};

function parseDisplayNumber(value: string): number {
  const normalizedValue = value.replace(/[^\d.,-]/g, "");

  if (!normalizedValue) {
    return 0;
  }

  const commaCount = (normalizedValue.match(/,/g) ?? []).length;
  const dotCount = (normalizedValue.match(/\./g) ?? []).length;
  let numericValue = normalizedValue;

  if (commaCount > 0 && dotCount > 0) {
    numericValue = normalizedValue.replace(/,/g, "");
  } else if (commaCount > 1) {
    numericValue = normalizedValue.replace(/,/g, "");
  } else if (dotCount > 1) {
    numericValue = normalizedValue.replace(/\./g, "");
  } else if (commaCount === 1 && dotCount === 0) {
    numericValue = /,\d{3}$/.test(normalizedValue)
      ? normalizedValue.replace(",", "")
      : normalizedValue.replace(",", ".");
  } else if (dotCount === 1 && /\.\d{3}$/.test(normalizedValue)) {
    numericValue = normalizedValue.replace(".", "");
  }

  const parsedValue = Number(numericValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function getMarginValue(margin: string): number {
  return parseDisplayNumber(margin);
}

function getMarginPotentialScore(product: ProductOpportunity): number {
  const margin = getMarginValue(product.margin);

  if (margin >= 60) {
    return 90;
  }

  if (margin >= 45) {
    return 75;
  }

  if (margin >= 35) {
    return 55;
  }

  return 30;
}

function getMarginTone(value: number): Signal["tone"] {
  if (value >= 70) {
    return "opportunity";
  }

  if (value >= 50) {
    return "review";
  }

  return "risk";
}

function getCompetitionTone(value: number): Signal["tone"] {
  if (value <= 25) {
    return "opportunity";
  }

  if (value <= 55) {
    return "competition";
  }

  return "risk";
}

function getPolicyRiskValue(risk: ProductOpportunity["risk"]): number {
  if (risk === "Low") {
    return 20;
  }

  if (risk === "Medium") {
    return 45;
  }

  if (risk === "Review") {
    return 65;
  }

  return 90;
}

function getPolicyRiskTone(risk: ProductOpportunity["risk"]): Signal["tone"] {
  if (risk === "Low") {
    return "opportunity";
  }

  if (risk === "Medium") {
    return "review";
  }

  return "risk";
}

function getSupplyReadinessValue(stock: string): number {
  const stockValue = parseDisplayNumber(stock);

  if (stockValue >= 100) {
    return 85;
  }

  if (stockValue >= 50) {
    return 70;
  }

  if (stockValue >= 20) {
    return 50;
  }

  return 25;
}

function getSupplyReadinessTone(value: number): Signal["tone"] {
  if (value >= 70) {
    return "intelligence";
  }

  if (value >= 50) {
    return "review";
  }

  return "risk";
}

function getDataConfidenceTone(value: number): Signal["tone"] {
  if (value >= 75) {
    return "intelligence";
  }

  if (value >= 50) {
    return "review";
  }

  return "risk";
}

function addReason(reasons: string[], reason: string) {
  if (!reasons.includes(reason)) {
    reasons.push(reason);
  }
}

export function buildSignalsForProduct(product: ProductOpportunity): Signal[] {
  const globalDemand = clampScore(product.globalDemand);
  const coCompetition = clampScore(product.coCompetition);
  const mxCompetition = clampScore(product.mxCompetition);
  const marginPotential = getMarginPotentialScore(product);
  const confidence = clampScore(product.confidence);
  const policyRisk = getPolicyRiskValue(product.risk);
  const supplyReadiness = getSupplyReadinessValue(product.stock);

  return [
    {
      label: "Global Demand",
      value: globalDemand,
      tone: globalDemand >= 70 ? "opportunity" : "demand",
    },
    {
      label: "CO Competition",
      value: coCompetition,
      tone: getCompetitionTone(coCompetition),
    },
    {
      label: "MX Competition",
      value: mxCompetition,
      tone: getCompetitionTone(mxCompetition),
    },
    {
      label: "Margin Potential",
      value: marginPotential,
      tone: getMarginTone(marginPotential),
    },
    {
      label: "Data Confidence",
      value: confidence,
      tone: getDataConfidenceTone(confidence),
    },
    {
      label: "Policy Risk",
      value: policyRisk,
      tone: getPolicyRiskTone(product.risk),
    },
    {
      label: "Supply Readiness",
      value: supplyReadiness,
      tone: getSupplyReadinessTone(supplyReadiness),
    },
  ];
}

export function buildRecommendationReasons(
  product: ProductOpportunity,
): string[] {
  const reasons: string[] = [];
  const recommendation = normalizeRecommendationLabel(product.recommendation);
  const market = formatMarketLabel(product.targetMarket);
  const margin = getMarginValue(product.margin);
  const stock = parseDisplayNumber(product.stock);
  const isRejected = recommendation === "IGNORE" || recommendation === "REJECT";

  if (isRejected) {
    addReason(
      reasons,
      `${recommendation} recommendation means this product is not prioritized for testing.`,
    );
  }

  if (product.globalDemand >= 70) {
    addReason(reasons, "Strong global demand signal");
  } else if (product.globalDemand >= 50) {
    addReason(reasons, "Good global demand signal, but not a top demand tier");
  } else {
    addReason(reasons, "Weak global demand signal needs manual review");
  }

  addReason(reasons, `${market} is the current recommended market context`);

  if (product.mxCompetition < product.coCompetition) {
    addReason(reasons, "Mexico has lower visible competition than Colombia");
  } else if (product.coCompetition < product.mxCompetition) {
    addReason(reasons, "Colombia has lower visible competition than Mexico");
  } else if (product.coCompetition > 55 && product.mxCompetition > 55) {
    addReason(reasons, "Both markets may deserve manual review");
  } else {
    addReason(reasons, "Visible competition is similar across Colombia and Mexico");
  }

  if (product.coCompetition > 55 && product.mxCompetition > 55) {
    addReason(
      reasons,
      "High visible competition in both markets reduces test priority",
    );
  }

  if (margin >= 45) {
    addReason(reasons, "Margin appears strong for a controlled test");
  } else if (margin >= 35) {
    addReason(reasons, "Margin appears acceptable but should be validated");
  } else {
    addReason(reasons, "Margin potential appears limited");
  }

  if (stock >= 50) {
    addReason(reasons, "Stock appears acceptable");
  } else {
    addReason(reasons, "Stock may limit test readiness");
  }

  if (product.risk === "Review" || product.risk === "High") {
    addReason(reasons, "Product needs policy or claim review");
  }

  if (isRejected && product.risk !== "High") {
    addReason(reasons, "Current signal mix is not strong enough to prioritize");
  }

  const guardrailReason =
    "Recommendation is based on visible ad signals, not guaranteed sales";

  addReason(reasons, guardrailReason);

  if (reasons.length <= 6) {
    return reasons;
  }

  return [...reasons.slice(0, 5), guardrailReason];
}

export function buildSelectedProductDetails(
  product: ProductOpportunity,
): ProductDetailSummary {
  const recommendation = normalizeRecommendationLabel(product.recommendation);
  const market = formatMarketLabel(product.targetMarket);
  let launchWindow = "Review before launch";
  let suggestedAction = "Review policy, supplier, and ad proof before testing";

  if (recommendation === "PRIORITY TEST") {
    launchWindow = "3-7 days";
    suggestedAction = `Prepare a controlled test in ${market}`;
  } else if (recommendation === "SMALL TEST") {
    launchWindow = "7-10 days";
    suggestedAction = `Validate creatives, then run a small test in ${market}`;
  } else if (recommendation === "IGNORE" || recommendation === "REJECT") {
    launchWindow = "Not recommended";
    suggestedAction = "Do not test until the signal improves";
  }

  return {
    provider: product.provider,
    tier: product.tier,
    launchWindow,
    policyRisk: product.risk,
    recommendedMarket: market,
    suggestedAction,
  };
}
