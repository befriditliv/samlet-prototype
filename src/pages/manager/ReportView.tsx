import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import { enUS } from "date-fns/locale";
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
    { purpose: "Review of reimbursement rules for GLP-1 treatment", objection: "Unclear regional reimbursement rules make it difficult to assess which patients can start Ozempic", nextSteps: "Send updated reimbursement overview" },
    { purpose: "Discussion of Ozempic initiation in type 2 diabetes patients", objection: "Concern that reimbursement clauses limit the opportunity for early intervention with Ozempic", nextSteps: "Schedule follow-up meeting with reimbursement specialist" },
    { purpose: "Introduction to Ozempic treatment pathway", objection: "Region requires documentation of metformin failure before Ozempic can be prescribed with reimbursement", nextSteps: "Share clinical cases showing documentation requirements" },
    { purpose: "Meeting on treatment algorithm for type 2 diabetes", objection: "Uncertainty about whether individual reimbursement can be applied for with metformin contraindication", nextSteps: "Contact reimbursement office for clarification" },
    { purpose: "Update on GLP-1 market", objection: "Frustration that reimbursement rules vary between regions", nextSteps: "Prepare regional comparison of reimbursement rules" },
  ];
  
  // Phase 2: October-November - Shift towards combination therapy concerns
  const phase2Topics = [
    { purpose: "Ozempic in combination with SGLT2 inhibitors", objection: "Uncertainty about optimal dosing when Ozempic is combined with other antidiabetics", nextSteps: "Send dosing guide for combination therapy" },
    { purpose: "Combination therapy and patient monitoring", objection: "Concern about increased risk of hypoglycemia when combined with sulfonylurea", nextSteps: "Arrange webinar on safe combination therapy" },
    { purpose: "Multi-drug regimen with GLP-1", objection: "Lack of experience combining Ozempic with insulin – when should insulin dose be adjusted?", nextSteps: "Share protocol for insulin adjustment with GLP-1 addition" },
    { purpose: "Treatment intensification in type 2 patients", objection: "Request more data on long-term effect of Ozempic + SGLT2i combination", nextSteps: "Send relevant studies on cardiovascular outcomes" },
    { purpose: "GLP-1 as add-on to existing treatment", objection: "Patients on multiple medications express 'pill fatigue' – how to motivate them for injection?", nextSteps: "Develop patient-friendly material on weekly injection" },
  ];
  
  // Phase 3: Late November-December - Focus on patient selection and practical initiation
  const phase3Topics = [
    { purpose: "Patient selection for Ozempic treatment", objection: "Which patients should be prioritized when there is a waitlist for the diabetes outpatient clinic?", nextSteps: "Develop prioritization criteria with the clinic" },
    { purpose: "Practical handling of Ozempic initiation", objection: "GI side effects at initiation cause some patients to stop treatment too early", nextSteps: "Share tips for managing initiation side effects" },
    { purpose: "Ozempic for patients with renal insufficiency", objection: "Uncertainty about safety and efficacy in patients with moderately reduced kidney function", nextSteps: "Review data for eGFR 30-60 population" },
    { purpose: "Elderly patients and GLP-1 treatment", objection: "Concern about weight loss in elderly, frail patients – is Ozempic appropriate?", nextSteps: "Discuss individual assessment and monitoring" },
    { purpose: "Follow-up on Ozempic patients", objection: "Lack of capacity for close follow-up during the first 3 months as recommended", nextSteps: "Suggest digital follow-up solution" },
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
    title: 'Reimbursement rules and regional differences',
    fullTitle: 'Concerns about reimbursement rules, clauses and regional differences',
    description: 'HCPs express frustration over unclear or varying reimbursement rules between regions. This affects the decision to initiate Ozempic, as documentation requirements and approval processes are perceived as time-consuming.',
    color: '#16a34a',
    count: 24,
    trend: 'down',
    trendPercent: 35,
    debriefs: allDebriefs.filter(d => 
      d.objections.toLowerCase().includes('reimbursement') || 
      d.objections.toLowerCase().includes('region') ||
      d.objections.toLowerCase().includes('clause')
    ).slice(0, 24),
  },
  {
    id: 'combination-therapy',
    title: 'Combination therapy with other medications',
    fullTitle: 'Uncertainty about combination therapy with other antidiabetics',
    description: 'Increasing focus on how Ozempic is best combined with SGLT2 inhibitors, insulin and other antidiabetics. HCPs request concrete guidance on dosing, monitoring and handling of interactions.',
    color: '#ea580c',
    count: 26,
    trend: 'up',
    trendPercent: 62,
    debriefs: allDebriefs.filter(d => 
      d.objections.toLowerCase().includes('combination') || 
      d.objections.toLowerCase().includes('insulin') ||
      d.objections.toLowerCase().includes('sglt2') ||
      d.objections.toLowerCase().includes('sulfonyl') ||
      d.objections.toLowerCase().includes('multiple')
    ).slice(0, 26),
  },
  {
    id: 'patient-selection',
    title: 'Patient selection and practical initiation',
    fullTitle: 'Challenges with patient selection and practical handling of initiation',
    description: 'HCPs seek guidance on which patients should be prioritized for Ozempic, as well as practical handling of initiation including side effect management, monitoring and special patient groups.',
    color: '#1d4ed8',
    count: 15,
    trend: 'up',
    trendPercent: 180,
    debriefs: allDebriefs.filter(d => 
      d.objections.toLowerCase().includes('patient') || 
      d.objections.toLowerCase().includes('side effect') ||
      d.objections.toLowerCase().includes('initiation') ||
      d.objections.toLowerCase().includes('elderly') ||
      d.objections.toLowerCase().includes('kidney')
    ).slice(0, 15),
  },
  {
    id: 'capacity-resources',
    title: 'Capacity and resources for follow-up',
    fullTitle: 'Limited capacity for follow-up and monitoring',
    description: 'Practical challenges with following up on patients as recommended. Clinics lack resources for close monitoring during the initiation phase, which affects the willingness to initiate treatment.',
    color: '#84cc16',
    count: 5,
    trend: 'up',
    trendPercent: 25,
    debriefs: allDebriefs.filter(d => 
      d.objections.toLowerCase().includes('capacity') || 
      d.objections.toLowerCase().includes('follow-up') ||
      d.objections.toLowerCase().includes('waitlist')
    ).slice(0, 5),
  },
];

