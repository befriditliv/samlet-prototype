import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, UserPlus, FileWarning, AlertTriangle, BellRing, ArrowRight } from "lucide-react";
import { openAskJarvis } from "@/components/AskJarvis";

type Suggestion = {
  id: string;
  icon: typeof UserPlus;
  category: string;
  tone: "primary" | "warning" | "danger" | "info";
  title: string;
  description: string;
  meta: string;
  cta: string;
  prompt: string;
};

const toneStyles: Record<Suggestion["tone"], { iconBg: string; iconColor: string; badge: string }> = {
  primary: {
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    badge: "bg-primary/10 text-primary border-primary/20",
  },
  warning: {
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  danger: {
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    badge: "bg-destructive/10 text-destructive border-destructive/20",
  },
  info: {
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
};

const suggestions: Suggestion[] = [
  {
    id: "reach-out",
    icon: UserPlus,
    category: "Reach out",
    tone: "primary",
    title: "3 high-value HCPs flagged by Signals",
    description:
      "Dr. Lindgren, Dr. Patel and Dr. Moreau show rising engagement signals but no contact in 30+ days. A short check-in could move them forward.",
    meta: "Based on Signals · Segment A",
    cta: "See HCPs to reach out to",
    prompt: "Show me the HCPs I should reach out to based on Signals",
  },
  {
    id: "missing-debriefs",
    icon: FileWarning,
    category: "Missing debriefs",
    tone: "warning",
    title: "5 meetings still missing a debrief",
    description:
      "Meetings from this week without a submitted debrief. Completing them now keeps insights fresh and your follow-ups on track.",
    meta: "Last 7 days",
    cta: "Open missing debriefs",
    prompt: "Show me the meetings that are missing a debrief",
  },
  {
    id: "low-quality",
    icon: AlertTriangle,
    category: "Low quality",
    tone: "danger",
    title: "2 debriefs with low quality scores",
    description:
      "Short debriefs with limited context. A few extra details — outcome, next step, HCP reaction — can lift quality and follow-up value.",
    meta: "Quality score below 5/10",
    cta: "Review low-quality debriefs",
    prompt: "Show me debriefs with low quality scores I should improve",
  },
  {
    id: "follow-ups",
    icon: BellRing,
    category: "Follow-ups",
    tone: "info",
    title: "4 follow-ups due this week",
    description:
      "Commitments from previous debriefs are coming due — including a sample drop for Dr. Hansen and a clinical paper share with Dr. Okafor.",
    meta: "Based on previous debriefs",
    cta: "View follow-up reminders",
    prompt: "Show me follow-ups due based on my previous debriefs",
  },
];

export const CoachingSuggestions = () => {
  const handleAction = (prompt: string) => {
    openAskJarvis();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("ask-jarvis-prefill", { detail: { prompt } }));
    }, 100);
  };

  return (
    <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-primary/[0.04] via-card to-card">
      <div className="flex items-start justify-between gap-4 border-b border-border/50 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">Jarvis Coaching</h3>
              <Badge variant="secondary" className="text-[10px] font-medium uppercase tracking-wide">
                For you today
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Personal nudges based on your team's Signals, debriefs and follow-ups
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
        {suggestions.map((s) => {
          const styles = toneStyles[s.tone];
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className="group flex flex-col gap-3 rounded-xl border border-border/60 bg-card/80 p-4 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className={`shrink-0 rounded-lg p-2 ${styles.iconBg}`}>
                  <Icon className={`h-4 w-4 ${styles.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <Badge
                    variant="outline"
                    className={`mb-1.5 text-[10px] font-medium uppercase tracking-wide ${styles.badge}`}
                  >
                    {s.category}
                  </Badge>
                  <h4 className="text-sm font-semibold leading-snug text-foreground">{s.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
                    {s.meta}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAction(s.prompt)}
                  className="h-8 gap-1.5 text-xs font-medium text-primary hover:bg-primary/10 hover:text-primary"
                >
                  {s.cta}
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