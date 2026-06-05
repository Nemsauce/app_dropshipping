import { cn } from "@/lib/utils";
import {
  getRecommendationTone,
  normalizeRecommendationLabel,
  type UiTone,
} from "@/lib/scoring-ui";

const recommendationStyles: Record<UiTone, string> = {
  muted: "border-border/70 bg-card-elevated text-muted-foreground",
  opportunity:
    "border-opportunity/40 bg-opportunity/12 text-opportunity shadow-[0_0_18px_rgba(34,197,94,0.12)]",
  demand: "border-demand/40 bg-demand/12 text-demand",
  review: "border-review/40 bg-review/12 text-review",
  risk: "border-risk/40 bg-risk/12 text-risk",
  competition: "border-competition/40 bg-competition/12 text-competition",
  intelligence: "border-intelligence/40 bg-intelligence/12 text-intelligence",
};

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = normalizeRecommendationLabel(status);
  const tone = getRecommendationTone(status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-none tracking-wide",
        recommendationStyles[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
