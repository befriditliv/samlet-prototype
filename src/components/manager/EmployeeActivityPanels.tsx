import { BookOpen, CalendarClock, CalendarX2, Layers, TrendingDown, TrendingUp, Users, CalendarOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { employeeActivity } from "@/data/managerDemo";
import { cn } from "@/lib/utils";

const Bar = ({ pct, tone }: { pct: number; tone: string }) => (
  <div className="mt-3 h-1.5 w-full rounded-full bg-muted"><div className={cn("h-1.5 rounded-full", tone)} style={{ width: `${Math.min(100, pct)}%` }} /></div>
);

const Trend = ({ value }: { value: number }) => {
  const up = value >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold", up ? "border-green-500/30 bg-green-500/10 text-green-600" : "border-destructive/30 bg-destructive/10 text-destructive")}><Icon className="h-3 w-3" />{up ? "+" : ""}{value}{"%"}</span>;
};

export const EmployeeActivityPanels = ({ slug, noData }: { slug: string; noData: boolean }) => {
  const d = employeeActivity[slug] ?? employeeActivity.christian;
  if (noData) return <Card className="border-0 p-8 text-center text-sm text-muted-foreground shadow-sm">No meetings, plan progress or quality trend for the selected demo scenario.</Card>;
  const plan = d.plan;
  const planPct = Math.round((plan.done / plan.planned) * 100);
  const m = d.meetings;
  const pct = (n: number) => Math.round((n / m.total) * 100);
  const q = d.qualityTrend;
  const qDelta = +(q.current - q.previous).toFixed(1);

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="text-xl font-bold">Progress towards contact plans</h3>
        <Card className="border-0 p-6 shadow-sm">
          <p className="text-4xl font-bold">{plan.done} / {plan.planned}</p>
          <div className="mt-1 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm">planned visits completed ({planPct}%) · {plan.customers} customers with targets</p>
            <p className="text-sm text-muted-foreground">Plan period {plan.period}</p>
          </div>
          <Bar pct={planPct} tone="bg-primary" />
          <p className="mt-3 text-xs text-muted-foreground">Included channels: physical visits · {plan.excluded} plans excluded: invalid or overlapping targets · Demo data</p>
        </Card>
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-bold">Meetings and debrief quality</h3>
        <Card className="overflow-hidden border-0 shadow-sm">
          <div className="flex items-center gap-4 border-b bg-muted/20 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><Layers className="h-5 w-5 text-primary" /></div>
            <div><p className="text-3xl font-bold leading-none">{m.total}</p><p className="mt-1 text-sm text-muted-foreground">Meetings in total</p></div>
          </div>
          <div className="grid divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="p-5">
              <p className="flex items-center gap-2 text-sm font-medium"><Users className="h-4 w-4 text-primary" />Meetings held</p>
              <p className="mt-3 flex items-center gap-2 text-3xl font-bold">{m.held} <Trend value={m.heldTrend} /></p>
              <p className="mt-2 text-xs text-muted-foreground">{m.planned} planned · {m.canvas} canvas · {m.virtual} virtual</p>
            </div>
            <div className="p-5">
              <p className="flex items-center gap-2 text-sm font-medium"><BookOpen className="h-4 w-4 text-primary" />Debrief compliance</p>
              <p className="mt-3 flex items-center gap-2 text-3xl font-bold">{Math.round((m.debriefed / m.held) * 100)}%</p>
              <Bar pct={(m.debriefed / m.held) * 100} tone="bg-primary" />
              <p className="mt-2 text-xs text-muted-foreground">{m.debriefed} debriefed · {m.held - m.debriefed} outstanding</p>
            </div>
            <div className="p-5">
              <p className="flex items-center gap-2 text-sm font-medium">{qDelta >= 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-destructive" />}Debrief quality trend</p>
              <p className="mt-3 flex items-center gap-2 text-3xl font-bold">{q.current.toFixed(1)}<span className="text-base font-normal text-muted-foreground">/ 10</span> <Badge variant="outline" className={qDelta >= 0 ? "text-green-600" : "text-destructive"}>{qDelta >= 0 ? "Rising" : "Falling"} {qDelta >= 0 ? "+" : ""}{qDelta}</Badge></p>
              <p className="mt-2 text-xs text-muted-foreground">Last 30 days vs. previous 30 days ({q.previous.toFixed(1)}) · n = {q.n}</p>
            </div>
          </div>
          <div className="grid divide-y border-t md:grid-cols-3 md:divide-x md:divide-y-0">
            {[
              [CalendarX2, "Deleted meetings", m.deleted, "bg-destructive", `${m.deleted} deleted · ${m.total} total · ${m.futureDeleted} future deleted`],
              [CalendarOff, "Cancelled", m.cancelled, "bg-amber-500", `${m.cancelled} cancelled · ${m.total} total`],
              [CalendarClock, "Rebooked meetings", m.rebooked, "bg-primary", `${m.rebooked} rebooked · ${m.total} total`],
            ].map(([Icon, label, n, tone, note]) => {
              const I = Icon as typeof CalendarX2;
              return <div key={String(label)} className="p-5"><p className="flex items-center gap-2 text-sm font-medium"><I className="h-4 w-4 text-muted-foreground" />{String(label)}</p><p className="mt-3 text-3xl font-bold">{pct(n as number)}%</p><Bar pct={pct(n as number)} tone={String(tone)} /><p className="mt-2 text-xs text-muted-foreground">{String(note)}</p></div>;
            })}
          </div>
        </Card>
      </section>
    </div>
  );
};
