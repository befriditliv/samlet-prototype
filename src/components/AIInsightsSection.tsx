import { Sparkles, MessageSquare, Globe, Users, Calendar, TrendingUp, Compass, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getCompassMovement, getCompassGuidance, getCompassPrediction, trendLabel } from "@/data/customerCompass";
import jarvisLogo from "@/assets/jarvis-logo.svg";

interface AIInsightsSectionProps {
  entityType: 'hco' | 'hcp';
  entityName: string;
}

// Dummy insights data - in production this would come from AI generation
const generateHcoInsights = (name: string) => ({
  summary: `${name} is a healthcare organization treating acute and recurrent appendicitis. The latest meeting was on January 26, 2026 regarding Dose 1 and the non-surgical care pathway. 2 out of 3 HCPs have given consent, with the lead surgical nurse being the most digitally active. No scheduled meetings, but future conversations could focus on Dose 1 eligibility criteria and after-hours protocols. 51.6% of uncomplicated appendicitis cases in the region are now managed non-surgically.`,
  introduction: `${name} is a clinical practice managing acute abdominal presentations, with appendicitis as a core caseload. The latest communication included a meeting on January 26, 2026 about Dose 1 and how it fits alongside laparoscopic appendectomy. Digital engagement shows 2 out of 3 HCPs have given marketing consent. HCPs have shown interest in non-surgical resolution and recurrence rates, and there are no scheduled meetings, but future conversations could focus on Dose 1 patient selection. In the region, 51.6% of uncomplicated cases are treated non-surgically, on par with the regional average.`,
  latestCommunication: `The most recent interaction took place on January 26, 2026, where a meeting was held focusing on Dose 1. Discussions have over time covered updated acute abdomen guidelines, imaging confirmation before Dose 1 initiation, and how to counsel patients who expect surgery. Emphasis has been placed on 12-month recurrence data from the ATLAS trial and on reducing theatre time during weekend admissions. Future goals include following up on surgeon feedback and preparing a case-based experience meeting.`,
  digitalEngagement: `2 out of 3 HCPs have given marketing consent. The lead acute-care physician has been the most active, with several interactions via our web portal, including pages and videos on "Dose 1 Patient Selection" and "Non-Surgical Appendicitis Masterclass". On September 10, 2025, they viewed the ATLAS 12-month recurrence webinar. On August 11, 2025, they visited pages about the emergency department protocol pack. The third HCP has been the least active, with no digital interactions in the last 6 months.`,
  hcpInsights: [
    {
      title: "Surgical Preference vs. Dose 1",
      content: "Two of three HCPs still default to appendectomy for uncomplicated cases, citing certainty of outcome. Discussions have focused on which patients can safely start Dose 1 and how to escalate if symptoms persist beyond 24 hours."
    },
    {
      title: "Interactions and Consent",
      content: "The acute-care lead has given marketing consent and requests ATLAS subgroup data. The surgical lead has engaged with educational material without consent. The third HCP has consent but low activity."
    },
    {
      title: "Future Meetings and Activities",
      content: "There are no scheduled meetings, but future conversations could focus on the Dose 1 emergency department protocol and recurrence follow-up. The surgical lead should be reminded about the upcoming appendicitis masterclass."
    }
  ],
  regionalStats: `In the region, 51.6% of uncomplicated appendicitis cases are managed non-surgically, on par with the regional average and up from 45.3% over the past quarters. 45.6% of Dose 1 treated patients avoid readmission at 12 months, which is above the regional level and up from 40.9%. Recommend that the organization formalize a written eligibility checklist to improve patient selection and reduce escalation to surgery.`
});

const generateHcpInsights = (name: string) => ({
  summary: `${name} focuses on acute abdominal care and appendicitis management. Recent interactions show growing but cautious interest in Dose 1 as a non-surgical option for uncomplicated cases. Digital engagement has increased by 34% this quarter, with particular interest in ATLAS trial data and eligibility criteria. Next recommended action: follow up on the recurrence questions raised in the last meeting.`,
  introduction: `${name} is a key healthcare professional in acute surgery and emergency medicine. Recent engagement patterns show a clear focus on when Dose 1 can safely replace appendectomy in uncomplicated appendicitis. The HCP has been receptive to clinical data but remains surgically inclined for patients with appendicoliths or delayed presentation. Marketing consent has been obtained, enabling continued digital engagement.`,
  clinicalInterests: [
    {
      title: "Dose 1 Patient Selection",
      content: "Strong interest in defining which uncomplicated appendicitis patients are suitable for Dose 1, particularly around imaging confirmation, symptom duration under 48 hours, and exclusion of perforation."
    },
    {
      title: "Recurrence and Follow-Up",
      content: "Actively reviewing 12-month recurrence data from the ATLAS trial and asking how follow-up should be organised when patients are discharged without surgery."
    },
    {
      title: "Surgical Preference and Team Alignment",
      content: "Notes internal disagreement in the department: several colleagues prefer laparoscopic appendectomy for certainty. Interested in a shared protocol so escalation criteria are unambiguous on night shifts."
    }
  ],
  engagementPattern: `This HCP shows high digital engagement with our content platform. Over the past 6 months, they have viewed 12 clinical articles, attended 3 virtual webinars, and downloaded 5 patient education materials on the non-surgical pathway. Peak engagement occurs mid-week, with preference for video content and interactive case studies. Email open rate is 78%, significantly above average.`,
  recommendations: [
    "Schedule follow-up meeting to discuss new Dose 1 real-world evidence on recurrence",
    "Share the updated Dose 1 initiation and escalation checklist for the emergency department",
    "Invite to the upcoming regional acute abdomen symposium",
    "Provide access to the Dose 1 patient selection decision tool"
  ],
  patientProfile: `Based on interaction history, this HCP manages approximately 200-250 suspected appendicitis presentations annually. The population skews toward adults aged 18-45 presenting via the emergency department, with a meaningful share arriving late in the evening. Estimated 40% of cases are uncomplicated and could be eligible for Dose 1 rather than immediate surgery.`
});

