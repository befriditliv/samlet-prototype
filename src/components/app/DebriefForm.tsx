import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Mic, Lightbulb, AlertCircle, RotateCcw, FileText, ChevronRight, Square } from "lucide-react";
import { useDebriefQueue } from "@/hooks/useDebriefQueue";
import { SyncStatus } from "./SyncStatus";
import jarvisLogo from "@/assets/jarvis-logo.svg";

interface DebriefFormProps {
  meetingId: string;
  onBack: () => void;
  onSave: (data: DebriefData) => void;
}

interface DebriefData {
  quickDebrief?: string;
  outcome: number;
  objectivesAchieved: string[];
  keyConcerns: boolean;
  hasInizioFollowUp: boolean;
  materialsShared: boolean;
  voiceNotes: string;
}

interface DebriefTemplate {
  quickDebrief?: string;
  hasObjections: boolean | undefined;
  materialsShared: boolean | undefined;
  hasFollowUpTasks: boolean | undefined;
  newMeetingScheduled: boolean | undefined;
}

const quickDebriefOptions = [
  { value: "meeting-cancelled", label: "Meeting Cancelled" },
  { value: "material-handover", label: "Debrief Not Relevant" }
];

const debriefQuestions = [
  "How did the meeting go overall? Tell me about the key discussion points.",
  "Were there any concerns or objections from the physician?",
  "What materials did you share, and what are the next steps?"
];

