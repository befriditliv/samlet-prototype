import { BookOpen, Clock3 } from "lucide-react";
import { EmployeeOverview } from "@/components/manager/EmployeeOverview";
import { ActivityOverview } from "@/components/manager/ActivityOverview";
import { HomepageSignals, HomepageThemes, HomepageDebriefQuality } from "@/components/manager/HomepageInsights";
import { InsightTools } from "@/components/manager/InsightTools";
import { ManagerPeriodControl } from "@/components/manager/ManagerPeriodControl";
import { RegionalCoverage } from "@/components/manager/RegionalCoverage";
import { HcpSearch } from "@/components/HcpSearch";
import { AskJarvisManager } from "@/components/manager/AskJarvis";
import { NavigationMenu } from "@/components/NavigationMenu";
import { Badge } from "@/components/ui/badge";
import { useManagerPeriod } from "@/hooks/use-manager-period";
import { syncLine } from "@/data/managerDemo";
import jarvisLogo from "@/assets/jarvis-logo.svg";

const ManagerDashboard = () => {
  const { period, setPeriod, option, hasFixture } = useManagerPeriod();
  return <div className="manager-view min-h-screen bg-background">
    <header className="sticky top-0 z-10 border-b bg-card/90 shadow-sm backdrop-blur-sm"><div className="container mx-auto px-4 py-4 sm:px-6"><div className="flex flex-wrap items-center gap-4"><img src={jarvisLogo} alt="Jarvis-logo" className="h-12 w-12" /><div className="min-w-48 flex-1"><div className="flex items-center gap-2"><h1 className="text-2xl font-bold text-foreground">Teamoverblik</h1><Badge variant="secondary">Demo</Badge></div><p className="text-sm text-muted-foreground">Region Hovedstaden</p></div><ManagerPeriodControl value={period} onChange={setPeriod} range={option.range} /><div className="hidden w-64 lg:block"><HcpSearch placeholder="Søg efter HCP'er eller HCO'er ..." /></div><AskJarvisManager /><NavigationMenu /></div><div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><Clock3 className="h-3.5 w-3.5" />{syncLine}</div></div></header>
    <main className="mx-auto max-w-7xl space-y-7 px-4 py-5 sm:px-6">{hasFixture ? <><section className="space-y-3"><div className="flex items-center gap-3"><BookOpen className="h-5 w-5 text-primary" /><div><h2 className="text-lg font-bold">Aktivitetsoversigt</h2><p className="text-xs text-muted-foreground">Kontakter og aktiviteter i den valgte periode</p></div></div><ActivityOverview /></section><HomepageDebriefQuality /><EmployeeOverview /><RegionalCoverage /><HomepageThemes /><HomepageSignals /></> : <div className="rounded-lg border bg-card p-10 text-center"><h2 className="font-semibold">Ingen forberedte demo-data for denne periode</h2><p className="mt-2 text-sm text-muted-foreground">Vælg 30 dage for at se det sporbare demo-datasæt.</p></div>}
      <section className="space-y-4"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2.5"><BookOpen className="h-5 w-5 text-primary" /></div><div><h2 className="text-xl font-bold">Analyse og rapporter</h2><p className="text-sm text-muted-foreground">Eksisterende managerværktøjer</p></div></div><InsightTools /></section>
    </main>
  </div>;
};
export default ManagerDashboard;
