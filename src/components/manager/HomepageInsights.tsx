import { useState } from "react";
import { BookOpen, Building2, CalendarCheck, ChevronDown, GraduationCap, Globe, Info, MessageSquare, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fmt, homepageQuality, homepageSignalCount, homepageSignals, regionalThemeCoverage, regionalThemes, regionalThemeSources, teamMembers } from "@/data/managerDemo";

const signalIcons = { building: Building2, calendar: CalendarCheck, globe: Globe, shield: ShieldCheck, education: GraduationCap };

export const HomepageSignals = () => {
  const [employee, setEmployee] = useState("all");
  const [selected, setSelected] = useState<typeof homepageSignals[number] | null>(null);
  return <section className="space-y-3" aria-labelledby="homepage-signals-title">
    <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><ShieldCheck className="h-5 w-5 text-primary" /></div><div><h2 id="homepage-signals-title" className="text-2xl font-bold">Signaler</h2><p className="text-sm text-muted-foreground">Kunder, kontakt og deltagelse · faste tidsperioder</p></div></div>
      <Select value={employee} onValueChange={setEmployee}><SelectTrigger className="h-8 w-52 bg-card" aria-label="Signaler: filtrer efter bruger"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Alle medarbejdere</SelectItem>{teamMembers.map(m => <SelectItem key={m.slug} value={m.slug}>User · {m.district}</SelectItem>)}</SelectContent></Select>
    </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{homepageSignals.map(signal => {
      const Icon = signalIcons[signal.icon as keyof typeof signalIcons];
      return <Button key={signal.id} variant="ghost" onClick={() => setSelected(signal)} className="h-auto min-h-32 flex-col items-stretch justify-start gap-3 whitespace-normal rounded-lg border border-border/40 bg-card p-4 text-left shadow-none hover:bg-primary/5">
        <div className="flex items-center justify-between"><Icon className="h-5 w-5 text-primary" /><Info className="h-4 w-4 text-muted-foreground" /></div>
        <div className="flex items-baseline gap-2"><strong className="text-2xl">{homepageSignalCount(signal, employee)}</strong><span className="text-xs font-normal text-muted-foreground">{signal.unit}</span></div>
        <div><p className="text-sm font-semibold leading-5">{signal.label}</p><p className="mt-1 text-xs font-normal text-muted-foreground">{signal.horizon}</p></div>
      </Button>;
    })}</div>
    <p className="text-xs text-muted-foreground">Samme kunde kan indgå i flere signaler. Tallene skal derfor ikke lægges sammen.</p>
    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent>{selected && <><DialogHeader><DialogTitle className="leading-6">{selected.label}</DialogTitle><DialogDescription>{selected.horizon}</DialogDescription></DialogHeader><p className="text-2xl font-bold">{homepageSignalCount(selected, employee)} <span className="text-base font-normal text-muted-foreground">{selected.unit}</span></p><p className="text-sm leading-6">{selected.explanation}</p><p className="text-xs text-muted-foreground">{employee === "all" ? "Hele teamet · kunder tælles én gang pr. signal" : `User · ${teamMembers.find(m => m.slug === employee)?.district}`} · Fiktive demo-data · {selected.id}</p></>}</DialogContent></Dialog>
  </section>;
};

