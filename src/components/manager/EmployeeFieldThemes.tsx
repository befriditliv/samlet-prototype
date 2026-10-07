import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { employeeThemeDetails, employeeThemeSources, themes, themeCoverage } from "@/data/managerDemo";

export function EmployeeFieldThemes({ partial, unfinished }: { partial: boolean; unfinished: boolean }) {
  const [source, setSource] = useState<typeof employeeThemeSources[number] | null>(null);
  return <>
    <p className="text-sm text-muted-foreground">{partial ? "18 af 78" : `${themeCoverage.analyzed} af ${themeCoverage.completed}`} debriefs analyseret · {partial ? 56 : themeCoverage.pending} afventer · 4 kunne ikke analyseres</p>
    <Accordion type="multiple" className="overflow-hidden rounded-lg border bg-card">
      {themes.map(theme => {
        const detail = employeeThemeDetails.find(item => item.themeId === theme.id);
        const sources = employeeThemeSources.filter(item => item.themeId === theme.id);
        const count = partial ? Math.max(1, Math.round(theme.count * 18 / 60)) : theme.count;
        return <AccordionItem value={theme.id} key={theme.id} className="px-5 last:border-0"><AccordionTrigger className="gap-4 py-4 text-left hover:no-underline"><div className="grid flex-1 gap-3 sm:grid-cols-[1fr_160px]"><div><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{theme.label}</p><Badge variant="outline">{detail?.kind}</Badge></div><p className="mt-1 text-sm font-normal leading-5 text-muted-foreground">{detail?.summary}</p></div><div className="text-sm"><p className="font-semibold">{count} af {partial ? 18 : 60} debriefs</p><p className="mt-1 text-xs font-normal text-muted-foreground">{theme.hcps} HCP'er · {theme.hcos} HCO'er</p><p className="mt-1 text-xs font-normal text-muted-foreground">{partial || unfinished ? "Ændring kan ikke vurderes" : theme.change ? `${theme.change.replace("pp", "procentpoint")} i andel` : "Intet sammenligneligt grundlag"}</p></div></div></AccordionTrigger>
          <AccordionContent><div className="border-t pt-4"><p className="text-sm leading-6"><strong>Hvad peger noterne på?</strong> {detail?.implication}</p><p className="mb-3 mt-3 text-xs text-muted-foreground">Udvalgte fiktive kilder · uddrag af noter, ikke lydoptagelser. Kilderne nedenfor er ikke alle {count} debriefs.</p><div className="divide-y">{sources.map(item => <div key={item.id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto]"><div><p className="text-sm font-semibold">{item.speaker} · {item.organization}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(`${item.date}T12:00:00`).toLocaleDateString("da-DK")} kl. {item.time} · Noteret af User</p><p className="mt-2 text-sm leading-6">“{item.quote}”</p></div><Button variant="outline" size="sm" onClick={() => setSource(item)}>Se debrief</Button></div>)}</div></div></AccordionContent>
        </AccordionItem>;
      })}
    </Accordion>
    <p className="text-xs text-muted-foreground">En debrief kan indgå i flere temaer. Temaerne er observationer i noterne, ikke konklusioner om behandlingsvalg.</p>
    <Dialog open={source !== null} onOpenChange={open => !open && setSource(null)}><DialogContent className="max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>{source?.speaker} · {source?.organization}</DialogTitle><DialogDescription>{source?.date} kl. {source?.time} · Noteret af User · {source?.id}</DialogDescription></DialogHeader><div className="space-y-4 text-sm leading-6"><p>{source?.note}</p><div className="border-t pt-4"><h4 className="font-semibold">Næste skridt</h4><p>{source?.next}</p></div><p className="text-xs text-muted-foreground">Fiktivt demo-eksempel · Dose 1 er et opdigtet lægemiddel.</p></div></DialogContent></Dialog>
  </>;
}