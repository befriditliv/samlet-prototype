import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertCircle, TrendingDown, TrendingUp, ChevronDown } from "lucide-react";
import { useState } from "react";

interface AlertItemProps {
  client: string;
  type: "engagement" | "lack-engagement" | "new-activity";
  message: string;
  priority: "high" | "medium" | "low";
  timestamp: string;
  recommendedAction?: string;
  onIgnore?: () => void;
  onResolve?: () => void;
}

export const AlertItem = ({ client, type, message, priority, timestamp, recommendedAction, onIgnore, onResolve }: AlertItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getPriorityColor = () => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "low":
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "lack-engagement":
        return <TrendingDown className="h-5 w-5 text-destructive" />;
      case "new-activity":
        return <TrendingUp className="h-5 w-5 text-success" />;
      default:
        return <AlertCircle className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="group rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20 overflow-hidden">
        <CollapsibleTrigger className="w-full p-5 transition-colors hover:bg-accent/30">
          <div className="flex items-start gap-4">
            <div className="mt-0.5 transition-transform duration-300 group-hover:scale-110">{getIcon()}</div>
            <div className="flex-1 space-y-2.5 text-left">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-card-foreground mb-1.5 transition-colors">{client}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Badge variant="outline" className={`${getPriorityColor()} transition-all duration-300`}>
                    {priority.toUpperCase()}
                  </Badge>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground/80">{timestamp}</p>
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <div className="px-5 pb-5 pt-3 border-t bg-gradient-to-b from-muted/40 to-muted/20">
            <div className="mb-4 space-y-2 animate-fade-in">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-primary"></div>
                Recommended Action
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed pl-3">
                {recommendedAction || "Schedule a follow-up meeting to discuss recent developments and address any concerns."}
              </p>
            </div>
            <div className="flex gap-2.5 pl-3 animate-fade-in">
              <Button 
                variant="outline" 
                size="sm"
                className="transition-all duration-200 hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  onIgnore?.();
                }}
              >
                Ignore
              </Button>
              <Button 
                variant="default" 
                size="sm"
                className="transition-all duration-200 hover:scale-105 shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onResolve?.();
                }}
              >
                Resolved
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
