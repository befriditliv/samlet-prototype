import { ArrowUpRight, CheckCircle2, MessageSquareText } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { employeeQualityReview as review, fmt, type TeamMember } from "@/data/managerDemo";
import { ErrorBlock } from "./StateBlocks";

export function EmployeeQuality({ member, unavailable, error, unfinished, onRetry }: { member: TeamMember; unavailable: boolean; error: boolean; unfinished: boolean; onRetry: () => void }) {
  const detailed = member.slug === review.employeeSlug;
  return <section className="space-y-3">
    <h3 className="text-lg font-bold">Kvalitet i debriefs</h3>
    {error ? <ErrorBlock label="Debriefkvalitet" onRetry={onRetry} /> : unavailable || member.quality === null ? <p className="text-sm text-muted-foreground">Ingen vurderede debriefs i perioden.</p> : <div className="rounded-lg border bg-card p-5">
      <div className="grid gap-5 md:grid-cols-[180px_1fr_1fr]">
        <div><p className="text-2xl font-bold">{fmt(member.quality)} <span className="text-sm font-normal text-muted-foreground">/ 10</span></p><p className="mt-1 text-xs text-muted-foreground">{member.qualityN} vurderede debriefs</p>{detailed && !unfinished ? <><p className="mt-3 flex items-center gap-1 text-sm font-semibold text-success"><ArrowUpRight className="h-4 w-4" />Stigende · +0,5 point</p><p className="mt-1 text-xs text-muted-foreground">Fra 7,2 i forrige 30 dage<br />{review.previous.assessed} vurderede debriefs</p></> : <p className="mt-3 text-xs text-muted-foreground">{unfinished ? "Trend vises ikke i en uafsluttet periode." : "Ingen sammenlignelig tidligere vurdering."}</p>}</div>
        {detailed ? <><div><p className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="h-4 w-4 text-primary" />Det er godt dokumenteret</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{review.strength}</p></div><div><p className="flex items-center gap-2 text-sm font-semibold"><MessageSquareText className="h-4 w-4 text-primary" />Det mangler i nogle noter</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{review.improvement}</p></div></> : <p className="text-sm text-muted-foreground md:col-span-2">Scoren er tilgængelig, men der er endnu ingen konkrete vurderingseksempler for denne medarbejder.</p>}
      </div>
      <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">Vurderer noternes dokumentation — ikke medarbejderens eller samtalens kvalitet. Fiktive demo-vurderinger.</p>
      {detailed && <Accordion type="single" collapsible><AccordionItem value="quality" className="border-0"><AccordionTrigger className="py-3 text-sm">Hvorfor denne score? Se eksempler</AccordionTrigger><AccordionContent><p className="mb-4 text-sm leading-6 text-muted-foreground">{review.explanation}</p><div className="grid gap-5 sm:grid-cols-2">{review.examples.map(example => <div key={example.id} className="border-l-2 border-primary/30 pl-4"><p className="text-xs text-muted-foreground">{example.date} · {example.customer}</p><p className="mt-2 text-sm leading-6">“{example.note}”</p><p className="mt-2 text-sm font-medium">{example.assessment}</p><p className="mt-2 text-xs text-muted-foreground">{example.id} · Noteret af User</p></div>)}</div><p className="mt-4 text-xs text-muted-foreground">K4 · Udvalgte eksempler, ikke alle {member.qualityN} vurderede noter.</p></AccordionContent></AccordionItem></Accordion>}
    </div>}
  </section>;
}