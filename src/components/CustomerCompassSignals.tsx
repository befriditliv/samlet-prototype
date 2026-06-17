import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Compass, ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCompassMovement, trendLabel, CompassMovement } from "@/data/customerCompass";
import { openAskJarvis } from "@/components/AskJarvis";

// HCPs whose Customer Compass category changed recently (mock signal feed).
const trackedHcps = [
  "Dr. Sarah Johnson",
  "Dr. Michael Chen",
  "Dr. Lindgren",
  "Dr. Patel",
  "Dr. Sørensen",
];

const trendStyles = {
  positive: { icon: TrendingUp, badge: "bg-success/10 text-success border-success/20" },
  negative: { icon: TrendingDown, badge: "bg-destructive/10 text-destructive border-destructive/20" },
  neutral: { icon: Minus, badge: "bg-muted text-muted-foreground border-border" },
} as const;

export const CustomerCompassSignals = () => {
  const navigate = useNavigate();

  const changes = trackedHcps
    .map((name) => ({ name, movement: getCompassMovement(name) }))
    .filter((c) => c.movement.trend !== "neutral");

  const handleAsk = (name: string, m: CompassMovement) => {
    openAskJarvis();
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("ask-jarvis-prefill", {
          detail: {
            prompt: `${name}'s Customer Compass moved from ${m.from.name} to ${m.to.name}. What should I do?`,
          },
        }),
      );
    }, 100);
  };

  return (
    <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-primary/[0.04] via-card to-card">
      <div className="flex items-start gap-3 border-b border-border/50 p-5">
        <div className="rounded-xl bg-primary/10 p-2.5">
          <Compass className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">Customer Compass changes</h3>
            <Badge variant="secondary" className="text-[10px] font-medium uppercase tracking-wide">
              {changes.length} this month
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            HCPs that moved between Customer Compass categories recently
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
        {changes.map(({ name, movement }) => {
          const style = trendStyles[movement.trend];
          const Icon = style.icon;
          return (
            <div
              key={name}
              className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-card/80 p-4 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="truncate text-sm font-semibold text-foreground">{name}</h4>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: movement.from.color }} />
                      {movement.from.name}
                    </span>
                    <ArrowRight className="h-3 w-3 opacity-60" />
                    <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: movement.to.color }} />
                      {movement.to.name}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className={`shrink-0 gap-1 text-[10px] ${style.badge}`}>
                  <Icon className="h-3 w-3" />
                  {trendLabel(movement.trend)}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/hcp/${encodeURIComponent(name)}`)}
                  className="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  View HCP
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAsk(name, movement)}
                  className="h-8 gap-1.5 text-xs font-medium text-primary hover:bg-primary/10 hover:text-primary"
                >
                  Ask Jarvis
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
