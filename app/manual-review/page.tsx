import { AlertTriangle, ClipboardCheck, Scale, ShieldAlert } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PlaceholderCard } from "@/components/placeholder-card";

export default function ManualReviewPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          description="Manual Review will collect products that need human judgment before testing because of risk, policy, competition, or supplier uncertainty."
          eyebrow="Review queue"
          title="Manual Review"
        />
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <PlaceholderCard
            description="Inspect category and ad-policy risk before approving a product for a controlled test."
            icon={ShieldAlert}
            title="Policy Risk Checks"
            tone="risk"
          />
          <PlaceholderCard
            description="Mark products for test, watchlist, ignore, or additional supplier validation."
            icon={ClipboardCheck}
            title="Decision Actions"
            tone="review"
          />
          <PlaceholderCard
            description="Balance demand signal against visible local competition and margin potential."
            icon={Scale}
            title="Signal Arbitration"
            tone="intelligence"
          />
          <PlaceholderCard
            description="Flag ambiguous products without claiming guaranteed winners or certain profit."
            icon={AlertTriangle}
            title="Decision Guardrails"
            tone="competition"
          />
        </section>
      </div>
    </AppShell>
  );
}
