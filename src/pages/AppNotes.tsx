import { BottomNav } from "@/components/app/BottomNav";
import jarvisLogo from "@/assets/jarvis-logo.svg";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sparkles, ChevronRight, FileText } from "lucide-react";
import { noteAiSummaries } from "@/data/noteAiSummaries";

const AppProfile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 bg-gradient-to-b from-primary/[0.03] to-background">
        <div className="flex items-center gap-4">
          <img src={jarvisLogo} alt="Jarvis" className="h-12 w-12" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Profile</h1>
            <p className="text-sm text-muted-foreground">Your settings</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-4">
        <div className="p-4 bg-card rounded-xl border border-border/40">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold text-primary">JD</span>
            </div>
            <div>
              <h2 className="font-semibold text-foreground">John Doe</h2>
              <p className="text-sm text-muted-foreground">jdoe@novonordisk.com</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-card rounded-xl border border-border/40">
          <div className="space-y-3">
            <button className="w-full text-left py-3 text-sm text-foreground border-b border-border/30">
              Notifications
            </button>
            <button className="w-full text-left py-3 text-sm text-foreground border-b border-border/30">
              Support
            </button>
            <button 
              onClick={logout}
              className="w-full text-left py-3 text-sm text-destructive"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Note AI Section */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground leading-none">Note AI</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Recorded meetings, transcribed into ready-to-use notes
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border/40 divide-y divide-border/30 overflow-hidden">
            <p className="px-4 pt-3 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Recent meeting notes
            </p>
            {noteAiSummaries.slice(0, 10).map((note) => (
              <button
                key={note.id}
                onClick={() => navigate(`/app/note/${note.id}`)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-secondary/50 transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{note.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {note.hcp} · {note.date} · {note.duration}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AppProfile;
