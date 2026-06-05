import { CheckCircle2, ClipboardCheck, FlaskConical, Sparkles } from "lucide-react";

import type { ProductOpportunity, Signal } from "@/lib/mock-data";
import { SignalBreakdown } from "@/components/signal-breakdown";
import { StatusBadge } from "@/components/status-badge";

type DetailMap = {
  provider: string;
  tier: string;
  launchWindow: string;
  policyRisk: string;
  recommendedMarket: string;
  suggestedAction: string;
};

type RecommendationPanelProps = {
  product: ProductOpportunity;
  signals: Signal[];
  reasons: string[];
  details: DetailMap;
};

export function RecommendationPanel({
  product,
  signals,
  reasons,
  details,
}: RecommendationPanelProps) {
  const detailRows = [
    ["Provider", details.provider],
    ["Tier", details.tier],
    ["Target market", product.targetMarket],
    ["Currency", product.currency],
    ["Display price", product.displayPrice],
    ["Estimated profit", product.displayProfit],
    ["Estimated launch window", details.launchWindow],
    ["Policy risk", details.policyRisk],
    ["Recommended market", details.recommendedMarket],
    ["Suggested action", details.suggestedAction],
  ];

  return (
    <section className="rounded-2xl border border-intelligence/35 bg-gradient-to-br from-card-elevated/94 via-card/94 to-[#0B1020]/94 p-4 shadow-lab-glow">
      <div className="flex flex-col gap-3 border-b border-border/60 pb-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-intelligence">
            <Sparkles className="size-4" />
            Expanded Signal Panel
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-normal text-foreground">
            {product.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {product.category} / {product.targetMarket} / {product.displayProfit} estimated
          </p>
        </div>
        <StatusBadge status={product.recommendation} />
      </div>

      <div className="grid gap-4 pt-4 lg:grid-cols-[1.05fr_1fr_0.95fr]">
        <div className="rounded-2xl border border-border/60 bg-background/36 p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <FlaskConical className="size-4 text-demand" />
            Signal Breakdown
          </div>
          <SignalBreakdown signals={signals} />
        </div>

        <div className="rounded-2xl border border-border/60 bg-background/36 p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <CheckCircle2 className="size-4 text-opportunity" />
            Why this product was recommended
          </div>
          <ul className="space-y-3">
            {reasons.map((reason) => (
              <li className="flex items-start gap-2 text-sm text-muted-foreground" key={reason}>
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-opportunity" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border/60 bg-background/36 p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <ClipboardCheck className="size-4 text-review" />
            Key Details
          </div>
          <dl className="space-y-3">
            {detailRows.map(([label, value]) => (
              <div
                className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3 border-b border-border/35 pb-3 last:border-b-0 last:pb-0"
                key={label}
              >
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="text-right text-xs font-medium text-foreground sm:text-sm">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
