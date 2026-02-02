import { useState, useMemo } from "react";
import { ChevronDown, Users, Phone as PhoneIcon, Monitor, GraduationCap, Mail, Calendar, MessageSquare, Newspaper, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Interaction {
  id: string;
  interaction_type: string;
  interaction_date: string;
  title: string;
  notes?: string;
  created_by?: string;
}

interface InteractionsListProps {
  interactions: Interaction[];
}

const interactionTypes = [
  { value: "Meeting", label: "Meeting", icon: Users },
  { value: "Virtual meeting", label: "Virtual meeting", icon: Monitor },
  { value: "Phone call", label: "Phone call", icon: PhoneIcon },
  { value: "Training", label: "Training", icon: GraduationCap },
  { value: "Email", label: "Email", icon: Mail },
  { value: "Event", label: "Event", icon: Calendar },
  { value: "Message", label: "Message", icon: MessageSquare },
  { value: "Newsletter", label: "Newsletter", icon: Newspaper },
];

const getInteractionIcon = (type: string) => {
  const found = interactionTypes.find(t => 
    t.value.toLowerCase() === type.toLowerCase() || 
    t.label.toLowerCase() === type.toLowerCase()
  );
  if (found) {
    const IconComponent = found.icon;
    return <IconComponent className="h-5 w-5 text-primary" />;
  }
  // Fallback icons for Danish types
  if (type === "Telefonopkald") return <PhoneIcon className="h-5 w-5 text-primary" />;
  if (type === "Møde") return <Users className="h-5 w-5 text-primary" />;
  if (type === "Virtuelt møde") return <Monitor className="h-5 w-5 text-primary" />;
  if (type === "Uddannelse") return <GraduationCap className="h-5 w-5 text-primary" />;
  if (type === "Besked") return <MessageSquare className="h-5 w-5 text-primary" />;
  if (type === "Nyhedsbrev") return <Newspaper className="h-5 w-5 text-primary" />;
  return <Users className="h-5 w-5 text-primary" />;
};

export const InteractionsList = ({ interactions }: InteractionsListProps) => {
  const [expandedInteraction, setExpandedInteraction] = useState<string | null>(null);
  const [viewFilter, setViewFilter] = useState<'all' | 'mine'>('all');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);

  const filteredInteractions = useMemo(() => {
    let filtered = interactions;
    
    // Filter by "mine" - in real app would check against current user
    if (viewFilter === 'mine') {
      filtered = filtered.filter(i => i.created_by === 'Current User');
    }
    
    // Filter by interaction type
    if (typeFilter) {
      filtered = filtered.filter(i => 
        i.interaction_type.toLowerCase() === typeFilter.toLowerCase() ||
        // Also check Danish equivalents
        (typeFilter === "Meeting" && i.interaction_type === "Møde") ||
        (typeFilter === "Virtual meeting" && i.interaction_type === "Virtuelt møde") ||
        (typeFilter === "Phone call" && i.interaction_type === "Telefonopkald") ||
        (typeFilter === "Training" && i.interaction_type === "Uddannelse") ||
        (typeFilter === "Message" && i.interaction_type === "Besked") ||
        (typeFilter === "Newsletter" && i.interaction_type === "Nyhedsbrev")
      );
    }
    
    return filtered;
  }, [interactions, viewFilter, typeFilter]);

  if (interactions.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Previous Interactions</h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          No previous interactions registered
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Previous Interactions</h3>
      
      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        {/* All / Mine toggle */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant={viewFilter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewFilter('all')}
            className="h-8 px-4"
          >
            All
          </Button>
          <Button
            variant={viewFilter === 'mine' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewFilter('mine')}
            className="h-8 px-4"
          >
            Mine
          </Button>
        </div>

        {/* Interaction type filter */}
        <Popover open={typeFilterOpen} onOpenChange={setTypeFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={typeFilterOpen}
              className="h-9 gap-2"
            >
              {typeFilter ? (
                <>
                  {(() => {
                    const found = interactionTypes.find(t => t.value === typeFilter);
                    if (found) {
                      const IconComponent = found.icon;
                      return <IconComponent className="h-4 w-4" />;
                    }
                    return null;
                  })()}
                  {typeFilter}
                </>
              ) : (
                "Filter by interaction type"
              )}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Interaction type" />
              <CommandList>
                <CommandEmpty>No type found.</CommandEmpty>
                <CommandGroup>
                  {interactionTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <CommandItem
                        key={type.value}
                        value={type.value}
                        onSelect={() => {
                          setTypeFilter(type.value);
                          setTypeFilterOpen(false);
                        }}
                        className="flex items-center gap-2"
                      >
                        <IconComponent className="h-4 w-4" />
                        {type.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {typeFilter && (
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        setTypeFilter(null);
                        setTypeFilterOpen(false);
                      }}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                      Clear
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Active filter badge */}
        {typeFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTypeFilter(null)}
            className="h-8 gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear filter
          </Button>
        )}
      </div>

      {/* Results count */}
      {(typeFilter || viewFilter === 'mine') && (
        <p className="text-sm text-muted-foreground mb-3">
          Showing {filteredInteractions.length} of {interactions.length} interactions
        </p>
      )}
      
      {/* Interactions list */}
      <div className="space-y-2">
        {filteredInteractions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No interactions match the selected filters
          </p>
        ) : (
          filteredInteractions.map((interaction) => (
            <Collapsible
              key={interaction.id}
              open={expandedInteraction === interaction.id}
              onOpenChange={(open) => setExpandedInteraction(open ? interaction.id : null)}
            >
              <div className="border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                <CollapsibleTrigger className="w-full p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      {getInteractionIcon(interaction.interaction_type)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">
                        {new Date(interaction.interaction_date).toLocaleDateString("en-US")} - {interaction.interaction_type}
                      </p>
                      <p className="font-medium text-card-foreground">{interaction.title}</p>
                    </div>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedInteraction === interaction.id ? "rotate-180" : ""}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <div className="pt-2 border-t">
                    {interaction.notes && (
                      <p className="text-sm text-muted-foreground mb-2">{interaction.notes}</p>
                    )}
                    {interaction.created_by && (
                      <p className="text-xs text-muted-foreground">Created by: {interaction.created_by}</p>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))
        )}
      </div>
    </Card>
  );
};
