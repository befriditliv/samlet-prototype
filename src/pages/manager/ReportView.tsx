import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ArrowLeft,
  Calendar,
  Users,
  Download,
  Share2,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import jarvisLogo from "@/assets/jarvis-logo.svg";
import { NavigationMenu } from "@/components/NavigationMenu";
import { AskJarvisManager } from "@/components/manager/AskJarvis";
import { HcpSearch } from "@/components/HcpSearch";
import { ExecutiveSummary } from "@/components/manager/report/ExecutiveSummary";
import { SentimentAnalysis } from "@/components/manager/report/SentimentAnalysis";
import { RobustnessIndicators } from "@/components/manager/report/RobustnessIndicators";
import { StatementOverview } from "@/components/manager/report/StatementOverview";
import { DataFilters } from "@/components/manager/report/DataFilters";

interface DebriefItem {
  id: string;
  date: string;
  hcoName: string;
  salesRep: string;
  hcps: string[];
  meetingPurpose: string;
  objections: string;
  nextSteps: string;
}

interface ObjectionCategory {
  id: string;
  title: string;
  fullTitle: string;
  description: string;
  color: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  debriefs: DebriefItem[];
}

interface ReportData {
  reportType: string;
  dateRange: { from: Date; to: Date };
  compareDateRange?: { from: Date; to: Date };
  product: string;
  employee: string;
  compareEnabled: boolean;
}

// Sales reps
const salesReps = ["SQIE", "HRWT", "AGSN", "WNLM", "BKET", "JMOR", "KLSE", "PNRD"];

// Mock data for sentiment analysis
const sentimentData = [
  { month: 'Jul', positive: 65, neutral: 25, negative: 10 },
  { month: 'Aug', positive: 60, neutral: 28, negative: 12 },
  { month: 'Sep', positive: 55, neutral: 30, negative: 15 },
  { month: 'Okt', positive: 62, neutral: 25, negative: 13 },
  { month: 'Nov', positive: 68, neutral: 22, negative: 10 },
  { month: 'Dec', positive: 72, neutral: 20, negative: 8 },
];

// Mock data for top categories (matches PDF structure)
const topCategories = [
  { label: "Ingen indvendinger ved opstart af Ozempic", count: 111, color: "#16a34a" },
  { label: "Interesse for opfølgning og yderligere information om Ozempic", count: 39, color: "#3b82f6" },
  { label: "Spørgsmål og behov for afklaring vedrørende Ozempic", count: 35, color: "#f59e0b" },
];

// Mock data for robustness indicators
const usedSources = [
  { label: "Interaction", participants: ["Lene Petersen", "Henrik Pals"], date: "2025-09-04", count: 2 },
  { label: "Interaction", participants: ["Stine Vedel Andersen", "Nina Lone Thyman", "Maria Viktoria Ris-Petersen"], date: "2025-09-26", count: 1 },
  { label: "Interaction", participants: ["Jensen", "Lise Hejberg Øhlenschlaeger"], date: "2025-11-18", count: 1 },
  { label: "Interaction", participants: ["Anne Sofie Vedel", "Rgskov Henrttmbjrn Sn Harte Trojahn"], date: "2025-10-27", count: 1 },
  { label: "Interaction", participants: ["Mia Dam Lekke", "Mai Brit Pedersen"], date: "2025-11-05", count: 1 },
];

// Mock data for statements
const statements = [
  {
    id: "1",
    hcpType: "Physician",
    date: "okt. 02, 2025",
    quote: "Der blev rejst indvendinger omkring regionens klausul fortolkning i forbindelse med opstart af en Ozempic-patient.",
    interactionRef: "Interaction: Aftab Rehmat - 2025-10-02"
  },
  {
    id: "2",
    hcpType: "Physician, Nurse",
    date: "nov. 19, 2025",
    quote: "Der blev ikke nævnt nogen indvendinger eller spørgsmål fra HCP'erne vedrørende opstart af Ozempic-patienter.",
    interactionRef: "Interaction: Team meeting - 2025-11-19"
  },
  {
    id: "3",
    hcpType: "Nurse",
    date: "nov. 18, 2025",
    quote: "HCP'en havde ingen indvendinger eller bekymringer omkring opstart af Ozempic.",
    interactionRef: "Interaction: Amaal Muuse, Marie Gaarde-Nissen Arnoldus - 2025-11-18"
  },
  {
    id: "4",
    hcpType: "Physician",
    date: "okt. 15, 2025",
    quote: "Bekymring over at skifte velbehandlede insulinpatienter til Ozempic, især når deres HbA1c-niveauer er tilfredsstillende.",
    interactionRef: "Interaction: Dr. Lars Andersen - 2025-10-15"
  },
  {
    id: "5",
    hcpType: "Nurse Practitioner",
    date: "nov. 22, 2025",
    quote: "Der er interesse for mere viden om Score2 diabetes og hypoglykaemi i forbindelse med Ozempic-behandling.",
    interactionRef: "Interaction: Louise Gildsig - 2025-11-22"
  },
];

// Mock data for filter categories (Activity Types, Molecules, Brands)
const filterCategories = [
  {
    label: "Activity Types",
    items: [
      { name: "Field Visit", count: 85 },
      { name: "Virtual Meeting", count: 52 },
      { name: "Conference", count: 28 },
      { name: "Lunch & Learn", count: 20 },
    ]
  },
  {
    label: "Molecules",
    items: [
      { name: "Semaglutide", count: 142 },
      { name: "Liraglutide", count: 28 },
      { name: "Tirzepatide", count: 15 },
    ]
  },
  {
    label: "Brands",
    items: [
      { name: "Ozempic", count: 135 },
      { name: "Wegovy", count: 32 },
      { name: "Victoza", count: 18 },
    ]
  },
];

