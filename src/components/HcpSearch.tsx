import { useState, useEffect, useRef } from "react";
import { Search, Building2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  type: "hco" | "hcp";
  subtitle?: string;
}

export const HcpSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchData = async () => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      try {
        // Search HCOs
        const { data: hcoData } = await supabase
          .from("hcos")
          .select("id, name, organization_type")
          .ilike("name", `%${searchQuery}%`)
          .limit(5);

        // Search HCPs
        const { data: hcpData } = await supabase
          .from("hcps")
          .select("id, name, title")
          .ilike("name", `%${searchQuery}%`)
          .limit(5);

        const combinedResults: SearchResult[] = [
          ...(hcoData || []).map((hco) => ({
            id: hco.id,
            name: hco.name,
            type: "hco" as const,
            subtitle: hco.organization_type,
          })),
          ...(hcpData || []).map((hcp) => ({
            id: hcp.id,
            name: hcp.name,
            type: "hcp" as const,
            subtitle: hcp.title,
          })),
        ];

        setResults(combinedResults);
        setShowResults(combinedResults.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Error searching:", error);
      }
    };

    const debounceTimer = setTimeout(searchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleResultClick = (result: SearchResult) => {
    navigate(`/${result.type}/${result.id}`);
    setSearchQuery("");
    setShowResults(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleResultClick(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowResults(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 z-10" />
      <Input
        type="text"
        placeholder="Søg efter HCPs eller HCOs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (results.length > 0) setShowResults(true);
        }}
        className="pl-10 h-11"
      />
      
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {results.map((result, index) => (
            <button
              key={result.id}
              onClick={() => handleResultClick(result)}
              className={cn(
                "w-full px-4 py-3 flex items-center gap-3 hover:bg-accent transition-colors text-left",
                index === selectedIndex && "bg-accent"
              )}
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full",
                result.type === "hco" ? "bg-primary/10" : "bg-secondary/10"
              )}>
                {result.type === "hco" ? (
                  <Building2 className="h-5 w-5 text-primary" />
                ) : (
                  <User className="h-5 w-5 text-secondary" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-card-foreground">{result.name}</p>
                {result.subtitle && (
                  <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                )}
              </div>
              <span className="text-xs text-muted-foreground uppercase">
                {result.type === "hco" ? "HCO" : "HCP"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
