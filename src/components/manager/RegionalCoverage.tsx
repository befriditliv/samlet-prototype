import { useState } from "react";
import { MapPinned } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { districtCoverage, teamTotals } from "@/data/managerDemo";

import { ManagerSection, ManagerSectionTitle } from "./ManagerSection";

const DEFAULT_VISIBLE = 8;

export function RegionalCoverage() {
  const [sort, setSort] = useState("name");
  const [showAll, setShowAll] = useState(false);
  const rows = districtCoverage.map(row => {
    const [contacted, assigned] = row.value.split(" / ").map(Number);
    return { ...row, contacted, assigned, percent: Math.round(contacted / assigned * 100) };
  }).sort((a, b) => sort === "coverage" ? a.percent - b.percent : a.district.localeCompare(b.district));
  const visible = showAll ? rows : rows.slice(0, DEFAULT_VISIBLE);
  return <ManagerSection id="regional-coverage" title="Regional kontaktdækning" header={
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3"><MapPinned className="h-5 w-5 text-primary" /><div><ManagerSectionTitle>Regional kontaktdækning</ManagerSectionTitle><p className="mt-1 text-sm text-muted-foreground">{teamTotals.hcosContacted} af {teamTotals.hcosAssigned} HCO'er med registreret kontakt · seneste 30 dage</p></div></div>
      <Select value={sort} onValueChange={setSort}><SelectTrigger className="h-8 w-48 bg-card" aria-label="Sortér regionale områder"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="name">Område</SelectItem><SelectItem value="coverage">Laveste dækning først</SelectContent></SelectItem></Select>
    </div>}>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{visible.map(row => <div key={row.district} className="rounded-lg border bg-card p-4"><div className="flex items-center justify-between gap-2"><h3 className="text-xs font-semibold">{row.district}</h3><span className="text-sm font-bold text-primary tabular-nums">{row.percent}%</span></div><p className="mt-2 text-xs leading-5 text-muted-foreground"><strong className="font-medium text-foreground">{row.value}</strong> HCO'er</p><Progress value={row.percent} className="mt-3 h-1.5" /></div>)}</div>
    {rows.length > DEFAULT_VISIBLE && <div className="text-center"><Button variant="ghost" size="sm" onClick={() => setShowAll(value => !value)} aria-expanded={showAll}>{showAll ? "Vis færre" : "Vis mere"}</Button></div>}
    <p className="text-xs leading-5 text-muted-foreground">Fiktive områdedata · fysiske og virtuelle kontakter. Fysisk brick-dækning vises særskilt på medarbejdersiden.</p>
  </ManagerSection>;
}
