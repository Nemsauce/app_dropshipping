import { Crosshair, Globe2, MapPinned, Radar } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PlaceholderCard } from "@/components/placeholder-card";

export default function MarketRadarPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          description="Market Radar will compare global Meta Ads demand signals against visible local competition in Colombia and Mexico."
          eyebrow="Demand and competition"
          title="Market Radar"
        />
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <PlaceholderCard
            description="Monitor exact global demand signal without treating it as proof of sales."
            icon={Globe2}
            title="Global Demand Signal"
            tone="demand"
          />
          <PlaceholderCard
            description="Compare visible competition across Colombia and Mexico before choosing a test market."
            icon={MapPinned}
            title="Local Visibility Map"
            tone="competition"
          />
          <PlaceholderCard
            description="Surface products where Mexico or Colombia has a cleaner test window."
            icon={Crosshair}
            title="Market Fit Detection"
            tone="opportunity"
          />
          <PlaceholderCard
            description="Future radar views will stay decision-focused and avoid unsupported saturation claims."
            icon={Radar}
            title="Signal Guardrails"
            tone="intelligence"
          />
        </section>
      </div>
    </AppShell>
  );
}
