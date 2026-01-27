import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  CheckCircle2,
  XCircle,
  Target,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { format, subDays } from "date-fns";
import { da } from "date-fns/locale";
import jarvisLogo from "@/assets/jarvis-logo.svg";
import { NavigationMenu } from "@/components/NavigationMenu";
import { AskJarvisManager } from "@/components/manager/AskJarvis";
import { HcpSearch } from "@/components/HcpSearch";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

// Active campaigns
interface Campaign {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  adherenceRate: number;
  totalMeetings: number;
  alignedMeetings: number;
  startDate: string;
  keywords: string[];
}

const activeCampaigns: Campaign[] = [
  {
    id: 'ozempic-initiation',
    title: 'Ozempic Initiering',
    description: 'Fokus på at præsentere opstartsdata og adressere bekymringer ved initiering af nye patienter på Ozempic.',
    priority: 'high',
    adherenceRate: 72,
    totalMeetings: 32,
    alignedMeetings: 23,
    startDate: 'dec. 1, 2025',
    keywords: ['initiering', 'opstart', 'nye patienter', 'dosis', 'ozempic']
  },
  {
    id: 'cv-outcomes',
    title: 'Kardiovaskulære Outcomes',
    description: 'Kommunikation af SUSTAIN-6 og SELECT data vedrørende kardiovaskulær risikoreduktion.',
    priority: 'high',
    adherenceRate: 58,
    totalMeetings: 28,
    alignedMeetings: 16,
    startDate: 'nov. 15, 2025',
    keywords: ['kardiovaskulær', 'cv', 'sustain', 'select', 'risikoreduktion', 'hjerte']
  },
  {
    id: 'patient-adherence',
    title: 'Patient Compliance',
    description: 'Diskussion af strategier for at forbedre patienternes behandlingsadhærence og minimere drop-out.',
    priority: 'medium',
    adherenceRate: 45,
    totalMeetings: 25,
    alignedMeetings: 11,
    startDate: 'nov. 1, 2025',
    keywords: ['adhærence', 'compliance', 'drop-out', 'fastholdelse', 'patient']
  },
  {
    id: 'weight-management',
    title: 'Vægtstyring og Obesity',
    description: 'Introduktion til Wegovy og diskussion af vægttabsbehandling som terapeutisk område.',
    priority: 'low',
    adherenceRate: 31,
    totalMeetings: 22,
    alignedMeetings: 7,
    startDate: 'okt. 20, 2025',
    keywords: ['vægt', 'obesity', 'wegovy', 'vægttab', 'bmi']
  }
];

// Employee adherence breakdown
interface EmployeeAdherence {
  name: string;
  overallAdherence: number;
  meetingCount: number;
  campaignBreakdown: Record<string, number>;
}

const employeeAdherence: EmployeeAdherence[] = [
  {
    name: 'Lenette Skott',
    overallAdherence: 83,
    meetingCount: 6,
    campaignBreakdown: { 'ozempic-initiation': 100, 'cv-outcomes': 80, 'patient-adherence': 50, 'weight-management': 0 }
  },
  {
    name: 'Gitte Baker',
    overallAdherence: 70,
    meetingCount: 10,
    campaignBreakdown: { 'ozempic-initiation': 80, 'cv-outcomes': 60, 'patient-adherence': 40, 'weight-management': 20 }
  },
  {
    name: 'Christian Schmidt Larsen',
    overallAdherence: 62,
    meetingCount: 8,
    campaignBreakdown: { 'ozempic-initiation': 75, 'cv-outcomes': 50, 'patient-adherence': 50, 'weight-management': 25 }
  },
  {
    name: 'Christine Willesen',
    overallAdherence: 56,
    meetingCount: 5,
    campaignBreakdown: { 'ozempic-initiation': 60, 'cv-outcomes': 40, 'patient-adherence': 40, 'weight-management': 20 }
  }
];

// Debrief examples
interface DebriefExample {
  id: string;
  employee: string;
  date: string;
  aligned: boolean;
  campaign: string;
  excerpt: string;
  analysis: string;
}

