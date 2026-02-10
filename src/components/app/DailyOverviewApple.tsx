// Daily Overview Component - Mobile-first design
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, MessageCircle, Calendar, Bell, ChevronDown, ChevronUp, Phone, Loader2, CheckCircle2, CheckCircle, WifiOff, AlertCircle, RotateCcw, MapPin, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import jarvisLogo from "@/assets/jarvis-logo.svg";
import { TaskCenter } from "./TaskCenter";
import { HCPAssistant } from "./HCPAssistant";
import { SyncStatus } from "./SyncStatus";
import { CanvasTargets } from "./CanvasTargets";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, subDays } from "date-fns";
import { enUS } from "date-fns/locale";

type MeetingStatus = "upcoming" | "in-progress" | "debrief-needed" | "debrief-submitting" | "debrief-processing" | "debrief-ready" | "debrief-failed" | "done";

interface DailyOverviewProps {
  onPrepare: (id: string) => void;
  onDebrief: (id: string) => void;
  onDebriefReview: (id: string) => void;
  onVoiceNote: () => void;
  onAskAI: () => void;
  onReports: () => void;
  onNewAction: () => void;
  onIntelligence: () => void;
  meetingStatuses?: Record<string, MeetingStatus>;
}

interface Participant {
  name: string;
  specialty: string;
}

interface Meeting {
  id: string;
  time: string;
  duration: string;
  hcpName: string;
  specialty: string;
  location: string;
  address?: string;
  phone?: string;
  status: "upcoming" | "in-progress" | "debrief-needed" | "debrief-submitting" | "debrief-processing" | "debrief-ready" | "debrief-failed" | "done";
  participants?: Participant[];
}

const mockMeetings: Meeting[] = [
  {
    id: "1",
    time: "9:00",
    duration: "45 min",
    hcpName: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    location: "Metro Medical Center",
    address: "1234 Healthcare Blvd, Suite 200",
    phone: "+45 12 34 56 78",
    status: "debrief-ready"
  },
  {
    id: "2",
    time: "11:30",
    duration: "30 min",
    hcpName: "Dr. Michael Chen",
    specialty: "Oncology",
    location: "City General Hospital",
    status: "debrief-failed"
  },
  {
    id: "3",
    time: "14:00",
    duration: "60 min",
    hcpName: "Dr. Emily Rodriguez",
    specialty: "Endocrinology",
    location: "University Health System",
    status: "upcoming",
    participants: [
      { name: "Dr. Emily Rodriguez", specialty: "Endocrinology" },
      { name: "Dr. Thomas Baker", specialty: "Diabetology" },
      { name: "Nurse Patricia Hall", specialty: "Diabetes Care" }
    ]
  },
  {
    id: "4",
    time: "16:30",
    duration: "30 min",
    hcpName: "Dr. James Wilson",
    specialty: "Neurology",
    location: "Central Neuroscience Clinic",
    address: "890 Brain Way, Suite 500",
    phone: "+45 87 65 43 21",
    status: "upcoming"
  },
  {
    id: "5",
    time: "08:00",
    duration: "30 min",
    hcpName: "Dr. Amanda Peters",
    specialty: "Rheumatology",
    location: "Wellness Medical Group",
    status: "done"
  }
];

interface ImportantPoint {
  title: string;
  description: string;
}

interface HCPData {
  id: string;
  name: string;
  accessLevel: "High" | "Medium" | "Low";
  consentStatus: "OPT IN" | "OPT OUT" | "Blank";
  segmentationStatus: "At risk" | "Stable" | "Growing";
  daysSinceLastInteraction: number;
  importantPoints: ImportantPoint[];
}

