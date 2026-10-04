import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Load failure: solid red frame + warning icon. Must never look like an empty (zero) state. */
export const ErrorBlock = ({ label, onRetry, compact }: { label: string; onRetry: () => void; compact?: boolean }) => (
  <div role="alert" className={`flex items-center gap-3 rounded-lg border-2 border-destructive/60 bg-destructive/10 ${compact ? "p-3" : "p-5"}`}>
    <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
    <div className="flex-1"><p className="text-sm font-semibold text-destructive">Kunne ikke hente</p><p className="text-xs text-muted-foreground">{label} · intet tal er erstattet med 0</p></div>
    <Button size="sm" variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); onRetry(); }}><RotateCw className="mr-1 h-3.5 w-3.5" />Prøv igen</Button>
  </div>
);
