import { CalendarDays, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { employeePlanGoals, employeeCalendarBreakdown, employeePlanSnapshot as snapshot, upcoming28, fmt, type TeamMember } from "@/data/managerDemo";
import { projectPlanPace, summarizePlan } from "@/data/employeePlanning";
import { ErrorBlock } from "@/components/manager/StateBlocks";

type Props = { member: TeamMember; noActivity: boolean; noPlan: boolean; loadError: boolean; onRetry: () => void };

export const EmployeeActivityPanels = ({ member, noActivity, noPlan, loadError, onRetry }: Props) => {
  const plan = member.plan;
  const done = noActivity ? 0 : plan?.done ?? 0;
  const outlook = member.slug === "christian" && !noActivity ? summarizePlan(employeePlanGoals) : null;
  // Completed plan progress and calendar bookings must share the snapshot before projecting.
  const forecast = outlook && plan && !noPlan ? projectPlanPace(snapshot.done, snapshot.target, outlook.booked, snapshot.windowDays, snapshot.remainingDays) : null;
  const completionDate = forecast?.daysToTarget !== null && forecast?.daysToTarget !== undefined ? new Date(Date.parse(`${snapshot.date}T12:00:00Z`) + forecast.daysToTarget * 86400000).toLocaleDateString("da-DK", { day: "numeric", month: "long" }) : null;
  return <section className="space-y-3">
    <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-lg font-bold">Kontaktplan og kommende møder</h3><span className="text-xs text-muted-foreground">Plan: 1. jul – 31. dec 2026 · Status 7. okt</span></div>
    {loadError ? <ErrorBlock label="Kontaktplaner og kommende møder" onRetry={onRetry} /> : <>
      <div className="grid gap-6 border-y py-5 md:grid-cols-[1fr_1.2fr]">
        <div><p className="text-sm font-medium text-muted-foreground">Gennemført mod planen</p>{noPlan || !plan ? <p className="mt-3 text-sm text-muted-foreground">Ingen kontaktplan tilgængelig.</p> : <><p className="mt-2 text-3xl font-bold">{done}<span className="text-lg font-normal text-muted-foreground"> / {plan.planned} besøg</span></p><Progress value={done / plan.planned * 100} className="mt-3 h-2" /><p className="mt-2 text-sm text-muted-foreground">{Math.round(done / plan.planned * 100)} % gennemført · {plan.planned - done} besøg tilbage</p><p className="mt-2 text-xs text-muted-foreground">{plan.customers} kunder med mål · kun fysiske besøg · {plan.excluded} ugyldige eller overlappende mål udeladt</p></>}</div>
        <div><p className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><CalendarDays className="h-4 w-4" />Kommende 28 dage · hele porteføljen</p>{outlook ? <><p className="mt-2 text-3xl font-bold">{upcoming28.meetings}<span className="text-lg font-normal text-muted-foreground"> møder · {upcoming28.customers} kunder</span></p><div className="mt-3 grid grid-cols-5 divide-x border-y py-2">{upcoming28.weeks.map(([week, count]) => <div key={week} className="text-center"><p className="text-xs text-muted-foreground">{week}</p><p className="mt-1 text-lg font-semibold">{count}</p></div>)}</div><p className="mt-2 text-xs text-muted-foreground">7. okt – 4. nov · kalenderstatus pr. 7. oktober</p></> : <p className="mt-3 text-sm text-muted-foreground">Kommende møder er ikke forberedt for denne medarbejder i demoen.</p>}</div>
      </div>
      {forecast && outlook && <div className="grid gap-5 rounded-lg border border-primary/20 bg-secondary/40 p-5 md:grid-cols-[180px_1fr]">
        <div><p className="text-xs font-medium text-muted-foreground">Fremskrevet planopfyldelse</p><p className="mt-2 text-4xl font-bold text-primary">{forecast.percent} %</p><p className="mt-1 text-sm font-medium">{forecast.projected} af {snapshot.target} ved årets udgang</p><p className="mt-2 text-xs text-muted-foreground">Beregnet — ikke booket</p></div>
        <div><h4 className="flex items-center gap-2 font-semibold"><TrendingUp className="h-4 w-4 text-primary" />{forecast.shortfall ? "Det nuværende tempo er ikke nok" : "Planen kan nås med det nuværende tempo"}</h4><p className="mt-2 text-sm leading-6">Af de {upcoming28.meetings} møder i de næste {snapshot.windowDays} dage er {outlook.booked} fysiske besøg hos kunder med et åbent mål. Det svarer til {fmt(forecast.dailyPace * 7)} målrettede besøg om ugen. Der kræves {fmt(outlook.remaining / snapshot.remainingDays * 7)} om ugen for at nå de sidste {outlook.remaining} inden 31. december.</p><p className="mt-2 text-sm leading-6">{forecast.shortfall ? `Fortsætter tempoet, mangler ${forecast.shortfall} besøg ved fristen.` : `Fortsætter tempoet, kan planen nås omkring ${completionDate}.`} Det forudsætter, at besøgene gennemføres, og at nye bookinger fordeles på kunder med resterende mål.</p><p className="mt-3 border-t border-primary/20 pt-3 text-xs leading-5 text-muted-foreground">Beregning: {snapshot.done} gennemført + ({outlook.booked} ÷ {snapshot.windowDays} dage × {snapshot.remainingDays} dage til fristen), højst {snapshot.target}. Kun {outlook.booked} besøg er faktisk booket mod åbne mål; {employeeCalendarBreakdown.physicalWithoutRemainingGoal} øvrige fysiske og {employeeCalendarBreakdown.virtual} virtuelle møder indgår ikke. Fiktiv prognose på kalenderdage — tager ikke højde for ferie eller aflysninger.</p></div>
      </div>}
    </>}
  </section>;
};