const mockHCPData: Record<string, HCPData> = {
  "Dr. Sarah Johnson": {
    id: "1",
    name: "Dr. Sarah Johnson",
    accessLevel: "High",
    consentStatus: "OPT IN",
    segmentationStatus: "At risk",
    daysSinceLastInteraction: 34,
    importantPoints: [
      {
        title: "Review Wegovy administration",
        description: "Discuss any updates to dosing or workflow relevant to cardiology practice since last meeting."
      },
      {
        title: "Explore clinical content preferences",
        description: "Ask about HCP's interest in receiving future clinical updates or educational materials digitally."
      },
      {
        title: "Clarify patient support needs",
        description: "Explore what resources could help improve patient adherence and outcomes with Wegovy."
      }
    ]
  },
  "Dr. Emily Rodriguez": {
    id: "3",
    name: "Dr. Emily Rodriguez",
    accessLevel: "High",
    consentStatus: "OPT IN",
    segmentationStatus: "Growing",
    daysSinceLastInteraction: 14,
    importantPoints: [
      { title: "Multidisciplinary approach", description: "Discuss benefits of cross-functional collaboration for better patient outcomes." },
      { title: "Diabetes protocols", description: "Review the latest guidelines for diabetes treatment and Wegovy integration." }
    ]
  },
  "Dr. Michael Chen": {
    id: "2",
    name: "Dr. Michael Chen",
    accessLevel: "Medium",
    consentStatus: "OPT IN",
    segmentationStatus: "Stable",
    daysSinceLastInteraction: 21,
    importantPoints: [
      { title: "Oncology collaboration", description: "Explore opportunities for collaboration on patients with cancer and metabolic conditions." },
      { title: "Clinical data", description: "Share the latest clinical results and evidence for Wegovy in oncology context." }
    ]
  },
  "Dr. James Wilson": {
    id: "4",
    name: "Dr. James Wilson",
    accessLevel: "Low",
    consentStatus: "Blank",
    segmentationStatus: "At risk",
    daysSinceLastInteraction: 62,
    importantPoints: [
      { title: "First contact", description: "Introduce Novo Nordisk's product portfolio and explore interest in future collaboration." },
      { title: "Neurological angle", description: "Discuss potential benefits of Wegovy for neurological patients with obesity." }
    ]
  },
  "Dr. Amanda Peters": {
    id: "5",
    name: "Dr. Amanda Peters",
    accessLevel: "Medium",
    consentStatus: "OPT IN",
    segmentationStatus: "Stable",
    daysSinceLastInteraction: 7,
    importantPoints: [
      { title: "Rheumatology follow-up", description: "Follow up on previous conversation about Wegovy and joint issues." }
    ]
  }
};

