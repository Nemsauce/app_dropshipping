import { formatCurrencyValue, formatPercent } from "@/lib/formatters";
import type {
  ProductOpportunity,
  Recommendation,
  TargetMarket,
} from "@/lib/mock-data";
import type { SupabaseProductRow } from "@/lib/supabase/types";

type Currency = ProductOpportunity["currency"];
type ProductRisk = ProductOpportunity["risk"];
type ThumbnailTone = ProductOpportunity["thumbnailTone"];

const REVIEW_TERMS = [
  "salud",
  "bienestar",
  "rodillera",
  "verruga",
  "dolor",
  "piel",
  "acido",
  "suplemento",
  "sexual",
  "adelgaz",
  "faja",
  "acne",
  "varices",
  "magnetic",
  "magnetica",
];

function normalizeValue(value: string | null | undefined): string {
  return value
    ? value.trim().replace(/[-\s]+/g, "_").replace(/\+/g, "AND").toUpperCase()
    : "";
}

function textIncludesReviewTerm(...values: Array<string | null>): boolean {
  const searchableText = values
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return REVIEW_TERMS.some((term) => searchableText.includes(term));
}

export function toNumber(value: number | string | null | undefined): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const rawValue = value.trim();

  if (!rawValue) {
    return null;
  }

  const numericValue = rawValue.replace(/[^\d,.-]/g, "");
  const commaCount = (numericValue.match(/,/g) ?? []).length;
  const dotCount = (numericValue.match(/\./g) ?? []).length;
  let normalizedValue = numericValue;

  if (commaCount > 0 && dotCount > 0) {
    normalizedValue = numericValue.replace(/,/g, "");
  } else if (commaCount === 1 && dotCount === 0) {
    normalizedValue = /,\d{3}$/.test(numericValue)
      ? numericValue.replace(",", "")
      : numericValue.replace(",", ".");
  } else if (commaCount > 1 && dotCount === 0) {
    normalizedValue = numericValue.replace(/,/g, "");
  } else if (commaCount === 0 && dotCount === 1 && /\.\d{3}$/.test(numericValue)) {
    normalizedValue = numericValue.replace(".", "");
  } else if (dotCount > 1) {
    normalizedValue = numericValue.replace(/\./g, "");
  }

  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

export function inferTargetMarket(row: SupabaseProductRow): TargetMarket {
  const recommendedMarket = normalizeValue(row.recommended_market);
  const imageUrl = row.imagen?.toLowerCase() ?? "";

  if (recommendedMarket === "MX") {
    return "MX";
  }

  if (recommendedMarket === "CO") {
    return "CO";
  }

  if (row.opportunity_co && row.opportunity_mx) {
    return "CO + MX";
  }

  if (imageUrl.includes("/mexico/")) {
    return "MX";
  }

  if (imageUrl.includes("/colombia/")) {
    return "CO";
  }

  return "CO + MX";
}

export function inferCurrency(row: SupabaseProductRow): Currency {
  const targetMarket = inferTargetMarket(row);

  if (targetMarket === "MX") {
    return "MXN";
  }

  if (targetMarket === "CO") {
    return "COP";
  }

  return "MULTI";
}

export function getDisplayPrice(row: SupabaseProductRow): string {
  const currency = inferCurrency(row);

  return formatCurrencyValue({
    value: toNumber(row.precio_sugerido),
    currency,
    fallback: currency === "MULTI" ? "Multi-currency" : undefined,
  });
}

export function getDisplayProfit(row: SupabaseProductRow): string {
  const currency = inferCurrency(row);

  return formatCurrencyValue({
    value: toNumber(row.ganancia),
    currency,
    fallback: currency === "MULTI" ? "Multi-currency" : undefined,
  });
}

export function getRiskFromRow(row: SupabaseProductRow): ProductRisk {
  const recommendation = normalizeValue(row.final_recommendation);

  if (recommendation.includes("REJECT") || recommendation.includes("IGNORE")) {
    return "High";
  }

  if (textIncludesReviewTerm(row.categoria, row.nombre)) {
    return "Review";
  }

  return "Low";
}

export function getThumbnailTone(row: SupabaseProductRow): ThumbnailTone {
  const recommendation = normalizeValue(row.final_recommendation);
  const risk = getRiskFromRow(row);

  if (
    recommendation === "PRIORITY_TEST" ||
    recommendation === "PRIORITY_TEST_CANDIDATE" ||
    row.winner_candidate
  ) {
    return "green";
  }

  if (recommendation === "SMALL_TEST") {
    return "green";
  }

  if (recommendation === "MANUAL_REVIEW" || recommendation === "REVIEW_MANUALLY") {
    return "yellow";
  }

  if (
    recommendation.includes("IGNORE") ||
    recommendation.includes("REJECT") ||
    risk === "High"
  ) {
    return "red";
  }

  if (risk === "Review") {
    return "purple";
  }

  return "blue";
}

