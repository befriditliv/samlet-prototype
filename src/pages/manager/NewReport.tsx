import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  ArrowLeft,
  Loader2,
  FileText,
  CalendarIcon,
  Lightbulb,
  Zap,
  ChevronUp,
  ChevronDown,
  X,
  SlidersHorizontal,
  UserX,
  Activity,
  Swords,
  Info,
  Stethoscope,
  Users,
  Target
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import jarvisLogo from "@/assets/jarvis-logo.svg";

type WizardStep = 'select-type' | 'configure';
type ReportCategory = 'quick-reports' | 'debrief-report' | 'insights';

const reportCategories = [
  {
    id: 'quick-reports' as ReportCategory,
    label: 'Quick Reports',
    description: 'Pre-defined reports ready to generate instantly',
    icon: Zap,
  },
  {
    id: 'debrief-report' as ReportCategory,
    label: 'Debrief Report',
    description: 'Structured analysis with comparison features to track HCP objections, concerns, and questions over time',
    icon: FileText,
  },
  {
    id: 'insights' as ReportCategory,
    label: 'Insights',
    description: 'AI-powered deep dive into patterns, trends, and sentiments — explore topics and ask Jarvis to uncover answers within your data',
    icon: Lightbulb,
  },
];

const quickReportOptions = [
  {
    id: 'ozempic-initiation',
    label: 'Ozempic Initiering',
    description: 'Analyse af HCP-bekymringer og barrierer ved Ozempic-initiering over tid',
    icon: Stethoscope,
    devNote: 'DEV: Use MIP with objection/concern analysis. Set current date minus 90 days for trend data.',
  },
  {
    id: 'debrief-quality',
    label: 'Debrief Quality Report',
    description: 'Kvalitetsvurdering af medarbejderes debriefs – dybde, struktur og actionable insights',
    icon: Users,
    devNote: 'DEV: Analyze debrief completeness, detail level, and actionability per employee.',
  },
  {
    id: 'campaign-adherence',
    label: 'Campaign Adherence',
    description: 'Sammenhængsgrad mellem kampagnebudskaber og faktiske mødesamtaler',
    icon: Target,
    devNote: 'DEV: Compare campaign prepare content vs actual debrief topics. Calculate adherence %.',
  },
  {
    id: 'high-potential-no-engagement',
    label: 'High Potential Clients without Recent Engagement',
    description: 'Identify high-value HCPs/HCOs lacking recent touchpoints',
    icon: UserX,
    devNote: 'DEV: Use ActivityHub. Identify high-potential clients (HCPs/HCOs) with no recent engagement activity.',
  },
  {
    id: 'sentiment-trends',
    label: 'General HCO/HCP Sentiment and Market Trends',
    description: 'Analyze overall sentiment and emerging market themes',
    icon: Activity,
    devNote: 'DEV: Use MIP. Prompt: Analyze the last 30 days of HCP and HCO interaction data.',
  },
  {
    id: 'competitor-report',
    label: 'Competitor Report',
    description: 'Track competitor mentions, perceptions, and competitive landscape',
    icon: Swords,
    devNote: 'DEV: Use MIP. Prompt: Analyze the last 30 days for competitor mentions.',
  },
];

