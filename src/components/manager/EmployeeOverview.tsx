import { useState } from "react";
import { cn } from "@/lib/utils";
import { useInViewOnce } from "@/hooks/use-in-view";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CheckCircle,
  AlertCircle,
  Send,
  ChevronDown,
  TrendingUp
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from "recharts";

const debriefQuality = [
  {
    week: "Week 49, 2025",
    score: "7/10",
    quality: "medium",
    highlights: [
      "Highlights:",
      "Debriefs contain clear structure with purpose, activity summaries and defined next steps.",
      "Good documentation of HCP reactions, providing solid insight into engagement levels.",
      "Areas for Improvement:",
      "Some debriefs could include more specific HCP quotes and concrete timelines.",
      "Week-over-Week Comparison:",
      "Stable quality at 7/10 with consistent structure and improving depth of insights."
    ]
  },
  {
    week: "Week 50, 2025",
    score: "9/10",
    quality: "good",
    highlights: [
      "Highlights:",
      "Excellent debrief quality with detailed HCP reactions, specific quotes, and clear action items with deadlines.",
      "Strong focus on concrete agreements, treatment discussions, and documented next steps with responsible parties.",
      "Outstanding documentation of patient case discussions and clinical concerns.",
      "Areas for Improvement:",
      "Maintain the excellent momentum established this week.",
      "Week-over-Week Comparison:",
      "Strong improvement from 8/10 to 9/10. Team has significantly elevated quality across all dimensions. Debriefs now consistently include rich detail and actionable insights."
    ]
  }
];

const qualityTrendData = [
  { week: "W47", team: 6, avg: 6, fullWeek: "Week 47" },
  { week: "W48", team: 7, avg: 6, fullWeek: "Week 48" },
  { week: "W49", team: 7, avg: 7, fullWeek: "Week 49" },
  { week: "W50", team: 9, avg: 7, fullWeek: "Week 50" }
];

