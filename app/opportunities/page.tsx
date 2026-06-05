import { BadgeCheck, Filter, Target, TrendingUp } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PlaceholderCard } from "@/components/placeholder-card";

export default function OpportunitiesPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          description="A future workspace for prioritizing test candidates by demand signal, visible competition, margin, and recommended market."
          eyebrow="Opportunity intelligence"
          title="Opportunities"
        />
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <PlaceholderCard
            description="Rank products where global demand signal exists and Colombia or Mexico visible competition appears lower."
            icon={Target}
            title="Market Opportunity Queue"
            tone="opportunity"
          />
          <PlaceholderCard
            description="Compare confidence, risk, stock, and margin before moving candidates into controlled tests."
            icon={BadgeCheck}
            title="Prioritization Signals"
            tone="intelligence"
          />
          <PlaceholderCard
            description="Save focused views for CO, MX, category, provider, tier, and recommendation filters."
            icon={Filter}
            title="Saved Decision Views"
            tone="demand"
          />
          <PlaceholderCard
            description="Track momentum changes when a product shifts from watchlist to test candidate."
            icon={TrendingUp}
            title="Signal Movement"
            tone="review"
          />
        </section>
      </div>
    </AppShell>
  );
}
