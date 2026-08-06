import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBackNavigation } from "@/hooks/use-back-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, AlertCircle, Send, Trash2, Star, TrendingUp, Target, MessageSquare, BookOpen, Award, Eye, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HcpSearch } from "@/components/HcpSearch";
import { AskJarvisManager } from "@/components/manager/AskJarvis";
import { NavigationMenu } from "@/components/NavigationMenu";
import jarvisLogo from "@/assets/jarvis-logo.svg";
import { cn } from "@/lib/utils";

const employees = [
  { name: "Sarah Mitchell", role: "Senior KAM", region: "Greater Copenhagen", planned: 74, canvas: 21, completed: 88, notSent: 0, outstanding: 7, adherence: 93, cancelled: 4, deleted: 2, plannedThisWeek: 10, plannedNextWeek: 3 },
  { name: "James Harrison", role: "KAM", region: "Zealand North", planned: 74, canvas: 27, completed: 101, notSent: 0, outstanding: 0, adherence: 100, cancelled: 2, deleted: 1, plannedThisWeek: 20, plannedNextWeek: 0 },
  { name: "Emily Thompson", role: "KAM", region: "Funen", planned: 38, canvas: 31, completed: 62, notSent: 0, outstanding: 7, adherence: 90, cancelled: 5, deleted: 3, plannedThisWeek: 9, plannedNextWeek: 7 },
  { name: "Michael Chen", role: "Junior KAM", region: "Jutland South", planned: 4, canvas: 0, completed: 3, notSent: 0, outstanding: 1, adherence: 75, cancelled: 1, deleted: 0, plannedThisWeek: 0, plannedNextWeek: 0 },
  { name: "Catherine Williams", role: "KAM", region: "Jutland North", planned: 0, canvas: 0, completed: 0, notSent: 0, outstanding: 0, adherence: 0, cancelled: 0, deleted: 0, plannedThisWeek: 0, plannedNextWeek: 0 },
  { name: "David Roberts", role: "Senior KAM", region: "Aarhus", planned: 52, canvas: 18, completed: 64, notSent: 1, outstanding: 5, adherence: 89, cancelled: 3, deleted: 2, plannedThisWeek: 8, plannedNextWeek: 5 },
  { name: "Jennifer Adams", role: "KAM", region: "Odense", planned: 41, canvas: 22, completed: 55, notSent: 0, outstanding: 6, adherence: 87, cancelled: 4, deleted: 1, plannedThisWeek: 6, plannedNextWeek: 4 },
  { name: "Robert Taylor", role: "KAM", region: "Aalborg", planned: 33, canvas: 12, completed: 38, notSent: 2, outstanding: 5, adherence: 80, cancelled: 2, deleted: 4, plannedThisWeek: 5, plannedNextWeek: 3 },
  { name: "Amanda Clarke", role: "Junior KAM", region: "Esbjerg", planned: 28, canvas: 9, completed: 30, notSent: 1, outstanding: 6, adherence: 78, cancelled: 6, deleted: 5, plannedThisWeek: 4, plannedNextWeek: 2 },
];

const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type TranscriptLine = { role: "hcp" | "kam"; speaker: string; text: string };
type Assessment = {
  rating: "Excellent" | "Good" | "Average" | "Needs work";
  strengths: string[];
  improvements: string[];
  recommendation: string;
  breakdown: { label: string; score: number }[];
};
type TrainingItem = {
  id: string;
  name: string;
  product: string;
  score: number;
  date: string;
  duration: string;
  hcpPersona: string;
  transcript: TranscriptLine[];
  assessment: Assessment;
};

