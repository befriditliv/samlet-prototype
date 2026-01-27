import { EmployeeOverview } from "@/components/EmployeeOverview";
import { InsightTools } from "@/components/InsightTools";
import { HcpSearch } from "@/components/HcpSearch";
import { AskJarvis } from "@/components/AskJarvis";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Menu, Lightbulb, User, Building2, BarChart3, Plus, Users, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import jarvisLogo from "@/assets/jarvis-logo.svg";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

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
              <AskJarvis />
              <ThemeToggle />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="py-6">
                    <h2 className="text-lg font-semibold mb-4">Menu</h2>
                    <nav className="space-y-2">
                      <Button variant="ghost" className="w-full justify-start gap-3">
                        <BarChart3 className="h-4 w-4" />
                        Dashboard
                      </Button>
                      <Button variant="ghost" className="w-full justify-start gap-3">
                        <Plus className="h-4 w-4" />
                        Create Report
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-3"
                        onClick={() => navigate("/kundeoversigt")}
                      >
                        <User className="h-4 w-4" />
                        HCP
                      </Button>
                      <Button variant="ghost" className="w-full justify-start gap-3">
                        <Building2 className="h-4 w-4" />
                        HCO
                      </Button>
                      <Button variant="ghost" className="w-full justify-start gap-3">
                        <BookOpen className="h-4 w-4" />
                        Activity Hub
                      </Button>
                    </nav>
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
                      Log ud
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
        <section>
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/30">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Employee Overview</CardTitle>
                  <CardDescription>Track engagement, quality, and team progress</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <EmployeeOverview />
            </CardContent>
          </Card>
        </section>

        {/* Analysis Tools */}
        <section>
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-accent/30 to-primary/10">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Analysis Tools</CardTitle>
                  <CardDescription>Access insights and reports from meeting notes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <InsightTools />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default ManagerDashboard;
