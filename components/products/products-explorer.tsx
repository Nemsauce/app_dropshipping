"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  ChevronDown,
  Download,
  PackageSearch,
  Search,
  SlidersHorizontal,
  Target,
} from "lucide-react";

import { ProductsTable } from "@/components/products-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductOpportunity } from "@/lib/mock-data";
import { normalizeRecommendationLabel } from "@/lib/scoring-ui";
import { cn } from "@/lib/utils";

type ProductsExplorerProps = {
  products: ProductOpportunity[];
};

type SummaryTone = "demand" | "opportunity" | "review" | "risk";

type SummaryCard = {
  label: string;
  value: string;
  tone: SummaryTone;
  description: string;
};

type FilterSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

const marketOptions = ["All markets", "CO", "MX", "CO + MX"];
const recommendationOptions = [
  "All recommendations",
  "Priority Test",
  "Small Test",
  "Manual Review",
  "Ignore",
  "Reject",
];
const riskOptions = ["All risks", "Low", "Medium", "Review", "High"];

const recommendationValueMap: Record<string, string> = {
  "Priority Test": "PRIORITY TEST",
  "Small Test": "SMALL TEST",
  "Manual Review": "MANUAL REVIEW",
  Ignore: "IGNORE",
  Reject: "REJECT",
};

const summaryToneStyles: Record<SummaryTone, string> = {
  demand: "text-demand border-demand/25 bg-demand/10",
  opportunity: "text-opportunity border-opportunity/25 bg-opportunity/10",
  review: "text-review border-review/25 bg-review/10",
  risk: "text-risk border-risk/25 bg-risk/10",
};

