import { Activity, FlaskConical, Gauge, TimerReset } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PlaceholderCard } from "@/components/placeholder-card";

export default function TestsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          description="Tests will track controlled product experiments, launch windows, budget status, and manual outcomes for CO and MX markets."
          eyebrow="Testing workflow"
          title="Tests"
        />
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <PlaceholderCard
            description="Move approved candidates into small, controlled tests with market and currency context."
            icon={FlaskConical}
            title="Experiment Queue"
            tone="opportunity"
          />
          <PlaceholderCard
            description="Monitor test state without treating early ad signals as guaranteed success."
            icon={Activity}
            title="Run Status"
            tone="demand"
          />
          <PlaceholderCard
            description="Track launch windows, review deadlines, and next manual decision points."
            icon={TimerReset}
            title="Cadence Control"
            tone="review"
          />
          <PlaceholderCard
            description="Future scoring will separate prioritization signals from final business decisions."
            icon={Gauge}
            title="Outcome Signals"
            tone="intelligence"
          />
        </section>
      </div>
    </AppShell>
  );
}
