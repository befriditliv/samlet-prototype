import { CalendarCog } from "lucide-react";
import { type TeamMember } from "@/data/managerDemo";
import { ErrorBlock } from "./StateBlocks";
import { ManagerSection, ManagerSectionTitle } from "./ManagerSection";
export function EmployeeCalendarChanges({ member, noActivity, loadError, onRetry }: { member: TeamMember; noActivity: boolean; loadError: boolean; onRetry: () => void }) {
 const cal = noActivity ? { deleted: 0, cancelled: 0, rebooked: 0 } : member.calendar;
 return <ManagerSection id="calendar" title="Kalenderændringer" header={<div><div className="flex items-start gap-3"><CalendarCog className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><ManagerSectionTitle>Kalenderændringer</ManagerSectionTitle></div><p className="mt-1 text-sm text-muted-foreground">{cal.deleted} slettede · {cal.cancelled} aflyste · {cal.rebooked} ombookede</p></div>}>
   {loadError ? <ErrorBlock label="Kalenderændringer" onRetry={onRetry} /> : <><div className="grid grid-cols-3 gap-3">{([["Slettede", cal.deleted], ["Aflyste", cal.cancelled], ["Ombookede", cal.rebooked]] as const).map(([label, count]) => <div key={label} className="rounded-lg border bg-card p-3 sm:p-4"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-2 text-xl font-bold tabular-nums">{count}</p></div>)}</div><p className="text-xs text-muted-foreground">Kalenderposter i den valgte periode, ikke gennemførte kontakter. Fiktiv kalenderlog.</p></>}
 </ManagerSection>;
}
