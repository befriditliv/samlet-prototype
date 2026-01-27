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
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  BarChart3,
  Download,
  Share2,
  ChevronDown,
  ChevronRight,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
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

// HCOs and their HCPs
const hcoData = [
  { name: "Rigshospitalet Endokrinologisk Afdeling", hcps: ["Dr. Lars Andersen", "Dr. Maria Hansen", "Dr. Peter Christensen"] },
  { name: "Herlev Hospital Diabetes Center", hcps: ["Dr. Sofie Nielsen", "Dr. Thomas Madsen"] },
  { name: "Odense Universitetshospital", hcps: ["Dr. Mette Larsen", "Dr. Jonas Pedersen", "Dr. Anne Søndergaard"] },
  { name: "Aarhus Universitetshospital", hcps: ["Dr. Henrik Rasmussen", "Dr. Lise Mortensen"] },
  { name: "Aalborg Sygehus", hcps: ["Dr. Camilla Olsen", "Dr. Michael Krogh"] },
  { name: "Bispebjerg Hospital", hcps: ["Dr. Eva Thomsen", "Dr. Christian Bak"] },
  { name: "Gentofte Hospital", hcps: ["Dr. Julie Poulsen", "Dr. Rasmus Gram"] },
  { name: "Lægepraksis Vesterbro", hcps: ["Dr. Mogens Nørgaard", "Louise Gildsig"] },
  { name: "Frederiksberg Lægecenter", hcps: ["Dr. Kirsten Holm", "Dr. Anders Berg"] },
  { name: "Diabetes Klinik København", hcps: ["Dr. Birgitte Falk", "Dr. Erik Damgaard"] },
  { name: "Sønderborg Sygehus", hcps: ["Dr. Nanna Vestergaard", "Dr. Ole Bruun"] },
  { name: "Næstved Sygehus", hcps: ["Dr. Pia Kjeldsen", "Dr. Martin Lund"] },
  { name: "Holbæk Sygehus", hcps: ["Dr. Trine Mogensen", "Dr. Jacob Riis"] },
  { name: "Roskilde Lægecenter", hcps: ["Dr. Susanne Friis", "Dr. Nikolaj Skov"] },
  { name: "Hillerød Hospital", hcps: ["Dr. Karen Winther", "Dr. Bo Lindberg"] },
];

