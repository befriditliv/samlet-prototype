import jarvisLogo from "@/assets/jarvis-logo.svg";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const AppSettings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-background pb-10">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 bg-gradient-to-b from-primary/[0.03] to-background">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-muted-foreground mb-4 active:scale-95 transition-transform"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-center gap-4">
          <img src={jarvisLogo} alt="Jarvis" className="h-12 w-12" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">Your profile & preferences</p>
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
      </div>
    </div>
  );
};

export default AppSettings;
