import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { employeePlanGoals, employeeCalendarBreakdown, upcoming28, type TeamMember } from "@/data/managerDemo";
import { summarizePlan } from "@/data/employeePlanning";
import { ErrorBlock } from "@/components/manager/StateBlocks";

type Props = { member: TeamMember; noActivity: boolean; noPlan: boolean; loadError: boolean; onRetry: () => void };

export const EmployeeActivityPanels = ({ member, noActivity, noPlan, loadError, onRetry }: Props) => {
  const plan = member.plan;
  const done = noActivity ? 0 : plan?.done ?? 0;
  const progress = plan?.planned ? Math.round((done / plan.planned) * 100) : 0;
  const cal = noActivity ? { deleted: 0, cancelled: 0, rebooked: 0 } : member.calendar;
  const outlook = member.slug === "christian" ? summarizePlan(employeePlanGoals) : null;
  return <>
    <section className="space-y-3">
      <h3 className="text-lg font-bold">Kontaktplan og kommende møder</h3>
      {loadError ? <ErrorBlock label="Kontaktplaner og kommende møder" onRetry={onRetry} /> : <div className="rounded-lg border bg-card p-5">
        <div className="grid gap-6 md:grid-cols-2"><div><p className="text-sm font-semibold">Kontaktplan · 1. jul – 31. dec 2026</p>{noPlan || !plan ? <p className="mt-3 text-sm text-muted-foreground">Ingen kontaktplan tilgængelig.</p> : <><p className="mt-3 text-2xl font-bold">{done} / {plan.planned} <span className="text-sm font-normal text-muted-foreground">besøg gennemført</span></p><Progress value={progress} className="mt-3 h-2" /><p className="mt-2 text-xs text-muted-foreground">{progress} % gennemført · {plan.planned - done} besøg mangler · {plan.customers} kunder med mål</p><p className="mt-2 text-xs text-muted-foreground">Kun fysiske besøg · {plan.excluded} ugyldige eller overlappende mål udeladt</p></>}</div>
          <div><p className="text-sm font-semibold">Kommende 28 dage · hele porteføljen</p>{outlook ? <><p className="mt-3 text-2xl font-bold">{upcoming28.meetings} <span className="text-sm font-normal text-muted-foreground">møder hos {upcoming28.customers} forskellige kunder</span></p><p className="mt-1 text-xs text-muted-foreground">{upcoming28.range} · kalenderstatus pr. 7. oktober</p><div className="mt-3 grid grid-cols-5 divide-x rounded-md bg-muted/30 py-2">{upcoming28.weeks.map(([week, count]) => <div key={week} className="text-center"><p className="text-xs text-muted-foreground">{week}</p><p className="mt-1 text-lg font-semibold">{count}</p></div>)}</div></> : <p className="mt-3 text-sm text-muted-foreground">Kommende møder er ikke forberedt for denne medarbejder i demoen.</p>}</div></div>
        {outlook && !noPlan && plan && <div className="mt-5 border-t pt-4"><p className="text-sm font-semibold">Er der booket nok til at nå planen?</p><p className="mt-2 text-sm leading-6">{outlook.booked} af de {outlook.remaining} resterende besøg er booket hos kunder med et åbent mål. <strong>{outlook.unbooked} besøg mangler stadig at blive planlagt.</strong></p><p className="mt-1 text-xs leading-5 text-muted-foreground">Hvis de bookede besøg gennemføres, nås {done + outlook.booked} af {plan.planned}. De øvrige møder er {employeeCalendarBreakdown.physicalWithoutRemainingGoal} fysiske besøg uden et resterende mål og {employeeCalendarBreakdown.virtual} virtuelle møder; de lukker ikke de åbne mål.</p><Accordion type="single" collapsible><AccordionItem value="goals" className="border-0"><AccordionTrigger className="py-3 text-sm">Kunder med besøg, der endnu ikke er booket</AccordionTrigger><AccordionContent><div className="grid gap-x-6 sm:grid-cols-2">{employeePlanGoals.filter(goal => !goal.bookedPhysical).map(goal => <div className="flex justify-between border-b py-2 text-sm" key={goal.customer}><span>{goal.customer}</span><span className="text-muted-foreground">{goal.remaining} besøg mangler</span></div>)}</div><p className="mt-3 text-xs text-muted-foreground">Fiktive kundemål · status pr. 7. oktober · bookede besøg er ikke gennemførte besøg.</p></AccordionContent></AccordionItem></Accordion></div>}
      </div>}
    </section>
    <section>
      <Accordion type="single" collapsible><AccordionItem value="calendar" className="rounded-md border bg-card px-5 shadow-sm">
        <AccordionTrigger className="text-left hover:no-underline"><div><p className="font-semibold">Kalenderændringer · {cal.deleted} slettede · {cal.cancelled} aflyste · {cal.rebooked} ombookede</p><p className="mt-1 text-xs font-normal text-muted-foreground">Kalenderposter, ikke registrerede medarbejderkontakter. Tallene må ikke lægges til kontakt-KPI'en.</p></div></AccordionTrigger>
        <AccordionContent><div className="grid gap-4 sm:grid-cols-3">{([["Slettede", cal.deleted], ["Aflyste", cal.cancelled], ["Ombookede", cal.rebooked]] as const).map(([label, count]) => <div key={label} className="border-l-2 border-border pl-3"><p className="text-sm text-muted-foreground">{label}</p><p className="text-xl font-semibold">{count}</p></div>)}</div><p className="mt-4 text-xs text-muted-foreground">Demo-kalenderlog</p></AccordionContent>
      </AccordionItem></Accordion>
    </section>
  </>;
};
