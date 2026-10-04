import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowDown, ArrowRight, ArrowUp, ArrowUpDown, Building2, FileCheck2, MessageSquareText, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { districtCoverage, fmt, teamMembers, teamTotals, type TeamMember } from "@/data/managerDemo";

type SortKey = "name" | "district" | "contacts" | "hcos" | "documentation" | "quality";
const value = (m: TeamMember, k: SortKey): string | number => k === "name" ? m.name : k === "district" ? m.district : k === "contacts" ? m.contacts : k === "hcos" ? m.hcosContacted : k === "documentation" ? m.documented : m.quality ?? -1;

const Kpi = ({ icon: Icon, label, value, note, extra }: { icon: typeof Users; label: string; value: string; note: string; extra?: string }) => (
  <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm"><CardContent className="p-5"><div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10"><Icon className="h-4 w-4 text-primary" /></div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold text-foreground">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p>{extra && <p className="mt-2 text-xs leading-5 text-muted-foreground">{extra}</p>}</CardContent></Card>
);

export const EmployeeOverview = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "name", dir: 1 });
  const rows = useMemo(() => [...teamMembers].sort((a, b) => { const x = value(a, sort.key), y = value(b, sort.key); return (typeof x === "string" ? x.localeCompare(y as string, "da") : x - (y as number)) * sort.dir; }), [sort]);
  const head = (key: SortKey, label: string) => <TableHead><button className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : 1 }))}>{label}{sort.key === key ? (sort.dir === 1 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3 opacity-40" />}</button></TableHead>;

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div><h2 className="text-xl font-bold text-foreground">Regionsbrief</h2><p className="mt-1 text-sm text-muted-foreground">Valgt periode · Demo-data</p></div>
        <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm"><CardContent className="p-6">
          <p className="max-w-4xl text-sm leading-7 text-foreground">Rønnevang Sundhedshus har to aktuelle signaler og intet kommende registreret møde hos Christian <Badge variant="outline">SIG-001</Badge>. Praktisk opstart optræder i 12 af Christians 60 analyserede debriefs; regional temadækning er ikke forberedt <Badge variant="outline">THEME-01</Badge>. 29 kontakter mangler dokumentation på tværs af teamet <Badge variant="outline">DOC-TEAM</Badge>. Nannas kvalitetsdata kunne ikke hentes, og Jonas har ingen registrerede kontakter i perioden. Regionen har 242 registrerede kontakter <Badge variant="outline">TEAM-2026-10</Badge>.</p>
        </CardContent></Card>
      </section>

      <section className="space-y-3">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi icon={Users} label="Registrerede kontakter" value={String(teamTotals.contacts)} note="Kun medarbejderkontakter" />
          <Kpi icon={Building2} label="Kontaktede HCO'er" value={`${teamTotals.hcosContacted} / ${teamTotals.hcosAssigned}`} note="Unikke HCO'er" />
          <Kpi icon={FileCheck2} label="Dokumentation foreligger" value={`${teamTotals.documented} / ${teamTotals.contacts}`} note={`${teamTotals.contacts - teamTotals.documented} uafsluttede`} />
          <Kpi icon={MessageSquareText} label="Debriefkvalitet" value={`${fmt(teamTotals.quality)} / 10`} note={`Vægtet · n = ${teamTotals.qualityN}`} extra="Nannas kvalitetsdata kunne ikke hentes. Idas dokumentation er importeret og ikke vurderet." />
        </div>
        <p className="text-sm text-muted-foreground">Teamtotalen tæller hver kontakt én gang. Summen af medarbejderrækkerne er højere, fordi flere medarbejdere kan deltage i samme møde.</p>
      </section>

      <section className="space-y-4">
        <div><h2 className="text-xl font-bold text-foreground">Regionale prioriteter</h2><p className="mt-1 text-sm text-muted-foreground">Hver prioritet åbner de bagvedliggende demo-sager</p></div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            ["Aktuel", "Kundesignaler", "Rønnevang Sundhedshus har to signaler og intet kommende registreret møde.", "Se Christian", "/manager/employee/christian#signals"],
            ["Valgt periode", "Praktisk opstart", "Christian: 12 af 60 analyserede debriefs; regional dækning ikke forberedt · THEME-01.", "Se tema", "/manager/employee/christian#themes"],
            ["Valgt periode", "Uafsluttede debriefs", "Christian 11 · Sofie 9 · Nanna 5 · Mikkel 4.", "Se dokumentation", "/manager/employee/christian#documentation"],
          ].map(([scope, title, text, action, href]) => <Card key={title} className="border-0 shadow-sm"><CardContent className="p-5"><Badge variant="secondary">{scope}</Badge><h3 className="mt-3 font-semibold text-foreground">{title}</h3><p className="mt-2 min-h-10 text-sm leading-5 text-muted-foreground">{text}</p><Button variant="ghost" className="mt-3 h-8 px-0 text-primary" onClick={() => navigate(href)}>{action}<ArrowRight className="ml-1 h-4 w-4" /></Button></CardContent></Card>)}
        </div>
      </section>

      <section className="space-y-4">
        <div><h2 className="text-xl font-bold text-foreground">Medarbejdere</h2><p className="mt-1 text-sm text-muted-foreground">Vælg en medarbejder for at forberede næste 1:1</p></div>
        <Card className="overflow-x-auto border-0 shadow-sm">
          <Table>
            <TableHeader><TableRow className="bg-muted/30">{head("name", "Medarbejder")}{head("district", "Distrikt")}{head("contacts", "Kontakter")}{head("hcos", "Kontaktede HCO'er")}{head("documentation", "Dokumentation")}{head("quality", "Kvalitet")}<TableHead className="min-w-60">Opmærksomhedspunkt</TableHead></TableRow></TableHeader>
            <TableBody>{rows.map((m) => <TableRow key={m.slug} className="cursor-pointer" onClick={() => navigate(`/manager/employee/${m.slug}`)}>
              <TableCell><button className="text-left font-semibold text-primary hover:underline">{m.name}</button><p className="text-xs text-muted-foreground">{m.role} · Demo</p></TableCell>
              <TableCell>{m.district}</TableCell>
              <TableCell className="font-semibold">{m.contacts}</TableCell>
              <TableCell>{m.hcosContacted} / {m.hcosAssigned}</TableCell>
              <TableCell>{m.contacts ? `${m.documented} / ${m.contacts}` : <span className="text-muted-foreground">Ingen relevante kontakter</span>}</TableCell>
              <TableCell>{m.state === "quality-error" ? <span className="inline-flex items-center gap-1 rounded border border-destructive/40 bg-destructive/10 px-1.5 py-0.5 text-xs font-medium text-destructive"><AlertCircle className="h-3 w-3" />Kunne ikke hentes</span> : m.quality !== null ? <>{fmt(m.quality)}<span className="block text-xs text-muted-foreground">n = {m.qualityN}</span></> : <span className="text-muted-foreground">Ingen vurderede debriefs</span>}</TableCell>
              <TableCell><div className="flex gap-2 text-sm text-muted-foreground"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{m.attention}</div></TableCell>
            </TableRow>)}
            <TableRow className="bg-muted/20 hover:bg-muted/20"><TableCell className="text-xs text-muted-foreground" colSpan={2}>Sum af rækker (ikke deduplikeret)</TableCell><TableCell className="text-xs text-muted-foreground">{teamTotals.rowSum}</TableCell><TableCell className="text-xs text-muted-foreground">{teamTotals.hcoRowSum}</TableCell><TableCell colSpan={3} /></TableRow>
            </TableBody>
          </Table>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="border-0 shadow-sm"><CardContent className="p-6"><h2 className="text-lg font-bold">Distriktsdækning</h2><div className="mt-5 grid gap-4 sm:grid-cols-4">{districtCoverage.map(({ district, value }) => <div key={district} className="border-l-2 border-primary/30 pl-4"><p className="text-sm text-muted-foreground">{district}</p><p className="mt-1 text-xl font-bold">{value}</p><p className="text-xs text-muted-foreground">kontaktede HCO'er</p></div>)}</div></CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-6"><p className="text-sm text-muted-foreground">Digital aktivitet i porteføljen</p><p className="mt-2 text-3xl font-bold">{teamTotals.digital}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Særskilte porteføljeberøringer. Indgår ikke i de 242 registrerede medarbejderkontakter.</p></CardContent></Card>
      </section>
    </div>
  );
};
