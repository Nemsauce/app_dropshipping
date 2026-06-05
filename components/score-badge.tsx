import { cn } from "@/lib/utils";
import type { UiTone } from "@/lib/scoring-ui";

const scoreStyles: Record<UiTone, string> = {
  muted: "border-border/70 bg-card-elevated text-muted-foreground",
  demand: "border-demand/35 bg-demand/10 text-demand",
  opportunity: "border-opportunity/35 bg-opportunity/10 text-opportunity",
  competition: "border-competition/35 bg-competition/10 text-competition",
  risk: "border-risk/35 bg-risk/10 text-risk",
  review: "border-review/35 bg-review/10 text-review",
  intelligence: "border-intelligence/35 bg-intelligence/10 text-intelligence",
};

type ScoreBadgeProps = {
  value: number | string;
  tone: UiTone;
  suffix?: string;
  className?: string;
};

export function ScoreBadge({ value, tone, suffix, className }: ScoreBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-w-12 items-center justify-center rounded-full border px-2 py-1 text-xs font-semibold tabular-nums",
        scoreStyles[tone],
        className,
      )}
    >
      {value}
      {suffix}
    </span>
  );
}
