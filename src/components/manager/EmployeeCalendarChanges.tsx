import { CalendarCog } from "lucide-react";
import { type TeamMember } from "@/data/managerDemo";
import { ErrorBlock } from "./StateBlocks";
import { ManagerSection, ManagerSectionTitle } from "./ManagerSection";
export function EmployeeCalendarChanges({ member, range, noActivity, loadError, onRetry }: { member: TeamMember; range: string; noActivity: boolean; loadError: boolean; onRetry: () => void }) {
 const cal = noActivity ? { deleted: 0, cancelled: 0, rebooked: 0 } : member.calendar;
 return <ManagerSection id="calendar" title="Kalenderændringer" header={<div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-start gap-3"><CalendarCog className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><ManagerSectionTitle>Kalenderændringer</ManagerSectionTitle><p className="mt-1 text-sm text-muted-foreground">Kalenderposter i den valgte periode · ikke gennemførte kontakter</p></div></div><span className="text-sm text-muted-foreground">{range}</span></div>}>
   {loadError ? <ErrorBlock label="Kalenderændringer" onRetry={onRetry} /> : <><div className="grid grid-cols-3 gap-3">{([["Slettede møder", cal.deleted], ["Aflyste møder", cal.cancelled], ["Ombookede møder", cal.rebooked]] as const).map(([label, count]) => <div key={label} className="rounded-lg border bg-card p-3 sm:p-4"><p className="text-xs font-semibold">{label}</p><p className="mt-2 text-xl font-bold tabular-nums">{count}</p></div>)}</div><p className="text-xs leading-5 text-muted-foreground">Optællingen omfatter hele den valgte periode, både afholdte og fremtidige møder; tallene er derfor ikke en del af kontakt-KPI'erne. Fiktiv kalenderlog.</p></>}
 </ManagerSection>;
}
