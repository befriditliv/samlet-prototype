import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TopCategory {
  label: string;
  count: number;
  color: string;
}

interface ExecutiveSummaryProps {
  topCategories: TopCategory[];
  summaryText: string;
}

export const ExecutiveSummary = ({ topCategories, summaryText }: ExecutiveSummaryProps) => {
  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-card/80">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold">Executive Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top categories with counts */}
        <div className="flex flex-wrap gap-3">
          {topCategories.map((category, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div 
                className="h-3 w-3 rounded-full shrink-0" 
                style={{ backgroundColor: category.color }} 
              />
              <span className="text-sm font-medium text-foreground">{category.label}</span>
              <Badge variant="secondary" className="ml-1 text-xs font-semibold">
                {category.count}
              </Badge>
            </div>
          ))}
        </div>

        {/* Summary text */}
        <div className="prose prose-sm max-w-none">
          <p className="text-muted-foreground leading-relaxed text-sm">
            {summaryText}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