export const DebriefForm = ({ meetingId, onBack, onSave }: DebriefFormProps) => {
  const { addToQueue } = useDebriefQueue();
  const [phase, setPhase] = useState<'template' | 'debrief' | 'saved' | 'failed'>('template');
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPlayingQuestion, setIsPlayingQuestion] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [template, setTemplate] = useState<DebriefTemplate>({
    quickDebrief: undefined,
    hasObjections: undefined,
    materialsShared: undefined,
    hasFollowUpTasks: undefined,
    newMeetingScheduled: undefined
  });
  const [voiceNotes, setVoiceNotes] = useState("");

  // Play beep sound
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

  // Start recording automatically
  const startRecordingAuto = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  // Play question, then beep, then start recording automatically
  const playQuestionAndStartRecording = () => {
    setIsPlayingQuestion(true);
    // Simulate question being "spoken" for 2 seconds
    setTimeout(() => {
      setIsPlayingQuestion(false);
      // Play beep and start recording
      playBeep();
      setTimeout(() => {
        startRecordingAuto();
      }, 400);
    }, 2000);
  };

  // Start debrief flow - immediately show first question and auto-start recording
  const handleStartDebrief = () => {
    setPhase('debrief');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    // Play question after a short delay
    setTimeout(() => {
      playQuestionAndStartRecording();
    }, 300);
  };

  // Stop recording and go to next question
  const handleNextQuestion = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Save simulated answer
    setAnswers(prev => [...prev, `Answer for question ${currentQuestionIndex + 1}`]);

    if (currentQuestionIndex < debriefQuestions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      setRecordingTime(0);

      // Play next question and auto-start recording
      setTimeout(() => {
        playQuestionAndStartRecording();
      }, 300);
    }
  };

  // Finish debrief - go directly back to overview
  const handleFinishDebrief = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const debriefData: DebriefData = {
      quickDebrief: template.quickDebrief,
      outcome: 0,
      objectivesAchieved: [],
      keyConcerns: template.hasObjections || false,
      hasInizioFollowUp: template.hasFollowUpTasks || false,
      materialsShared: template.materialsShared || false,
      voiceNotes: answers.join('\n\n')
    };

    addToQueue(meetingId, debriefData);
    onSave(debriefData); // Go directly back to overview with status update
  };

  const handleSaveDebrief = () => {
    const debriefData: DebriefData = {
      quickDebrief: template.quickDebrief,
      outcome: 0,
      objectivesAchieved: [],
      keyConcerns: template.hasObjections || false,
      hasInizioFollowUp: template.hasFollowUpTasks || false,
      materialsShared: template.materialsShared || false,
      voiceNotes
    };

    addToQueue(meetingId, debriefData);
    onSave(debriefData); // Go directly back to overview with status update
  };

  const handleRetryDebrief = () => {
    setPhase('template');
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const isLastQuestion = currentQuestionIndex === debriefQuestions.length - 1;

  if (phase === 'template') {
    return (
      <div className="min-h-screen bg-background animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="rounded-full p-2 hover:bg-secondary/80"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Debrief</h1>
                  <p className="text-sm text-muted-foreground">Dr. Sarah Johnson</p>
                </div>
              </div>
              <SyncStatus />
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-4 space-y-4">
          {/* Quick Debrief Options */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Quick options</p>
            <div className="flex flex-wrap gap-2">
              {quickDebriefOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTemplate(prev => ({
                    ...prev,
                    quickDebrief: prev.quickDebrief === option.value ? undefined : option.value
                  }))}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    template.quickDebrief === option.value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional rendering based on quick debrief selection */}
          {template.quickDebrief ? (
            <div className="space-y-4">
              <Card className="p-6 bg-primary/5 border-primary/20 border">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-lg mb-2 text-primary">Quick Debrief Selected</h4>
                  <p className="text-muted-foreground mb-6">
                    {quickDebriefOptions.find(o => o.value === template.quickDebrief)?.label}
                  </p>
                  <Button
                    onClick={handleSaveDebrief}
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-300 rounded-xl px-8 py-3 text-base font-semibold"
                  >
                    <CheckCircle className="h-5 w-5 mr-3" />
                    Save Debrief
                  </Button>
                </div>
              </Card>
            </div>
          ) : (
            <>
              {/* Tips & Best Practices Info Box */}
              <Card className="p-6 shadow-sm border-0 bg-gradient-to-br from-primary/5 to-primary/10 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-card-foreground mb-3">Tips for a Great Debrief</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Be specific about key discussion points and outcomes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Note any objections or concerns raised during the meeting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Capture action items and follow-up commitments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Record any materials shared or requested</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Include relevant context for future reference</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>

              <div className="text-center pt-2">
                <Button
                  onClick={handleStartDebrief}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-300 rounded-xl px-8 py-3 text-base font-semibold"
                >
                  <Mic className="h-5 w-5 mr-3" />
                  Start Voice Debrief
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Note: 'saved' phase removed - we now go directly back to overview

  // Failed Phase
  if (phase === 'failed') {
    return (
      <div className="min-h-screen bg-background flex flex-col animate-fade-in">
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-xl p-2 h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">Meeting debrief</h1>
              <p className="text-xs text-muted-foreground">Dr. Sarah Johnson • 2026-01-16</p>
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="px-6 pt-4 flex justify-end">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            Failed
          </div>
        </div>

        {/* Debrief Card - Loading/Empty state */}
        <div className="px-6 py-4">
          <Card className="p-5 border-0 bg-muted/30 rounded-xl">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-3">Debrief</h3>
                <div className="h-1 w-8 bg-primary/40 rounded-full animate-pulse" />
              </div>
            </div>
          </Card>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom buttons */}
        <div className="px-6 pb-8 space-y-3">
          <Button
            onClick={handleRetryDebrief}
            size="lg"
            className="w-full bg-destructive hover:bg-destructive/90 text-white rounded-2xl py-4 text-base font-semibold"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Redo Debrief
          </Button>
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="w-full rounded-2xl py-4 text-base font-medium border-2"
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Debrief Phase - Question-based flow
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-border/30">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPhase('template')}
            className="rounded-xl p-2 h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">Voice Debrief</h1>
            <p className="text-xs text-muted-foreground truncate">Dr. Sarah Johnson</p>
          </div>
          {/* Question indicator */}
          <div className="text-xs text-muted-foreground font-medium">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 py-8">
        {/* Question display */}
        <div className="mb-8">
          <div className={`p-5 rounded-2xl bg-primary/5 border border-primary/20 transition-all duration-300 ${isPlayingQuestion ? 'animate-pulse' : ''}`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
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

        {/* Recording area */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {isPlayingQuestion ? (
            // Jarvis is asking the question
            <div className="text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-pulse">
                <img src={jarvisLogo} alt="Jarvis" className="h-12 w-12" />
              </div>
              <p className="text-sm text-muted-foreground">Jarvis is asking...</p>
            </div>
          ) : isRecording ? (
            // Recording state
            <div className="text-center space-y-6 w-full">
              <div className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                <span className="text-base font-medium text-foreground tracking-tight">Recording</span>
              </div>

              {/* Timer */}
              <div className="text-2xl font-semibold text-foreground tracking-tight tabular-nums">
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
            // Waiting state (brief moment)
            <div className="text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto">
                <img src={jarvisLogo} alt="Jarvis" className="h-12 w-12 opacity-50" />
              </div>
              <p className="text-sm text-muted-foreground">Preparing...</p>
            </div>
          )}
        </div>

        {/* Bottom action button */}
        {isRecording && (
          <div className="pt-6 space-y-3">
            {isLastQuestion ? (
              <Button
                onClick={handleFinishDebrief}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-4 text-base font-semibold"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Finish Debrief
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-4 text-base font-semibold"
              >
                Next Question
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            )}
            <button
              onClick={() => {
                setIsRecording(false);
                if (timerRef.current) clearInterval(timerRef.current);
              }}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
