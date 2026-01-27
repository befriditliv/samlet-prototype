import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users,
  Building2,
  SlidersHorizontal,
  Search,
  X,
  ArrowUpDown,
  Sparkles
} from "lucide-react";
import { format, subDays } from "date-fns";
import { da } from "date-fns/locale";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import jarvisLogo from "@/assets/jarvis-logo.svg";
import { AskJarvis } from "@/components/AskJarvis";
import { NavigationMenu } from "@/components/NavigationMenu";
import { QueryBuilder } from "@/components/QueryBuilder";
import { toast } from "sonner";

type EntityType = 'hcp' | 'hco';
type FilterType = 'all' | 'overdue' | 'high-value-low-engagement' | 'missing-consent' | 'no-next-step' | 'high-value';

interface HcpResult {
  id: string;
  name: string;
  title: string;
  access_level: string | null;
  last_meeting_date: string | null;
  marketing_consent: boolean | null;
  segments: string[] | null;
  segmentation: string | null;
  hco_name?: string;
  next_meeting_date?: string | null;
}

interface HcoResult {
  id: string;
  name: string;
  organization_type: string;
  tier: string | null;
  access_level: string | null;
  digital_engagement: string | null;
  segments: string[] | null;
  last_interaction_date?: string | null;
  next_interaction_date?: string | null;
}

type SortField = 'name' | 'last_meeting' | 'next_meeting' | 'type';
type SortDirection = 'asc' | 'desc';

const filterLabels: Record<FilterType, string> = {
  'all': 'Alle',
  'overdue': 'Overdue for contact',
  'high-value-low-engagement': 'High-value, low engagement',
  'missing-consent': 'Missing consent',
  'no-next-step': 'No next step planned',
  'high-value': 'High-value'
};

