import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ArrowLeft,
  Calendar,
  Users,
  Download,
  Share2,
  FileText,
  ChevronDown,
  ChevronUp,
  MessageSquareQuote,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import jarvisLogo from "@/assets/jarvis-logo.svg";
import { NavigationMenu } from "@/components/NavigationMenu";
import { AskJarvisManager } from "@/components/manager/AskJarvis";
import { HcpSearch } from "@/components/HcpSearch";

interface InsightReportData {
  title: string;
  query: string;
  dateRange: { from: Date; to: Date };
  product: string;
  employee: string;
}

interface InsightCategory {
  id: string;
  title: string;
  count: number;
  description: string;
  impact: 'positive' | 'neutral' | 'negative';
}

const insightCategories: InsightCategory[] = [
  { 
    id: '1', 
    title: 'Ingen indvendinger ved opstart af Ozempic', 
    count: 111,
    impact: 'positive',
    description: 'En stor del af HCP\'erne har ikke rapporteret nogen indvendinger ved opstart af Ozempic-patienter. Mange HCP\'er har nævnt, at der ikke er nogen specifikke indvendinger eller bekymringer vedrørende igangsættelse af Ozempic, og nogle har endda udtrykt positiv interesse for behandlingen.'
  },
  { 
    id: '2', 
    title: 'Interesse for opfølgning og yderligere information', 
    count: 39,
    impact: 'positive',
    description: 'Der er en generel interesse blandt HCP\'erne for opfølgning og yderligere information om Ozempic. Nogle HCP\'er har udtrykt interesse for opfølgende aftaler om forløbsplaner, og der er også interesse for materiale om hypoglykæmi og organbeskyttelse.'
  },
  { 
    id: '3', 
    title: 'Spørgsmål og behov for afklaring', 
    count: 35,
    impact: 'neutral',
    description: 'Flere HCP\'er har stillet spørgsmål og udtrykt behov for afklaring vedrørende Ozempic. Der er mange spørgsmål til algoritmen for dosering, herunder brug af 8 doser og 2 mg.'
  },
  { 
    id: '4', 
    title: 'Bekymringer og indvendinger ved opstart', 
    count: 20,
    impact: 'negative',
    description: 'Der er flere HCP\'er, der har udtrykt bekymringer og indvendinger ved opstart af Ozempic. Nogle af bekymringerne skyldes regionale krav om først at afprøve DPP-4-hæmmere.'
  },
];

interface Statement {
  id: string;
  role: string;
  date: string;
  quote: string;
  source: string;
}

const statementsByCategory: Record<string, Statement[]> = {
  '1': [
    { id: '1', role: 'Physician', date: 'nov. 19, 2025', quote: 'Der blev ikke nævnt nogen indvendinger fra HCP\'erne vedrørende opstart af Ozempic-patienter.', source: 'Team meeting - 2025-11-19' },
    { id: '2', role: 'Nurse', date: 'nov. 18, 2025', quote: 'HCP\'en havde ingen indvendinger eller bekymringer omkring opstart af Ozempic.', source: 'Amaal Muuse - 2025-11-18' },
  ],
  '2': [
    { id: '3', role: 'Physician', date: 'sep. 26, 2025', quote: 'Der er interesse for mere viden om Score2 diabetes og hypoglykaemi.', source: 'Stine Vedel Andersen - 2025-09-26' },
    { id: '4', role: 'Nurse', date: 'okt. 15, 2025', quote: 'Ønsker materiale om organbeskyttelse ved Ozempic.', source: 'Karen Nielsen - 2025-10-15' },
  ],
  '3': [
    { id: '5', role: 'Nurse', date: 'nov. 05, 2025', quote: 'Patienter udtrykker bekymring over doseringsalgoritmer, herunder brugen af 8 doser og 2 mg.', source: 'Mia Dam Lekke - 2025-11-05' },
    { id: '6', role: 'Physician', date: 'okt. 22, 2025', quote: 'Spørgsmål om krav til afprøvning af antidiabetika før Ozempic.', source: 'Lars Hansen - 2025-10-22' },
  ],
  '4': [
    { id: '7', role: 'Physician', date: 'okt. 02, 2025', quote: 'Der blev rejst indvendinger omkring regionens klausul fortolkning i forbindelse med opstart.', source: 'Aftab Rehmat - 2025-10-02' },
    { id: '8', role: 'Nurse', date: 'sep. 15, 2025', quote: 'Bekymring over at skifte velbehandlede insulinpatienter til Ozempic.', source: 'Peter Madsen - 2025-09-15' },
  ],
};

