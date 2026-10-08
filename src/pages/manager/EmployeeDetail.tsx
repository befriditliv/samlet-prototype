import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Building2, CalendarCheck, CalendarX, ChevronRight, Clipboard, FileCheck2, MessageSquareText, Printer, RefreshCw, Sparkles, UserRound, Users } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ManagerPeriodControl } from "@/components/manager/ManagerPeriodControl";
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
import { fmt, oneToOnePoints, pct, scenarioOptions, signals, syncLine, teamMembers, themes, type DemoScenario, type MeetingState } from "@/data/managerDemo";
import { ManagerSection, ManagerSections, ManagerSectionControls, useManagerSectionState } from "@/components/manager/ManagerSection";
import jarvisLogo from "@/assets/jarvis-logo.svg";

type PanelKey = "contacts" | "coverage" | "documentation" | "drafts" | "quality" | "signals" | "themes" | "one-to-one" | null;
type Signal = (typeof signals)[number];
type Theme = (typeof themes)[number];

const MeetingPill = ({ m }: { m: MeetingState }) => {
  if (m.kind === "own") return <span className="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-1 text-xs font-medium text-primary"><CalendarCheck className="h-3.5 w-3.5" />Eget møde {m.date}</span>;
  if (m.kind === "colleague") return <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"><UserRound className="h-3.5 w-3.5" />{m.who} har møde {m.date}</span>;
  if (m.kind === "outside") return <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-foreground">{m.date} <span className="text-muted-foreground">· uden for 28 dage</span></span>;
  if (m.kind === "unavailable") return <span className="inline-flex items-center gap-1 rounded-md border-2 border-destructive/50 bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive"><AlertTriangle className="h-3.5 w-3.5" />Mødedata utilgængelig</span>;
  return <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-muted-foreground/40 px-2 py-1 text-xs text-muted-foreground"><CalendarX className="h-3.5 w-3.5" />Intet kommende registreret</span>;
};

const EmployeeDetail = () => <ManagerSections ids={["performance", "employee-quality", "signals", "themes", "contact-plan", "employee-coverage", "calendar", "training"]} defaultClosed={["calendar", "training"]}><EmployeeDetailContent /></ManagerSections>;

