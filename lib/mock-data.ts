export type Kpi = {
  label: string;
  value: string;
  trend: string;
  tone: "demand" | "opportunity" | "competition" | "risk" | "review" | "intelligence";
  bars: number[];
};

export type Recommendation =
  | "PRIORITY TEST"
  | "PRIORITY_TEST"
  | "SMALL TEST"
  | "SMALL_TEST"
  | "MANUAL REVIEW"
  | "MANUAL_REVIEW"
  | "IGNORE"
  | "REJECT";

export type TargetMarket = "CO" | "MX" | "CO + MX";

export type ProductOpportunity = {
  id: string;
  sku?: string | null;
  imageUrl?: string | null;
  name: string;
  category: string;
  provider: string;
  tier: string;
  targetMarket: TargetMarket;
  currency: "COP" | "MXN" | "MULTI";
  displayPrice: string;
  displayProfit: string;
  globalDemand: number;
  coCompetition: number;
  mxCompetition: number;
  margin: string;
  stock: string;
  confidence: number;
  risk: "Low" | "Medium" | "Review" | "High";
  recommendation: Recommendation;
  thumbnailTone: "blue" | "green" | "yellow" | "purple" | "red";
  bestLocalOpportunityScore?: number | null;
  runMode?: string | null;
  dropiCatalogCountry?: string | null;
  manualResearchRequestedAt?: string | null;
  lastResearchedAt?: string | null;
  researchStatus?: string | null;
  researchError?: string | null;
  metaGlobalLastCheckedAt?: string | null;
  metaCoLastCheckedAt?: string | null;
  metaMxLastCheckedAt?: string | null;
  updatedAt?: string | null;
  opportunityCo?: boolean | null;
  opportunityMx?: boolean | null;
  recommendedMarket?: string | null;
  marketOpportunityTier?: string | null;
  metaTopAd1Url?: string | null;
  metaTopAd1Page?: string | null;
  metaTopAd1QueryLevel?: string | null;
  metaTopAd2Url?: string | null;
  metaTopAd2Page?: string | null;
  metaTopAd2QueryLevel?: string | null;
  metaTopAd3Url?: string | null;
  metaTopAd3Page?: string | null;
  metaTopAd3QueryLevel?: string | null;
  coTopAd1Url?: string | null;
  coTopAd1Page?: string | null;
  coTopAd2Url?: string | null;
  coTopAd2Page?: string | null;
  coTopAd3Url?: string | null;
  coTopAd3Page?: string | null;
  mxTopAd1Url?: string | null;
  mxTopAd1Page?: string | null;
  mxTopAd2Url?: string | null;
  mxTopAd2Page?: string | null;
  mxTopAd3Url?: string | null;
  mxTopAd3Page?: string | null;
};

export type Signal = {
  label: string;
  value: number;
  tone: "demand" | "opportunity" | "competition" | "risk" | "review" | "intelligence";
};

export const kpis: Kpi[] = [
  {
    label: "Analyzed Products",
    value: "48,752",
    trend: "+12.4% scanned this week",
    tone: "demand",
    bars: [42, 52, 44, 68, 58, 74, 86],
  },
  {
    label: "Priority Candidates",
    value: "312",
    trend: "+38 moved to test queue",
    tone: "opportunity",
    bars: [28, 36, 44, 40, 62, 70, 78],
  },
  {
    label: "CO Opportunities",
    value: "186",
    trend: "64 high-confidence matches",
    tone: "opportunity",
    bars: [34, 48, 46, 54, 64, 60, 72],
  },
  {
    label: "MX Opportunities",
    value: "126",
    trend: "Lower visible competition windows",
    tone: "demand",
    bars: [22, 32, 46, 58, 52, 66, 76],
  },
  {
    label: "High Competition",
    value: "214",
    trend: "-9 rejected today",
    tone: "competition",
    bars: [78, 70, 64, 58, 52, 48, 42],
  },
  {
    label: "Policy Risk",
    value: "37",
    trend: "12 require manual review",
    tone: "risk",
    bars: [18, 28, 22, 34, 30, 26, 24],
  },
];

