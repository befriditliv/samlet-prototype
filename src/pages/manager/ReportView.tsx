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
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  BarChart3,
  Download,
  Share2,
  ChevronDown,
  ChevronRight,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import jarvisLogo from "@/assets/jarvis-logo.svg";
import { NavigationMenu } from "@/components/NavigationMenu";
import { AskJarvisManager } from "@/components/manager/AskJarvis";
import { HcpSearch } from "@/components/HcpSearch";

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

// Objection categories with debrief data
const objectionCategories: ObjectionCategory[] = [
  {
    id: 'regional-interpretation',
    title: 'Indvendinger og bekymringer om regionens fortolkning af...',
    fullTitle: 'Indvendinger og bekymringer om regionens fortolkning af klausuler og tilskud',
    description: 'Denne kategori dækker indvendinger og bekymringer fra HCP\'en og HCO\'en om, hvordan regionens fortolkning af klausuler og tilskud påvirker opstart og brug af behandlinger.',
    color: '#16a34a',
    count: 19,
    debriefs: [
      {
        id: '1',
        date: '15/10/25',
        hcoName: 'Rigshospitalet Endokrinologisk Afdeling',
        salesRep: 'SQIE',
        hcps: ['Dr. Lars Andersen', 'Dr. Maria Hansen'],
        meetingPurpose: 'Mødet fokuserede på regionale forskelle i tilskudsregler og hvordan dette påvirker behandlingsvalg.',
        objections: 'Der blev udtrykt bekymring om uensartet fortolkning af tilskudsregler mellem regioner.',
        nextSteps: 'Opfølgende møde planlagt for at gennemgå opdaterede retningslinjer.'
      }
    ]
  },
  {
    id: 'treatment-start',
    title: 'Ingen indvendinger eller bekymringer ved opstart af...',
    fullTitle: 'Ingen indvendinger eller bekymringer ved opstart af behandling',
    description: 'Denne kategori dækker statements, hvor HCP\'en eller HCO\'en udtrykker, at der ikke var indvendinger eller bekymringer ved opstart af behandling.',
    color: '#ea580c',
    count: 1,
    debriefs: [
      {
        id: '2',
        date: '08/09/25',
        hcoName: 'Lægepraksis Mogens Nørgaard Christiansen',
        salesRep: 'BKET',
        hcps: ['Louise Gildsig', 'Mogens Nørgaard Christiansen', 'Maja Abilgaard'],
        meetingPurpose: 'Mødet fokuserede på, hvornår GLP-1 er relevant, samt type 2 diabetes og selektion af patienter til Wegovy. Deltagerne kom hurtigt forbi NSU og DPP4 hæmmere og vurderede, at disse behandlinger ikke har stor relevans for deres type 2 diabetes patienter.',
        objections: 'Ozempic: Der var ingen indvendinger i forbindelse med opstart af en Ozempic patient.',
        nextSteps: 'Der er ingen ny aktivitet planlagt med deltagerne.'
      }
    ]
  },
  {
    id: 'patient-treatment',
    title: 'Indvendinger og bekymringer om opstart af behandling hos patienter...',
    fullTitle: 'Indvendinger og bekymringer om opstart af behandling hos patienter med velreguleret sygdom',
    description: 'Denne kategori dækker statements, hvor HCP\'en eller HCO\'en udtrykker indvendinger eller bekymringer om at starte behandling hos patienter, der allerede er velbehandlede.',
    color: '#1d4ed8',
    count: 1,
    debriefs: []
  },
  {
    id: 'uncertainty',
    title: 'Usikkerhed og behov for afklaring om tilskud og retningslinjer',
    fullTitle: 'Usikkerhed og behov for afklaring om tilskud og retningslinjer',
    description: 'Denne kategori dækker statements, hvor HCP\'en eller HCO\'en udtrykker usikkerhed om tilskud, retningslinjer eller ønsker afklaring på regler for behandling og ordination.',
    color: '#84cc16',
    count: 1,
    debriefs: []
  },
];

// Chart data showing topic trends over months
const topicTrendData = [
  { month: '08-25', regional: 2, treatment: 0, patient: 0, uncertainty: 0 },
  { month: '09-25', regional: 6, treatment: 1, patient: 1, uncertainty: 1 },
  { month: '10-25', regional: 4, treatment: 0, patient: 0, uncertainty: 0 },
  { month: '11-25', regional: 7, treatment: 0, patient: 0, uncertainty: 0 },
  { month: '12-25', regional: 0, treatment: 0, patient: 0, uncertainty: 0 },
  { month: 'Selected range', regional: 0, treatment: 0, patient: 0, uncertainty: 0 },
];

