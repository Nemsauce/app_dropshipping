import { Activity, Clock3, DollarSign, FlaskConical, Target } from "lucide-react";

const metrics = [
  { label: "Tests Running", value: "24", icon: FlaskConical, tone: "text-demand" },
  { label: "Active Opportunities", value: "312", icon: Target, tone: "text-opportunity" },
  { label: "Est. Profit 30d", value: "COP $1.8B / MXN $487K", icon: DollarSign, tone: "text-opportunity" },
  { label: "Data Freshness", value: "2h ago", icon: Clock3, tone: "text-review" },
];

export function TopHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/55 bg-background/78 backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 lg:hidden">
          <div className="flex size-9 items-center justify-center rounded-xl border border-demand/25 bg-demand/12 text-demand">
            <FlaskConical className="size-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">DemandLab</div>
            <div className="text-xs text-muted-foreground">Dashboard</div>
          </div>
        </div>

        <div className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
          <Activity className="size-4 text-demand" />
          Intelligence workspace
        </div>

        <div className="ml-auto flex items-center gap-2 overflow-x-auto">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-border/70 bg-card/72 px-3"
              >
                <Icon className={`size-3.5 ${metric.tone}`} />
                <span className="hidden text-xs text-muted-foreground xl:inline">
                  {metric.label}
                </span>
                <span className="text-xs font-semibold text-foreground tabular-nums">
                  {metric.value}
                </span>
              </div>
            );
          })}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card-elevated text-xs font-semibold text-foreground">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
