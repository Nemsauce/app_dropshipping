import { CheckCircle2, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { ManualResearchForm } from "@/components/research/manual-research-form";

const pipelineSteps = [
  "DemandLab validates the Dropi product ID and catalog country.",
  "DemandLab sends the request to a protected n8n webhook.",
  "n8n fetches the product from Dropi.",
  "n8n runs Meta Ads research for global, Colombia, and Mexico signals.",
  "n8n scores the opportunity and visible competition.",
  "n8n upserts the product into Supabase.",
  "DemandLab reads the updated product data from Supabase.",
];

const guardrailNotes = [
  "DemandLab does not scrape Dropi or Meta Ads directly.",
  "n8n owns scraping, scoring, and Supabase upsert.",
  "Meta Ads signals indicate visible ad activity, not guaranteed sales.",
  "A researched product is a test candidate, not a guaranteed winner.",
];

function HowItWorksCard() {
  return (
    <section className="rounded-2xl border border-border/65 bg-card/74 p-5 shadow-lab-glow">
      <h2 className="text-base font-semibold text-foreground">
        How the manual research pipeline works
      </h2>
      <ol className="mt-4 space-y-3">
        {pipelineSteps.map((step, index) => (
          <li className="flex gap-3 text-sm text-muted-foreground" key={step}>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-xl border border-intelligence/25 bg-intelligence/10 text-xs font-semibold text-intelligence">
              {index + 1}
            </span>
            <span className="pt-1 leading-6">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function GuardrailsCard() {
  return (
    <section className="rounded-2xl border border-border/65 bg-card/74 p-5 shadow-lab-glow">
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-4 text-opportunity" />
        <h2 className="text-base font-semibold text-foreground">
          Research guardrails
        </h2>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {guardrailNotes.map((note) => (
          <div
            className="flex gap-3 rounded-2xl border border-border/55 bg-card-elevated/70 p-3 text-sm leading-6 text-muted-foreground"
            key={note}
          >
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-opportunity" />
            <span>{note}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ResearchPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          description="Trigger the research pipeline for a specific Dropi product ID and send it through Meta Ads validation."
          eyebrow="Manual research"
          title="Analyze by Dropi ID"
        />

        <ManualResearchForm>
          <HowItWorksCard />
        </ManualResearchForm>

        <GuardrailsCard />
      </div>
    </AppShell>
  );
}
