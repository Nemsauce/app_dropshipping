import { products as mockProducts, type ProductOpportunity } from "@/lib/mock-data";
import { mapSupabaseProductToOpportunity } from "@/lib/product-mappers";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { SupabaseProductRow } from "@/lib/supabase/types";

const PRODUCT_SELECT = `
  id,
  nombre,
  sku,
  tipo,
  categoria,
  proveedor,
  tier,
  precio_costo,
  precio_sugerido,
  margen_pct,
  ganancia,
  stock,
  imagen,
  actualizado,
  run_mode,
  dropi_catalog_country,
  manual_research_requested_at,
  last_researched_at,
  research_status,
  research_error,
  meta_global_last_checked_at,
  meta_co_last_checked_at,
  meta_mx_last_checked_at,
  meta_top_ad_1_url,
  meta_top_ad_1_page,
  meta_top_ad_1_query_level,
  meta_top_ad_2_url,
  meta_top_ad_2_page,
  meta_top_ad_2_query_level,
  meta_top_ad_3_url,
  meta_top_ad_3_page,
  meta_top_ad_3_query_level,
  co_top_ad_1_url,
  co_top_ad_1_page,
  co_top_ad_2_url,
  co_top_ad_2_page,
  co_top_ad_3_url,
  co_top_ad_3_page,
  mx_top_ad_1_url,
  mx_top_ad_1_page,
  mx_top_ad_2_url,
  mx_top_ad_2_page,
  mx_top_ad_3_url,
  mx_top_ad_3_page,
  ads_search_query,
  query_qa_status,
  query_qa_reason,
  product_name_quality,
  global_meta_ads_score,
  global_meta_ads_score_type,
  global_meta_product_match_confidence,
  global_demand_detected,
  co_visible_competition_score,
  co_visible_competition_tier,
  mx_visible_competition_score,
  mx_visible_competition_tier,
  opportunity_co,
  opportunity_mx,
  recommended_market,
  market_opportunity_tier,
  best_local_opportunity_score,
  ads_score,
  ads_demand_tier,
  winner_candidate,
  final_recommendation,
  manual_decision,
  decision_notes,
  priority,
  created_at,
  updated_at
`;

function getMockProductById(productId: string): ProductOpportunity | null {
  return mockProducts.find((product) => product.id === productId) ?? null;
}

export async function getProductsForDashboard(): Promise<ProductOpportunity[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .order("winner_candidate", { ascending: false })
      .order("ads_score", { ascending: false })
      .order("best_local_opportunity_score", { ascending: false })
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error || !data?.length) {
      return [];
    }

    return (data as SupabaseProductRow[]).map(mapSupabaseProductToOpportunity);
  } catch {
    return [];
  }
}

export async function getProductById(productId: string): Promise<ProductOpportunity | null> {
  const normalizedProductId = productId.trim();

  if (!normalizedProductId) {
    return null;
  }

  const fallbackProduct = getMockProductById(normalizedProductId);
  const supabase = getSupabaseClient();

  if (!supabase) {
    return fallbackProduct;
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("id", normalizedProductId)
      .maybeSingle();

    if (error) {
      return null;
    }

    if (!data) {
      return fallbackProduct;
    }

    return mapSupabaseProductToOpportunity(data as SupabaseProductRow);
  } catch {
    return null;
  }
}
