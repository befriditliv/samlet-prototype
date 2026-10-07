import { employeeQualityNarrative, employeeQualityReview as review, fmt, type TeamMember } from "@/data/managerDemo";
import { ErrorBlock } from "./StateBlocks";

export function EmployeeQuality({ member, unavailable, error, unfinished, onRetry }: { member: TeamMember; unavailable: boolean; error: boolean; unfinished: boolean; onRetry: () => void }) {
  const detailed = member.slug === review.employeeSlug;
  return <section className="space-y-3">
    <h3 className="text-lg font-bold">Kvalitet i debriefs</h3>
    {error ? <ErrorBlock label="Debriefkvalitet" onRetry={onRetry} /> : unavailable || member.quality === null ? <p className="text-sm text-muted-foreground">Ingen vurderede debriefs i perioden.</p> : <p className="max-w-4xl text-sm leading-7 text-muted-foreground">{detailed ? employeeQualityNarrative : `De ${member.qualityN} vurderede debriefs har et gennemsnit på ${fmt(member.quality)} ud af 10. Der foreligger endnu ikke en tekstvurdering af noternes indhold for denne medarbejder.`} {detailed && !unfinished ? "Gennemsnittet er steget fra 7,2 i de forrige 30 dage til 7,7 nu; perioderne omfatter henholdsvis 58 og 64 vurderede noter." : unfinished ? "Der vises ikke en trend for en uafsluttet periode." : "Der er ikke en sammenlignelig tidligere vurdering."}</p>}
  </section>;
}
