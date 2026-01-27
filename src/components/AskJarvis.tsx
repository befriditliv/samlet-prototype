import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { MessageCircle, HelpCircle, Calendar, BookOpen, LayoutDashboard, Send, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const quickSuggestions = [
  {
    icon: HelpCircle,
    text: "How can you help me?",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30"
  },
  {
    icon: Calendar,
    text: "Show Missing Debriefs",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30"
  },
  {
    icon: BookOpen,
    text: "Start Training",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30"
  },
  {
    icon: LayoutDashboard,
    text: "Go to Daily Overview",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30"
  }
];

export const AskJarvis = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSuggestionClick = (text: string) => {
    setMessage(text);
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
            <div className="flex items-start justify-between">
              <div>
                <SheetTitle className="text-2xl font-bold">Ask Jarvis</SheetTitle>
                <SheetDescription className="text-base mt-1">
                  Ask anything about your data
                </SheetDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
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
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors text-left"
                >
                  <div className={`p-2.5 rounded-lg ${suggestion.bg}`}>
                    <suggestion.icon className={`h-5 w-5 ${suggestion.color}`} />
                  </div>
                  <span className="text-foreground font-medium">{suggestion.text}</span>
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
