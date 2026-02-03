import { cn } from "@/lib/utils";
import { useInViewOnce } from "@/hooks/use-in-view";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TrendingDown,
  TrendingUp,
  Calendar,
  Phone,
  Layers,
  Globe
} from "lucide-react";

// Demo data matching production
const activityStats = {
  meetings: { 
    total: 142, 
    physical: 128,
    virtual: 14,
    debriefed: 118, 
    rate: 83.1,
    trend: +24.5
  },
  events: {
    total: 27,
    trend: +42,
    breakdown: {
      education: 15,
      event: 12
    }
  },
  phoneCalls: { 
    total: 114, 
    trend: -7.0
  },
  digital: {
    total: 209,
    trend: +32.4,
    breakdown: {
      email: 78,
      newsletter: 54,
      webPortal: 42,
      webinar: 28,
      other: 7
    }
  },
  totalInteractions: {
    total: 492,
    trend: +26.8
  }
};

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold tracking-tight">
                    <AnimatedNumber value={activityStats.totalInteractions.total} animate={meetingInView} />
                  </span>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full",
                    activityStats.totalInteractions.trend < 0 
                      ? "bg-destructive/10 text-destructive" 
                      : "bg-green-500/10 text-green-600"
                  )}>
                    {activityStats.totalInteractions.trend < 0 ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : (
                      <TrendingUp className="h-4 w-4" />
                    )}
                    <span>{activityStats.totalInteractions.trend > 0 ? "+" : ""}{activityStats.totalInteractions.trend}%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Total Interactions</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-3 justify-end">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Period</p>
                  <p className="text-sm font-semibold text-foreground">Last 30 days</p>
                </div>
                <div className="h-8 w-px bg-border/50" />
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Comparison</p>
                  <p className="text-sm font-medium text-muted-foreground">vs. previous 30 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/30">
          {/* Meetings */}
          <div className="p-5 group hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Meetings</span>
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                activityStats.meetings.trend < 0 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-green-500/10 text-green-600"
              )}>
                {activityStats.meetings.trend < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                <span>{activityStats.meetings.trend > 0 ? "+" : ""}{activityStats.meetings.trend}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold tracking-tight mb-2">
              <AnimatedNumber value={activityStats.meetings.total} animate={meetingInView} />
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span>{activityStats.meetings.physical} physical</span>
              <span>{activityStats.meetings.virtual} virtual</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={meetingInView ? activityStats.meetings.rate : 0} className="h-1.5 flex-1" />
              <span className="text-xs font-semibold text-primary">{activityStats.meetings.rate}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{activityStats.meetings.debriefed} debriefed</p>
          </div>

          {/* Events */}
          <div className="p-5 group hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Events</span>
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                activityStats.events.trend < 0 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-green-500/10 text-green-600"
              )}>
                {activityStats.events.trend < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                <span>{activityStats.events.trend > 0 ? "+" : ""}{activityStats.events.trend}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold tracking-tight mb-2">
              <AnimatedNumber value={activityStats.events.total} animate={meetingInView} />
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span>{activityStats.events.breakdown.education} education</span>
              <span>·</span>
              <span>{activityStats.events.breakdown.event} events</span>
            </div>
          </div>

          {/* Phone Calls */}
          <div className="p-5 group hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Phone Calls</span>
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                activityStats.phoneCalls.trend < 0 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-green-500/10 text-green-600"
              )}>
                {activityStats.phoneCalls.trend < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                <span>{activityStats.phoneCalls.trend > 0 ? "+" : ""}{activityStats.phoneCalls.trend}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold tracking-tight mb-2">
              <AnimatedNumber value={activityStats.phoneCalls.total} animate={meetingInView} />
            </div>
            <p className="text-xs text-muted-foreground">
              Outbound HCP calls
            </p>
          </div>

          {/* Digital */}
          <div className="p-5 group hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Digital</span>
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                activityStats.digital.trend < 0 
                  ? "bg-destructive/10 text-destructive" 
                  : "bg-green-500/10 text-green-600"
              )}>
                {activityStats.digital.trend < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                <span>{activityStats.digital.trend > 0 ? "+" : ""}{activityStats.digital.trend}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold tracking-tight mb-2">
              <AnimatedNumber value={activityStats.digital.total} animate={meetingInView} />
            </div>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <span>{activityStats.digital.breakdown.email} email</span>
              <span>·</span>
              <span>{activityStats.digital.breakdown.newsletter} newsletter</span>
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
