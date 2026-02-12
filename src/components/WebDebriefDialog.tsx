import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, CheckCircle, Mic, Lightbulb, ChevronRight } from "lucide-react";
import jarvisLogo from "@/assets/jarvis-logo.svg";

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

const debriefQuestions = [
  "How did the meeting go overall? Tell me about the key discussion points.",
  "Were there any concerns or objections from the physician?",
  "What materials did you share, and what are the next steps?"
];

export const WebDebriefDialog = ({ open, onOpenChange, meeting, onSave }: WebDebriefDialogProps) => {
  const [phase, setPhase] = useState<'template' | 'debrief' | 'saved'>('template');
  const [quickOption, setQuickOption] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPlayingQuestion, setIsPlayingQuestion] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setPhase('template');
        setQuickOption(null);
        setIsRecording(false);
        setCurrentQuestionIndex(0);
        setIsPlayingQuestion(false);
        setRecordingTime(0);
        setAnswers([]);
        if (timerRef.current) clearInterval(timerRef.current);
      }, 300);
    }
  }, [open]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const playBeep = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const startRecordingAuto = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const playQuestionAndStartRecording = () => {
    setIsPlayingQuestion(true);
    setTimeout(() => {
      setIsPlayingQuestion(false);
      playBeep();
      setTimeout(() => {
        startRecordingAuto();
      }, 400);
    }, 2000);
  };

  const handleStartDebrief = () => {
    setPhase('debrief');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTimeout(() => {
      playQuestionAndStartRecording();
    }, 300);
  };

  const handleNextQuestion = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setAnswers(prev => [...prev, `Answer for question ${currentQuestionIndex + 1}`]);

    if (currentQuestionIndex < debriefQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setRecordingTime(0);
      setTimeout(() => {
        playQuestionAndStartRecording();
      }, 300);
    }
  };

  const handleFinishDebrief = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setPhase('saved');
  };

  const handleQuickSave = () => {
    setPhase('saved');
  };

  const handleClose = () => {
    if (phase === 'saved') {
      onSave();
    }
    onOpenChange(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLastQuestion = currentQuestionIndex === debriefQuestions.length - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        {/* Template Phase - Initial screen */}
        {phase === 'template' && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="rounded-full p-2 h-9 w-9 -ml-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">Debrief</h1>
                  <p className="text-sm text-muted-foreground">{meeting.doctorName}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Quick Options */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Quick options</p>
                <div className="flex flex-wrap gap-2">
                  {quickOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setQuickOption(quickOption === option.value ? null : option.value)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        quickOption === option.value
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {quickOption ? (
                /* Quick option selected */
                <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 text-center">
                  <CheckCircle className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-lg mb-2 text-primary">Quick Debrief Selected</h4>
                  <p className="text-muted-foreground mb-6">
                    {quickOptions.find(o => o.value === quickOption)?.label}
                  </p>
                  <Button
                    onClick={handleQuickSave}
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-8"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Save Debrief
                  </Button>
                </div>
              ) : (
                <>
                  {/* Tips Card */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                        <Lightbulb className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-foreground mb-3">Tips for a Great Debrief</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Be specific about key discussion points and outcomes</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Note any objections or concerns raised during the meeting</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Capture action items and follow-up commitments</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Record any materials shared or requested</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>Include relevant context for future reference</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Start Voice Debrief Button */}
                  <Button
                    onClick={handleStartDebrief}
                    size="lg"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-4 text-base font-semibold"
                  >
                    <Mic className="h-5 w-5 mr-3" />
                    Start Voice Debrief
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Debrief Phase - Voice recording */}
        {phase === 'debrief' && (
          <div className="flex flex-col min-h-[500px]">
            {/* Header */}
            <div className="px-6 py-4 border-b">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsRecording(false);
                    if (timerRef.current) clearInterval(timerRef.current);
                    setPhase('template');
                  }}
                  className="rounded-full p-2 h-9 w-9 -ml-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-semibold text-foreground">Voice Debrief</h1>
                  <p className="text-sm text-muted-foreground">{meeting.doctorName}</p>
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {currentQuestionIndex + 1} / {debriefQuestions.length}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-6 pt-4">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestionIndex + (isRecording ? 0.5 : 0)) / debriefQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question display */}
            <div className="px-6 pt-6">
              <div className={`p-5 rounded-xl bg-primary/5 border border-primary/20 transition-all duration-300 ${isPlayingQuestion ? 'animate-pulse' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Mic className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-primary font-medium mb-1">Jarvis asks:</p>
                    <p className="text-foreground font-medium leading-relaxed">
                      {debriefQuestions[currentQuestionIndex]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips reminder */}
            <div className="px-6 pt-4">
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                    <Lightbulb className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-foreground mb-1.5">Tips for a Great Debrief</h3>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li className="flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Be specific about key discussion points and outcomes</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Note any objections or concerns raised</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Capture action items and follow-up commitments</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Record any materials shared or requested</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">•</span>
                        <span>Include relevant context for future reference</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Recording area */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-6">
              {isPlayingQuestion ? (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-pulse">
                    <img src={jarvisLogo} alt="Jarvis" className="h-10 w-10" />
                  </div>
                  <p className="text-sm text-muted-foreground">Jarvis is asking...</p>
                </div>
              ) : isRecording ? (
                <div className="text-center space-y-4 w-full">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                    <span className="text-base font-medium text-foreground">Recording</span>
                  </div>

                  <div className="text-2xl font-semibold text-foreground tabular-nums">
                    {formatTime(recordingTime)}
                  </div>

                  {/* Recording visualization */}
                  <div className="flex items-center justify-center gap-1 h-12">
                    {[...Array(9)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-primary rounded-full animate-pulse"
                        style={{
                          height: `${16 + Math.random() * 32}px`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: `${0.5 + Math.random() * 0.5}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <img src={jarvisLogo} alt="Jarvis" className="h-10 w-10 opacity-50" />
                  </div>
                  <p className="text-sm text-muted-foreground">Preparing...</p>
                </div>
              )}
            </div>

            {/* Bottom action */}
            {isRecording && (
              <div className="px-6 pb-6 space-y-3">
                {isLastQuestion ? (
                  <Button
                    onClick={handleFinishDebrief}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-4 text-base font-semibold"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Finish Debrief
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-4 text-base font-semibold"
                  >
                    Next Question
                    <ChevronRight className="h-5 w-5 ml-2" />
                  </Button>
                )}
                <button
                  onClick={() => {
                    setIsRecording(false);
                    if (timerRef.current) clearInterval(timerRef.current);
                    setPhase('template');
                  }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Saved Phase - Success screen */}
        {phase === 'saved' && (
          <div className="flex flex-col min-h-[400px]">
            {/* Header */}
            <div className="px-6 py-4 border-b">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="rounded-full p-2 h-9 w-9 -ml-2"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex-1 text-center pr-9">
                  <h1 className="text-lg font-semibold text-foreground">Debrief</h1>
                </div>
              </div>
            </div>

            {/* Success content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-foreground">Debrief Saved</h2>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Your debrief is now being processed. You'll receive a notification when it's ready for review.
                  </p>
                </div>
              </div>
            </div>

            {/* OK Button */}
            <div className="px-6 pb-6">
              <Button
                onClick={handleClose}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-4 text-base font-semibold"
              >
                OK
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