// Generate 70 debriefs with realistic content showing evolution
const generateDebriefs = (): DebriefItem[] => {
  const debriefs: DebriefItem[] = [];
  
  // Phase 1: August-September - Primarily subsidy/reimbursement concerns (early period)
  const phase1Topics = [
    { purpose: "Gennemgang af tilskudsregler for GLP-1 behandling", objection: "Uklarhed om regionale tilskudsregler gør det svært at vurdere, hvilke patienter der kan starte Ozempic", nextSteps: "Fremsende opdateret tilskudsoversigt" },
    { purpose: "Diskussion af initiering af Ozempic hos type 2 diabetespatienter", objection: "Bekymring om at tilskudsklausuler begrænser muligheden for tidlig intervention med Ozempic", nextSteps: "Planlægge opfølgende møde med tilskudsspecialist" },
    { purpose: "Introduktion til Ozempic behandlingsforløb", objection: "Regionen kræver dokumentation for metformin-svigt før Ozempic kan ordineres med tilskud", nextSteps: "Dele kliniske cases der viser dokumentationskrav" },
    { purpose: "Møde om behandlingsalgoritme for type 2 diabetes", objection: "Usikkerhed om hvorvidt enkelttilskud kan søges ved kontraindikation for metformin", nextSteps: "Kontakte tilskudskontoret for afklaring" },
    { purpose: "Opdatering om GLP-1 markedet", objection: "Frustation over at tilskudsreglerne varierer mellem regioner", nextSteps: "Udarbejde regional sammenligning af tilskudsregler" },
  ];
  
  // Phase 2: October-November - Shift towards combination therapy concerns
  const phase2Topics = [
    { purpose: "Ozempic i kombination med SGLT2-hæmmere", objection: "Usikkerhed om optimal dosering når Ozempic kombineres med andre antidiabetika", nextSteps: "Fremsende doseringsguide for kombinationsbehandling" },
    { purpose: "Kombinationsbehandling og patientmonitorering", objection: "Bekymring om øget risiko for hypoglykæmi ved kombination med sulfonylurinstof", nextSteps: "Arrangere webinar om sikker kombinationsbehandling" },
    { purpose: "Multidrug regime med GLP-1", objection: "Mangler erfaring med at kombinere Ozempic med insulin – hvornår justeres insulindosis?", nextSteps: "Dele protokol for insulin-justering ved GLP-1 tillæg" },
    { purpose: "Behandlingsintensivering hos type 2 patienter", objection: "Ønsker mere data om langtidseffekt af Ozempic + SGLT2i kombination", nextSteps: "Sende relevante studier om kardiovaskulære outcomes" },
    { purpose: "GLP-1 som tillæg til eksisterende behandling", objection: "Patienter på multiple præparater udtrykker 'pilletræthed' – hvordan motiveres de til injection?", nextSteps: "Udvikle patientvenligt materiale om ugentlig injektion" },
  ];
  
  // Phase 3: Late November-December - Focus on patient selection and practical initiation
  const phase3Topics = [
    { purpose: "Patientudvælgelse til Ozempic behandling", objection: "Hvilke patienter skal prioriteres når der er venteliste til diabetesambulatoriet?", nextSteps: "Udarbejde prioriteringskriterier sammen med klinikken" },
    { purpose: "Praktisk håndtering af Ozempic opstart", objection: "GI-bivirkninger ved opstart får nogle patienter til at stoppe behandlingen for tidligt", nextSteps: "Dele tips til håndtering af opstartsbivirkninger" },
    { purpose: "Ozempic til patienter med nyreinsufficiens", objection: "Usikkerhed om sikkerhed og effekt hos patienter med moderat nedsat nyrefunktion", nextSteps: "Gennemgå data for eGFR 30-60 populationen" },
    { purpose: "Ældre patienter og GLP-1 behandling", objection: "Bekymring om vægttab hos ældre, skrøbelige patienter – er Ozempic passende?", nextSteps: "Diskutere individuel vurdering og monitorering" },
    { purpose: "Opfølgning på Ozempic patienter", objection: "Mangler kapacitet til tæt opfølgning de første 3 måneder som anbefalet", nextSteps: "Foreslå digital opfølgningsløsning" },
  ];
  
  // Generate debriefs for each phase
  let id = 1;
  
  // Phase 1: Aug 15 - Sep 30 (25 debriefs, primarily subsidy)
  for (let i = 0; i < 25; i++) {
    const day = 15 + Math.floor(i * 1.8);
    const month = day > 31 ? 9 : 8;
    const actualDay = day > 31 ? day - 31 : day;
    const topic = phase1Topics[i % phase1Topics.length];
    const hco = hcoData[i % hcoData.length];
    
    debriefs.push({
      id: String(id++),
      date: `${String(actualDay).padStart(2, '0')}/${String(month).padStart(2, '0')}/25`,
      hcoName: hco.name,
      salesRep: salesReps[i % salesReps.length],
      hcps: hco.hcps.slice(0, Math.floor(Math.random() * 2) + 1),
      meetingPurpose: topic.purpose,
      objections: topic.objection,
      nextSteps: topic.nextSteps,
    });
  }
  
  // Phase 2: Oct 1 - Nov 15 (28 debriefs, mix shifting to combination)
  for (let i = 0; i < 28; i++) {
    const day = 1 + Math.floor(i * 1.6);
    const month = day > 31 ? 11 : 10;
    const actualDay = day > 31 ? day - 31 : day;
    // Early October still has some subsidy, but shifts to combination
    const topicPool = i < 8 ? [...phase1Topics.slice(0, 2), ...phase2Topics] : phase2Topics;
    const topic = topicPool[i % topicPool.length];
    const hco = hcoData[(i + 5) % hcoData.length];
    
    debriefs.push({
      id: String(id++),
      date: `${String(actualDay).padStart(2, '0')}/${String(month).padStart(2, '0')}/25`,
      hcoName: hco.name,
      salesRep: salesReps[(i + 2) % salesReps.length],
      hcps: hco.hcps.slice(0, Math.floor(Math.random() * 2) + 1),
      meetingPurpose: topic.purpose,
      objections: topic.objection,
      nextSteps: topic.nextSteps,
    });
  }
  
  // Phase 3: Nov 16 - Dec 18 (17 debriefs, primarily patient selection)
  for (let i = 0; i < 17; i++) {
    const day = 16 + Math.floor(i * 1.9);
    const month = day > 30 ? 12 : 11;
    const actualDay = day > 30 ? day - 30 : day;
    // Mix of combination and patient selection
    const topicPool = i < 5 ? [...phase2Topics.slice(0, 2), ...phase3Topics] : phase3Topics;
    const topic = topicPool[i % topicPool.length];
    const hco = hcoData[(i + 10) % hcoData.length];
    
    debriefs.push({
      id: String(id++),
      date: `${String(actualDay).padStart(2, '0')}/${String(month).padStart(2, '0')}/25`,
      hcoName: hco.name,
      salesRep: salesReps[(i + 4) % salesReps.length],
      hcps: hco.hcps.slice(0, Math.floor(Math.random() * 2) + 1),
      meetingPurpose: topic.purpose,
      objections: topic.objection,
      nextSteps: topic.nextSteps,
    });
  }
  
  return debriefs;
};

