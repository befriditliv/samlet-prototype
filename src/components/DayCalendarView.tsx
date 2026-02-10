import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, User, MapPin, MessageCircle, ChevronUp, Lightbulb, Calendar, AlertCircle, Loader2, CheckCircle2, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format, addDays, startOfWeek, addWeeks, getWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import { WebDebriefDialog } from "./WebDebriefDialog";
import { openAskJarvis } from "./AskJarvis";

type MeetingStatus = "next-call" | "needs-debrief" | "upcoming" | "debrief-processing" | "debrief-ready" | "done";

interface Meeting {
  id: string;
  doctorName: string;
  specialty: string;
  location: string;
  startTime: string;
  duration: string;
  status: MeetingStatus;
  expandable?: boolean;
  recommendations?: string[];
  metrics?: {
    accessLevel: string;
    consentStatus: string;
    segmentation: string;
    daysSinceEngagement: number;
  };
}

interface DayCalendarViewProps {
  onDebriefReview?: (meetingId: string) => void;
  completedMeetings?: string[];
}

const mockMeetings: Meeting[] = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    location: "Metro Medical Center",
    startTime: "9:00 AM",
    duration: "45 min",
    status: "next-call",
    expandable: true,
    recommendations: [
      "Present new study data on cardiovascular outcomes",
      "Address patient adherence strategies and concerns",
      "Discuss formulary status updates and access"
    ],
    metrics: {
      accessLevel: "High",
      consentStatus: "OPT IN",
      segmentation: "At risk",
      daysSinceEngagement: 34
    }
  },
  {
    id: "2",
    doctorName: "Dr. Michael Chen",
    specialty: "Oncology",
    location: "City General Hospital",
    startTime: "11:30 AM",
    duration: "30 min",
    status: "needs-debrief"
  },
  {
    id: "3",
    doctorName: "Dr. Emily Rodriguez",
    specialty: "Endocrinology",
    location: "University Health System",
    startTime: "2:00 PM",
    duration: "60 min",
    status: "upcoming"
  }
];

