import { useState } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { employeeThemeDetails, employeeThemeSources, themes, themeCoverage } from "@/data/managerDemo";

export function EmployeeFieldThemes({ partial, unfinished }: { partial: boolean; unfinished: boolean }) {
  const [source, setSource] = useState<typeof employeeThemeSources[number] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const selectedTheme = themes.find(theme => theme.id === selected);
  const selectedDetail = employeeThemeDetails.find(item => item.themeId === selected);
  return <>
    <p className="text-sm text-muted-foreground">{partial ? "18 af 78" : `${themeCoverage.analyzed} af ${themeCoverage.completed}`} debriefs analyseret · {partial ? 56 : themeCoverage.pending} afventer · 4 kunne ikke analyseres</p>
    <div className="divide-y overflow-hidden rounded-lg border bg-card">
      {themes.map(theme => {
        const detail = employeeThemeDetails.find(item => item.themeId === theme.id);
        const count = partial ? Math.max(1, Math.round(theme.count * 18 / 60)) : theme.count;
        return <Button variant="ghost" key={theme.id} onClick={() => { setSelected(theme.id); setSource(null); }} className="h-auto w-full justify-start whitespace-normal rounded-none px-4 py-3 text-left"><div className="grid flex-1 gap-3 sm:grid-cols-[1fr_180px]"><div><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{theme.label}</p><Badge variant="outline">{detail?.kind}</Badge></div><p className="mt-1 text-sm font-normal leading-5 text-muted-foreground">{detail?.summary}</p></div><div className="text-sm"><p className="font-semibold">{count} af {partial ? 18 : 60} debriefs</p><p className="mt-1 text-xs font-normal text-muted-foreground">{theme.hcps} HCP'er · {theme.hcos} HCO'er</p><p className="mt-1 text-xs font-normal text-muted-foreground">{partial || unfinished ? "Ændring kan ikke vurderes" : theme.change ? `${theme.change.replace("pp", "procentpoint")} i andel` : "Intet sammenligneligt grundlag"}</p></div></div><ChevronRight className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" /></Button>;
      })}
    </div>
    <p className="text-xs text-muted-foreground">En debrief kan indgå i flere temaer. Temaerne er observationer i noterne, ikke konklusioner om behandlingsvalg.</p>
    <Dialog open={selected !== null} onOpenChange={open => { if (!open) { setSelected(null); setSource(null); } }}><DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{source ? `${source.speaker} · ${source.organization}` : selectedTheme?.label}</DialogTitle><DialogDescription>{source ? `${source.date} kl. ${source.time} · Noteret af User · ${source.id}` : "Udvalgte fiktive kilder · uddrag af noter, ikke lydoptagelser"}</DialogDescription></DialogHeader>{source ? <div className="space-y-4 text-sm leading-6"><Button variant="ghost" size="sm" onClick={() => setSource(null)}><ArrowLeft className="mr-2 h-4 w-4" />Tilbage til tema</Button><p>{source.note}</p><div className="border-t pt-4"><h4 className="font-semibold">Næste skridt</h4><p>{source.next}</p></div></div> : <div><p className="text-sm leading-6">{selectedDetail?.implication}</p><p className="mt-3 text-xs text-muted-foreground">Udvalgte eksempler, ikke alle debriefs i temaet.</p><div className="divide-y">{employeeThemeSources.filter(item => item.themeId === selected).map(item => <div key={item.id} className="py-4"><p className="text-sm font-semibold">{item.speaker} · {item.organization}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(`${item.date}T12:00:00`).toLocaleDateString("da-DK")} kl. {item.time} · Noteret af User</p><p className="mt-2 text-sm leading-6">“{item.quote}”</p><Button className="mt-3" variant="outline" size="sm" onClick={() => setSource(item)}>Se debrief</Button></div>)}</div></div>}<p className="text-xs text-muted-foreground">Fiktivt demo-eksempel · Dose 1 er et opdigtet lægemiddel.</p></DialogContent></Dialog>
  </>;
}