const allDebriefs = generateDebriefs();

// Objection categories with debrief data - showing clear evolution
const objectionCategories: ObjectionCategory[] = [
  {
    id: 'subsidy-reimbursement',
    title: 'Tilskudsregler og regionale forskelle',
    fullTitle: 'Bekymringer om tilskudsregler, klausuler og regionale forskelle',
    description: 'HCP\'er udtrykker frustration over uklare eller varierende tilskudsregler mellem regioner. Dette påvirker beslutningen om at initiere Ozempic, da dokumentationskrav og godkendelsesprocesser opleves som tidskrævende.',
    color: '#16a34a',
    count: 24,
    trend: 'down',
    trendPercent: 35,
    debriefs: allDebriefs.filter(d => 
      d.objections.toLowerCase().includes('tilskud') || 
      d.objections.toLowerCase().includes('region') ||
      d.objections.toLowerCase().includes('klausul')
    ).slice(0, 24),
  },
  {
    id: 'combination-therapy',
    title: 'Kombinationsbehandling med andre præparater',
    fullTitle: 'Usikkerhed om kombinationsbehandling med andre antidiabetika',
    description: 'Stigende fokus på hvordan Ozempic bedst kombineres med SGLT2-hæmmere, insulin og andre antidiabetika. HCP\'er efterspørger konkret vejledning om dosering, monitorering og håndtering af interaktioner.',
    color: '#ea580c',
    count: 26,
    trend: 'up',
    trendPercent: 62,
    debriefs: allDebriefs.filter(d => 
      d.objections.toLowerCase().includes('kombination') || 
      d.objections.toLowerCase().includes('insulin') ||
      d.objections.toLowerCase().includes('sglt2') ||
      d.objections.toLowerCase().includes('sulfonyl') ||
      d.objections.toLowerCase().includes('multiple')
    ).slice(0, 26),
  },
  {
    id: 'patient-selection',
    title: 'Patientudvælgelse og praktisk initiering',
    fullTitle: 'Udfordringer med patientudvælgelse og praktisk håndtering af opstart',
    description: 'HCP\'er søger vejledning om hvilke patienter der bør prioriteres til Ozempic, samt praktisk håndtering af opstart herunder bivirkningshåndtering, monitorering og særlige patientgrupper.',
    color: '#1d4ed8',
    count: 15,
    trend: 'up',
    trendPercent: 180,
    debriefs: allDebriefs.filter(d => 
      d.objections.toLowerCase().includes('patient') || 
      d.objections.toLowerCase().includes('bivirkning') ||
      d.objections.toLowerCase().includes('opstart') ||
      d.objections.toLowerCase().includes('ældre') ||
      d.objections.toLowerCase().includes('nyre')
    ).slice(0, 15),
  },
  {
    id: 'capacity-resources',
    title: 'Kapacitet og ressourcer til opfølgning',
    fullTitle: 'Begrænset kapacitet til opfølgning og monitorering',
    description: 'Praktiske udfordringer med at følge op på patienter som anbefalet. Klinikker mangler ressourcer til tæt monitorering i opstartsfasen, hvilket påvirker villigheden til at initiere behandling.',
    color: '#84cc16',
    count: 5,
    trend: 'up',
    trendPercent: 25,
    debriefs: allDebriefs.filter(d => 
      d.objections.toLowerCase().includes('kapacitet') || 
      d.objections.toLowerCase().includes('opfølgning') ||
      d.objections.toLowerCase().includes('venteliste')
    ).slice(0, 5),
  },
];

