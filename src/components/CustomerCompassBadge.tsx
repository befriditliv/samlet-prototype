import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CompassMovement, trendLabel } from "@/data/customerCompass";
import { cn } from "@/lib/utils";

interface CustomerCompassBadgeProps {
  movement: CompassMovement;
  className?: string;
}

const trendText = {
  positive: "text-success",
  negative: "text-destructive",
  neutral: "text-muted-foreground",
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
        "inline-flex items-center gap-4 rounded-xl border border-border/50 bg-card px-4 py-2.5",
        className,
      )}
      title={`Customer Compass — ${trendLabel(trend)}`}
    >
      <span className={cn("shrink-0", trendText[trend])}>
        <TrendIcon trend={trend} />
      </span>

      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Previous</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: from.color }} />
            {from.name}
          </span>
        </div>

        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />

        <div className="flex flex-col">
          <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">New</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: to.color }} />
            {to.name}
          </span>
        </div>
      </div>

      <span className={cn("ml-1 text-[10px] font-medium uppercase tracking-wide", trendText[trend])}>
        {trendLabel(trend)}
      </span>
    </div>
  );
};
