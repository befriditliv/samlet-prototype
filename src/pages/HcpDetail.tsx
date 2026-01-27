import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Calendar, FileText, ChevronDown, ExternalLink, User, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface HCP {
  id: string;
  name: string;
  title: string;
  hco_id?: string;
  access_level?: string;
  activity_plan?: string;
  segments?: string[];
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
  introduction?: string;
  latest_communication?: string;
  digital_engagement?: string;
  hcp_insights?: string;
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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hcp, setHcp] = useState<HCP | null>(null);
  const [hco, setHco] = useState<HCO | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

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
            .select("id, name, organization_type, address")
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
          description: "Failed to load HCP data",
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
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!hcp) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">HCP not found</h2>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-6">
          {/* Header Section */}
          <Card>
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4">Lægehus</h1>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">Practice Clinic</Badge>
                <Badge variant="secondary">Access</Badge>
                <Badge variant="secondary">GLP-1</Badge>
                <Badge variant="secondary">Obesity B</Badge>
                <Badge variant="secondary">Consent: 3/6</Badge>
              </div>
              
              <div className="grid gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span>Bolbrovej 32 v 125, Lundtofte, DK-3000</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>+45 12 34 56 78</span>
                </div>
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  <a href="#" className="text-primary hover:underline">
                    www.laegehus.dk
                  </a>
                </div>
              </div>
            </div>
          </Card>

          {/* HCO Insights Section */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">HCO Insights</h2>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">AI</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-muted/30 p-4 rounded-lg border border-border">
                  <p className="text-foreground leading-relaxed">
                    Lægepraksis Mogens Nørgaard Christiansen fokuserer på GLP1 og overvægt. Kommende møde vil 
                    fortsætte diskussionen om diabetes og overvægt. Louise viser digitalt engagement, mens Mogens 
                    ikke har haft interaktioner.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Introduction</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Lægepraksis Mogens Nørgaard Christiansen er en praksis/klinik med fokus på GLP1 og overvægt. 
                    Seneste interaktioner har omhandlet produkter som Ozempic og Wegovy, med enighed om behandlingsplaner. 
                    Der er planlagt møder for at fortsætte diskussionen om diabetes og overvægt.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Kommende møde</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Næste møde med HCO er planlagt til den 31. oktober 2025 fra kl. 13:00 til 13:15. Mødet vil finde 
                    sted på Bernstorff ANB 110 b, Hellerup, DK-3000. Der er ingen andre planlagt med deltagerne.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Seneste kommunikation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Den seneste interaktion med HCO fandt sted den 29. oktober 2025. Mødet fokuserede på "Ozempic" og 
                    "Wegovy", hvor der ikke blev rejst nogen nye indvendinger vedrørende igangsætning af "Ozempic" 
                    patienter. Der blev også diskuteret produkt og GLP-1 og type 2 diabetes. Der er ingen nye aktiviteter 
                    eller bevægelser rapporteret.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Digitalt engagement</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    2 ud af 2 HCPer har givet markedsføringssamtykke.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Louise har vist betydeligt digitalt engagement. Hun har haft flere digitale interaktioner inden for de 
                    seneste seks måneder herunder åbning af nyhedsbrev om tættere diabetes overvagtsobehandling og tilsvarende 
                    ressourcer. Disse interaktioner indikerer hendes interesse i vores tilbud og ressourcer.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    Mogens har ikke haft nogen digitale interaktioner inden for de seneste seks måneder.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">HCP Indsigt</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    Fokus på GLP1 og Overvægt
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Fokus på GLP1 og Overvægt</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Både Louise og Mogens viser interesse for GLP1 og overvægt, med gentagne møder og diskussioner om 
                    Ozempic og Wegovy. Der er ingen nye indvendinger blevet rapporteret.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Produktbrug og Adoption Ladder</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Begge HCPer er "Regular Users" af Ozempic og Rybelsus, mens Wegovy er på "Triallis" stadiet. Dette 
                    indikerer en stabil brug af disse produkter og en mulig fremtidig adoption af Wegovy.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Planlagte Møder og Emner</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Der er planlagt fremtidige møder med fokus på diabetes og overvægt. Louise har et møde den 18. november 
                    2025, mens Mogens har et møde den 25. marts 2026. Disse møder vil fortsætte diskussionen om relevante 
                    produkter og behandlingsmetoder.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Employees Section */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Medarbejdere</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NAVN</TableHead>
                    <TableHead>TITEL</TableHead>
                    <TableHead>MARKETING CONSENT</TableHead>
                    <TableHead>ACCESS LEVEL</TableHead>
                    <TableHead>SIDSTE MØDE</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Louise Gidling</TableCell>
                    <TableCell>Nurse</TableCell>
                    <TableCell>
                      <span className="text-green-600 flex items-center gap-1">
                        <Check className="h-4 w-4" /> Ja
                      </span>
                    </TableCell>
                    <TableCell>
                      <Check className="h-4 w-4 text-green-600" />
                    </TableCell>
                    <TableCell>29/10/2025</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Mogens Nørgaard Christiansen</TableCell>
                    <TableCell>Physician</TableCell>
                    <TableCell>
                      <span className="text-green-600 flex items-center gap-1">
                        <Check className="h-4 w-4" /> Ja
                      </span>
                    </TableCell>
                    <TableCell>
                      <Check className="h-4 w-4 text-green-600" />
                    </TableCell>
                    <TableCell>08/09/2025</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="mt-4 text-center">
                <Button variant="link" size="sm">
                  Show more →
                </Button>
              </div>
            </div>
          </Card>

          {/* Meetings Section */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Møder</h2>
              <div className="bg-muted/50 border border-border p-5 rounded-lg">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground mb-1">Onsdag 25. mar., 12:15 - 12:45</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>Rønnebær Allé 110 H, Helsingør, DK, 3000</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>Mogens Nørgaard Christiansen</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background border border-border p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-sm mb-3">Noter</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-medium">Info:</span> 18/8-25 tbn aftalt med Louise frok 3 Materiale: Diabetes/Obesity Regular GP Placeholder Booking/seneste nyt Kilde: Alarm
                  </p>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button variant="outline" size="sm">
                    Træningsscenarie
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Rutevejledning
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Omplanlæg
                  </Button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border text-center">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    + 2 møder planlagt
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Past Interactions Section */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Tidligere interaktioner</h2>
              
              <div className="flex gap-2 mb-4">
                <Button variant="default" size="sm">Alle</Button>
                <Button variant="outline" size="sm">Møde</Button>
                <Button variant="outline" size="sm">Filtrer efter interaktionstype</Button>
              </div>

              {interactions.length > 0 ? (
                <div className="space-y-2">
                  {interactions.map((interaction) => (
                    <Collapsible key={interaction.id}>
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center gap-4 p-3 hover:bg-accent rounded-lg transition-colors">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium">
                              {new Date(interaction.interaction_date).toLocaleDateString("da-DK")} - {interaction.interaction_type}
                            </div>
                            <div className="text-xs text-muted-foreground">{interaction.title}</div>
                          </div>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 py-3">
                        <Separator className="mb-3" />
                        {interaction.notes && (
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {interaction.notes}
                          </p>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">Ingen tidligere interaktioner registreret</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
