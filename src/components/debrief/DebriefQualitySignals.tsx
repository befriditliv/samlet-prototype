import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Files, ListChecks } from "lucide-react";

export interface DuplicateTextSignal {
  title: string;
  description: string;
}

interface DebriefCoachingPromptProps {
  detailScore: number;
  onImproveDetails: () => void;
}

const coachingPrompts = [
  "Who participated in the meeting?",
  "What were the main topics discussed?",
  "How did you address any questions or concerns?",
  "Did anything from the prep notes come up?",
  "Was a next step or next meeting agreed?",
  "Was consent or follow-up permission confirmed?",
];

export const DuplicateTextNotice = ({
  duplicateTextSignal,
}: {
  duplicateTextSignal?: DuplicateTextSignal | null;
}) => {
  if (!duplicateTextSignal) {
    return null;
  }

  return (
    <Card className="rounded-2xl border border-border/60 bg-secondary/40 p-5 shadow-none">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-background p-2.5 text-muted-foreground">
          <Files className="h-5 w-5" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-semibold text-foreground">{duplicateTextSignal.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{duplicateTextSignal.description}</p>
        </div>
      </div>
    </Card>
  );
};

export const DebriefCoachingPrompt = ({
  detailScore,
  onImproveDetails,
}: DebriefCoachingPromptProps) => {
  if (detailScore >= 60) {
    return null;
  }

  return (
    <Card className="rounded-2xl border border-border/50 bg-secondary/15 p-4 shadow-none">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-background p-2.5 text-muted-foreground">
          <ListChecks className="h-4 w-4" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-medium text-foreground">Low level of detail detected</h3>
          <p className="text-sm text-muted-foreground">
            Here are a few helpful prompts for a stronger debrief if you want to add a bit more context.
          </p>
        </div>
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {coachingPrompts.map((prompt) => (
          <li
            key={prompt}
            className="rounded-xl border border-border/50 bg-background/80 px-3 py-2 text-sm text-muted-foreground"
          >
            {prompt}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={onImproveDetails}
          className="rounded-xl text-sm font-medium shadow-sm"
        >
          Add more context
        </Button>
      </div>
    </Card>
  );
};