const NewReport = () => {
  const navigate = useNavigate();
  
  // Wizard state
  const [step, setStep] = useState<WizardStep>('select-type');
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null);
  
  // Filter state
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [compareDateRange, setCompareDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 60),
    to: subDays(new Date(), 31),
  });
  const [product, setProduct] = useState("all");
  const [employee, setEmployee] = useState("all");
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Insights search state
  const [customQuery, setCustomQuery] = useState("");
  
  // Advanced insights filters
  const [activityType, setActivityType] = useState("all");
  const [therapyArea, setTherapyArea] = useState("all");
  const [hcpType, setHcpType] = useState("all");
  const [hcpSpeciality, setHcpSpeciality] = useState("all");
  const [molecule, setMolecule] = useState("all");
  const [brand, setBrand] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleCategorySelect = (category: ReportCategory) => {
    setSelectedCategory(category);
    setStep('configure');
  };

  const handleBack = () => {
    if (step === 'configure') {
      setStep('select-type');
      setSelectedCategory(null);
    } else {
      navigate('/manager');
    }
  };

  const generateReport = async (reportName: string, navigateToReport: boolean = false) => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);
    toast.success(`${reportName} generated successfully`);
    
    if (navigateToReport) {
      navigate('/manager/report', {
        state: {
          reportType: reportName,
          dateRange: dateRange,
          compareDateRange: compareDateRange,
          product: product,
          employee: employee,
          compareEnabled: compareEnabled
        }
      });
    } else {
      navigate('/manager');
    }
  };

  const handleQuickReport = async (reportId: string, reportLabel: string) => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);
    toast.success(`${reportLabel} generated successfully`);
    
    // Route to InsightReportView for specific quick reports
    if (reportId === 'ozempic-initiation') {
      navigate('/manager/insight-report', {
        state: {
          reportType: 'ozempic-initiation',
          title: 'Ozempic Initiering Insights',
          query: 'hvad siger hcperne ift. ozempic initiering',
          dateRange: { from: new Date(2025, 6, 1), to: new Date(2025, 11, 31) },
          product: 'Ozempic',
          employee: 'all'
        }
      });
    } else if (reportId === 'sentiment-trends') {
      navigate('/manager/insight-report', {
        state: {
          reportType: 'sentiment-trends',
          title: 'HCO/HCP Sentiment & Market Trends',
          query: 'hvad er den generelle stemning og markedstrends blandt HCPs og HCOs?',
          dateRange: { from: new Date(2025, 9, 1), to: new Date(2025, 11, 31) },
          product: 'Alle produkter',
          employee: 'all'
        }
      });
    } else {
      navigate('/manager');
    }
  };

  const handleDebriefReportGenerate = () => {
    generateReport('Debrief Report', true);
  };

  const handleInsightsSearch = () => {
    if (!customQuery.trim()) return;
    generateReport('Insights Report', false);
  };

  const getCategoryTitle = () => {
    switch (selectedCategory) {
      case 'quick-reports': return 'Quick Reports';
      case 'debrief-report': return 'Debrief Report';
      case 'insights': return 'Insights';
      default: return 'New Report';
    }
  };

  const getCategoryDescription = () => {
    switch (selectedCategory) {
      case 'quick-reports': return 'Select a pre-defined report to generate instantly';
      case 'debrief-report': return 'Generate a structured report with optional period comparison';
      case 'insights': return 'Search for specific insights and patterns in your data';
      default: return 'Choose the type of report you want to generate';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center gap-6">
            <img src={jarvisLogo} alt="Jarvis Logo" className="h-14 w-14" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Report Generator</h1>
              <p className="text-sm text-muted-foreground">Create insights, track trends, and uncover opportunities</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-3xl">
        {/* Navigation */}
        <button 
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">
            {step === 'select-type' ? 'Back to dashboard' : 'Choose another type'}
          </span>
        </button>

        {/* Title section */}
        <div className="mb-10">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-2">
            {step === 'select-type' ? 'New Report' : getCategoryTitle()}
          </h2>
          <p className="text-muted-foreground">
            {step === 'select-type' ? 'Choose the type of report you want to generate' : getCategoryDescription()}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10">
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all",
            step === 'select-type' 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground"
          )}>
            1
          </div>
          <div className="h-px w-12 bg-border" />
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all",
            step === 'configure' 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground"
          )}>
            2
          </div>
        </div>

        {/* Step 1: Select Type */}
        {step === 'select-type' && (
          <div className="space-y-4">
            {reportCategories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="w-full group"
                >
                  <div className="flex items-center gap-5 p-6 rounded-2xl border bg-card hover:bg-accent/50 transition-all hover:shadow-sm">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-medium text-foreground mb-0.5">{category.label}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Configure - Quick Reports */}
        {step === 'configure' && selectedCategory === 'quick-reports' && (
          <TooltipProvider>
            <div className="space-y-4">
              {quickReportOptions.map((report) => {
                const Icon = report.icon;
                return (
                  <div key={report.id} className="relative">
                    <button
                      onClick={() => handleQuickReport(report.id, report.label)}
                      disabled={isGenerating}
                      className="w-full group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-5 p-6 rounded-2xl border bg-card hover:bg-accent/50 transition-all hover:shadow-sm">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-lg font-medium text-foreground mb-0.5">{report.label}</h3>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                        </div>
                        {isGenerating ? (
                          <Loader2 className="h-5 w-5 text-primary animate-spin" />
                        ) : (
                          <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        )}
                      </div>
                    </button>
                    {/* Developer tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs text-xs">
                        <p>{report.devNote}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          </TooltipProvider>
        )}

        {/* Step 2: Configure - Debrief Report */}
        {step === 'configure' && selectedCategory === 'debrief-report' && (
          <div className="space-y-6">
            {/* Primary period */}
            <div className="p-6 rounded-2xl border bg-card space-y-5">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                Primary Period
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-1">
                  <Label className="text-xs text-muted-foreground">Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                            </>
                          ) : (
                            format(dateRange.from, "MMM d, yyyy")
                          )
                        ) : (
                          <span>Select dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Product</Label>
                  <Select value={product} onValueChange={setProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All products</SelectItem>
                      <SelectItem value="ozempic">Ozempic</SelectItem>
                      <SelectItem value="wegovy">Wegovy</SelectItem>
                      <SelectItem value="victoza">Victoza</SelectItem>
                      <SelectItem value="rybelsus">Rybelsus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Employee</Label>
                  <Select value={employee} onValueChange={setEmployee}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All (8)</SelectItem>
                      <SelectItem value="SQIE">SQIE</SelectItem>
                      <SelectItem value="HRWT">HRWT</SelectItem>
                      <SelectItem value="AGSN">AGSN</SelectItem>
                      <SelectItem value="WNLM">WNLM</SelectItem>
                      <SelectItem value="BKET">BKET</SelectItem>
                      <SelectItem value="JMOR">JMOR</SelectItem>
                      <SelectItem value="KLSE">KLSE</SelectItem>
                      <SelectItem value="PNRD">PNRD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Compare toggle */}
            <div className="p-6 rounded-2xl border bg-card space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium text-foreground">Compare with previous period</div>
                  <p className="text-sm text-muted-foreground">Show changes over time in the report</p>
                </div>
                <Switch
                  checked={compareEnabled}
                  onCheckedChange={setCompareEnabled}
                />
              </div>

              {compareEnabled && (
                <div className="pt-4 border-t">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Comparison Period</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {compareDateRange?.from ? (
                            compareDateRange.to ? (
                              <>
                                {format(compareDateRange.from, "MMM d")} - {format(compareDateRange.to, "MMM d, yyyy")}
                              </>
                            ) : (
                              format(compareDateRange.from, "MMM d, yyyy")
                            )
                          ) : (
                            <span>Select dates</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={compareDateRange?.from}
                          selected={compareDateRange}
                          onSelect={setCompareDateRange}
                          numberOfMonths={2}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>

            {/* Generate button */}
            <Button 
              onClick={handleDebriefReportGenerate}
              disabled={isGenerating}
              size="lg"
              className="w-full h-14 rounded-xl text-base gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
              Generate Debrief Report
            </Button>
          </div>
        )}

        {/* Step 2: Configure - Insights */}
        {step === 'configure' && selectedCategory === 'insights' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="p-6 rounded-2xl border bg-card space-y-5">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                Filters
              </div>
              
              {/* Basic filters row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                            </>
                          ) : (
                            format(dateRange.from, "MMM d, yyyy")
                          )
                        ) : (
                          <span>Select dates</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Product</Label>
                  <Select value={product} onValueChange={setProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All products</SelectItem>
                      <SelectItem value="ozempic">Ozempic</SelectItem>
                      <SelectItem value="wegovy">Wegovy</SelectItem>
                      <SelectItem value="victoza">Victoza</SelectItem>
                      <SelectItem value="rybelsus">Rybelsus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Employee</Label>
                  <Select value={employee} onValueChange={setEmployee}>
                    <SelectTrigger>
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All (6)</SelectItem>
                      <SelectItem value="team-a">Team A</SelectItem>
                      <SelectItem value="team-b">Team B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Advanced filters toggle */}
              <div className="flex items-center justify-end gap-4 pt-2">
                {showAdvancedFilters && (
                  <button
                    onClick={() => {
                      setActivityType("all");
                      setTherapyArea("all");
                      setHcpType("all");
                      setHcpSpeciality("all");
                      setMolecule("all");
                      setBrand("all");
                    }}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear filters
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Options
                  {showAdvancedFilters ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-6 rounded-2xl border bg-card space-y-5">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Search className="h-4 w-4 text-muted-foreground" />
                Search Query
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">What insights are you looking for?</Label>
                <Input
                  placeholder="e.g., What are the main barriers to Ozempic adoption?"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  Use natural language to describe what you want to learn from your data
                </p>
              </div>
            </div>

            {/* Generate button */}
            <Button 
              onClick={handleInsightsSearch}
              disabled={isGenerating || !customQuery.trim()}
              size="lg"
              className="w-full h-14 rounded-xl text-base gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Lightbulb className="h-5 w-5" />
              )}
              Generate Insights
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default NewReport;
