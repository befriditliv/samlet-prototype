import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
        <CardContent className="p-0">
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
        </CardContent>
      </Card>
    </div>
  );
};
