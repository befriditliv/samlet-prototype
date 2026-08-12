import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit3, Send, Loader2, MoreVertical, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DebriefCoachingPrompt, DuplicateTextNotice } from "@/components/debrief/DebriefQualitySignals";

interface DebriefReviewProps {
  meetingId: string;
  onBack: () => void;
  onApprove: () => void;
}

interface BrandNote {
  brand: string;
  activities: string[];
  reactions: string[];
}

// Mock data for the debrief - structured by brand
const mockDebriefData = {
  meeting: {
    hcpName: "Marianne Lindberg Pedersen + 1",
    specialty: "Emergency Medicine",
    date: "January 12, 2026",
    time: "13:00",
    location: "Northgate University Hospital"
  },
  complianceIssues: [
    "Possible off-label discussion detected - verify that the conversation stayed within approved indication",
    "Reference to competitor product without comparative data"
  ],
  duplicateTextSignal: {
    title: "Repeated wording detected",
    description:
      "Some wording in this debrief looks very similar to earlier submissions. If this meeting had unique takeaways, adding a bit more context will make the notes more useful.",
  },
  detailScore: 42,
  purpose: "The purpose of the meeting was a constructive discussion about several clinical topics, including the acute appendicitis pathway, off-label use, and the Dose 1 portfolio (Dose 1, Dose 1 Oral and Dose 1 Pen). Additionally, initiation and municipal subsidy plans were discussed.",
  brands: [
    {
      brand: "Dose 1",
      activities: [
        "Discussion about Dose 1 and its use, including off-label use and related municipal subsidy plans."
      ],
      reactions: []
    },
    {
      brand: "Dose 1 Oral",
      activities: [
        "Review of Dose 1 Oral for step-down treatment and patient profiles suitable for the pathway."
      ],
      reactions: [
        "HCP expressed concern about availability and wait time for the product."
      ]
    },
    {
      brand: "Dose 1 Pen",
      activities: [],
      reactions: []
    },
    {
      brand: "OdaCare",
      activities: [
        "Discussion of the OdaCare support program and its role in post-treatment follow-up."
      ],
      reactions: []
    }
  ] as BrandNote[],
  objections: [
    "Questions about reimbursement pathways for new treatments",
    "Concern about patient confidence in a non-surgical pathway"
  ],
  nextAction: "Follow-up on municipal subsidy plans and further discussions about the SWIP presentation."
};

export const DebriefReview = ({ meetingId, onBack, onApprove }: DebriefReviewProps) => {
  const [notes, setNotes] = useState(mockDebriefData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleImproveDetails = () => {
    onBack();
  };

  const handleApprove = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Debrief sent",
      description: "Your debrief has been sent to CRM",
    });

    setIsSubmitting(false);
    onApprove();
  };

  const handleDelete = () => {
    toast({
      title: "Debrief deleted",
      description: "Your debrief has been deleted",
    });
    onBack();
  };

  const hasComplianceIssues = (notes.complianceIssues?.length ?? 0) > 0;

  return (
    <div className="app-shell min-h-screen bg-background flex flex-col animate-fade-in sm:border-x-2 sm:border-border/50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-xl p-2 h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-foreground tracking-tight">Meeting debrief</h1>
              <p className="text-xs text-muted-foreground truncate">{notes.meeting.hcpName} · {notes.meeting.date}</p>
            </div>

            {/* Three-dot menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl p-2 h-9 w-9"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 shadow-lg">
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete debrief
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-2xl mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete debrief?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this debrief? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 py-4 space-y-4 overflow-y-auto pb-48">

        {/* Compliance Warning - Yellow box at top if issues detected */}
        {hasComplianceIssues && (
          <Card className="p-4 border border-amber-500/20 bg-amber-500/10 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/15 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Compliance warning</h3>
                <ul className="space-y-1">
                  {notes.complianceIssues.map((issue, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        <DuplicateTextNotice duplicateTextSignal={notes.duplicateTextSignal} />

        {/* Purpose / Formål */}
        <Card className="p-4 border border-border/60 bg-card rounded-2xl shadow-[var(--shadow-soft)]">
          <h3 className="font-semibold text-foreground mb-2">Purpose of visit</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {notes.purpose}
          </p>
        </Card>

        {/* Brand Notes - Each brand in its own box */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground px-1">Activity overview</h3>

          {notes.brands?.map((brandNote, index) => {
            const hasContent = (brandNote.activities?.length ?? 0) > 0 || (brandNote.reactions?.length ?? 0) > 0;

            return (
              <Card key={index} className="p-4 border border-border/60 bg-card rounded-2xl shadow-[var(--shadow-soft)]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                    {brandNote.brand}
                  </span>
                </div>

                {hasContent ? (
                  <div className="space-y-3">
                    {(brandNote.activities?.length ?? 0) > 0 && (
                      <ul className="space-y-1.5">
                        {brandNote.activities.map((activity, actIndex) => (
                          <li key={actIndex} className="flex items-start gap-2 text-sm text-foreground">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {(brandNote.reactions?.length ?? 0) > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">HCP reactions</p>
                        <ul className="space-y-1.5">
                          {brandNote.reactions.map((reaction, reactIndex) => (
                            <li key={reactIndex} className="flex items-start gap-2 text-sm text-foreground">
                              <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full mt-2 flex-shrink-0" />
                              <span>{reaction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No activity registered</p>
                )}
              </Card>
            );
          })}
        </div>

        <DebriefCoachingPrompt detailScore={notes.detailScore} onImproveDetails={handleImproveDetails} />
      </div>

      {/* Bottom action buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-10 pb-safe">
        <div className="app-shell-bar p-4 space-y-3 border-t border-border sm:border-x-2 sm:border-border/50 bg-background/95 backdrop-blur-lg">
          <Button
            onClick={handleApprove}
            disabled={isSubmitting}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-4 text-base font-semibold disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Submit to CRM
              </>
            )}
          </Button>
          <Button
            onClick={handleImproveDetails}
            variant="outline"
            size="lg"
            className="w-full rounded-2xl py-4 text-base font-medium border-2"
          >
            <Edit3 className="h-5 w-5 mr-2" />
            Edit notes
          </Button>
        </div>
      </div>
    </div>
  );
};
