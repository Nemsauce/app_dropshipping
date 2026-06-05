import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Kpi } from "@/lib/mock-data";

const toneStyles: Record<Kpi["tone"], { text: string; bg: string; bar: string }> = {
  demand: {
    text: "text-demand",
    bg: "bg-demand/12 border-demand/25",
    bar: "bg-demand",
  },
  opportunity: {
    text: "text-opportunity",
    bg: "bg-opportunity/12 border-opportunity/25",
    bar: "bg-opportunity",
  },
  competition: {
    text: "text-competition",
    bg: "bg-competition/12 border-competition/25",
    bar: "bg-competition",
  },
  risk: {
    text: "text-risk",
    bg: "bg-risk/12 border-risk/25",
    bar: "bg-risk",
  },
  review: {
    text: "text-review",
    bg: "bg-review/12 border-review/25",
    bar: "bg-review",
  },
  intelligence: {
    text: "text-intelligence",
    bg: "bg-intelligence/12 border-intelligence/25",
    bar: "bg-intelligence",
  },
};

type KpiCardProps = Kpi & {
  icon: LucideIcon;
};

export function KpiCard({
  icon: Icon,
  label,
  value,
  trend,
  tone,
  bars,
}: KpiCardProps) {
  const styles = toneStyles[tone];

  return (
    <article className="group rounded-2xl border border-border/65 bg-card/82 p-4 shadow-lab-glow transition-colors hover:border-border">
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl border",
            styles.bg,
            styles.text,
          )}
        >
          <Icon className="size-4" />
        </div>
        <div className="flex h-10 items-end gap-1">
          {bars.map((height, index) => (
            <span
              className={cn(
                "w-1.5 rounded-full opacity-80 transition-opacity group-hover:opacity-100",
                styles.bar,
              )}
              key={`${label}-${index}`}
              style={{ height: `${Math.max(10, height / 2.1)}px` }}
            />
          ))}
        </div>
      </div>
      <div className="mt-5">
        <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
          {label}
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-normal text-foreground tabular-nums">
          {value}
        </div>
        <div className="mt-2 text-xs text-muted-foreground">{trend}</div>
      </div>
    </article>
  );
}