export const HomepageThemes = () => {
  const [expanded, setExpanded] = useState<string[]>([]);
  const [source, setSource] = useState<typeof regionalThemeSources[number] | null>(null);
  const formatDate = (date: string) => new Intl.DateTimeFormat("da-DK", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
  return <section className="space-y-3" aria-labelledby="regional-themes-title">
    <div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><MessageSquare className="h-5 w-5 text-primary" /></div><div><h2 id="regional-themes-title" className="text-2xl font-bold">Hvad regionen hører</h2><p className="text-sm text-muted-foreground">Fra {regionalThemeCoverage.analyzed} af {regionalThemeCoverage.completed} gennemførte debriefs · seneste 30 dage</p></div></div>
    <div className="grid items-start gap-3 md:grid-cols-2">{regionalThemes.map(theme => {
      const open = expanded.includes(theme.id);
      const sources = regionalThemeSources.filter(s => s.themeId === theme.id).sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
      return <Card key={theme.id} className="overflow-hidden rounded-lg border border-border shadow-none"><Button variant="ghost" aria-expanded={open} aria-controls={`${theme.id}-sources`} onClick={() => setExpanded(ids => open ? ids.filter(id => id !== theme.id) : [...ids, theme.id])} className="h-auto min-h-28 w-full items-start justify-between gap-4 whitespace-normal rounded-none p-4 text-left hover:bg-primary/5"><div className="min-w-0"><h3 className="font-semibold">{theme.label}</h3><p className="mt-1 text-sm font-normal leading-5 text-muted-foreground">{theme.description}</p><p className="mt-3 text-xs font-normal"><strong>{theme.count} af {regionalThemeCoverage.analyzed}</strong> debriefs <span className="text-muted-foreground">· før: {theme.previous} af {regionalThemeCoverage.previousAnalyzed}</span></p><p className="mt-3 text-xs text-primary">{open ? "Skjul udsagn" : "Se udsagn og kilder"}</p></div><ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} /></Button>
        {open && <div id={`${theme.id}-sources`} className="border-t border-border/50 px-5 pb-5"><p className="py-4 text-xs text-muted-foreground">{sources.length} udvalgte kildeeksempler af {theme.count} debriefs · nyeste først · fiktive demo-data</p><ol className="divide-y divide-border/50">{sources.map(item => <li key={item.id} className="py-4 first:pt-0 last:pb-0"><div className="flex flex-wrap items-baseline justify-between gap-2"><p className="text-sm font-semibold">{item.speaker} <span className="font-normal text-muted-foreground">· {item.organization}</span></p><time dateTime={`${item.date}T${item.time}:00+02:00`} className="text-xs text-muted-foreground">{formatDate(item.date)} kl. {item.time}</time></div><blockquote className="mt-3 border-l-2 border-primary/30 pl-3 text-sm leading-6">“{item.quote}”</blockquote><div className="mt-3 flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-muted-foreground">Noteret af {"User"}</p><Button variant="link" size="sm" className="h-auto whitespace-normal p-0 text-xs" onClick={() => setSource(item)}><BookOpen className="h-3.5 w-3.5" />Se debrief · {item.id}</Button></div></li>)}</ol></div>}
      </Card>;
    })}</div>
    <Dialog open={source !== null} onOpenChange={open => { if (!open) setSource(null); }}><DialogContent className="max-h-[85vh] overflow-y-auto">{source && <><DialogHeader><DialogTitle className="leading-6">Debrief · {source.id}</DialogTitle><DialogDescription>{source.speaker} · {source.organization}<br />{formatDate(source.date)} kl. {source.time} · noteret af {"User"}</DialogDescription></DialogHeader><div><h3 className="text-sm font-semibold">Registreret udsagn</h3><blockquote className="mt-2 border-l-2 border-primary/30 pl-3 text-sm leading-6">“{source.quote}”</blockquote></div><div><h3 className="text-sm font-semibold">Mødenote og næste skridt</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{source.note}</p></div><p className="text-xs text-muted-foreground">Fiktiv demo-debrief · udsagnet er gengivet fra mødenoten, ikke fra en lydoptagelse.</p></>}</DialogContent></Dialog>
  </section>;
};

export const HomepageDebriefQuality = () => {
  const [week, setWeek] = useState("40");
  const review = homepageQuality.reviews.find(r => String(r.week) === week) ?? homepageQuality.reviews[1];
  const first = homepageQuality.weeks[0];
  const last = homepageQuality.weeks[homepageQuality.weeks.length - 1];
  if (!review || !first || !last) return null;
  const difference = last.score - first.score;
  return <section className="space-y-3" aria-labelledby="homepage-quality-title">
    <div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><BookOpen className="h-5 w-5 text-primary" /></div><div><h2 id="homepage-quality-title" className="text-2xl font-bold">Debriefkvalitet</h2><p className="text-sm text-muted-foreground">Dokumentationens kvalitet · {homepageQuality.assessed} vurderede debriefs</p></div></div>
    <div className="manager-band grid overflow-hidden lg:grid-cols-[0.9fr_1.1fr]"><div className="p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-medium">Seneste ugentlige score</p><p className="mt-1 text-2xl font-bold text-primary">{fmt(last.score)}<span className="text-base text-muted-foreground"> / 10</span></p></div><div className="flex items-center gap-2 text-sm text-success"><TrendingUp className="h-4 w-4" /><span>+{fmt(difference)} over 4 uger</span></div></div><div className="mt-5 grid grid-cols-4 gap-3">{homepageQuality.weeks.map(point => <div key={point.week} className="space-y-2"><div className="flex h-14 items-end rounded-sm bg-muted/30"><div className="w-full rounded-sm bg-primary/70" style={{ height: `${point.score * 10}%` }} /></div><div className="flex flex-wrap justify-between gap-1 text-xs"><span className="text-muted-foreground">Uge {point.week}</span><strong>{fmt(point.score)}</strong></div></div>)}</div><p className="mt-3 text-xs text-muted-foreground">2026 · skala 0–10 · intet tilgængeligt landsgennemsnit</p></div>
      <div className="border-t border-border/50 p-4 lg:border-l lg:border-t-0"><div className="mb-4 flex items-center justify-between gap-3"><h3 className="text-sm font-semibold">Ugens vurdering</h3><Select value={week} onValueChange={setWeek}><SelectTrigger aria-label="Vælg kvalitetsuge" className="h-8 w-32"><SelectValue /></SelectTrigger><SelectContent>{homepageQuality.reviews.map(r => <SelectItem key={r.week} value={String(r.week)}>Uge {r.week}</SelectItem>)}</SelectContent></Select></div><div className="space-y-3 text-sm leading-5"><div><p className="font-medium">Det fungerer godt</p><p className="mt-1 text-muted-foreground">{review.highlight}</p></div><div><p className="font-medium">Kan forbedres</p><p className="mt-1 text-muted-foreground">{review.improvement}</p></div></div></div>
    </div>
  </section>;
};