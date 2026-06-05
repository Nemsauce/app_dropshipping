import { clampScore } from "@/lib/formatters";
import type { ProductOpportunity } from "@/lib/mock-data";
import { normalizeRecommendationLabel } from "@/lib/scoring-ui";

export type HeroMetric = {
  label: string;
  value: string;
  tone:
    | "opportunity"
    | "demand"
    | "review"
    | "risk"
    | "competition"
    | "intelligence";
};

function getAverage(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function isRejectedRecommendation(product: ProductOpportunity): boolean {
  const recommendation = normalizeRecommendationLabel(product.recommendation);

  return recommendation === "IGNORE" || recommendation === "REJECT";
}

function isManualReviewRecommendation(product: ProductOpportunity): boolean {
  return normalizeRecommendationLabel(product.recommendation) === "MANUAL REVIEW";
}

function getQueueScoreTone(score: number): HeroMetric["tone"] {
  if (score >= 75) {
    return "opportunity";
  }

  if (score >= 50) {
    return "demand";
  }

  return "review";
}

function buildQueueScoreMetric(products: ProductOpportunity[]): HeroMetric {
  const productScores = products.map((product) => {
    const competitionOpportunity =
      100 -
      getAverage([
        clampScore(product.coCompetition),
        clampScore(product.mxCompetition),
      ]);

    return getAverage([
      clampScore(product.globalDemand),
      clampScore(product.confidence),
      Math.min(100, Math.max(0, competitionOpportunity)),
    ]);
  });
  const queueScore = Math.min(100, Math.max(0, getAverage(productScores)));

  return {
    label: "Queue Score",
    value: queueScore.toFixed(1),
    tone: getQueueScoreTone(queueScore),
  };
}

function buildMarketSplitMetric(products: ProductOpportunity[]): HeroMetric {
  const actionableProducts = products.filter(
    (product) => !isRejectedRecommendation(product),
  );
  const coCount = actionableProducts.filter(
    (product) =>
      product.targetMarket === "CO" || product.targetMarket === "CO + MX",
  ).length;
  const mxCount = actionableProducts.filter(
    (product) =>
      product.targetMarket === "MX" || product.targetMarket === "CO + MX",
  ).length;
  const splitTotal = coCount + mxCount;

  if (splitTotal === 0) {
    return {
      label: "CO/MX Split",
      value: "0/0",
      tone: "demand",
    };
  }

  const coPercent = Math.round((coCount / splitTotal) * 100);
  const mxPercent = 100 - coPercent;

  return {
    label: "CO/MX Split",
    value: `${coPercent}/${mxPercent}`,
    tone: "demand",
  };
}

function buildReviewLoadMetric(products: ProductOpportunity[]): HeroMetric {
  const reviewLoad = products.filter(
    (product) =>
      product.risk === "Review" ||
      product.risk === "High" ||
      isManualReviewRecommendation(product),
  ).length;

  return {
    label: "Review Load",
    value: String(reviewLoad),
    tone:
      reviewLoad >= 10 ? "risk" : reviewLoad >= 1 ? "review" : "opportunity",
  };
}

export function buildHeroMetrics(products: ProductOpportunity[]): HeroMetric[] {
  return [
    buildQueueScoreMetric(products),
    buildMarketSplitMetric(products),
    buildReviewLoadMetric(products),
  ];
}
