import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fmt } from "@/data/managerDemo";
import { referenceSourceQuality } from "@/data/managerReference";

export function SourceQuality({ scope }: { scope: "homepage" | "employee" }) {
  const [selected, setSelected] = useState<typeof referenceSourceQuality.homepage[number] | null>(null);
  return <div className="space-y-3 border-t border-border/50 pt-4">
    <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-sm font-semibold">Debriefkvalitet efter kilde</h3><span className="text-xs text-muted-foreground">Illustrativt referenceeksempel · sidste 30 dage</span></div>
    <div className="grid gap-3 sm:grid-cols-3">{referenceSourceQuality[scope].map(row => <Button key={row.source} variant="ghost" onClick={() => setSelected(row)} className="h-auto items-start justify-between whitespace-normal rounded-lg border bg-card p-3 text-left"><div><p className="text-xs font-semibold">{row.source}</p><p className={`mt-2 ${row.score === null ? "text-sm font-normal text-muted-foreground" : "text-xl font-bold text-primary"}`}>{row.score === null ? "Ingen vurderede debriefs" : `${fmt(row.score)} / 10`}</p><p className="mt-1 text-xs font-normal text-muted-foreground">{row.assessed} vurderede debriefs</p></div><Info className="text-muted-foreground" /></Button>)}</div>
    <p className="text-xs leading-5 text-muted-foreground">Gennemsnit af de vurderede debriefs for hver kilde; debriefs uden en gyldig kilde vises særskilt. Tallene er fra referenceeksemplet og indgår ikke i demoens periodetal.</p>
    <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent><DialogHeader><DialogTitle>Debriefkvalitet · {selected?.source}</DialogTitle><DialogDescription>{scope === "homepage" ? "Teamoverblik" : "Medarbejderoversigt"} · illustrativt kildeeksempel fra den vedhæftede reference</DialogDescription></DialogHeader><p className="text-sm leading-6">{selected?.score === null ? "Ingen vurderede debriefs fra denne kilde i referenceeksemplet. Det er ikke en score på nul." : `${selected?.assessed} vurderede debriefs med et gennemsnit på ${selected ? fmt(selected.score ?? 0) : ""} ud af 10.`}</p><p className="text-xs leading-5 text-muted-foreground">Vurderingen handler om dokumentationen, ikke medarbejderen eller samtalen. Kildegrupperne har forskelligt datagrundlag og er ikke en effektmåling af Jarvis versus IO Engage. Detaljerede underliggende noter er ikke med i referenceeksemplet.</p></DialogContent></Dialog>
  </div>;
}