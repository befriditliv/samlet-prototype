import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CompassMovement, trendLabel } from "@/data/customerCompass";
import { cn } from "@/lib/utils";

interface CustomerCompassBadgeProps {
  movement: CompassMovement;
  className?: string;
}

const trendStyles = {
  positive: "border-success/40 bg-success/10",
  negative: "border-destructive/40 bg-destructive/10",
  neutral: "border-border bg-muted",
} as const;

const TrendIcon = ({ trend }: { trend: CompassMovement["trend"] }) => {
  if (trend === "positive") return <TrendingUp className="h-3.5 w-3.5" />;
  if (trend === "negative") return <TrendingDown className="h-3.5 w-3.5" />;
  return <Minus className="h-3.5 w-3.5" />;
};

export const CustomerCompassBadge = ({ movement, className }: CustomerCompassBadgeProps) => {
  const { from, to, trend } = movement;
  return (
    <div
      className={cn(
        "inline-flex flex-col gap-1.5 rounded-lg border px-3 py-2 text-foreground",
        trendStyles[trend],
        className,
      )}
      title={`Customer Compass — ${trendLabel(trend)}`}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide opacity-70">
        <TrendIcon trend={trend} />
        Customer Compass
      </div>
      <div className="flex items-center gap-2">
        <div
          className="flex flex-col items-start gap-0.5 rounded-md border-l-4 px-2.5 py-1 bg-background/60"
          style={{ borderLeftColor: from.color }}
        >
          <span className="text-[9px] font-semibold uppercase tracking-wider opacity-60">Prev.</span>
          <span className="text-xs font-medium opacity-80">{from.name}</span>
        </div>
        <ArrowRight className="h-4 w-4 opacity-50 shrink-0 text-foreground" />
        <div
          className="flex flex-col items-start gap-0.5 rounded-md border-l-4 px-2.5 py-1 bg-background/80"
          style={{ borderLeftColor: to.color }}
        >
          <span className="text-[9px] font-semibold uppercase tracking-wider opacity-80">New</span>
          <span className="text-xs font-semibold">{to.name}</span>
        </div>
      </div>
    </div>
  );
};
