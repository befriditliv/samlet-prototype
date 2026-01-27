import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { format } from "date-fns";
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

// Quality dimensions
interface QualityDimension {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  status: 'good' | 'medium' | 'poor';
  trend: 'up' | 'down' | 'stable';
  description: string;
  goodExamples: string[];
  improvementAreas: string[];
}

const qualityDimensions: QualityDimension[] = [
  {
    id: 'structure',
    title: 'Struktur og format',
    score: 8,
    maxScore: 10,
    status: 'good',
    trend: 'stable',
    description: 'Debriefs følger generelt en klar struktur med formål, aktivitetsbeskrivelse og næste skridt.',
    goodExamples: [
      'Klart formål defineret i starten af debrief',
      'God opdeling mellem aktivitet, reaktion og opfølgning',
      'Konsistent brug af strukturerede felter'
    ],
    improvementAreas: [
      'Nogle debriefs mangler klart defineret næste skridt',
      'Tidspunkter for opfølgning ikke altid angivet'
    ]
  },
  {
    id: 'depth',
    title: 'Dybde og detaljegrad',
    score: 5,
    maxScore: 10,
    status: 'medium',
    trend: 'up',
    description: 'Varierende kvalitet i dybden af debriefs. Nogle er meget overfladiske mens andre indeholder værdifulde detaljer.',
    goodExamples: [
      'Specifikke HCP-citater inkluderet',
      'Beskrivelse af konkrete bekymringer og barrierer',
      'Nuanceret beskrivelse af HCP engagement'
    ],
    improvementAreas: [
      'Mange debriefs er for korte og generiske',
      'Manglende beskrivelse af HCP reaktioner',
      'For lidt kontekst om mødesituationen'
    ]
  },
  {
    id: 'actionability',
    title: 'Actionability',
    score: 4,
    maxScore: 10,
    status: 'poor',
    trend: 'down',
    description: 'Debriefs mangler ofte konkrete, handlingsorienterede indsigter der kan bruges til opfølgning.',
    goodExamples: [
      'Klare aftaler om næste kontakt dokumenteret',
      'Specifikke materialer aftalt til fremsendelse'
    ],
    improvementAreas: [
      'Opfølgning ofte beskrevet som "vil følge op" uden specifik plan',
      'Manglende ansvarsfordeling på aftalte handlinger',
      'Få konkrete deadlines eller milepæle'
    ]
  },
  {
    id: 'hcp-insight',
    title: 'HCP indsigt og reaktioner',
    score: 6,
    maxScore: 10,
    status: 'medium',
    trend: 'stable',
    description: 'Moderat niveau af dokumentation af HCP reaktioner og indsigter fra møder.',
    goodExamples: [
      'Direkte citater fra HCP\'er inkluderet',
      'Beskrivelse af engagement-niveau under mødet',
      'Dokumentation af specifikke spørgsmål stillet'
    ],
    improvementAreas: [
      'Reaktioner ofte generiske ("positiv modtagelse")',
      'Manglende nuancer i beskrivelse af bekymringer',
      'For lidt fokus på uudtalte signaler'
    ]
  }
];

// Employee breakdown
interface EmployeeQuality {
  name: string;
  avgScore: number;
  debriefCount: number;
  strengths: string[];
  improvements: string[];
}

const employeeBreakdown: EmployeeQuality[] = [
  {
    name: 'Christian Schmidt Larsen',
    avgScore: 7.2,
    debriefCount: 16,
    strengths: ['Grundig struktur', 'Gode HCP citater'],
    improvements: ['Kortere opfølgningsbeskrivelser']
  },
  {
    name: 'Lenette Skott',
    avgScore: 6.8,
    debriefCount: 5,
    strengths: ['Handlingsorienteret', 'God detaljegrad'],
    improvements: ['Flere specifikke aftaler']
  },
  {
    name: 'Gitte Baker',
    avgScore: 5.4,
    debriefCount: 14,
    strengths: ['Konsistent format'],
    improvements: ['Mere dybde i beskrivelser', 'Bedre HCP indsigt']
  },
  {
    name: 'Christine Willesen',
    avgScore: 5.1,
    debriefCount: 5,
    strengths: ['God struktur'],
    improvements: ['Mere detaljerede reaktioner', 'Konkrete næste skridt']
  }
];

// Sample debrief excerpts
interface DebriefExcerpt {
  id: string;
  employee: string;
  date: string;
  quality: 'good' | 'poor';
  excerpt: string;
  feedback: string;
}

