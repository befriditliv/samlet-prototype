import { employeeQualityNarrative, employeeQualityReview as review, fmt, type TeamMember } from "@/data/managerDemo";
import { ErrorBlock } from "./StateBlocks";
import { useState } from "react";
import { BookOpen, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { ManagerSection, ManagerSectionTitle } from "./ManagerSection";
import { SourceQuality } from "./SourceQuality";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function EmployeeQuality({ member, unavailable, error, unfinished, onRetry }: { member: TeamMember; unavailable: boolean; error: boolean; unfinished: boolean; onRetry: () => void }) {
  const detailed = member.slug === review.employeeSlug;
  const [source, setSource] = useState<typeof review.examples[number] | null>(null);
  return <ManagerSection id="employee-quality" title="Kvalitet i debriefs" header={<div className="flex items-center gap-3"><ClipboardCheck className="h-5 w-5 text-primary" /><ManagerSectionTitle>Kvalitet i debriefs</ManagerSectionTitle></div>}>
    <div className="manager-band grid divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0"><div className="p-4 sm:p-5">
    {error ? <ErrorBlock label="Debriefkvalitet" onRetry={onRetry} /> : unavailable || member.quality === null ? <p className="text-sm text-muted-foreground">Ingen vurderede debriefs i perioden.</p> : <p className="max-w-4xl text-sm leading-7 text-muted-foreground">{detailed ? employeeQualityNarrative : `De ${member.qualityN} vurderede debriefs har et gennemsnit på ${fmt(member.quality)} ud af 10. Der foreligger endnu ikke en tekstvurdering af noternes indhold for denne medarbejder.`} {detailed && !unfinished ? "Gennemsnittet er steget fra 7,2 i de forrige 30 dage til 7,7 nu; perioderne omfatter henholdsvis 58 og 64 vurderede noter." : unfinished ? "Der vises ikke en trend for en uafsluttet periode." : "Der er ikke en sammenlignelig tidligere vurdering."}</p>}
    </div><div className="p-4 sm:p-5">{detailed && !error && !unavailable ? <SourceQuality scope="employee" compact /> : <p className="text-xs text-muted-foreground">Ingen kildevurdering tilgængelig.</p>}</div></div>
    {detailed && !error && !unavailable && <Accordion type="single" collapsible className="border-y bg-card px-4"><AccordionItem value="quality-examples" className="border-0"><AccordionTrigger className="text-xs">Se eksempler på vurderinger</AccordionTrigger><AccordionContent><div className="divide-y">{review.examples.map((example, index) => <div key={example.id} className="space-y-2 py-3"><div className="flex flex-wrap items-baseline justify-between gap-2"><p className="text-xs font-semibold">{example.customer}</p><span className="text-xs text-muted-foreground">{example.date}</span></div><blockquote className="border-l-2 border-primary/30 pl-3 text-xs leading-5">{example.note}</blockquote><p className="text-xs leading-5 text-muted-foreground">{example.assessment}</p><Button variant="outline" size="sm" onClick={() => setSource(example)}><BookOpen className="h-3.5 w-3.5" />Kildeeksempel {index + 1}</Button></div>)}</div></AccordionContent></AccordionItem></Accordion>}
    <Dialog open={source !== null} onOpenChange={open => { if (!open) setSource(null); }}><DialogContent><DialogHeader><DialogTitle>Debrief · {source?.id}</DialogTitle><DialogDescription>{source?.customer} · {source?.date} · Noteret af User</DialogDescription></DialogHeader><blockquote className="border-l-2 border-primary/30 pl-4 text-sm leading-6">{source?.note}</blockquote><p className="text-sm leading-6 text-muted-foreground">{source?.assessment}</p><p className="text-xs text-muted-foreground">Fiktivt kildeeksempel · vurdering af dokumentationen.</p></DialogContent></Dialog>
  </ManagerSection>;
}
