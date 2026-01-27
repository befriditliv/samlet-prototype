import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { MessageCircle, Send, HelpCircle, User, BarChart3, FileText, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const quickSuggestions = [
  {
    icon: HelpCircle,
    text: "What can you help me with?",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    isLink: false,
    linkTo: null
  },
  {
    icon: User,
    text: "Give me insights about an HCP",
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    isLink: false,
    linkTo: null
  },
  {
    icon: BarChart3,
    text: "Show my team's activity overview",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    isLink: true,
    linkTo: "/manager#employee-overview"
  },
  {
    icon: FileText,
    text: "Create a new report",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    isLink: true,
    linkTo: "/manager/new-report"
  }
];

export const AskJarvisManager = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSuggestionClick = (suggestion: typeof quickSuggestions[0]) => {
    if (suggestion.isLink && suggestion.linkTo) {
      setIsOpen(false);
      navigate(suggestion.linkTo);
    } else {
      setMessage(suggestion.text);
    }
  };

  const handleSend = () => {
    if (message.trim()) {
      // TODO: Implement AI chat functionality
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="gap-2 bg-primary hover:bg-primary/90"
      >
        <MessageCircle className="h-4 w-4" />
        Ask Jarvis
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0 flex flex-col">
          <SheetHeader className="p-6 pb-4 border-b">
            <SheetTitle className="text-2xl font-bold">Ask Jarvis</SheetTitle>
            <SheetDescription className="text-base mt-1">
              Ask anything about your data
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="text-center space-y-3 mb-8">
              <h3 className="text-xl font-semibold text-foreground">Start a conversation</h3>
              <p className="text-muted-foreground">
                Ask me anything about your data and insights
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Quick Suggestions
              </h4>
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors text-left group"
                >
                  <div className={`p-2.5 rounded-lg ${suggestion.bg}`}>
                    <suggestion.icon className={`h-5 w-5 ${suggestion.color}`} />
                  </div>
                  <span className="text-foreground font-medium flex-1">{suggestion.text}</span>
                  {suggestion.isLink && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 pt-4 border-t bg-card">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button 
                onClick={handleSend}
                disabled={!message.trim()}
                size="icon"
                className="shrink-0 bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
