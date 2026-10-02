import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ManagerPeriodControl } from "@/components/manager/ManagerPeriodControl";
import { teamMembers, type PeriodKey } from "@/data/managerDemo";

type Props = {
  period: PeriodKey;
  onPeriodChange: (value: PeriodKey) => void;
  range: string;
  employee?: string;
  onEmployeeChange?: (value: string) => void;
  incomplete?: boolean;
};

export const ManagerFilters = ({ period, onPeriodChange, range, employee = "all", onEmployeeChange, incomplete }: Props) => (
  <div className="grid gap-3 rounded-md border bg-card p-4 sm:grid-cols-2 xl:grid-cols-4">
    <div><p className="mb-1 text-xs font-medium text-muted-foreground">Periode</p><ManagerPeriodControl value={period} onChange={onPeriodChange} range={range} incomplete={incomplete} /></div>
    <div><p className="mb-1 text-xs font-medium text-muted-foreground">Medarbejder</p><Select value={employee} onValueChange={(value) => onEmployeeChange?.(value)}><SelectTrigger className="bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Alle medarbejdere</SelectItem>{teamMembers.map((item) => <SelectItem key={item.slug} value={item.slug}>{item.name}</SelectItem>)}</SelectContent></Select></div>
    <div><p className="mb-1 text-xs font-medium text-muted-foreground">Distrikt</p><Select defaultValue="all"><SelectTrigger className="bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Alle distrikter</SelectItem><SelectItem value="nordbro">Nordbro</SelectItem><SelectItem value="vestbro">Vestbro</SelectItem><SelectItem value="ronnevang">Rønnevang</SelectItem><SelectItem value="soholm">Søholm</SelectItem></SelectContent></Select></div>
    <div><p className="mb-1 text-xs font-medium text-muted-foreground">Terapiområde</p><Select defaultValue="appendicitis"><SelectTrigger className="bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="appendicitis">Appendicitis</SelectItem></SelectContent></Select></div>
  </div>
);