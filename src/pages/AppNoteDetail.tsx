import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Pencil, Play, Send, Check, Clock, Building2, X, Link2, CalendarClock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { toast } from "@/hooks/use-toast";
import { noteAiSummaries, candidateMeetings } from "@/data/noteAiSummaries";

const AppNoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const note = noteAiSummaries.find((n) => n.id === id);

  const [tab, setTab] = useState<"notes" | "sources">("notes");
  const [isEditing, setIsEditing] = useState(false);
  const [summary, setSummary] = useState(note?.summary ?? "");
  const [keyPoints, setKeyPoints] = useState((note?.keyPoints ?? []).join("\n"));
  const [actions, setActions] = useState((note?.actions ?? []).join("\n"));
  const [submitted, setSubmitted] = useState(false);
  const [matchedLabel, setMatchedLabel] = useState(note?.matchedMeeting ?? "");
  const [matchOpen, setMatchOpen] = useState(false);

  if (!note) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center gap-3 px-6">
        <p className="text-muted-foreground">Summary not found.</p>
        <Button variant="outline" onClick={() => navigate("/app/note")}>Back to notes</Button>
      </div>
    );
  }

  const handleSubmit = () => {
    setSubmitted(true);
    setIsEditing(false);
    toast({
      title: "Submitted to IO Engage",
      description: "Your meeting note has been pushed to IO Engage.",
    });
  };

  const handleRematch = (meetingTime: string | null) => {
    setMatchOpen(false);
    if (meetingTime) {
      setMatchedLabel(`Matched to your ${meetingTime} meeting`);
      toast({
        title: "Meeting rematched",
        description: `This summary is now linked to your ${meetingTime} meeting.`,
      });
    } else {
      setMatchedLabel("");
      toast({
        title: "Match removed",
        description: "This summary is no longer linked to a meeting.",
      });
    }
  };

  const isMatched = Boolean(matchedLabel);

  return (
    <div className="min-h-[100dvh] bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-lg border-b border-border/40">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button
            onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center active:scale-95 transition-transform"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          {tab === "notes" && (
            <button
              onClick={() => setIsEditing((v) => !v)}
              className="h-9 px-3 rounded-full bg-secondary flex items-center gap-1.5 text-sm font-medium active:scale-95 transition-transform"
            >
              {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              {isEditing ? "Cancel" : "Edit"}
            </button>
          )}
        </div>

        {/* Tab toggle */}
        <div className="flex items-center gap-6 px-5 pb-2">
          <button
            onClick={() => setTab("notes")}
            className={`relative text-base pb-1.5 transition-colors ${
              tab === "notes" ? "text-foreground font-semibold" : "text-muted-foreground font-medium"
            }`}
          >
            Notes
            {tab === "notes" && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-foreground rounded-full" />}
          </button>
          <button
            onClick={() => setTab("sources")}
            className={`relative text-base pb-1.5 transition-colors ${
              tab === "sources" ? "text-foreground font-semibold" : "text-muted-foreground font-medium"
            }`}
          >
            Source files
            {tab === "sources" && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-foreground rounded-full" />}
          </button>
        </div>
      </div>

      <div className="px-5 pt-5">
        {/* Title block */}
        <h1 className="text-2xl font-bold text-foreground leading-tight">{note.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" /> {note.hcp} · {note.hco}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {note.date} · {note.time} · {note.duration}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {isMatched ? (
            <button
              onClick={() => setMatchOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full active:scale-95 transition-transform"
            >
              <Link2 className="h-3 w-3" /> {matchedLabel}
              <span className="text-primary/60">· Rematch</span>
            </button>
          ) : (
            <button
              onClick={() => setMatchOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-500/10 px-2.5 py-1 rounded-full active:scale-95 transition-transform"
            >
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Not matched · tap to match
            </button>
          )}
        </div>
        {(submitted || note.submitted) && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full ml-2">
            <Check className="h-3 w-3" /> In IO Engage
          </p>
        )}

        {!isMatched && (
          <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2.5">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Not submitted to IO Engage</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                We couldn't automatically match this note to a meeting, so we don't know where to file
                it. Match it to a meeting to enable submission.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 h-8 rounded-lg border-amber-500/40 text-amber-700 hover:bg-amber-500/10"
                onClick={() => setMatchOpen(true)}
              >
                <Link2 className="h-3.5 w-3.5" /> Match to a meeting
              </Button>
            </div>
          </div>
        )}
      </div>

      {tab === "notes" ? (
        <div className="px-5 pt-6 space-y-6">
          {/* Summary */}
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">Summary</h2>
            {isEditing ? (
              <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} className="min-h-[100px]" />
            ) : (
              <p className="text-[15px] text-foreground/90 leading-relaxed">{summary}</p>
            )}
          </section>

          {/* Key points */}
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">Key takeaways</h2>
            {isEditing ? (
              <Textarea
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                className="min-h-[120px]"
                placeholder="One takeaway per line"
              />
            ) : (
              <ul className="space-y-2">
                {keyPoints.split("\n").filter(Boolean).map((p, i) => (
                  <li key={i} className="flex gap-2.5 text-[15px] text-foreground/90 leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Actions */}
          <section>
            <h2 className="text-base font-semibold text-foreground mb-2">Next actions</h2>
            {isEditing ? (
              <Textarea
                value={actions}
                onChange={(e) => setActions(e.target.value)}
                className="min-h-[100px]"
                placeholder="One action per line"
              />
            ) : (
              <ul className="space-y-2">
                {actions.split("\n").filter(Boolean).map((a, i) => (
                  <li key={i} className="flex gap-2.5 text-[15px] text-foreground/90 leading-relaxed">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : (
        <div className="px-5 pt-6">
          {/* Audio player mock */}
          <div className="flex items-center gap-3 rounded-2xl bg-secondary px-4 py-3">
            <div className="h-9 w-9 rounded-full bg-background flex items-center justify-center shadow-sm">
              <Play className="h-4 w-4 text-foreground fill-foreground" />
            </div>
            <div className="flex-1 flex items-center gap-px h-8 overflow-hidden">
              {Array.from({ length: 40 }).map((_, i) => (
                <span
                  key={i}
                  className="flex-1 bg-muted-foreground/40 rounded-full"
                  style={{ height: `${20 + Math.abs(Math.sin(i)) * 70}%` }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">00:00</span>
          </div>

          {/* Transcript */}
          <div className="mt-5 space-y-5">
            {note.transcript.map((line, i) => (
              <div key={i}>
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full bg-secondary pl-1.5 pr-3 py-1">
                    <span
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-semibold text-white ${
                        line.color ?? "bg-primary"
                      }`}
                    >
                      {line.initial ?? line.speaker.charAt(0)}
                    </span>
                    <span className="text-sm font-medium text-foreground">{line.speaker}</span>
                  </div>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {line.start} - {line.end}
                  </span>
                </div>
                <p className="mt-2 text-[15px] text-foreground/90 leading-relaxed">{line.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit bar — only when editing notes */}
      {tab === "notes" && isEditing && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-4 border-t border-border bg-background/95 backdrop-blur-lg pb-safe">
          {isMatched ? (
            <Button onClick={handleSubmit} className="w-full max-w-lg mx-auto flex gap-2 rounded-xl h-12">
              <Send className="h-4 w-4" />
              Submit to IO Engage
            </Button>
          ) : (
            <Button
              onClick={() => setMatchOpen(true)}
              variant="outline"
              className="w-full max-w-lg mx-auto flex gap-2 rounded-xl h-12 border-amber-500/40 text-amber-700"
            >
              <Link2 className="h-4 w-4" />
              Match a meeting to submit
            </Button>
          )}
        </div>
      )}

      {/* Match / rematch meeting drawer */}
      <Drawer open={matchOpen} onOpenChange={setMatchOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader className="text-left">
              <DrawerTitle>{isMatched ? "Rematch meeting" : "Match to a meeting"}</DrawerTitle>
              <DrawerDescription>
                Link this summary to the right meeting from your calendar.
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 pb-2 space-y-2 max-h-[50vh] overflow-y-auto">
              {candidateMeetings.map((m) => {
                const active = matchedLabel === `Matched to your ${m.time} meeting`;
                return (
                  <button
                    key={m.id}
                    onClick={() => handleRematch(m.time)}
                    className={`w-full flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${
                      active ? "border-primary bg-primary/5" : "border-border bg-card active:bg-secondary"
                    }`}
                  >
                    <span className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-foreground">{m.time}</span>
                      <span className="block text-xs text-muted-foreground truncate">
                        {m.hcp} · {m.hco}
                      </span>
                    </span>
                    {active && <Check className="h-4 w-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>

            <DrawerFooter>
              {isMatched && (
                <Button variant="ghost" className="text-destructive" onClick={() => handleRematch(null)}>
                  Remove match
                </Button>
              )}
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AppNoteDetail;