// Trend data showing monthly evolution - using cumulative percentages for area chart
const topicTrendData = [
  { month: 'Aug', subsidy: 18, combination: 4, patientSelection: 2, capacity: 1, total: 25 },
  { month: 'Sep', subsidy: 14, combination: 8, patientSelection: 3, capacity: 1, total: 26 },
  { month: 'Oct', subsidy: 8, combination: 12, patientSelection: 4, capacity: 1, total: 25 },
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
              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedCategory.description}
                </p>
              </div>

              {/* Trend indicator */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                {selectedCategory.trend === 'up' ? (
                  <ArrowUpRight className="h-5 w-5 text-green-500" />
                ) : selectedCategory.trend === 'down' ? (
                  <ArrowDownRight className="h-5 w-5 text-destructive" />
                ) : null}
                <span className="text-sm">
                  {selectedCategory.trend === 'up' ? 'Increasing' : selectedCategory.trend === 'down' ? 'Decreasing' : 'Stable'} trend: {selectedCategory.trendPercent}% change since period start
                </span>
              </div>

              {/* Referenced in debriefs */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Referenced in debriefs ({selectedCategory.debriefs.length})
                </h4>
                
                {selectedCategory.debriefs.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No debriefs in this category</p>
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
                              {/* Meeting details */}
                              <div className="bg-muted/20 rounded-lg p-4">
                                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                  Meeting Details
                                </h5>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <div className="text-muted-foreground text-xs">Date</div>
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

                              {/* Debrief content */}
                              <div>
                                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                  Debrief Content
                                </h5>
                                <div className="border rounded-lg p-4 space-y-4 bg-card">
                                  <div>
                                    <h6 className="font-semibold text-foreground mb-1">Meeting Purpose and Content</h6>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {debrief.meetingPurpose}
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <h6 className="font-semibold text-foreground mb-1">Objections Regarding</h6>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      <span className="text-primary">{debrief.objections}</span>
                                    </p>
                                  </div>
                                  
                                  <div>
                                    <h6 className="font-semibold text-foreground mb-1">Next Call Objectives</h6>
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
              <p className="text-sm text-muted-foreground">Structured analysis of HCP objections and concerns</p>
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
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to dashboard</span>
        </button>

        {/* Compact Stats & Metadata */}
        <Card className="mb-8">
          <CardContent className="py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Key stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">{totalDebriefs}</span>
                  <span className="text-sm text-muted-foreground">relevant debriefs</span>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">of</span>
                  <span className="text-lg font-semibold text-foreground">687</span>
                  <span className="text-sm text-muted-foreground">total debriefs</span>
                </div>
              </div>
              
              {/* Metadata */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {format(data.dateRange.from, "MMM d", { locale: enUS })} - {format(data.dateRange.to, "MMM d, yyyy", { locale: enUS })}
                </div>
                {data.employee === 'all' ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                        <Users className="h-4 w-4" />
                        <span>All ({salesReps.length})</span>
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" align="end">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Included employees</div>
                      <div className="flex flex-wrap gap-1.5">
                        {salesReps.map((rep) => (
                          <Badge key={rep} variant="secondary" className="text-xs">{rep}</Badge>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <Badge variant="secondary" className="text-xs">{data.employee}</Badge>
                  </div>
                )}
                <Badge variant="secondary">{data.product}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Main Analysis Content */}
          <div className="space-y-6">
            {/* Brief overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Brief Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Analysis of {totalDebriefs} relevant debriefs shows a <span className="text-foreground font-medium">clear evolution in HCP concerns</span> over the period. 
                  Initially, questions about <span className="text-foreground font-medium">reimbursement rules and regional differences</span> dominated, but focus has gradually shifted towards 
                  <span className="text-foreground font-medium"> combination therapy</span> and most recently <span className="text-foreground font-medium">patient selection</span>. 
                  This indicates that fundamental access barriers are being addressed, and HCPs are now focusing on clinical implementation.
                </p>
              </CardContent>
            </Card>

            {/* Hovedanalyse */}
            <Card>
              <CardHeader>
                <CardTitle>Concern Pattern Development for Ozempic Initiation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Topic description */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Topic Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Over the past 5 months, we have observed a significant change in the concerns HCPs express regarding Ozempic initiation. 
                    While reimbursement and regulatory questions previously dominated, these have now been replaced by more clinically oriented considerations 
                    around combination therapy and individualized patient selection.
                  </p>
                </div>

                <Separator />

                {/* Statistical analysis */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Statistical Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">Development based on {totalDebriefs} categorized debriefs</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <TrendingDown className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                      <span><span className="font-medium text-foreground">Reimbursement concerns down 35%</span> – from 18 debriefs in August to only 2 in December. Regional clarifications and better documentation have reduced uncertainty.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span><span className="font-medium text-foreground">Combination therapy up 62%</span> – HCPs are now actively seeking guidance on Ozempic together with SGLT2i, insulin and other antidiabetics.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span><span className="font-medium text-foreground">Patient selection up 180%</span> – New questions about prioritization, special patient groups and practical initiation handling now dominate.</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                {/* Insights */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Insights
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    The shift in concern patterns reflects a maturation in the market's understanding of Ozempic and indicates progress in the adoption journey.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span>HCPs are moving from "can I prescribe it?" to "how do I use it optimally?" – a positive sign of increased treatment willingness.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span>The growing interest in combination therapy suggests that Ozempic is increasingly seen as a natural part of the treatment arsenal.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Focus on patient selection and side effect management shows the need for more practical, clinical support material.</span>
                    </li>
                  </ul>
                </div>

                <Separator />

                {/* Conclusion and recommendations */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Conclusion and Recommendations
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">The market is ready for the next phase of engagement</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span><span className="font-medium text-foreground">Prioritize combination therapy:</span> Develop and distribute concrete dosing guides and protocols for Ozempic + SGLT2i/insulin.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span><span className="font-medium text-foreground">Strengthen practical support:</span> Create patient selection tools and checklists for managing initiation side effects.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span><span className="font-medium text-foreground">Address capacity challenges:</span> Consider digital follow-up solutions for clinics with limited resources.</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Objections and concerns - Category Cards */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Objections and Concerns
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
                          <ArrowUpRight className="h-3.5 w-3.5 text-green-500" />
                        ) : category.trend === 'down' ? (
                          <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />
                        ) : null}
                        <span className={category.trend === 'up' ? 'text-green-500' : category.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}>
                          {category.trend === 'up' ? '+' : category.trend === 'down' ? '-' : ''}{category.trendPercent}%
                        </span>
                        <span className="text-muted-foreground">since period start</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Topic development over time - Full width chart section */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Topic Development Over Time</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  How concerns shift from access to clinical implementation
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
                        name="Reimbursement" 
                        stroke="#16a34a" 
                        fill="url(#colorSubsidy)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="combination" 
                        name="Combination" 
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
                        name="Capacity" 
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
                        <span className="text-muted-foreground">{cat.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {cat.trend === 'up' ? (
                          <ArrowUpRight className="h-3 w-3 text-green-500" />
                        ) : cat.trend === 'down' ? (
                          <ArrowDownRight className="h-3 w-3 text-destructive" />
                        ) : null}
                        <span className={cat.trend === 'up' ? 'text-green-500' : cat.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}>
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
                    <span className="font-medium text-foreground">Key Insight:</span> Focus shifts from administrative barriers to clinical implementation – a positive sign of market maturation.
                  </p>
                </div>
              </CardContent>
            </Card>

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
          </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default ReportView;