function getConfidenceScore(row: SupabaseProductRow): number {
  const confidence = normalizeValue(row.global_meta_product_match_confidence);

  if (confidence === "HIGH") {
    return 90;
  }

  if (confidence === "MEDIUM") {
    return 70;
  }

  if (confidence === "LOW") {
    return 35;
  }

  return (
    toNumber(row.global_meta_ads_score) ??
    toNumber(row.ads_score) ??
    0
  );
}

function getRecommendation(row: SupabaseProductRow): Recommendation {
  const recommendation = normalizeValue(row.final_recommendation);

  if (recommendation === "PRIORITY_TEST") {
    return "PRIORITY_TEST";
  }

  if (recommendation === "SMALL_TEST") {
    return "SMALL_TEST";
  }

  if (
    recommendation === "MANUAL_REVIEW" ||
    recommendation === "REVIEW_MANUALLY"
  ) {
    return "MANUAL_REVIEW";
  }

  if (recommendation === "IGNORE_FOR_NOW" || recommendation === "IGNORE") {
    return "IGNORE";
  }

  if (recommendation === "REJECT") {
    return "REJECT";
  }

  if (row.winner_candidate) {
    return "PRIORITY_TEST";
  }

  return "IGNORE";
}

export function mapSupabaseProductToOpportunity(
  row: SupabaseProductRow,
): ProductOpportunity {
  const targetMarket = inferTargetMarket(row);
  const currency = inferCurrency(row);
  const stock = row.stock ?? 0;

  return {
    id: row.id,
    name: row.nombre || "Unnamed product",
    category: row.categoria || "Uncategorized",
    provider: row.proveedor || "Unknown provider",
    tier: row.tier || "Unknown",
    targetMarket,
    currency,
    displayPrice: getDisplayPrice(row),
    displayProfit: getDisplayProfit(row),
    globalDemand: toNumber(row.global_meta_ads_score) ?? toNumber(row.ads_score) ?? 0,
    coCompetition: toNumber(row.co_visible_competition_score) ?? 0,
    mxCompetition: toNumber(row.mx_visible_competition_score) ?? 0,
    margin: formatPercent(row.margen_pct),
    stock: stock.toLocaleString("en-US"),
    confidence: getConfidenceScore(row),
    risk: getRiskFromRow(row),
    recommendation: getRecommendation(row),
    thumbnailTone: getThumbnailTone(row),
    sku: row.sku,
    imageUrl: row.imagen,
    bestLocalOpportunityScore: toNumber(row.best_local_opportunity_score),
    runMode: row.run_mode,
    dropiCatalogCountry: row.dropi_catalog_country,
    manualResearchRequestedAt: row.manual_research_requested_at,
    lastResearchedAt: row.last_researched_at,
    researchStatus: row.research_status,
    researchError: row.research_error,
    metaGlobalLastCheckedAt: row.meta_global_last_checked_at,
    metaCoLastCheckedAt: row.meta_co_last_checked_at,
    metaMxLastCheckedAt: row.meta_mx_last_checked_at,
    updatedAt: row.updated_at,
    opportunityCo: row.opportunity_co,
    opportunityMx: row.opportunity_mx,
    recommendedMarket: row.recommended_market,
    marketOpportunityTier: row.market_opportunity_tier,
    metaTopAd1Url: row.meta_top_ad_1_url,
    metaTopAd1Page: row.meta_top_ad_1_page,
    metaTopAd1QueryLevel: row.meta_top_ad_1_query_level,
    metaTopAd2Url: row.meta_top_ad_2_url,
    metaTopAd2Page: row.meta_top_ad_2_page,
    metaTopAd2QueryLevel: row.meta_top_ad_2_query_level,
    metaTopAd3Url: row.meta_top_ad_3_url,
    metaTopAd3Page: row.meta_top_ad_3_page,
    metaTopAd3QueryLevel: row.meta_top_ad_3_query_level,
    coTopAd1Url: row.co_top_ad_1_url,
    coTopAd1Page: row.co_top_ad_1_page,
    coTopAd2Url: row.co_top_ad_2_url,
    coTopAd2Page: row.co_top_ad_2_page,
    coTopAd3Url: row.co_top_ad_3_url,
    coTopAd3Page: row.co_top_ad_3_page,
    mxTopAd1Url: row.mx_top_ad_1_url,
    mxTopAd1Page: row.mx_top_ad_1_page,
    mxTopAd2Url: row.mx_top_ad_2_url,
    mxTopAd2Page: row.mx_top_ad_2_page,
    mxTopAd3Url: row.mx_top_ad_3_url,
    mxTopAd3Page: row.mx_top_ad_3_page,
    createdAt: row.created_at,
  };
}
