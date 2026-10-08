import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, CalendarCheck, CalendarX, CheckCircle2, CircleAlert, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { employeeListFixtures, fmt } from "@/data/managerDemo";

import { ManagerSection } from "./ManagerSection";

type SortKey = "name" | "contacts" | "documented" | "rate" | "quality" | "upcoming";
type Row = typeof employeeListFixtures[number];
const rate = (m: Row) => m.contacts ? Math.round(m.documented / m.contacts * 100) : 0;
const sortValue = (m: Row, key: SortKey) => key === "rate" ? rate(m) : key === "upcoming" ? m.upcoming[0] + m.upcoming[1] : key === "quality" ? m.quality ?? -1 : m[key];

const MeetingLine = ({ label, count, total, tone }: { label: string; count: number; total: number; tone: string }) => <div className="flex items-center gap-2 text-xs"><Progress value={total ? count / total * 100 : 0} className={`h-1 w-16 shrink-0 ${tone}`} /><span className="w-7 text-right font-semibold text-foreground">{count}</span><span className="text-muted-foreground">{label}</span></div>;

export const EmployeeOverview = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState("all");
  const [signal, setSignal] = useState("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "name", dir: 1 });
  const rows = useMemo(() => employeeListFixtures.filter(m => (employee === "all" || m.slug === employee) && (signal === "all" || (signal === "missing" && m.missing + m.drafts > 0) || (signal === "quality" && m.quality !== null && m.quality < 7) || (signal === "calendar" && m.calendar.deleted + m.calendar.cancelled > 0) || (signal === "error" && m.state === "quality-error"))).sort((a, b) => { const x = sortValue(a, sort.key), y = sortValue(b, sort.key); return (typeof x === "string" ? x.localeCompare(String(y), "da") : Number(x) - Number(y)) * sort.dir; }), [employee, signal, sort]);
  const head = (key: SortKey, label: string, subtitle: string) => <TableHead className="py-3"><Button variant="ghost" className="h-auto justify-start gap-1 p-0 text-foreground hover:bg-transparent" onClick={() => setSort(s => ({ key, dir: s.key === key && s.dir === 1 ? -1 : 1 }))}>{label}<ArrowUpDown className="h-3 w-3 text-muted-foreground" /></Button><p className="mt-1 text-xs font-normal">{subtitle}</p></TableHead>;
  return <ManagerSection id="employees" title="Medarbejderoversigt" header={
    <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2"><Users className="h-5 w-5 text-primary" /></div><div><h2 className="text-2xl font-bold">Medarbejderoversigt</h2><p className="text-sm text-muted-foreground">Indsigter om dit salgsteams præstation · Demo-data</p></div></div>
      <div className="flex flex-wrap gap-3"><Select value={signal} onValueChange={setSignal}><SelectTrigger className="h-8 w-52 bg-card" aria-label="Filtrer efter signal"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Filtrer efter signal</SelectItem><SelectItem value="missing">Uafsluttede debriefs</SelectItem><SelectItem value="quality">Kvalitet under 7</SelectItem><SelectItem value="calendar">Kalenderændringer</SelectItem><SelectItem value="error">Kvalitetsdata mangler</SelectItem></SelectContent></Select><Select value={employee} onValueChange={setEmployee}><SelectTrigger className="h-8 w-52 bg-card" aria-label="Filtrer efter bruger"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Filtrer efter bruger</SelectItem>{employeeListFixtures.map(m => <SelectItem key={m.slug} value={m.slug}>User · {m.district}</SelectItem>)}</SelectContent></Select></div>
    </div>}>
    <Card className="overflow-hidden rounded-lg border shadow-none"><Table className="min-w-[960px]"><TableHeader><TableRow className="bg-muted/30">{head("name", "Medarbejder", "Navn")}{head("contacts", "Møder", "Sidste 30 dage")}{head("documented", "Debriefs", "Sidste 30 dage")}{head("rate", "Debrief Overholdelse", "Sidste 30 dage")}{head("quality", "Debrief Kvalitet", "Sidste 30 dage")}{head("upcoming", "Planlagte møder", "Uge 41 / Uge 42")}</TableRow></TableHeader><TableBody>
      {rows.map(m => <TableRow key={m.slug} className="cursor-pointer transition-colors hover:bg-primary/5" onClick={() => navigate(`/manager/employee/${m.slug}`)}><TableCell className="min-w-40 py-3"><Button variant="link" className="h-auto justify-start p-0 font-semibold text-foreground">User</Button><p className="mt-1 text-xs text-muted-foreground">{m.district}</p></TableCell>
        <TableCell className="min-w-48 py-3"><div className="space-y-1"><MeetingLine label="Planlagte" count={m.plannedMeetings} total={m.contacts} tone="" /><MeetingLine label="Kanvas" count={m.canvasMeetings} total={m.contacts} tone="[&>div]:bg-muted-foreground" /><MeetingLine label="Slettede" count={m.calendar.deleted} total={m.contacts + m.calendar.deleted} tone="[&>div]:bg-destructive" /><MeetingLine label="Aflyste" count={m.calendar.cancelled} total={m.contacts + m.calendar.cancelled} tone="[&>div]:bg-warning" /><MeetingLine label="Ombookede" count={m.calendar.rebooked} total={m.contacts + m.calendar.rebooked} tone="[&>div]:bg-muted-foreground" /></div></TableCell>
        <TableCell className="min-w-40"><div className="space-y-2 text-sm"><p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /><span className="text-muted-foreground">Gennemført:</span><strong>{m.documented}</strong></p><p className="flex items-center gap-2"><Send className="h-4 w-4 text-warning" /><span className="text-muted-foreground">Ikke sendt:</span><strong>{m.drafts}</strong></p><p className="flex items-center gap-2"><CircleAlert className="h-4 w-4 text-destructive" /><span className="text-muted-foreground">Udestående:</span><strong>{m.missing}</strong></p></div></TableCell>
        <TableCell className="min-w-40">{m.contacts ? <div className="flex items-center gap-3"><Progress value={rate(m)} className="h-1.5 w-20" /><strong className="text-xs">{rate(m)}%</strong></div> : <span className="text-xs text-muted-foreground">Ingen møder</span>}</TableCell>
        <TableCell className="min-w-40">{m.quality !== null ? <div className="flex items-center gap-3"><Progress value={m.quality * 10} className={`h-1.5 w-20 ${m.quality < 7 ? "[&>div]:bg-warning" : ""}`} /><strong className="text-xs">{fmt(m.quality)}</strong></div> : <span className={`text-xs ${m.state === "quality-error" ? "text-destructive" : "text-muted-foreground"}`}>{m.state === "quality-error" ? "Kunne ikke hentes" : "Ingen vurderede debriefs"}</span>}</TableCell>
        <TableCell><div className="flex items-center gap-2">{m.upcoming.map((count, i) => <span key={i} className="flex items-center gap-2">{i === 1 && <span className="text-muted-foreground">/</span>}<span className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-semibold ${count ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`} title={`Uge ${41 + i}`}>{count}</span></span>)}</div></TableCell>
      </TableRow>)}
      {!rows.length && <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">Ingen medarbejdere matcher filtrene.</TableCell></TableRow>}
    </TableBody></Table></Card>
  </ManagerSection>;
};
