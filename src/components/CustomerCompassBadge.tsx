import { ArrowRight, TrendingUp, TrendingDown, Minus, Compass, CalendarClock } from "lucide-react";
import { CompassMovement, trendLabel, getCompassPrediction } from "@/data/customerCompass";
import { cn } from "@/lib/utils";

interface CustomerCompassBadgeProps {
  movement: CompassMovement;
  /** HCP/HCO name — used for the predicted category drop. */
  name?: string;
  className?: string;
}

const trendStyles = {
  positive: {
    text: "text-success",
    chip: "bg-success/10 text-success",
    Icon: TrendingUp,
  },
  negative: {
    text: "text-destructive",
    chip: "bg-destructive/10 text-destructive",
    Icon: TrendingDown,
  },
  neutral: {
    text: "text-muted-foreground",
    chip: "bg-muted text-muted-foreground",
    Icon: Minus,
  },
} as const;

const CategoryPill = ({
  label,
  name,
  color,
  emphasized,
}: {
  label: string;
  name: string;
  color: string;
  emphasized?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
      {label}
    </span>
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card px-2 py-1 text-sm",
        emphasized ? "font-semibold text-foreground shadow-sm" : "font-medium text-muted-foreground",
      )}
    >
      <span className="h-2.5 w-2.5 rounded-full ring-2 ring-background" style={{ backgroundColor: color }} />
      {name}
    </span>
  </div>
);

export const CustomerCompassBadge = ({ movement, name, className }: CustomerCompassBadgeProps) => {
  const { from, to, trend } = movement;
  const style = trendStyles[trend];
  const TrendIcon = style.Icon;
  const prediction = name ? getCompassPrediction(name, to) : null;

  return (
    <div
      className={cn(
        "rounded-xl border border-border/60 bg-muted/30 p-3",
        className,
      )}
    >
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Compass className="h-3.5 w-3.5" />
          Customer Compass
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
            style.chip,
          )}
        >
          <TrendIcon className="h-3 w-3" />
          {trendLabel(trend)}
        </span>
      </div>

      {/* Movement row */}
      <div className="flex items-center gap-3">
        <CategoryPill label="From" name={from.name} color={from.color} />
        <ArrowRight className={cn("mt-4 h-4 w-4 shrink-0", style.text)} />
        <CategoryPill label="To" name={to.name} color={to.color} emphasized />
      </div>

      {/* Predicted next drop */}
      {prediction && (
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border/60 pt-2.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <CalendarClock className="h-3.5 w-3.5" />
            Predicted drop
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-card px-1.5 py-0.5 font-medium text-foreground">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: prediction.category.color }}
            />
            {prediction.category.name}
          </span>
          <span>· {prediction.expectedDate}</span>
          <span>· {prediction.confidence}% confidence</span>
        </div>
      )}
    </div>
  );
};
