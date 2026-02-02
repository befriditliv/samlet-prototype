import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Lightbulb, X } from "lucide-react";
import { toast } from "sonner";

interface WebDebriefDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting: {
    id: string;
    doctorName: string;
    specialty: string;
    location: string;
    startTime: string;
  };
  onSave: () => void;
}

const quickOptions = [
  { value: "cancelled", label: "Meeting Cancelled" },
  { value: "not-relevant", label: "Debrief Not Relevant" }
];

export const WebDebriefDialog = ({ open, onOpenChange, meeting, onSave }: WebDebriefDialogProps) => {
  const [quickOption, setQuickOption] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<string>("positive");
  const [notes, setNotes] = useState("");
  const [hasObjections, setHasObjections] = useState(false);
  const [materialsShared, setMaterialsShared] = useState(false);
  const [followUpScheduled, setFollowUpScheduled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsSaving(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      toast.success("Debrief saved successfully");
      onSave();
      onOpenChange(false);
      // Reset state
      setShowSuccess(false);
      setQuickOption(null);
      setNotes("");
      setOutcome("positive");
      setHasObjections(false);
      setMaterialsShared(false);
      setFollowUpScheduled(false);
    }, 1500);
  };

  const handleQuickSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    toast.success(`Marked as: ${quickOptions.find(o => o.value === quickOption)?.label}`);
    onSave();
    onOpenChange(false);
    setQuickOption(null);
  };

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Debrief Saved</h3>
            <p className="text-sm text-muted-foreground text-center">
              Your debrief has been saved successfully.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Debrief Meeting</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {meeting.doctorName} • {meeting.specialty}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Options */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Quick Options</Label>
            <div className="flex flex-wrap gap-2">
              {quickOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setQuickOption(quickOption === option.value ? null : option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    quickOption === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {quickOption ? (
            <div className="p-6 rounded-lg bg-primary/5 border border-primary/20 text-center">
              <CheckCircle className="h-10 w-10 text-primary mx-auto mb-3" />
              <p className="font-medium mb-4">
                {quickOptions.find(o => o.value === quickOption)?.label}
              </p>
              <Button onClick={handleQuickSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save & Close"}
              </Button>
            </div>
          ) : (
            <>
              {/* Meeting Outcome */}
              <div className="space-y-3">
                <Label>Meeting Outcome</Label>
                <RadioGroup value={outcome} onValueChange={setOutcome} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="positive" id="positive" />
                    <Label htmlFor="positive" className="font-normal cursor-pointer">Positive</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neutral" id="neutral" />
                    <Label htmlFor="neutral" className="font-normal cursor-pointer">Neutral</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="challenging" id="challenging" />
                    <Label htmlFor="challenging" className="font-normal cursor-pointer">Challenging</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Meeting Notes */}
              <div className="space-y-3">
                <Label htmlFor="notes">Meeting Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Describe the key discussion points, HCP reactions, and any important insights..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Meeting Details</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="objections" 
                      checked={hasObjections}
                      onCheckedChange={(checked) => setHasObjections(checked as boolean)}
                    />
                    <Label htmlFor="objections" className="font-normal cursor-pointer">
                      HCP raised objections or concerns
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="materials" 
                      checked={materialsShared}
                      onCheckedChange={(checked) => setMaterialsShared(checked as boolean)}
                    />
                    <Label htmlFor="materials" className="font-normal cursor-pointer">
                      Materials were shared
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="followup" 
                      checked={followUpScheduled}
                      onCheckedChange={(checked) => setFollowUpScheduled(checked as boolean)}
                    />
                    <Label htmlFor="followup" className="font-normal cursor-pointer">
                      Follow-up meeting scheduled
                    </Label>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Tips for a great debrief</p>
                    <ul className="space-y-1">
                      <li>• Include specific HCP quotes when possible</li>
                      <li>• Note any action items with deadlines</li>
                      <li>• Document concerns for future reference</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving || !notes.trim()}>
                  {isSaving ? "Saving..." : "Save Debrief"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
