import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { employeeActivity } from "@/data/managerDemo";

export const EmployeeActivityPanels = ({ slug, noData }: { slug: string; noData: boolean }) => {
  const data = employeeActivity[slug] ?? employeeActivity.christian;
  if (noData) return <p className="text-sm text-muted-foreground">No contact-plan or calendar-change data for this demo scenario.</p>;
  const { plan, meetings } = data;
  const progress = plan.planned ? Math.round(plan.done / plan.planned * 100) : 0;
  return <>
    <section className="space-y-3">
      <h3 className="text-xl font-bold">Contact-plan progress</h3>
      <Card className="border-0 p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-3xl font-bold">{plan.done} / {plan.planned}</p><p className="mt-1 text-sm">Planned visits completed · {progress}%</p></div><p className="text-sm text-muted-foreground">{plan.customers} customers with targets · {plan.period}</p></div>
        <div className="mt-4 h-1.5 rounded-full bg-muted"><div className="h-1.5 rounded-full bg-primary" style={{ width: `${Math.min(100, progress)}%` }} /></div>
        <p className="mt-3 text-xs text-muted-foreground">Physical visits only · {plan.excluded} invalid or overlapping targets excluded · Demo data</p>
      </Card>
    </section>
    <section className="space-y-2">
      <Accordion type="single" collapsible><AccordionItem value="calendar" className="rounded-md border bg-card px-5 shadow-sm"><AccordionTrigger className="text-left font-semibold">Calendar changes</AccordionTrigger><AccordionContent><p className="mb-4 text-sm text-muted-foreground">Deleted, cancelled and rebooked entries are calendar events, not registered employee contacts. These counts must not be added to the contact KPI.</p><div className="grid gap-4 sm:grid-cols-3">{[["Deleted", meetings.deleted], ["Cancelled", meetings.cancelled], ["Rebooked", meetings.rebooked]].map(([label, count]) => <div key={label} className="border-l-2 border-border pl-3"><p className="text-sm text-muted-foreground">{label}</p><p className="text-xl font-semibold">{count}</p></div>)}</div><p className="mt-4 text-xs text-muted-foreground">{meetings.futureDeleted} deleted entries had a future date · Demo calendar log</p></AccordionContent></AccordionItem></Accordion>
    </section>
  </>;
};