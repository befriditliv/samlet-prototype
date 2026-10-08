import { employeeQualityNarrative, employeeQualityReview as review, fmt, type TeamMember } from "@/data/managerDemo";
import { ErrorBlock } from "./StateBlocks";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function EmployeeQuality({ member, unavailable, error, unfinished, onRetry }: { member: TeamMember; unavailable: boolean; error: boolean; unfinished: boolean; onRetry: () => void }) {
  const detailed = member.slug === review.employeeSlug;
  const [source, setSource] = useState<typeof review.examples[number] | null>(null);
  return <section className="space-y-3">
    <h3 className="text-lg font-bold">Kvalitet i debriefs</h3>
    {error ? <ErrorBlock label="Debriefkvalitet" onRetry={onRetry} /> : unavailable || member.quality === null ? <p className="text-sm text-muted-foreground">Ingen vurderede debriefs i perioden.</p> : <p className="max-w-4xl text-sm leading-7 text-muted-foreground">{detailed ? employeeQualityNarrative : `De ${member.qualityN} vurderede debriefs har et gennemsnit på ${fmt(member.quality)} ud af 10. Der foreligger endnu ikke en tekstvurdering af noternes indhold for denne medarbejder.`} {detailed && !unfinished ? "Gennemsnittet er steget fra 7,2 i de forrige 30 dage til 7,7 nu; perioderne omfatter henholdsvis 58 og 64 vurderede noter." : unfinished ? "Der vises ikke en trend for en uafsluttet periode." : "Der er ikke en sammenlignelig tidligere vurdering."}</p>}
    {detailed && !error && !unavailable && <div className="flex flex-wrap gap-2">{review.examples.map((example, index) => <Button key={example.id} variant="outline" size="sm" onClick={() => setSource(example)}><BookOpen className="h-3.5 w-3.5" />Kildeeksempel {index + 1}<span className="text-xs text-muted-foreground">· {example.date}</span></Button>)}</div>}
    <Dialog open={source !== null} onOpenChange={open => { if (!open) setSource(null); }}><DialogContent><DialogHeader><DialogTitle>Debrief · {source?.id}</DialogTitle><DialogDescription>{source?.customer} · {source?.date} · Noteret af User</DialogDescription></DialogHeader><blockquote className="border-l-2 border-primary/30 pl-4 text-sm leading-6">{source?.note}</blockquote><p className="text-sm leading-6 text-muted-foreground">{source?.assessment}</p><p className="text-xs text-muted-foreground">Fiktivt kildeeksempel · vurdering af dokumentationen.</p></DialogContent></Dialog>
  </section>;
}
