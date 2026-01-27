import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Send } from "lucide-react";
import { toast } from "sonner";

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export const FilterBuilder = () => {
  const [filters, setFilters] = useState<FilterRule[]>([
    { id: "1", field: "client-tier", operator: "equals", value: "tier-a" }
  ]);

  const addFilter = () => {
    const newFilter: FilterRule = {
      id: Date.now().toString(),
      field: "",
      operator: "equals",
      value: ""
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, field: keyof FilterRule, value: string) => {
    setFilters(filters.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const applyFilters = () => {
    toast.success("Filters applied successfully");
  };

  const sendToInizio = () => {
    toast.success("Data sent to Inizio");
  };

  return (
    <Card className="relative bg-gradient-to-br from-card via-card/95 to-accent/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Filter Builder</CardTitle>
          <Button onClick={addFilter} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {filters.map((filter) => (
            <div key={filter.id} className="flex gap-3 items-center">
              <Select 
                value={filter.field} 
                onValueChange={(v) => updateFilter(filter.id, "field", v)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client-tier">Client Tier</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="hco-type">HCO Type</SelectItem>
                  <SelectItem value="engagement-score">Engagement Score</SelectItem>
                  <SelectItem value="last-contact">Last Contact</SelectItem>
                  <SelectItem value="segmentation-value">Segmentation Value</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="region">Region</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={filter.operator} 
                onValueChange={(v) => updateFilter(filter.id, "operator", v)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not-equals">Not Equals</SelectItem>
                  <SelectItem value="greater-than">Greater Than</SelectItem>
                  <SelectItem value="less-than">Less Than</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={filter.value} 
                onValueChange={(v) => updateFilter(filter.id, "value", v)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select value" />
                </SelectTrigger>
                <SelectContent>
                  {filter.field === "client-tier" && (
                    <>
                      <SelectItem value="tier-a">Tier A</SelectItem>
                      <SelectItem value="tier-b">Tier B</SelectItem>
                      <SelectItem value="tier-c">Tier C</SelectItem>
                    </>
                  )}
                  {filter.field === "status" && (
                    <>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="at-risk">At Risk</SelectItem>
                      <SelectItem value="opportunity">Opportunity</SelectItem>
                      <SelectItem value="no-access">No Access</SelectItem>
                    </>
                  )}
                  {filter.field === "hco-type" && (
                    <>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="clinic">Clinic</SelectItem>
                      <SelectItem value="medical-center">Medical Center</SelectItem>
                      <SelectItem value="health-network">Health Network</SelectItem>
                    </>
                  )}
                  {filter.field === "region" && (
                    <>
                      <SelectItem value="north">North</SelectItem>
                      <SelectItem value="south">South</SelectItem>
                      <SelectItem value="east">East</SelectItem>
                      <SelectItem value="west">West</SelectItem>
                    </>
                  )}
                  {!["client-tier", "status", "hco-type", "region"].includes(filter.field) && (
                    <SelectItem value="custom">Enter value</SelectItem>
                  )}
                </SelectContent>
              </Select>

              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => removeFilter(filter.id)}
                disabled={filters.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" size="lg" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button size="lg" onClick={sendToInizio} className="gap-2">
            <Send className="h-4 w-4" />
            Send to Inizio
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
