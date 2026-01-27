import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, X, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
interface InsightFilter {
  activityType: string;
  therapyArea: string;
  hcpType: string;
  hcpSpecialty: string;
  molecule: string;
  brand: string;
  dateFrom: string;
  dateTo: string;
}
export const DebriefReportEngine = () => {
  const [searchQuery, setSearchQuery] = useState("What are HCP reactions to Ozempic initiation data?");
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [filters, setFilters] = useState<InsightFilter>({
    activityType: "",
    therapyArea: "",
    hcpType: "",
    hcpSpecialty: "",
    molecule: "",
    brand: "",
    dateFrom: "",
    dateTo: ""
  });
  const [results, setResults] = useState<number>(0);
  const updateFilter = (key: keyof InsightFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const clearFilters = () => {
    setFilters({
      activityType: "",
      therapyArea: "",
      hcpType: "",
      hcpSpecialty: "",
      molecule: "",
      brand: "",
      dateFrom: "",
      dateTo: ""
    });
    setSearchQuery("");
    setResults(0);
  };
  const generateInsights = () => {
    const mockResults = Math.floor(Math.random() * 150) + 50;
    setResults(mockResults);
    toast.success(`Generated insights from ${mockResults} employee meeting notes`);
  };
  const hasActiveFilters = Object.values(filters).some(v => v !== "");
  return <Card className="relative bg-gradient-to-br from-card via-card/95 to-accent/10">
      <CardHeader>
        
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="What are HCP reactions to BRAND data?" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 h-12 text-base" />
          </div>
          <Button size="lg" onClick={generateInsights} className="px-8">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button size="lg" variant="outline" className="px-8">
            <FileText className="h-4 w-4 mr-2" />
            Report History
          </Button>
        </div>

        {/* Advanced Filters Section */}
        {showAdvanced && <div className="space-y-6 p-6 rounded-lg bg-accent/5 border">
            <p className="text-sm text-muted-foreground">
              Narrow down your search by selecting the filters and dates below.
            </p>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Select value={filters.activityType} onValueChange={v => updateFilter("activityType", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Activity Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="field-visit">Field Visit</SelectItem>
                  <SelectItem value="virtual-meeting">Virtual Meeting</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="lunch-learn">Lunch & Learn</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.therapyArea} onValueChange={v => updateFilter("therapyArea", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Therapy Areas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diabetes">Diabetes</SelectItem>
                  <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                  <SelectItem value="obesity">Obesity</SelectItem>
                  <SelectItem value="endocrinology">Endocrinology</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.hcpType} onValueChange={v => updateFilter("hcpType", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="HCP Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physician">Physician</SelectItem>
                  <SelectItem value="nurse-practitioner">Nurse Practitioner</SelectItem>
                  <SelectItem value="pharmacist">Pharmacist</SelectItem>
                  <SelectItem value="specialist">Specialist</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.hcpSpecialty} onValueChange={v => updateFilter("hcpSpecialty", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="HCP Specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="endocrinology">Endocrinology</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="primary-care">Primary Care</SelectItem>
                  <SelectItem value="internal-medicine">Internal Medicine</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.molecule} onValueChange={v => updateFilter("molecule", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Molecules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semaglutide">Semaglutide</SelectItem>
                  <SelectItem value="tirzepatide">Tirzepatide</SelectItem>
                  <SelectItem value="liraglutide">Liraglutide</SelectItem>
                  <SelectItem value="dulaglutide">Dulaglutide</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.brand} onValueChange={v => updateFilter("brand", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ozempic">Ozempic</SelectItem>
                  <SelectItem value="wegovy">Wegovy</SelectItem>
                  <SelectItem value="mounjaro">Mounjaro</SelectItem>
                  <SelectItem value="victoza">Victoza</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <Input type="date" value={filters.dateFrom} onChange={e => updateFilter("dateFrom", e.target.value)} placeholder="No Date Selected" className="h-11" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <Input type="date" value={filters.dateTo} onChange={e => updateFilter("dateTo", e.target.value)} placeholder="No Date Selected" className="h-11" />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between pt-2">
              {hasActiveFilters && <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear filters
                </Button>}
              <div className="ml-auto">
                <Button variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
                  {showAdvanced ? <>
                      Hide Advanced Options
                      <ChevronUp className="h-4 w-4 ml-2" />
                    </> : <>
                      Show Advanced Options
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </>}
                </Button>
              </div>
            </div>
          </div>}

        {/* Results */}
        {results > 0 && <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {results} meeting notes analyzed
            </Badge>
            <p className="text-sm text-muted-foreground">
              Insights generated from employee interactions with HCPs regarding Ozempic initiation
            </p>
          </div>}
      </CardContent>
    </Card>;
};