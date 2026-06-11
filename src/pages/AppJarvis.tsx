import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, TrendingUp, MapPin, Lightbulb, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/app/BottomNav";
import { AppHeader } from "@/components/app/AppHeader";
import jarvisLogo from "@/assets/jarvis-logo.svg";

interface AIResponse {
  query: string;
  response: string;
  timestamp: Date;
  category: string;
}

interface QuerySuggestion {
  id: string;
  text: string;
  hint: string;
  category: "insights" | "trends" | "competitive" | "clinical";
}

const querySuggestions: QuerySuggestion[] = [
  { id: "1", text: "Find Canvas targets near me", hint: "High-potential HCPs nearby", category: "competitive" },
  { id: "2", text: "Show regional sales data", hint: "Trends across your territory", category: "trends" },
  { id: "3", text: "Help me prepare", hint: "Brief me for my next meeting", category: "insights" },
];

const categoryConfig = {
  insights: { icon: Lightbulb, color: "text-primary", bg: "bg-primary/10" },
  trends: { icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  competitive: { icon: MapPin, color: "text-primary", bg: "bg-primary/10" },
  clinical: { icon: Lightbulb, color: "text-primary", bg: "bg-primary/10" },
};

const AppJarvis = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responses, setResponses] = useState<AIResponse[]>([]);

  const handleSendQuery = async (queryText?: string) => {
    const finalQuery = queryText || query;
    if (!finalQuery.trim()) return;
    setIsLoading(true);
    setQuery("");

    setTimeout(() => {
      const mockResponse: AIResponse = {
        query: finalQuery,
        response: getAIResponse(finalQuery),
        timestamp: new Date(),
        category: "insights",
      };
      setResponses((prev) => [mockResponse, ...prev]);
      setIsLoading(false);
    }, 2000);
  };

  const getAIResponse = (query: string): string => {
    if (query.toLowerCase().includes("canvas targets")) {
      return "Found 12 high-potential canvas targets within 25 miles. Top prospects: Dr. Amanda Foster (Endocrinology) - 0.8 miles, high access, no recent contact.";
    }
    if (query.toLowerCase().includes("adoption trends")) {
      return "Oncology adoption at City Medical Center shows 23% increase in Q4. Key drivers: improved formulary access and positive physician feedback.";
    }
    return "Based on current data analysis, I recommend focusing on value-based care discussions and patient outcome improvements.";
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <AppHeader title="Ask Jarvis" subtitle="Ask about anything" />

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-40 pt-2">
        {responses.length === 0 && !isLoading && (
          <div className="pt-4">
            {/* Heading */}
            <div className="mb-5">
              <h3 className="text-xl font-bold text-foreground tracking-tight">How can I help?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ask anything about your accounts, schedule or territory.
              </p>
            </div>

            {/* Suggestions */}
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 px-1">
              Quick suggestions
            </p>
            <div className="space-y-3">
              {querySuggestions.map((suggestion) => {
                const config = categoryConfig[suggestion.category];
                const Icon = config.icon;
                return (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSendQuery(suggestion.text)}
                    className="app-card w-full p-4 flex items-center gap-3.5 text-left active:scale-[0.99] transition-transform"
                  >
                    <div className={`shrink-0 h-10 w-10 rounded-2xl flex items-center justify-center ${config.bg}`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-tight">{suggestion.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{suggestion.hint}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-5">
          {responses.map((response, index) => (
            <div key={index} className="space-y-3 animate-slide-up">
              <div className="flex justify-end">
                <div className="max-w-[80%] px-4 py-2.5 bg-primary text-primary-foreground rounded-2xl rounded-br-md shadow-[var(--shadow-soft)]">
                  <p className="text-sm font-medium">{response.query}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <img src={jarvisLogo} alt="Jarvis" className="w-8 h-8 rounded-xl shadow-[var(--shadow-soft)] flex-shrink-0" />
                <div className="app-card flex-1 p-4">
                  <p className="text-sm text-foreground leading-relaxed">{response.response}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {response.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3 animate-fade-in">
              <img src={jarvisLogo} alt="Jarvis" className="w-8 h-8 rounded-xl shadow-[var(--shadow-soft)] flex-shrink-0" />
              <div className="app-card p-4 flex items-center gap-2.5">
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                <span className="text-sm font-medium text-muted-foreground">Jarvis is thinking…</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Input */}
      <div className="fixed bottom-16 left-0 right-0 px-5 pb-3 pt-3 bg-background/70 backdrop-blur-2xl border-t border-border/50">
        <div className="flex items-center gap-2 max-w-lg mx-auto bg-card rounded-2xl border border-border/60 shadow-[var(--shadow-soft)] p-1.5 pl-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your message here…"
            onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
            className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-10 text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSendQuery()}
            disabled={!query.trim() || isLoading}
            size="icon"
            className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-10 shrink-0 shadow-[var(--shadow-soft)] disabled:shadow-none"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default AppJarvis;
