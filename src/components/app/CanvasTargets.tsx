import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, User, Building2, Loader2, X, ChevronRight, Calendar, MessageCircle, Clock, ChevronLeft, Minus, Plus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface CanvasTarget {
  id: string;
  name: string;
  specialty: string;
  organization: string;
  distance: string;
  distanceValue: number;
  address: string;
  lastVisit: string | null;
  priority: "high" | "medium" | "low";
}

const mockCanvasTargets: CanvasTarget[] = [
  {
    id: "ct1",
    name: "Dr. Henrik Larsen",
    specialty: "Endocrinology",
    organization: "Copenhagen Diabetes Center",
    distance: "0.4 km",
    distanceValue: 0.4,
    address: "Nørrebrogade 44, 2200 København",
    lastVisit: "3 weeks ago",
    priority: "high"
  },
  {
    id: "ct2",
    name: "Dr. Mette Andersen",
    specialty: "Cardiology",
    organization: "Heart & Vascular Clinic",
    distance: "0.8 km",
    distanceValue: 0.8,
    address: "Østerbrogade 102, 2100 København",
    lastVisit: null,
    priority: "high"
  },
  {
    id: "ct3",
    name: "Dr. Peter Nielsen",
    specialty: "Internal Medicine",
    organization: "City Medical Practice",
    distance: "1.2 km",
    distanceValue: 1.2,
    address: "Vesterbrogade 56, 1620 København",
    lastVisit: "2 months ago",
    priority: "medium"
  },
  {
    id: "ct4",
    name: "Dr. Anna Christensen",
    specialty: "Nephrology",
    organization: "Kidney Care Center",
    distance: "1.5 km",
    distanceValue: 1.5,
    address: "Amagerbrogade 12, 2300 København",
    lastVisit: "6 weeks ago",
    priority: "medium"
  },
  {
    id: "ct5",
    name: "Dr. Lars Sørensen",
    specialty: "Oncology",
    organization: "National Cancer Institute",
    distance: "1.8 km",
    distanceValue: 1.8,
    address: "Blegdamsvej 9, 2100 København",
    lastVisit: null,
    priority: "low"
  },
  {
    id: "ct6",
    name: "Dr. Sofie Hansen",
    specialty: "Diabetology",
    organization: "Diabetes & Metabolism Clinic",
    distance: "2.1 km",
    distanceValue: 2.1,
    address: "Frederiksborggade 18, 1360 København",
    lastVisit: "1 month ago",
    priority: "high"
  },
  {
    id: "ct7",
    name: "Dr. Thomas Eriksen",
    specialty: "Gastroenterology",
    organization: "GI Health Center",
    distance: "2.4 km",
    distanceValue: 2.4,
    address: "Gammel Kongevej 90, 1850 København",
    lastVisit: "5 weeks ago",
    priority: "medium"
  },
  {
    id: "ct8",
    name: "Dr. Maria Pedersen",
    specialty: "Rheumatology",
    organization: "Joint & Bone Specialists",
    distance: "2.7 km",
    distanceValue: 2.7,
    address: "Strandvejen 34, 2900 Hellerup",
    lastVisit: null,
    priority: "low"
  },
  {
    id: "ct9",
    name: "Dr. Kasper Møller",
    specialty: "Pulmonology",
    organization: "Respiratory Care Clinic",
    distance: "3.0 km",
    distanceValue: 3.0,
    address: "Lyngbyvej 60, 2100 København",
    lastVisit: "3 months ago",
    priority: "medium"
  },
  {
    id: "ct10",
    name: "Dr. Julie Rasmussen",
    specialty: "Endocrinology",
    organization: "Hormone Health Center",
    distance: "3.3 km",
    distanceValue: 3.3,
    address: "Hvidovrevej 22, 2650 Hvidovre",
    lastVisit: "2 weeks ago",
    priority: "high"
  }
];

