import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, AlertCircle, Send, Trash2, Star, TrendingUp, Target, MessageSquare, BookOpen, Award, Eye, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
type TrainingItem = {
  id: string;
  name: string;
  product: string;
  score: number;
  date: string;
  duration: string;
  hcpPersona: string;
  transcript: TranscriptLine[];
};

const trainingHistory: TrainingItem[] = [
  {
    id: "1",
    name: "Overcoming Cost Concerns",
    product: "Wegovy",
    score: 4,
    date: "Dec 8, 2025",
    duration: "12 min",
    hcpPersona: "Dr. Hansen — General Practitioner",
    transcript: [
      { role: "hcp", speaker: "Dr. Hansen", text: "Hello, I'm Dr. Hansen. How can I help you today?" },
      { role: "kam", speaker: "KAM", text: "Hi Dr. Hansen, thanks for taking the time. I'd like to discuss Wegovy and the SELECT data with you." },
      { role: "hcp", speaker: "Dr. Hansen", text: "I'm interested, but honestly the cost is a real concern for most of my patients." },
      { role: "kam", speaker: "KAM", text: "I hear you. The reimbursement criteria were updated this year — patients with a BMI above 35 and one comorbidity are now eligible. Would it help if I walked you through the documentation requirements?" },
      { role: "hcp", speaker: "Dr. Hansen", text: "Yes, that would be useful. What about the long-term cardiovascular benefit?" },
      { role: "kam", speaker: "KAM", text: "SELECT showed a 20% reduction in MACE over 3 years. I can share the publication and a one-pager you can use in patient conversations." },
      { role: "hcp", speaker: "Dr. Hansen", text: "Send it over. I'll consider it for two patients I have in mind." },
      { role: "kam", speaker: "KAM", text: "Perfect, I'll follow up by email tomorrow." },
    ],
  },
  {
    id: "2",
    name: "GLP-1 Efficacy Discussion",
    product: "Ozempic",
    score: 4,
    date: "Dec 3, 2025",
    duration: "9 min",
    hcpPersona: "Dr. Sørensen — Endocrinologist",
    transcript: [
      { role: "hcp", speaker: "Dr. Sørensen", text: "Good to see you. What's new on the GLP-1 front?" },
      { role: "kam", speaker: "KAM", text: "I wanted to revisit the HbA1c reductions we see with Ozempic versus SGLT2s in your typical patient." },
      { role: "hcp", speaker: "Dr. Sørensen", text: "I already use both, but I worry about GI side effects." },
      { role: "kam", speaker: "KAM", text: "Titration is key — starting at 0.25 mg for four weeks reduces nausea dramatically in clinical practice." },
      { role: "hcp", speaker: "Dr. Sørensen", text: "That matches my experience. What about weight outcomes?" },
      { role: "kam", speaker: "KAM", text: "STEP-2 showed -9.6% body weight at 68 weeks. I can leave you the summary." },
      { role: "hcp", speaker: "Dr. Sørensen", text: "Please do. I'll review with my team." },
    ],
  },
  {
    id: "3",
    name: "Managing Side Effect Concerns",
    product: "Saxenda",
    score: 5,
    date: "Nov 27, 2025",
    duration: "14 min",
    hcpPersona: "Dr. Lindgren — GP",
    transcript: [
      { role: "hcp", speaker: "Dr. Lindgren", text: "My patients complain about nausea on Saxenda. Many drop out." },
      { role: "kam", speaker: "KAM", text: "That's a common challenge. The slow 5-week titration schedule reduces dropout by roughly 40% in real-world data." },
      { role: "hcp", speaker: "Dr. Lindgren", text: "Do you have a patient handout I could give them?" },
      { role: "kam", speaker: "KAM", text: "Yes — we have a titration tracker and a meal-timing guide. I'll bring physical copies next visit and email PDFs today." },
      { role: "hcp", speaker: "Dr. Lindgren", text: "Great. I'll trial it on three patients starting next week." },
      { role: "kam", speaker: "KAM", text: "I'll check back in four weeks to hear how they're doing." },
    ],
  },
  {
    id: "4",
    name: "Injection Adherence Challenge",
    product: "NovoPen 6",
    score: 3,
    date: "Nov 19, 2025",
    duration: "8 min",
    hcpPersona: "Dr. Patel — Diabetes Nurse",
    transcript: [
      { role: "hcp", speaker: "Dr. Patel", text: "Adherence is really the biggest issue in my clinic." },
      { role: "kam", speaker: "KAM", text: "NovoPen 6 logs every dose automatically — patients and clinicians can both see the history." },
      { role: "hcp", speaker: "Dr. Patel", text: "Sounds interesting, but is it covered?" },
      { role: "kam", speaker: "KAM", text: "It is, for patients on insulin therapy. I can share the prescribing pathway." },
      { role: "hcp", speaker: "Dr. Patel", text: "Okay, send me the details." },
    ],
  },
  {
    id: "5",
    name: "Basal Insulin Optimization",
    product: "Tresiba",
    score: 4,
    date: "Nov 12, 2025",
    duration: "11 min",
    hcpPersona: "Dr. Moreau — Endocrinologist",
    transcript: [
      { role: "hcp", speaker: "Dr. Moreau", text: "I'm comfortable with my current basal regimen. Why switch?" },
      { role: "kam", speaker: "KAM", text: "Tresiba's flat 42-hour profile means lower nocturnal hypoglycaemia — DEVOTE showed a 53% reduction versus glargine U100." },
      { role: "hcp", speaker: "Dr. Moreau", text: "That is meaningful. What about flexibility in dosing time?" },
      { role: "kam", speaker: "KAM", text: "Tresiba can be dosed any time of day, with up to 8 hours of flexibility. This is particularly helpful for shift workers." },
      { role: "hcp", speaker: "Dr. Moreau", text: "Good point. Send me the DEVOTE summary." },
      { role: "kam", speaker: "KAM", text: "Will do — and I'll include the dosing flexibility guide as well." },
    ],
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
  const { slug } = useParams();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
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
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10"><BookOpen className="h-5 w-5 text-primary" /></div>
            <div>
              <h3 className="text-xl font-bold text-foreground">General performance</h3>
              <p className="text-sm text-muted-foreground">Last 30 days</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Meetings</p>
                <p className="text-2xl font-bold text-foreground mt-1">{employee.planned + employee.canvas}</p>
                <p className="text-xs text-muted-foreground mt-1">{employee.planned} planned · {employee.canvas} canvas</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Debrief adherence</p>
                <p className="text-2xl font-bold text-foreground mt-1">{employee.adherence}%</p>
                <p className="text-xs text-muted-foreground mt-1">{employee.completed} debriefs completed</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Cancelled</p>
                <p className="text-2xl font-bold text-foreground mt-1">{employee.cancelled}</p>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm">
              <CardContent className="p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Deleted</p>
                <p className="text-2xl font-bold text-foreground mt-1">{employee.deleted}</p>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-gradient-to-br from-card to-card/80 shadow-sm">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><CheckCircle className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed debriefs</p>
                  <p className="font-semibold text-foreground">{employee.completed}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10"><Send className="h-4 w-4 text-amber-500" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Not sent</p>
                  <p className="font-semibold text-foreground">{employee.notSent}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10"><AlertCircle className="h-4 w-4 text-destructive" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p className="font-semibold text-foreground">{employee.outstanding}</p>
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
                  <p className="font-semibold text-foreground">{employee.deleted}</p>
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
                  </tr>
                </thead>
                <tbody>
                  {trainingHistory.map((t, idx) => (
                    <tr key={t.id} className={cn("hover:bg-muted/30 transition-colors", idx !== trainingHistory.length - 1 && "border-b border-border/50")}>
                      <td className="py-4 px-5 font-medium text-foreground">{t.name}</td>
                      <td className="py-4 px-5 text-muted-foreground">{t.product}</td>
                      <td className="py-4 px-5 text-muted-foreground">{t.date}</td>
                      <td className="py-4 px-5">{renderStars(t.score)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
};

export { slugify };
export default EmployeeDetail;