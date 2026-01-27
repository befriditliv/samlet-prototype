import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, MessageSquare, Target, BarChart2, Users } from "lucide-react";

const tools = [
  {
    icon: FileText,
    title: "Meeting Summaries",
    description: "AI-generated summaries from field notes",
  },
  {
    icon: TrendingUp,
    title: "Performance Trends",
    description: "Track KAM performance over time",
  },
  {
    icon: MessageSquare,
    title: "Coaching Notes",
    description: "Document coaching conversations",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Monitor team objectives",
  },
  {
    icon: BarChart2,
    title: "Activity Reports",
    description: "Detailed activity analytics",
  },
  {
    icon: Users,
    title: "Team Comparison",
    description: "Compare team performance",
  },
];

export const InsightTools = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool, index) => (
        <Card 
          key={index} 
          className="hover:shadow-lg transition-all cursor-pointer hover:border-primary/50 group"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent group-hover:bg-primary/10 transition-colors">
                <tool.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{tool.title}</CardTitle>
                <CardDescription className="text-xs mt-1">
                  {tool.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};
