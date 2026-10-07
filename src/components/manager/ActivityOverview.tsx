import { useState } from "react";
import { activityStats, previousPeriods, pctChange } from "@/data/managerDemo";
import { cn } from "@/lib/utils";
import { useInViewOnce } from "@/hooks/use-in-view";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  TrendingDown,
  TrendingUp,
  Calendar,
  Phone,
  Layers,
  Globe,
} from "lucide-react";

type ComparisonValue = "prev30" | "prevQuarter" | "lastYear";

const COMPARISON_OPTIONS: { value: ComparisonValue; label: string }[] = [
  { value: "prev30", label: "vs. forrige 30 dage" },
  { value: "prevQuarter", label: "vs. forrige kvartal" },
  { value: "lastYear", label: "vs. samme periode sidste år" },
];

// Animated number component
const AnimatedNumber = ({
  value,
  suffix = "",
  animate,
}: {
  value: number | string;
  suffix?: string;
  animate?: boolean;
}) => <span className={cn("inline-block", animate && "animate-count-up")}>{value}{suffix}</span>;

export const ActivityOverview = () => {
  const { ref: meetingRef, inView: meetingInView } = useInViewOnce<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px",
  });
  const [comparison, setComparison] = useState<ComparisonValue>("prev30");
  const prev = previousPeriods[comparison];
  const trends = {
    meetings: pctChange(activityStats.meetings.total, prev.meetings),
    events: pctChange(activityStats.events.total, prev.events),
    phoneCalls: pctChange(activityStats.phoneCalls.total, prev.phoneCalls),
    digital: pctChange(activityStats.digital.total, prev.digital),
    totalInteractions: pctChange(activityStats.totalInteractions.total, prev.totalInteractions),
  };

  return (
    <div ref={meetingRef} className={cn(meetingInView && "animate-fade-in")}>
      {/* Integrated Activity Card */}
      <Card
        className={cn(
          "border-0 bg-gradient-to-br from-card via-card to-card/95 shadow-sm overflow-hidden",
          meetingInView && "animate-fade-in-up"
        )}
      >
        {/* Header with Total */}
        <div className="bg-gradient-to-r from-primary/8 via-primary/5 to-transparent px-6 py-5 border-b border-border/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold tracking-normal">
                    <AnimatedNumber value={activityStats.totalInteractions.total} animate={meetingInView} />
                  </span>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full",
                    trends.totalInteractions < 0 
                      ? "bg-destructive/10 text-destructive" 
                      : "bg-success/10 text-success"
                  )}>
                    {trends.totalInteractions < 0 ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : (
                      <TrendingUp className="h-4 w-4" />
                    )}
                    <span>{trends.totalInteractions > 0 ? "+" : ""}{trends.totalInteractions}%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Samlede interaktioner</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {prev.label}: <span className="font-medium text-foreground">{prev.totalInteractions}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex flex-wrap items-center gap-3 justify-end">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-normal">Periode</p>
                  <p className="text-sm font-semibold text-foreground">Sidste 30 dage</p>
                </div>
                <div className="h-8 w-px bg-border/50" />
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-normal">Sammenligning</p>
                  <Select value={comparison} onValueChange={(v) => setComparison(v as ComparisonValue)}>
                    <SelectTrigger className="h-8 w-[210px] mt-0.5 text-sm font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPARISON_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/30">
          {/* Meetings */}
          <div className="p-5 group hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Møder</span>
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                trends.meetings < 0 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-success/10 text-success"
              )}>
                {trends.meetings < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                <span>{trends.meetings > 0 ? "+" : ""}{trends.meetings}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold tracking-normal mb-2">
              <AnimatedNumber value={activityStats.meetings.total} animate={meetingInView} />
            </div>
            <p className="text-xs text-muted-foreground mb-2">{prev.label}: <span className="font-medium text-foreground">{prev.meetings}</span></p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span>{activityStats.meetings.physical} planlagte</span>
              <span>{activityStats.meetings.canvas} kanvas</span>
              <span>{activityStats.meetings.virtual} virtuelle</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={meetingInView ? activityStats.meetings.rate : 0} className="h-1.5 flex-1" />
              <span className="text-xs font-semibold text-primary">{activityStats.meetings.rate}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{activityStats.meetings.debriefed} debriefet</p>
          </div>

          {/* Events */}
          <div className="p-5 group hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Begivenheder</span>
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                trends.events < 0 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-success/10 text-success"
              )}>
                {trends.events < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                <span>{trends.events > 0 ? "+" : ""}{trends.events}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold tracking-normal mb-2">
              <AnimatedNumber value={activityStats.events.total} animate={meetingInView} />
            </div>
            <p className="text-xs text-muted-foreground mb-2">{prev.label}: <span className="font-medium text-foreground">{prev.events}</span></p>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span>{activityStats.events.breakdown.education} uddannelse</span>
              <span>·</span>
              <span>{activityStats.events.breakdown.event} begivenheder</span>
            </div>
          </div>

          {/* Phone Calls */}
          <div className="p-5 group hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Telefonopkald</span>
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                trends.phoneCalls < 0 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-success/10 text-success"
              )}>
                {trends.phoneCalls < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                <span>{trends.phoneCalls > 0 ? "+" : ""}{trends.phoneCalls}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold tracking-normal mb-2">
              <AnimatedNumber value={activityStats.phoneCalls.total} animate={meetingInView} />
            </div>
            <p className="text-xs text-muted-foreground mb-2">{prev.label}: <span className="font-medium text-foreground">{prev.phoneCalls}</span></p>
            <p className="text-xs text-muted-foreground">
              Udgående HCP-opkald
            </p>
          </div>

          {/* Digital */}
          <div className="p-5 group hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Digital kontakt</span>
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                trends.digital < 0 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-success/10 text-success"
              )}>
                {trends.digital < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                <span>{trends.digital > 0 ? "+" : ""}{trends.digital}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold tracking-normal mb-2">
              <AnimatedNumber value={activityStats.digital.total} animate={meetingInView} />
            </div>
            <p className="text-xs text-muted-foreground mb-2">{prev.label}: <span className="font-medium text-foreground">{prev.digital}</span></p>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span>{activityStats.digital.breakdown.email} email</span>
              <span>·</span>
              <span>{activityStats.digital.breakdown.newsletter} nyhedsbrev</span>
              <span>·</span>
              <span>{activityStats.digital.breakdown.webPortal} web</span>
              <span>·</span>
              <span>{activityStats.digital.breakdown.webinar} webinar</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
