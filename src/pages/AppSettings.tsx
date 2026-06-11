import { useAuth } from "@/contexts/AuthContext";
import { AppHeader } from "@/components/app/AppHeader";
import { BottomNav } from "@/components/app/BottomNav";
import { Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react";

const AppSettings = () => {
  const { logout } = useAuth();

  return (
    <div className="app-shell min-h-[100dvh] bg-background pb-20 sm:border-x sm:border-border/50">
      <AppHeader title="Profile" subtitle="Your profile & preferences" />

      {/* Content */}
      <div className="px-4 pt-4 space-y-4">
        {/* Profile card */}
        <div className="app-card p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">JD</span>
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-foreground truncate">John Doe</h2>
              <p className="text-sm text-muted-foreground truncate">jdoe@novonordisk.com</p>
            </div>
          </div>
        </div>

        {/* Settings list */}
        <div className="app-card divide-y divide-border/40 overflow-hidden">
          <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-secondary/50 transition-colors">
            <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <Bell className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="flex-1 text-sm font-medium text-foreground">Notifications</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-secondary/50 transition-colors">
            <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="flex-1 text-sm font-medium text-foreground">Support</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </button>
        </div>

        {/* Log out */}
        <button
          onClick={logout}
          className="app-card w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-secondary/50 transition-colors"
        >
          <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </div>
          <span className="flex-1 text-sm font-medium text-foreground">Log out</span>
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default AppSettings;