export const products: ProductOpportunity[] = [
  {
    id: "sensor-trash-can",
    name: "Automatic Sensor Trash Can",
    category: "Home Automation",
    provider: "Dropi",
    tier: "A",
    targetMarket: "CO",
    currency: "COP",
    displayPrice: "COP $189.900",
    displayProfit: "COP $42.800.000",
    globalDemand: 86,
    coCompetition: 42,
    mxCompetition: 61,
    margin: "38%",
    stock: "1,840",
    confidence: 84,
    risk: "Medium",
    recommendation: "PRIORITY TEST",
    thumbnailTone: "green",
  },
  {
    id: "neck-shoulder-massager",
    name: "Neck & Shoulder Massager",
    category: "Wellness",
    provider: "Dropi",
    tier: "A",
    targetMarket: "CO",
    currency: "COP",
    displayPrice: "COP $159.900",
    displayProfit: "COP $31.600.000",
    globalDemand: 91,
    coCompetition: 82,
    mxCompetition: 78,
    margin: "42%",
    stock: "960",
    confidence: 78,
    risk: "Review",
    recommendation: "MANUAL REVIEW",
    thumbnailTone: "purple",
  },
  {
    id: "silicone-baking-mat",
    name: "Silicone Baking Mat 2 Pack",
    category: "Kitchen",
    provider: "Local Supplier",
    tier: "B",
    targetMarket: "MX",
    currency: "MXN",
    displayPrice: "MXN $249",
    displayProfit: "MXN $7,900",
    globalDemand: 68,
    coCompetition: 44,
    mxCompetition: 39,
    margin: "33%",
    stock: "5,200",
    confidence: 72,
    risk: "Low",
    recommendation: "SMALL TEST",
    thumbnailTone: "green",
  },
  {
    id: "portable-blender",
    name: "Portable Blender 500ml",
    category: "Kitchen Appliances",
    provider: "Dropi",
    tier: "A+",
    targetMarket: "MX",
    currency: "MXN",
    displayPrice: "MXN $399",
    displayProfit: "MXN $18,700",
    globalDemand: 92,
    coCompetition: 65,
    mxCompetition: 22,
    margin: "48%",
    stock: "2,640",
    confidence: 91,
    risk: "Low",
    recommendation: "PRIORITY TEST",
    thumbnailTone: "green",
  },
  {
    id: "magnetic-car-phone-mount",
    name: "Magnetic Car Phone Mount",
    category: "Auto Accessories",
    provider: "Dropi",
    tier: "C",
    targetMarket: "CO + MX",
    currency: "COP",
    displayPrice: "COP $39.900 / MXN $189",
    displayProfit: "COP $6.400.000",
    globalDemand: 54,
    coCompetition: 91,
    mxCompetition: 88,
    margin: "22%",
    stock: "730",
    confidence: 46,
    risk: "High",
    recommendation: "IGNORE",
    thumbnailTone: "red",
  },
];

export const selectedProductId = "portable-blender";

export const selectedSignals: Signal[] = [
  { label: "Global Demand", value: 92, tone: "demand" },
  { label: "Market Growth", value: 88, tone: "opportunity" },
  { label: "Competition CO", value: 65, tone: "competition" },
  { label: "Competition MX", value: 22, tone: "opportunity" },
  { label: "Margin Potential", value: 90, tone: "opportunity" },
  { label: "Policy Risk", value: 24, tone: "risk" },
  { label: "Supply Readiness", value: 80, tone: "intelligence" },
];

export const recommendationReasons = [
  "Strong global demand signal",
  "Mexico visible competition is lower than Colombia",
  "High margin potential",
  "Stock is acceptable",
  "Suitable for a controlled small test in Mexico",
];

export const selectedProductDetails = {
  provider: "Dropi",
  tier: "A+",
  launchWindow: "7-10 days",
  policyRisk: "Low",
  recommendedMarket: "Mexico",
  suggestedAction: "Run a controlled small test in Mexico",
};
