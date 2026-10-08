import { CalendarCog } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { type TeamMember } from "@/data/managerDemo";
import { ErrorBlock } from "./StateBlocks";
import { useManagerSectionState } from "./ManagerSection";
export function EmployeeCalendarChanges({ member, noActivity, loadError, onRetry }: { member: TeamMember; noActivity: boolean; loadError: boolean; onRetry: () => void }) {
 const cal = noActivity ? { deleted: 0, cancelled: 0, rebooked: 0 } : member.calendar;
 const { open, setOpen } = useManagerSectionState("calendar");
 return <section><Accordion type="single" collapsible value={open ? "calendar" : ""} onValueChange={value => setOpen(value === "calendar")}><AccordionItem value="calendar" className="border-b"><AccordionTrigger className="text-left hover:no-underline"><div><p className="flex items-center gap-3 text-sm font-semibold"><CalendarCog className="h-5 w-5 text-primary" />Kalenderændringer</p><p className="mt-1 text-xs font-normal text-muted-foreground">{cal.deleted} slettede · {cal.cancelled} aflyste · {cal.rebooked} ombookede</p></div></AccordionTrigger><AccordionContent>{loadError ? <ErrorBlock label="Kalenderændringer" onRetry={onRetry} /> : <><div className="grid gap-4 sm:grid-cols-3">{([["Slettede", cal.deleted], ["Aflyste", cal.cancelled], ["Ombookede", cal.rebooked]] as const).map(([label, count]) => <div key={label} className="border-l-2 border-border pl-3"><p className="text-sm text-muted-foreground">{label}</p><p className="text-xl font-semibold">{count}</p></div>)}</div><p className="mt-4 text-xs text-muted-foreground">Kalenderposter i den valgte periode, ikke gennemførte kontakter. Fiktiv kalenderlog.</p></>}</AccordionContent></AccordionItem></Accordion></section>;
}