// Trend data showing monthly evolution - using cumulative percentages for area chart
const topicTrendData = [
  { month: 'Aug', subsidy: 18, combination: 4, patientSelection: 2, capacity: 1, total: 25 },
  { month: 'Sep', subsidy: 14, combination: 8, patientSelection: 3, capacity: 1, total: 26 },
  { month: 'Okt', subsidy: 8, combination: 12, patientSelection: 4, capacity: 1, total: 25 },
  { month: 'Nov', subsidy: 4, combination: 10, patientSelection: 8, capacity: 2, total: 24 },
  { month: 'Dec', subsidy: 2, combination: 6, patientSelection: 6, capacity: 2, total: 16 },
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
    dateRange: { from: new Date(2025, 7, 15), to: new Date(2025, 11, 18) },
    compareDateRange: { from: new Date(2025, 4, 1), to: new Date(2025, 7, 14) },
    product: "Ozempic",
    employee: "all",
    compareEnabled: true
  };

  const toggleDebrief = (id: string) => {
    setExpandedDebriefs(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const totalDebriefs = objectionCategories.reduce((sum, cat) => sum + cat.count, 0);

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

              {/* Trend indicator */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                {selectedCategory.trend === 'up' ? (
                  <ArrowUpRight className="h-5 w-5 text-destructive" />
                ) : selectedCategory.trend === 'down' ? (
                  <ArrowDownRight className="h-5 w-5 text-green-500" />
                ) : null}
                <span className="text-sm">
                  {selectedCategory.trend === 'up' ? 'Stigende' : selectedCategory.trend === 'down' ? 'Faldende' : 'Stabil'} trend: {selectedCategory.trendPercent}% ændring siden periode start
                </span>
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

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">1.247</div>
                <div className="text-sm text-muted-foreground mt-1">Møder i perioden</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">687 <span className="text-lg font-normal text-muted-foreground">(55%)</span></div>
                <div className="text-sm text-muted-foreground mt-1">Debriefs i perioden</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{totalDebriefs}</div>
                <div className="text-sm text-muted-foreground mt-1">Relevante debriefs</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Period Info Row */}
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
                {salesReps.map((user) => (
                  <Badge key={user} variant="secondary" className="text-xs">{user}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-6 max-w-4xl">
          {/* Main Analysis Content */}
          <div className="space-y-6">
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
                  Analysen af {totalDebriefs} relevante debriefs viser en <span className="text-foreground font-medium">tydelig evolution i HCP-bekymringer</span> over perioden. 
                  Indledningsvist dominerede spørgsmål om <span className="text-foreground font-medium">tilskudsregler og regionale forskelle</span>, men fokus er gradvist skiftet mod 
                  <span className="text-foreground font-medium"> kombinationsbehandling</span> og senest <span className="text-foreground font-medium">patientudvælgelse</span>. 
                  Dette indikerer at grundlæggende adgangsbarrierer er ved at blive adresseret, og HCP'er nu fokuserer på klinisk implementering.
                </p>
              </CardContent>
            </Card>

            {/* Hovedanalyse */}
            <Card>
              <CardHeader>
                <CardTitle>Udvikling i bekymringsmønstre for Ozempic-initiering</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Emnebeskrivelse */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Emnebeskrivelse</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Over de seneste 5 måneder har vi observeret en markant ændring i de bekymringer HCP'er udtrykker ved Ozempic-initiering. 
                    Hvor tilskuds- og regulatoriske spørgsmål tidligere fyldte mest, er disse nu afløst af mere klinisk orienterede overvejelser 
                    omkring kombinationsbehandling og individualiseret patientudvælgelse.
                  </p>
                </div>

                <Separator />

                {/* Statistisk analyse */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Statistisk analyse
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">Udvikling baseret på {totalDebriefs} kategoriserede debriefs</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <TrendingDown className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span><span className="font-medium text-foreground">Tilskudsbekymringer faldet 35%</span> – fra 18 debriefs i august til kun 2 i december. Regionale afklaringer og bedre dokumentation har reduceret usikkerheden.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span><span className="font-medium text-foreground">Kombinationsbehandling steget 62%</span> – HCP'er søger nu aktivt vejledning om Ozempic sammen med SGLT2i, insulin og andre antidiabetika.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <span><span className="font-medium text-foreground">Patientudvælgelse steget 180%</span> – Nye spørgsmål om prioritering, særlige patientgrupper og praktisk opstartshåndtering dominerer nu.</span>
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
                    Skiftet i bekymringsmønstre afspejler en modning i markedets forståelse af Ozempic og indikerer fremdrift i adoptionsrejsen.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span>HCP'er bevæger sig fra "kan jeg ordinere det?" til "hvordan bruger jeg det optimalt?" – et positivt tegn på øget behandlingsvillighed.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Den stigende interesse for kombinationsbehandling tyder på, at Ozempic i stigende grad ses som en naturlig del af behandlingsarsenalet.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Fokus på patientudvælgelse og bivirkningshåndtering viser behov for mere praktisk, klinisk støttemateriale.</span>
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
                  <p className="text-sm text-muted-foreground mb-3">Markedet er klar til næste fase af engagement</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span><span className="font-medium text-foreground">Prioritér kombinationsbehandling:</span> Udvikl og distribuer konkrete doseringsguides og protokoller for Ozempic + SGLT2i/insulin.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span><span className="font-medium text-foreground">Styrk praktisk support:</span> Lav patientudvælgelsesværktøjer og tjeklister til håndtering af opstartsbivirkninger.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span><span className="font-medium text-foreground">Adressér kapacitetsudfordringer:</span> Overvej digitale opfølgningsløsninger til klinikker med begrænsede ressourcer.</span>
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
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
                          <h4 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {category.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="secondary" className="text-xs">{category.count}</Badge>
                          <Eye className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-1 text-xs">
                        {category.trend === 'up' ? (
                          <ArrowUpRight className="h-3.5 w-3.5 text-amber-500" />
                        ) : category.trend === 'down' ? (
                          <ArrowDownRight className="h-3.5 w-3.5 text-green-500" />
                        ) : null}
                        <span className={category.trend === 'up' ? 'text-amber-500' : category.trend === 'down' ? 'text-green-500' : 'text-muted-foreground'}>
                          {category.trend === 'up' ? '+' : category.trend === 'down' ? '-' : ''}{category.trendPercent}%
                        </span>
                        <span className="text-muted-foreground">siden periode start</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Emneudvikling over tid - Full width chart section */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Emneudvikling over tid</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Hvordan bekymringer skifter fra adgang til klinisk implementering
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Area Chart showing evolution */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={topicTrendData} margin={{ left: -20, right: 0, top: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSubsidy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorCombination" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ea580c" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ea580c" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorPatient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorCapacity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#84cc16" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#84cc16" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <YAxis 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                        axisLine={{ stroke: 'hsl(var(--border))' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="subsidy" 
                        name="Tilskud" 
                        stroke="#16a34a" 
                        fill="url(#colorSubsidy)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="combination" 
                        name="Kombination" 
                        stroke="#ea580c" 
                        fill="url(#colorCombination)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="patientSelection" 
                        name="Patient" 
                        stroke="#1d4ed8" 
                        fill="url(#colorPatient)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="capacity" 
                        name="Kapacitet" 
                        stroke="#84cc16" 
                        fill="url(#colorCapacity)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend with trends */}
                <div className="space-y-2">
                  {objectionCategories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: cat.color }} />
                        <span className="text-muted-foreground truncate max-w-[140px]">{cat.title.split(' ').slice(0, 3).join(' ')}...</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {cat.trend === 'up' ? (
                          <ArrowUpRight className="h-3 w-3 text-amber-500" />
                        ) : cat.trend === 'down' ? (
                          <ArrowDownRight className="h-3 w-3 text-green-500" />
                        ) : null}
                        <span className={cat.trend === 'up' ? 'text-amber-500' : cat.trend === 'down' ? 'text-green-500' : 'text-muted-foreground'}>
                          {cat.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Key insight */}
                <div className="bg-primary/5 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">Nøgleindsigt:</span> Fokus skifter fra administrative barrierer til klinisk implementering – et positivt tegn på markedsmodning.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions - At bottom */}
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