const debriefExamples: DebriefExample[] = [
  {
    id: '1',
    employee: 'Lenette Skott',
    date: 'dec. 20, 2025',
    aligned: true,
    campaign: 'Ozempic Initiering',
    excerpt: 'Gennemgik initieringsdata med overlægen. Fokuserede på dosisoptrapningsalgoritmen og adresserede bekymringer om GI-bivirkninger ved opstart. Aftalt at starte 3 nye patienter med lav dosis.',
    analysis: 'Aligned: Debrief adresserer alle nøgleelementer i kampagnen - opstartsdata, dosis og bekymringer.'
  },
  {
    id: '2',
    employee: 'Christian Schmidt Larsen',
    date: 'dec. 18, 2025',
    aligned: true,
    campaign: 'Kardiovaskulære Outcomes',
    excerpt: 'Præsenterede SUSTAIN-6 data for kardiologisk team. Stor interesse for CV risikoreduktionen. De vil overveje GLP-1 til type 2 diabetes patienter med etableret hjertesygdom.',
    analysis: 'Aligned: Specifik reference til SUSTAIN-6 og kardiovaskulær risikoreduktion matcher kampagnens fokus.'
  },
  {
    id: '3',
    employee: 'Gitte Baker',
    date: 'dec. 15, 2025',
    aligned: false,
    campaign: 'Patient Compliance',
    excerpt: 'Godt møde med praktiserende læge. Diskuterede generelt om diabetesbehandling og patientgrupper. Positivt modtaget.',
    analysis: 'Ikke aligned: Ingen specifik reference til adhærence, fastholdelse eller drop-out strategier som defineret i kampagnen.'
  },
  {
    id: '4',
    employee: 'Christine Willesen',
    date: 'dec. 12, 2025',
    aligned: false,
    campaign: 'Vægtstyring og Obesity',
    excerpt: 'Møde hos diabetesklinik. Fokuserede primært på Ozempic dosering og tilskudsregler. Ingen spørgsmål fra HCP.',
    analysis: 'Ikke aligned: Mødet handlede om Ozempic dosering, ikke vægtstyring eller Wegovy som kampagnen foreskriver.'
  },
  {
    id: '5',
    employee: 'Lenette Skott',
    date: 'dec. 10, 2025',
    aligned: true,
    campaign: 'Patient Compliance',
    excerpt: 'Diskuterede fastholdelsesstrategier med diabetessygeplejerske. Gennemgik tips til at håndtere bivirkninger og motivere patienter. Hun vil implementere månedlige opfølgningsopkald.',
    analysis: 'Aligned: Fokus på fastholdelse, motivation og konkrete strategier matcher kampagnens mål.'
  }
];

// Trend data for adherence over time
const adherenceTrendData = [
  { week: "Uge 48", ozempic: 65, cv: 50, compliance: 40, weight: 25 },
  { week: "Uge 49", ozempic: 70, cv: 55, compliance: 42, weight: 28 },
  { week: "Uge 50", ozempic: 72, cv: 58, compliance: 45, weight: 30 },
  { week: "Uge 51", ozempic: 75, cv: 60, compliance: 48, weight: 32 }
];

const chartConfig = {
  ozempic: { label: "Ozempic Initiering", color: "hsl(var(--primary))" },
  cv: { label: "CV Outcomes", color: "hsl(var(--chart-2))" },
  compliance: { label: "Patient Compliance", color: "hsl(var(--chart-3))" },
  weight: { label: "Vægtstyring", color: "hsl(var(--chart-4))" },
};

