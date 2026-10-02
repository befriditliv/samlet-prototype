import { Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EmployeeOverview } from "@/components/manager/EmployeeOverview";
import { ManagerFilters } from "@/components/manager/ManagerFilters";
import { HcpSearch } from "@/components/HcpSearch";
import { AskJarvisManager } from "@/components/manager/AskJarvis";
import { NavigationMenu } from "@/components/NavigationMenu";
import { useManagerPeriod } from "@/hooks/use-manager-period";
import jarvisLogo from "@/assets/jarvis-logo.svg";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { period, setPeriod, option, hasFixture } = useManagerPeriod();
  return <div className="min-h-screen bg-background">
    <header className="border-b bg-card shadow-sm"><div className="container mx-auto px-4 py-4 sm:px-6"><div className="flex flex-wrap items-center gap-4"><img src={jarvisLogo} alt="Jarvis" className="h-12 w-12" /><div className="min-w-48 flex-1"><h1 className="text-2xl font-bold">Distrikt Øst</h1><p className="text-sm text-muted-foreground">Mette Dalsgaard · 6 medarbejdere</p></div><div className="hidden w-64 lg:block"><HcpSearch /></div><AskJarvisManager /><NavigationMenu /></div><div className="mt-2 flex justify-end gap-4 text-xs text-muted-foreground"><span>Data synkroniseret 2. okt 10:45</span><span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />Beregnet 2. okt 10:48</span></div></div></header>
    <main className="container mx-auto space-y-8 px-4 py-7 sm:px-6"><ManagerFilters period={period} onPeriodChange={setPeriod} range={option.range} onEmployeeChange={(slug) => slug !== "all" && navigate(`/manager/employee/${slug}`)} />{hasFixture ? <EmployeeOverview /> : <div className="rounded-md border bg-card p-10 text-center"><h2 className="font-semibold">Ingen forberedte demodata for denne periode</h2><p className="mt-2 text-sm text-muted-foreground">Vælg Seneste 30 dage for at se de sporbare demodata.</p></div>}</main>
  </div>;
};

export default ManagerDashboard;