const debriefExcerpts: DebriefExcerpt[] = [
  {
    id: '1',
    employee: 'Christian Schmidt Larsen',
    date: 'dec. 18, 2025',
    quality: 'good',
    excerpt: 'HCP viste stor interesse for de nye kardiovaskulære data. Specifikt spurgte hun ind til SUSTAIN-6 resultaterne og bad om materiale til at dele med kollegerne. Aftalt at sende PDF og booke opfølgende møde i januar for at diskutere implementering i praksis.',
    feedback: 'Godt eksempel: Specifik HCP reaktion, konkret aftale, klart næste skridt med tidspunkt.'
  },
  {
    id: '2',
    employee: 'Lenette Skott',
    date: 'dec. 12, 2025',
    quality: 'good',
    excerpt: 'Lægen udtrykte bekymring over patienternes gastrointestinale bivirkninger de første uger. Vi gennemgik dosisoptrapningsalgoritmen sammen, og han var positiv over for at starte patienter på lavere dosis. Vil følge op om 3 uger for at høre erfaringer.',
    feedback: 'Godt eksempel: Dokumenterer bekymring, beskriver løsning, har konkret opfølgningsplan.'
  },
  {
    id: '3',
    employee: 'Gitte Baker',
    date: 'dec. 5, 2025',
    quality: 'poor',
    excerpt: 'Godt møde. HCP var interesseret. Vil følge op senere.',
    feedback: 'Forbedringspotentiale: For kort, ingen konkrete detaljer, uklart hvad HCP var interesseret i, ingen specifik opfølgningsplan.'
  },
  {
    id: '4',
    employee: 'Christine Willesen',
    date: 'nov. 28, 2025',
    quality: 'poor',
    excerpt: 'Præsenterede materialet. Positivt modtaget.',
    feedback: 'Forbedringspotentiale: Mangler beskrivelse af hvilket materiale, ingen HCP reaktioner dokumenteret, ingen næste skridt.'
  }
];

