import { Bell, Palette, Settings, SlidersHorizontal } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PlaceholderCard } from "@/components/placeholder-card";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          description="Settings will hold workspace preferences for display, decision thresholds, notification surfaces, and future integrations."
          eyebrow="Workspace controls"
          title="Settings"
        />
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <PlaceholderCard
            description="Keep the approved dark premium visual system consistent across future routes."
            icon={Palette}
            title="Interface Preferences"
            tone="intelligence"
          />
          <PlaceholderCard
            description="Tune future thresholds for demand, visible competition, confidence, and manual review."
            icon={SlidersHorizontal}
            title="Signal Thresholds"
            tone="demand"
          />
          <PlaceholderCard
            description="Prepare notification surfaces for test status and review queue changes."
            icon={Bell}
            title="Operational Alerts"
            tone="review"
          />
          <PlaceholderCard
            description="Supabase and auth settings stay deferred until explicitly requested."
            icon={Settings}
            title="Future Integrations"
            tone="competition"
          />
        </section>
      </div>
    </AppShell>
  );
}
