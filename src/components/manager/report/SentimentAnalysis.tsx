import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

interface SentimentDataPoint {
  month: string;
  positive: number;
  neutral: number;
  negative: number;
}

interface SentimentAnalysisProps {
  data: SentimentDataPoint[];
}

export const SentimentAnalysis = ({ data }: SentimentAnalysisProps) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Sentiment Analysis</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-[hsl(var(--success))]" />
              <span className="text-xs text-muted-foreground">positive</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-muted-foreground" />
              <span className="text-xs text-muted-foreground">neutral</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-sm bg-destructive" />
              <span className="text-xs text-muted-foreground">negative</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ left: -20, right: 0, top: 10, bottom: 0 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                formatter={(value: number) => [`${value}%`, '']}
              />
              <Bar 
                dataKey="positive" 
                name="Positive" 
                stackId="sentiment"
                fill="hsl(var(--success))" 
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="neutral" 
                name="Neutral" 
                stackId="sentiment"
                fill="hsl(var(--muted-foreground))" 
                radius={[0, 0, 0, 0]}
              />
              <Bar 
                dataKey="negative" 
                name="Negative" 
                stackId="sentiment"
                fill="hsl(var(--destructive))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