export const DailyOverviewApple = ({
  onPrepare,
  onDebrief,
  onDebriefReview,
  onVoiceNote,
  onAskAI,
  meetingStatuses = {},
}: DailyOverviewProps) => {
  const [baseMeetings] = useState<Meeting[]>(mockMeetings);
  const [isTaskCenterOpen, setIsTaskCenterOpen] = useState(false);
  const [hcpAssistantOpen, setHcpAssistantOpen] = useState(false);
  const [selectedHCP, setSelectedHCP] = useState<string>("");
  const [showBriefing, setShowBriefing] = useState(false);
  const [showCompletedMeetings, setShowCompletedMeetings] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Apply status overrides from parent
  const meetings = baseMeetings.map(m => ({
    ...m,
    status: meetingStatuses[m.id] || m.status
  }));

  // Split meetings into active and completed
  const activeMeetings = meetings.filter(m => m.status !== "done");
  const completedMeetings = meetings.filter(m => m.status === "done");

  // Find next upcoming meeting to auto-expand
  const nextUpcomingId = activeMeetings.find(m => m.status === "upcoming")?.id || activeMeetings[0]?.id || null;
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>(nextUpcomingId);

  // Refs for selection indicator
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0, opacity: 0 });

  // Update indicator position when expanded card changes
  useEffect(() => {
    const updateIndicator = () => {
      if (!containerRef.current) return;

      // Use expanded card, or fall back to next upcoming meeting
      const targetId = expandedMeetingId || nextUpcomingId;
      if (!targetId) {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
        return;
      }

      const cardEl = cardRefs.current.get(targetId);
      if (!cardEl) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();

      setIndicatorStyle({
        top: cardRect.top - containerRect.top,
        height: cardRect.height,
        opacity: 1
      });
    };

    // Update immediately and after a short delay (for expand animation)
    updateIndicator();
    const timeout = setTimeout(updateIndicator, 350);

    // Also update on scroll and resize
    window.addEventListener('scroll', updateIndicator, { passive: true });
    window.addEventListener('resize', updateIndicator);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', updateIndicator);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [expandedMeetingId]);

  const displayDate = format(selectedDate, "EEEE, MMMM d", { locale: enUS });

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const pendingDebriefCount = meetings.filter(m => m.status === "debrief-needed" || m.status === "debrief-failed").length;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const scrollToFirstPending = () => {
    const firstPending = activeMeetings.find(m => m.status === "debrief-needed" || m.status === "debrief-failed");
    if (firstPending) {
      document.getElementById(`meeting-${firstPending.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const toggleExpand = (meetingId: string) => {
    setExpandedMeetingId(prev => prev === meetingId ? null : meetingId);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header - Super clean */}
      <div className="px-5 pt-6 pb-4 bg-gradient-to-b from-primary/[0.03] to-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={jarvisLogo} alt="Jarvis" className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">{greeting()}</h1>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    {displayDate}
                    <ChevronDown className="h-3 w-3 opacity-40" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="start" sideOffset={8}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedDate(d => subDays(d, 1))}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">{format(selectedDate, "MMM d, yyyy")}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedDate(d => addDays(d, 1))}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-1.5 justify-center">
                      {Array.from({ length: 7 }, (_, i) => {
                        const day = addDays(selectedDate, i - 3);
                        const isSelected = day.toDateString() === selectedDate.toDateString();
                        const isTodayDot = day.toDateString() === new Date().toDateString();
                        return (
                          <button
                            key={i}
                            onClick={() => { setSelectedDate(day); setDatePickerOpen(false); }}
                            className="flex flex-col items-center gap-1"
                          >
                            <span className="text-[10px] text-muted-foreground">{format(day, "EEE")}</span>
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                              isSelected
                                ? "bg-foreground text-background"
                                : "text-muted-foreground hover:bg-accent"
                            }`}>
                              {day.getDate()}
                            </span>
                            {isTodayDot && !isSelected && (
                              <div className="w-1 h-1 rounded-full bg-primary" />
                            )}
                            {!isTodayDot && <div className="w-1 h-1" />}
                          </button>
                        );
                      })}
                    </div>
                    {!isToday && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs text-primary"
                        onClick={() => { setSelectedDate(new Date()); setDatePickerOpen(false); }}
                      >
                        Back to today
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <SyncStatus />
        </div>
      </div>

      {/* Stats bar */}
      <div className="px-4 pb-3 flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">{meetings.length} meetings</span>
        </div>
        {pendingDebriefCount > 0 && (
          <button
            onClick={scrollToFirstPending}
            className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 rounded-full active:scale-95 transition-transform"
          >
            <Bell className="h-3.5 w-3.5 text-destructive" />
            <span className="text-xs font-medium text-destructive">{pendingDebriefCount} need debrief</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Today's schedule</h2>

          {/* Timeline container */}
          <div className="relative" ref={containerRef}>
            {/* Selection indicator - floating blue bar */}
            <div
              className="absolute left-0 w-1 bg-primary rounded-full transition-all duration-300 ease-out z-10"
              style={{
                top: indicatorStyle.top,
                height: indicatorStyle.height,
                opacity: indicatorStyle.opacity,
                transform: 'translateZ(0)' // GPU acceleration
              }}
            />

            {/* Meetings */}
            <div className="space-y-3 pl-3">
          {activeMeetings.map((meeting) => {
            const isNextUpcoming = meeting.id === nextUpcomingId;
            const hcpData = mockHCPData[meeting.hcpName];
            const isExpanded = expandedMeetingId === meeting.id;

            return (
              <div
                key={meeting.id}
                id={`meeting-${meeting.id}`}
                ref={(el) => {
                  if (el) cardRefs.current.set(meeting.id, el);
                  else cardRefs.current.delete(meeting.id);
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleExpand(meeting.id)}
                  className={`w-full text-left p-4 border rounded-2xl transition-all duration-300 bg-card active:scale-[0.99] ${
                    isNextUpcoming ? "border-primary/30 bg-primary/5 ring-1 ring-primary/10" : "border-border/50"
                  }`}
                >
                  {/* Main content */}
                  <div className="flex items-start gap-3">
                    {/* Time column */}
                    <div className="text-center min-w-[48px]">
                      <div className="font-semibold text-foreground text-sm">{meeting.time}</div>
                      <div className="text-[10px] text-muted-foreground">{meeting.duration}</div>
                    </div>

                    {/* Avatar and info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-shrink-0">
                          <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          {meeting.participants && meeting.participants.length > 1 && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px] font-semibold shadow-sm">
                              +{meeting.participants.length - 1}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground text-sm leading-snug truncate">{meeting.hcpName}</h3>
                          <p className="text-xs text-muted-foreground truncate">{meeting.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status row */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                    <div className="flex items-center gap-2">
                      {meeting.status === "debrief-submitting" && (
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-muted/50 rounded-lg">
                          <WifiOff className="h-3 w-3 text-muted-foreground animate-pulse" />
                          <span className="text-[11px] font-medium text-muted-foreground">Syncing...</span>
                        </div>
                      )}
                      {meeting.status === "debrief-processing" && (
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-primary/10 rounded-lg">
                          <Loader2 className="h-3 w-3 text-primary animate-spin" />
                          <span className="text-[11px] font-medium text-primary">Processing...</span>
                        </div>
                      )}
                      {meeting.status === "debrief-failed" && (
                        <div className="flex items-center gap-2 px-2.5 py-1.5 border border-destructive/30 rounded-full">
                          <AlertCircle className="h-3 w-3 text-destructive" />
                          <span className="text-[11px] font-medium text-destructive">Failed</span>
                        </div>
                      )}
                      {meeting.status === "debrief-needed" && (
                        <span className="text-[11px] font-medium text-destructive">Needs debrief</span>
                      )}
                      {meeting.status === "debrief-ready" && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-medium text-primary">Ready for review</span>
                        </div>
                      )}
                      {meeting.status === "upcoming" && (
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-medium ${isNextUpcoming ? "text-primary" : "text-muted-foreground"}`}>
                            {isNextUpcoming ? "Next meeting" : "Upcoming"}
                          </span>
                          {meeting.address && (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meeting.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-primary bg-muted/50 hover:bg-primary/10 rounded-md transition-colors"
                            >
                              <MapPin className="h-3 w-3" />
                              Directions
                            </a>
                          )}
                          {meeting.phone && (
                            <a
                              href={`tel:${meeting.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-primary bg-muted/50 hover:bg-primary/10 rounded-md transition-colors"
                            >
                              <Phone className="h-3 w-3" />
                              Call
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quick actions */}
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {meeting.status === "debrief-ready" && (
                        <Button
                          onClick={() => onDebriefReview(meeting.id)}
                          size="sm"
                          className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-4 py-1.5 h-8"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                          Review
                        </Button>
                      )}
                      {meeting.status === "debrief-needed" && (
                        <Button
                          onClick={() => onDebrief(meeting.id)}
                          size="sm"
                          className="rounded-xl bg-destructive hover:bg-destructive/90 text-xs font-medium px-3 py-1.5 h-8"
                        >
                          Debrief
                        </Button>
                      )}
                      {meeting.status === "debrief-failed" && (
                        <Button
                          onClick={() => onDebrief(meeting.id)}
                          size="sm"
                          className="rounded-full bg-destructive hover:bg-destructive/90 text-white text-xs font-medium px-4 py-1.5 h-8"
                        >
                          <RotateCcw className="h-3 w-3 mr-1.5" />
                          Redo
                        </Button>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && hcpData && (
                  <div className="mt-2 p-4 bg-card border border-border/50 rounded-xl animate-fade-in">
                    {/* Participants section */}
                    {meeting.participants && meeting.participants.length > 1 && (
                      <div className="mb-4 pb-3 border-b border-border/30">
                        <h3 className="text-xs font-medium text-foreground mb-2 flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-primary" />
                          Participants ({meeting.participants.length})
                        </h3>
                        <div className="space-y-1.5">
                          {meeting.participants.map((participant, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-secondary/20 rounded-lg">
                              <div className="w-7 h-7 bg-primary/10 rounded-md flex items-center justify-center">
                                <User className="w-3.5 h-3.5 text-primary" />
                              </div>
                              <div>
                                <p className="text-xs font-medium text-foreground">{participant.name}</p>
                                <p className="text-[10px] text-muted-foreground">{participant.specialty}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Jarvis Recommendations */}
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-primary" />
                        Jarvis recommended actions
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3">Personalized recommendations for your upcoming conversation</p>
                      <div className="space-y-3">
                        {hcpData.importantPoints.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-foreground leading-relaxed">{point.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick info badges */}
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/30">
                      <span className={`text-[10px] font-medium px-2 py-1 rounded-md ${
                        hcpData.accessLevel === "High" ? "bg-green-100 text-green-700" :
                        hcpData.accessLevel === "Medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {hcpData.accessLevel} access
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-1 rounded-md ${
                        hcpData.consentStatus === "OPT IN" ? "bg-green-100 text-green-700" :
                        hcpData.consentStatus === "OPT OUT" ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {hcpData.consentStatus}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-1 rounded-md bg-muted text-muted-foreground">
                        {hcpData.daysSinceLastInteraction} days since last
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={() => {
                          setSelectedHCP(meeting.hcpName);
                          setShowBriefing(true);
                          setHcpAssistantOpen(true);
                        }}
                        variant="outline"
                        className="flex-1 rounded-xl text-sm font-medium h-10 gap-1.5"
                      >
                        <MessageCircle className="h-4 w-4" />
                        More info
                      </Button>
                      {meeting.status === "debrief-ready" ? (
                        <Button
                          onClick={() => onDebrief(meeting.id)}
                          variant="outline"
                          className="flex-1 rounded-xl text-sm font-medium h-10 text-muted-foreground border-muted-foreground/30"
                        >
                          <RotateCcw className="h-4 w-4 mr-1.5" />
                          Redo Debrief
                        </Button>
                      ) : meeting.status === "debrief-failed" ? (
                        <Button
                          onClick={() => onDebrief(meeting.id)}
                          className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm font-medium h-10"
                        >
                          <RotateCcw className="h-4 w-4 mr-1.5" />
                          Redo
                        </Button>
                      ) : (
                        <Button
                          onClick={() => onDebrief(meeting.id)}
                          className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-sm font-medium h-10"
                        >
                          Debrief
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          </div>
          </div>
          {completedMeetings.length > 0 && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowCompletedMeetings(!showCompletedMeetings)}
                className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-xl text-left active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                    Completed meetings ({completedMeetings.length})
                  </span>
                </div>
                {showCompletedMeetings ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {showCompletedMeetings && (
                <div className="mt-2 space-y-2 animate-fade-in">
                  {completedMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="p-3 border border-border/30 rounded-xl bg-muted/20 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-center min-w-[40px]">
                          <div className="font-medium text-muted-foreground text-xs">{meeting.time}</div>
                        </div>
                        <div>
                          <h3 className="font-medium text-muted-foreground text-sm">{meeting.hcpName}</h3>
                          <p className="text-xs text-muted-foreground/70">{meeting.location}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => onDebrief(meeting.id)}
                        variant="ghost"
                        size="sm"
                        className="rounded-lg text-xs text-muted-foreground h-7 px-2"
                      >
                        Redo
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Canvas Targets Button */}
          <CanvasTargets />
        </div>
      </div>

      {/* Task Center Modal */}
      {isTaskCenterOpen && <TaskCenter onClose={() => setIsTaskCenterOpen(false)} />}

      {/* HCP Assistant Modal */}
      {hcpAssistantOpen && (
        <HCPAssistant
          isOpen={hcpAssistantOpen}
          onClose={() => {
            setHcpAssistantOpen(false);
            setShowBriefing(false);
          }}
          hcpName={selectedHCP}
          showBriefing={showBriefing}
        />
      )}
    </div>
  );
};
