import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";
import { BookOpen, CalendarCheck, CalendarClock, CalendarOff, ChevronDown, ClipboardCheck, GraduationCap, Info, Mail, MessageSquare, MonitorPlay, Radar, ShieldX, Target, TrendingUp, UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fmt, homepageQuality, homepageSignalCount, homepageSignals, regionalThemeCoverage, regionalThemes, regionalThemeSources, teamMembers } from "@/data/managerDemo";

import { ManagerSection } from "./ManagerSection";
import { SourceQuality } from "./SourceQuality";

const signalIcons = {
  "HOME-S01": CalendarOff,
  "HOME-S02": CalendarCheck,
  "HOME-S03": CalendarClock,
  "HOME-S04": Mail,
  "HOME-S05": ShieldX,
  "HOME-S06": UserX,
  "HOME-S07": GraduationCap,
  "HOME-S08": UserCheck,
  "HOME-S09": MonitorPlay,
  "HOME-S10": Target,
};

export const HomepageSignals = () => {
  const [employee, setEmployee] = useState("all");
  const [selected, setSelected] = useState<typeof homepageSignals[number] | null>(null);
  return <ManagerSection id="homepage-signals" title="Signaler" header={
    <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><Radar className="h-5 w-5 text-primary" /><div><h2 id="homepage-signals-title" className="text-2xl font-bold">Signaler</h2><p className="text-sm text-muted-foreground">Kunder, kontakt og deltagelse · faste tidsperioder</p></div></div>
      <Select value={employee} onValueChange={setEmployee}><SelectTrigger className="h-8 w-52 bg-card" aria-label="Signaler: filtrer efter bruger"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Alle medarbejdere</SelectItem>{teamMembers.map(m => <SelectItem key={m.slug} value={m.slug}>User · {m.district}</SelectItem>)}</SelectContent></Select>
    </div>}>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">{homepageSignals.map(signal => {
      const Icon = signalIcons[signal.id as keyof typeof signalIcons];
      return <Button key={signal.id} variant="ghost" onClick={() => setSelected(signal)} className="h-auto min-h-20 items-center justify-start gap-3 whitespace-normal rounded-lg border bg-card px-3 py-3 text-left shadow-none hover:bg-primary/5">
        <Icon className="h-4 w-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1"><p className="text-xs font-semibold leading-5">{signal.label}</p><p className="text-xs font-normal text-muted-foreground">{signal.horizon}</p></div>
        <div className="shrink-0 text-right"><strong className="text-xl tabular-nums">{homepageSignalCount(signal, employee)}</strong><p className="text-xs font-normal text-muted-foreground">{signal.unit}</p></div>
        <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </Button>;
    })}</div>
    <p className="text-xs text-muted-foreground">Samme kunde kan indgå i flere signaler. Tallene skal derfor ikke lægges sammen.</p>
    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent>{selected && <><DialogHeader><DialogTitle className="leading-6">{selected.label}</DialogTitle><DialogDescription>{selected.horizon}</DialogDescription></DialogHeader><p className="text-2xl font-bold">{homepageSignalCount(selected, employee)} <span className="text-base font-normal text-muted-foreground">{selected.unit}</span></p><p className="text-sm leading-6">{selected.explanation}</p><p className="text-xs text-muted-foreground">{employee === "all" ? "Hele teamet · kunder tælles én gang pr. signal" : `User · ${teamMembers.find(m => m.slug === employee)?.district}`} · Fiktive demo-data · {selected.id}</p></>}</DialogContent></Dialog>
  </ManagerSection>;
};

