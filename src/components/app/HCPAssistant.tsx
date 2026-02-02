import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, FileText, AlertCircle, Lightbulb, TrendingUp, RotateCcw, X } from "lucide-react";
import jarvisLogo from "@/assets/jarvis-logo.svg";

interface HCPAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  hcpName: string;
  showBriefing?: boolean;
}

interface QuerySuggestion {
  id: string;
  text: string;
  category: "background" | "insights" | "strategy" | "clinical";
}

interface AIResponse {
  query: string;
  response: string;
  timestamp: Date;
  category: string;
  isBriefing?: boolean;
}

const getQuerySuggestions = (hcpName: string): QuerySuggestion[] => [
  {
    id: "1",
    text: `What are the key talking points for ${hcpName}?`,
    category: "insights"
  },
  {
    id: "2",
    text: `Show me ${hcpName}'s prescription history`,
    category: "background"
  },
  {
    id: "3",
    text: `What's the best engagement strategy for ${hcpName}?`,
    category: "strategy"
  },
  {
    id: "4",
    text: `Any recent clinical interests for ${hcpName}?`,
    category: "clinical"
  }
];

const categoryConfig = {
  background: {
    icon: FileText,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  insights: {
    icon: Lightbulb,
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  strategy: {
    icon: TrendingUp,
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  clinical: {
    icon: AlertCircle,
    color: "text-blue-600",
    bg: "bg-blue-600/10"
  }
};

export const HCPAssistant = ({ isOpen, onClose, hcpName, showBriefing = false }: HCPAssistantProps) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([]);
  const [hasSentBriefing, setHasSentBriefing] = useState(false);

  const querySuggestions = getQuerySuggestions(hcpName);

  const quickChips = [
    "What did we discuss last time?",
    "Who works at the clinic?",
    "Summarize digital engagement",
  ];

  // Auto-send briefing when opened with showBriefing
  useEffect(() => {
    if (showBriefing && isOpen && !hasSentBriefing && responses.length === 0) {
      setHasSentBriefing(true);
      setIsLoading(true);
      setTimeout(() => {
        const briefingResponse: AIResponse = {
          query: "",
          response: "",
          timestamp: new Date(),
          category: "insights",
          isBriefing: true,
        };
        setResponses([briefingResponse]);
        setIsLoading(false);
      }, 1500);
    }
  }, [showBriefing, isOpen, hasSentBriefing, hcpName, responses.length]);

  // Prevent background scroll while the drawer is open (robust on iOS)
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const prev = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
      overscroll: document.body.style.overscrollBehavior,
    };

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.left = prev.left;
      document.body.style.right = prev.right;
      document.body.style.width = prev.width;
      document.body.style.overflow = prev.overflow;
      document.body.style.overscrollBehavior = prev.overscroll;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const BriefingContent = ({ name }: { name: string }) => (
    <div className="text-sm text-card-foreground leading-relaxed space-y-3">
      <p>Metro Medical Center is a cardiology clinic with 12 specialists. {name} leads the heart failure clinic.</p>

      <div>
        <p className="font-medium mb-1">Last meeting (Jan 7)</p>
        <p className="text-muted-foreground">Phone call about Wegovy and patient adherence. Good dialogue, wants follow-up on CARDIAC-ADVANCE.</p>
      </div>

      <div>
        <p className="font-medium mb-1">Key people</p>
        <ul className="text-muted-foreground space-y-0.5">
          <li>• {name} – Lead, heart failure</li>
          <li>• Dr. Hansen – Diabetes, OPT IN</li>
        </ul>
      </div>

      <div>
        <p className="font-medium mb-1">Recent activity</p>
        <ul className="text-muted-foreground space-y-0.5">
          <li>• Opened 3 newsletters (SGLT2)</li>
          <li>• Downloaded 2 whitepapers</li>
          <li>• Attended webinar about Wegovy SELECT (Dec)</li>
        </ul>
      </div>

      <p className="text-muted-foreground italic pt-1">Is there anything else you'd like to know?</p>
    </div>
  );

  const handleSendQuery = async (queryText?: string) => {
    const finalQuery = queryText || query;
    if (!finalQuery.trim()) return;

    setIsLoading(true);
    setQuery("");

    // Simulate AI response
    setTimeout(() => {
      const mockResponse: AIResponse = {
        query: finalQuery,
        response: getAIResponse(finalQuery, hcpName),
        timestamp: new Date(),
        category: "insights"
      };
      setResponses(prev => [mockResponse, ...prev]);
      setIsLoading(false);
    }, 2000);
  };

  const getAIResponse = (query: string, hcpName: string): string => {
    if (query.toLowerCase().includes("talking points") || query.toLowerCase().includes("key")) {
      return `For ${hcpName}, focus on: 1) New cardiovascular outcomes data showing 25% risk reduction, 2) Simplified dosing schedule improving patient adherence by 40%, 3) Recent formulary approval at their institution. They've expressed interest in patient compliance solutions in previous meetings.`;
    }
    if (query.toLowerCase().includes("prescription history") || query.toLowerCase().includes("history")) {
      return `${hcpName} has written 127 prescriptions in the last 12 months, showing a 15% increase quarter-over-quarter. Peak activity in Q2 2024. Strong preference for combination therapy approaches. Average patient age 55-70.`;
    }
    if (query.toLowerCase().includes("engagement strategy") || query.toLowerCase().includes("strategy")) {
      return `Best approach for ${hcpName}: Schedule 30-45 minute meetings focusing on clinical data and patient outcomes. They respond well to case studies and real-world evidence. Follow up within 2 weeks with relevant research papers. Avoid heavy promotional content.`;
    }
    if (query.toLowerCase().includes("clinical interests") || query.toLowerCase().includes("interests")) {
      return `${hcpName} recently attended the ACC conference and showed interest in heart failure prevention strategies. They've downloaded 3 whitepapers on SGLT2 inhibitors and requested information on our CARDIAC-ADVANCE trial. Consider discussing our upcoming Phase 3 results.`;
    }
    return `Based on ${hcpName}'s profile and recent activity, I recommend focusing on value-based outcomes and patient quality of life improvements. Their practice shows strong alignment with evidence-based medicine approaches.`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="fixed right-0 top-0 z-[61] h-[100dvh] w-full max-w-md bg-card shadow-xl border-l border-border animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-label={`Spørg Jarvis om ${hcpName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[100dvh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-5 pt-8 pb-5 bg-gradient-to-b from-primary/[0.03] to-transparent">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-4">
                <img src={jarvisLogo} alt="Jarvis" className="w-12 h-12 shrink-0" />
                <div>
                  <h2 className="text-2xl font-semibold text-card-foreground tracking-tight">Ask Jarvis</h2>
                  <p className="text-sm text-muted-foreground">{hcpName}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-9 w-9 p-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
                aria-label="Luk"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {responses.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setResponses([]);
                  setHasSentBriefing(false);
                }}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Start over
              </Button>
            )}
          </div>

          {/* Chat History */}
          <div
            className="flex-1 min-h-0 overflow-y-auto overscroll-none touch-pan-y px-4 py-4 pb-32"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {responses.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-card-foreground mb-2">Ask about {hcpName}</h3>
                <p className="text-sm text-muted-foreground mb-6">Get personalized insights and recommendations</p>

                {/* Quick Query Suggestions */}
                <div className="space-y-2 max-w-sm mx-auto">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Quick suggestions</p>
                  {querySuggestions.map((suggestion) => {
                    const config = categoryConfig[suggestion.category];
                    const Icon = config.icon;
                    return (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSendQuery(suggestion.text)}
                        className="w-full p-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-all duration-200 group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-md ${config.bg}`}>
                            <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                          </div>
                          <p className="text-sm text-card-foreground">{suggestion.text}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {isLoading && (
              <Card className="p-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  <span className="text-sm text-muted-foreground">Analyzing {hcpName}'s profile...</span>
                </div>
              </Card>
            )}

            <div className="space-y-4">
              {responses.map((response, index) => (
                <div key={index} className="space-y-3 animate-slide-up">
                  {/* User Query - hide for briefings */}
                  {!response.isBriefing && response.query && (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] p-3 bg-primary text-primary-foreground rounded-2xl rounded-br-sm">
                        <p className="text-sm">{response.query}</p>
                      </div>
                    </div>
                  )}

                  {/* AI Response */}
                  <Card className="p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <img src={jarvisLogo} alt="Jarvis" className="w-8 h-8 flex-shrink-0" />
                      <div className="flex-1">
                        {response.isBriefing ? (
                          <BriefingContent name={hcpName} />
                        ) : (
                          <p className="text-sm text-card-foreground leading-relaxed">{response.response}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-3">
                          {response.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 pb-safe border-t border-border bg-background/70 backdrop-blur">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {quickChips.map((text) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => handleSendQuery(text)}
                  disabled={isLoading}
                  className="shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full bg-muted/60 text-foreground hover:bg-muted active:scale-95 transition-all disabled:opacity-50"
                >
                  {text}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Ask about ${hcpName}...`}
                onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
                className="flex-1 rounded-xl border-border/50 focus:border-primary bg-background"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendQuery()}
                disabled={!query.trim() || isLoading}
                size="sm"
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-4 shadow-md"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
