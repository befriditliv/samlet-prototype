import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Users } from "lucide-react";

interface UsedSource {
  label: string;
  participants: string[];
  date: string;
  count: number;
}

interface RobustnessIndicatorsProps {
  sources: UsedSource[];
  totalSources: number;
}

export const RobustnessIndicators = ({ sources, totalSources }: RobustnessIndicatorsProps) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Robustness Indicators</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {totalSources} kilder
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Used Sources
          </h4>
          <div className="space-y-2">
            {sources.map((source, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="p-1.5 rounded-md bg-primary/10 text-primary shrink-0 mt-0.5">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">{source.label}:</span>
                    <span className="text-sm font-medium text-foreground truncate">
                      {source.participants.join(', ')}
                    </span>
                    <span className="text-xs text-muted-foreground">- {source.date}</span>
                  </div>
                </div>
                {source.count > 1 && (
                  <Badge variant="outline" className="text-xs shrink-0">
                    ({source.count})
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
