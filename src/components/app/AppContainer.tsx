import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DailyOverviewApple } from "./DailyOverviewApple";
import { PrepPage } from "./PrepPage";
import { DebriefForm } from "./DebriefForm";
import { DebriefReview } from "./DebriefReview";
import { BottomNav } from "./BottomNav";

type AppView = "overview" | "prep" | "debrief" | "debrief-review";

interface DebriefData {
  outcome: number;
  objectivesAchieved: string[];
  keyConcerns: boolean;
  hasInizioFollowUp: boolean;
  materialsShared: boolean;
  voiceNotes: string;
}

export const AppContainer = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<AppView>("overview");
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  const handlePrepare = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setCurrentView("prep");
  };

  const handleDebrief = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setCurrentView("debrief");
  };

  const handleDebriefReview = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setCurrentView("debrief-review");
  };

  const handleApproveDebrief = () => {
    console.log("Debrief approved and sent to IOengage");
    handleBackToOverview();
  };

  const handleStartMeeting = () => {
    if (selectedMeetingId) {
      setCurrentView("debrief");
    }
  };

  const handleBackToOverview = () => {
    setCurrentView("overview");
    setSelectedMeetingId(null);
  };

  const handleSaveDebrief = (data: DebriefData) => {
    console.log("Debrief saved:", data);
    handleBackToOverview();
  };

  // Sub-views without bottom nav
  if (currentView === "prep" && selectedMeetingId) {
    return (
      <PrepPage
        meetingId={selectedMeetingId}
        onBack={handleBackToOverview}
        onStartMeeting={handleStartMeeting}
      />
    );
  }

  if (currentView === "debrief" && selectedMeetingId) {
    return (
      <DebriefForm
        meetingId={selectedMeetingId}
        onBack={handleBackToOverview}
        onSave={handleSaveDebrief}
      />
    );
  }

  if (currentView === "debrief-review" && selectedMeetingId) {
    return (
      <DebriefReview
        meetingId={selectedMeetingId}
        onBack={handleBackToOverview}
        onApprove={handleApproveDebrief}
      />
    );
  }

  // Main overview
  return (
    <>
      <DailyOverviewApple
        onPrepare={handlePrepare}
        onDebrief={handleDebrief}
        onDebriefReview={handleDebriefReview}
        onVoiceNote={() => {}}
        onAskAI={() => navigate("/app/jarvis")}
        onReports={() => {}}
        onNewAction={() => {}}
        onIntelligence={() => {}}
      />
      <BottomNav />
    </>
  );
};
