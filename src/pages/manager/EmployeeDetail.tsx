import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, CalendarCheck, CalendarX, Clipboard, Gauge, GraduationCap, MessageSquare, Radar, Printer, RefreshCw, Sparkles, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ManagerPeriodControl } from "@/components/manager/ManagerPeriodControl";
import { ManagerCard, managerCardFooter, managerCardNote, managerCardTitle } from "@/components/manager/ManagerCard";
import { EmployeeQuality } from "@/components/manager/EmployeeQuality";
import { EmployeeFieldThemes } from "@/components/manager/EmployeeFieldThemes";
import { EmployeeBrickCoverage } from "@/components/manager/EmployeeBrickCoverage";
import { EmployeeCalendarChanges } from "@/components/manager/EmployeeCalendarChanges";
import { EmployeeActivityPanels } from "@/components/manager/EmployeeActivityPanels";
import { ErrorBlock } from "@/components/manager/StateBlocks";
import { NavigationMenu } from "@/components/NavigationMenu";
import { HcpSearch } from "@/components/HcpSearch";
import { AskJarvisManager } from "@/components/manager/AskJarvis";
import { useBackNavigation } from "@/hooks/use-back-navigation";
import { useManagerPeriod } from "@/hooks/use-manager-period";
import { toast } from "@/hooks/use-toast";
import { fmt, oneToOnePoints, pct, signals, syncLine, teamMembers, themes, type MeetingState } from "@/data/managerDemo";
import { ManagerSection, ManagerSections } from "@/components/manager/ManagerSection";
import jarvisLogo from "@/assets/jarvis-logo.svg";

type PanelKey = "contacts" | "coverage" | "documentation" | "drafts" | "quality" | "signals" | "themes" | "one-to-one" | null;
type Signal = (typeof signals)[number];
type Theme = (typeof themes)[number];

const MeetingPill = ({ m }: { m: MeetingState }) => {
  if (m.kind === "own") return <span className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-1 text-xs font-medium text-primary"><CalendarCheck className="h-3.5 w-3.5" />Eget møde {m.date}</span>;
  if (m.kind === "colleague") return <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"><UserRound className="h-3.5 w-3.5" />{m.who} har møde {m.date}</span>;
  if (m.kind === "outside") return <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-foreground">{m.date} <span className="text-muted-foreground">· uden for 28 dage</span></span>;
  if (m.kind === "unavailable") return <span className="inline-flex items-center gap-1 rounded-md border border-destructive/40 bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive"><AlertTriangle className="h-3.5 w-3.5" />Mødedata utilgængelig</span>;
  return <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-muted-foreground/40 px-2 py-1 text-xs text-muted-foreground"><CalendarX className="h-3.5 w-3.5" />Intet kommende registreret</span>;
};

const EmployeeDetail = () => <ManagerSections ids={["performance", "signals", "themes", "contact-plan", "employee-coverage", "calendar", "training"]} defaultClosed={["calendar", "training"]}><EmployeeDetailContent /></ManagerSections>;

