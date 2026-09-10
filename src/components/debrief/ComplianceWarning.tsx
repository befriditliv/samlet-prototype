import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export interface ComplianceIssue {
  /** Rule category that fired, e.g. "Adverse event" */
  category: string;
  /** Where in the debrief the wording was found */
  source: string;
  /** The exact wording that triggered the rule */
  trigger: string;
  /** Plain explanation of why it matters */
  why: string;
  /** What the KAM has to do about it */
  action: string;
  /** Deadline / urgency label, e.g. "Report within 24 hours" */
  deadline?: string;
}

interface ComplianceWarningProps {
  issues?: ComplianceIssue[] | null;
  compact?: boolean;
}

export const ComplianceWarning = ({ issues, compact = false }: ComplianceWarningProps) => {
  if (!issues || issues.length === 0) return null;

  return (
    <Card
      className={`rounded-2xl border border-amber-500/25 bg-amber-500/10 ${compact ? "p-4" : "p-5"}`}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-amber-500/15 p-2.5 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-foreground">
            Compliance check: {issues.length} item{issues.length > 1 ? "s" : ""} need your attention
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Jarvis found wording in this debrief that matches the safety and compliance rules. Nothing is
            sent anywhere automatically — please confirm what was actually said before you submit.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {issues.map((issue, index) => (
          <div
            key={index}
            className="rounded-xl border border-amber-500/20 bg-background/70 p-4 space-y-2.5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                {issue.category}
              </span>
              <span className="text-xs text-muted-foreground">{issue.source}</span>
              {issue.deadline && (
                <span className="rounded-lg border border-amber-500/30 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                  {issue.deadline}
                </span>
              )}
            </div>

            <p className="border-l-2 border-amber-500/40 pl-3 text-sm italic text-foreground">
              “{issue.trigger}”
            </p>

            <p className="text-sm text-muted-foreground leading-relaxed">{issue.why}</p>

            <p className="text-sm text-foreground">
              <span className="font-semibold">What to do: </span>
              {issue.action}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
