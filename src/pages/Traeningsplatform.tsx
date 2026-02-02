import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HcpSearch } from "@/components/HcpSearch";
import { AskJarvis } from "@/components/AskJarvis";
import { NavigationMenu } from "@/components/NavigationMenu";
import { OverviewSection } from "@/components/training/OverviewSection";
import { ScenariosSection } from "@/components/training/ScenariosSection";
import jarvisLogo from "@/assets/jarvis-logo.svg";
import { ArrowLeft, ArrowRight, Sparkles, User, Send, Star, CheckCircle2, AlertCircle, ChevronDown, Check, Target, MessageSquare, Zap, BookOpen, TrendingUp, Users, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

// Types
type ViewState = "landing" | "custom-wizard" | "hcp-wizard" | "scenario-preview" | "simulation" | "results";
interface ScenarioConfig {
  name: string;
  product: string;
  adoptionStage: string;
  objections: string[];
  hcpId?: string;
  hcpName?: string;
}
interface ChatMessage {
  role: "hcp" | "user";
  content: string;
}
interface SimulationResult {
  rating: number;
  positives: string[];
  improvements: string[];
  recommendations: string;
  scores: {
    label: string;
    score: number;
  }[];
}
interface HcpOption {
  id: string;
  name: string;
  title: string;
}

// Mock data
const products = ["Ozempic", "Saxenda", "Tresiba", "NovoPen 6", "Wegovy", "Fiasp", "SELECT", "Rybelsus"];
const adoptionStages = [{
  id: "unaware",
  label: "Unaware",
  description: "Not familiar with the product"
}, {
  id: "aware",
  label: "Aware",
  description: "Knows about the product"
}, {
  id: "interested",
  label: "Interested",
  description: "Shows interest"
}, {
  id: "trial",
  label: "Trial",
  description: "Trying the product"
}, {
  id: "evaluating",
  label: "Evaluating",
  description: "Evaluating the product"
}, {
  id: "user",
  label: "User",
  description: "Actively using the product"
}, {
  id: "advocate",
  label: "Advocate",
  description: "Recommends the product"
}];
const commonObjections = [{
  id: "1",
  label: "Regional pressure/fear of sanctions",
  icon: Building2
}, {
  id: "2",
  label: "Price concern",
  icon: TrendingUp
}, {
  id: "3",
  label: "Lack of evidence",
  icon: BookOpen
}, {
  id: "4",
  label: "Side effects",
  icon: AlertCircle
}, {
  id: "5",
  label: "Current treatment is working",
  icon: CheckCircle2
}, {
  id: "6",
  label: "Patient preference",
  icon: Users
}];
const Traeningsplatform = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [viewState, setViewState] = useState<ViewState>("landing");
  const [wizardStep, setWizardStep] = useState(1);
  const [scenarioConfig, setScenarioConfig] = useState<ScenarioConfig>({
    name: "",
    product: "",
    adoptionStage: "",
    objections: []
  });

  // HCP data from database
  const [hcpOptions, setHcpOptions] = useState<HcpOption[]>([]);

  // Simulation state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Combobox states
  const [productOpen, setProductOpen] = useState(false);
  const [hcpOpen, setHcpOpen] = useState(false);

  // Fetch HCPs from database
  useEffect(() => {
    const fetchHcps = async () => {
      const {
        data
      } = await supabase.from("hcps").select("id, name, title").limit(50);
      if (data) {
        setHcpOptions(data.map(h => ({
          id: h.id,
          name: h.name,
          title: h.title
        })));
      }
    };
    fetchHcps();
  }, []);
  const handleStartCustomScenario = () => {
    setViewState("custom-wizard");
    setWizardStep(1);
    setScenarioConfig({
      name: "",
      product: "",
      adoptionStage: "",
      objections: []
    });
  };
  const handleStartHcpScenario = () => {
    setViewState("hcp-wizard");
    setWizardStep(1);
    setScenarioConfig({
      name: "",
      product: "",
      adoptionStage: "",
      objections: []
    });
  };
  const handleShowScenarioPreview = () => {
    setViewState("scenario-preview");
  };

  const handleStartSimulation = () => {
    setViewState("simulation");
    setChatMessages([{
      role: "hcp",
      content: `Hello, I'm ${scenarioConfig.hcpName || "Dr. Hansen"}. How can I help you today?`
    }]);
  };
  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    setChatMessages(prev => [...prev, {
      role: "user",
      content: currentMessage
    }]);
    setCurrentMessage("");
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: "hcp",
        content: "That's interesting. Can you tell me more about the side effect profile and how it compares to other treatments on the market?"
      }]);
    }, 1000);
  };
  const handleEndSimulation = () => {
    setSimulationResult({
      rating: 1,
      positives: ["You acknowledged the client's concern about Ozempic being a better product.", "You advised the client to follow the guidelines, which is a safe approach.", "You maintained a straightforward communication style."],
      improvements: ["You did not address the client's concern about economic and political pressure.", "You did not provide any strategies or arguments to support the use of Ozempic despite the guidelines.", "You did not engage with the client's request for suggestions on handling objections."],
      recommendations: "To improve future conversations, focus on understanding the client's specific concerns and provide tailored solutions or arguments that address those concerns.",
      scores: [{
        label: "Company knowledge",
        score: 3
      }, {
        label: "Product knowledge",
        score: 3
      }, {
        label: "Objection handling",
        score: 2
      }, {
        label: "Communication",
        score: 1
      }]
    });
    setViewState("results");
  };
  const handleBackToLanding = () => {
    setViewState("landing");
    setScenarioConfig({
      name: "",
      product: "",
      adoptionStage: "",
      objections: []
    });
    setChatMessages([]);
    setSimulationResult(null);
    setWizardStep(1);
  };
  const toggleObjection = (objectionId: string) => {
    setScenarioConfig(prev => ({
      ...prev,
      objections: prev.objections.includes(objectionId) ? prev.objections.filter(o => o !== objectionId) : [...prev.objections, objectionId]
    }));
  };
  const renderStars = (rating: number, size: "sm" | "lg" = "lg") => {
    const sizeClass = size === "lg" ? "h-8 w-8" : "h-4 w-4";
    return <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => <Star key={star} className={cn(sizeClass, star <= rating ? "fill-warning text-warning" : "text-muted")} />)}
      </div>;
  };
  const getWizardProgress = () => {
    if (viewState === "custom-wizard") {
      return wizardStep / 3 * 100;
    }
    return wizardStep / 2 * 100;
  };
  const canProceedCustomWizard = () => {
    if (wizardStep === 1) return !!scenarioConfig.product;
    if (wizardStep === 2) return !!scenarioConfig.adoptionStage;
    if (wizardStep === 3) return scenarioConfig.objections.length > 0;
    return false;
  };
  const canProceedHcpWizard = () => {
    if (wizardStep === 1) return !!scenarioConfig.hcpId;
    if (wizardStep === 2) return !!scenarioConfig.product;
    return false;
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={() => viewState === "landing" ? navigate(role === 'manager' ? '/manager' : '/') : handleBackToLanding()} className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img src={jarvisLogo} alt="Jarvis Logo" className="h-10 w-10" />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-foreground">
                Jarvis Training Platform
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-full max-w-md">
                <HcpSearch />
              </div>
              <AskJarvis />
              <NavigationMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* ==================== LANDING VIEW ==================== */}
        {viewState === "landing" && <div className="max-w-4xl mx-auto space-y-8">
            {/* Hero Section - More Compact */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                AI-powered training
              </div>
              <h2 className="text-3xl font-bold leading-tight">
                <span className="text-foreground">Jarvis</span>
                {" "}
                <span className="text-primary">Training Platform</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Practice HCP conversations, handle objections and strengthen your product knowledge – 
                all in a safe environment with instant feedback.
              </p>
            </div>

            {/* Stats Cards - 6 metrics in 2 rows */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">5</div>
                  <div className="text-xs text-muted-foreground">Completed simulations</div>
                </CardContent>
              </Card>
              <Card className="border shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">4.2</div>
                  <div className="text-xs text-muted-foreground">Average score</div>
                </CardContent>
              </Card>
              <Card className="border shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">87.6</div>
                  <div className="text-xs text-muted-foreground">Company knowledge</div>
                </CardContent>
              </Card>
              <Card className="border shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">89</div>
                  <div className="text-xs text-muted-foreground">Product knowledge</div>
                </CardContent>
              </Card>
              <Card className="border shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">85</div>
                  <div className="text-xs text-muted-foreground">Objection handling</div>
                </CardContent>
              </Card>
              <Card className="border shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">87</div>
                  <div className="text-xs text-muted-foreground">Communication skills</div>
                </CardContent>
              </Card>
            </div>

            {/* Training Type Cards - MOVED UP */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Choose your training type</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Custom Scenario Card */}
                <Card className="group border hover:border-primary/30 cursor-pointer transition-all hover:shadow-md" onClick={handleStartCustomScenario}>
                  <CardContent className="p-5 space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-semibold text-foreground">Custom Scenario</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Create a tailored scenario by selecting persona, objective, adoption ladder step, and hand-picking relevant objections.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary text-sm font-medium">
                      <span>Start custom training</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>

                {/* HCP Scenario Card */}
                <Card className="group border hover:border-primary/30 cursor-pointer transition-all hover:shadow-md" onClick={handleStartHcpScenario}>
                  <CardContent className="p-5 space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-semibold text-foreground">HCP-Specific Training</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Train with a simulation built around a specific HCP, using a persona based on past interactions and objections drawn from actual feedback.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary text-sm font-medium">
                      <span>Select an HCP</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Overview Section with History Table */}
            <OverviewSection />

            {/* Scenarios Section with Table */}
            <ScenariosSection onStartScenario={() => {
              // For now, start custom wizard
              handleStartCustomScenario();
            }} />

            {/* Tips Section - Compact */}
            <Card className="border bg-gradient-to-r from-primary/5 to-accent/20">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">Tip: Prepare before your next meeting</h4>
                    <p className="text-sm text-muted-foreground">
                      Have a meeting with an HCP tomorrow? Use HCP-specific training to prepare for potential objections and get constructive feedback before the real meeting.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>}

        {/* ==================== CUSTOM WIZARD ==================== */}
        {viewState === "custom-wizard" && <div className="max-w-2xl mx-auto space-y-8">
            {/* Progress Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Step {wizardStep} of 3</span>
                <span className="text-muted-foreground">{Math.round(getWizardProgress())}% complete</span>
              </div>
              <Progress value={getWizardProgress()} className="h-2" />
            </div>

            {/* Step Content */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                {/* Step 1: Product */}
                {wizardStep === 1 && <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">Select product</h3>
                      <p className="text-muted-foreground">
                        Which product do you want to focus on in this training session?
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Scenario name (optional)</Label>
                      <Input id="name" value={scenarioConfig.name} onChange={e => setScenarioConfig(prev => ({
                  ...prev,
                  name: e.target.value
                }))} placeholder="E.g. Wegovy - SELECT preparation" />
                    </div>

                    <div className="space-y-3">
                      <Label>Product *</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {products.map(product => <div key={product} className={cn("p-4 rounded-xl border-2 cursor-pointer transition-all", scenarioConfig.product === product ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 hover:bg-accent/30")} onClick={() => setScenarioConfig(prev => ({
                    ...prev,
                    product
                  }))}>
                            <div className="flex items-center gap-3">
                              <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors", scenarioConfig.product === product ? "border-primary bg-primary" : "border-muted")}>
                                {scenarioConfig.product === product && <Check className="h-3 w-3 text-primary-foreground" />}
                              </div>
                              <span className="font-medium">{product}</span>
                            </div>
                          </div>)}
                      </div>
                    </div>
                  </div>}

                {/* Step 2: Adoption Stage */}
                {wizardStep === 2 && <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">Select adoption stage</h3>
                      <p className="text-muted-foreground">
                        Where is the HCP in terms of adopting {scenarioConfig.product}?
                      </p>
                    </div>

                    <div className="space-y-3">
                      {adoptionStages.map(stage => <div key={stage.id} className={cn("p-4 rounded-xl border-2 cursor-pointer transition-all", scenarioConfig.adoptionStage === stage.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 hover:bg-accent/30")} onClick={() => setScenarioConfig(prev => ({
                  ...prev,
                  adoptionStage: stage.id
                }))}>
                          <div className="flex items-center gap-4">
                            <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0", scenarioConfig.adoptionStage === stage.id ? "border-primary bg-primary" : "border-muted")}>
                              {scenarioConfig.adoptionStage === stage.id && <Check className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <div>
                              <div className="font-medium">{stage.label}</div>
                              <div className="text-sm text-muted-foreground">{stage.description}</div>
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </div>}

                {/* Step 3: Objections */}
                {wizardStep === 3 && <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">Select objections</h3>
                      <p className="text-muted-foreground">
                        Which objections do you want to practice handling? Select at least one.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {commonObjections.map(objection => {
                  const Icon = objection.icon;
                  return <div key={objection.id} className={cn("p-4 rounded-xl border-2 cursor-pointer transition-all", scenarioConfig.objections.includes(objection.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 hover:bg-accent/30")} onClick={() => toggleObjection(objection.id)}>
                            <div className="flex items-center gap-4">
                              <div className={cn("h-5 w-5 rounded border-2 flex items-center justify-center transition-colors shrink-0", scenarioConfig.objections.includes(objection.id) ? "border-primary bg-primary" : "border-muted")}>
                                {scenarioConfig.objections.includes(objection.id) && <Check className="h-3 w-3 text-primary-foreground" />}
                              </div>
                              <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                              <span className="font-medium">{objection.label}</span>
                            </div>
                          </div>;
                })}
                    </div>
                  </div>}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => wizardStep > 1 ? setWizardStep(prev => prev - 1) : handleBackToLanding()} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {wizardStep > 1 ? "Back" : "Cancel"}
              </Button>

              {wizardStep < 3 ? <Button onClick={() => setWizardStep(prev => prev + 1)} disabled={!canProceedCustomWizard()} className="gap-2">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button> : <Button onClick={handleShowScenarioPreview} disabled={!canProceedCustomWizard()} className="gap-2">
                  View scenario
                  <ArrowRight className="h-4 w-4" />
                </Button>}
            </div>
          </div>}

        {/* ==================== HCP WIZARD ==================== */}
        {viewState === "hcp-wizard" && <div className="max-w-2xl mx-auto space-y-8">
            {/* Progress Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Step {wizardStep} of 2</span>
                <span className="text-muted-foreground">{Math.round(wizardStep / 2 * 100)}% complete</span>
              </div>
              <Progress value={wizardStep / 2 * 100} className="h-2" />
            </div>

            {/* Step Content */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                {/* Step 1: Select HCP */}
                {wizardStep === 1 && <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">Select an HCP</h3>
                      <p className="text-muted-foreground">
                        Which HCP are you preparing to meet?
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label>Search for HCPs</Label>
                      <Popover open={hcpOpen} onOpenChange={setHcpOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" role="combobox" aria-expanded={hcpOpen} className="w-full justify-between font-normal h-12">
                            {scenarioConfig.hcpName || "Search and select an HCP..."}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search for HCPs..." />
                            <CommandList>
                              <CommandEmpty>No HCPs found.</CommandEmpty>
                              <CommandGroup>
                                {hcpOptions.map(hcp => <CommandItem key={hcp.id} value={hcp.name} onSelect={() => {
                            setScenarioConfig(prev => ({
                              ...prev,
                              hcpId: hcp.id,
                              hcpName: hcp.name
                            }));
                            setHcpOpen(false);
                          }}>
                                    <Check className={cn("mr-2 h-4 w-4", scenarioConfig.hcpId === hcp.id ? "opacity-100" : "opacity-0")} />
                                    <div>
                                      <div className="font-medium">{hcp.name}</div>
                                      <div className="text-xs text-muted-foreground">{hcp.title}</div>
                                    </div>
                                  </CommandItem>)}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {scenarioConfig.hcpId && <Card className="bg-accent/30 border-0">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <div className="font-semibold">{scenarioConfig.hcpName}</div>
                              <div className="text-sm text-muted-foreground">
                                {hcpOptions.find(h => h.id === scenarioConfig.hcpId)?.title}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>}
                  </div>}

                {/* Step 2: Select Product */}
                {wizardStep === 2 && <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">Select product</h3>
                      <p className="text-muted-foreground">
                        Which product do you want to discuss with {scenarioConfig.hcpName}?
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {products.map(product => <div key={product} className={cn("p-4 rounded-xl border-2 cursor-pointer transition-all", scenarioConfig.product === product ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 hover:bg-accent/30")} onClick={() => setScenarioConfig(prev => ({
                  ...prev,
                  product
                }))}>
                          <div className="flex items-center gap-3">
                            <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors", scenarioConfig.product === product ? "border-primary bg-primary" : "border-muted")}>
                              {scenarioConfig.product === product && <Check className="h-3 w-3 text-primary-foreground" />}
                            </div>
                            <span className="font-medium">{product}</span>
                          </div>
                        </div>)}
                    </div>
                  </div>}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => wizardStep > 1 ? setWizardStep(prev => prev - 1) : handleBackToLanding()} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {wizardStep > 1 ? "Back" : "Cancel"}
              </Button>

              {wizardStep < 2 ? <Button onClick={() => setWizardStep(prev => prev + 1)} disabled={!canProceedHcpWizard()} className="gap-2">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button> : <Button onClick={handleShowScenarioPreview} disabled={!canProceedHcpWizard()} className="gap-2">
                  View scenario
                  <ArrowRight className="h-4 w-4" />
                </Button>}
            </div>
          </div>}

        {/* ==================== SCENARIO PREVIEW ==================== */}
        {viewState === "scenario-preview" && <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <h2 className="text-2xl font-bold text-primary">
                {scenarioConfig.name || `${scenarioConfig.product} - Training Scenario`}
              </h2>
              <p className="text-sm text-muted-foreground">
                Created {scenarioConfig.hcpName ? `based on ${scenarioConfig.hcpName}` : "by you"}
              </p>
            </div>

            {/* Scenario Details Card */}
            <Card className="border shadow-lg overflow-hidden">
              <CardContent className="p-0">
                {/* Product Section */}
                <div className="p-6 border-b">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Product</h4>
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                      <span className="font-medium text-foreground">{scenarioConfig.product}</span>
                    </div>
                  </div>
                </div>

                {/* Adoption Stage Section */}
                <div className="p-6 border-b bg-accent/20">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Adoption Stage</h4>
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground">
                          {adoptionStages.find(s => s.id === scenarioConfig.adoptionStage)?.label || "Not selected"}
                        </span>
                        <p className="text-sm text-muted-foreground">
                          {adoptionStages.find(s => s.id === scenarioConfig.adoptionStage)?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Objections Section */}
                {scenarioConfig.objections.length > 0 && <div className="p-6 border-b">
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Objections</h4>
                    <div className="space-y-3">
                      {scenarioConfig.objections.map(objId => {
                        const objection = commonObjections.find(o => o.id === objId);
                        if (!objection) return null;
                        const Icon = objection.icon;
                        return (
                          <div key={objId} className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-3.5 w-3.5 text-primary-foreground" />
                            </div>
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{objection.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>}

                {/* Objective Section */}
                <div className="p-6 border-b bg-accent/20">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Objective</h4>
                    <div className="p-4 rounded-lg bg-card border">
                      <p className="text-foreground">
                        {scenarioConfig.objections.length > 0 
                          ? `Handle objections and convince the HCP of the benefits of ${scenarioConfig.product}`
                          : `Discuss ${scenarioConfig.product} with the HCP and address any concerns`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Persona Section */}
                <div className="p-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">Persona</h4>
                    <div className="p-4 rounded-lg bg-card border">
                      <p className="text-foreground">
                        {scenarioConfig.hcpName 
                          ? `${scenarioConfig.hcpName} - based on previous interactions and feedback`
                          : `A ${adoptionStages.find(s => s.id === scenarioConfig.adoptionStage)?.label || "typical"} HCP who prioritizes evidence-based treatment`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Button variant="ghost" onClick={() => setViewState(scenarioConfig.hcpId ? "hcp-wizard" : "custom-wizard")} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleStartSimulation} size="lg" className="gap-2 px-8">
                Start simulation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>}

        {/* ==================== SIMULATION CHAT ==================== */}
        {viewState === "simulation" && <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-200px)]">
            {/* Scenario Info Bar */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{scenarioConfig.hcpName || "Dr. Hansen"}</div>
                  <div className="text-sm text-muted-foreground">
                    {scenarioConfig.product && `Discussing ${scenarioConfig.product}`}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleEndSimulation}>
                End simulation
              </Button>
            </div>

            {/* Chat Messages */}
            <Card className="flex-1 overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0 h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {chatMessages.map((message, index) => <div key={index} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[80%] rounded-2xl px-5 py-3", message.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent/50")}>
                        {message.content}
                      </div>
                    </div>)}
                </div>

                {/* Chat Input */}
                <div className="border-t p-4">
                  <div className="flex gap-3">
                    <Input value={currentMessage} onChange={e => setCurrentMessage(e.target.value)} placeholder="Type your message..." onKeyDown={e => e.key === "Enter" && handleSendMessage()} className="flex-1 h-12" />
                    <Button size="icon" onClick={handleSendMessage} className="h-12 w-12 rounded-full">
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>}

        {/* ==================== RESULTS VIEW ==================== */}
        {viewState === "results" && simulationResult && <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <Badge variant="destructive" className="text-xs px-3 py-1">Needs improvement</Badge>
              <h2 className="text-3xl font-bold text-foreground">Simulation Result</h2>
              <div className="flex justify-center">
                {renderStars(simulationResult.rating)}
              </div>
            </div>

            {/* Feedback Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* What went well */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">What went well</h3>
                  </div>
                  <div className="space-y-3">
                    {simulationResult.positives.map((positive, index) => <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-1" />
                        <p className="text-sm text-muted-foreground">{positive}</p>
                      </div>)}
                  </div>
                </CardContent>
              </Card>

              {/* What could be improved */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">What could be improved</h3>
                  </div>
                  <div className="space-y-3">
                    {simulationResult.improvements.map((improvement, index) => <div key={index} className="flex items-start gap-3">
                        <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-1" />
                        <p className="text-sm text-muted-foreground">{improvement}</p>
                      </div>)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-accent/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">Recommendations</h3>
                    <p className="text-muted-foreground">{simulationResult.recommendations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score breakdown */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Score breakdown</h3>
                <div className="grid grid-cols-2 gap-4">
                  {simulationResult.scores.map((score, index) => <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                      <span className="text-sm font-medium">{score.label}</span>
                      {renderStars(score.score, "sm")}
                    </div>)}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" onClick={handleBackToLanding} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to overview
              </Button>
              <Button onClick={handleStartCustomScenario} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Try again
              </Button>
            </div>
          </div>}
      </main>
    </div>;
};
export default Traeningsplatform;