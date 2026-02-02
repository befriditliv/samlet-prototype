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
import { enUS } from "date-fns/locale";
import jarvisLogo from "@/assets/jarvis-logo.svg";
import { NavigationMenu } from "@/components/NavigationMenu";
import { AskJarvisManager } from "@/components/manager/AskJarvis";
import { HcpSearch } from "@/components/HcpSearch";

interface InsightReportData {
  reportType?: string;
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

// Ozempic Initiation categories
const ozempicCategories: InsightCategory[] = [
  { 
    id: '1', 
    title: 'No objections when initiating Ozempic', 
    count: 111,
    impact: 'positive',
    description: 'A large portion of HCPs have not reported any objections when initiating Ozempic patients. Many HCPs have mentioned that there are no specific objections or concerns regarding Ozempic initiation, and some have even expressed positive interest in the treatment.'
  },
  { 
    id: '2', 
    title: 'Interest in follow-up and additional information', 
    count: 39,
    impact: 'positive',
    description: 'There is general interest among HCPs for follow-up and additional information about Ozempic. Some HCPs have expressed interest in follow-up appointments about treatment plans, and there is also interest in materials about hypoglycemia and organ protection.'
  },
  { 
    id: '3', 
    title: 'Questions and need for clarification', 
    count: 35,
    impact: 'neutral',
    description: 'Several HCPs have asked questions and expressed the need for clarification regarding Ozempic. There are many questions about the dosing algorithm, including the use of 8 doses and 2 mg.'
  },
  { 
    id: '4', 
    title: 'Concerns and objections at initiation', 
    count: 20,
    impact: 'negative',
    description: 'Several HCPs have expressed concerns and objections when initiating Ozempic. Some of the concerns stem from regional requirements to first try DPP-4 inhibitors.'
  },
];

interface Statement {
  id: string;
  role: string;
  date: string;
  quote: string;
  source: string;
}

// Generate realistic statements for each category
const generateStatements = (categoryId: string, count: number, quotes: string[]): Statement[] => {
  const roles = ['Physician', 'Nurse', 'Specialist'];
  const names = ['James Harrison', 'Sarah Chen', 'Michael Thompson', 'Emily Roberts', 'David Wright', 'Lisa Anderson', 'Robert Mitchell', 'Catherine Williams', 'Andrew Palmer', 'Rebecca Foster', 'Jennifer Moore', 'Christopher Lee', 'Amanda Taylor', 'Daniel Brown', 'Jessica Clark'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `${categoryId}-${i}`,
    role: roles[i % roles.length],
    date: `${['Sep', 'Oct', 'Nov', 'Dec'][Math.floor(Math.random() * 4)]} ${Math.floor(Math.random() * 28) + 1}, 2025`,
    quote: quotes[i % quotes.length],
    source: `${names[i % names.length]} - 2025-${String(9 + Math.floor(i / 10)).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`
  }));
};

// Sentiment & Market Trends categories
const sentimentCategories: InsightCategory[] = [
  { 
    id: 's1', 
    title: 'Generally positive sentiment towards Novo Nordisk products', 
    count: 87,
    impact: 'positive',
    description: 'The majority of HCPs express satisfaction with Novo Nordisk\'s product portfolio and support. Particularly good experience with GLP-1 products and the value of clinical support materials is mentioned.'
  },
  { 
    id: 's2', 
    title: 'Increasing interest in weight loss treatment', 
    count: 64,
    impact: 'positive',
    description: 'Significantly increased focus on weight loss treatment among HCPs. Several are requesting information about Wegovy and discussing patient groups that could benefit from the treatment.'
  },
  { 
    id: 's3', 
    title: 'Concerns about availability and supply security', 
    count: 42,
    impact: 'negative',
    description: 'Several HCPs and HCOs express frustration over delivery challenges. This affects their willingness to initiate new patients on certain products.'
  },
  { 
    id: 's4', 
    title: 'Desire for more digital communication', 
    count: 31,
    impact: 'neutral',
    description: 'HCPs are requesting more digital contact options and online resources. There is interest in webinars, digital updates and self-service solutions.'
  },
  { 
    id: 's5', 
    title: 'Competitive pressure from biosimilars', 
    count: 18,
    impact: 'negative',
    description: 'Some HCOs mention price pressure from biosimilars and generic alternatives. This primarily affects the insulin market and requires clear value communication.'
  },
];