const trainingHistory: TrainingItem[] = [
  {
    id: "1",
    name: "Overcoming Cost Concerns",
    product: "Dose 1",
    score: 4,
    date: "Dec 8, 2025",
    duration: "12 min",
    hcpPersona: "Dr. Hansen — General Practitioner",
    transcript: [
      { role: "hcp", speaker: "Dr. Hansen", text: "Hello, I'm Dr. Hansen. How can I help you today?" },
      { role: "kam", speaker: "KAM", text: "Hi Dr. Hansen, thanks for taking the time. I'd like to discuss Dose 1 and the ACUTE-1 data in acute appendicitis." },
      { role: "hcp", speaker: "Dr. Hansen", text: "I'm interested, but honestly the cost is a real concern for most of my patients." },
      { role: "kam", speaker: "KAM", text: "I hear you. The reimbursement criteria were updated this year — patients with uncomplicated appendicitis managed non-surgically are now eligible. Would it help if I walked you through the documentation requirements?" },
      { role: "hcp", speaker: "Dr. Hansen", text: "Yes, that would be useful. What about avoided surgery in the longer run?" },
      { role: "kam", speaker: "KAM", text: "ACUTE-1 showed a 34% reduction in appendectomies within 12 months. I can share the publication and a one-pager you can use in patient conversations." },
      { role: "hcp", speaker: "Dr. Hansen", text: "Send it over. I'll consider it for two patients I have in mind." },
      { role: "kam", speaker: "KAM", text: "Perfect, I'll follow up by email tomorrow." },
    ],
    assessment: {
      rating: "Good",
      strengths: [
        "Clearly explained the updated reimbursement criteria.",
        "Used ACUTE-1 trial data confidently to support the avoided-surgery benefit.",
        "Closed with a concrete follow-up commitment.",
      ],
      improvements: [
        "Did not fully explore the HCP's patient profile before presenting data.",
        "Could have asked open questions to uncover additional concerns.",
      ],
      recommendation:
        "Spend more time discovering the HCP's specific patient mix before presenting clinical data. Tailor reimbursement examples to those patients.",
      breakdown: [
        { label: "Company knowledge", score: 4 },
        { label: "Product knowledge", score: 4.5 },
        { label: "Objection handling", score: 3.5 },
        { label: "Communication", score: 4 },
      ],
    },
  },
  {
    id: "2",
    name: "Dose 1 Efficacy Discussion",
    product: "Dose 1",
    score: 4,
    date: "Dec 3, 2025",
    duration: "9 min",
    hcpPersona: "Dr. Sorensen — Emergency Physician",
    transcript: [
      { role: "hcp", speaker: "Dr. Sorensen", text: "Good to see you. What's new on non-surgical appendicitis management?" },
      { role: "kam", speaker: "KAM", text: "I wanted to revisit the resolution rates we see with Dose 1 versus standard antibiotics in your typical admission." },
      { role: "hcp", speaker: "Dr. Sorensen", text: "I already use both pathways, but I worry about recurrence." },
      { role: "kam", speaker: "KAM", text: "The 5-day regimen is key — completing the full course cuts recurrence markedly in clinical practice." },
      { role: "hcp", speaker: "Dr. Sorensen", text: "That matches my experience. What about length of stay?" },
      { role: "kam", speaker: "KAM", text: "ACUTE-2 showed a 1.8-day shorter mean stay at 30 days. I can leave you the summary." },
      { role: "hcp", speaker: "Dr. Sorensen", text: "Please do. I'll review with my team." },
    ],
    assessment: {
      rating: "Good",
      strengths: [
        "Addressed recurrence concerns directly with a practical regimen recommendation.",
        "Referenced ACUTE-2 data accurately.",
      ],
      improvements: [
        "Did not probe how the HCP currently selects between surgery and medical management.",
        "Missed a chance to discuss the follow-up imaging pathway.",
      ],
      recommendation:
        "Use a discovery question early to map current prescribing logic, then position data against that context.",
      breakdown: [
        { label: "Company knowledge", score: 4 },
        { label: "Product knowledge", score: 4.5 },
        { label: "Objection handling", score: 4 },
        { label: "Communication", score: 4 },
      ],
    },
  },
  {
    id: "3",
    name: "Managing Side Effect Concerns",
    product: "Dose 1",
    score: 5,
    date: "Nov 27, 2025",
    duration: "14 min",
    hcpPersona: "Dr. Lindgren — GP",
    transcript: [
      { role: "hcp", speaker: "Dr. Lindgren", text: "My patients complain about stomach upset on Dose 1. Many stop early." },
      { role: "kam", speaker: "KAM", text: "That's a common challenge. Taking Dose 1 with food reduces early discontinuation by roughly 40% in real-world data." },
      { role: "hcp", speaker: "Dr. Lindgren", text: "Do you have a patient handout I could give them?" },
      { role: "kam", speaker: "KAM", text: "Yes — we have a course tracker and a meal-timing guide. I'll bring physical copies next visit and email PDFs today." },
      { role: "hcp", speaker: "Dr. Lindgren", text: "Great. I'll trial it on three patients starting next week." },
      { role: "kam", speaker: "KAM", text: "I'll check back in four weeks to hear how they're doing." },
    ],
    assessment: {
      rating: "Excellent",
      strengths: [
        "Empathetic acknowledgement of the early-discontinuation problem.",
        "Offered concrete, ready-to-use patient support materials.",
        "Set a precise follow-up timeline.",
      ],
      improvements: [
        "Could quantify expected outcomes in more patient-friendly terms.",
      ],
      recommendation:
        "Keep this approach. Add one simple patient-language analogy when describing the treatment course.",
      breakdown: [
        { label: "Company knowledge", score: 5 },
        { label: "Product knowledge", score: 5 },
        { label: "Objection handling", score: 5 },
        { label: "Communication", score: 4.5 },
      ],
    },
  },
  {
    id: "4",
    name: "Treatment Adherence Challenge",
    product: "Dose 1",
    score: 3,
    date: "Nov 19, 2025",
    duration: "8 min",
    hcpPersona: "Dr. Patel — Surgical Nurse Practitioner",
    transcript: [
      { role: "hcp", speaker: "Dr. Patel", text: "Adherence is really the biggest issue in my clinic." },
      { role: "kam", speaker: "KAM", text: "The Dose 1 companion app logs every dose automatically — patients and clinicians can both see the history." },
      { role: "hcp", speaker: "Dr. Patel", text: "Sounds interesting, but is it covered?" },
      { role: "kam", speaker: "KAM", text: "It is, for patients on a full Dose 1 course. I can share the prescribing pathway." },
      { role: "hcp", speaker: "Dr. Patel", text: "Okay, send me the details." },
    ],
    assessment: {
      rating: "Average",
      strengths: [
        "Identified the core challenge quickly.",
        "Mentioned reimbursement when asked.",
      ],
      improvements: [
        "Conversation was short and product-focused rather than patient-focused.",
        "Did not demonstrate or describe the dose-logging workflow.",
        "No clear next step beyond sending information.",
      ],
      recommendation:
        "Use a clinical example or short demo to bring the dose-logging feature to life, and end with a specific commitment (call, visit, patient referral).",
      breakdown: [
        { label: "Company knowledge", score: 3 },
        { label: "Product knowledge", score: 3.5 },
        { label: "Objection handling", score: 2.5 },
        { label: "Communication", score: 3 },
      ],
    },
  },
  {
    id: "5",
    name: "Post-Discharge Pathway Optimization",
    product: "Dose 1",
    score: 4,
    date: "Nov 12, 2025",
    duration: "11 min",
    hcpPersona: "Dr. Moreau — General Surgeon",
    transcript: [
      { role: "hcp", speaker: "Dr. Moreau", text: "I'm comfortable with my current post-op protocol. Why change?" },
      { role: "kam", speaker: "KAM", text: "Dose 1's 24-hour coverage means fewer readmissions — ACUTE-3 showed a 53% reduction versus the standard regimen." },
      { role: "hcp", speaker: "Dr. Moreau", text: "That is meaningful. What about flexibility in dosing time?" },
      { role: "kam", speaker: "KAM", text: "Dose 1 can be taken any time of day, with up to 8 hours of flexibility. That helps a lot with discharge planning." },
      { role: "hcp", speaker: "Dr. Moreau", text: "Good point. Send me the ACUTE-3 summary." },
      { role: "kam", speaker: "KAM", text: "Will do — and I'll include the dosing flexibility guide as well." },
    ],
    assessment: {
      rating: "Good",
      strengths: [
        "Directly addressed the 'why change' objection with ACUTE-3 data.",
        "Linked dosing flexibility to a real need (discharge planning).",
      ],
      improvements: [
        "Could have asked which patient types the HCP currently struggles to discharge safely.",
      ],
      recommendation:
        "Open with a discovery question about readmission experience to make the ACUTE-3 data feel personally relevant.",
      breakdown: [
        { label: "Company knowledge", score: 4 },
        { label: "Product knowledge", score: 4.5 },
        { label: "Objection handling", score: 4 },
        { label: "Communication", score: 4 },
      ],
    },
  },
];

