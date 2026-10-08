import { CalendarDays } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { periodOptions, type PeriodKey } from "@/data/managerDemo";

type Props = { value: PeriodKey; onChange: (value: PeriodKey) => void };

export const ManagerPeriodControl = ({ value, onChange }: Props) => (
  <div className="flex items-center">
    <div className="flex items-center gap-2">
      <CalendarDays className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={(next) => onChange(next as PeriodKey)}>
        <SelectTrigger aria-label="Periode" className="h-11 w-36 bg-background"><SelectValue /></SelectTrigger>
        <SelectContent>{periodOptions.map((item) => <SelectItem key={item.key} value={item.key}>{item.label}</SelectItem>)}</SelectContent>
      </Select>
    </div>
  </div>
);