const employeeData = [
  {
    name: "Sarah Mitchell",
    planned: 74, canvas: 21,
    completed: 88, notSent: 0, outstanding: 7,
    adherence: 93,
    cancelled: 4,
    plannedThisWeek: 10, plannedNextWeek: 3,
  },
  {
    name: "James Harrison",
    planned: 74, canvas: 27,
    completed: 101, notSent: 0, outstanding: 0,
    adherence: 100,
    cancelled: 2,
    plannedThisWeek: 20, plannedNextWeek: 0,
  },
  {
    name: "Emily Thompson",
    planned: 38, canvas: 31,
    completed: 62, notSent: 0, outstanding: 7,
    adherence: 90,
    cancelled: 5,
    plannedThisWeek: 9, plannedNextWeek: 7,
  },
  {
    name: "Michael Chen",
    planned: 4, canvas: 0,
    completed: 3, notSent: 0, outstanding: 1,
    adherence: 75,
    cancelled: 1,
    plannedThisWeek: 0, plannedNextWeek: 0,
  },
  {
    name: "Catherine Williams",
    planned: 0, canvas: 0,
    completed: 0, notSent: 0, outstanding: 0,
    adherence: 0,
    cancelled: 0,
    plannedThisWeek: 0, plannedNextWeek: 0,
  },
  {
    name: "David Roberts",
    planned: 52, canvas: 18,
    completed: 64, notSent: 1, outstanding: 5,
    adherence: 89,
    cancelled: 3,
    plannedThisWeek: 8, plannedNextWeek: 5,
  },
  {
    name: "Jennifer Adams",
    planned: 41, canvas: 22,
    completed: 55, notSent: 0, outstanding: 6,
    adherence: 87,
    cancelled: 4,
    plannedThisWeek: 6, plannedNextWeek: 4,
  },
  {
    name: "Robert Taylor",
    planned: 33, canvas: 12,
    completed: 38, notSent: 2, outstanding: 5,
    adherence: 80,
    cancelled: 2,
    plannedThisWeek: 5, plannedNextWeek: 3,
  },
  {
    name: "Amanda Clarke",
    planned: 28, canvas: 9,
    completed: 30, notSent: 1, outstanding: 6,
    adherence: 78,
    cancelled: 6,
    plannedThisWeek: 4, plannedNextWeek: 2,
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

export const EmployeeOverview = () => {
  const [signalFilter, setSignalFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [showAll, setShowAll] = useState(false);

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

  const filteredEmployees = employeeData.filter((emp) => {
    if (userFilter !== "all" && emp.name !== userFilter) return false;
    if (signalFilter === "low-adherence" && emp.adherence >= 85) return false;
    if (signalFilter === "high-cancellations" && emp.cancelled < 4) return false;
    if (signalFilter === "outstanding-debriefs" && emp.outstanding < 5) return false;
    return true;
  });

  const displayedEmployees = showAll ? filteredEmployees : filteredEmployees.slice(0, 5);

  return (
    <div className="space-y-8">
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
                  <Badge className={cn(
                    "font-medium",
                    week.quality === 'good' 
                      ? "bg-green-500/10 text-green-600 border-green-200/50 hover:bg-green-500/20"
                      : "bg-amber-500/10 text-amber-600 border-amber-200/50 hover:bg-amber-500/20"
                  )}>
                    {week.score} · {week.quality === 'good' ? 'High quality' : 'Medium quality'}
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
              <div className="text-3xl font-bold text-primary">9<span className="text-lg text-muted-foreground">/10</span></div>
              <p className="text-xs text-muted-foreground mt-1">Current Score</p>
            </div>
            <div className="h-10 w-px bg-border/50" />
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-green-500/10">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">+2 from last week</p>
                <p className="text-xs text-muted-foreground">Strong improvement in W50</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Overview Table */}
      <div ref={tableRef} className={cn(tableInView && "animate-fade-in")}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">Employee Overview</h3>
          <div className="flex items-center gap-3">
            <Select value={signalFilter} onValueChange={setSignalFilter}>
              <SelectTrigger className="h-9 w-56 bg-muted/50 border-0">
                <SelectValue placeholder="Filter by signal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All signals</SelectItem>
                <SelectItem value="low-adherence">Low debrief adherence</SelectItem>
                <SelectItem value="high-cancellations">High cancellations</SelectItem>
                <SelectItem value="outstanding-debriefs">Outstanding debriefs</SelectItem>
              </SelectContent>
            </Select>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="h-9 w-56 bg-muted/50 border-0">
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All users</SelectItem>
                {employeeData.map((emp) => (
                  <SelectItem key={emp.name} value={emp.name}>{emp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                    <div className="text-sm font-semibold text-foreground">Meetings last 30 days</div>
                    <div className="text-xs font-normal text-muted-foreground">Planned / Canvas</div>
                  </th>
                  <th className="text-left py-4 px-5">
                    <div className="text-sm font-semibold text-foreground">Debriefs</div>
                    <div className="text-xs font-normal text-muted-foreground">Last 30 days</div>
                  </th>
                  <th className="text-left py-4 px-5">
                    <div className="text-sm font-semibold text-foreground">Debrief Adherence</div>
                    <div className="text-xs font-normal text-muted-foreground">Last 30 days</div>
                  </th>
                  <th className="text-left py-4 px-5">
                    <div className="text-sm font-semibold text-foreground">Cancelled meetings</div>
                    <div className="text-xs font-normal text-muted-foreground">Last 30 days</div>
                  </th>
                  <th className="text-left py-4 px-5">
                    <div className="text-sm font-semibold text-foreground">Planned meetings</div>
                    <div className="text-xs font-normal text-muted-foreground">This week / Next week</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedEmployees.map((emp, idx) => (
                  <tr
                    key={emp.name}
                    className={cn(
                      "group hover:bg-muted/30 transition-colors",
                      tableInView && "animate-fade-in",
                      idx !== displayedEmployees.length - 1 && "border-b border-border/50"
                    )}
                    style={tableInView ? { animationDelay: `${idx * 50}ms` } : undefined}
                  >
                    <td className="py-4 px-5">
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors">{emp.name}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-semibold text-foreground tabular-nums">{emp.planned} / {emp.canvas}</span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-0.5 rounded-full bg-primary/10">
                            <CheckCircle className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span className="text-muted-foreground">Completed:</span>
                          <span className="font-medium text-foreground">{emp.completed}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-0.5 rounded-full bg-amber-500/10">
                            <Send className="h-3.5 w-3.5 text-amber-500" />
                          </div>
                          <span className="text-muted-foreground">Not sent:</span>
                          <span className="font-medium text-foreground">{emp.notSent}</span>
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
                      <div className="flex items-center gap-3">
                        <div className="relative w-28 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-destructive to-destructive/70 rounded-full transition-all duration-700 ease-out"
                            style={{
                              width: tableInView ? `${Math.min(emp.cancelled * 10, 100)}%` : "0%",
                              transitionDelay: tableInView ? `${idx * 50}ms` : "0ms",
                            }}
                          />
                        </div>
                        <span className="text-sm font-bold text-foreground w-8">{emp.cancelled}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5 text-sm">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold ${
                          emp.plannedThisWeek === 0
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {emp.plannedThisWeek}
                        </div>
                        <span className="text-muted-foreground">/</span>
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold ${
                          emp.plannedNextWeek === 0
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-primary/10 text-primary'
                        }`}>
                          {emp.plannedNextWeek}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredEmployees.length > 5 && (
            <div className="border-t border-border/50 p-4 flex justify-center bg-muted/20">
              <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)} className="text-muted-foreground hover:text-foreground">
                {showAll ? 'Show less' : `Show all ${filteredEmployees.length} employees`}
                <ChevronDown className={cn("h-4 w-4 ml-1 transition-transform", showAll && "rotate-180")} />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
