import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CompassMovement, trendLabel } from "@/data/customerCompass";
import { cn } from "@/lib/utils";

interface CustomerCompassBadgeProps {
  movement: CompassMovement;
  className?: string;
}

const trendStyles = {
  positive: "border-success/30 bg-success/10 text-success",
  negative: "border-destructive/30 bg-destructive/10 text-destructive",
  neutral: "border-border bg-muted text-muted-foreground",
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
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium",
        trendStyles[trend],
        className,
      )}
      title={`Customer Compass — ${trendLabel(trend)}`}
    >
      <TrendIcon trend={trend} />
      <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
        Customer Compass
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1">
          <span className="text-[9px] font-semibold uppercase tracking-wide opacity-60">Prev</span>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: from.color }} />
          {from.name}
        </span>
        <ArrowRight className="h-3 w-3 opacity-60" />
        <span className="inline-flex items-center gap-1 font-semibold">
          <span className="text-[9px] font-semibold uppercase tracking-wide opacity-60">New</span>
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: to.color }} />
          {to.name}
        </span>
      </span>
    </div>
  );
};
