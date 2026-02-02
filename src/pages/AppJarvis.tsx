import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, TrendingUp, Calendar, Building, Lightbulb } from "lucide-react";
import { BottomNav } from "@/components/app/BottomNav";
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
  category: "insights" | "trends" | "competitive" | "clinical";
}

const querySuggestions: QuerySuggestion[] = [
  { id: "1", text: "Find Canvas targets near me", category: "insights" },
  { id: "2", text: "Show regional sales data", category: "trends" },
  { id: "3", text: "Help me prepare", category: "insights" },
];

const categoryConfig = {
  insights: { icon: Lightbulb, color: "text-primary", bg: "bg-primary/10" },
  trends: { icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
  competitive: { icon: Building, color: "text-blue-400", bg: "bg-blue-400/10" },
  clinical: { icon: Calendar, color: "text-blue-600", bg: "bg-blue-600/10" },
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
      {/* Header */}
      <div className="px-5 pt-6 pb-4 bg-gradient-to-b from-primary/[0.03] to-background">
        <div className="flex items-center gap-4">
          <img src={jarvisLogo} alt="Jarvis" className="w-12 h-12 shrink-0" />
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Ask Jarvis</h1>
            <p className="text-sm text-muted-foreground">Ask about anything</p>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {responses.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">Start a conversation</h3>
            <p className="text-sm text-muted-foreground mb-6">Ask me anything</p>

            <div className="space-y-2 max-w-sm mx-auto">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Quick suggestions
              </p>
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
                      <p className="text-sm text-foreground">{suggestion.text}</p>
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
              <span className="text-sm text-muted-foreground">Jarvis analyserer...</span>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {responses.map((response, index) => (
            <div key={index} className="space-y-3 animate-slide-up">
              <div className="flex justify-end">
                <div className="max-w-[80%] p-3 bg-primary text-primary-foreground rounded-2xl rounded-br-sm">
                  <p className="text-sm">{response.query}</p>
                </div>
              </div>

              <Card className="p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <img src={jarvisLogo} alt="Jarvis" className="w-8 h-8 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground leading-relaxed">{response.response}</p>
                    <p className="text-xs text-muted-foreground mt-2">
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
      <div className="fixed bottom-14 left-0 right-0 p-4 border-t border-border bg-background/95 backdrop-blur-sm pb-safe">
        <div className="flex gap-3 max-w-lg mx-auto">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Skriv din besked her..."
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

      <BottomNav />
    </div>
  );
};

export default AppJarvis;