const EmployeeDetailContent = () => {
  const back = useBackNavigation("/manager");
  const { slug } = useParams();
  const { period, setPeriod, option, hasFixture } = useManagerPeriod();
  const [panel, setPanel] = useState<PanelKey>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const m = useMemo(() => teamMembers.find((item) => item.slug === slug) ?? teamMembers[0], [slug]);
  const full = m.slug === "christian";

  const noActivity = m.state === "no-activity";
  const loadError = false;
  const qualityError = m.state === "quality-error";
  const imported = m.state === "imported";
  const noPlan = m.plan === null;
  const retry = () => { toast({ title: "Henter igen", description: "Demo: data er hentet." }); };

  useEffect(() => {
    const h = window.location.hash.slice(1);
    if (h === "signals" || h === "themes") setTimeout(() => document.getElementById(h)?.scrollIntoView(), 50);
    if (h === "documentation") setPanel("documentation");
  }, []);

  const contacts = noActivity ? 0 : m.contacts;
  const hcos = noActivity ? 0 : m.hcosContacted;
  const documented = noActivity ? 0 : m.documented;

  const copyPrep = async () => {
    const text = [`Forberedelse til 1:1 — User — ${option.range}`, ...oneToOnePoints.flatMap((p) => [`${p.title}: ${p.observation}`, `Spørgsmål: ${p.question}`, `Kilder: ${p.sources}`])].join("\n\n");
    await navigator.clipboard.writeText(text);
    toast({ title: "Kopieret", description: "De tre samtalepunkter og kilder er kopieret." });
  };

  const titles: Record<string, string> = { contacts: "Registrerede kontakter", coverage: "Kontaktede HCO'er", documentation: "Dokumentationsdækning", drafts: "Kladder og manglende dokumentation", quality: "Debriefkvalitet", signals: "Vigtigste kunde signaler", themes: "Temakilder", "one-to-one": "Forbered 1:1" };

  const qualityValue = qualityError ? null : imported || noActivity || m.quality === null ? "Ingen vurderede debriefs" : `${fmt(m.quality)} / 10`;
  const kpis = [
    { label: "Registrerede kontakter", value: String(contacts), note: noActivity ? "Vellykket opslag · ingen registrerede kontakter" : `Fysiske + virtuelle · ${m.phone} telefonkontakter særskilt`, key: "contacts", error: loadError },
    { label: "Kontaktede HCO'er", value: `${hcos} / ${m.hcosAssigned}`, note: `${pct(hcos, m.hcosAssigned)} af tildelte HCO'er`, key: "coverage", error: loadError },
    { label: "Debriefs", value: contacts ? `${documented} / ${contacts}` : "Ingen relevante kontakter", note: !contacts ? "Ingen forventede debriefs" : imported ? `${pct(documented, contacts)} · alle importeret fra CRM` : `${pct(documented, contacts)} · ${m.drafts} kladder · ${m.missing} mangler`, key: "documentation", error: loadError },
    { label: "Debriefkvalitet", value: qualityValue, note: imported ? "Importeret dokumentation vurderes ikke" : noActivity || m.quality === null ? "Ingen vurderede debriefs" : `Periodegennemsnit · n = ${m.qualityN} af ${m.completed}`, key: "quality", error: qualityError },
  ];

  return <div className="manager-view min-h-screen bg-background">
    <header className="sticky top-0 z-10 border-b bg-card/90 shadow-sm backdrop-blur-sm"><div className="container mx-auto px-4 py-4 sm:px-6"><div className="flex flex-wrap items-center gap-3"><Button variant="ghost" size="icon" onClick={back} aria-label="Tilbage til teamoverblik"><ArrowLeft className="h-5 w-5" /></Button><img src={jarvisLogo} alt="Jarvis-logo" className="h-10 w-10" /><div className="min-w-48 flex-1"><div className="flex items-center gap-2"><h1 className="text-lg font-bold">Medarbejderoversigt</h1><Badge variant="secondary">Demo</Badge></div><p className="text-sm text-muted-foreground">Forberedelse til 1:1</p></div><ManagerPeriodControl value={period} onChange={setPeriod} /><div className="hidden w-56 lg:block"><HcpSearch /></div><AskJarvisManager /><NavigationMenu /></div><div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><RefreshCw className="h-3.5 w-3.5" />{syncLine.split(" · Brief")[0]}</div></div></header>

    <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
      
      <section className="flex items-end justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-2xl font-bold">User</h2><Badge variant="outline">Demo-identitet</Badge></div><p className="mt-1 text-muted-foreground">{m.role} · {m.district}</p></div><Button onClick={() => setPanel("one-to-one")} className="shrink-0"><Sparkles className="mr-2 h-4 w-4" />Forbered 1:1</Button></section>

      {!hasFixture ? <Card className="rounded-lg border shadow-sm"><CardContent className="p-10 text-center"><h3 className="font-semibold">Ingen forberedte demo-data for denne periode</h3><p className="mt-2 text-sm text-muted-foreground">Vælg 30 dage for at se sporbare medarbejderdata.</p></CardContent></Card> : <>

        <ManagerSection id="performance" title="Generel præstation" header={<div className="flex items-baseline justify-between gap-3"><div className="flex items-center gap-3"><Gauge className="h-5 w-5 text-primary" /><h3 className="text-lg font-bold">Generel præstation</h3></div><span className="text-xs text-muted-foreground">{option.range}</span></div>}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{kpis.map(k => <div key={k.key} className={`rounded-lg border bg-card p-4 ${k.error ? "border-destructive/50" : ""}`}><Button variant="ghost" className="h-auto w-full justify-start whitespace-normal p-0 text-left hover:bg-transparent" onClick={() => setPanel(k.key as PanelKey)}><div className="w-full"><p className="text-xs font-semibold text-muted-foreground">{k.label}</p><p className="mt-2 text-xl font-bold tabular-nums">{k.error ? "Utilgængelig" : k.value}</p><p className="mt-2 text-xs font-normal leading-5 text-muted-foreground">{k.note}</p></div></Button>{k.error && <Button size="sm" variant="outline" className="mt-2" onClick={retry}>Prøv igen</Button>}</div>)}</div>
        </ManagerSection>
        <ManagerSection id="signals" title="Vigtigste kunde signaler" header={<div><div className="flex items-center gap-3"><Radar className="h-5 w-5 shrink-0 text-primary" /><h3 className="text-lg font-bold">Vigtigste kunde signaler</h3></div><p className="mt-1 text-xs text-muted-foreground">Aktuelle kundesignaler · hver regel har sin egen tidshorisont</p></div>}>
          {loadError ? <ErrorBlock label="Kundesignaler" onRetry={retry} /> : !full ? <Card className="border border-dashed bg-muted/20 shadow-none"><CardContent className="p-6 text-sm text-muted-foreground">Ingen aktuelle kundesignaler for medarbejderen.</CardContent></Card> :
          <div className="grid gap-3 md:grid-cols-2">{signals.map((s) => <Button variant="ghost" key={s.id} onClick={() => setSelectedSignal(s)} className="h-auto w-full items-start justify-start whitespace-normal rounded-lg border bg-card p-4 text-left font-normal hover:bg-primary/5">
            <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><p className="text-xs font-semibold">{s.name}</p><p className="mt-1 text-xs text-muted-foreground">{s.type} · {s.segment ? `Segment ${s.segment}` : "Uden segmentklasse"}</p></div><ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /></div>
              <div className="mt-3 space-y-1">{s.rules.map(rule => <p key={rule.text} className="text-xs leading-5">{rule.text} <span className="text-muted-foreground">· {rule.horizon}</span></p>)}</div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-2"><p className="text-xs text-muted-foreground">Sidst: {s.last ?? "Ukendt"}{s.channel ? ` · ${s.channel}` : ""}</p><MeetingPill m={s.next} /></div>
            </div></Button>)}<div className="md:col-span-2"><Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setPanel("signals")}>Alle signaler</Button></div></div>}
        </ManagerSection>

        <ManagerSection id="themes" title="Temaer i marken de sidste 30 dage" header={<div className="flex items-center gap-3"><MessageSquare className="h-5 w-5 text-primary" /><h3 className="text-lg font-bold">Temaer i marken de sidste 30 dage</h3></div>}>
          {loadError ? <ErrorBlock label="Temaer" onRetry={retry} /> : noActivity || imported || !full ? <p className="text-sm text-muted-foreground">{imported ? "Importeret CRM-dokumentation analyseres ikke for temaer." : "Ingen analyserede debriefs i perioden."}</p> : <EmployeeFieldThemes partial={false} unfinished={false} />}
        </ManagerSection>
        <EmployeeActivityPanels member={m} noActivity={noActivity} noPlan={noPlan} loadError={loadError} onRetry={retry} />

        <EmployeeBrickCoverage member={m} range={option.range} noActivity={noActivity} loadError={loadError} onRetry={retry} />
        <EmployeeCalendarChanges member={m} noActivity={noActivity} loadError={loadError} onRetry={retry} />

        <ManagerSection id="training" title="Resultater fra træningsplatform" header={<div><h3 className="flex items-center gap-3 text-lg font-bold"><GraduationCap className="h-5 w-5 shrink-0 text-primary" />Resultater fra træningsplatform</h3><p className="mt-1 text-xs text-muted-foreground">Ingen træning i perioden · seneste historiske resultat nedenfor</p></div>}><div className="manager-band"><div className="flex flex-wrap items-baseline justify-between gap-2 border-b px-4 py-3"><p className="text-xs font-semibold">Samtale om Dose 1-forløbet</p><p className="text-xs text-muted-foreground">9. sep 2025 · historisk demo-træning</p></div><div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">{[["Gik godt", "Klar forklaring af det akutte appendicitisforløb."], ["Kan forbedres", "Afdæk præference for kirurgi, før materialer præsenteres."], ["Næste fokus", "Ét åbent spørgsmål om kundens nuværende forløb."]].map(([label, text]) => <div key={label} className="p-4"><p className="text-xs font-semibold">{label}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p></div>)}</div></div></ManagerSection>
      </>}
    </main>

    <Sheet open={panel !== null} onOpenChange={(o) => !o && setPanel(null)}><SheetContent className="w-full overflow-y-auto sm:max-w-xl"><SheetHeader><SheetTitle>{panel ? titles[panel] : ""}</SheetTitle><SheetDescription>{option.range} · Lokal demo-dokumentation</SheetDescription></SheetHeader><div className="mt-6 space-y-4">
      {panel === "one-to-one" ? <><div className="flex gap-2"><Button size="sm" onClick={copyPrep}><Clipboard className="mr-2 h-4 w-4" />Kopiér</Button><Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Udskriv</Button></div>{oneToOnePoints.map((p, i) => <Card key={p.title}><CardContent className="p-5"><Badge variant="secondary">Punkt {i + 1}</Badge><h3 className="mt-3 font-bold">{p.title}</h3><p className="mt-3 text-sm"><strong>Observation:</strong> {p.observation}</p><p className="mt-3 text-sm"><strong>Åbent spørgsmål:</strong> “{p.question}”</p><p className="mt-3 text-xs text-muted-foreground">Kilder: {p.sources}</p></CardContent></Card>)}</>
      : panel === "contacts" ? <><p className="text-sm text-muted-foreground">{contacts} fysiske og virtuelle kontakter. {m.phone} telefonkontakter opgøres særskilt; kalenderændringer indgår ikke.</p>{full && !noActivity && [["30. sep", "Fysisk", "Lægehuset Amagerbro"], ["28. sep", "Virtuelt", "Klinik Islands Brygge"], ["24. sep", "Fysisk", "Lægecenter Ørestad"]].map((r) => <div key={r[2]} className="flex justify-between rounded-lg border p-4 text-sm"><span>{r[0]} · {r[1]}</span><span className="font-medium">{r[2]}</span></div>)}<Badge variant="outline">Kilde K1 · CONTACT-2026-10</Badge></>
      : panel === "coverage" ? <><p className="text-sm">{hcos} af {m.hcosAssigned} tildelte HCO'er har en registreret kontakt. HCP-rækkevidde er et særskilt mål.</p><Badge variant="outline">Kilde K1 · COVERAGE-2026-10</Badge></>
      : panel === "drafts" ? <><div className="grid grid-cols-2 gap-3">{[["Kladder", m.drafts], ["Mangler", m.missing]].map(([l, v]) => <Card key={l}><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{v}</p><p className="text-xs text-muted-foreground">{l}</p></CardContent></Card>)}</div><Badge variant="outline">Kilde K2 · DOC-001–DOC-011</Badge></>
      : panel === "documentation" ? <><div className="grid grid-cols-3 gap-3">{[["Færdige", documented], ["Kladder", imported ? 0 : m.drafts], ["Mangler", imported ? 0 : m.missing]].map(([l, v]) => <Card key={l}><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{v}</p><p className="text-xs text-muted-foreground">{l}</p></CardContent></Card>)}</div><p className="text-sm text-muted-foreground">{imported ? `Alle ${documented} er mærket "Importeret fra CRM". Afsendelsesstatus er ikke relevant.` : `Af ${documented} færdige Jarvis-debriefs er ${Math.max(0, documented - m.drafts)} sendt og ${m.drafts} klar, ikke sendt.`}</p><Badge variant="outline">Kilde K3 · DOC-001–DOC-089</Badge></>
       : panel === "quality" ? <EmployeeQuality member={m} unavailable={imported || noActivity} error={qualityError} unfinished={false} onRetry={retry} />
      : panel === "signals" ? signals.map((s) => <div key={s.id} className="rounded-lg border p-4"><div className="flex justify-between"><strong>{s.name}</strong><Badge variant="outline">{s.id}</Badge></div>{s.rules.map((r) => <p key={r.text} className="mt-2 text-sm text-muted-foreground">{r.text} · {r.horizon}</p>)}</div>)
      : panel === "themes" ? <><p className="text-sm text-muted-foreground">60 analyseret · 14 afventer · 4 fejlede</p>{themes.map((t) => <button key={t.id} onClick={() => setSelectedTheme(t)} className="flex w-full justify-between rounded-lg border p-4 text-left"><span className="font-medium">{t.label}</span><span className="text-sm text-muted-foreground">{t.count} / 60</span></button>)}</> : null}
    </div></SheetContent></Sheet>

    <Dialog open={selectedTheme !== null} onOpenChange={(o) => !o && setSelectedTheme(null)}><DialogContent><DialogHeader><DialogTitle>{selectedTheme?.label}</DialogTitle><DialogDescription>Fiktive demo-uddrag · {selectedTheme?.id}</DialogDescription></DialogHeader><div className="space-y-3">{selectedTheme?.examples.map((ex, i) => <div key={ex} className="rounded-lg bg-muted/40 p-4"><p className="text-sm">“{ex}”</p><p className="mt-2 text-xs text-muted-foreground">DEBRIEF-{String((i + 1) * 14).padStart(3, "0")} · {12 + i * 6}. sep 2026 · HCP · {["Lægehuset Amagerbro", "Klinik Islands Brygge", "Lægecenter Ørestad"][i]}</p></div>)}</div></DialogContent></Dialog>
    <Dialog open={selectedSignal !== null} onOpenChange={(o) => !o && setSelectedSignal(null)}><DialogContent><DialogHeader><DialogTitle>{selectedSignal?.name}</DialogTitle><DialogDescription>Kilde til aktuelt signal · {selectedSignal?.id}</DialogDescription></DialogHeader>{selectedSignal && <div className="space-y-4 text-sm">{selectedSignal.rules.map((r, i) => <div key={r.text} className="rounded-lg border p-3"><p><strong>Regel {selectedSignal.rules.length > 1 ? i + 1 : ""}:</strong> {r.text}</p><p className="mt-1 text-muted-foreground">Reglens horisont: {r.horizon}</p></div>)}<p><strong>Sidste registrerede kontakt:</strong> {selectedSignal.last ? `${selectedSignal.last} · ${selectedSignal.channel} · ${selectedSignal.contact}` : "Ukendt"}</p><div><strong className="mb-1 block">Næste registrerede møde:</strong><MeetingPill m={selectedSignal.next} /></div><Button variant="outline" onClick={() => { if (selectedSignal) { toast({ title: selectedSignal.name, description: "Fiktiv demo-kunde · ikke koblet til en kundejournal." }); } }}>Se kunde</Button></div>}</DialogContent></Dialog>
  </div>;
};

export default EmployeeDetail;
