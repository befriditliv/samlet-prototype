import { activityStats, previousPeriods, pctChange } from "@/data/managerDemo";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Handshake, TrendingDown, TrendingUp, Calendar, Phone, Globe } from "lucide-react";

function ActivityTrend({ value }: { value: number }) {
  const Icon = value < 0 ? TrendingDown : TrendingUp;
  return <span className={cn("inline-flex items-center gap-1 text-xs font-medium tabular-nums", value < 0 ? "text-destructive" : "text-success")}><Icon className="h-3.5 w-3.5" />{value > 0 ? "+" : ""}{value}%</span>;
}

export const ActivityOverview = () => {
  const prev = previousPeriods.prev30;
  const metrics = [
    { label: "Møder", icon: Handshake, value: activityStats.meetings.total, previous: prev.meetings, detail: `${activityStats.meetings.physical} planlagte · ${activityStats.meetings.canvas} kanvas · ${activityStats.meetings.virtual} virtuelle` },
    { label: "Begivenheder", icon: Calendar, value: activityStats.events.total, previous: prev.events, detail: `${activityStats.events.breakdown.education} uddannelse · ${activityStats.events.breakdown.event} begivenheder` },
    { label: "Telefonopkald", icon: Phone, value: activityStats.phoneCalls.total, previous: prev.phoneCalls, detail: "Udgående HCP-opkald" },
    { label: "Digital kontakt", icon: Globe, value: activityStats.digital.total, previous: prev.digital, detail: `${activityStats.digital.breakdown.email} email · ${activityStats.digital.breakdown.newsletter} nyhedsbrev · ${activityStats.digital.breakdown.webPortal} web · ${activityStats.digital.breakdown.webinar} webinar` },
  ];
  return <div className="manager-band">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1"><strong className="text-xl tabular-nums">{activityStats.totalInteractions.total}</strong><span className="text-xs text-muted-foreground">Samlede interaktioner</span><ActivityTrend value={pctChange(activityStats.totalInteractions.total, prev.totalInteractions)} /></div>
      <p className="text-xs text-muted-foreground">Sidste 30 dage <span className="mx-1">·</span> {prev.label}: <strong className="font-medium text-foreground">{prev.totalInteractions}</strong></p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">{metrics.map(({ label, icon: Icon, value, previous, detail }) => <div key={label} className="min-w-0 border-b px-4 py-4 last:border-b-0 sm:px-5 sm:odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
      <p className="flex items-center gap-2 text-xs font-semibold"><Icon className="h-4 w-4 text-primary" />{label}</p>
      <div className="mt-2 flex items-center justify-between gap-2"><strong className="text-xl tabular-nums">{value}</strong><ActivityTrend value={pctChange(value, previous)} /></div>
      <p className="mt-1 text-xs text-muted-foreground">{prev.label}: <span className="font-medium text-foreground">{previous}</span></p>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>)}</div>
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t bg-muted/20 px-4 py-2.5 sm:px-5"><span className="text-xs text-muted-foreground"><strong className="font-medium text-foreground">{activityStats.meetings.debriefed} af {activityStats.meetings.total}</strong> møder debriefet</span><div className="flex items-center gap-2"><Progress value={activityStats.meetings.rate} className="h-1 w-24" /><strong className="text-xs text-primary">{activityStats.meetings.rate}%</strong></div></div>
  </div>;
};
