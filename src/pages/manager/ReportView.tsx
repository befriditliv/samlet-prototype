import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  BarChart3,
  Download,
  Share2
} from "lucide-react";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import jarvisLogo from "@/assets/jarvis-logo.svg";
import { NavigationMenu } from "@/components/NavigationMenu";
import { AskJarvisManager } from "@/components/manager/AskJarvis";
import { HcpSearch } from "@/components/HcpSearch";

interface ReportData {
  reportType: string;
  dateRange: { from: Date; to: Date };
  compareDateRange?: { from: Date; to: Date };
  product: string;
  employee: string;
  compareEnabled: boolean;
}

// Objection categories matching original layout
const objectionCategories = [
  {
    id: 'regional-interpretation',
    title: 'Indvendinger og bekymringer om regionens fortolkning af...',
    description: 'Denne kategori dækker indvendinger og bekymringer fra HCP\'en og HCO\'en om, hvordan regionens fortolkning af klausuler og retningslinjer påvirker behandling.',
  },
  {
    id: 'treatment-start',
    title: 'Ingen indvendinger eller bekymringer ved opstart af...',
    description: 'Denne kategori dækker statements, hvor HCP\'en eller HCO\'en udtrykker ingen bekymringer om opstart.',
  },
  {
    id: 'patient-treatment',
    title: 'Indvendinger og bekymringer om opstart af behandling hos patienter...',
    description: 'Denne kategori dækker indvendinger eller bekymringer om at starte behandling hos specifikke patientgrupper.',
  },
  {
    id: 'uncertainty',
    title: 'Usikkerhed',
    description: 'Denne kategori dækker statements, hvor HCP\'en eller HCO\'en udtrykker usikkerhed om tilskud, retningslinjer eller ansøgninger.',
  },
];

const ReportView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reportData = location.state as ReportData | null;

  // Fallback data if navigated directly
  const data: ReportData = reportData || {
    reportType: "Debrief Report",
    dateRange: { from: new Date(2025, 10, 18), to: new Date(2025, 11, 18) },
    compareDateRange: { from: new Date(2025, 7, 20), to: new Date(2025, 10, 17) },
    product: "all",
    employee: "all",
    compareEnabled: true
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center gap-6">
            <img src={jarvisLogo} alt="Jarvis Logo" className="h-14 w-14" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Debrief Insights</h1>
              <p className="text-sm text-muted-foreground">Struktureret analyse af HCP indvendinger og bekymringer</p>
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

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Navigation */}
        <button 
          onClick={() => navigate('/manager')}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Tilbage til dashboard</span>
        </button>

        {/* Stats Row - Matching original layout */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">977</div>
                <div className="text-sm text-muted-foreground mt-1">Møder i perioden</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">504 <span className="text-lg font-normal text-muted-foreground">(52%)</span></div>
                <div className="text-sm text-muted-foreground mt-1">Debriefs i perioden</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">0</div>
                <div className="text-sm text-muted-foreground mt-1">Relevante debriefs</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Period Info Row - Matching original structure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
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
          
          {data.compareEnabled && data.compareDateRange && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Sammenligningsperiode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {format(data.compareDateRange.from, "d. MMMM yyyy", { locale: da })} - {format(data.compareDateRange.to, "d. MMMM yyyy", { locale: da })}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Brugere
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {["SQIE", "HRWT", "AGSN", "WNLM", "BKET"].map((user) => (
                  <Badge key={user} variant="secondary" className="text-xs">{user}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid - Matching original 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Analysis Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Kort oversigt */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Kort oversigt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Ingen emner er rapporteret for Ozempic eller andre produkter i den seneste periode. 
                  Der er ingen ændringer sammenlignet med tidligere perioder. 
                  <span className="text-foreground font-medium"> Anbefaling: </span>
                  Styrk indsamlingen af feedback og digitalt engagement for at sikre, at relevante indsigter identificeres og adresseres.
                </p>
              </CardContent>
            </Card>

            {/* Overskrift / Main Topic */}
            <Card>
              <CardHeader>
                <CardTitle>Ingen aktuelle emner rapporteret for Ozempic eller andre produkter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Emnebeskrivelse */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Emnebeskrivelse</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Der er ingen registrerede emner eller indsigter i den seneste rapporteringsperiode. 
                    Ingen HCP'er eller HCO'er har rapporteret bekymringer, spørgsmål eller feedback relateret til Ozempic eller andre produkter.
                  </p>
                </div>

                <Separator />

                {/* Statistisk analyse */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Statistisk analyse
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">Ingen emner er registreret i den aktuelle periode</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Sammenligning med tidligere perioder viser ingen ændringer, da der heller ikke er registreret emner i sammenligningsdata.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Ingen nye emner er opstået, og ingen tidligere emner er blevet løst eller adresseret.</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                {/* Indsigter */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Indsigter
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    Fraværet af rapporterede emner kan indikere enten manglende engagement, manglende indsamling af data, 
                    eller at der ikke er aktuelle problemstillinger blandt HCP'erne og HCO'erne.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span>For Ozempic er der ingen indikationer på nye indvendinger, barrierer eller feedback, 
                      hvilket kan tolkes som stabilitet, men også som et potentielt behov for at styrke digitalt engagement og dataindsamling.</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                {/* Konklusion og anbefalinger */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Konklusion og anbefalinger
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">Der observeres ingen trends eller ændringer i emnefrekvensen.</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Vurder om nuværende digitale engagement-initiativer er tilstrækkelige til at fremme dialog og indsamling af relevante indsigter.</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Indvendinger og bekymringer - Category Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Indvendinger og bekymringer
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {objectionCategories.map((category) => (
                  <Card key={category.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-5">
                      <h4 className="text-sm font-semibold text-foreground mb-2 line-clamp-2">{category.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button className="w-full gap-2" variant="outline">
                  <Download className="h-4 w-4" />
                  Download rapport
                </Button>
                <Button className="w-full gap-2" variant="outline">
                  <Share2 className="h-4 w-4" />
                  Del rapport
                </Button>
              </CardContent>
            </Card>

            {/* Emner - Topics Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Emner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Kendte emner</span>
                  <Badge variant="secondary">0</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Nye emner</span>
                  <Badge variant="secondary">0</Badge>
                </div>
                <div className="pt-4 text-center text-sm text-muted-foreground">
                  Ingen emner i den valgte periode
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportView;