import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";

interface HistoryItem {
  id: string;
  name: string;
  score: number;
}

const mockHistory: HistoryItem[] = [
  { id: "1", name: "Overcoming Cost Concerns", score: 4 },
  { id: "2", name: "GLP-1 Efficacy Discussion", score: 4 },
  { id: "3", name: "Managing Side Effect Concerns", score: 5 },
  { id: "4", name: "Injection Adherence Challenge", score: 3 },
  { id: "5", name: "Basal Insulin Optimization", score: 4 },
];

// Metrics for Results tab
const resultsMetrics = {
  completedSimulations: 5,
  averageScore: 4,
  companyKnowledge: 88,
  productKnowledge: 89,
  objectionHandling: 85,
  communicationSkills: 87,
};

const CircularProgress = ({ value, label, size = "lg" }: { value: number; label: string; size?: "sm" | "lg" }) => {
  const isPercentage = value > 10;
  const radius = size === "lg" ? 45 : 35;
  const strokeWidth = size === "lg" ? 6 : 5;
  const circumference = 2 * Math.PI * radius;
  const progress = isPercentage ? (value / 100) * circumference : (value / 5) * circumference;
  const dashOffset = circumference - progress;
  const svgSize = size === "lg" ? 120 : 90;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs text-muted-foreground text-center">{label}</span>
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="transform -rotate-90">
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/20"
          />
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className={isPercentage ? "text-foreground" : "text-warning"}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${size === "lg" ? "text-2xl" : "text-xl"} ${isPercentage ? "text-foreground" : "text-warning"}`}>
            {value}
          </span>
        </div>
      </div>
    </div>
  );
};

const renderStars = (rating: number) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-warning text-warning" : "text-muted"
          }`}
        />
      ))}
    </div>
  );
};

export const OverviewSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalResults = mockHistory.length;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">Overview</h3>
      
      <Card className="border shadow-sm">
        <Tabs defaultValue="history" className="w-full">
          <div className="border-b px-4">
            <TabsList className="h-10 bg-transparent p-0 gap-4">
              <TabsTrigger 
                value="results" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-2.5"
              >
                Results
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-2.5"
              >
                History
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="p-0">
            <TabsContent value="results" className="m-0 p-6">
              <div className="space-y-6">
                {/* Top row - main metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2 py-4">
                    <span className="text-xs text-muted-foreground">Completed simulations</span>
                    <span className="text-3xl font-bold text-foreground">{resultsMetrics.completedSimulations}</span>
                  </div>
                  <CircularProgress value={resultsMetrics.averageScore} label="Average score" />
                  <CircularProgress value={resultsMetrics.companyKnowledge} label="Company knowledge" />
                </div>
                {/* Bottom row - skill metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <CircularProgress value={resultsMetrics.productKnowledge} label="Product knowledge" />
                  <CircularProgress value={resultsMetrics.objectionHandling} label="Objection handling" />
                  <CircularProgress value={resultsMetrics.communicationSkills} label="Communication skills" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="m-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left text-sm font-medium text-muted-foreground p-4">Name</th>
                    <th className="text-left text-sm font-medium text-muted-foreground p-4">Score</th>
                    <th className="w-10 p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {mockHistory.map((item) => (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-accent/30">
                      <td className="p-4 font-medium">{item.name}</td>
                      <td className="p-4">{renderStars(item.score)}</td>
                      <td className="p-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="flex items-center justify-between p-4 border-t">
                <span className="text-sm text-muted-foreground">
                  Total results: {totalResults}
                </span>
                <div className="flex gap-1">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8"
                    disabled={currentPage * itemsPerPage >= totalResults}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};