export const HomepageThemes = () => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [source, setSource] = useState<typeof regionalThemeSources[number] | null>(null);
  const formatDate = (date: string) => new Intl.DateTimeFormat("da-DK", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
  return <ManagerSection id="regional-themes" title="Hvad regionen hører" header={
    <div className="flex items-center gap-3"><MessageSquare className="h-5 w-5 text-primary" /><div><h2 id="regional-themes-title" className="text-2xl font-bold">Hvad regionen hører</h2><p className="text-sm text-muted-foreground">Fra {regionalThemeCoverage.analyzed} af {regionalThemeCoverage.completed} gennemførte debriefs · seneste 30 dage</p></div></div>}>
    <div className="grid items-start gap-3 md:grid-cols-2">{regionalThemes.map(theme => {
      const open = expanded.includes(theme.id);
      const sources = regionalThemeSources.filter(s => s.themeId === theme.id).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
      return <Card key={theme.id} className="overflow-hidden rounded-lg border border-border shadow-none"><Button variant="ghost" aria-expanded={open} aria-controls={`${theme.id}-sources`} onClick={() => setExpanded(ids => open ? ids.filter(id => id !== theme.id) : [...ids, theme.id])} className="h-auto min-h-28 w-full items-start justify-between gap-4 whitespace-normal rounded-none p-4 text-left hover:bg-primary/5"><div className="min-w-0"><h3 className="font-semibold">{theme.label}</h3><p className="mt-1 text-sm font-normal leading-5 text-muted-foreground">{theme.description}</p><p className="mt-3 text-xs font-normal"><strong>{theme.count} af {regionalThemeCoverage.analyzed}</strong> debriefs <span className="text-muted-foreground">· før: {theme.previous} af {regionalThemeCoverage.previousAnalyzed}</span></p><p className="mt-3 text-xs text-primary">{open ? "Skjul udsagn" : "Se udsagn og kilder"}</p></div><ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} /></Button>
        {open && <div id={`${theme.id}-sources`} className="border-t border-border/50 px-5 pb-5"><p className="py-4 text-xs text-muted-foreground">{sources.length} udvalgte kildeeksempler af {theme.count} debriefs · nyeste først · fiktive demo-data</p><ol className="divide-y divide-border/50">{sources.map(item => <li key={item.id} className="py-4 first:pt-0 last:pb-0"><div className="flex flex-wrap items-baseline justify-between gap-2"><p className="text-sm font-semibold">{item.speaker} <span className="font-normal text-muted-foreground">· {item.organization}</span></p><time dateTime={`${item.date}T${item.time}:00+02:00`} className="text-xs text-muted-foreground">{formatDate(item.date)} kl. {item.time}</time></div><blockquote className="mt-3 border-l-2 border-primary/30 pl-3 text-sm leading-6">“{item.quote}”</blockquote><div className="mt-3 flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-muted-foreground">Noteret af {"User"}</p><Button variant="link" size="sm" className="h-auto whitespace-normal p-0 text-xs" onClick={() => setSource(item)}><BookOpen className="h-3.5 w-3.5" />Se debrief · {item.id}</Button></div></li>)}</ol></div>}
      </Card>;
    })}</div>
    <Dialog open={source !== null} onOpenChange={open => { if (!open) setSource(null); }}><DialogContent className="max-h-[85vh] overflow-y-auto">{source && <><DialogHeader><DialogTitle className="leading-6">Debrief · {source.id}</DialogTitle><DialogDescription>{source.speaker} · {source.organization}<br />{formatDate(source.date)} kl. {source.time} · noteret af {"User"}</DialogDescription></DialogHeader><div><h3 className="text-sm font-semibold">Registreret udsagn</h3><blockquote className="mt-2 border-l-2 border-primary/30 pl-3 text-sm leading-6">“{source.quote}”</blockquote></div><div><h3 className="text-sm font-semibold">Mødenote og næste skridt</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{source.note}</p></div><p className="text-xs text-muted-foreground">Fiktiv demo-debrief · udsagnet er gengivet fra mødenoten, ikke fra en lydoptagelse.</p></>}</DialogContent></Dialog>
  </ManagerSection>;
};

