import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/app/AppHeader";

const AppSettings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-background pb-10">
      <AppHeader title="Settings" subtitle="Your profile & preferences" onBack={() => navigate(-1)} />

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