export const AIInsightsSection = ({ entityType, entityName }: AIInsightsSectionProps) => {
  const insights = entityType === 'hco' 
    ? generateHcoInsights(entityName) 
    : generateHcpInsights(entityName);

  const compass = entityType === 'hcp' ? getCompassMovement(entityName) : null;
  const compassGuidance = compass ? getCompassGuidance(compass) : null;
  const compassPrediction = compass ? getCompassPrediction(entityName, compass.to) : null;
  const compassTone =
    compass?.trend === "positive"
      ? "border-success/20 bg-success/5"
      : compass?.trend === "negative"
        ? "border-destructive/20 bg-destructive/5"
        : "border-border bg-muted/30";

  return (
    <Card className="p-6 bg-gradient-to-br from-card via-card to-primary/5 border-primary/10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <img src={jarvisLogo} alt="Jarvis AI" className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            Jarvis Insights
            <Sparkles className="h-4 w-4 text-primary" />
          </h3>
          <p className="text-xs text-muted-foreground">AI-generated analysis based on interaction history</p>
        </div>
      </div>

      {/* Summary Badge */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 mb-6">
        <p className="text-sm text-foreground leading-relaxed">
          {insights.summary}
        </p>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-6">
        {/* Introduction */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <h4 className="font-medium text-card-foreground">Introduction</h4>
          </div>
          <p className="text-sm text-muted-foreground pl-8 leading-relaxed">
            {insights.introduction}
          </p>
        </div>

        {/* Customer Compass (HCP only) */}
        {entityType === 'hcp' && compass && compassGuidance && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <Compass className="h-4 w-4 text-primary" />
              </div>
              <h4 className="font-medium text-card-foreground">Customer Compass</h4>
            </div>
            <div className={`ml-8 rounded-xl border p-4 ${compassTone}`}>
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: compass.from.color }} />
                  {compass.from.name}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: compass.to.color }} />
                  {compass.to.name}
                </span>
                <span className="text-xs text-muted-foreground">· {trendLabel(compass.trend)} · {compass.changedAt}</span>
              </div>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">What happened</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{compassGuidance.whatHappened}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">Suggested action</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{compassGuidance.whatToDo}</p>
                </div>
                {compassPrediction && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">Predicted category drop</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Predicted to drop to{" "}
                      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: compassPrediction.category.color }}
                        />
                        {compassPrediction.category.name}
                      </span>{" "}
                      around {compassPrediction.expectedDate} ({compassPrediction.confidence}% confidence).
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {entityType === 'hco' ? (
          <>
            {/* Latest Communication */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-medium text-card-foreground">Latest Communication</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-8 leading-relaxed">
                {(insights as ReturnType<typeof generateHcoInsights>).latestCommunication}
              </p>
            </div>

            {/* Digital Engagement */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-medium text-card-foreground">Digital Engagement</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-8 leading-relaxed">
                {(insights as ReturnType<typeof generateHcoInsights>).digitalEngagement}
              </p>
            </div>

            {/* HCP Insights */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-medium text-card-foreground">HCP Insights</h4>
              </div>
              <div className="pl-8 space-y-4">
                {(insights as ReturnType<typeof generateHcoInsights>).hcpInsights.map((insight, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/30 border">
                    <h5 className="font-medium text-sm text-card-foreground mb-1">{insight.title}</h5>
                    <p className="text-sm text-muted-foreground">{insight.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Stats */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-medium text-card-foreground">Regional Appendicitis Statistics</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-8 leading-relaxed">
                {(insights as ReturnType<typeof generateHcoInsights>).regionalStats}
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Clinical Interests */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-medium text-card-foreground">Clinical Interests</h4>
              </div>
              <div className="pl-8 space-y-4">
                {(insights as ReturnType<typeof generateHcpInsights>).clinicalInterests.map((interest, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/30 border">
                    <h5 className="font-medium text-sm text-card-foreground mb-1">{interest.title}</h5>
                    <p className="text-sm text-muted-foreground">{interest.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Pattern */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Globe className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-medium text-card-foreground">Engagement Pattern</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-8 leading-relaxed">
                {(insights as ReturnType<typeof generateHcpInsights>).engagementPattern}
              </p>
            </div>

            {/* Patient Profile */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-medium text-card-foreground">Patient Profile</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-8 leading-relaxed">
                {(insights as ReturnType<typeof generateHcpInsights>).patientProfile}
              </p>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-medium text-card-foreground">Recommended Actions</h4>
              </div>
              <ul className="pl-8 space-y-2">
                {(insights as ReturnType<typeof generateHcpInsights>).recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-primary/10">
        <p className="text-xs text-muted-foreground text-center">
          Generated by Jarvis AI • Last updated: {new Date().toLocaleDateString("en-US")}
        </p>
      </div>
    </Card>
  );
};
