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
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  BarChart3,
  Download,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
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

// Sample data for comparison chart
const comparisonData = [
  { name: 'Uge 1', current: 42, previous: 38 },
  { name: 'Uge 2', current: 35, previous: 45 },
  { name: 'Uge 3', current: 58, previous: 52 },
  { name: 'Uge 4', current: 48, previous: 41 },
];

// Objection categories with data
const objectionCategories = [
  {
    id: 'regional-interpretation',
    title: 'Regionens fortolkning',
    description: 'Indvendinger og bekymringer om regionens fortolkning af klausuler og retningslinjer.',
    currentCount: 12,
    previousCount: 8,
    trend: 'up' as const,
    items: [
      { text: 'Usikkerhed om tilskudsregler i Region Hovedstaden', count: 5, isNew: true },
      { text: 'Fortolkning af igangsættelse hos praktiserende læger', count: 4, isNew: false },
      { text: 'Regionale forskelle i behandlingsstart', count: 3, isNew: false },
    ]
  },
  {
    id: 'treatment-start',
    title: 'Opstart af behandling',
    description: 'Indvendinger eller bekymringer om at starte behandling hos specifikke patientgrupper.',
    currentCount: 7,
    previousCount: 12,
    trend: 'down' as const,
    items: [
      { text: 'Bekymring om opstart hos ældre patienter (>75 år)', count: 3, isNew: false },
      { text: 'Usikkerhed ved komorbiditet med hjerte-kar-sygdomme', count: 2, isNew: false },
      { text: 'Dosisoptrapning ved nedsat nyrefunktion', count: 2, isNew: true },
    ]
  },
  {
    id: 'uncertainty',
    title: 'Usikkerhed',
    description: 'Usikkerhed om tilskud, retningslinjer eller ansøgninger.',
    currentCount: 15,
    previousCount: 15,
    trend: 'neutral' as const,
    items: [
      { text: 'Ansøgningsproces til individuelle tilskud', count: 6, isNew: false },
      { text: 'Dokumentationskrav ved skift fra anden GLP-1', count: 5, isNew: true },
      { text: 'Retningslinjer for monitorering', count: 4, isNew: false },
    ]
  },
  {
    id: 'side-effects',
    title: 'Bivirkninger',
    description: 'Bekymringer relateret til bivirkninger og håndtering heraf.',
    currentCount: 9,
    previousCount: 6,
    trend: 'up' as const,
    items: [
      { text: 'GI-bivirkninger ved hurtig optrapning', count: 4, isNew: false },
      { text: 'Kvalme og appetitløshed i startfasen', count: 3, isNew: false },
      { text: 'Håndtering af hypoglykæmi ved kombination', count: 2, isNew: true },
    ]
  },
];

// Topic frequency data for chart
const topicFrequencyData = [
  { category: 'Regionens fortolkning', current: 12, previous: 8 },
  { category: 'Opstart af behandling', current: 7, previous: 12 },
  { category: 'Usikkerhed', current: 15, previous: 15 },
  { category: 'Bivirkninger', current: 9, previous: 6 },
  { category: 'Pris og økonomi', current: 4, previous: 7 },
];

