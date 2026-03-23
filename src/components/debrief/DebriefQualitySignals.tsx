import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Files } from "lucide-react";

export interface DuplicateTextSignal {
  title: string;
  description: string;
}

interface DebriefDetailIndicatorProps {
  detailScore: number;
  onImproveDetails: () => void;
}

const getDetailLevel = (score: number) => {
  if (score >= 75) {
    return {
      label: "High",
      description: "This debrief captures clear context, outcomes, and follow-up value.",
    };
  }

  if (score >= 45) {
    return {
      label: "Moderate",
      description: "The essentials are there, but a bit more detail could make the meeting easier to act on.",
    };
  }

  return {
    label: "Low",
    description: "This debrief is quite brief. Adding more context, objections, or next steps would strengthen it.",
  };
};

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

export const DebriefDetailIndicator = ({
  detailScore,
  onImproveDetails,
}: DebriefDetailIndicatorProps) => {
  const detailLevel = getDetailLevel(detailScore);

  return (
    <Card className="rounded-2xl border border-border/50 bg-secondary/20 p-4 shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-foreground">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Level of Detail</h3>
          </div>
          <p className="text-sm text-muted-foreground">{detailLevel.description}</p>
        </div>
        <div className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {detailLevel.label}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Detail indicator</span>
          <span className="font-medium text-muted-foreground">{detailScore}/100</span>
        </div>
        <Progress value={detailScore} className="h-1.5" />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Adding a little more context can make the debrief more useful.</p>
        <Button variant="outline" onClick={onImproveDetails} className="rounded-xl border-border/60 bg-background text-sm">
          Add more detail
        </Button>
      </div>
    </Card>
  );
};