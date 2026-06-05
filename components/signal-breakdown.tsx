import type { Signal } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const signalStyles: Record<Signal["tone"], string> = {
  demand: "bg-demand",
  opportunity: "bg-opportunity",
  competition: "bg-competition",
  risk: "bg-risk",
  review: "bg-review",
  intelligence: "bg-intelligence",
};

type SignalBreakdownProps = {
  signals: Signal[];
};

export function SignalBreakdown({ signals }: SignalBreakdownProps) {
  return (
    <div className="space-y-3">
      {signals.map((signal) => (
        <div key={signal.label}>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-muted-foreground">
              {signal.label}
            </span>
            <span className="text-xs font-semibold text-foreground tabular-nums">
              {signal.value}
            </span>
          </div>
          <div className="h-2 rounded-full bg-[#0A0F19] ring-1 ring-border/45">
            <div
              className={cn("h-full rounded-full", signalStyles[signal.tone])}
              style={{ width: `${signal.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
