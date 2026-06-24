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
        "inline-flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-3 shadow-sm",
        className,
      )}
      title={`Customer Compass — ${trendLabel(trend)}`}
    >
      <div className="flex items-center gap-2">
        <span className={cn("flex items-center justify-center rounded-full p-1", trendText[trend])}>
          <TrendIcon trend={trend} />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Customer Compass
        </span>
        <span className={cn("ml-auto text-[10px] font-medium uppercase tracking-wide", trendText[trend])}>
          {trendLabel(trend)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Previous
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: from.color }} />
            <span className="truncate">{from.name}</span>
          </div>
        </div>

        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />

        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            New
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: to.color }} />
            <span className="truncate">{to.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
