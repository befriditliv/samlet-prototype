import { CalendarDays } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { periodOptions, type PeriodKey } from "@/data/managerDemo";

type Props = { value: PeriodKey; onChange: (value: PeriodKey) => void; range: string; incomplete?: boolean };

export const ManagerPeriodControl = ({ value, onChange, range, incomplete = false }: Props) => (
  <div className="flex flex-col items-start gap-1 sm:items-end">
    <div className="flex items-center gap-2">
      <CalendarDays className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={(next) => onChange(next as PeriodKey)}>
        <SelectTrigger className="h-9 w-44 bg-background"><SelectValue /></SelectTrigger>
        <SelectContent>{periodOptions.map((item) => <SelectItem key={item.key} value={item.key}>{item.label}</SelectItem>)}</SelectContent>
      </Select>
    </div>
    <p className="text-xs text-muted-foreground">{range}{incomplete ? " · uafsluttet" : ""}</p>
  </div>
);