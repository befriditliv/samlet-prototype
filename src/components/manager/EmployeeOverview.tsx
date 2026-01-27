import { useState } from "react";
import { cn } from "@/lib/utils";
import { useInViewOnce } from "@/hooks/use-in-view";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Monitor, 
  Activity,
  TrendingDown,
  CheckCircle,
  AlertCircle,
  Search,
  ChevronDown,
  TrendingUp,
  Calendar,
  Phone,
  Layers,
  Mail,
  Globe
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";

// Demo data matching production
const activityStats = {
  meetings: { 
    total: 62, 
    physical: 60,
    virtual: 2,
    debriefed: 40, 
    rate: 64.5,
    trend: -20.5
  },
  events: {
    total: 8,
    trend: +60,
    breakdown: {
      education: 5,
      event: 3
    }
  },
  phoneCalls: { 
    total: 42, 
    trend: -17.6
  },
  digital: {
    total: 29,
    trend: -25.6,
    breakdown: {
      email: 12,
      newsletter: 8,
      webPortal: 5,
      webinar: 3,
      other: 1
    }
  },
  totalInteractions: {
    total: 141,
    trend: -18.5
  }
};

const debriefQuality = [
  {
    week: "Week 49, 2025",
    score: "6/10",
    quality: "medium",
    highlights: [
      "Highlights:",
      "Debriefs generally contain clear structure with purpose, activity summary and next call objectives.",
      "Several debriefs describe HCP reactions and engagement, providing insight into meeting dynamics and future opportunities.",
      "Areas for Improvement:",
      "Many debriefs are still superficial and lack concrete, action-oriented insights or follow-up; reactions from HCPs are often generic or absent.",
      "There is a need for more specific documentation of HCP concerns, barriers and agreed actions to increase operational value.",
      "Week-over-Week Comparison:",
      "Quality is unchanged from last week (6/10); debriefs remain at a solid but mediocre level with good structure, but still lack depth and concrete insights that would elevate them to a higher quality level."
    ]
  },
  {
    week: "Week 50, 2025",
    score: "6/10",
    quality: "medium",
    highlights: [
      "Highlights:",
      "Several debriefs contain concrete HCP reactions and clear follow-up, providing a good picture of engagement and next steps.",
      "Purpose and activities are generally clearly described, with focus on relevant topics such as guidelines, treatment plans and treatment options.",
      "Areas for Improvement:",
      "Several debriefs lack depth in HCP concerns and reactions; follow-up is often generic or lacks details on responsibility and action.",
      "Some debriefs are very short and superficial, especially when only establishing contact or delivering materials.",
      "Week-over-Week Comparison:",
      "Quality is unchanged from last week; there is still good structure and relevant topics, but debriefs still lack the level of detail and insight needed to elevate them to a higher level. No significant improvement or deterioration observed."
    ]
  }
];

const qualityTrendData = [
  { week: "W47", team: 6, avg: 6, fullWeek: "Week 47" },
  { week: "W48", team: 7, avg: 6, fullWeek: "Week 48" },
  { week: "W49", team: 6, avg: 6, fullWeek: "Week 49" },
  { week: "W50", team: 6, avg: 6, fullWeek: "Week 50" }
];

