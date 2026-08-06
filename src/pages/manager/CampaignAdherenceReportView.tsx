import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBackNavigation } from "@/hooks/use-back-navigation";
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

import jarvisLogo from "@/assets/jarvis-logo.svg";
import { NavigationMenu } from "@/components/NavigationMenu";
import { AskJarvisManager } from "@/components/manager/AskJarvis";
import { HcpSearch } from "@/components/HcpSearch";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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
    id: 'dose1-initiation',
    title: 'Dose 1 Initiation',
    description: 'Focus on presenting initiation data and addressing concerns when starting new patients on Dose 1.',
    priority: 'high',
    adherenceRate: 72,
    totalMeetings: 32,
    alignedMeetings: 23,
    startDate: 'Dec 1, 2025',
    keywords: ['initiation', 'start-up', 'new patients', 'dosing', 'dose 1']
  },
  {
    id: 'cv-outcomes',
    title: 'Cardiovascular Outcomes',
    description: 'Communication of ATLAS-6 and HORIZON data regarding cardiovascular risk reduction.',
    priority: 'high',
    adherenceRate: 58,
    totalMeetings: 28,
    alignedMeetings: 16,
    startDate: 'Nov 15, 2025',
    keywords: ['cardiovascular', 'cv', 'atlas', 'horizon', 'risk reduction', 'heart']
  },
  {
    id: 'patient-adherence',
    title: 'Patient Compliance',
    description: 'Discussion of strategies to improve patient treatment adherence and minimize drop-out.',
    priority: 'medium',
    adherenceRate: 45,
    totalMeetings: 25,
    alignedMeetings: 11,
    startDate: 'Nov 1, 2025',
    keywords: ['adherence', 'compliance', 'drop-out', 'retention', 'patient']
  },
  {
    id: 'appendicitis',
    title: 'Appendicitis Management',
    description: 'Introduction to Dose 1 for appendicitis and discussion of the therapeutic area.',
    priority: 'low',
    adherenceRate: 31,
    totalMeetings: 22,
    alignedMeetings: 7,
    startDate: 'Oct 20, 2025',
    keywords: ['appendicitis', 'appendix', 'dose 1', 'inflammation', 'surgery avoidance']
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
    name: 'Sarah Miller',
    overallAdherence: 83,
    meetingCount: 6,
    campaignBreakdown: { 'dose1-initiation': 100, 'cv-outcomes': 80, 'patient-adherence': 50, 'appendicitis': 0 }
  },
  {
    name: 'James Carter',
    overallAdherence: 70,
    meetingCount: 10,
    campaignBreakdown: { 'dose1-initiation': 80, 'cv-outcomes': 60, 'patient-adherence': 40, 'appendicitis': 20 }
  },
  {
    name: 'Emily Clark',
    overallAdherence: 62,
    meetingCount: 8,
    campaignBreakdown: { 'dose1-initiation': 75, 'cv-outcomes': 50, 'patient-adherence': 50, 'appendicitis': 25 }
  },
  {
    name: 'David Walker',
    overallAdherence: 56,
    meetingCount: 5,
    campaignBreakdown: { 'dose1-initiation': 60, 'cv-outcomes': 40, 'patient-adherence': 40, 'appendicitis': 20 }
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
    employee: 'Sarah Miller',
    date: 'Dec 20, 2025',
    aligned: true,
    campaign: 'Dose 1 Initiation',
    excerpt: 'Reviewed initiation data with the chief physician. Focused on the dose escalation algorithm and addressed concerns about GI side effects at start-up. Agreed to start 3 new patients on low dose.',
    analysis: 'Aligned: Debrief addresses all key campaign elements — initiation data, dosing, and concerns.'
  },
  {
    id: '2',
    employee: 'Emily Clark',
    date: 'Dec 18, 2025',
    aligned: true,
    campaign: 'Cardiovascular Outcomes',
    excerpt: 'Presented ATLAS-6 data to the cardiology team. Strong interest in CV risk reduction. They will consider Dose 1 for type 2 diabetes patients with established heart disease.',
    analysis: 'Aligned: Specific reference to ATLAS-6 and cardiovascular risk reduction matches the campaign focus.'
  },
  {
    id: '3',
    employee: 'James Carter',
    date: 'Dec 15, 2025',
    aligned: false,
    campaign: 'Patient Compliance',
    excerpt: 'Good meeting with GP. Discussed diabetes treatment and patient groups in general. Positively received.',
    analysis: 'Not aligned: No specific reference to adherence, retention, or drop-out strategies as defined in the campaign.'
  },
  {
    id: '4',
    employee: 'David Walker',
    date: 'Dec 12, 2025',
    aligned: false,
    campaign: 'Appendicitis Management',
    excerpt: 'Meeting at the clinic. Focused primarily on Dose 1 dosing and reimbursement rules. No questions from HCP.',
    analysis: 'Not aligned: The meeting was about general dosing, not appendicitis treatment with Dose 1 as the campaign prescribes.'
  },
  {
    id: '5',
    employee: 'Sarah Miller',
    date: 'Dec 10, 2025',
    aligned: true,
    campaign: 'Patient Compliance',
    excerpt: 'Discussed retention strategies with diabetes nurse. Reviewed tips for managing side effects and motivating patients. She will implement monthly follow-up calls.',
    analysis: 'Aligned: Focus on retention, motivation, and concrete strategies matches the campaign goals.'
  }
];

const CampaignAdherenceReportView = () => {
  const navigate = useNavigate();
  const handleBack = useBackNavigation("/manager");
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
            onClick={handleBack}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {format(subDays(new Date(), 30), "MMM d")} - {format(new Date(), "MMM d, yyyy")}
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="h-4 w-4" />
              {activeCampaigns.length} active campaigns
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
                  <h2 className="text-2xl font-bold text-foreground mb-2">Overall Campaign Adherence</h2>
                  <p className="text-muted-foreground">
                    {alignedMeetings} of {totalMeetings} meetings aligned with active campaigns
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
              Over the past 30 days, the team completed {totalMeetings} meetings, of which {alignedMeetings} ({overallAdherence}%) were 
              aligned with active campaigns. The <strong>Dose 1 Initiation</strong> campaign has the highest adherence at 72%, 
              while <strong>Appendicitis Management</strong> has the lowest at 31%.
            </p>
            <p>
              A positive adherence trend is observed over the period, with improvements across all campaigns. 
              However, there remains a significant gap between high-priority campaigns (72% and 58%) and lower-priority campaigns (45% and 31%).
            </p>
            <p>
              <strong>Recommendation:</strong> Increase focus on the Patient Compliance and Appendicitis Management campaigns in the coming period. 
              Consider including specific talking points in meeting preparation to boost alignment.
            </p>
          </div>
        </section>

        {/* Active Campaigns */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Active Campaigns</h2>
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
                        {campaign.priority === 'high' ? 'High' : campaign.priority === 'medium' ? 'Medium' : 'Low'} priority
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
                      Started: {campaign.startDate}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </section>

        {/* Employee Breakdown */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Employee Adherence</h2>
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
                        <div className="text-xs text-muted-foreground">{emp.meetingCount} meetings</div>
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
                  <span className="text-sm font-medium">Debrief Examples</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{debriefExamples.length} examples</span>
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
                    All
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
                    Not aligned
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
            Generated: {format(new Date(), "MMMM d, yyyy")}
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

export default CampaignAdherenceReportView;