export const HomepageDebriefQuality = () => {
  const [week, setWeek] = useState("40");
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const review = homepageQuality.reviews.find(r => String(r.week) === week) ?? homepageQuality.reviews[1];
  const first = homepageQuality.weeks[0];
  const last = homepageQuality.weeks[homepageQuality.weeks.length - 1];
  if (!review || !first || !last) return null;
  const difference = last.score - first.score;
  const scores = homepageQuality.weeks.map(point => point.score);
  const chartDomain = [Math.min(...scores) - 0.5, Math.max(...scores) + 0.5] as [number, number];
  return <ManagerSection id="homepage-quality" title="Debriefkvalitet" header={
    <div className="flex items-center gap-3"><ClipboardCheck className="h-5 w-5 text-primary" /><div><h2 id="homepage-quality-title" className="text-2xl font-bold">Debriefkvalitet</h2><p className="text-sm text-muted-foreground">Dokumentationens kvalitet · {homepageQuality.assessed} vurderede debriefs</p></div></div>}>
    <div className="manager-band">
      <div className="grid md:grid-cols-2">
        <div className="p-4 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-semibold text-muted-foreground">Seneste ugentlige score</p><p className="mt-1 text-xl font-bold text-primary">{fmt(last.score)}<span className="text-xs font-normal text-muted-foreground"> / 10</span></p></div><span className="flex items-center gap-1 text-xs text-success"><TrendingUp className="h-3.5 w-3.5" />+{fmt(difference)} over 4 uger</span></div>
          <div className="mt-4" role="img" aria-label={`Ugentlig debriefkvalitet: ${homepageQuality.weeks.map(point => `uge ${point.week}: ${fmt(point.score)} af 10`).join(", ")}`}>
            <div className="h-16 px-6 text-primary" aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={homepageQuality.weeks} margin={{ top: 6, right: 4, bottom: 6, left: 4 }}>
                  <YAxis hide domain={chartDomain} />
                  <Line type="monotone" dataKey="score" stroke="currentColor" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--card))", stroke: "currentColor", strokeWidth: 2 }} activeDot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-4 gap-3 border-t border-border/60 pt-2">{homepageQuality.weeks.map(point => <div key={point.week} className="text-center text-xs"><span className="text-muted-foreground">Uge {point.week}</span><strong className="mt-1 block tabular-nums">{fmt(point.score)}</strong></div>)}</div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{homepageQuality.assessed} vurderede debriefs · 2026 · skala 0–10 · landsgennemsnit ikke tilgængeligt</p>
        </div>
        <div className="flex flex-col border-t p-4 sm:p-5 md:border-l md:border-t-0"><SourceQuality scope="homepage" compact /></div>
      </div>
      <div className="grid gap-3 border-t bg-muted/20 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-start sm:p-5"><div><p className="mb-2 text-xs font-semibold">Ugens vurdering</p><Select value={week} onValueChange={setWeek}><SelectTrigger aria-label="Vælg kvalitetsuge" className="h-8 w-28 bg-card"><SelectValue /></SelectTrigger><SelectContent>{homepageQuality.reviews.map(r => <SelectItem key={r.week} value={String(r.week)}>Uge {r.week}</SelectItem>)}</SelectContent></Select></div><p className="text-sm leading-6 text-muted-foreground">{review.highlight} {review.improvement}</p><Button variant="link" size="sm" className="h-8 justify-start px-0 text-xs" onClick={() => setAssessmentOpen(true)}>Læs hele vurderingen</Button></div>
    </div>
    <Dialog open={assessmentOpen} onOpenChange={setAssessmentOpen}><DialogContent><DialogHeader><DialogTitle>Ugens vurdering · uge {review.week}</DialogTitle><DialogDescription>Fiktiv vurdering af dokumentationen · {fmt(review.score)} / 10</DialogDescription></DialogHeader><p className="text-sm leading-6">{review.highlight} {review.improvement}</p><p className="text-xs leading-5 text-muted-foreground">Vurderingen vedrører de vurderede noter, ikke medarbejdernes samtaler. Ugevurderingen og referenceeksemplets kildegrupper har forskellige datagrundlag.</p></DialogContent></Dialog>
  </ManagerSection>;
};