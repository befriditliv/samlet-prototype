import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import jarvisLogo from "@/assets/jarvis-logo.svg";

interface AppHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  onBack?: () => void;
  right?: ReactNode;
  children?: ReactNode;
}

/**
 * Unified premium header used across every /app page so the top is
 * consistent: rounded elevated logo, bold title, muted subtitle, an
 * optional back action, an optional right slot and optional content below.
 */
export const AppHeader = ({ title, subtitle, onBack, right, children }: AppHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 px-6 pt-7 pb-5 overflow-hidden bg-gradient-to-b from-primary/[0.06] to-background/0 backdrop-blur-xl border-b border-primary/10">
      {/* Soft liquid glows */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -top-8 right-0 h-24 w-24 rounded-full bg-accent/10 blur-3xl" aria-hidden />
      {onBack && (
        <button
          onClick={onBack}
          className="relative flex items-center gap-1 text-sm font-medium text-muted-foreground mb-4 active:scale-95 transition-transform"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
      )}
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <div className="absolute inset-0 -m-1.5 rounded-[1.4rem] bg-primary/10 blur-md" aria-hidden />
            <img
              src={jarvisLogo}
              alt="Jarvis"
              className="relative h-12 w-12 rounded-[1.1rem] shadow-[var(--shadow-soft)] ring-1 ring-white/40"
            />
          </div>
          <div className="min-w-0 space-y-1.5">
            <h1 className="text-[26px] leading-[1.1] font-extrabold text-foreground tracking-tight truncate">
              {title}
            </h1>
            {typeof subtitle === "string" ? (
              <span className="inline-flex items-center rounded-full bg-background/60 ring-1 ring-border/50 backdrop-blur-md px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                {subtitle}
              </span>
            ) : (
              subtitle
            )}
          </div>
        </div>
        {right && <div className="flex items-center gap-1 shrink-0">{right}</div>}
      </div>
      {children}
    </header>
  );
};