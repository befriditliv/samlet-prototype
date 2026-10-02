import { BarChart3, BookOpen, Clock3, Users } from "lucide-react";
import { EmployeeOverview } from "@/components/manager/EmployeeOverview";
import { InsightTools } from "@/components/manager/InsightTools";
import { ManagerPeriodControl } from "@/components/manager/ManagerPeriodControl";
import { HcpSearch } from "@/components/HcpSearch";
import { AskJarvisManager } from "@/components/manager/AskJarvis";
import { NavigationMenu } from "@/components/NavigationMenu";
import { Badge } from "@/components/ui/badge";
import { useManagerPeriod } from "@/hooks/use-manager-period";
import jarvisLogo from "@/assets/jarvis-logo.svg";

const ManagerDashboard = () => {
  const { period, setPeriod, option, hasFixture } = useManagerPeriod();
  return <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
    <header className="sticky top-0 z-10 border-b bg-card/90 shadow-sm backdrop-blur-sm"><div className="container mx-auto px-4 py-4 sm:px-6"><div className="flex flex-wrap items-center gap-4"><img src={jarvisLogo} alt="Jarvis Logo" className="h-12 w-12" /><div className="min-w-48 flex-1"><div className="flex items-center gap-2"><h1 className="text-2xl font-bold text-foreground">Team overview</h1><Badge variant="secondary">Demo</Badge></div><p className="text-sm text-muted-foreground">Copenhagen region</p></div><ManagerPeriodControl value={period} onChange={setPeriod} range={option.range} /><div className="hidden w-64 lg:block"><HcpSearch /></div><AskJarvisManager /><NavigationMenu /></div><div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="h-3.5 w-3.5" />Data synced Oct 2, 2026 at 10:45 · Brief calculated at 10:48</div></div></header>
    <main className="container mx-auto space-y-12 px-4 py-8 sm:px-6">{hasFixture ? <EmployeeOverview /> : <div className="rounded-lg border bg-card p-10 text-center"><h2 className="font-semibold">No prepared demo data for this period</h2><p className="mt-2 text-sm text-muted-foreground">Choose 30 days to view the traceable manager demo fixture.</p></div>}
      <section className="space-y-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2.5"><BookOpen className="h-5 w-5 text-primary" /></div><div><h2 className="text-xl font-bold">Analysis and reports</h2><p className="text-sm text-muted-foreground">Existing manager tools</p></div></div><InsightTools /></section>
    </main>
  </div>;
};
export default ManagerDashboard;
