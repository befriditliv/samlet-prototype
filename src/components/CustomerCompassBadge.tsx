import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CompassMovement, trendLabel } from "@/data/customerCompass";
import { cn } from "@/lib/utils";

interface CustomerCompassBadgeProps {
  movement: CompassMovement;
  className?: string;
}

const trendStyles = {
  positive: "border-l-success/60 bg-success/[0.04]",
  negative: "border-l-destructive/60 bg-destructive/[0.04]",
  neutral: "border-l-border bg-muted/30",
} as const;

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
        "inline-block rounded-lg border border-border/60 border-l-4 p-3 shadow-sm",
        trendStyles[trend],
        className,
      )}
      title={`Customer Compass — ${trendLabel(trend)}`}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <span className={cn("flex items-center justify-center rounded-full p-1", trendText[trend])}>
          <TrendIcon trend={trend} />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Customer Compass
        </span>
        <span className={cn("ml-auto text-[10px] font-medium uppercase tracking-wide", trendText[trend])}>
          {trendLabel(trend)}
        </span>
      </div>

      <div className="flex items-stretch gap-2">
        <div className="flex-1 rounded-md border border-border/60 bg-background/80 p-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            Previous
          </div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: from.color }} />
            {from.name}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex-1 rounded-md border border-border/60 bg-background/80 p-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
            New
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: to.color }} />
            {to.name}
          </div>
        </div>
      </div>
    </div>
  );
};