function isPriorityProduct(product: ProductOpportunity): boolean {
  return normalizeRecommendationLabel(product.recommendation) === "PRIORITY TEST";
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

function buildSummaryCards(products: ProductOpportunity[]): SummaryCard[] {
  const priorityCount = products.filter(isPriorityProduct).length;
  const manualReviewCount = products.filter(
    (product) =>
      normalizeRecommendationLabel(product.recommendation) === "MANUAL REVIEW" ||
      product.risk === "Review",
  ).length;
  const ignoredCount = products.filter((product) => {
    const recommendation = normalizeRecommendationLabel(product.recommendation);

    return recommendation === "IGNORE" || recommendation === "REJECT";
  }).length;

  return [
    {
      label: "Total Products",
      value: String(products.length),
      tone: "demand",
      description: "Current filtered dataset",
    },
    {
      label: "Priority Test",
      value: String(priorityCount),
      tone: "opportunity",
      description: "Ready for controlled review",
    },
    {
      label: "Manual Review",
      value: String(manualReviewCount),
      tone: "review",
      description: "Needs policy or signal review",
    },
    {
      label: "Ignored / Rejected",
      value: String(ignoredCount),
      tone: "risk",
      description: "Not prioritized for testing",
    },
  ];
}

function matchesSearch(product: ProductOpportunity, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const searchableValues = [
    String(product.id),
    product.name,
    product.category,
    product.provider,
    product.tier,
    product.targetMarket,
    product.displayPrice,
    product.displayProfit,
    product.recommendation,
    product.risk,
  ];

  return searchableValues.some((value) =>
    String(value).toLowerCase().includes(normalizedQuery),
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        className="h-8 appearance-none rounded-lg border border-border/70 bg-transparent py-0 pl-3 pr-8 text-xs font-medium text-muted-foreground transition-colors hover:border-demand/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-demand/45"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option className="bg-card-elevated text-foreground" key={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" />
    </label>
  );
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <section className="rounded-2xl border border-border/65 bg-card/74 p-8 text-center shadow-lab-glow">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-review/25 bg-review/10 text-review">
        <SlidersHorizontal className="size-5" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-foreground">
        No products match your current filters.
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Clear filters or broaden your search to see more products.
      </p>
      <Button className="mt-5" onClick={onClearFilters} type="button" variant="secondary">
        Clear Filters
      </Button>
    </section>
  );
}

type QuickDateFilter = "all" | "today" | "7days" | "30days" | "custom";

function matchesDateFilter(
  product: ProductOpportunity,
  quickDateFilter: QuickDateFilter,
  dateFrom: string,
  dateTo: string,
): boolean {
  if (quickDateFilter === "all" && !dateFrom && !dateTo) {
    return true;
  }

  if (product.createdAt == null && quickDateFilter !== "all") {
    return false;
  }

  const createdAt = product.createdAt!;

  if (quickDateFilter === "today") {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    return createdAt.slice(0, 10) === todayStr;
  }

  if (quickDateFilter === "7days" || quickDateFilter === "30days") {
    const days = quickDateFilter === "7days" ? 7 : 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setHours(0, 0, 0, 0);
    return new Date(createdAt) >= cutoff;
  }

  if (quickDateFilter === "custom") {
    if (!dateFrom && !dateTo) {
      return true;
    }
    const createdDate = new Date(createdAt);
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      if (createdDate < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (createdDate > to) return false;
    }
    return true;
  }

  return true;
}

export function ProductsExplorer({ products }: ProductsExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [marketFilter, setMarketFilter] = useState("All markets");
  const [recommendationFilter, setRecommendationFilter] = useState(
    "All recommendations",
  );
  const [riskFilter, setRiskFilter] = useState("All risks");
  const [providerFilter, setProviderFilter] = useState("All providers");
  const [tierFilter, setTierFilter] = useState("All tiers");
  const [quickDateFilter, setQuickDateFilter] = useState<QuickDateFilter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const providerOptions = useMemo(
    () => ["All providers", ...uniqueSorted(products.map((product) => product.provider))],
    [products],
  );
  const tierOptions = useMemo(
    () => ["All tiers", ...uniqueSorted(products.map((product) => product.tier))],
    [products],
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const normalizedRecommendation = normalizeRecommendationLabel(
          product.recommendation,
        );
        const selectedRecommendation =
          recommendationValueMap[recommendationFilter];

        return (
          matchesSearch(product, searchQuery) &&
          (marketFilter === "All markets" ||
            product.targetMarket === marketFilter) &&
          (!selectedRecommendation ||
            normalizedRecommendation === selectedRecommendation) &&
          (riskFilter === "All risks" || product.risk === riskFilter) &&
          (providerFilter === "All providers" ||
            product.provider === providerFilter) &&
          (tierFilter === "All tiers" || product.tier === tierFilter) &&
          matchesDateFilter(product, quickDateFilter, dateFrom, dateTo)
        );
      }),
    [
      dateFrom,
      dateTo,
      marketFilter,
      products,
      providerFilter,
      quickDateFilter,
      recommendationFilter,
      riskFilter,
      searchQuery,
      tierFilter,
    ],
  );

  const hasActiveDateFilter =
    (quickDateFilter !== "all" && quickDateFilter !== "custom") ||
    (quickDateFilter === "custom" && (dateFrom.length > 0 || dateTo.length > 0));

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    marketFilter !== "All markets" ||
    recommendationFilter !== "All recommendations" ||
    riskFilter !== "All risks" ||
    providerFilter !== "All providers" ||
    tierFilter !== "All tiers" ||
    hasActiveDateFilter;

  const summaryCards = buildSummaryCards(filteredProducts);
  const selectedProduct =
    filteredProducts.find(isPriorityProduct) ?? filteredProducts[0];
  const noteChips = [
    "Read-only Supabase data",
    "Mock fallback enabled",
    hasActiveFilters ? "Filters active" : "Filters ready",
    "Product details enabled",
    "Export deferred",
  ];

  function clearFilters() {
    setSearchQuery("");
    setMarketFilter("All markets");
    setRecommendationFilter("All recommendations");
    setRiskFilter("All risks");
    setProviderFilter("All providers");
    setTierFilter("All tiers");
    setQuickDateFilter("all");
    setDateFrom("");
    setDateTo("");
  }

  return (
    <>
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            className="rounded-2xl border border-border/65 bg-card/78 p-4 shadow-lab-glow"
            key={card.label}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
                  {card.label}
                </div>
                <div className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
                  {card.value}
                </div>
              </div>
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl border",
                  summaryToneStyles[card.tone],
                )}
              >
                {card.tone === "demand" ? (
                  <PackageSearch className="size-4" />
                ) : null}
                {card.tone === "opportunity" ? (
                  <Target className="size-4" />
                ) : null}
                {card.tone === "review" ? (
                  <AlertTriangle className="size-4" />
                ) : null}
                {card.tone === "risk" ? <Ban className="size-4" /> : null}
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {card.description}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-border/65 bg-card/74 p-3 shadow-lab-glow">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <Input
                className="h-11 pl-9"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by Dropi ID, product, supplier, market, or recommendation..."
                type="search"
                value={searchQuery}
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              label="Market"
              onChange={setMarketFilter}
              options={marketOptions}
              value={marketFilter}
            />
            <FilterSelect
              label="Recommendation"
              onChange={setRecommendationFilter}
              options={recommendationOptions}
              value={recommendationFilter}
            />
            <FilterSelect
              label="Risk"
              onChange={setRiskFilter}
              options={riskOptions}
              value={riskFilter}
            />
            <FilterSelect
              label="Provider"
              onChange={setProviderFilter}
              options={providerOptions}
              value={providerFilter}
            />
            <FilterSelect
              label="Tier"
              onChange={setTierFilter}
              options={tierOptions}
              value={tierFilter}
            />
            <Button
              disabled={!hasActiveFilters}
              onClick={clearFilters}
              size="sm"
              type="button"
              variant="outline"
            >
              Clear Filters
            </Button>
            <Button
              disabled
              size="sm"
              title="Export is deferred"
              type="button"
              variant="secondary"
            >
              <Download className="size-3.5" />
              Export View
            </Button>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">Date Added</span>
          {(
            [
              { key: "all", label: "All time" },
              { key: "today", label: "Today" },
              { key: "7days", label: "Last 7 days" },
              { key: "30days", label: "Last 30 days" },
            ] as { key: QuickDateFilter; label: string }[]
          ).map(({ key, label }) => (
            <button
              className={cn(
                "h-8 rounded-lg border px-3 text-xs font-medium transition-colors",
                quickDateFilter === key
                  ? "border-demand/50 bg-demand/10 text-demand"
                  : "border-border/70 bg-transparent text-muted-foreground hover:border-demand/40 hover:text-foreground",
              )}
              key={key}
              onClick={() => {
                setQuickDateFilter(key);
                setDateFrom("");
                setDateTo("");
              }}
              type="button"
            >
              {label}
            </button>
          ))}
          <button
            className={cn(
              "h-8 rounded-lg border px-3 text-xs font-medium transition-colors",
              quickDateFilter === "custom"
                ? "border-demand/50 bg-demand/10 text-demand"
                : "border-border/70 bg-transparent text-muted-foreground hover:border-demand/40 hover:text-foreground",
            )}
            onClick={() => setQuickDateFilter("custom")}
            type="button"
          >
            Custom range
          </button>
          {quickDateFilter === "custom" && (
            <>
              <span className="text-xs text-muted">From</span>
              <input
                className="h-8 rounded-lg border border-border/70 bg-transparent px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-demand/45"
                onChange={(e) => setDateFrom(e.target.value)}
                type="date"
                value={dateFrom}
              />
              <span className="text-xs text-muted">To</span>
              <input
                className="h-8 rounded-lg border border-border/70 bg-transparent px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-demand/45"
                onChange={(e) => setDateTo(e.target.value)}
                type="date"
                value={dateTo}
              />
            </>
          )}
        </div>
      </section>

      {selectedProduct ? (
        <ProductsTable
          products={filteredProducts}
          rowHref={(product) => `/products/${product.id}`}
          selectedProductId={selectedProduct.id}
          variant="scanner"
        />
      ) : (
        <EmptyState onClearFilters={clearFilters} />
      )}

      <section className="rounded-2xl border border-border/65 bg-card/74 p-4 shadow-lab-glow">
        <h2 className="text-sm font-semibold text-foreground">
          How to read this page
        </h2>
        <ul className="mt-2 grid gap-1.5 text-sm leading-6 text-muted-foreground">
          <li>Start with products marked as test candidates.</li>
          <li>
            Compare demand with visible competition before choosing a market.
          </li>
          <li>
            Open a product to review Meta ad examples and TikTok creatives.
          </li>
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          {noteChips.map((chip) => (
            <span
              className="rounded-full border border-border/70 bg-card-elevated px-3 py-1 text-xs font-medium text-muted-foreground"
              key={chip}
            >
              {chip}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
