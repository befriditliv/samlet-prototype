import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, ExternalLink, ChevronDown, Users, Phone as PhoneIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

interface HCO {
  id: string;
  name: string;
  organization_type: string;
  address: string;
  phone: string;
  website: string;
  access_level: string;
  segments: string[];
  tier: string;
  introduction: string;
  latest_communication: string;
  digital_engagement: string;
  hcp_insights: string;
}

interface HCP {
  id: string;
  name: string;
  title: string;
  marketing_consent: boolean;
  access_level: string;
  last_meeting_date: string;
  activity_plan: string;
}

interface Interaction {
  id: string;
  interaction_type: string;
  interaction_date: string;
  title: string;
  notes: string;
  created_by: string;
}

export default function HcoDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [hco, setHco] = useState<HCO | null>(null);
  const [hcps, setHcps] = useState<HCP[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedInteraction, setExpandedInteraction] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchHcoData();
    }
  }, [id]);

  const fetchHcoData = async () => {
    try {
      setLoading(true);
      
      // Fetch HCO data
      const { data: hcoData, error: hcoError } = await supabase
        .from("hcos")
        .select("*")
        .eq("id", id)
        .single();

      if (hcoError) throw hcoError;
      setHco(hcoData);

      // Fetch associated HCPs
      const { data: hcpsData, error: hcpsError } = await supabase
        .from("hcps")
        .select("*")
        .eq("hco_id", id);

      if (hcpsError) throw hcpsError;
      setHcps(hcpsData || []);

      // Fetch interactions
      const { data: interactionsData, error: interactionsError } = await supabase
        .from("interactions")
        .select("*")
        .eq("hco_id", id)
        .order("interaction_date", { ascending: false });

      if (interactionsError) throw interactionsError;
      setInteractions(interactionsData || []);
    } catch (error) {
      console.error("Error fetching HCO data:", error);
      toast({
        title: "Fejl",
        description: "Kunne ikke hente data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Indlæser...</div>
      </div>
    );
  }

  if (!hco) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">HCO ikke fundet</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tilbage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Back button and title */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{hco.name}</h1>
        </div>

        {/* Header Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-card-foreground mb-3">{hco.name}</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">{hco.organization_type}</Badge>
                  <Badge variant="secondary">{hco.access_level}</Badge>
                  {hco.segments?.map((segment) => (
                    <Badge key={segment} variant="outline" className="bg-warning/10 text-warning border-warning/20">
                      {segment}
                    </Badge>
                  ))}
                  {hco.tier && (
                    <Badge variant="outline" className="bg-accent text-accent-foreground">
                      Tier {hco.tier}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              {hco.address && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rutevejledning</p>
                    <p className="text-foreground">{hco.address}</p>
                  </div>
                </div>
              )}
              {hco.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Telefon</p>
                    <p className="text-foreground">{hco.phone}</p>
                  </div>
                </div>
              )}
              {hco.website && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <ExternalLink className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Website</p>
                    <a href={hco.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {hco.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* HCO Insights */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">HCO Indsigter</h3>
          
          <div className="space-y-6">
            {hco.introduction && (
              <div>
                <h4 className="font-medium text-card-foreground mb-2">Introduktion</h4>
                <p className="text-sm text-muted-foreground">{hco.introduction}</p>
              </div>
            )}

            {hco.latest_communication && (
              <div>
                <h4 className="font-medium text-card-foreground mb-2">Seneste kommunikation</h4>
                <p className="text-sm text-muted-foreground">{hco.latest_communication}</p>
              </div>
            )}

            {hco.digital_engagement && (
              <div>
                <h4 className="font-medium text-card-foreground mb-2">Digitalt engagement</h4>
                <p className="text-sm text-muted-foreground">{hco.digital_engagement}</p>
              </div>
            )}

            {hco.hcp_insights && (
              <div>
                <h4 className="font-medium text-card-foreground mb-2">HCP indsigt</h4>
                <p className="text-sm text-muted-foreground">{hco.hcp_insights}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Employees Table */}
        {hcps.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Medarbejdere</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NAVN</TableHead>
                    <TableHead>TITEL</TableHead>
                    <TableHead>MARKETING CONSENT</TableHead>
                    <TableHead>ACCESS LEVEL</TableHead>
                    <TableHead>SIDSTE MØDE</TableHead>
                    <TableHead>ACTIVITY PLAN</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hcps.map((hcp) => (
                    <TableRow key={hcp.id}>
                      <TableCell className="font-medium">{hcp.name}</TableCell>
                      <TableCell>{hcp.title}</TableCell>
                      <TableCell>
                        {hcp.marketing_consent ? (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">✓ OPTIN</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {hcp.access_level ? (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">✓ ACCESS</Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{hcp.last_meeting_date || "—"}</TableCell>
                      <TableCell>{hcp.activity_plan || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {/* Interactions */}
        {interactions.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Tidligere interaktioner</h3>
            
            <div className="space-y-2">
              {interactions.map((interaction) => (
                <Collapsible
                  key={interaction.id}
                  open={expandedInteraction === interaction.id}
                  onOpenChange={(open) => setExpandedInteraction(open ? interaction.id : null)}
                >
                  <div className="border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                    <CollapsibleTrigger className="w-full p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                          {interaction.interaction_type === "Telefonopkald" ? (
                            <PhoneIcon className="h-5 w-5 text-primary" />
                          ) : (
                            <Users className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-muted-foreground">
                            {new Date(interaction.interaction_date).toLocaleDateString("da-DK")} - {interaction.interaction_type}
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
                          <p className="text-xs text-muted-foreground">Oprettet af: {interaction.created_by}</p>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