const TrendIndicator = ({ trend, currentCount, previousCount }: { trend: 'up' | 'down' | 'neutral', currentCount: number, previousCount: number }) => {
  const diff = currentCount - previousCount;
  const percentage = previousCount > 0 ? Math.round((diff / previousCount) * 100) : 0;
  
  if (trend === 'up') {
    return (
      <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
        <ArrowUpRight className="h-4 w-4" />
        <span className="text-sm font-medium">+{percentage}%</span>
      </div>
    );
  }
  if (trend === 'down') {
    return (
      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
        <ArrowDownRight className="h-4 w-4" />
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <Minus className="h-4 w-4" />
      <span className="text-sm font-medium">0%</span>
    </div>
  );
};

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

  const totalCurrentObjections = objectionCategories.reduce((sum, cat) => sum + cat.currentCount, 0);
  const totalPreviousObjections = objectionCategories.reduce((sum, cat) => sum + cat.previousCount, 0);
  const newObjectionsCount = objectionCategories.reduce((sum, cat) => 
    sum + cat.items.filter(item => item.isNew).length, 0
  );

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

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Navigation */}
        <button 
          onClick={() => navigate('/manager')}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Tilbage til dashboard</span>
        </button>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
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
                <div className="text-3xl font-bold text-foreground">{totalCurrentObjections}</div>
                <div className="text-sm text-muted-foreground mt-1">Relevante debriefs</div>
                {data.compareEnabled && (
                  <div className="mt-1">
                    <TrendIndicator 
                      trend={totalCurrentObjections > totalPreviousObjections ? 'up' : totalCurrentObjections < totalPreviousObjections ? 'down' : 'neutral'} 
                      currentCount={totalCurrentObjections} 
                      previousCount={totalPreviousObjections} 
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{newObjectionsCount}</div>
                <div className="text-sm text-muted-foreground mt-1">Nye emner</div>
                <Badge variant="secondary" className="mt-2 text-xs">Denne periode</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Period Info */}
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

        {/* Comparison Chart */}
        {data.compareEnabled && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Emnefrekvens - Sammenligning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicFrequencyData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="category" type="category" width={140} className="text-xs" tick={{ fill: 'hsl(var(--foreground))' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend />
                    <Bar dataKey="current" name="Nuværende periode" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="previous" name="Tidligere periode" fill="hsl(var(--muted-foreground))" opacity={0.5} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Kort oversigt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              I den aktuelle periode er der registreret <span className="text-foreground font-medium">{totalCurrentObjections} emner</span> fordelt på {objectionCategories.length} kategorier.
              {data.compareEnabled && (
                <> Sammenlignet med tidligere periode ({totalPreviousObjections} emner) ses en 
                {totalCurrentObjections > totalPreviousObjections 
                  ? <span className="text-amber-600 dark:text-amber-400 font-medium"> stigning på {Math.round(((totalCurrentObjections - totalPreviousObjections) / totalPreviousObjections) * 100)}%</span>
                  : totalCurrentObjections < totalPreviousObjections
                  ? <span className="text-emerald-600 dark:text-emerald-400 font-medium"> reduktion på {Math.round(((totalPreviousObjections - totalCurrentObjections) / totalPreviousObjections) * 100)}%</span>
                  : <span className="font-medium"> uændret tendens</span>
                }.</>
              )}
              {newObjectionsCount > 0 && (
                <> Der er identificeret <span className="text-primary font-medium">{newObjectionsCount} nye emner</span> i denne periode.</>
              )}
            </p>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Objection Categories */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Indvendinger og bekymringer
            </h3>

            {objectionCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{category.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold">{category.currentCount}</div>
                        {data.compareEnabled && (
                          <div className="text-xs text-muted-foreground">
                            vs. {category.previousCount}
                          </div>
                        )}
                      </div>
                      {data.compareEnabled && (
                        <TrendIndicator 
                          trend={category.trend} 
                          currentCount={category.currentCount} 
                          previousCount={category.previousCount} 
                        />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{item.text}</span>
                          {item.isNew && (
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs">Ny</Badge>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Insights Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Indsigter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>Stigende tendens i bekymringer om <span className="text-foreground font-medium">regionens fortolkning</span> af retningslinjer kan indikere behov for tydeligere kommunikation.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>Faldende antal bekymringer om <span className="text-foreground font-medium">opstart af behandling</span> tyder på forbedret forståelse blandt HCP'er.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span><span className="text-foreground font-medium">{newObjectionsCount} nye emner</span> kræver opmærksomhed og bør addresseres i kommende engagement-aktiviteter.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Konklusion og anbefalinger
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>Prioriter uddannelsesmateriale om regionale fortolkningsforskelle.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>Adresser nye emner om dokumentationskrav ved skift fra anden GLP-1.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-emerald-500 mt-1">•</span>
                    <span>Fortsæt positiv udvikling i kommunikation om behandlingsopstart.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
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

            {/* Topics Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Emner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Kendte emner</span>
                  <Badge variant="secondary">{totalCurrentObjections - newObjectionsCount}</Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-muted-foreground">Nye emner</span>
                  <Badge className="bg-primary/10 text-primary">{newObjectionsCount}</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Total</span>
                  <Badge>{totalCurrentObjections}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Trend Summary */}
            {data.compareEnabled && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Trend oversigt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {objectionCategories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground truncate flex-1">{cat.title}</span>
                      <TrendIndicator 
                        trend={cat.trend} 
                        currentCount={cat.currentCount} 
                        previousCount={cat.previousCount} 
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Weekly Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ugentlig fordeling</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="current" name="Nu" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      {data.compareEnabled && (
                        <Bar dataKey="previous" name="Før" fill="hsl(var(--muted-foreground))" opacity={0.4} radius={[4, 4, 0, 0]} />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
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