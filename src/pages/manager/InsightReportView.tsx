import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  ArrowLeft,
  Calendar,
  Users,
  Download,
  Share2,
  FileText,
  ChevronDown
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
}

const insightCategories: InsightCategory[] = [
  { 
    id: '1', 
    title: 'Ingen indvendinger ved opstart af Ozempic', 
    count: 111,
    description: 'En stor del af HCP\'erne har ikke rapporteret nogen indvendinger ved opstart af Ozempic-patienter. Mange HCP\'er har nævnt, at der ikke er nogen specifikke indvendinger eller bekymringer vedrørende igangsættelse af Ozempic, og nogle har endda udtrykt positiv interesse for behandlingen. Der er også HCP\'er, der har nævnt, at mange patienter er genstartet på Ozempic, hvilket indikerer en generel accept af behandlingen.'
  },
  { 
    id: '2', 
    title: 'Interesse for opfølgning og yderligere information om Ozempic', 
    count: 39,
    description: 'Der er en generel interesse blandt HCP\'erne for opfølgning og yderligere information om Ozempic. Nogle HCP\'er har udtrykt interesse for opfølgende aftaler om forløbsplaner i relation til Ozempic, og der er også interesse for materiale om hypoglykæmi og organbeskyttelse. HCP\'erne er opmærksomme på opfølgning af patienter, hvor Ozempic er seponeret, og der er interesse for mere viden om Score2 diabetes. Der er også interesse for dialog om kommende behandlingsalgoritmer for Type 2 Diabetes.'
  },
  { 
    id: '3', 
    title: 'Spørgsmål og behov for afklaring vedrørende Ozempic', 
    count: 35,
    description: 'Flere HCP\'er har stillet spørgsmål og udtrykt behov for afklaring vedrørende Ozempic. Der er mange spørgsmål til algoritmen for dosering af Ozempic, herunder brug af 8 doser og 2 mg. HCP\'er har også spurgt ind til krav om afprøvning af antidiabetika før Ozempic, og der er behov for yderligere information om tilskud til Ozempic. Der er også interesse for at kunne skelne mellem patienter med høj og lav risiko, og hvem der har mest gavn af vægttabsbehandling med Ozempic.'
  },
  { 
    id: '4', 
    title: 'Bekymringer og indvendinger ved opstart af Ozempic', 
    count: 20,
    description: 'Der er flere HCP\'er, der har udtrykt bekymringer og indvendinger ved opstart af Ozempic. Nogle af bekymringerne skyldes regionale krav om først at afprøve DPP-4-hæmmere, mens andre HCP\'er har rejst bekymringer omkring patienters compliance med medicinindtag. Der er også bekymringer om, at mange patienter allerede er i mål med SGLT-2 og DPP4 hæmmede, uden GLP-1, hvilket kan påvirke beslutningen om at starte Ozempic. Der er også indvendinger omkring regionens klausul fortolkning og udfordringen ved at skifte velbehandlede insulinpatienter til Ozempic.'
  },
];

const statements = [
  {
    id: '1',
    role: 'Physician',
    date: 'okt. 02, 2025',
    quote: 'Der blev rejst indvendinger omkring regionens klausul fortolkning i forbindelse med opstart af en Ozempic-patient.',
    source: 'Interaction: Aftab Rehmat - 2025-10-02',
  },
  {
    id: '2',
    role: 'Physician, Nurse',
    date: 'nov. 19, 2025',
    quote: 'Der blev ikke nævnt nogen indvendinger eller spørgsmål fra HCP\'erne vedrørende opstart af Ozempic-patienter.',
    source: 'Interaction: Team meeting - 2025-11-19',
  },
  {
    id: '3',
    role: 'Nurse',
    date: 'nov. 18, 2025',
    quote: 'HCP\'en havde ingen indvendinger eller bekymringer omkring opstart af Ozempic.',
    source: 'Interaction: Amaal Muuse, Marie Gaarde-Nissen Arnoldus - 2025-11-18',
  },
  {
    id: '4',
    role: 'Physician',
    date: 'sep. 26, 2025',
    quote: 'Der er interesse for mere viden om Score2 diabetes og hypoglykaemi, hvilket kan være relevant for patienternes behandling med Ozempic.',
    source: 'Interaction: Stine Vedel Andersen, Nina Lone Thyman - 2025-09-26',
  },
  {
    id: '5',
    role: 'Nurse',
    date: 'nov. 05, 2025',
    quote: 'Patienter udtrykker bekymring over doseringsalgoritmer, herunder brugen af 8 doser og 2 mg.',
    source: 'Interaction: Mia Dam Lekke, Mai Brit Pedersen - 2025-11-05',
  },
  {
    id: '6',
    role: 'Physician',
    date: 'okt. 15, 2025',
    quote: 'Der er behov for mere information om hvornår man skal skifte fra insulin til Ozempic.',
    source: 'Interaction: Lars Hansen - 2025-10-15',
  },
  {
    id: '7',
    role: 'Nurse',
    date: 'nov. 22, 2025',
    quote: 'Patienterne er generelt positive overfor Ozempic-behandlingen.',
    source: 'Interaction: Karen Nielsen - 2025-11-22',
  },
  {
    id: '8',
    role: 'Physician',
    date: 'dec. 01, 2025',
    quote: 'Vi ser gode resultater med Ozempic hos patienter med høj kardiovaskulær risiko.',
    source: 'Interaction: Peter Madsen - 2025-12-01',
  },
];

