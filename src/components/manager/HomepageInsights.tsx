import { useState } from "react";
import { BookOpen, Building2, CalendarCheck, ChevronRight, GraduationCap, Globe, Info, MessageSquare, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fmt, homepageQuality, homepageSignalCount, homepageSignals, regionalThemeCoverage, regionalThemes, teamMembers } from "@/data/managerDemo";

const signalIcons = { building: Building2, calendar: CalendarCheck, globe: Globe, shield: ShieldCheck, education: GraduationCap };

export const HomepageSignals = () => {
  const [employee, setEmployee] = useState("all");
  const [selected, setSelected] = useState<typeof homepageSignals[number] | null>(null);
  return <section className="space-y-5" aria-labelledby="homepage-signals-title">
    <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-3"><ShieldCheck className="h-6 w-6 text-primary" /></div><div><h2 id="homepage-signals-title" className="text-2xl font-bold">Signaler</h2><p className="text-sm text-muted-foreground">Kunder, kontakt og deltagelse · faste tidsperioder</p></div></div>
      <Select value={employee} onValueChange={setEmployee}><SelectTrigger className="w-52 bg-card" aria-label="Signaler: filtrer efter bruger"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Alle medarbejdere</SelectItem>{teamMembers.map(m => <SelectItem key={m.slug} value={m.slug}>{m.name}</SelectItem>)}</SelectContent></Select>
    </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{homepageSignals.map(signal => {
      const Icon = signalIcons[signal.icon as keyof typeof signalIcons];
      return <Button key={signal.id} variant="ghost" onClick={() => setSelected(signal)} className="h-auto min-h-40 flex-col items-stretch justify-start gap-3 whitespace-normal rounded-lg border border-border/40 bg-card p-5 text-left shadow-sm hover:bg-primary/5">
        <div className="flex items-center justify-between"><Icon className="h-5 w-5 text-primary" /><Info className="h-4 w-4 text-muted-foreground" /></div>
        <div className="flex items-baseline gap-2"><strong className="text-3xl">{homepageSignalCount(signal, employee)}</strong><span className="text-xs font-normal text-muted-foreground">{signal.unit}</span></div>
        <div><p className="text-sm font-semibold leading-5">{signal.label}</p><p className="mt-1 text-xs font-normal text-muted-foreground">{signal.horizon}</p></div>
      </Button>;
    })}</div>
    <p className="text-xs text-muted-foreground">Samme kunde kan indgå i flere signaler. Tallene skal derfor ikke lægges sammen.</p>
    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent>{selected && <><DialogHeader><DialogTitle className="leading-6">{selected.label}</DialogTitle><DialogDescription>{selected.horizon}</DialogDescription></DialogHeader><p className="text-3xl font-bold">{homepageSignalCount(selected, employee)} <span className="text-base font-normal text-muted-foreground">{selected.unit}</span></p><p className="text-sm leading-6">{selected.explanation}</p><p className="text-xs text-muted-foreground">{employee === "all" ? "Hele teamet · kunder tælles én gang pr. signal" : teamMembers.find(m => m.slug === employee)?.name} · Fiktive demo-data · {selected.id}</p></>}</DialogContent></Dialog>
  </section>;
};

