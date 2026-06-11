import { Home, MessageCircle, Mic, CircleUserRound } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "home" as const, path: "/app", label: "Home", icon: Home },
    { id: "jarvis" as const, path: "/app/jarvis", label: "Ask Jarvis", icon: MessageCircle },
    { id: "note" as const, path: "/app/note", label: "Note", icon: Mic },
    { id: "profile" as const, path: "/app/settings", label: "Profile", icon: CircleUserRound },
  ];

  const getActiveTab = () => {
    if (location.pathname === "/app/jarvis") return "jarvis";
    if (location.pathname.startsWith("/app/note")) return "note";
    if (location.pathname.startsWith("/app/settings")) return "profile";
    return "home";
  };

  const activeTab = getActiveTab();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="app-shell-bar flex items-center justify-around h-16 px-2 bg-background/70 backdrop-blur-2xl border-t border-border/40 sm:border-x-2 sm:border-white/40 shadow-[0_-8px_30px_-12px_hsl(222_47%_11%/0.12)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-w-[64px] gap-1 transition-all active:scale-95 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <span
                className={`flex items-center justify-center rounded-xl transition-all duration-300 ${
                  isActive ? "bg-primary/10 px-3 py-1" : "px-3 py-1"
                }`}
              >
                <Icon className={`h-[22px] w-[22px] ${isActive ? "stroke-[2.5px]" : ""}`} />
              </span>
              <span className={`text-[10px] leading-none ${isActive ? "font-bold" : "font-medium"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
