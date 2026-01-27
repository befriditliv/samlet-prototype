import { HcpSearch } from "@/components/HcpSearch";
import { AskJarvis } from "@/components/AskJarvis";
import { DayCalendarView } from "@/components/DayCalendarView";
import { NavigationMenu } from "@/components/NavigationMenu";
import { ActionCenter } from "@/components/ActionCenter";
import jarvisLogo from "@/assets/jarvis-logo.svg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center gap-6">
            <img src={jarvisLogo} alt="Jarvis Logo" className="h-14 w-14" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Jarvis Key Account Manager</h1>
              <p className="text-sm text-muted-foreground">Smart account prioritization and engagement</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-full max-w-md">
                <HcpSearch />
              </div>
              <AskJarvis />
              <NavigationMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 space-y-12">
        {/* Action Center - Unified Smart Lists */}
        <section>
          <ActionCenter />
        </section>

        {/* Day Calendar View */}
        <section id="schedule">
          <DayCalendarView />
        </section>
      </main>
    </div>
  );
};

export default Index;