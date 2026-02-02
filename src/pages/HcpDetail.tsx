import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, MapPin, Phone, ExternalLink, ChevronDown, Users, Phone as PhoneIcon, Building2, User, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { AIInsightsSection } from "@/components/AIInsightsSection";

interface HCP {
  id: string;
  name: string;
  title: string;
  hco_id?: string;
  access_level?: string;
  activity_plan?: string;
  segments?: string[];
  segmentation?: string;
  marketing_consent?: boolean;
  last_meeting_date?: string;
  created_at: string;
  updated_at: string;
}

interface HCO {
  id: string;
  name: string;
  organization_type: string;
  address?: string;
  phone?: string;
  website?: string;
}

interface Interaction {
  id: string;
  interaction_type: string;
  interaction_date: string;
  title: string;
  notes?: string;
  created_by?: string;
}

export default function HcpDetail() {
  const { id } = useParams();
  const { role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hcp, setHcp] = useState<HCP | null>(null);
  const [hco, setHco] = useState<HCO | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedInteraction, setExpandedInteraction] = useState<string | null>(null);

  useEffect(() => {
    const fetchHcpData = async () => {
      try {
        // Fetch HCP data
        const { data: hcpData, error: hcpError } = await supabase
          .from("hcps")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (hcpError) throw hcpError;
        setHcp(hcpData);

        // Fetch associated HCO if exists
        if (hcpData?.hco_id) {
          const { data: hcoData, error: hcoError } = await supabase
            .from("hcos")
            .select("id, name, organization_type, address, phone, website")
            .eq("id", hcpData.hco_id)
            .maybeSingle();

          if (hcoError) throw hcoError;
          setHco(hcoData);
        }

        // Fetch interactions
        const { data: interactionsData, error: interactionsError } = await supabase
          .from("interactions")
          .select("*")
          .eq("hcp_id", id)
          .order("interaction_date", { ascending: false });

        if (interactionsError) throw interactionsError;
        setInteractions(interactionsData || []);
      } catch (error) {
        console.error("Error fetching HCP data:", error);
        toast({
          title: "Error",
          description: "Could not fetch data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHcpData();
    }
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!hcp) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">HCP not found</p>
          <Button variant="outline" onClick={() => navigate(role === 'manager' ? '/manager' : '/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Back button and title */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(role === 'manager' ? '/manager' : '/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{hcp.name}</h1>
        </div>

        {/* Header Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-card-foreground mb-3">{hcp.name}</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">{hcp.title}</Badge>
                  {hcp.access_level && (
                    <Badge variant="secondary">{hcp.access_level}</Badge>
                  )}
                  {hcp.segments?.map((segment) => (
                    <Badge key={segment} variant="outline" className="bg-warning/10 text-warning border-warning/20">
                      {segment}
                    </Badge>
                  ))}
                  {hcp.marketing_consent && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      ✓ Consent
                    </Badge>
                  )}
                  {hcp.segmentation && (
                    <Badge variant="outline" className="bg-accent text-accent-foreground">
                      {hcp.segmentation}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* HCO Information */}
            {hco && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Organization</p>
                    <button 
                      onClick={() => navigate(`/hco/${hco.id}`)}
                      className="text-foreground hover:text-primary hover:underline transition-colors"
                    >
                      {hco.name}
                    </button>
                  </div>
                </div>
                {hco.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
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
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-foreground">{hco.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* AI-Generated Insights */}
        <AIInsightsSection entityType="hcp" entityName={hcp.name} />

        {/* Interactions */}
        {interactions.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Previous Interactions</h3>
            
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
              ))}
            </div>
          </Card>
        )}

        {interactions.length === 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Previous Interactions</h3>
            <p className="text-sm text-muted-foreground text-center py-8">
              No previous interactions registered
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
