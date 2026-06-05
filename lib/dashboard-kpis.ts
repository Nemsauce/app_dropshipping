import type { Kpi, ProductOpportunity } from "@/lib/mock-data";
import { normalizeRecommendationLabel } from "@/lib/scoring-ui";

function formatCompactNumber(value: number): string {
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }

  if (absoluteValue >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }

  return String(value);
}

function buildBars(seed: number): number[] {
  const normalizedSeed = Math.max(0, Math.floor(seed));

  if (normalizedSeed === 0) {
    return [12, 16, 14, 18, 15, 17, 13];
  }

  const lift = Math.min(28, Math.floor(Math.log10(normalizedSeed + 1) * 10));

  return Array.from({ length: 7 }, (_, index) => {
    const wave = (normalizedSeed * (index + 5) + index * 13) % 54;

    return Math.min(92, 18 + lift + wave);
  });
}

function isRejectedRecommendation(product: ProductOpportunity): boolean {
  const recommendation = normalizeRecommendationLabel(product.recommendation);

  return recommendation === "IGNORE" || recommendation === "REJECT";
}

export function buildDashboardKpis(products: ProductOpportunity[]): Kpi[] {
  const total = products.length;
  const priorityCandidates = products.filter(
    (product) =>
      normalizeRecommendationLabel(product.recommendation) === "PRIORITY TEST",
  ).length;
  const actionableProducts = products.filter(
    (product) => !isRejectedRecommendation(product),
  );
  const coOpportunities = actionableProducts.filter(
    (product) =>
      product.targetMarket === "CO" || product.targetMarket === "CO + MX",
  ).length;
  const mxOpportunities = actionableProducts.filter(
    (product) =>
      product.targetMarket === "MX" || product.targetMarket === "CO + MX",
  ).length;
  const highCompetition = products.filter(
    (product) => product.coCompetition >= 70 || product.mxCompetition >= 70,
  ).length;
  const policyRisk = products.filter(
    (product) => product.risk === "Review" || product.risk === "High",
  ).length;

  return [
    {
      label: "Analyzed Products",
      value: formatCompactNumber(total),
      trend: total > 0 ? "Live product research dataset" : "No products available",
      tone: "demand",
      bars: buildBars(total),
    },
    {
      label: "Priority Candidates",
      value: formatCompactNumber(priorityCandidates),
      trend: `${formatCompactNumber(priorityCandidates)} products ready for controlled review`,
      tone: "opportunity",
      bars: buildBars(priorityCandidates),
    },
    {
      label: "CO Opportunities",
      value: formatCompactNumber(coOpportunities),
      trend: "Colombia test candidates",
      tone: "opportunity",
      bars: buildBars(coOpportunities),
    },
    {
      label: "MX Opportunities",
      value: formatCompactNumber(mxOpportunities),
      trend: "Mexico test candidates",
      tone: "demand",
      bars: buildBars(mxOpportunities),
    },
    {
      label: "High Competition",
      value: formatCompactNumber(highCompetition),
      trend: "Visible competition needs review",
      tone: "competition",
      bars: buildBars(highCompetition),
    },
    {
      label: "Policy Risk",
      value: formatCompactNumber(policyRisk),
      trend: "Products needing claim or policy review",
      tone: "risk",
      bars: buildBars(policyRisk),
    },
  ];
}
