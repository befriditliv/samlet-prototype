import { BottomNav } from "@/components/app/BottomNav";
import { AppHeader } from "@/components/app/AppHeader";
import { useNavigate } from "react-router-dom";
import { ChevronRight, FileText, AlertCircle } from "lucide-react";
import { noteAiSummaries } from "@/data/noteAiSummaries";

const AppNotes = () => {
  const navigate = useNavigate();

  const unmatchedCount = noteAiSummaries
    .slice(0, 10)
    .filter((n) => !n.matchedMeeting).length;

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      <AppHeader title="Note" subtitle="AI notes from your meetings" />

      {/* Content */}
      <div className="px-4 space-y-4">
        {/* Note AI Section */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-3">
            <div>
              <h2 className="text-base font-semibold text-foreground leading-none">Note AI</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Recorded meetings, transcribed into ready-to-use notes
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/40 divide-y divide-border/30 overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Recent meeting notes
              </p>
              {unmatchedCount > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                  <AlertCircle className="h-3 w-3" />
                  {unmatchedCount} need a match
                </span>
              )}
            </div>
            {noteAiSummaries.slice(0, 10).map((note) => {
              const unmatched = !note.matchedMeeting;
              return (
              <button
                key={note.id}
                onClick={() => navigate(`/app/note/${note.id}`)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-secondary/50 transition-colors"
              >
                <div className="relative shrink-0">
                  <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {unmatched && (
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{note.title}</p>
                  {unmatched ? (
                    <p className="text-xs text-amber-600 truncate">
                      Not submitted · needs a meeting match
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground truncate">
                      {note.hcp} · {note.date} · {note.duration}
                    </p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AppNotes;
