import { createContext, useContext, useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const SectionContext = createContext<{ closed: string[]; toggle: (id: string) => void } | null>(null);

export function ManagerSections({ ids, children, defaultClosed = [] }: { ids: string[]; children: ReactNode; defaultClosed?: string[] }) {
  const [closed, setClosed] = useState<string[]>(defaultClosed);
  return <SectionContext.Provider value={{ closed, toggle: id => setClosed(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]) }}>{children}</SectionContext.Provider>;
}

export function useManagerSectionState(id: string, defaultOpen = false) {
  const context = useContext(SectionContext);
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const open = context ? !context.closed.includes(id) : localOpen;
  return { open, setOpen: (value: boolean) => { if (context) { if (value !== open) context.toggle(id); } else setLocalOpen(value); } };
}

export function ManagerSection({ id, title, header, children, className = "" }: { id: string; title: string; header: ReactNode; children: ReactNode; className?: string }) {
  const context = useContext(SectionContext);
  const [localOpen, setLocalOpen] = useState(true);
  const contentId = useId();
  const open = context ? !context.closed.includes(id) : localOpen;
  return <Collapsible asChild open={open} onOpenChange={() => context ? context.toggle(id) : setLocalOpen(value => !value)}><section id={id} className={`space-y-3 scroll-mt-32 ${className}`}>
    <div className="flex items-start gap-2"><div className="min-w-0 flex-1">{header}</div><CollapsibleTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label={`${open ? "Fold ind" : "Fold ud"}: ${title}`} aria-controls={contentId} title={`${open ? "Fold ind" : "Fold ud"}: ${title}`}><ChevronDown className={`transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} /></Button></CollapsibleTrigger></div>
    <CollapsibleContent id={contentId} forceMount hidden={!open} className="space-y-3">{children}</CollapsibleContent>
  </section></Collapsible>;
}