// Off-Label Information categories
const offLabelCategories: InsightCategory[] = [
  { 
    id: 'ol1', 
    title: 'Off-label prescription of Ozempic for obesity', 
    count: 28,
    impact: 'neutral',
    description: 'HCPs have unsolicited mentioned that they prescribe Ozempic to patients with severe obesity, even though it is not the approved indication. Several mention the price difference to Wegovy as the reason.'
  },
  { 
    id: 'ol2', 
    title: 'Clinics with systematic off-label practice', 
    count: 12,
    impact: 'neutral',
    description: 'Some clinics have established a regular practice for off-label prescription. The HCPs themselves brought this up during conversations about patient pathways.'
  },
  { 
    id: 'ol3', 
    title: 'Price differences mentioned as motivation', 
    count: 18,
    impact: 'neutral',
    description: 'HCPs have spontaneously mentioned that Ozempic 1.0mg is significantly cheaper than Wegovy and has the same effect, as justification for off-label use.'
  },
  { 
    id: 'ol4', 
    title: 'Patient demand drives decision', 
    count: 9,
    impact: 'neutral',
    description: 'Some HCPs mention that patients themselves request Ozempic for weight loss after hearing about it from friends or media.'
  },
];

// Statements for off-label report
const offLabelStatementsByCategory: Record<string, Statement[]> = {
  'ol1': generateStatements('ol1', 28, [
    'The physician unsolicited mentioned that they have started prescribing Ozempic 1.0mg for severe obesity at the clinic.',
    'The HCP said that several patients receive Ozempic off-label for weight loss with good results.',
    'During the conversation, the physician mentioned that they use Ozempic for obese patients without diabetes.',
    'The clinic\'s practice now includes Ozempic for pure obesity treatment, the HCP explained.',
    'The physician spontaneously stated that they prescribe Ozempic off-label as it is cheaper than Wegovy.',
  ]),
  'ol2': generateStatements('ol2', 12, [
    'The clinic has established a regular practice to offer Ozempic to obese patients.',
    'The HCP described their systematic approach to off-label prescription of Ozempic.',
    'The physician explained that all doctors at the clinic now use Ozempic for obesity.',
    'The clinic has had internal discussions and decided to offer Ozempic off-label.',
  ]),
  'ol3': generateStatements('ol3', 18, [
    'The physician mentioned that Ozempic 1.0mg is significantly cheaper than Wegovy and has the same effect.',
    'The HCP highlighted the price advantage of Ozempic over Wegovy for obesity treatment.',
    'Price is the primary reason for choosing Ozempic over Wegovy, explained the physician.',
    'Patients prefer Ozempic due to lower out-of-pocket costs, said the HCP.',
  ]),
  'ol4': generateStatements('ol4', 9, [
    'Patients come asking specifically for Ozempic for weight loss, said the physician.',
    'The HCP mentioned increased patient demand for Ozempic after media coverage.',
    'Many patients have heard about Ozempic from friends and want to try it, said the physician.',
  ]),
};

// Statements for sentiment report
const sentimentStatementsByCategory: Record<string, Statement[]> = {
  's1': generateStatements('s1', 87, [
    'Very satisfied with Novo Nordisk\'s products and the support we receive.',
    'GLP-1 treatment has changed our approach to type 2 diabetes.',
    'Good clinical material that is easy to use in everyday practice.',
    'Patients respond well to the treatment.',
    'Appreciate the personal contact with the KAM.',
  ]),
  's2': generateStatements('s2', 64, [
    'Seeing great interest from patients regarding weight loss treatment.',
    'Want more knowledge about Wegovy and indications.',
    'Weight loss has become a central topic in consultations.',
    'Requesting guidelines for patient selection for weight loss treatment.',
  ]),
  's3': generateStatements('s3', 42, [
    'Supply uncertainty makes it difficult to start new patients.',
    'Patients are frustrated about lack of availability.',
    'We have had to postpone initiation due to delivery problems.',
    'Want better communication about expected delivery time.',
  ]),
  's4': generateStatements('s4', 31, [
    'Would like more online resources.',
    'Webinars would be an effective way to keep us updated.',
    'Digital access to product information would save time.',
  ]),
  's5': generateStatements('s5', 18, [
    'We see price pressure from biosimilars in the insulin area.',
    'The region is pushing for cheaper alternatives.',
    'Need for clear communication of added value.',
  ]),
};

