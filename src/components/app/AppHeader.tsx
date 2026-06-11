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
    <header className="px-6 pt-8 pb-5 bg-gradient-to-b from-primary/[0.05] to-background">
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
          <img
            src={jarvisLogo}
            alt="Jarvis"
            className="h-11 w-11 rounded-2xl shadow-[var(--shadow-soft)] shrink-0"
          />
          <div className="min-w-0 space-y-0.5">
            <h1 className="text-[26px] leading-tight font-bold text-foreground tracking-tight truncate">
              {title}
            </h1>
            {typeof subtitle === "string" ? (
              <p className="text-sm font-medium text-muted-foreground truncate">{subtitle}</p>
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