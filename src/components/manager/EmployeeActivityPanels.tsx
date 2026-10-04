import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import type { TeamMember } from "@/data/managerDemo";
import { ErrorBlock } from "@/components/manager/StateBlocks";

type Props = { member: TeamMember; noActivity: boolean; noPlan: boolean; loadError: boolean; onRetry: () => void };

export const EmployeeActivityPanels = ({ member, noActivity, noPlan, loadError, onRetry }: Props) => {
  const plan = member.plan;
  const done = noActivity ? 0 : plan?.done ?? 0;
  const progress = plan?.planned ? Math.round((done / plan.planned) * 100) : 0;
  const cal = noActivity ? { deleted: 0, cancelled: 0, rebooked: 0 } : member.calendar;
  return <>
    <section className="space-y-3">
      <h3 className="text-xl font-bold">Fremdrift mod kontaktplaner</h3>
      {loadError ? <ErrorBlock label="Kontaktplaner" onRetry={onRetry} /> : noPlan || !plan ? (
        <Card className="border border-dashed bg-muted/20 p-6 shadow-none"><p className="font-medium">Ingen kontaktplan tilgængelig</p><p className="mt-1 text-sm text-muted-foreground">Der er ikke registreret en kontaktplan for medarbejderen i perioden.</p></Card>
      ) : (
        <Card className="border-0 p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-3xl font-bold">{done} / {plan.planned}</p><p className="mt-1 text-sm">Planlagte besøg gennemført · {progress} %</p></div><p className="text-sm text-muted-foreground">{plan.customers} kunder med mål · 1. jul – 31. dec 2026</p></div>
          <div className="mt-4 h-1.5 rounded-full bg-muted"><div className="h-1.5 rounded-full bg-primary" style={{ width: `${Math.min(100, progress)}%` }} /></div>
          <p className="mt-3 text-xs text-muted-foreground">Kun fysiske besøg · {plan.excluded} ugyldige eller overlappende mål udeladt · Demo-data</p>
        </Card>
      )}
    </section>
    <section>
      <Accordion type="single" collapsible><AccordionItem value="calendar" className="rounded-md border bg-card px-5 shadow-sm">
        <AccordionTrigger className="text-left hover:no-underline"><div><p className="font-semibold">Kalenderændringer · {cal.deleted} slettede · {cal.cancelled} aflyste · {cal.rebooked} ombookede</p><p className="mt-1 text-xs font-normal text-muted-foreground">Kalenderposter, ikke registrerede medarbejderkontakter. Tallene må ikke lægges til kontakt-KPI'en.</p></div></AccordionTrigger>
        <AccordionContent><div className="grid gap-4 sm:grid-cols-3">{([["Slettede", cal.deleted], ["Aflyste", cal.cancelled], ["Ombookede", cal.rebooked]] as const).map(([label, count]) => <div key={label} className="border-l-2 border-border pl-3"><p className="text-sm text-muted-foreground">{label}</p><p className="text-xl font-semibold">{count}</p></div>)}</div><p className="mt-4 text-xs text-muted-foreground">Demo-kalenderlog</p></AccordionContent>
      </AccordionItem></Accordion>
    </section>
  </>;
};