const Kundeoversigt = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read initial values from URL params
  const initialEntityType = (searchParams.get('type') as EntityType) || 'hcp';
  const initialFilter = (searchParams.get('filter') as FilterType) || 'all';
  
  const [entityType, setEntityType] = useState<EntityType>(initialEntityType);
  const [activeFilter, setActiveFilter] = useState<FilterType>(initialFilter);
  const [hcpResults, setHcpResults] = useState<HcpResult[]>([]);
  const [hcoResults, setHcoResults] = useState<HcoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterOpen, setFilterOpen] = useState(false);
  const [showQueryBuilder, setShowQueryBuilder] = useState(false);
  const [queryBuilderLoading, setQueryBuilderLoading] = useState(false);
  
  const ITEMS_PER_PAGE = 15;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Update URL when entity type or filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('type', entityType);
    if (activeFilter !== 'all') {
      params.set('filter', activeFilter);
    }
    setSearchParams(params, { replace: true });
  }, [entityType, activeFilter]);

  useEffect(() => {
    setCurrentPage(1);
    fetchData();
  }, [entityType, searchQuery, activeFilter]);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    setLoading(true);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const thirtyDaysAgo = subDays(new Date(), 30);
    const sixtyDaysAgo = subDays(new Date(), 60);
    const today = format(new Date(), 'yyyy-MM-dd');

    try {
      if (entityType === 'hcp') {
        // Build base query with filters
        let countQuery = supabase.from('hcps').select('*', { count: 'exact', head: true });
        let dataQuery = supabase.from('hcps').select(`
          id,
          name,
          title,
          access_level,
          last_meeting_date,
          marketing_consent,
          segments,
          segmentation,
          hcos (name)
        `);
        
        // Apply search filter
        if (searchQuery) {
          countQuery = countQuery.ilike('name', `%${searchQuery}%`);
          dataQuery = dataQuery.ilike('name', `%${searchQuery}%`);
        }

        // Apply pre-defined filters
        if (activeFilter === 'overdue') {
          const filterCondition = `last_meeting_date.is.null,last_meeting_date.lt.${format(thirtyDaysAgo, 'yyyy-MM-dd')}`;
          countQuery = countQuery.or(filterCondition);
          dataQuery = dataQuery.or(filterCondition);
        } else if (activeFilter === 'missing-consent') {
          const filterCondition = 'marketing_consent.is.null,marketing_consent.eq.false';
          countQuery = countQuery.or(filterCondition);
          dataQuery = dataQuery.or(filterCondition);
        } else if (activeFilter === 'high-value-low-engagement') {
          countQuery = countQuery
            .in('access_level', ['Tier A', 'Tier B', 'High', 'Medium'])
            .or(`last_meeting_date.is.null,last_meeting_date.lt.${format(sixtyDaysAgo, 'yyyy-MM-dd')}`);
          dataQuery = dataQuery
            .in('access_level', ['Tier A', 'Tier B', 'High', 'Medium'])
            .or(`last_meeting_date.is.null,last_meeting_date.lt.${format(sixtyDaysAgo, 'yyyy-MM-dd')}`);
        }
        // Note: 'no-next-step' filter would require a more complex query with joins
        
        const { count } = await countQuery;
        setTotalCount(count || 0);

        dataQuery = dataQuery
          .order('name', { ascending: sortDirection === 'asc' })
          .range(offset, offset + ITEMS_PER_PAGE - 1);

        const { data, error } = await dataQuery;
        
        if (error) throw error;

        // Fetch upcoming meetings for these HCPs
        const hcpIds = (data || []).map(h => h.id);
        
        const { data: upcomingMeetings } = await supabase
          .from('interactions')
          .select('hcp_id, interaction_date')
          .in('hcp_id', hcpIds)
          .gte('interaction_date', today)
          .order('interaction_date', { ascending: true });

        const nextMeetingMap: Record<string, string> = {};
        (upcomingMeetings || []).forEach((m: any) => {
          if (m.hcp_id && !nextMeetingMap[m.hcp_id]) {
            nextMeetingMap[m.hcp_id] = m.interaction_date;
          }
        });
        
        let results = (data || []).map(item => ({
          ...item,
          hco_name: (item.hcos as any)?.name,
          next_meeting_date: nextMeetingMap[item.id] || null
        }));

        // Filter for 'no-next-step' on client side (since it requires join logic)
        if (activeFilter === 'no-next-step') {
          results = results.filter(hcp => !hcp.next_meeting_date);
        }

        setHcpResults(results);
      } else {
        // HCO queries
        let countQuery = supabase.from('hcos').select('*', { count: 'exact', head: true });
        let dataQuery = supabase.from('hcos').select('*');
        
        if (searchQuery) {
          countQuery = countQuery.ilike('name', `%${searchQuery}%`);
          dataQuery = dataQuery.ilike('name', `%${searchQuery}%`);
        }

        if (activeFilter === 'high-value') {
          countQuery = countQuery.in('tier', ['Tier A', 'Tier B', 'A', 'B']);
          dataQuery = dataQuery.in('tier', ['Tier A', 'Tier B', 'A', 'B']);
        }

        const { count } = await countQuery;
        setTotalCount(count || 0);

        dataQuery = dataQuery
          .order('name', { ascending: sortDirection === 'asc' })
          .range(offset, offset + ITEMS_PER_PAGE - 1);

        const { data, error } = await dataQuery;
        
        if (error) throw error;

        // Fetch interactions for HCOs
        const hcoIds = (data || []).map(h => h.id);
        
        const { data: pastInteractions } = await supabase
          .from('interactions')
          .select('hco_id, interaction_date')
          .in('hco_id', hcoIds)
          .lt('interaction_date', today)
          .order('interaction_date', { ascending: false });

        const { data: futureInteractions } = await supabase
          .from('interactions')
          .select('hco_id, interaction_date')
          .in('hco_id', hcoIds)
          .gte('interaction_date', today)
          .order('interaction_date', { ascending: true });

        const lastInteractionMap: Record<string, string> = {};
        const nextInteractionMap: Record<string, string> = {};
        
        (pastInteractions || []).forEach((i: any) => {
          if (i.hco_id && !lastInteractionMap[i.hco_id]) {
            lastInteractionMap[i.hco_id] = i.interaction_date;
          }
        });
        
        (futureInteractions || []).forEach((i: any) => {
          if (i.hco_id && !nextInteractionMap[i.hco_id]) {
            nextInteractionMap[i.hco_id] = i.interaction_date;
          }
        });

        setHcoResults((data || []).map(item => ({
          ...item,
          last_interaction_date: lastInteractionMap[item.id] || null,
          next_interaction_date: nextInteractionMap[item.id] || null
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEntityClick = (id: string) => {
    if (entityType === 'hcp') {
      navigate(`/hcp/${id}`);
    } else {
      navigate(`/hco/${id}`);
    }
  };

  const handleClearFilter = () => {
    setActiveFilter('all');
    setSearchQuery('');
  };

  const formatMeetingDate = (date: string | null) => {
    if (!date) return 'Ikke relevant';
    return format(new Date(date), 'dd.MM.yyyy', { locale: da });
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
      </div>
    </TableHead>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(role === 'manager' ? '/manager' : '/')}
                className="shrink-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Kundeoversigt</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Søg efter HCP'er eller HCO'er..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-8"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <AskJarvis />
              <NavigationMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">Fandt</span>
            <Badge variant="outline" className="font-medium">
              {totalCount} {entityType === 'hcp' ? 'HCPs' : 'HCOs'}
            </Badge>
            {activeFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {filterLabels[activeFilter]}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 hover:bg-transparent"
                  onClick={handleClearFilter}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Query Builder Toggle */}
            <Button
              variant={showQueryBuilder ? "default" : "outline"}
              size="sm"
              onClick={() => setShowQueryBuilder(!showQueryBuilder)}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Avanceret søgning
            </Button>

            {/* HCO/HCP Toggle */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              <Button
                variant={entityType === 'hco' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => { setEntityType('hco'); setActiveFilter('all'); }}
                className="h-9 w-9"
                title="Vis HCOs"
              >
                <Building2 className="h-4 w-4" />
              </Button>
              <Button
                variant={entityType === 'hcp' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => { setEntityType('hcp'); setActiveFilter('all'); }}
                className="h-9 w-9"
                title="Vis HCPs"
              >
                <Users className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Button */}
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="default" size="icon" className="h-9 w-9">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filter {entityType === 'hcp' ? 'HCP' : 'HCO'}</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  <Accordion type="multiple" defaultValue={["quick-filters", "search", "filters", "sort", "saved"]} className="space-y-2">
                    {/* Quick Filters from Activity Hub */}
                    <AccordionItem value="quick-filters" className="border rounded-lg px-4 border-primary">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Hurtige filtre
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Pre-definerede filtre fra Activity Hub
                        </p>
                        <div className="space-y-2">
                          {entityType === 'hcp' ? (
                            <>
                              <Button 
                                variant={activeFilter === 'overdue' ? 'default' : 'outline'} 
                                size="sm" 
                                className="w-full justify-start"
                                onClick={() => { setActiveFilter('overdue'); setFilterOpen(false); }}
                              >
                                Overdue for contact
                              </Button>
                              <Button 
                                variant={activeFilter === 'missing-consent' ? 'default' : 'outline'} 
                                size="sm" 
                                className="w-full justify-start"
                                onClick={() => { setActiveFilter('missing-consent'); setFilterOpen(false); }}
                              >
                                Missing consent
                              </Button>
                              <Button 
                                variant={activeFilter === 'high-value-low-engagement' ? 'default' : 'outline'} 
                                size="sm" 
                                className="w-full justify-start"
                                onClick={() => { setActiveFilter('high-value-low-engagement'); setFilterOpen(false); }}
                              >
                                High-value, low engagement
                              </Button>
                              <Button 
                                variant={activeFilter === 'no-next-step' ? 'default' : 'outline'} 
                                size="sm" 
                                className="w-full justify-start"
                                onClick={() => { setActiveFilter('no-next-step'); setFilterOpen(false); }}
                              >
                                No next step planned
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant={activeFilter === 'high-value' ? 'default' : 'outline'} 
                              size="sm" 
                              className="w-full justify-start"
                              onClick={() => { setActiveFilter('high-value'); setFilterOpen(false); }}
                            >
                              High-value HCOs
                            </Button>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="search" className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4" />
                          Søg
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Søg efter {entityType === 'hcp' ? 'HCP\'er' : 'HCO\'er'} efter navn.
                        </p>
                        <Input
                          placeholder={`Søg ${entityType === 'hcp' ? 'HCP' : 'HCO'}...`}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="filters" className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <SlidersHorizontal className="h-4 w-4" />
                          Avancerede filtre
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          Filtrer {entityType === 'hcp' ? 'HCP\'er' : 'HCO\'er'} efter afstand, møder, persona og mere.
                        </p>
                        <div className="space-y-2">
                          {['Maksimal afstand', 'Sidste møde', 'Fremtidige møder', 'Region', 
                            'Target class: Insulin', 'Target class: GLP1', 'Target class: Obesity',
                            'Target class: Account value', 'Type', 'Responsible agent'].map((filter) => (
                            <div key={filter} className="flex items-center justify-between py-2 border-b last:border-0">
                              <div className="flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{filter}</span>
                              </div>
                              <div className="h-4 w-4 border rounded-full" />
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="sort" className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <ArrowUpDown className="h-4 w-4" />
                          Sorter efter
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          Sorter {entityType === 'hcp' ? 'HCP\'er' : 'HCO\'er'} efter afstand, møder, persona og mere.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="saved" className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M9 3v18" />
                            <path d="M14 9h4" />
                            <path d="M14 13h4" />
                          </svg>
                          Gemte filtre
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground">
                          Opret eller aktiver gemte filtre.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1" onClick={handleClearFilter}>
                      Ryd alle filtre
                    </Button>
                    <Button className="flex-1" onClick={() => setFilterOpen(false)}>
                      Søg ({totalCount})
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Query Builder Panel */}
        {showQueryBuilder && (
          <div className="mb-6">
            <QueryBuilder
              entityType={entityType}
              onClose={() => setShowQueryBuilder(false)}
              onExecuteQuery={async (query) => {
                setQueryBuilderLoading(true);
                toast.info("Custom query submitted", {
                  description: `"${query}" - AI translation coming soon`
                });
                setQueryBuilderLoading(false);
              }}
              isLoading={queryBuilderLoading}
            />
          </div>
        )}

        {/* Data Table */}
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <SortableHeader field="name">NAVN</SortableHeader>
                <SortableHeader field="type">TYPE</SortableHeader>
                <SortableHeader field="last_meeting">SIDSTE MØDE</SortableHeader>
                <SortableHeader field="next_meeting">NÆSTE MØDE</SortableHeader>
                <TableHead>ORGANISATION</TableHead>
                {entityType === 'hcp' && <TableHead>SEGMENTERING</TableHead>}
                {entityType === 'hco' && <TableHead>TIER</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    Indlæser...
                  </TableCell>
                </TableRow>
              ) : entityType === 'hcp' ? (
                hcpResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      Ingen HCP'er fundet
                    </TableCell>
                  </TableRow>
                ) : (
                  hcpResults.map((hcp) => (
                    <TableRow 
                      key={hcp.id} 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleEntityClick(hcp.id)}
                    >
                      <TableCell className="font-medium">{hcp.name}</TableCell>
                      <TableCell>{hcp.title}</TableCell>
                      <TableCell>{formatMeetingDate(hcp.last_meeting_date)}</TableCell>
                      <TableCell>{formatMeetingDate(hcp.next_meeting_date || null)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{hcp.hco_name || '—'}</TableCell>
                      <TableCell>
                        {hcp.segmentation ? (
                          <Badge variant="secondary">{hcp.segmentation}</Badge>
                        ) : '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )
              ) : (
                hcoResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      Ingen HCO'er fundet
                    </TableCell>
                  </TableRow>
                ) : (
                  hcoResults.map((hco) => (
                    <TableRow 
                      key={hco.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleEntityClick(hco.id)}
                    >
                      <TableCell className="font-medium">{hco.name}</TableCell>
                      <TableCell>{hco.organization_type}</TableCell>
                      <TableCell>{formatMeetingDate(hco.last_interaction_date || null)}</TableCell>
                      <TableCell>{formatMeetingDate(hco.next_interaction_date || null)}</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>
                        {hco.tier ? (
                          <Badge variant="secondary">{hco.tier}</Badge>
                        ) : '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <span className="text-sm text-muted-foreground">
            Side {currentPage} af {totalPages || 1}
          </span>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage >= totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Kundeoversigt;
