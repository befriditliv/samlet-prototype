import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  Calendar,
  Users,
  Download,
  Share2,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";
import { da } from "date-fns/locale";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
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

// Mock insight categories from the PDF structure
interface InsightCategory {
  id: string;
  title: string;
  count: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

const insightCategories: InsightCategory[] = [
  { id: '1', title: 'Ingen indvendinger ved opstart af Ozempic', count: 111, sentiment: 'positive' },
  { id: '2', title: 'Interesse for opfølgning og yderligere information om Ozempic', count: 39, sentiment: 'neutral' },
  { id: '3', title: 'Spørgsmål og behov for afklaring vedrørende Ozempic', count: 35, sentiment: 'negative' },
];

// Sentiment trend data
const sentimentTrendData = [
  { month: 'Jul', positive: 65, neutral: 25, negative: 10 },
  { month: 'Aug', positive: 58, neutral: 28, negative: 14 },
  { month: 'Sep', positive: 62, neutral: 24, negative: 14 },
  { month: 'Okt', positive: 70, neutral: 20, negative: 10 },
  { month: 'Nov', positive: 72, neutral: 18, negative: 10 },
  { month: 'Dec', positive: 75, neutral: 17, negative: 8 },
];

// Activity types data
const activityTypesData = [
  { name: 'Molecules', value: 10 },
  { name: 'Brands', value: 20 },
  { name: 'Competition', value: 10 },
  { name: 'Market Access', value: 10 },
  { name: 'Other', value: 10 },
];

// Mock statements from the report
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
];

// Robustness sources
const robustnessSources = [
  { source: 'Interaction: Lene Petersen, Henrik Pals - 2025-09-04', count: 2 },
  { source: 'Interaction: Stine Vedel Andersen, Nina Lone Thyman - 2025-09-26', count: 1 },
  { source: 'Interaction: Jensen, Lise Hejberg Øhlenschlaeger - 2025-11-18', count: 1 },
  { source: 'Interaction: Anne Sofie Vedel - 2025-10-27', count: 1 },
  { source: 'Interaction: Mia Dam Lekke, Mai Brit Pedersen - 2025-11-05', count: 1 },
];

const InsightReportView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reportData = location.state as InsightReportData | null;

  // Fallback data
  const data: InsightReportData = reportData || {
    title: "Ozempic Initiation Insights",
    query: "What are the main barriers to Ozempic initiation?",
    dateRange: { from: new Date(2025, 6, 1), to: new Date(2025, 11, 31) },
    product: "Ozempic",
    employee: "all"
  };

  const getSentimentColor = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-700 border-green-200';
      case 'neutral': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'negative': return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  };

  const getSentimentIcon = (sentiment: 'positive' | 'neutral' | 'negative') => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4" />;
      case 'neutral': return <Minus className="h-4 w-4" />;
      case 'negative': return <TrendingDown className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
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

      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Back button and metadata */}
        <div className="flex items-center justify-between">
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
              <span>{data.employee === 'all' ? 'All employees' : data.employee}</span>
            </div>
            <Badge variant="outline">{data.product}</Badge>
          </div>
        </div>

        {/* Executive Summary */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-card/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Insight Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insightCategories.map((category) => (
                <div 
                  key={category.id}
                  className={`p-4 rounded-xl border ${getSentimentColor(category.sentiment)} transition-all hover:shadow-md cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl font-bold">({category.count})</span>
                    {getSentimentIcon(category.sentiment)}
                  </div>
                  <p className="text-sm font-medium leading-snug">{category.title}</p>
                </div>
              ))}
            </div>

            {/* Summary Text */}
            <div className="prose prose-sm max-w-none text-foreground/90">
              <p>
                I perioden fra slutningen af august til december 2025 har der været en række debatter og observationer omkring igangsættelse af Ozempic-patienter blandt HCP'erne, primært inden for almen praksis. Generelt er der en overvægt af rapporter, der indikerer, at der ikke er mødt indvendinger vedrørende opstart af Ozempic-patienter. Dette er blevet nævnt gentagne gange af både sygeplejersker og læger, hvilket tyder på en generel accept af produktet.
              </p>
              <p>
                Der er dog også blevet rejst bekymringer og indvendinger i visse tilfælde. Nogle HCP'er har udtrykt bekymring over at skifte velbehandlede insulinpatienter til Ozempic, især når deres HbA1c-niveauer er tilfredsstillende. Der er også blevet nævnt pres fra regionerne og frygt for at komplicere behandlingerne, samt frustration over tilskudsklausulen, som kan forhindre nogle patienter i at få adgang til Ozempic.
              </p>
              <p>
                Samlet set viser dataene, at der er en positiv tendens mod at igangsætte Ozempic-patienter, men der er stadig nogle bekymringer og spørgsmål, der skal adresseres for at sikre en glat implementering og optimal patientpleje.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data for all discovered insights header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Data for all discovered insights</h2>
        </div>

        {/* Sentiment Analysis Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sentimentTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="positive" 
                    stackId="1" 
                    stroke="#22c55e" 
                    fill="#22c55e" 
                    fillOpacity={0.6}
                    name="Positive"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="neutral" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    name="Neutral"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="negative" 
                    stackId="1" 
                    stroke="#f97316" 
                    fill="#f97316" 
                    fillOpacity={0.6}
                    name="Negative"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Robustness Indicators */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Robustness Indicators</CardTitle>
              <p className="text-sm text-muted-foreground">Used Sources</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {robustnessSources.map((source, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <span className="text-sm text-foreground truncate flex-1 mr-4">{source.source}</span>
                    <Badge variant="secondary" className="shrink-0">({source.count})</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Types */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Activity Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityTypesData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" horizontal={false} />
                    <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statement Overview */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Statement Overview</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">({statements.length * 40}) statements from HCPs</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statements.map((statement) => (
                <div key={statement.id} className="p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors">
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
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="border-0 shadow-sm">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Report generated: {format(new Date(), "d. MMMM yyyy 'kl.' HH:mm", { locale: da })}
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
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
