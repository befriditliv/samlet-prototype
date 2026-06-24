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
  const isSame = from.name === to.name;
  return (
    <div
      className={cn(
        "inline-flex flex-col gap-1.5 rounded-lg border px-3 py-2",
        trendStyles[trend],
        className,
      )}
      title={`Customer Compass — ${trendLabel(trend)}`}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide opacity-70">
        <TrendIcon trend={trend} />
        Customer Compass
      </div>
      <div className="flex items-center gap-2 text-sm font-medium">
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-[9px] uppercase tracking-wider opacity-60">Prev.</span>
          <span className="inline-flex items-center gap-1.5 text-xs opacity-80">
            <span className="h-2.5 w-2.5 rounded-full ring-1 ring-current/20" style={{ backgroundColor: from.color }} />
            {from.name}
          </span>
        </div>
        <ArrowRight className="h-3.5 w-3.5 opacity-50 shrink-0" />
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-[9px] uppercase tracking-wider opacity-80">New</span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
            <span className="h-2.5 w-2.5 rounded-full ring-1 ring-current/20" style={{ backgroundColor: to.color }} />
            {to.name}
          </span>
        </div>
      </div>
    </div>
  );
};
