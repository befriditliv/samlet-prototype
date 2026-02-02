import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Play, FileText, TrendingUp, Globe, History, ChevronDown } from "lucide-react";

interface PrepPageProps {
  meetingId: string;
  onBack: () => void;
  onStartMeeting: () => void;
}

interface PrepSection {
  id: string;
  title: string;
  icon: any;
  items: PrepItem[];
}

interface PrepItem {
  id: string;
  title: string;
  subtitle: string;
}

const prepSections: PrepSection[] = [
  {
    id: "overview",
    title: "Overblik",
    icon: FileText,
    items: [
      {
        id: "1",
        title: "Praksis Profil",
        subtitle: "Metro Medical Center - 450 læger, 12 kardiologer. Dr. Johnson leder hjertesvigtklinikken med 800+ patienter årligt.",
      },
      {
        id: "2",
        title: "Ordinationsmønstre",
        subtitle: "Høj ordination af ACE-hæmmere og betablokkere. Viser præference for evidensbaserede protokoller.",
      },
    ],
  },
  {
    id: "recent",
    title: "Seneste Møder",
    icon: History,
    items: [
      {
        id: "3",
        title: "Q4 Kardiologi Review",
        subtitle: "Diskuterede SGLT2-hæmmer adoption og patientovervågningsprotokoller.",
      },
      {
        id: "4",
        title: "Klinisk Data Diskussion",
        subtitle: "Gennemgik DAPA-HF forsøgsresultater. Positiv modtagelse af real-world evidens.",
      },
    ],
  },
  {
    id: "actions",
    title: "Anbefalede Handlinger",
    icon: TrendingUp,
    items: [
      {
        id: "5",
        title: "Præsenter SGLT2 Kliniske Fordele",
        subtitle: "Fokus på kardiovaskulære outcomes og reducerede hospitalsindlæggelser.",
      },
      {
        id: "6",
        title: "Diskuter Implementeringsstrategi",
        subtitle: "Adresser patientudvælgelseskriterier og overvågningsprotokoller.",
      },
    ],
  },
  {
    id: "digital",
    title: "Digital Engagement",
    icon: Globe,
    items: [
      {
        id: "7",
        title: "Email Engagement",
        subtitle: "95% åbningsrate på kardiologi nyhedsbreve. Downloadet 8 kliniske studier.",
      },
      {
        id: "8",
        title: "Platform Aktivitet",
        subtitle: "Aktiv bruger af vores kliniske portal med 15 logins dette kvartal.",
      },
    ],
  },
];

export const PrepPage = ({ meetingId, onBack, onStartMeeting }: PrepPageProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b border-border/40 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="rounded-xl p-2 h-10 w-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">Forbered</h1>
                <p className="text-xs text-muted-foreground">Dr. Sarah Johnson</p>
              </div>
            </div>
            <Button
              onClick={onStartMeeting}
              className="rounded-xl px-5 h-10 bg-primary hover:bg-primary/90 text-sm font-semibold"
            >
              Debrief
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Jarvis AI Summary */}
        <Card className="p-4 border-0 bg-primary/5 rounded-xl">
          <h3 className="font-semibold text-primary text-sm mb-2">Jarvis AI Opsummering</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Dr. Johnson har vist stærk interesse i patient-adherence løsninger.</p>
            <p>• Metro Medical Center har for nylig opdateret deres lægemiddelliste.</p>
            <p>• Overvej at nævne CARDIAC-ADVANCE forsøgsresultaterne.</p>
          </div>
        </Card>

        {/* Audio Player */}
        <Card className="p-4 border-0 bg-card rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Play className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Lyt til briefing</h3>
                <p className="text-xs text-muted-foreground">3 min audio opsummering</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`rounded-xl h-10 px-4 ${isPlaying ? "bg-primary text-primary-foreground border-primary" : ""}`}
            >
              {isPlaying ? "Pause" : "Afspil"}
            </Button>
          </div>
          {isPlaying && (
            <div className="mt-3 h-1 bg-primary/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-1/3 animate-pulse" />
            </div>
          )}
        </Card>

        {/* Expandable Sections */}
        <div className="space-y-2">
          {prepSections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;

            return (
              <Card key={section.id} className="border-0 bg-card rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  className="w-full p-4 flex items-center justify-between text-left active:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{section.title}</h3>
                      <p className="text-xs text-muted-foreground">{section.items.length} punkter</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 animate-fade-in">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-muted/30 rounded-lg border border-border/30"
                      >
                        <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.subtitle}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
