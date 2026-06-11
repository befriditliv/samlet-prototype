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
    <header className="px-6 pt-7 pb-4 bg-white border-b border-border shadow-sm">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground mb-4 active:scale-95 transition-transform"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
      )}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative shrink-0">
            <div className="absolute inset-0 -m-1.5 rounded-[1.4rem] bg-primary/10 blur-md" aria-hidden />
            <img
              src={jarvisLogo}
              alt="Jarvis"
              className="relative h-12 w-12 rounded-[1.1rem] shadow-[var(--shadow-soft)] ring-1 ring-white/40"
            />
          </div>
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl leading-tight font-bold text-foreground tracking-tight truncate">
              {title}
            </h1>
            {typeof subtitle === "string" ? (
              <span className="inline-flex items-center -ml-1.5 rounded-full bg-secondary/70 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
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