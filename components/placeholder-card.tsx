import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type PlaceholderTone =
  | "demand"
  | "opportunity"
  | "competition"
  | "risk"
  | "review"
  | "intelligence";

const toneStyles: Record<
  PlaceholderTone,
  { icon: string; card: string; accent: string }
> = {
  demand: {
    icon: "border-demand/25 bg-demand/12 text-demand",
    card: "hover:border-demand/30",
    accent: "bg-demand",
  },
  opportunity: {
    icon: "border-opportunity/25 bg-opportunity/12 text-opportunity",
    card: "hover:border-opportunity/30",
    accent: "bg-opportunity",
  },
  competition: {
    icon: "border-competition/25 bg-competition/12 text-competition",
    card: "hover:border-competition/30",
    accent: "bg-competition",
  },
  risk: {
    icon: "border-risk/25 bg-risk/12 text-risk",
    card: "hover:border-risk/30",
    accent: "bg-risk",
  },
  review: {
    icon: "border-review/25 bg-review/12 text-review",
    card: "hover:border-review/30",
    accent: "bg-review",
  },
  intelligence: {
    icon: "border-intelligence/25 bg-intelligence/12 text-intelligence",
    card: "hover:border-intelligence/30",
    accent: "bg-intelligence",
  },
};

type PlaceholderCardProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  tone?: PlaceholderTone;
};

export function PlaceholderCard({
  title,
  description,
  icon: Icon,
  tone = "intelligence",
}: PlaceholderCardProps) {
  const styles = toneStyles[tone];

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/65 bg-card/78 p-5 shadow-lab-glow transition-colors",
        styles.card,
      )}
    >
      <div className={cn("absolute inset-x-0 top-0 h-px", styles.accent)} />
      <div className="flex items-start gap-4">
        {Icon ? (
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl border",
              styles.icon,
            )}
          >
            <Icon className="size-4" />
          </div>
        ) : null}
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}
