import { useState, useEffect } from "react";
import { EmployeeOverview } from "@/components/manager/EmployeeOverview";
import { InsightTools } from "@/components/manager/InsightTools";
import { ActionCenter } from "@/components/ActionCenter";
import { HcpSearch } from "@/components/HcpSearch";
import { AskJarvisManager } from "@/components/manager/AskJarvis";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BookOpen, Menu, Lightbulb, BarChart3, Plus, Users, LogOut, Sun } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import jarvisLogo from "@/assets/jarvis-logo.svg";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDarkMode = savedTheme === "dark" || document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center gap-6">
            <img src={jarvisLogo} alt="Jarvis Logo" className="h-14 w-14" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Jarvis Manager</h1>
              <p className="text-sm text-muted-foreground">Team performance and coaching insights</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-full max-w-md">
                <HcpSearch />
              </div>
              <AskJarvisManager />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="py-6">
                    <h2 className="text-lg font-semibold mb-4">Menu</h2>
                    <nav className="flex flex-col gap-2">
                      <a href="/manager" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-foreground">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Dashboard
                      </a>
                      <a href="/manager/new-report" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-foreground">
                        <Plus className="h-5 w-5 text-primary" />
                        Create Report
                      </a>
                      <a href="/kundeoversigt" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-foreground">
                        <Users className="h-5 w-5 text-primary" />
                        Client Overview
                      </a>
                      <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-foreground">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Signals
                      </a>
                    </nav>

                    <Separator className="my-6" />

                    {/* Appearance Toggle */}
                    <div className="px-3 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sun className="h-5 w-5 text-foreground" />
                        <span className="font-medium text-foreground">Appearance</span>
                      </div>
                      <Switch 
                        checked={isDark} 
                        onCheckedChange={toggleTheme}
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 mb-3">
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">Manager</div>
                        <div className="text-xs text-muted-foreground truncate">Team Lead</div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-12">
        {/* Employee Overview */}
        <section id="employee-overview" className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Employee Overview</h2>
              <p className="text-sm text-muted-foreground">Track engagement, quality, and team progress</p>
            </div>
          </div>
          <EmployeeOverview />
        </section>

        {/* Signals */}
        <section id="signals">
          <ActionCenter />
        </section>

        {/* Analysis Tools */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Analysis Tools</h2>
              <p className="text-sm text-muted-foreground">Access insights and reports from meeting notes</p>
            </div>
          </div>
          <InsightTools />
        </section>
      </main>
    </div>
  );
};

export default ManagerDashboard;