const ITEMS_PER_PAGE = 4;

const InsightReportView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reportData = location.state as InsightReportData | null;
  const [openCategories, setOpenCategories] = useState<string[]>(['1']);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(statements.length / ITEMS_PER_PAGE);
  const paginatedStatements = statements.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

      <main className="container mx-auto px-6 py-8">
        {/* Back button and metadata */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/manager')}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {format(data.dateRange.from, "d. MMM", { locale: da })} - {format(data.dateRange.to, "d. MMM yyyy", { locale: da })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{data.employee === 'all' ? 'Alle medarbejdere' : data.employee}</span>
            </div>
            <Badge variant="outline">{data.product}</Badge>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Insights */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-lg font-semibold text-foreground mb-4">Insights</h2>
            
            {insightCategories.map((category) => (
              <Collapsible
                key={category.id}
                open={openCategories.includes(category.id)}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between p-3 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors text-left">
                    <span className="text-sm font-medium text-primary leading-snug pr-2">
                      {category.title} ({category.count})
                    </span>
                    <ChevronDown 
                      className={`h-4 w-4 text-primary shrink-0 transition-transform ${
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

          {/* Right column - Executive Summary */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Executive Summary</h2>
              <p className="text-muted-foreground mb-6">{data.query}</p>
              
              <div className="prose prose-sm max-w-none text-foreground/90 space-y-4">
                <p>
                  I perioden fra slutningen af august til december 2025 har der været en række debatter og observationer omkring igangsættelse af Ozempic-patienter blandt HCP'erne, primært inden for almen praksis. Generelt er der en overvægt af rapporter, der indikerer, at der ikke er mødt indvendinger vedrørende opstart af Ozempic-patienter. Dette er blevet nævnt gentagne gange af både sygeplejersker og læger, hvilket tyder på en generel accept af produktet.
                </p>
                <p>
                  Der er dog også blevet rejst bekymringer og indvendinger i visse tilfælde. Nogle HCP'er har udtrykt bekymring over at skifte velbehandlede insulinpatienter til Ozempic, især når deres HbA1c-niveauer er tilfredsstillende. Der er også blevet nævnt pres fra regionerne og frygt for at komplicere behandlingerne, samt frustration over tilskudsklausulen, som kan forhindre nogle patienter i at få adgang til Ozempic.
                </p>
                <p>
                  Der har været diskussioner om doseringsalgoritmer, herunder brugen af 8 doser og 2 mg, hvilket indikerer en interesse for at optimere behandlingen. HCP'erne har også udtrykt interesse for mere viden om Score2 diabetes og hypoglykæmi, hvilket kan være relevant for patienternes behandling med Ozempic.
                </p>
              </div>
            </div>

            {/* Statement Overview */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Statement Overview</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {statements.length} statements
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {paginatedStatements.map((statement) => (
                  <div key={statement.id} className="p-4 rounded-lg border bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{statement.role}</Badge>
                      <span className="text-xs text-muted-foreground">{statement.date}</span>
                    </div>
                    <blockquote className="text-sm text-foreground italic mb-3 pl-3 border-l-2 border-primary/30">
                      "{statement.quote}"
                    </blockquote>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      <span>{statement.source}</span>
                    </div>
                  </div>
                ))}

                {totalPages > 1 && (
                  <Pagination className="mt-6">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Rapport genereret: {format(new Date(), "d. MMMM yyyy 'kl.' HH:mm", { locale: da })}
              </div>
              <div className="flex items-center gap-3">
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default InsightReportView;