const trainingScores = [
  { label: "Completed simulations", value: "5", tone: "primary" },
  { label: "Average score", value: "4.2", tone: "success" },
  { label: "Company knowledge", value: "87.6", tone: "primary" },
  { label: "Product knowledge", value: "89", tone: "primary" },
  { label: "Objection handling", value: "85", tone: "primary" },
  { label: "Communication", value: "87", tone: "primary" },
];

const renderStars = (score: number) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} className={cn("h-4 w-4", s <= score ? "fill-warning text-warning" : "text-muted")} />
    ))}
  </div>
);

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const handleBack = useBackNavigation("/manager");
  const { slug } = useParams();
  const [openScenario, setOpenScenario] = useState<TrainingItem | null>(null);
  const [timeframe, setTimeframe] = useState<string>("30d");

  const employee = useMemo(() => employees.find((e) => slugify(e.name) === slug), [slug]);

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Employee not found</h1>
          <Button onClick={() => navigate("/manager")}>Back to dashboard</Button>
        </div>
      </div>
    );
  }

  const initials = employee.name.split(" ").map((p) => p[0]).join("").slice(0, 2);

  const timeframes: Record<string, { label: string; multiplier: number }> = {
    "7d": { label: "Last 7 days", multiplier: 0.25 },
    "30d": { label: "Last 30 days", multiplier: 1 },
    "90d": { label: "Last 90 days", multiplier: 2.85 },
    "6m": { label: "Last 6 months", multiplier: 5.6 },
    "12m": { label: "Last 12 months", multiplier: 11.2 },
    "ytd": { label: "Year to date", multiplier: 10.5 },
  };
  const tf = timeframes[timeframe];
  const scale = (n: number) => Math.round(n * tf.multiplier);
  // Adherence percentage doesn't scale with time — keep as-is
  const scaledAdherence = employee.adherence;

  const formatTranscript = (item: TrainingItem) => {
    const header = [
      `Scenario: ${item.name}`,
      `Product: ${item.product}`,
      `HCP persona: ${item.hcpPersona}`,
      `KAM: ${employee.name}`,
      `Date: ${item.date}`,
      `Duration: ${item.duration}`,
      `Score: ${item.score}/5`,
      `Overall: ${item.assessment.rating}`,
      "",
      "--- Assessment ---",
      "",
      "What went well:",
      ...item.assessment.strengths.map((s) => `- ${s}`),
      "",
      "What could be improved:",
      ...item.assessment.improvements.map((s) => `- ${s}`),
      "",
      `Recommendation: ${item.assessment.recommendation}`,
      "",
      "Score breakdown:",
      ...item.assessment.breakdown.map((b) => `- ${b.label}: ${b.score}/5`),
      "",
      "--- Transcript ---",
      "",
    ].join("\n");
    const body = item.transcript.map((l) => `${l.speaker}: ${l.text}`).join("\n\n");
    return `${header}${body}\n`;
  };

  const handleDownload = (item: TrainingItem) => {
    const blob = new Blob([formatTranscript(item)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(employee.name)}-${slugify(item.name)}-transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={handleBack} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img src={jarvisLogo} alt="Jarvis Logo" className="h-10 w-10" />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">Employee Profile</h1>
              <p className="text-sm text-muted-foreground">Performance and training overview</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-full max-w-md"><HcpSearch /></div>
              <AskJarvisManager />
              <NavigationMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 space-y-10">
        {/* Profile header */}
        <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm">
          <CardContent className="p-6 flex items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{employee.name}</h2>
              <p className="text-sm text-muted-foreground">{employee.role} · {employee.region}</p>
            </div>
            <Badge className="bg-primary/10 text-primary border-0">Active</Badge>
          </CardContent>
        </Card>

        {/* General data */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10"><BookOpen className="h-5 w-5 text-primary" /></div>
              <div>
                <h3 className="text-xl font-bold text-foreground">General performance</h3>
                <p className="text-sm text-muted-foreground">{tf.label}</p>
              </div>
            </div>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="h-9 w-44 bg-muted/50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(timeframes).map(([key, t]) => (
                  <SelectItem key={key} value={key}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Meetings</p>
                <p className="text-2xl font-bold text-foreground mt-1">{scale(employee.planned + employee.canvas)}</p>
                <p className="text-xs text-muted-foreground mt-1">{scale(employee.planned)} planned · {scale(employee.canvas)} canvas</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Debrief adherence</p>
                <p className="text-2xl font-bold text-foreground mt-1">{scaledAdherence}%</p>
                <p className="text-xs text-muted-foreground mt-1">{scale(employee.completed)} debriefs completed</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-foreground mt-1">{scale(employee.cancelled)}</p>
                <p className="text-xs text-muted-foreground mt-1">{tf.label}</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Deleted</p>
                <p className="text-2xl font-bold text-foreground mt-1">{scale(employee.deleted)}</p>
                <p className="text-xs text-muted-foreground mt-1">{tf.label}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><CheckCircle className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed debriefs</p>
                  <p className="font-semibold text-foreground">{scale(employee.completed)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10"><Send className="h-4 w-4 text-amber-500" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Not sent</p>
                  <p className="font-semibold text-foreground">{scale(employee.notSent)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10"><AlertCircle className="h-4 w-4 text-destructive" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p className="font-semibold text-foreground">{scale(employee.outstanding)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><TrendingUp className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Planned this week</p>
                  <p className="font-semibold text-foreground">{employee.plannedThisWeek}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><TrendingUp className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Planned next week</p>
                  <p className="font-semibold text-foreground">{employee.plannedNextWeek}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted"><Trash2 className="h-4 w-4 text-muted-foreground" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Deleted meetings</p>
                  <p className="font-semibold text-foreground">{scale(employee.deleted)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Training results */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10"><Award className="h-5 w-5 text-primary" /></div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Training platform results</h3>
                <p className="text-sm text-muted-foreground">Simulations and skill scores</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/training-platform")}>
              Open training platform
            </Button>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {trainingScores.map((s) => (
              <Card key={s.label} className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className={cn("text-2xl font-bold", s.tone === "success" ? "text-success" : "text-primary")}>{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left py-4 px-5 text-sm font-semibold text-foreground">Scenario</th>
                    <th className="text-left py-4 px-5 text-sm font-semibold text-foreground">Product</th>
                    <th className="text-left py-4 px-5 text-sm font-semibold text-foreground">Date</th>
                    <th className="text-left py-4 px-5 text-sm font-semibold text-foreground">Score</th>
                    <th className="text-right py-4 px-5 text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trainingHistory.map((t, idx) => (
                    <tr key={t.id} className={cn("hover:bg-muted/30 transition-colors", idx !== trainingHistory.length - 1 && "border-b border-border/50")}>
                      <td className="py-4 px-5 font-medium text-foreground">{t.name}</td>
                      <td className="py-4 px-5 text-muted-foreground">{t.product}</td>
                      <td className="py-4 px-5 text-muted-foreground">{t.date}</td>
                      <td className="py-4 px-5">{renderStars(t.score)}</td>
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => setOpenScenario(t)} className="gap-1.5">
                            <Eye className="h-3.5 w-3.5" /> View
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDownload(t)} className="gap-1.5">
                            <Download className="h-3.5 w-3.5" /> Download
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </main>

      <Dialog open={!!openScenario} onOpenChange={(o) => !o && setOpenScenario(null)}>
        <DialogContent className="max-w-3xl">
          {openScenario && (
            <>
              <DialogHeader>
                <DialogTitle>{openScenario.name}</DialogTitle>
                <DialogDescription>
                  {openScenario.hcpPersona} · {openScenario.product} · {openScenario.date} · {openScenario.duration}
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center justify-between gap-3 -mt-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-0">{openScenario.assessment.rating}</Badge>
                  {renderStars(openScenario.score)}
                </div>
                <Button size="sm" variant="outline" onClick={() => handleDownload(openScenario)} className="gap-1.5">
                  <Download className="h-3.5 w-3.5" /> Download transcript
                </Button>
              </div>

              <Tabs defaultValue="assessment" className="mt-2">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                  <TabsTrigger value="transcript">Transcript</TabsTrigger>
                </TabsList>

                <TabsContent value="assessment" className="mt-4">
                  <ScrollArea className="h-[460px] pr-4">
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Card className="border-0 bg-success/5">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <h4 className="font-semibold text-foreground text-sm">What went well</h4>
                            </div>
                            <ul className="space-y-2">
                              {openScenario.assessment.strengths.map((s, i) => (
                                <li key={i} className="flex gap-2 text-sm text-foreground">
                                  <CheckCircle className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                                  <span className="leading-relaxed">{s}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                        <Card className="border-0 bg-destructive/5">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <AlertCircle className="h-4 w-4 text-destructive" />
                              <h4 className="font-semibold text-foreground text-sm">What could be improved</h4>
                            </div>
                            <ul className="space-y-2">
                              {openScenario.assessment.improvements.map((s, i) => (
                                <li key={i} className="flex gap-2 text-sm text-foreground">
                                  <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                                  <span className="leading-relaxed">{s}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>

                      <Card className="border-0 bg-primary/5">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold text-foreground text-sm">Recommendation</h4>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{openScenario.assessment.recommendation}</p>
                        </CardContent>
                      </Card>

                      <div>
                        <h4 className="font-semibold text-foreground text-sm mb-3">Score breakdown</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {openScenario.assessment.breakdown.map((b) => (
                            <div key={b.label} className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/40">
                              <span className="text-sm text-foreground">{b.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">{b.score.toFixed(1)}</span>
                                {renderStars(Math.round(b.score))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="transcript" className="mt-4">
                  <ScrollArea className="h-[460px] pr-4">
                    <div className="space-y-3">
                      {openScenario.transcript.map((line, i) => (
                        <div key={i} className={cn("flex gap-3", line.role === "kam" ? "flex-row-reverse" : "flex-row")}>
                          <div className={cn(
                            "rounded-2xl px-4 py-2.5 max-w-[80%] text-sm",
                            line.role === "kam"
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-muted text-foreground rounded-bl-sm"
                          )}>
                            <div className="text-xs font-semibold opacity-80 mb-1">{line.speaker}</div>
                            <div className="leading-relaxed">{line.text}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export { slugify };
export default EmployeeDetail;