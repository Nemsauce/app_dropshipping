import {
  AlertTriangle,
  BarChart3,
  Globe2,
  MapPinned,
  PackageSearch,
  ShieldAlert,
  Target,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { FilterBar } from "@/components/filter-bar";
import { KpiCard } from "@/components/kpi-card";
import { ProductsTable } from "@/components/products-table";
import { RecommendationPanel } from "@/components/recommendation-panel";
import { products } from "@/lib/mock-data";
import { buildDashboardKpis } from "@/lib/dashboard-kpis";
import { buildHeroMetrics, type HeroMetric } from "@/lib/hero-metrics";
import { getProductsForDashboard } from "@/lib/supabase/products";
import {
  buildRecommendationReasons,
  buildSelectedProductDetails,
  buildSignalsForProduct,
} from "@/lib/product-analysis";
import { normalizeRecommendationLabel } from "@/lib/scoring-ui";

const kpiIcons = [
  PackageSearch,
  Target,
  MapPinned,
  Globe2,
  BarChart3,
  ShieldAlert,
];

const heroMetricToneClass: Record<HeroMetric["tone"], string> = {
  opportunity: "text-opportunity",
  demand: "text-demand",
  review: "text-review",
  risk: "text-risk",
  competition: "text-competition",
  intelligence: "text-intelligence",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const realProducts = await getProductsForDashboard();
  const dashboardProducts = realProducts.length > 0 ? realProducts : products;
  const dashboardKpis = buildDashboardKpis(dashboardProducts);
  const heroMetrics = buildHeroMetrics(dashboardProducts);
  const selectedProduct =
    dashboardProducts.find(
      (product) =>
        normalizeRecommendationLabel(product.recommendation) === "PRIORITY TEST",
    ) ?? dashboardProducts[0];
  const selectedProductSignals = buildSignalsForProduct(selectedProduct);
  const selectedProductReasons = buildRecommendationReasons(selectedProduct);
  const selectedProductDetails = buildSelectedProductDetails(selectedProduct);

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-demand/25 bg-demand/10 px-3 py-1.5 text-xs font-medium text-demand">
              <AlertTriangle className="size-3.5" />
              Testing decisions / May 2026
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
              Product Intelligence Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Demand, competition, margin, policy risk, and supply signals for
              Colombia and Mexico product testing.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border/65 bg-card/72 p-2 text-center shadow-lab-glow sm:min-w-[420px]">
            {heroMetrics.map((metric) => (
              <div
                className="rounded-xl bg-card-elevated/80 px-3 py-3"
                key={metric.label}
              >
                <div className="text-xs text-muted">{metric.label}</div>
                <div
                  className={`mt-1 text-lg font-semibold ${heroMetricToneClass[metric.tone]}`}
                >
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {dashboardKpis.map((kpi, index) => {
            const Icon = kpiIcons[index];

            return <KpiCard icon={Icon} key={kpi.label} {...kpi} />;
          })}
        </section>

        <FilterBar />

        <ProductsTable
          products={dashboardProducts}
          selectedProductId={selectedProduct.id}
        />

        <RecommendationPanel
          details={selectedProductDetails}
          product={selectedProduct}
          reasons={selectedProductReasons}
          signals={selectedProductSignals}
        />
      </div>
    </AppShell>
  );
}