const EmployeeDetailContent = () => {
  const training = useManagerSectionState("training");
  const navigate = useNavigate();
  const back = useBackNavigation("/manager");
  const { slug } = useParams();
  const { period, setPeriod, option, hasFixture } = useManagerPeriod();
  const [scenario, setScenario] = useState<DemoScenario>("normal");
  const [panel, setPanel] = useState<PanelKey>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const m = useMemo(() => teamMembers.find((item) => item.slug === slug) ?? teamMembers[0], [slug]);
  const full = m.slug === "christian";

  const noActivity = scenario === "no-activity" || m.state === "no-activity";
  const loadError = scenario === "load-error";
  const qualityError = loadError || m.state === "quality-error";
  const imported = scenario === "imported-docs" || m.state === "imported";
  const partial = scenario === "partial";
  const unfinished = scenario === "unfinished";
  const noPlan = scenario === "no-plan" || m.plan === null;
  const retry = () => { setScenario("normal"); toast({ title: "Henter igen", description: "Demo: data er hentet." }); };

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
    { icon: Users, label: "Registrerede kontakter", value: String(contacts), note: noActivity ? "Vellykket opslag · ingen registrerede kontakter" : `Fysiske + virtuelle · ${m.phone} telefonkontakter særskilt`, key: "contacts", error: loadError },
    { icon: Building2, label: "Kontaktede HCO'er", value: `${hcos} / ${m.hcosAssigned}`, note: `${pct(hcos, m.hcosAssigned)} af tildelte HCO'er`, key: "coverage", error: loadError },
    { icon: FileCheck2, label: "Dokumentation foreligger", value: contacts ? `${documented} / ${contacts}` : "Ingen relevante kontakter", note: !contacts ? "Ingen forventede debriefs" : imported ? `${pct(documented, contacts)} · alle importeret fra CRM` : `${pct(documented, contacts)} · ${m.drafts} kladder · ${m.missing} mangler`, key: "documentation", error: loadError },
    { icon: MessageSquareText, label: "Debriefkvalitet", value: qualityValue, note: imported ? "Importeret dokumentation vurderes ikke" : noActivity || m.quality === null ? "Ingen vurderede debriefs" : `Periodegennemsnit · n = ${m.qualityN} af ${m.completed}`, key: "quality", error: qualityError },
  ];

  return <div className="manager-view min-h-screen bg-background">
    <header className="sticky top-0 z-10 border-b bg-card/90 shadow-sm backdrop-blur-sm"><div className="container mx-auto px-4 py-4 sm:px-6"><div className="flex flex-wrap items-center gap-3"><Button variant="ghost" size="icon" onClick={back} aria-label="Tilbage til teamoverblik"><ArrowLeft className="h-5 w-5" /></Button><img src={jarvisLogo} alt="Jarvis-logo" className="h-10 w-10" /><div className="min-w-48 flex-1"><div className="flex items-center gap-2"><h1 className="text-lg font-bold">Medarbejderoversigt</h1><Badge variant="secondary">Demo</Badge></div><p className="text-sm text-muted-foreground">Forberedelse til 1:1</p></div><ManagerPeriodControl value={period} onChange={setPeriod} range={option.range} /><div className="hidden w-56 lg:block"><HcpSearch /></div><AskJarvisManager /><NavigationMenu /></div><div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><RefreshCw className="h-3.5 w-3.5" />{syncLine.split(" · Brief")[0]}</div></div></header>

    <main className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
      <ManagerSectionControls />
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-2xl font-bold">User</h2><Badge variant="outline">Demo-identitet</Badge></div><p className="mt-1 text-muted-foreground">{m.role} · {m.district}</p></div><div className="flex flex-wrap items-end gap-3"><div><p className="mb-1 text-xs text-muted-foreground">Medarbejder</p><Select value={m.slug} onValueChange={(v) => navigate(`/manager/employee/${v}`)}><SelectTrigger className="h-9 w-44 bg-background"><SelectValue /></SelectTrigger><SelectContent>{[...teamMembers].sort((a, b) => a.name.localeCompare(b.name, "da")).map((i) => <SelectItem key={i.slug} value={i.slug}>User · {i.district}</SelectItem>)}</SelectContent></Select></div><div><p className="mb-1 text-xs text-muted-foreground">Demo-scenarie · kun til gennemsyn</p><Select value={scenario} onValueChange={(v) => setScenario(v as DemoScenario)}><SelectTrigger className="h-9 w-56 bg-background"><SelectValue /></SelectTrigger><SelectContent>{scenarioOptions.map((i) => <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>)}</SelectContent></Select></div><Button onClick={() => setPanel("one-to-one")}><Sparkles className="mr-2 h-4 w-4" />Forbered 1:1</Button></div></section>

      {!hasFixture ? <Card className="rounded-lg border shadow-sm"><CardContent className="p-10 text-center"><h3 className="font-semibold">Ingen forberedte demo-data for denne periode</h3><p className="mt-2 text-sm text-muted-foreground">Vælg 30 dage for at se sporbare medarbejderdata.</p></CardContent></Card> : <>
        {unfinished && <div className="rounded-md border bg-muted/40 px-4 py-2 text-sm text-muted-foreground">Uafsluttet periode · periodetal vises, alle trendtal er undertrykt.</div>}

        <ManagerSection id="performance" title="Generel præstation" header={<div className="flex items-baseline justify-between gap-3"><h3 className="text-lg font-bold">Generel præstation</h3><span className="text-xs text-muted-foreground">{option.range}</span></div>}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{kpis.map(k => <div key={k.key} className={`rounded-lg border bg-card p-3 ${k.error ? "border-destructive/50" : ""}`}><Button variant="ghost" className="h-auto w-full justify-start whitespace-normal p-0 text-left hover:bg-transparent" onClick={() => setPanel(k.key as PanelKey)}><div className="w-full"><div className="mb-2 flex items-center justify-between"><k.icon className="h-4 w-4 text-primary" /><ChevronRight className="h-3.5 w-3.5 text-muted-foreground" /></div><p className="text-xs font-medium text-muted-foreground">{k.label}</p><p className="mt-1 text-2xl font-bold">{k.error ? "Utilgængelig" : k.value}</p><p className="mt-2 text-xs font-normal leading-5 text-muted-foreground">{k.note}</p></div></Button>{k.error && <Button size="sm" variant="outline" className="mt-2" onClick={retry}>Prøv igen</Button>}</div>)}</div>
        </ManagerSection>
        <EmployeeQuality member={m} unavailable={imported || noActivity} error={qualityError} unfinished={unfinished} onRetry={retry} />

        <ManagerSection id="signals" title="Vigtigste kunde signaler" header={<div><div className="flex items-center gap-2"><h3 className="text-lg font-bold">Vigtigste kunde signaler</h3><Badge variant="secondary">Aktuel · reglens egen horisont</Badge></div><p className="mt-1 text-sm text-muted-foreground">Reglerne har hver deres tidshorisont. Dette er en aktuel liste, ikke en trend for den valgte periode.</p></div>}>
          {loadError ? <ErrorBlock label="Kundesignaler" onRetry={retry} /> : !full ? <Card className="border border-dashed bg-muted/20 shadow-none"><CardContent className="p-6 text-sm text-muted-foreground">Ingen aktuelle kundesignaler for medarbejderen.</CardContent></Card> :
          <Card className="rounded-lg border shadow-sm"><div className="divide-y">{signals.map((s) => <Button variant="ghost" key={s.id} onClick={() => setSelectedSignal(s)} className="grid h-auto w-full justify-stretch gap-3 whitespace-normal rounded-none p-3 text-left font-normal hover:bg-muted/30 lg:grid-cols-[1.1fr_1.6fr_0.9fr_1.1fr_auto] md:items-center">
            <div><div className="flex flex-wrap items-center gap-2"><span className="font-semibold">{s.name}</span><Badge variant="outline">{s.type}</Badge>{s.rules.length > 1 && <Badge>{s.rules.length} signaler</Badge>}</div><p className="mt-1 text-xs text-muted-foreground">{s.segment ? `Segment ${s.segment}` : "Uden segmentklasse"}</p></div>
            <p className="text-sm">{s.rules[0].text}{s.rules.length > 1 && <span className="block text-sm">+ {s.rules[1].text}</span>}<span className="mt-1 block text-xs text-muted-foreground">Reglens horisont: {s.rules.map((r) => r.horizon).join(" / ")}</span></p>
            <p className="text-sm"><span className="block text-xs text-muted-foreground">Sidste kontakt</span>{s.last ?? "Ukendt"}{s.channel && <span className="block text-xs text-muted-foreground">{s.channel} · {s.contact}</span>}</p>
            <div className="text-sm"><span className="mb-1 block text-xs text-muted-foreground">Næste registrerede møde</span><MeetingPill m={s.next} /></div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" /></Button>)}</div><div className="border-t p-3 text-center"><Button variant="ghost" size="sm" onClick={() => setPanel("signals")}>Alle signaler</Button></div></Card>}
        </ManagerSection>

        <ManagerSection id="themes" title="Temaer i marken de sidste 30 dage" header={<h3 className="text-lg font-bold">Temaer i marken de sidste 30 dage</h3>}>
          {loadError ? <ErrorBlock label="Temaer" onRetry={retry} /> : noActivity || imported || !full ? <p className="text-sm text-muted-foreground">{imported ? "Importeret CRM-dokumentation analyseres ikke for temaer." : "Ingen analyserede debriefs i perioden."}</p> : <EmployeeFieldThemes partial={partial} unfinished={unfinished} />}
        </ManagerSection>
        <EmployeeActivityPanels member={m} noActivity={noActivity} noPlan={noPlan} loadError={loadError} onRetry={retry} />

        <EmployeeBrickCoverage member={m} range={option.range} noActivity={noActivity} loadError={loadError} onRetry={retry} />
        <EmployeeCalendarChanges member={m} noActivity={noActivity} loadError={loadError} onRetry={retry} />

        <section><Accordion type="single" collapsible value={training.open ? "training" : ""} onValueChange={value => training.setOpen(value === "training")}><AccordionItem value="training" className="rounded-lg border bg-card px-5"><AccordionTrigger className="py-4 text-left hover:no-underline"><div className="flex flex-wrap items-baseline gap-x-4 gap-y-1"><span className="text-sm font-semibold">Resultater fra træningsplatform</span><span className="text-xs font-normal text-muted-foreground">Ingen træning i perioden</span></div></AccordionTrigger><AccordionContent><p className="text-xs text-muted-foreground">Historisk demo-træning · 9. sep 2025</p><p className="mt-2 text-sm font-medium">Samtale om Dose 1-forløbet</p><div className="mt-3 grid gap-4 sm:grid-cols-3"><p className="text-sm leading-6"><strong>Gik godt</strong><br />Klar forklaring af det akutte appendicitisforløb.</p><p className="text-sm leading-6"><strong>Kan forbedres</strong><br />Afdæk præference for kirurgi, før materialer præsenteres.</p><p className="text-sm leading-6"><strong>Næste fokus</strong><br />Ét åbent spørgsmål om kundens nuværende forløb.</p></div></AccordionContent></AccordionItem></Accordion></section>
      </>}
    </main>

    <Sheet open={panel !== null} onOpenChange={(o) => !o && setPanel(null)}><SheetContent className="w-full overflow-y-auto sm:max-w-xl"><SheetHeader><SheetTitle>{panel ? titles[panel] : ""}</SheetTitle><SheetDescription>{option.range} · Lokal demo-dokumentation</SheetDescription></SheetHeader><div className="mt-6 space-y-4">
      {panel === "one-to-one" ? <><div className="flex gap-2"><Button size="sm" onClick={copyPrep}><Clipboard className="mr-2 h-4 w-4" />Kopiér</Button><Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" />Udskriv</Button></div>{oneToOnePoints.map((p, i) => <Card key={p.title}><CardContent className="p-5"><Badge variant="secondary">Punkt {i + 1}</Badge><h3 className="mt-3 font-bold">{p.title}</h3><p className="mt-3 text-sm"><strong>Observation:</strong> {p.observation}</p><p className="mt-3 text-sm"><strong>Åbent spørgsmål:</strong> “{p.question}”</p><p className="mt-3 text-xs text-muted-foreground">Kilder: {p.sources}</p></CardContent></Card>)}</>
      : panel === "contacts" ? <><p className="text-sm text-muted-foreground">{contacts} fysiske og virtuelle kontakter. {m.phone} telefonkontakter opgøres særskilt; kalenderændringer indgår ikke.</p>{full && !noActivity && [["30. sep", "Fysisk", "Lægehuset Amagerbro"], ["28. sep", "Virtuelt", "Klinik Islands Brygge"], ["24. sep", "Fysisk", "Lægecenter Ørestad"]].map((r) => <div key={r[2]} className="flex justify-between rounded-lg border p-4 text-sm"><span>{r[0]} · {r[1]}</span><span className="font-medium">{r[2]}</span></div>)}<Badge variant="outline">Kilde K1 · CONTACT-2026-10</Badge></>
      : panel === "coverage" ? <><p className="text-sm">{hcos} af {m.hcosAssigned} tildelte HCO'er har en registreret kontakt. HCP-rækkevidde er et særskilt mål.</p><Badge variant="outline">Kilde K1 · COVERAGE-2026-10</Badge></>
      : panel === "drafts" ? <><div className="grid grid-cols-2 gap-3">{[["Kladder", m.drafts], ["Mangler", m.missing]].map(([l, v]) => <Card key={l}><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{v}</p><p className="text-xs text-muted-foreground">{l}</p></CardContent></Card>)}</div><Badge variant="outline">Kilde K2 · DOC-001–DOC-011</Badge></>
      : panel === "documentation" ? <><div className="grid grid-cols-3 gap-3">{[["Færdige", documented], ["Kladder", imported ? 0 : m.drafts], ["Mangler", imported ? 0 : m.missing]].map(([l, v]) => <Card key={l}><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{v}</p><p className="text-xs text-muted-foreground">{l}</p></CardContent></Card>)}</div><p className="text-sm text-muted-foreground">{imported ? `Alle ${documented} er mærket "Importeret fra CRM". Afsendelsesstatus er ikke relevant.` : `Af ${documented} færdige Jarvis-debriefs er ${Math.max(0, documented - m.drafts)} sendt og ${m.drafts} klar, ikke sendt.`}</p><Badge variant="outline">Kilde K3 · DOC-001–DOC-089</Badge></>
       : panel === "quality" ? <EmployeeQuality member={m} unavailable={imported || noActivity} error={qualityError} unfinished={unfinished} onRetry={retry} />
      : panel === "signals" ? signals.map((s) => <div key={s.id} className="rounded-lg border p-4"><div className="flex justify-between"><strong>{s.name}</strong><Badge variant="outline">{s.id}</Badge></div>{s.rules.map((r) => <p key={r.text} className="mt-2 text-sm text-muted-foreground">{r.text} · {r.horizon}</p>)}</div>)
      : panel === "themes" ? <><p className="text-sm text-muted-foreground">60 analyseret · 14 afventer · 4 fejlede</p>{themes.map((t) => <button key={t.id} onClick={() => setSelectedTheme(t)} className="flex w-full justify-between rounded-lg border p-4 text-left"><span className="font-medium">{t.label}</span><span className="text-sm text-muted-foreground">{t.count} / 60</span></button>)}</> : null}
    </div></SheetContent></Sheet>

    <Dialog open={selectedTheme !== null} onOpenChange={(o) => !o && setSelectedTheme(null)}><DialogContent><DialogHeader><DialogTitle>{selectedTheme?.label}</DialogTitle><DialogDescription>Fiktive demo-uddrag · {selectedTheme?.id}</DialogDescription></DialogHeader><div className="space-y-3">{selectedTheme?.examples.map((ex, i) => <div key={ex} className="rounded-lg bg-muted/40 p-4"><p className="text-sm">“{ex}”</p><p className="mt-2 text-xs text-muted-foreground">DEBRIEF-{String((i + 1) * 14).padStart(3, "0")} · {12 + i * 6}. sep 2026 · HCP · {["Lægehuset Amagerbro", "Klinik Islands Brygge", "Lægecenter Ørestad"][i]}</p></div>)}</div></DialogContent></Dialog>
    <Dialog open={selectedSignal !== null} onOpenChange={(o) => !o && setSelectedSignal(null)}><DialogContent><DialogHeader><DialogTitle>{selectedSignal?.name}</DialogTitle><DialogDescription>Kilde til aktuelt signal · {selectedSignal?.id}</DialogDescription></DialogHeader>{selectedSignal && <div className="space-y-4 text-sm">{selectedSignal.rules.map((r, i) => <div key={r.text} className="rounded-lg border p-3"><p><strong>Regel {selectedSignal.rules.length > 1 ? i + 1 : ""}:</strong> {r.text}</p><p className="mt-1 text-muted-foreground">Reglens horisont: {r.horizon}</p></div>)}<p><strong>Sidste registrerede kontakt:</strong> {selectedSignal.last ? `${selectedSignal.last} · ${selectedSignal.channel} · ${selectedSignal.contact}` : "Ukendt"}</p><div><strong className="mb-1 block">Næste registrerede møde:</strong><MeetingPill m={selectedSignal.next} /></div><Button variant="outline" onClick={() => { if (selectedSignal) { toast({ title: selectedSignal.name, description: "Fiktiv demo-kunde · ikke koblet til en kundejournal." }); } }}>Se kunde</Button></div>}</DialogContent></Dialog>
  </div>;
};

export default EmployeeDetail;