// Executive summary text
const executiveSummaryText = `I perioden fra slutningen af august til december 2025 har der været en række debatter og observationer omkring igangsættelse af Ozempic-patienter blandt HCP'erne, primært inden for almen praksis. Generelt er der en overvægt af rapporter, der indikerer, at der ikke er mødt indvendinger vedrørende opstart af Ozempic-patienter. Dette er blevet nævnt gentagne gange af både sygeplejersker og læger, hvilket tyder på en generel accept af produktet.

Der er dog også blevet rejst bekymringer og indvendinger i visse tilfælde. Nogle HCP'er har udtrykt bekymring over at skifte velbehandlede insulinpatienter til Ozempic, især når deres HbA1c-niveauer er tilfredsstillende. Der er også blevet nævnt pres fra regionerne og frygt for at komplicere behandlingerne, samt frustration over tilskudsklausulen.

Der har været diskussioner om doseringsalgoritmer, herunder brugen af 8 doser og 2 mg, hvilket indikerer en interesse for at optimere behandlingen. HCP'erne har også udtrykt interesse for mere viden om Score2 diabetes og hypoglykaemi.

Samlet set viser dataene, at der er en positiv tendens mod at igangsætte Ozempic-patienter, men der er stadig nogle bekymringer og spørgsmål, der skal adresseres for at sikre en glat implementering og optimal patientpleje.`;

// Category detail dialog data
interface CategoryDetail {
  category: typeof topCategories[0];
  relatedStatements: typeof statements;
}

const ReportView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reportData = location.state as ReportData | null;
  const [selectedCategory, setSelectedCategory] = useState<CategoryDetail | null>(null);
  const [expandedDebriefs, setExpandedDebriefs] = useState<string[]>([]);

  // Fallback data if navigated directly
  const data: ReportData = reportData || {
    reportType: "Debrief Report",
    dateRange: { from: new Date(2025, 7, 15), to: new Date(2025, 11, 18) },
    compareDateRange: { from: new Date(2025, 4, 1), to: new Date(2025, 7, 14) },
    product: "Ozempic",
    employee: "all",
    compareEnabled: true
  };

  const totalDebriefs = topCategories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <>
      {/* Category Detail Dialog */}
      <Dialog open={!!selectedCategory} onOpenChange={(open) => !open && setSelectedCategory(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedCategory && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold pr-8 flex items-center gap-3">
                  <div 
                    className="h-4 w-4 rounded-full shrink-0" 
                    style={{ backgroundColor: selectedCategory.category.color }} 
                  />
                  {selectedCategory.category.label}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {selectedCategory.category.count}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    forekomster i perioden
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    Relaterede statements ({selectedCategory.relatedStatements.length})
                  </h4>
                  
                  <div className="space-y-3">
                    {selectedCategory.relatedStatements.map((statement) => (
                      <div 
                        key={statement.id}
                        className="p-4 rounded-lg border bg-muted/10"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {statement.hcpType}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{statement.date}</span>
                        </div>
                        <p className="text-sm text-foreground italic">"{statement.quote}"</p>
                        <p className="text-xs text-muted-foreground mt-2">{statement.interactionRef}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
        {/* Header */}
        <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-6 py-5">
            <div className="flex items-center gap-6">
              <img src={jarvisLogo} alt="Jarvis Logo" className="h-14 w-14" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">Medical Insights Platform</h1>
                <p className="text-sm text-muted-foreground">Struktureret analyse af HCP feedback og markedsindsigter</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-full max-w-md">
                  <HcpSearch />
                </div>
                <AskJarvisManager />
                <NavigationMenu />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {/* Navigation */}
          <button 
            onClick={() => navigate('/manager')}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Tilbage til dashboard</span>
          </button>

          {/* Period Info Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Periode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {format(data.dateRange.from, "d. MMMM yyyy", { locale: da })} - {format(data.dateRange.to, "d. MMMM yyyy", { locale: da })}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Produkt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="text-sm">{data.product || "Ozempic"}</Badge>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Brugere
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {salesReps.slice(0, 4).map((user) => (
                    <Badge key={user} variant="secondary" className="text-xs">{user}</Badge>
                  ))}
                  {salesReps.length > 4 && (
                    <Badge variant="outline" className="text-xs">+{salesReps.length - 4}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Full width layout matching PDF structure */}
          <div className="space-y-6">
            {/* Executive Summary */}
            <ExecutiveSummary 
              topCategories={topCategories}
              summaryText={executiveSummaryText}
            />

            {/* Two column grid for Sentiment and Robustness */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SentimentAnalysis data={sentimentData} />
              <RobustnessIndicators sources={usedSources} totalSources={6} />
            </div>

            {/* Data Filters - Activity Types, Molecules, Brands */}
            <DataFilters categories={filterCategories} />

            {/* Statement Overview */}
            <StatementOverview statements={statements} totalCount={200} />

            {/* Actions */}
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 gap-2" variant="default">
                    <Download className="h-4 w-4" />
                    Download rapport
                  </Button>
                  <Button className="flex-1 gap-2" variant="outline">
                    <Share2 className="h-4 w-4" />
                    Del rapport
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default ReportView;
