import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { ScoreBadge } from "@/components/score-badge";
import { SignalBreakdown } from "@/components/signal-breakdown";
import { StatusBadge } from "@/components/status-badge";
import { formatMarketLabel, formatScore } from "@/lib/formatters";
import type { ProductOpportunity, Signal } from "@/lib/mock-data";
import {
  getCompetitionTone,
  getConfidenceTone,
  getDemandTone,
  getRiskTone,
  type UiTone,
} from "@/lib/scoring-ui";
import { getAcceptedCreativesByProductId } from "@/lib/supabase/creatives";
import { getProductById } from "@/lib/supabase/products";
import type { ProductCreativeRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const NOT_AVAILABLE = "Not available";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type DetailItem = {
  label: string;
  value: string;
};

type DecisionCard = {
  label: string;
  value: string;
  context: string;
  tone: UiTone;
};

type AdEvidenceItem = {
  label: string;
  page?: string | null;
  url?: string | null;
  queryLevel?: string | null;
};

type AdEvidenceGroup = {
  title: string;
  items: LinkedAdEvidenceItem[];
};

type LinkedAdEvidenceItem = AdEvidenceItem & {
  url: string;
};

function displayValue(value: string | null | undefined): string {
  return value?.trim() ? value : NOT_AVAILABLE;
}

function displayNumber(value: number | null | undefined): string {
  return typeof value === "number" && Number.isFinite(value)
    ? formatScore(value)
    : NOT_AVAILABLE;
}

function getResearchStatusTone(status: string | null | undefined): UiTone {
  const normalizedStatus = status?.trim().toUpperCase() ?? "";

  if (normalizedStatus === "COMPLETED") {
    return "opportunity";
  }

  if (normalizedStatus === "FAILED" || normalizedStatus === "ERROR") {
    return "risk";
  }

  if (normalizedStatus === "RUNNING" || normalizedStatus === "QUEUED") {
    return "review";
  }

  if (normalizedStatus === "SUBMITTED") {
    return "demand";
  }

  return "muted";
}

function hasAdEvidenceUrl(item: AdEvidenceItem): item is LinkedAdEvidenceItem {
  return Boolean(item.url?.trim());
}

function signalDemandTone(score: number): Signal["tone"] {
  return score >= 70 ? "opportunity" : "demand";
}

function signalCompetitionTone(score: number): Signal["tone"] {
  if (score <= 25) {
    return "opportunity";
  }

  if (score <= 55) {
    return "competition";
  }

  return "risk";
}

function signalConfidenceTone(score: number): Signal["tone"] {
  if (score >= 75) {
    return "intelligence";
  }

  if (score >= 50) {
    return "review";
  }

  return "risk";
}

function buildDetailSignals(product: ProductOpportunity): Signal[] {
  return [
    {
      label: "Global Demand",
      value: product.globalDemand,
      tone: signalDemandTone(product.globalDemand),
    },
    {
      label: "Colombia Visible Competition",
      value: product.coCompetition,
      tone: signalCompetitionTone(product.coCompetition),
    },
    {
      label: "Mexico Visible Competition",
      value: product.mxCompetition,
      tone: signalCompetitionTone(product.mxCompetition),
    },
    {
      label: "Confidence",
      value: product.confidence,
      tone: signalConfidenceTone(product.confidence),
    },
  ];
}

function buildAdEvidenceGroups(product: ProductOpportunity): AdEvidenceGroup[] {
  const groups: Array<{
    title: string;
    items: AdEvidenceItem[];
  }> = [
    {
      title: "Global Meta Ads",
      items: [
        {
          label: "Global ad 1",
          page: product.metaTopAd1Page,
          queryLevel: product.metaTopAd1QueryLevel,
          url: product.metaTopAd1Url,
        },
        {
          label: "Global ad 2",
          page: product.metaTopAd2Page,
          queryLevel: product.metaTopAd2QueryLevel,
          url: product.metaTopAd2Url,
        },
        {
          label: "Global ad 3",
          page: product.metaTopAd3Page,
          queryLevel: product.metaTopAd3QueryLevel,
          url: product.metaTopAd3Url,
        },
      ],
    },
    {
      title: "Colombia Meta Ads",
      items: [
        {
          label: "Colombia ad 1",
          page: product.coTopAd1Page,
          url: product.coTopAd1Url,
        },
        {
          label: "Colombia ad 2",
          page: product.coTopAd2Page,
          url: product.coTopAd2Url,
        },
        {
          label: "Colombia ad 3",
          page: product.coTopAd3Page,
          url: product.coTopAd3Url,
        },
      ],
    },
    {
      title: "Mexico Meta Ads",
      items: [
        {
          label: "Mexico ad 1",
          page: product.mxTopAd1Page,
          url: product.mxTopAd1Url,
        },
        {
          label: "Mexico ad 2",
          page: product.mxTopAd2Page,
          url: product.mxTopAd2Url,
        },
        {
          label: "Mexico ad 3",
          page: product.mxTopAd3Page,
          url: product.mxTopAd3Url,
        },
      ],
    },
  ];

  return groups.map((group) => ({
    ...group,
    items: group.items.filter(hasAdEvidenceUrl),
  }));
}

function DetailCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-border/65 bg-card/74 p-5 shadow-lab-glow ${className}`}
    >
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DetailGrid({ items }: { items: DetailItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <div
          className="rounded-xl border border-border/50 bg-card-elevated/62 p-3"
          key={item.label}
        >
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            {item.label}
          </div>
          <div className="mt-1 text-sm font-semibold text-foreground">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductNotFound({ id }: { id: string }) {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          description={`No product was found for Dropi ID ${id}.`}
          eyebrow="Product intelligence"
          title="Product not found"
        />

        <section className="rounded-2xl border border-border/65 bg-card/74 p-6 shadow-lab-glow">
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Check the Dropi ID or run a manual research request from the
            Research page.
          </p>
        </section>
      </div>
    </AppShell>
  );
}

function ProductHero({ id, product }: { id: string; product: ProductOpportunity }) {
  const heroItems: DetailItem[] = [
    { label: "Dropi ID", value: id },
    { label: "SKU", value: displayValue(product.sku) },
    { label: "Category", value: product.category },
    { label: "Provider", value: product.provider },
    { label: "Tier", value: product.tier },
    { label: "Target market", value: formatMarketLabel(product.targetMarket) },
  ];

  return (
    <section className="rounded-2xl border border-border/65 bg-gradient-to-br from-card/88 via-card/74 to-card-elevated/62 p-5 shadow-lab-glow">
      <div className="grid gap-5 lg:grid-cols-[180px_1fr]">
        <div className="flex min-h-44 items-center justify-center rounded-2xl border border-border/60 bg-card-elevated/72">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- Product Detail intentionally uses a plain img tag for stored external supplier images.
            <img
              alt={product.name}
              className="h-full max-h-56 w-full rounded-2xl object-cover"
              src={product.imageUrl}
            />
          ) : (
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-2xl border border-demand/30 bg-demand/10" />
              <p className="mt-3 text-xs font-medium text-muted-foreground">
                Product image
              </p>
              <p className="text-xs text-muted">{NOT_AVAILABLE}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={product.recommendation} />
              <ScoreBadge
                tone={getResearchStatusTone(product.researchStatus)}
                value={displayValue(product.researchStatus)}
              />
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-normal text-foreground">
              {product.name}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Use this page to decide if the product deserves a small test,
              needs more research, or should be ignored for now.
            </p>
          </div>

          <DetailGrid items={heroItems} />
        </div>
      </div>
    </section>
  );
}

function DecisionSummary({ product }: { product: ProductOpportunity }) {
  const cards: DecisionCard[] = [
    {
      label: "Demand signal",
      value: formatScore(product.globalDemand),
      context: "Active ad activity found across Meta.",
      tone: getDemandTone(product.globalDemand),
    },
    {
      label: "Colombia competition",
      value: formatScore(product.coCompetition),
      context: "How crowded the Colombian ad market looks.",
      tone: getCompetitionTone(product.coCompetition),
    },
    {
      label: "Mexico competition",
      value: formatScore(product.mxCompetition),
      context: "How crowded the Mexican ad market looks.",
      tone: getCompetitionTone(product.mxCompetition),
    },
    {
      label: "Best market signal",
      value: displayNumber(product.bestLocalOpportunityScore),
      context: "The strongest local opportunity detected.",
      tone: product.bestLocalOpportunityScore ? "opportunity" : "muted",
    },
    {
      label: "Estimated margin",
      value: product.margin,
      context: "Room between product cost and suggested price.",
      tone: "opportunity",
    },
    {
      label: "Available stock",
      value: product.stock,
      context: "Inventory available from the supplier.",
      tone: "intelligence",
    },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div
          className="rounded-2xl border border-border/65 bg-card/74 p-4 shadow-lab-glow"
          key={card.label}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
              {card.label}
            </div>
            <ScoreBadge tone={card.tone} value={card.value} />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{card.context}</p>
        </div>
      ))}
    </section>
  );
}

function ProductDetailContent({
  creatives,
  id,
  product,
}: {
  creatives: ProductCreativeRow[];
  id: string;
  product: ProductOpportunity;
}) {
  const adEvidenceGroups = buildAdEvidenceGroups(product);
  const hasAdEvidence = adEvidenceGroups.some((group) => group.items.length > 0);
  const visibleCreatives = creatives.slice(0, 5);
  const marketItems: DetailItem[] = [
    {
      label: "Colombia competition score",
      value: formatScore(product.coCompetition),
    },
    {
      label: "Mexico competition score",
      value: formatScore(product.mxCompetition),
    },
    { label: "Recommended market", value: formatMarketLabel(product.targetMarket) },
    { label: "Suggested action", value: product.recommendation },
    { label: "Risk level", value: product.risk },
    { label: "Signal confidence", value: formatScore(product.confidence) },
  ];
  const supplyItems: DetailItem[] = [
    { label: "Product cost", value: product.displayPrice },
    { label: "Estimated profit per sale", value: product.displayProfit },
    { label: "Estimated margin", value: product.margin },
    { label: "Available stock", value: product.stock },
    { label: "Supplier", value: product.provider },
    { label: "Supplier tier", value: product.tier },
    {
      label: "Catalog country",
      value: displayValue(product.dropiCatalogCountry),
    },
  ];
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          description="Review demand, competition, supply, and creative signals before deciding whether to test this product."
          eyebrow="Product intelligence"
          title={product.name}
        />

        <ProductHero id={id} product={product} />

        <DecisionSummary product={product} />

        <DetailCard title="What the scores mean">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div>
              <p className="text-sm leading-6 text-muted-foreground">
                Higher demand can mean more buyer interest. Higher competition
                means more sellers are already advertising. Use both together
                before deciding to test.
              </p>
            </div>
            <SignalBreakdown signals={buildDetailSignals(product)} />
          </div>
        </DetailCard>

        <DetailCard title="Market Snapshot">
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            Use this section to compare which market looks more attractive for
            a controlled test.
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            <ScoreBadge
              tone={getRiskTone(product.risk)}
              value={`Risk: ${product.risk}`}
            />
            <ScoreBadge
              tone={getConfidenceTone(product.confidence)}
              value={`Confidence: ${formatScore(product.confidence)}`}
            />
          </div>
          <DetailGrid items={marketItems} />
        </DetailCard>

        <DetailCard title="Supply Snapshot">
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            Check whether the product has enough margin, stock, and supplier
            reliability before testing.
          </p>
          <DetailGrid items={supplyItems} />
        </DetailCard>

        <DetailCard title="Meta ad examples found">
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            These links show ads found during research. They are useful for
            market context, but they do not prove sales.
          </p>
          {hasAdEvidence ? (
            <div className="space-y-4">
              {adEvidenceGroups.map((group) =>
                group.items.length > 0 ? (
                  <div key={group.title}>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {group.title}
                    </h3>
                    <div className="mt-2 grid gap-2">
                      {group.items.map((item) => (
                        <div
                          className="rounded-xl border border-border/55 bg-card-elevated/62 p-3"
                          key={`${group.title}-${item.label}`}
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {displayValue(item.page)}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {item.label}
                                {item.queryLevel
                                  ? ` / Query level: ${item.queryLevel}`
                                  : ""}
                              </p>
                            </div>
                            <a
                              className="text-xs font-semibold text-demand underline-offset-4 hover:underline"
                              href={item.url}
                              rel="noreferrer"
                              target="_blank"
                            >
                              Open ad
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-border/45 bg-card-elevated/45 px-3 py-2">
              <p className="text-xs text-muted-foreground">
                No Meta ad examples are stored for this product yet.
              </p>
            </div>
          )}
        </DetailCard>

        <DetailCard title="TikTok creative examples">
          <div className="space-y-4">
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Visual references found for this product or closely similar
              products. Use them for creative inspiration, not as proof of
              sales.
            </p>

            {visibleCreatives.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {visibleCreatives.map((creative) => (
                  <article
                    className="overflow-hidden rounded-xl border border-border/55 bg-card-elevated/62"
                    key={creative.id}
                  >
                    <div className="aspect-[9/16] bg-card/70">
                      {creative.thumbnail_url ? (
                        // eslint-disable-next-line @next/next/no-img-element -- Product Detail intentionally uses a plain img tag for stored external creative thumbnails.
                        <img
                          alt="TikTok creative thumbnail"
                          className="h-full w-full object-cover"
                          src={creative.thumbnail_url}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-4 text-center text-xs font-medium text-muted-foreground">
                          No thumbnail
                        </div>
                      )}
                    </div>

                    <div className="border-t border-border/45 p-3">
                      <a
                        className="inline-flex text-xs font-semibold text-demand underline-offset-4 hover:underline"
                        href={creative.creative_url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Open creative
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border/55 bg-card-elevated/62 p-4">
                <p className="text-sm text-muted-foreground">
                  No TikTok creative examples are stored for this product yet.
                </p>
              </div>
            )}
          </div>
        </DetailCard>

        <section className="rounded-2xl border border-review/30 bg-review/8 p-5 shadow-lab-glow">
          <h2 className="text-sm font-semibold text-foreground">
            Important note
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">
            These signals help decide what to test first. They do not guarantee
            sales, profit, or low competition.
          </p>
        </section>
      </div>
    </AppShell>
  );
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const [product, creatives] = await Promise.all([
    getProductById(id),
    getAcceptedCreativesByProductId(id),
  ]);

  if (!product) {
    return <ProductNotFound id={id} />;
  }

  return <ProductDetailContent creatives={creatives} id={id} product={product} />;
}