const CampaignAdherenceReportView = () => {
  const navigate = useNavigate();
  const [openCampaigns, setOpenCampaigns] = useState<string[]>([]);
  const [showExamples, setShowExamples] = useState(false);
  const [exampleFilter, setExampleFilter] = useState<'all' | 'aligned' | 'not-aligned'>('all');

  const toggleCampaign = (id: string) => {
    setOpenCampaigns(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const overallAdherence = Math.round(
    activeCampaigns.reduce((sum, c) => sum + c.adherenceRate, 0) / activeCampaigns.length
  );

  const totalMeetings = activeCampaigns.reduce((sum, c) => sum + c.totalMeetings, 0);
  const alignedMeetings = activeCampaigns.reduce((sum, c) => sum + c.alignedMeetings, 0);

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    if (priority === 'high') return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
    if (priority === 'medium') return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
    return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
  };

  const getAdherenceColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600';
    if (rate >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const filteredExamples = exampleFilter === 'all' 
    ? debriefExamples 
    : debriefExamples.filter(e => exampleFilter === 'aligned' ? e.aligned : !e.aligned);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            <img src={jarvisLogo} alt="Jarvis Logo" className="h-12 w-12" />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Campaign Adherence Report</h1>
              <p className="text-sm text-muted-foreground">Last 30 Days Analysis</p>
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
            onClick={() => navigate(-1)}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Tilbage
          </Button>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {format(subDays(new Date(), 30), "d. MMM", { locale: da })} - {format(new Date(), "d. MMM yyyy", { locale: da })}
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="h-4 w-4" />
              {activeCampaigns.length} aktive kampagner
            </div>
            <Badge variant="secondary">Last 30 Days</Badge>
          </div>
        </div>

        {/* Overall Summary */}
        <section className="mb-10">
          <Card className="border-0 bg-gradient-to-br from-card to-accent/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Samlet Campaign Adherence</h2>
                  <p className="text-muted-foreground">
                    {alignedMeetings} af {totalMeetings} møder alignet med aktive kampagner
                  </p>
                </div>
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getAdherenceColor(overallAdherence)}`}>{overallAdherence}%</div>
                  <div className="text-sm text-muted-foreground mt-1">adherence rate</div>
                </div>
              </div>
              <div className="mt-6">
                <Progress value={overallAdherence} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Executive Summary */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">Executive Summary</h2>
          <div className="text-foreground/90 space-y-4 leading-relaxed">
            <p>
              Over de seneste 30 dage har teamet gennemført {totalMeetings} møder, hvoraf {alignedMeetings} ({overallAdherence}%) har 
              været aligned med de aktive kampagner. <strong>Ozempic Initiering</strong> kampagnen har den højeste adherence på 72%, 
              mens <strong>Vægtstyring og Obesity</strong> har laveste adherence på 31%.
            </p>
            <p>
              Der ses en positiv trend i adherence over perioden, med forbedringer på tværs af alle kampagner. 
              Dog er der fortsat et betydeligt gap mellem high-priority kampagner (72% og 58%) og lower-priority kampagner (45% og 31%).
            </p>
            <p>
              <strong>Anbefaling:</strong> Øget fokus på Patient Compliance og Vægtstyring kampagnerne i kommende periode. 
              Overvej at inkludere specifikke talking points i mødeforberedelsen for at øge alignment.
            </p>
          </div>
        </section>

        {/* Active Campaigns */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Aktive Kampagner</h2>
          <div className="space-y-2">
            {activeCampaigns.map((campaign) => (
              <Collapsible
                key={campaign.id}
                open={openCampaigns.includes(campaign.id)}
                onOpenChange={() => toggleCampaign(campaign.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className={`flex items-center justify-between p-4 rounded-lg border transition-colors text-left ${
                    openCampaigns.includes(campaign.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}>
                    <div className="flex items-center gap-3 flex-1">
                      <Target className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground">{campaign.title}</span>
                      <Badge className={`text-xs ${getPriorityColor(campaign.priority)}`}>
                        {campaign.priority === 'high' ? 'Høj' : campaign.priority === 'medium' ? 'Medium' : 'Lav'} prioritet
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className={`text-lg font-semibold ${getAdherenceColor(campaign.adherenceRate)}`}>
                          {campaign.adherenceRate}%
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({campaign.alignedMeetings}/{campaign.totalMeetings})
                        </span>
                      </div>
                      <Progress value={campaign.adherenceRate} className="w-20 h-2" />
                      <ChevronDown 
                        className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${
                          openCampaigns.includes(campaign.id) ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 py-4 space-y-4">
                    <p className="text-sm text-muted-foreground">{campaign.description}</p>
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-muted-foreground mr-1">Keywords:</span>
                      {campaign.keywords.map((keyword, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Startet: {campaign.startDate}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </section>

        {/* Adherence Trend */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Adherence Udvikling</h2>
          <Card className="border-0 bg-card">
            <CardContent className="pt-6">
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <BarChart data={adherenceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis dataKey="week" className="text-xs" />
                  <YAxis domain={[0, 100]} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="ozempic" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="cv" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="compliance" fill="hsl(var(--chart-3))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="weight" fill="hsl(var(--chart-4))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ChartContainer>
              <div className="flex justify-center gap-4 mt-4 text-xs flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span>Ozempic Initiering</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--chart-2))' }} />
                  <span>CV Outcomes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--chart-3))' }} />
                  <span>Patient Compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--chart-4))' }} />
                  <span>Vægtstyring</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Employee Breakdown */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Medarbejder Adherence</h2>
          <div className="space-y-3">
            {employeeAdherence.map((emp) => (
              <Card key={emp.name} className="border">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{emp.name}</div>
                        <div className="text-xs text-muted-foreground">{emp.meetingCount} møder</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl font-bold ${getAdherenceColor(emp.overallAdherence)}`}>
                        {emp.overallAdherence}%
                      </div>
                      <Progress value={emp.overallAdherence} className="w-24 h-2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {activeCampaigns.map((c) => {
                      const adherence = emp.campaignBreakdown[c.id] || 0;
                      return (
                        <div key={c.id} className="text-center p-2 rounded bg-muted/30">
                          <div className={`font-semibold ${getAdherenceColor(adherence)}`}>{adherence}%</div>
                          <div className="text-muted-foreground truncate" title={c.title}>
                            {c.title.split(' ')[0]}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Debrief Examples */}
        <section className="mb-10">
          <Collapsible open={showExamples} onOpenChange={setShowExamples}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 rounded-lg border border-dashed hover:border-primary/50 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquareQuote className="h-4 w-4" />
                  <span className="text-sm font-medium">Debrief Eksempler</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{debriefExamples.length} eksempler</span>
                  {showExamples ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-3 space-y-1 mb-3">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={exampleFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setExampleFilter('all')}
                  >
                    Alle
                  </Button>
                  <Button 
                    size="sm" 
                    variant={exampleFilter === 'aligned' ? 'default' : 'outline'}
                    onClick={() => setExampleFilter('aligned')}
                    className="gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Aligned
                  </Button>
                  <Button 
                    size="sm" 
                    variant={exampleFilter === 'not-aligned' ? 'default' : 'outline'}
                    onClick={() => setExampleFilter('not-aligned')}
                    className="gap-1"
                  >
                    <XCircle className="h-3 w-3" />
                    Ikke aligned
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                {filteredExamples.map((example) => (
                  <div 
                    key={example.id} 
                    className={`p-4 rounded-lg border ${
                      example.aligned 
                        ? 'bg-green-50/50 border-green-200 dark:bg-green-950/10 dark:border-green-900' 
                        : 'bg-red-50/50 border-red-200 dark:bg-red-950/10 dark:border-red-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">{example.employee}</Badge>
                      <span className="text-xs text-muted-foreground">{example.date}</span>
                      <Badge variant="secondary" className="text-xs">{example.campaign}</Badge>
                      {example.aligned ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 ml-auto shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-foreground/90 italic mb-3">"{example.excerpt}"</p>
                    <div className={`text-xs p-2 rounded flex items-start gap-2 ${
                      example.aligned 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {example.aligned ? (
                        <TrendingUp className="h-3 w-3 mt-0.5 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                      )}
                      {example.analysis}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>

        {/* Footer Actions */}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-muted-foreground">
            Genereret: {format(new Date(), "d. MMMM yyyy", { locale: da })}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-background">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-background">
              <Share2 className="h-4 w-4" />
              Del
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampaignAdherenceReportView;