const employeeData = [
  { 
    name: "Lenette Skott", 
    adherence: 83, 
    avgLength: 888, 
    completed: 5, 
    outstanding: 1,
    meetingsNextWeek: 4 
  },
  { 
    name: "Gitte Baker", 
    adherence: 70, 
    avgLength: 435, 
    completed: 14, 
    outstanding: 6,
    meetingsNextWeek: 3 
  },
  { 
    name: "Christian Schmidt Larsen", 
    adherence: 62, 
    avgLength: 1128, 
    completed: 16, 
    outstanding: 10,
    meetingsNextWeek: 0 
  },
  { 
    name: "Christine Willesen", 
    adherence: 56, 
    avgLength: 980, 
    completed: 5, 
    outstanding: 4,
    meetingsNextWeek: 4 
  }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border rounded-xl shadow-lg px-4 py-3 animate-scale-in">
        <p className="text-sm font-medium text-foreground mb-2">{payload[0]?.payload?.fullWeek}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-semibold text-foreground">{entry.value}/10</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
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

export const EmployeeOverview = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const { ref: meetingRef, inView: meetingInView } = useInViewOnce<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px",
  });
  const { ref: debriefRef, inView: debriefInView } = useInViewOnce<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px",
  });
  const { ref: trendRef, inView: trendInView } = useInViewOnce<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px",
  });
  const { ref: tableRef, inView: tableInView } = useInViewOnce<HTMLDivElement>({
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px",
  });

  const filteredEmployees = employeeData.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Activity Overview */}
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

      {/* Debrief Quality */}
      <div ref={debriefRef} className={cn(debriefInView && "animate-fade-in")}>
        <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase mb-4">Debrief Quality</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {debriefQuality.map((week, idx) => (
            <Card
              key={week.week}
              className={cn(
                "border-0 bg-gradient-to-br from-card to-card/80 shadow-sm hover:shadow-md transition-all duration-300",
                debriefInView && "animate-fade-in-up"
              )}
              style={debriefInView ? { animationDelay: `${idx * 60}ms` } : undefined}
            >
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-foreground text-lg">{week.week}</span>
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-200/50 hover:bg-amber-500/20 font-medium">
                    {week.score} · Medium quality
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                  {week.highlights.map((line, idx) => (
                    <p key={idx} className={line.endsWith(':') ? 'font-semibold text-foreground mt-4 first:mt-0 text-xs uppercase tracking-wide' : 'leading-relaxed'}>
                      {line}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quality Trend Chart */}
      <Card
        ref={trendRef}
        className={cn(
          "border-0 bg-gradient-to-br from-card to-card/80 shadow-sm overflow-hidden",
          trendInView && "animate-fade-in"
        )}
      >
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wide">Quality Trend</h3>
              <p className="text-xs text-muted-foreground mt-1">Last 4 weeks performance comparison</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary shadow-sm shadow-primary/30" />
                <span className="text-sm text-muted-foreground">Your Team</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
                <span className="text-sm text-muted-foreground">Country Average</span>
              </div>
            </div>
          </div>
          
          <div className="h-56 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                key={trendInView ? "trend-on" : "trend-off"}
                data={qualityTrendData}
                margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="teamGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="week" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  dy={10}
                />
                <YAxis 
                  domain={[0, 10]} 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="team"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fill="url(#teamGradient)"
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 5 }}
                  activeDot={{ fill: 'hsl(var(--primary))', strokeWidth: 3, stroke: 'white', r: 7 }}
                  name="Your Team"
                  isAnimationActive={trendInView}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
                <Line 
                  type="monotone" 
                  dataKey="avg" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 0, r: 4 }}
                  activeDot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, stroke: 'white', r: 6 }}
                  name="Country Average"
                  isAnimationActive={trendInView}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Current Score Indicator */}
          <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-border/50">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">6<span className="text-lg text-muted-foreground">/10</span></div>
              <p className="text-xs text-muted-foreground mt-1">Current Score</p>
            </div>
            <div className="h-10 w-px bg-border/50" />
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-muted">
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">-1 from peak</p>
                <p className="text-xs text-muted-foreground">Week 48 was highest</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Overview Table */}
      <div ref={tableRef} className={cn(tableInView && "animate-fade-in")}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Employee Overview</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 h-9 border-0 bg-muted/50 focus:bg-card transition-colors"
            />
          </div>
        </div>
        <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-4 px-5">
                    <div className="text-sm font-semibold text-foreground">Employee</div>
                    <div className="text-xs font-normal text-muted-foreground">Name</div>
                  </th>
                  <th className="text-left py-4 px-5">
                    <div className="text-sm font-semibold text-foreground">Debrief Adherence</div>
                    <div className="text-xs font-normal text-muted-foreground">Last 30 days</div>
                  </th>
                  <th className="text-left py-4 px-5">
                    <div className="text-sm font-semibold text-foreground">Avg. Debrief Length</div>
                    <div className="text-xs font-normal text-muted-foreground">Last 30 days</div>
                  </th>
                  <th className="text-left py-4 px-5">
                    <div className="text-sm font-semibold text-foreground">Debriefs</div>
                    <div className="text-xs font-normal text-muted-foreground">Last 30 days</div>
                  </th>
                  <th className="text-left py-4 px-5">
                    <div className="text-sm font-semibold text-foreground">Meetings</div>
                    <div className="text-xs font-normal text-muted-foreground">Next 7 days</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp, idx) => (
                  <tr
                    key={emp.name}
                    className={cn(
                      "group hover:bg-muted/30 transition-colors",
                      tableInView && "animate-fade-in",
                      idx !== filteredEmployees.length - 1 && "border-b border-border/50"
                    )}
                    style={tableInView ? { animationDelay: `${idx * 50}ms` } : undefined}
                  >
                    <td className="py-4 px-5">
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">{emp.name}</span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-28 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-700 ease-out"
                            style={{
                              width: tableInView ? `${emp.adherence}%` : "0%",
                              transitionDelay: tableInView ? `${idx * 50}ms` : "0ms",
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-foreground w-12">{emp.adherence}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-semibold text-foreground">{emp.avgLength.toLocaleString()}</span>
                      <span className="text-muted-foreground ml-1 text-sm">chars</span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-0.5 rounded-full bg-green-500/10">
                            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          </div>
                          <span className="text-muted-foreground">Completed:</span>
                          <span className="font-medium text-foreground">{emp.completed}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className={`p-0.5 rounded-full ${emp.outstanding > 5 ? 'bg-destructive/10' : 'bg-amber-500/10'}`}>
                            <AlertCircle className={`h-3.5 w-3.5 ${emp.outstanding > 5 ? 'text-destructive' : 'text-amber-500'}`} />
                          </div>
                          <span className="text-muted-foreground">Outstanding:</span>
                          <span className="font-medium text-foreground">{emp.outstanding}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className={`inline-flex items-center justify-center w-9 h-9 rounded-full font-semibold text-sm transition-all ${
                        emp.meetingsNextWeek === 0 
                          ? 'bg-destructive/10 text-destructive' 
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {emp.meetingsNextWeek}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border/50 p-4 flex justify-center bg-muted/20">
            <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)} className="text-muted-foreground hover:text-foreground">
              Show more <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
