import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Statement {
  id: string;
  hcpType: string;
  date: string;
  quote: string;
  interactionRef: string;
}

interface StatementOverviewProps {
  statements: Statement[];
  totalCount: number;
}

export const StatementOverview = ({ statements, totalCount }: StatementOverviewProps) => {
  const [showAll, setShowAll] = useState(false);
  const displayedStatements = showAll ? statements : statements.slice(0, 3);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Statement Overview
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {totalCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayedStatements.map((statement) => (
          <div 
            key={statement.id}
            className="group relative p-4 rounded-xl border bg-gradient-to-br from-muted/20 to-muted/5 hover:from-muted/30 hover:to-muted/10 transition-all"
          >
            {/* HCP Type and Date badges */}
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs font-medium capitalize">
                {statement.hcpType}
              </Badge>
              <span className="text-xs text-muted-foreground">{statement.date}</span>
            </div>

            {/* Quote */}
            <div className="relative pl-4 border-l-2 border-primary/30">
              <Quote className="absolute -left-2.5 -top-1 h-5 w-5 text-primary/40 bg-card rounded-full p-0.5" />
              <p className="text-sm text-foreground leading-relaxed italic">
                "{statement.quote}"
              </p>
            </div>

            {/* Interaction reference */}
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                {statement.interactionRef}
              </p>
            </div>
          </div>
        ))}

        {statements.length > 3 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Vis færre
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Vis alle {totalCount} statements
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