export const CanvasTargets = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [targets, setTargets] = useState<CanvasTarget[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<CanvasTarget | null>(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number>(0);

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30"
  ];

  const selectedTime = timeSlots[selectedTimeIndex];

  const getClosestTimeSlotIndex = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    // Find the closest future time slot index
    for (let i = 0; i < timeSlots.length; i++) {
      const [hours, minutes] = timeSlots[i].split(":").map(Number);
      const slotMinutes = hours * 60 + minutes;
      if (slotMinutes >= currentMinutes) {
        return i;
      }
    }
    // If current time is past all slots, return last slot index
    return timeSlots.length - 1;
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsLoading(true);
    
    // Simulate loading nearby targets
    setTimeout(() => {
      setTargets(mockCanvasTargets);
      setIsLoading(false);
    }, 1500);
  };

  const handleTargetClick = (target: CanvasTarget) => {
    setSelectedTarget(target);
    setShowActionSheet(true);
  };

  const handleOpenScheduler = () => {
    setShowActionSheet(false);
    setShowScheduler(true);
    setSelectedDate(new Date());
    setSelectedTimeIndex(getClosestTimeSlotIndex());
  };

  const handleConfirmMeeting = () => {
    if (selectedTarget && selectedDate) {
      const formattedDate = format(selectedDate, "EEEE, MMMM d");
      toast({
        title: "Canvas meeting created",
        description: `Meeting with ${selectedTarget.name} scheduled for ${formattedDate} at ${selectedTime}.`,
      });
      setShowScheduler(false);
      setIsOpen(false);
      setSelectedTarget(null);
    }
  };

  const handleAskJarvis = () => {
    if (selectedTarget) {
      // Dispatch global event to open Ask Jarvis
      window.dispatchEvent(new CustomEvent('open-ask-jarvis', {
        detail: { query: `Tell me about ${selectedTarget.name} from ${selectedTarget.organization}` }
      }));
      setShowActionSheet(false);
      setIsOpen(false);
    }
  };

  const getPriorityStyles = (priority: CanvasTarget["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-primary/10 text-primary border-primary/20";
      case "medium":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "low":
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <>
      {/* Canvas Targets Button */}
      <div className="mt-6">
        <Button
          onClick={handleOpen}
          variant="outline"
          className="w-full h-14 rounded-2xl border-dashed border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold text-foreground block">Find Canvas Targets</span>
              <span className="text-xs text-muted-foreground">Discover HCPs near your location</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
        </Button>
      </div>

      {/* Canvas Targets Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl px-0">
          <SheetHeader className="px-5 pb-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Navigation className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <SheetTitle className="text-lg font-semibold text-foreground">Canvas Targets</SheetTitle>
                  <p className="text-xs text-muted-foreground">HCPs near your current location</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Finding nearby HCPs...</p>
                  <p className="text-xs text-muted-foreground mt-1">Searching within 5 km radius</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {targets.length} targets found near you
                  </span>
                </div>

                {targets.map((target, index) => (
                  <button
                    key={target.id}
                    onClick={() => handleTargetClick(target)}
                    className="w-full p-4 bg-card border border-border/50 rounded-2xl text-left hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-[0.99]"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-foreground text-sm truncate">{target.name}</h3>
                            <p className="text-xs text-muted-foreground">{target.specialty}</p>
                          </div>
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-lg flex-shrink-0">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-medium text-muted-foreground">{target.distance}</span>
                          </div>
                        </div>

                        {/* Organization */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground truncate">{target.organization}</span>
                        </div>

                        {/* Bottom row */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30">
                          <span className={`text-[10px] font-medium px-2 py-1 rounded-md border ${getPriorityStyles(target.priority)}`}>
                            {target.priority.charAt(0).toUpperCase() + target.priority.slice(1)} priority
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {target.lastVisit ? `Last visit: ${target.lastVisit}` : "Never visited"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Action Sheet for selected target */}
      <Sheet open={showActionSheet} onOpenChange={setShowActionSheet}>
        <SheetContent side="bottom" className="rounded-t-3xl px-5 pb-8">
          {selectedTarget && (
            <div className="space-y-4">
              {/* Target info header */}
              <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{selectedTarget.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedTarget.specialty} • {selectedTarget.distance}</p>
                </div>
              </div>

              {/* Action options */}
              <div className="space-y-3">
                <button
                  onClick={handleOpenScheduler}
                  className="w-full flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl text-left hover:bg-primary/10 transition-colors active:scale-[0.99]"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Create Canvas Meeting</h4>
                    <p className="text-sm text-muted-foreground">Schedule a meeting with this HCP</p>
                  </div>
                </button>

                <button
                  onClick={handleAskJarvis}
                  className="w-full flex items-center gap-4 p-4 bg-card border border-border/50 rounded-2xl text-left hover:bg-muted/50 transition-colors active:scale-[0.99]"
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Ask Jarvis</h4>
                    <p className="text-sm text-muted-foreground">Get insights about this HCP</p>
                  </div>
                </button>
              </div>

              {/* Cancel button */}
              <Button
                variant="ghost"
                onClick={() => setShowActionSheet(false)}
                className="w-full h-12 rounded-xl text-muted-foreground"
              >
                Cancel
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Meeting Scheduler Sheet */}
      <Sheet open={showScheduler} onOpenChange={setShowScheduler}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl px-0">
          <SheetHeader className="px-5 pb-4 border-b border-border/50">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setShowScheduler(false);
                  setShowActionSheet(true);
                }}
                className="flex items-center gap-1 text-sm text-muted-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <SheetTitle className="text-base font-semibold text-foreground">Schedule Meeting</SheetTitle>
              <div className="w-12" />
            </div>
          </SheetHeader>

          {selectedTarget && (
            <div className="flex-1 overflow-y-auto">
              {/* Target info */}
              <div className="px-5 py-4 bg-muted/30 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{selectedTarget.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedTarget.organization}</p>
                  </div>
                </div>
              </div>

              {/* Date picker */}
              <div className="px-5 py-4 border-b border-border/50">
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Select Date
                </h4>
                <div className="flex justify-center">
                  <CalendarPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className={cn("rounded-xl border border-border/50 pointer-events-auto")}
                  />
                </div>
              </div>

              {/* Time picker - iOS style slider */}
              <div className="px-5 py-4">
                <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Select Time
                </h4>
                
                {/* Large time display */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <button
                    onClick={() => setSelectedTimeIndex(Math.max(0, selectedTimeIndex - 1))}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors active:scale-95"
                    disabled={selectedTimeIndex === 0}
                  >
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <div className="w-28 h-16 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">{selectedTime}</span>
                  </div>
                  <button
                    onClick={() => setSelectedTimeIndex(Math.min(timeSlots.length - 1, selectedTimeIndex + 1))}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors active:scale-95"
                    disabled={selectedTimeIndex === timeSlots.length - 1}
                  >
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Slider */}
                <div className="px-2">
                  <Slider
                    value={[selectedTimeIndex]}
                    onValueChange={(value) => setSelectedTimeIndex(value[0])}
                    max={timeSlots.length - 1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{timeSlots[0]}</span>
                    <span className="text-xs text-muted-foreground">{timeSlots[timeSlots.length - 1]}</span>
                  </div>
                </div>
              </div>

              {/* Confirm button */}
              <div className="px-5 py-4 border-t border-border/50 bg-background sticky bottom-0">
                <Button
                  onClick={handleConfirmMeeting}
                  disabled={!selectedDate}
                  className="w-full h-12 rounded-xl text-base font-semibold"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Confirm Meeting
                  {selectedDate && (
                    <span className="ml-2 text-primary-foreground/80">
                      • {format(selectedDate, "MMM d")} at {selectedTime}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
