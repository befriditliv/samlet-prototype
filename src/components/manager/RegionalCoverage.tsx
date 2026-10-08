import { useState } from "react";
import { Building2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { districtCoverage, teamTotals } from "@/data/managerDemo";

export function RegionalCoverage() {
  const [sort, setSort] = useState("name");
  const rows = districtCoverage.map(row => {
    const [contacted, assigned] = row.value.split(" / ").map(Number);
    return { ...row, contacted, assigned, percent: Math.round(contacted / assigned * 100) };
  }).sort((a, b) => sort === "coverage" ? a.percent - b.percent : a.district.localeCompare(b.district));
  return <section aria-labelledby="regional-coverage-title" className="space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3"><Building2 className="h-5 w-5 text-primary" /><div><h2 id="regional-coverage-title" className="text-lg font-bold">Regional kontaktdækning</h2><p className="text-xs text-muted-foreground">{teamTotals.hcosContacted} af {teamTotals.hcosAssigned} HCO'er med registreret kontakt · seneste 30 dage</p></div></div>
      <Select value={sort} onValueChange={setSort}><SelectTrigger className="h-8 w-48 bg-card" aria-label="Sortér regionale områder"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="name">Område</SelectItem><SelectItem value="coverage">Laveste dækning først</SelectItem></SelectContent></Select>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{rows.map(row => <div key={row.district} className="rounded-lg border bg-card p-4"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold">{row.district}</h3><span className="text-sm font-bold text-primary">{row.percent}%</span></div><p className="mt-2 text-xs text-muted-foreground"><strong className="text-foreground">{row.value}</strong> HCO'er</p><Progress value={row.percent} className="mt-3 h-1.5" /></div>)}</div>
    <p className="text-xs text-muted-foreground">Fiktive områdedata · fysiske og virtuelle kontakter. Fysisk brick-dækning vises særskilt på medarbejdersiden.</p>
  </section>;
}