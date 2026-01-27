import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sparkles,
  ChevronDown,
  Clock,
  TrendingUp,
  Users,
  Building2,
  MapPin,
  Tag,
  Calendar,
  Shield,
  Send,
  X,
} from "lucide-react";

interface QueryBuilderProps {
  entityType: 'hcp' | 'hco';
  onClose: () => void;
  onExecuteQuery: (query: string) => void;
  isLoading?: boolean;
}

interface ExampleCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  examples: {
    query: string;
    description: string;
  }[];
}

const hcpExamples: ExampleCategory[] = [
  {
    id: 'time',
    label: 'Time-based',
    icon: <Clock className="h-4 w-4" />,
    examples: [
      { query: "HCPs I haven't contacted in 30 days", description: "Find overdue contacts" },
      { query: "HCPs with no meetings this quarter", description: "Q4 outreach gaps" },
      { query: "HCPs I met last week", description: "Recent follow-ups needed" },
    ]
  },
  {
    id: 'engagement',
    label: 'Engagement',
    icon: <TrendingUp className="h-4 w-4" />,
    examples: [
      { query: "High-tier HCPs with less than 2 meetings this year", description: "Priority targets" },
      { query: "HCPs who opened my last 3 emails", description: "Engaged contacts" },
      { query: "HCPs I've never met in person", description: "Virtual-only relationships" },
    ]
  },
  {
    id: 'segments',
    label: 'Segments & Specialties',
    icon: <Tag className="h-4 w-4" />,
    examples: [
      { query: "Endocrinologists interested in GLP-1", description: "Specialty + interest" },
      { query: "Tier A HCPs in the Obesity segment", description: "High-value segment" },
      { query: "Cardiologists with diabetes patients", description: "Cross-specialty opportunities" },
    ]
  },
  {
    id: 'consent',
    label: 'Consent & Compliance',
    icon: <Shield className="h-4 w-4" />,
    examples: [
      { query: "HCPs missing marketing consent", description: "Consent collection needed" },
      { query: "HCPs with expired consent", description: "Renewal required" },
      { query: "HCPs with full consent but no digital engagement", description: "Activation opportunity" },
    ]
  },
  {
    id: 'organization',
    label: 'By Organization',
    icon: <Building2 className="h-4 w-4" />,
    examples: [
      { query: "HCPs at hospitals I visited this month", description: "Warm introductions" },
      { query: "HCPs at Tier A HCOs", description: "Key account contacts" },
      { query: "HCPs at clinics without a KOL", description: "Influence gaps" },
    ]
  },
];

const hcoExamples: ExampleCategory[] = [
  {
    id: 'time',
    label: 'Time-based',
    icon: <Clock className="h-4 w-4" />,
    examples: [
      { query: "HCOs I haven't visited in 60 days", description: "Overdue site visits" },
      { query: "HCOs with no activity this quarter", description: "Silent accounts" },
      { query: "HCOs I'm visiting next week", description: "Prep needed" },
    ]
  },
  {
    id: 'tier',
    label: 'Tier & Value',
    icon: <TrendingUp className="h-4 w-4" />,
    examples: [
      { query: "Tier A HCOs with declining engagement", description: "At-risk key accounts" },
      { query: "High-potential HCOs not yet Tier A", description: "Growth opportunities" },
      { query: "HCOs with highest patient volume", description: "Scale opportunities" },
    ]
  },
  {
    id: 'location',
    label: 'Geography',
    icon: <MapPin className="h-4 w-4" />,
    examples: [
      { query: "HCOs in Copenhagen region", description: "Territory focus" },
      { query: "Hospitals within 50km of my location", description: "Nearby opportunities" },
      { query: "HCOs in my route for tomorrow", description: "Trip optimization" },
    ]
  },
  {
    id: 'digital',
    label: 'Digital Engagement',
    icon: <Users className="h-4 w-4" />,
    examples: [
      { query: "HCOs with low digital engagement score", description: "Digital activation needed" },
      { query: "HCOs that downloaded materials this month", description: "Interested accounts" },
      { query: "HCOs using our patient portal", description: "Integrated partners" },
    ]
  },
];

export const QueryBuilder = ({ entityType, onClose, onExecuteQuery, isLoading }: QueryBuilderProps) => {
  const [query, setQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['time']);

  const examples = entityType === 'hcp' ? hcpExamples : hcoExamples;

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };

  const handleSubmit = () => {
    if (query.trim()) {
      onExecuteQuery(query);
    }
  };

  return (
    <div className="border rounded-lg bg-card/80 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Ask Jarvis</h3>
          <Badge variant="secondary" className="text-xs">Natural Language</Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Query Input */}
      <div className="p-4 space-y-4">
        <div className="relative">
          <Textarea
            placeholder={`Describe what ${entityType === 'hcp' ? 'HCPs' : 'HCOs'} you're looking for...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[80px] pr-12 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button 
            size="icon" 
            className="absolute bottom-2 right-2 h-8 w-8"
            onClick={handleSubmit}
            disabled={!query.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Examples Panel */}
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Example queries
          </p>
          
          {examples.map((category) => (
            <Collapsible 
              key={category.id} 
              open={expandedCategories.includes(category.id)}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between h-9 px-3 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <span className="text-sm">{category.label}</span>
                  </div>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${
                      expandedCategories.includes(category.id) ? 'rotate-180' : ''
                    }`} 
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pl-6 pr-2 py-2 space-y-1">
                  {category.examples.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleExampleClick(example.query)}
                      className="w-full text-left p-2 rounded-md hover:bg-accent/50 transition-colors group"
                    >
                      <div className="text-sm font-medium group-hover:text-primary transition-colors">
                        "{example.query}"
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {example.description}
                      </div>
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};