const allStatements = Object.values(statementsByCategory).flat();

const InsightReportView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reportData = location.state as InsightReportData | null;
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [showStatements, setShowStatements] = useState(false);

  const data: InsightReportData = reportData || {
    title: "Ozempic Initiation Insights",
    query: "hvad siger hcperne ift. ozempic initiering",
    dateRange: { from: new Date(2025, 6, 1), to: new Date(2025, 11, 31) },
    product: "Ozempic",
    employee: "all"
  };

  const toggleCategory = (id: string) => {
    setOpenCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // Show all statements when no themes are expanded, otherwise show statements for expanded themes
  const displayedStatements = openCategories.length === 0
    ? allStatements
    : openCategories.flatMap(id => statementsByCategory[id] || []);

  const activeTheme = openCategories.length === 1 
    ? insightCategories.find(c => c.id === openCategories[0])?.title 
    : openCategories.length > 1 
      ? `${openCategories.length} temaer` 
      : null;

  const totalStatements = insightCategories.reduce((sum, cat) => sum + cat.count, 0);
  
  // Calculate impact summary
  const positiveCount = insightCategories.filter(c => c.impact === 'positive').reduce((sum, c) => sum + c.count, 0);
  const negativeCount = insightCategories.filter(c => c.impact === 'negative').reduce((sum, c) => sum + c.count, 0);
  const neutralCount = insightCategories.filter(c => c.impact === 'neutral').reduce((sum, c) => sum + c.count, 0);
  
  const getImpactStyles = (impact: 'positive' | 'neutral' | 'negative', isOpen: boolean) => {
    if (impact === 'positive') {
      return isOpen 
        ? 'border-green-500 bg-green-50 dark:bg-green-950/30' 
        : 'border-green-200 hover:border-green-400 hover:bg-green-50/50 dark:border-green-900 dark:hover:bg-green-950/20';
    }
    if (impact === 'negative') {
      return isOpen 
        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30' 
        : 'border-orange-200 hover:border-orange-400 hover:bg-orange-50/50 dark:border-orange-900 dark:hover:bg-orange-950/20';
    }
    return isOpen 
      ? 'border-primary bg-primary/5' 
      : 'border-border hover:border-primary/50 hover:bg-muted/50';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            <img src={jarvisLogo} alt="Jarvis Logo" className="h-12 w-12" />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Insight Report</h1>
              <p className="text-sm text-muted-foreground">Medical Insights Platform</p>
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

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Back button and metadata */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/manager')}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Tilbage
          </Button>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {format(data.dateRange.from, "d. MMM", { locale: da })} - {format(data.dateRange.to, "d. MMM yyyy", { locale: da })}
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {data.employee === 'all' ? 'Alle' : data.employee}
            </div>
            <Badge variant="secondary">{data.product}</Badge>
          </div>
        </div>

        {/* Query */}
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground italic">"{data.query}"</p>
        </div>

        {/* Executive Summary */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">Executive Summary</h2>
          <div className="text-foreground/90 space-y-4 leading-relaxed">
            <p>
              I perioden fra slutningen af august til december 2025 har der været en række debatter og observationer omkring igangsættelse af Ozempic-patienter blandt HCP'erne, primært inden for almen praksis. Generelt er der en overvægt af rapporter, der indikerer, at der ikke er mødt indvendinger vedrørende opstart af Ozempic-patienter. Dette er blevet nævnt gentagne gange af både sygeplejersker og læger, hvilket tyder på en generel accept af produktet.
            </p>
            <p>
              Der er dog også blevet rejst bekymringer og indvendinger i visse tilfælde. Nogle HCP'er har udtrykt bekymring over at skifte velbehandlede insulinpatienter til Ozempic, især når deres HbA1c-niveauer er tilfredsstillende. Der er også blevet nævnt pres fra regionerne og frygt for at komplicere behandlingerne, samt frustration over tilskudsklausulen.
            </p>
          </div>
        </section>

        {/* Impact Overview */}
        <section className="mb-6">
          <div className="flex items-center gap-6 p-4 rounded-lg bg-muted/30 border">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30">
                <ThumbsUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <span className="text-lg font-semibold text-foreground">{positiveCount}</span>
                <span className="text-sm text-muted-foreground ml-1">positive</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                <span className="text-xs font-medium text-muted-foreground">~</span>
              </div>
              <div>
                <span className="text-lg font-semibold text-foreground">{neutralCount}</span>
                <span className="text-sm text-muted-foreground ml-1">neutrale</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30">
                <ThumbsDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <span className="text-lg font-semibold text-foreground">{negativeCount}</span>
                <span className="text-sm text-muted-foreground ml-1">udfordringer</span>
              </div>
            </div>
            <div className="flex-1" />
            <div className="h-2 flex-1 max-w-[200px] rounded-full overflow-hidden bg-muted flex">
              <div 
                className="h-full bg-green-500" 
                style={{ width: `${(positiveCount / totalStatements) * 100}%` }} 
              />
              <div 
                className="h-full bg-gray-400" 
                style={{ width: `${(neutralCount / totalStatements) * 100}%` }} 
              />
              <div 
                className="h-full bg-orange-500" 
                style={{ width: `${(negativeCount / totalStatements) * 100}%` }} 
              />
            </div>
          </div>
        </section>

        {/* Insights/Themes */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Temaer</h2>
          </div>
          
          <div className="space-y-2">
            {insightCategories.map((category) => (
              <Collapsible
                key={category.id}
                open={openCategories.includes(category.id)}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors text-left ${getImpactStyles(category.impact, openCategories.includes(category.id))}`}>
                    <div className="flex items-center gap-2">
                      {category.impact === 'positive' && (
                        <ThumbsUp className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
                      )}
                      {category.impact === 'negative' && (
                        <ThumbsDown className="h-4 w-4 text-orange-600 dark:text-orange-400 shrink-0" />
                      )}
                      <span className="text-sm font-medium text-foreground">
                        {category.title} <span className="text-muted-foreground">({category.count})</span>
                      </span>
                    </div>
                    <ChevronDown 
                      className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${
                        openCategories.includes(category.id) ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-3 py-3 text-sm text-muted-foreground leading-relaxed">
                    {category.description}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </section>

        {/* Supporting Statements - Collapsible */}
        <section className="mb-10">
          <Collapsible open={showStatements} onOpenChange={setShowStatements}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 rounded-lg border border-dashed hover:border-primary/50 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquareQuote className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Supporting Statements
                    {activeTheme && (
                      <span className="ml-1 text-primary">
                        — {activeTheme}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{displayedStatements.length} kilder</span>
                  {showStatements ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-3 space-y-3">
                {displayedStatements.map((statement) => (
                  <div key={statement.id} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{statement.role}</Badge>
                      <span className="text-xs text-muted-foreground">{statement.date}</span>
                    </div>
                    <p className="text-sm text-foreground/90 italic mb-2">"{statement.quote}"</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      {statement.source}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>

        {/* Actions - like Debrief Report */}
        <Card className="border-0 shadow-sm bg-muted/30">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Genereret: {format(new Date(), "d. MMMM yyyy", { locale: da })}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Del
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InsightReportView;
