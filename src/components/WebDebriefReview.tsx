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

interface WebDebriefReviewProps {
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
    specialty: "Endocrinology",
    date: "January 12, 2026",
    time: "13:00",
    location: "Rigshospitalet"
  },
  complianceIssues: [
    "Possible off-label discussion detected - verify that the conversation stayed within approved indication",
    "Reference to competitor product without comparative data"
  ],
  purpose: "The purpose of the meeting was a constructive discussion about several medical topics, including cardiovascular disease, off-label use, and specific brands such as Ozempic, Wegovy, Rebelsus and GLP-1. Additionally, initiation and municipal subsidy plans were discussed.",
  brands: [
    {
      brand: "Ozempic",
      activities: [
        "Discussion about Ozempic and its use, including off-label use and related municipal subsidy plans."
      ],
      reactions: []
    },
    {
      brand: "Wegovy",
      activities: [
        "Review of Wegovy for weight management and patient profiles suitable for the treatment."
      ],
      reactions: [
        "HCP expressed concern about availability and wait time for the product."
      ]
    },
    {
      brand: "Rebelsus",
      activities: [],
      reactions: []
    },
    {
      brand: "GLP-1",
      activities: [
        "Discussion of GLP-1 and its significance in treating cardiovascular disease."
      ],
      reactions: []
    }
  ] as BrandNote[],
};

export const WebDebriefReview = ({ meetingId, onBack, onApprove }: WebDebriefReviewProps) => {
  const [notes] = useState(mockDebriefData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "Debrief sent",
      description: "Your debrief has been sent to IOengage",
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-xl p-2 h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-foreground tracking-tight">Meeting debrief</h1>
              <p className="text-sm text-muted-foreground">{notes.meeting.hcpName} · {notes.meeting.date}</p>
            </div>

            {/* Three-dot menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl p-2 h-10 w-10"
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
        <AlertDialogContent className="rounded-2xl">
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
      <div className="container mx-auto px-6 py-8 max-w-4xl space-y-6">
        {/* Compliance Warning - Yellow box at top if issues detected */}
        {hasComplianceIssues && (
          <Card className="p-5 border-0 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-800/30 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Compliance warning</h3>
                <ul className="space-y-1.5">
                  {notes.complianceIssues.map((issue, index) => (
                    <li key={index} className="text-sm text-amber-600 dark:text-amber-400">
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Purpose / Formål */}
        <Card className="p-5 border border-border/50 bg-card rounded-2xl">
          <h3 className="font-semibold text-foreground mb-3">Purpose of visit</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {notes.purpose}
          </p>
        </Card>

        {/* Brand Notes - Each brand in its own box */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">Activity Overview</h3>

          {notes.brands?.map((brandNote, index) => {
            const hasContent = (brandNote.activities?.length ?? 0) > 0 || (brandNote.reactions?.length ?? 0) > 0;

            return (
              <Card key={index} className="p-5 border border-border/50 bg-card rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-lg">
                    {brandNote.brand}
                  </span>
                </div>

                {hasContent ? (
                  <div className="space-y-4">
                    {(brandNote.activities?.length ?? 0) > 0 && (
                      <ul className="space-y-2">
                        {brandNote.activities.map((activity, actIndex) => (
                          <li key={actIndex} className="flex items-start gap-3 text-sm text-foreground">
                            <span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {(brandNote.reactions?.length ?? 0) > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">HCP reactions</p>
                        <ul className="space-y-2">
                          {brandNote.reactions.map((reaction, reactIndex) => (
                            <li key={reactIndex} className="flex items-start gap-3 text-sm text-foreground">
                              <span className="w-2 h-2 bg-amber-500 rounded-full mt-1.5 flex-shrink-0" />
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

        {/* Bottom action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            onClick={handleApprove}
            disabled={isSubmitting}
            size="lg"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 text-base font-semibold disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Submit to IOengage
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="flex-1 rounded-xl py-3 text-base font-medium border-2"
          >
            <Edit3 className="h-5 w-5 mr-2" />
            Edit notes
          </Button>
        </div>
      </div>
    </div>
  );
};