export const DayCalendarView = ({ onDebriefReview, completedMeetings = [] }: DayCalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 10, 24)); // Nov 24, 2024
  const [expandedMeetings, setExpandedMeetings] = useState<string[]>([]);
  const [outstandingDialogOpen, setOutstandingDialogOpen] = useState(false);
  const [debriefDialogOpen, setDebriefDialogOpen] = useState(false);
  const [selectedMeetingForDebrief, setSelectedMeetingForDebrief] = useState<Meeting | null>(null);
  const [meetingStatuses, setMeetingStatuses] = useState<Record<string, MeetingStatus>>({});
  
  // Days with missing debriefs (for demo purposes)
  const daysWithMissingDebriefs = [
    new Date(2024, 10, 24), // Nov 24
    new Date(2024, 10, 27), // Nov 27
    new Date(2024, 10, 29), // Nov 29
  ];
  
  const hasMissingDebrief = (date: Date) => {
    return daysWithMissingDebriefs.some(d => 
      d.getDate() === date.getDate() && 
      d.getMonth() === date.getMonth()
    );
  };
  
  const goToNextDebriefDay = () => {
    const nextDay = daysWithMissingDebriefs.find(d => d > selectedDate);
    if (nextDay) setSelectedDate(nextDay);
  };
  
  const goToPrevDebriefDay = () => {
    const prevDay = [...daysWithMissingDebriefs].reverse().find(d => d < selectedDate);
    if (prevDay) setSelectedDate(prevDay);
  };
  
  const hasNextDebriefDay = daysWithMissingDebriefs.some(d => d > selectedDate);
  const hasPrevDebriefDay = daysWithMissingDebriefs.some(d => d < selectedDate);
  
  // Generate Monday to Friday for the current week
  const generateWeekDates = () => {
    const mondayOfWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const dates = [];
    for (let i = 0; i < 5; i++) { // Monday to Friday
      dates.push(addDays(mondayOfWeek, i));
    }
    return dates;
  };

  const weekDates = generateWeekDates();
  const weekNumber = getWeek(selectedDate, { weekStartsOn: 1, firstWeekContainsDate: 4 });
  
  // Check if current week has any missing debriefs
  const weekHasMissingDebriefs = weekDates.some(date => hasMissingDebrief(date));
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedDate(addWeeks(selectedDate, direction === 'prev' ? -1 : 1));
  };
  
  // Get effective status for a meeting (considering local overrides and completed meetings from parent)
  const getMeetingStatus = (meeting: Meeting): MeetingStatus => {
    // Check if meeting was completed via parent (IOengage submission)
    if (completedMeetings.includes(meeting.id)) {
      return "done";
    }
    return meetingStatuses[meeting.id] || meeting.status;
  };

  const meetingsCount = mockMeetings.length;
  const missingDebriefCount = mockMeetings.filter(m => getMeetingStatus(m) === "needs-debrief").length;
  const outstandingDebriefs = mockMeetings.filter(m => getMeetingStatus(m) === "needs-debrief");

  const openDebriefDialog = (meeting: Meeting) => {
    setSelectedMeetingForDebrief(meeting);
    setDebriefDialogOpen(true);
  };

  const handleDebriefSave = () => {
    if (selectedMeetingForDebrief) {
      // Set to processing first
      setMeetingStatuses(prev => ({
        ...prev,
        [selectedMeetingForDebrief.id]: "debrief-processing"
      }));
      
      // After 3 seconds, set to ready for review
      setTimeout(() => {
        setMeetingStatuses(prev => ({
          ...prev,
          [selectedMeetingForDebrief.id]: "debrief-ready"
        }));
      }, 3000);
    }
  };

  const toggleMeeting = (meetingId: string) => {
    setExpandedMeetings(prev => 
      prev.includes(meetingId) 
        ? prev.filter(id => id !== meetingId)
        : [...prev, meetingId]
    );
  };

  const getStatusButton = (status: MeetingStatus) => {
    const pillStyle = "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:hover:bg-blue-900/50 border-0";
    
    switch (status) {
      case "next-call":
        return (
          <div className="flex items-center gap-2">
            <Badge className={pillStyle}>
              Next Call
            </Badge>
            <Badge className={`${pillStyle} cursor-pointer`}>
              <Navigation className="h-3 w-3 mr-1" />
              Direction
            </Badge>
          </div>
        );
      case "needs-debrief":
        return (
          <Badge variant="destructive">
            Needs Debrief
          </Badge>
        );
      case "debrief-processing":
        return (
          <Badge className="bg-primary/10 text-primary border border-primary/20">
            <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
            Processing...
          </Badge>
        );
      case "debrief-ready":
        return (
          <Badge className="bg-primary/5 text-primary border border-primary/20">
            <CheckCircle2 className="h-3 w-3 mr-1.5" />
            Ready for review
          </Badge>
        );
      case "done":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
            Completed
          </Badge>
        );
      case "upcoming":
        return (
          <div className="flex items-center gap-2">
            <Badge className={pillStyle}>
              Upcoming
            </Badge>
            <Badge className={pillStyle}>
              Next Call
            </Badge>
            <Badge className={`${pillStyle} cursor-pointer`}>
              <Navigation className="h-3 w-3 mr-1" />
              Direction
            </Badge>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Day Header with Calendar Popover */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedDate(addDays(selectedDate, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="gap-2 text-base font-semibold px-2">
                  <span className="capitalize">{format(selectedDate, 'EEEE, d MMMM', { locale: enUS })}</span>
                </Button>
              </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Week {weekNumber}</span>
                    {weekHasMissingDebriefs && (
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateWeek('prev')}
                      className="h-7 w-7"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateWeek('next')}
                      className="h-7 w-7"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  {weekDates.map((date, idx) => {
                    const isSelected = date.getDate() === selectedDate.getDate() && 
                                     date.getMonth() === selectedDate.getMonth();
                    const hasMissing = hasMissingDebrief(date);
                    const dayName = format(date, 'EEE', { locale: enUS }).toLowerCase();
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDate(date)}
                        className="flex-shrink-0"
                      >
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground/60 mb-1.5 capitalize">
                            {dayName.substring(0, 3)}.
                          </div>
                          <div 
                            className={`
                              h-9 w-9 rounded-lg flex items-center justify-center text-sm font-medium
                              transition-all duration-200 relative
                              ${isSelected 
                                ? 'bg-foreground text-background' 
                                : hasMissing
                                  ? 'text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                              }
                            `}
                          >
                            {date.getDate()}
                            {hasMissing && (
                              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{meetingsCount} meetings</span>
            {missingDebriefCount > 0 && (
              <>
                <span className="text-destructive/80">
                  {missingDebriefCount} need debrief
                </span>
                <Dialog open={outstandingDialogOpen} onOpenChange={setOutstandingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-destructive/80 hover:text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      View all
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Outstanding Debriefs ({missingDebriefCount})</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      {outstandingDebriefs.map((meeting) => (
                        <Card key={meeting.id} className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold mb-1">{meeting.doctorName}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{meeting.specialty}</p>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {meeting.location}
                                </span>
                                <span>{meeting.startTime} • {meeting.duration}</span>
                              </div>
                            </div>
                            <Button 
                              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                              onClick={() => {
                                setOutstandingDialogOpen(false);
                                openDebriefDialog(meeting);
                              }}
                            >
                              Debrief
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
        
        {/* Quick Navigation to Missing Debriefs */}
        {(hasPrevDebriefDay || hasNextDebriefDay) && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevDebriefDay}
              disabled={!hasPrevDebriefDay}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextDebriefDay}
              disabled={!hasNextDebriefDay}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Meetings List */}
      <div className="space-y-6">
        {mockMeetings.map((meeting) => {
          const isExpanded = expandedMeetings.includes(meeting.id);
          
          return (
            <Card key={meeting.id} className="overflow-hidden">
              {/* Meeting Header */}
              <div className="p-6">
                <div className="flex items-start gap-6">
                  {/* Time */}
                  <div className="text-center min-w-[80px]">
                    <div className="text-muted-foreground">{meeting.startTime}</div>
                    <div className="text-muted-foreground">{meeting.duration}</div>
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{meeting.doctorName}</h3>
                    <p className="text-muted-foreground">{meeting.specialty}</p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{meeting.location}</span>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3">
                    {getStatusButton(getMeetingStatus(meeting))}
                    
                    {getMeetingStatus(meeting) === "needs-debrief" && (
                      <Button 
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        onClick={() => openDebriefDialog(meeting)}
                      >
                        Debrief
                      </Button>
                    )}

                    {getMeetingStatus(meeting) === "debrief-ready" && onDebriefReview && (
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={() => onDebriefReview(meeting.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        Review
                      </Button>
                    )}
                    
                    {meeting.status === "upcoming" && (
                      <Button variant="ghost" size="icon" onClick={openAskJarvis}>
                        <MessageCircle className="h-5 w-5" />
                      </Button>
                    )}
                    
                    {meeting.expandable && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleMeeting(meeting.id)}
                      >
                        <ChevronUp className={`h-5 w-5 transition-transform ${isExpanded ? '' : 'rotate-180'}`} />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Content */}
              {meeting.expandable && isExpanded && (
                <div className="border-t bg-accent/20 p-6 space-y-6">
                  {/* Jarvis Recommendations */}
                  {meeting.recommendations && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold">Jarvis Recommended Actions</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Personalized recommendations for your upcoming call
                      </p>
                      <ul className="space-y-3">
                        {meeting.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-2" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Metrics Grid */}
                  {meeting.metrics && (
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Access Level</div>
                        <div className="font-semibold">{meeting.metrics.accessLevel}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Consent Status</div>
                        <div className="font-semibold text-blue-600 dark:text-blue-400">
                          {meeting.metrics.consentStatus}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Segmentation</div>
                        <div className="font-semibold text-amber-600 dark:text-amber-400">
                          {meeting.metrics.segmentation}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Days since Engagement</div>
                        <div className="font-semibold text-blue-600 dark:text-blue-400">
                          {meeting.metrics.daysSinceEngagement}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Debrief Dialog */}
      {selectedMeetingForDebrief && (
        <WebDebriefDialog
          open={debriefDialogOpen}
          onOpenChange={setDebriefDialogOpen}
          meeting={{
            id: selectedMeetingForDebrief.id,
            doctorName: selectedMeetingForDebrief.doctorName,
            specialty: selectedMeetingForDebrief.specialty,
            location: selectedMeetingForDebrief.location,
            startTime: selectedMeetingForDebrief.startTime
          }}
          onSave={handleDebriefSave}
        />
      )}
    </div>
  );
};