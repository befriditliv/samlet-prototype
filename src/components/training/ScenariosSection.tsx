import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, MoreVertical, Search } from "lucide-react";

interface Scenario {
  id: string;
  name: string;
  product: string;
}

const mockScenarios: Scenario[] = [
  { id: "1", name: "Overcoming Cost Concerns", product: "Ozempic" },
  { id: "2", name: "GLP-1 Efficacy Discussion", product: "Rybelsus" },
  { id: "3", name: "Managing Side Effect Concerns", product: "Victoza" },
  { id: "4", name: "Injection Adherence Challenge", product: "Ozempic" },
  { id: "5", name: "Basal Insulin Optimization", product: "Tresiba" },
];

interface ScenariosSectionProps {
  onStartScenario?: (scenarioId: string) => void;
}

export const ScenariosSection = ({ onStartScenario }: ScenariosSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 5;
  
  const filteredScenarios = mockScenarios.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.product.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalResults = filteredScenarios.length;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">Scenarios</h3>
      
      <Card className="border shadow-sm">
        <Tabs defaultValue="my-scenarios" className="w-full">
          <div className="border-b px-4">
            <TabsList className="h-10 bg-transparent p-0 gap-4">
              <TabsTrigger 
                value="company-scenarios" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-2.5"
              >
                Company Scenarios
              </TabsTrigger>
              <TabsTrigger 
                value="my-scenarios"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-2.5"
              >
                My Scenarios
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="p-0">
            <TabsContent value="company-scenarios" className="m-0 p-4">
              <p className="text-muted-foreground text-sm">No company scenarios available yet.</p>
            </TabsContent>
            
            <TabsContent value="my-scenarios" className="m-0">
              <div className="p-4 pb-0 flex justify-end">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left text-sm font-medium text-muted-foreground p-4">Name</th>
                    <th className="text-right text-sm font-medium text-muted-foreground p-4 w-32"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScenarios.map((scenario) => (
                    <tr key={scenario.id} className="border-b last:border-0 hover:bg-accent/30">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{scenario.name}</div>
                          <div className="text-sm text-muted-foreground">{scenario.product}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => onStartScenario?.(scenario.id)}
                          >
                            Start
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="flex items-center justify-between p-4 border-t">
                <span className="text-sm text-muted-foreground">
                  Total scenarios: {totalResults}
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
