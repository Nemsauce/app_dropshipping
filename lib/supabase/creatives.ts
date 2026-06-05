import { getSupabaseClient } from "@/lib/supabase/client";
import type { ProductCreativeRow } from "@/lib/supabase/types";

const ACCEPTED_MATCH_CONFIDENCE = [
  "EXACT_PRODUCT",
  "HIGHLY_SIMILAR_PRODUCT",
];

const PRODUCT_CREATIVES_SELECT = `
  id,
  product_id,
  platform,
  creative_url,
  thumbnail_url,
  creator_name,
  caption,
  matched_query,
  match_confidence,
  match_reason,
  product_match_type,
  country,
  source,
  found_at,
  raw_payload,
  created_at,
  updated_at
`;

export async function getAcceptedCreativesByProductId(
  productId: string,
): Promise<ProductCreativeRow[]> {
  const normalizedProductId = productId.trim();

  if (!normalizedProductId) {
    return [];
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("product_creatives")
      .select(PRODUCT_CREATIVES_SELECT)
      .eq("product_id", normalizedProductId)
      .eq("platform", "tiktok")
      .in("match_confidence", ACCEPTED_MATCH_CONFIDENCE)
      .order("found_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(12);

    if (error || !data?.length) {
      return [];
    }

    return data as ProductCreativeRow[];
  } catch {
    return [];
  }
}