const DebriefQualityReportView = () => {
  const navigate = useNavigate();
  const [openDimensions, setOpenDimensions] = useState<string[]>([]);
  const [showExcerpts, setShowExcerpts] = useState(false);
  const [excerptFilter, setExcerptFilter] = useState<'all' | 'good' | 'poor'>('all');

  const toggleDimension = (id: string) => {
    setOpenDimensions(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const overallScore = Math.round(qualityDimensions.reduce((sum, d) => sum + d.score, 0) / qualityDimensions.length * 10) / 10;
  
  const getStatusColor = (status: 'good' | 'medium' | 'poor') => {
    if (status === 'good') return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
    if (status === 'medium') return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-red-600" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  const filteredExcerpts = excerptFilter === 'all' 
    ? debriefExcerpts 
    : debriefExcerpts.filter(e => e.quality === excerptFilter);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-6">
            <img src={jarvisLogo} alt="Jarvis Logo" className="h-12 w-12" />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Debrief Quality Report</h1>
              <p className="text-sm text-muted-foreground">Year-to-Date Analysis</p>
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
              Aug 2025 - Dec 2025
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              Alle medarbejdere
            </div>
            <Badge variant="secondary">YTD</Badge>
          </div>
        </div>

        {/* Overall Score */}
        <section className="mb-10">
          <Card className="border-0 bg-gradient-to-br from-card to-accent/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Samlet kvalitetsscore</h2>
                  <p className="text-muted-foreground">Baseret på {employeeBreakdown.reduce((sum, e) => sum + e.debriefCount, 0)} debriefs fra 4 medarbejdere</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-foreground">{overallScore}</div>
                  <div className="text-sm text-muted-foreground">/10</div>
                  <Badge className="mt-2 bg-amber-500/10 text-amber-600 border-amber-200/50">
                    Medium kvalitet
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Executive Summary */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-4">Executive Summary</h2>
          <div className="text-foreground/90 space-y-4 leading-relaxed">
            <p>
              Analysen af teamets debriefs fra august til december 2025 viser en <strong>moderat kvalitet</strong> med et gennemsnit på {overallScore}/10. 
              Debriefs har generelt en <strong>god struktur</strong>, men der er betydeligt rum for forbedring inden for <strong>dybde</strong> og <strong>actionability</strong>.
            </p>
            <p>
              Særligt bemærkes det, at mange debriefs er for korte og mangler konkrete, handlingsorienterede indsigter. 
              HCP reaktioner dokumenteres ofte i generiske vendinger som "positiv modtagelse" frem for specifikke citater eller nuancerede beskrivelser af engagement.
            </p>
            <p>
              <strong>Anbefaling:</strong> Fokus på at træne medarbejdere i at inkludere specifikke HCP citater, konkrete aftaler med deadlines, 
              og mere detaljerede beskrivelser af HCP bekymringer og reaktioner.
            </p>
          </div>
        </section>

        {/* Quality Dimensions */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Kvalitetsdimensioner</h2>
          <div className="space-y-2">
            {qualityDimensions.map((dimension) => (
              <Collapsible
                key={dimension.id}
                open={openDimensions.includes(dimension.id)}
                onOpenChange={() => toggleDimension(dimension.id)}
              >
                <CollapsibleTrigger className="w-full">
                  <div className={`flex items-center justify-between p-4 rounded-lg border transition-colors text-left ${
                    openDimensions.includes(dimension.id) 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}>
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(dimension.trend)}
                        <span className="text-sm font-medium text-foreground">{dimension.title}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Progress value={(dimension.score / dimension.maxScore) * 100} className="w-24 h-2" />
                        <span className="text-sm font-medium w-12 text-right">{dimension.score}/{dimension.maxScore}</span>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(dimension.status)}`}>
                        {dimension.status === 'good' ? 'God' : dimension.status === 'medium' ? 'Medium' : 'Svag'}
                      </Badge>
                      <ChevronDown 
                        className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${
                          openDimensions.includes(dimension.id) ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 py-4 space-y-4">
                    <p className="text-sm text-muted-foreground">{dimension.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700 dark:text-green-400">Styrker</span>
                        </div>
                        <ul className="text-xs text-green-700 dark:text-green-400 space-y-1">
                          {dimension.goodExamples.map((ex, i) => (
                            <li key={i}>• {ex}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-700 dark:text-amber-400">Forbedringspotentiale</span>
                        </div>
                        <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                          {dimension.improvementAreas.map((area, i) => (
                            <li key={i}>• {area}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </section>

        {/* Employee Breakdown */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Medarbejder-breakdown</h2>
          <div className="space-y-3">
            {employeeBreakdown.map((emp) => (
              <Card key={emp.name} className="border">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{emp.name}</div>
                        <div className="text-xs text-muted-foreground">{emp.debriefCount} debriefs</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-foreground">{emp.avgScore}</div>
                        <div className="text-xs text-muted-foreground">/10</div>
                      </div>
                      <Progress value={emp.avgScore * 10} className="w-20 h-2" />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {emp.strengths.map((s, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900">
                        {s}
                      </Badge>
                    ))}
                    {emp.improvements.map((im, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900">
                        {im}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Debrief Excerpts */}
        <section className="mb-10">
          <Collapsible open={showExcerpts} onOpenChange={setShowExcerpts}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between p-4 rounded-lg border border-dashed hover:border-primary/50 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquareQuote className="h-4 w-4" />
                  <span className="text-sm font-medium">Eksempler på debriefs</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{debriefExcerpts.length} eksempler</span>
                  {showExcerpts ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-3 space-y-1 mb-3">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={excerptFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setExcerptFilter('all')}
                  >
                    Alle
                  </Button>
                  <Button 
                    size="sm" 
                    variant={excerptFilter === 'good' ? 'default' : 'outline'}
                    onClick={() => setExcerptFilter('good')}
                    className="gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Gode eksempler
                  </Button>
                  <Button 
                    size="sm" 
                    variant={excerptFilter === 'poor' ? 'default' : 'outline'}
                    onClick={() => setExcerptFilter('poor')}
                    className="gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    Forbedringspotentiale
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                {filteredExcerpts.map((excerpt) => (
                  <div 
                    key={excerpt.id} 
                    className={`p-4 rounded-lg border ${
                      excerpt.quality === 'good' 
                        ? 'bg-green-50/50 border-green-200 dark:bg-green-950/10 dark:border-green-900' 
                        : 'bg-amber-50/50 border-amber-200 dark:bg-amber-950/10 dark:border-amber-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{excerpt.employee}</Badge>
                      <span className="text-xs text-muted-foreground">{excerpt.date}</span>
                      {excerpt.quality === 'good' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-600 ml-auto" />
                      )}
                    </div>
                    <p className="text-sm text-foreground/90 italic mb-3">"{excerpt.excerpt}"</p>
                    <div className={`text-xs p-2 rounded ${
                      excerpt.quality === 'good' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {excerpt.feedback}
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

export default DebriefQualityReportView;