export const HomepageThemes = () => {
  const [selected, setSelected] = useState<typeof regionalThemes[number] | null>(null);
  return <section className="space-y-5" aria-labelledby="regional-themes-title">
    <div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-3"><MessageSquare className="h-6 w-6 text-primary" /></div><div><h2 id="regional-themes-title" className="text-2xl font-bold">Hvad regionen hører</h2><p className="text-sm text-muted-foreground">Fra {regionalThemeCoverage.analyzed} af {regionalThemeCoverage.completed} gennemførte debriefs · seneste 30 dage</p></div></div>
    <div className="grid gap-3 md:grid-cols-2">{regionalThemes.map(theme => <Button variant="ghost" key={theme.id} onClick={() => setSelected(theme)} className="h-auto min-h-36 items-start justify-between gap-4 whitespace-normal rounded-lg border border-border/40 bg-card p-5 text-left shadow-sm hover:bg-primary/5"><div className="min-w-0"><h3 className="font-semibold">{theme.label}</h3><p className="mt-1 text-sm font-normal leading-5 text-muted-foreground">{theme.description}</p><p className="mt-3 text-xs font-normal"><strong>{theme.count} af {regionalThemeCoverage.analyzed}</strong> debriefs <span className="text-muted-foreground">· før: {theme.previous} af {regionalThemeCoverage.previousAnalyzed}</span></p></div><ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" /></Button>)}</div>
    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent>{selected && <><DialogHeader><DialogTitle className="leading-6">{selected.label}</DialogTitle><DialogDescription>{selected.count} af {regionalThemeCoverage.analyzed} analyserede debriefs · forrige 30 dage: {selected.previous} af {regionalThemeCoverage.previousAnalyzed}</DialogDescription></DialogHeader><p className="text-sm leading-6">{selected.description}</p><h3 className="text-sm font-semibold">Eksempler fra debriefs</h3><ul className="space-y-3">{selected.examples.map(example => <li key={example} className="border-l-2 border-primary/30 pl-3 text-sm leading-6 text-muted-foreground">“{example}”</li>)}</ul><p className="text-xs text-muted-foreground">Fiktive eksempler · {selected.id}. Samme debrief kan indeholde flere temaer.</p></>}</DialogContent></Dialog>
  </section>;
};

export const HomepageDebriefQuality = () => {
  const [week, setWeek] = useState("40");
  const review = homepageQuality.reviews.find(r => String(r.week) === week) ?? homepageQuality.reviews[1];
  const first = homepageQuality.weeks[0];
  const last = homepageQuality.weeks[homepageQuality.weeks.length - 1];
  if (!review || !first || !last) return null;
  const difference = last.score - first.score;
  return <section className="space-y-5" aria-labelledby="homepage-quality-title">
    <div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-3"><BookOpen className="h-6 w-6 text-primary" /></div><div><h2 id="homepage-quality-title" className="text-2xl font-bold">Debriefkvalitet</h2><p className="text-sm text-muted-foreground">Dokumentationens kvalitet · {homepageQuality.assessed} vurderede debriefs</p></div></div>
    <Card className="grid overflow-hidden border-0 shadow-sm lg:grid-cols-2"><div className="p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-medium">Seneste ugentlige score</p><p className="mt-1 text-3xl font-bold text-primary">{fmt(last.score)}<span className="text-base text-muted-foreground"> / 10</span></p></div><div className="flex items-center gap-2 text-sm text-success"><TrendingUp className="h-4 w-4" /><span>+{fmt(difference)} over 4 uger</span></div></div><div className="mt-5 grid grid-cols-4 gap-3">{homepageQuality.weeks.map(point => <div key={point.week} className="space-y-2"><div className="flex h-14 items-end rounded-sm bg-muted/30"><div className="w-full rounded-sm bg-primary/70" style={{ height: `${point.score * 10}%` }} /></div><div className="flex flex-wrap justify-between gap-1 text-xs"><span className="text-muted-foreground">Uge {point.week}</span><strong>{fmt(point.score)}</strong></div></div>)}</div><p className="mt-3 text-xs text-muted-foreground">2026 · skala 0–10 · intet tilgængeligt landsgennemsnit</p></div>
      <div className="border-t border-border/50 p-5 sm:p-6 lg:border-l lg:border-t-0"><div className="mb-4 flex items-center justify-between gap-3"><h3 className="text-sm font-semibold">Ugens vurdering</h3><Select value={week} onValueChange={setWeek}><SelectTrigger aria-label="Vælg kvalitetsuge" className="h-8 w-32"><SelectValue /></SelectTrigger><SelectContent>{homepageQuality.reviews.map(r => <SelectItem key={r.week} value={String(r.week)}>Uge {r.week}</SelectItem>)}</SelectContent></Select></div><div className="space-y-3 text-sm leading-5"><div><p className="font-medium">Det fungerer godt</p><p className="mt-1 text-muted-foreground">{review.highlight}</p></div><div><p className="font-medium">Kan forbedres</p><p className="mt-1 text-muted-foreground">{review.improvement}</p></div></div></div>
    </Card>
  </section>;
};