const ReportView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reportData = location.state as ReportData | null;
  const [selectedCategory, setSelectedCategory] = useState<ObjectionCategory | null>(null);
  const [expandedDebriefs, setExpandedDebriefs] = useState<string[]>([]);

  // Fallback data if navigated directly
  const data: ReportData = reportData || {
    reportType: "Debrief Report",
    dateRange: { from: new Date(2025, 10, 18), to: new Date(2025, 11, 18) },
    compareDateRange: { from: new Date(2025, 7, 20), to: new Date(2025, 10, 17) },
    product: "all",
    employee: "all",
    compareEnabled: true
  };

  const toggleDebrief = (id: string) => {
    setExpandedDebriefs(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  return (
    <>
    <Dialog open={!!selectedCategory} onOpenChange={(open) => !open && setSelectedCategory(null)}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        {selectedCategory && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold pr-8">
                {selectedCategory.fullTitle}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 mt-4">
              {/* Beskrivelse */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Beskrivelse</h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedCategory.description}
                </p>
              </div>

              {/* Refereret i debriefs */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Refereret i debriefs ({selectedCategory.debriefs.length})
                </h4>
                
                {selectedCategory.debriefs.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Ingen debriefs i denne kategori</p>
                ) : (
                  <div className="space-y-3">
                    {selectedCategory.debriefs.map((debrief) => (
                      <Collapsible 
                        key={debrief.id} 
                        open={expandedDebriefs.includes(debrief.id)}
                        onOpenChange={() => toggleDebrief(debrief.id)}
                      >
                        <div className="border rounded-lg overflow-hidden">
                          <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                              <div className="flex items-center gap-3">
                                {expandedDebriefs.includes(debrief.id) ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                                <div className="text-left">
                                  <div className="text-sm font-medium">{debrief.date}</div>
                                  <div className="text-sm text-muted-foreground">{debrief.hcoName}</div>
                                </div>
                              </div>
                              <Badge variant="outline" className="font-mono">{debrief.salesRep}</Badge>
                            </div>
                          </CollapsibleTrigger>
                          
                          <CollapsibleContent>
                            <div className="px-4 pb-4 space-y-4">
                              {/* Mødedetaljer */}
                              <div className="bg-muted/20 rounded-lg p-4">
                                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                  Mødedetaljer
                                </h5>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <div className="text-muted-foreground text-xs">Dato</div>
                                    <div className="font-medium">{debrief.date}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground text-xs">Sales rep</div>
                                    <div className="font-medium">{debrief.salesRep}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground text-xs">HCPs</div>
                                    <div className="font-medium">{debrief.hcps.join(', ')}</div>
                                  </div>
                                </div>
                              </div>

                              {/* Debrief indhold */}
                              <div>
                                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                  Debrief indhold
                                </h5>
                                <div className="border rounded-lg p-4 space-y-4 bg-card">
                                  <div>
                                    <h6 className="font-semibold text-foreground mb-1">Mødepurpose og indhold</h6>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {debrief.meetingPurpose}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <h6 className="font-semibold text-foreground mb-1">Indvendinger vedrørende</h6>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      <span className="text-primary">{debrief.objections}</span>
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <h6 className="font-semibold text-foreground mb-1">Næste opkaldsmål</h6>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {debrief.nextSteps}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    ))}
                  </div>
                )}
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
                  <Card 
                    key={category.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <CardContent className="pt-5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {category.title}
                        </h4>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm text-muted-foreground">{category.count}</span>
                          <Eye className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
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
            {/* Emner - Topics Summary with Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Emner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    <span className="text-sm text-muted-foreground">Kendte emner</span>
                    <Badge variant="secondary" className="text-xs">0</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-destructive">Nye emner</span>
                    <span className="text-destructive">↗</span>
                  </div>
                </div>

                {/* Progress bar placeholder */}
                <div className="h-2 rounded-full bg-primary/20 w-full" />

                {/* Chart */}
                <div className="h-52 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topicTrendData} margin={{ left: -20, right: 0, top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        className="text-xs" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        className="text-xs" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="regional" stackId="a" fill="#16a34a" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="treatment" stackId="a" fill="#ea580c" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="patient" stackId="a" fill="#1d4ed8" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="uncertainty" stackId="a" fill="#84cc16" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="space-y-1.5 text-xs">
                  {objectionCategories.map((cat) => (
                    <div key={cat.id} className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                      <span className="text-muted-foreground truncate">{cat.title}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="text-center text-sm text-muted-foreground">
                  Ingen emner i den valgte periode
                </div>
              </CardContent>
            </Card>

            {/* Actions - Moved to bottom */}
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
          </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default ReportView;