// Statements for ozempic report
const ozempicStatementsByCategory: Record<string, Statement[]> = {
  '1': generateStatements('1', 111, [
    'No objections were mentioned by HCPs regarding initiation of Ozempic patients.',
    'The HCP had no objections or concerns about starting Ozempic.',
    'Positive reception of Ozempic as first choice.',
    'No concerns at initiation – the patient was motivated.',
    'Unproblematic initiation, HCP was already familiar with the product.',
    'Good experience with previous patients, no reservations.',
    'HCP expressed confidence in Ozempic as a treatment choice.',
  ]),
  '2': generateStatements('2', 39, [
    'There is interest in more knowledge about Score2 diabetes and hypoglycemia.',
    'Want materials on organ protection with Ozempic.',
    'Interest in follow-up appointment about treatment plans.',
    'Would like more data on long-term effects.',
    'Requesting patient-friendly information materials.',
  ]),
  '3': generateStatements('3', 35, [
    'Patients express concern about dosing algorithms, including the use of 8 doses and 2 mg.',
    'Questions about requirements for trying antidiabetics before Ozempic.',
    'Uncertainty about dose escalation in elderly patients.',
    'Questions about the algorithm for switching from insulin.',
    'Need for clarification on combination with other preparations.',
  ]),
  '4': generateStatements('4', 20, [
    'Objections were raised about the region\'s clause interpretation in connection with initiation.',
    'Concern about switching well-treated insulin patients to Ozempic.',
    'Regional requirements for DPP-4 trial first create frustration.',
    'Concern about GI side effects in vulnerable patients.',
  ]),
};

const InsightReportView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reportData = location.state as InsightReportData | null;
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [showStatements, setShowStatements] = useState(false);

  const data: InsightReportData = reportData || {
    reportType: 'ozempic-initiation',
    title: "Ozempic Initiation Insights",
    query: "hvad siger hcperne ift. ozempic initiering",
    dateRange: { from: new Date(2025, 6, 1), to: new Date(2025, 11, 31) },
    product: "Ozempic",
    employee: "all"
  };

  // Select data based on report type
  const isSentimentReport = data.reportType === 'sentiment-trends';
  const isOffLabelReport = data.reportType === 'off-label-insights';
  
  const insightCategories = isOffLabelReport 
    ? offLabelCategories 
    : isSentimentReport 
      ? sentimentCategories 
      : ozempicCategories;
  
  const statementsByCategory = isOffLabelReport 
    ? offLabelStatementsByCategory 
    : isSentimentReport 
      ? sentimentStatementsByCategory 
      : ozempicStatementsByCategory;
  
  const allStatements = Object.values(statementsByCategory).flat();

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
      ? `${openCategories.length} themes` 
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
            onClick={() => navigate(-1)}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {format(data.dateRange.from, "MMM d", { locale: enUS })} - {format(data.dateRange.to, "MMM d, yyyy", { locale: enUS })}
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {data.employee === 'all' ? 'All' : data.employee}
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
            {isOffLabelReport ? (
              <>
                <p>
                  This report identifies debriefs where HCPs have unsolicited shared information about off-label prescription of Ozempic for the treatment of severe obesity. A total of {totalStatements} observations have been recorded in the period where HCPs have mentioned off-label practices without this being initiated by the employee.
                </p>
                <p>
                  <strong>Important:</strong> In accordance with guidelines, employees have not facilitated or promoted dialogue about off-label prescription. It is clearly stated in all records that it was the physician who unsolicited mentioned off-label practices, and that the employee steered the conversation back to the meeting's original purpose.
                </p>
              </>
            ) : isSentimentReport ? (
              <>
                <p>
                  The analysis of HCP and HCO interactions from October to December 2025 shows an overall positive sentiment towards Novo Nordisk's product portfolio. GLP-1 products in particular are well received, and there is a significantly increasing interest in weight loss treatment among healthcare professionals.
                </p>
                <p>
                  However, challenges related to product availability and supply security have been identified, which affect HCPs' willingness to initiate new patients. Additionally, there is an increasing desire for digital communication channels and more flexible contact options.
                </p>
              </>
            ) : (
              <>
                <p>
                  In the period from late August to December 2025, there have been a number of debates and observations regarding the initiation of Ozempic patients among HCPs, primarily in general practice. Generally, there is an overweight of reports indicating that no objections were encountered regarding the initiation of Ozempic patients. This has been mentioned repeatedly by both nurses and physicians, suggesting a general acceptance of the product.
                </p>
                <p>
                  However, concerns and objections have also been raised in certain cases. Some HCPs have expressed concern about switching well-treated insulin patients to Ozempic, especially when their HbA1c levels are satisfactory. Pressure from regions and fear of complicating treatments have also been mentioned, as well as frustration with the subsidy clause.
                </p>
              </>
            )}
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
                <span className="text-sm text-muted-foreground ml-1">neutral</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30">
                <ThumbsDown className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <span className="text-lg font-semibold text-foreground">{negativeCount}</span>
                <span className="text-sm text-muted-foreground ml-1">challenges</span>
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
            <h2 className="text-xl font-semibold text-foreground">Themes</h2>
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
                  <span>{displayedStatements.length} sources</span>
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

        {/* Footer Actions */}
        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-muted-foreground">
            Generated: {format(new Date(), "MMMM d, yyyy", { locale: enUS })}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-background">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-background">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InsightReportView;
