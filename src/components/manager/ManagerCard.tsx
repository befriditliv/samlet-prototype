import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

/** Shared frame for the manager's metric and signal cards: identical radius,
 *  border, padding, hover cue and footer divider so both groups read as one family. */
export const managerCardShell = "h-auto w-full items-stretch whitespace-normal rounded-lg border bg-card p-4 text-left font-normal shadow-none transition-colors hover:bg-primary/5";

/** Title line used by every manager card: same size and weight everywhere. */
export const managerCardTitle = "text-xs font-semibold";

/** Supporting line: muted, same measure in every card. */
export const managerCardNote = "text-xs leading-5 text-muted-foreground";

/** Footer pinned to the bottom edge so dividers line up across a row of cards. */
export const managerCardFooter = "mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-2";

export const ManagerCard = ({ onClick, children, chevron = false, className = "" }: { onClick: () => void; children: ReactNode; chevron?: boolean; className?: string }) => (
  <Button variant="ghost" onClick={onClick} className={`${managerCardShell} ${className}`}>
    <span className="flex min-w-0 flex-1 flex-col">{children}</span>
    {chevron ? <ChevronRight className="h-3.5 w-3.5 shrink-0 self-start text-muted-foreground" aria-hidden="true" /> : null}
  </Button>
);
