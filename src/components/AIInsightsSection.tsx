import { Sparkles, MessageSquare, Globe, Users, Calendar, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import jarvisLogo from "@/assets/jarvis-logo.svg";

interface AIInsightsSectionProps {
  entityType: 'hco' | 'hcp';
  entityName: string;
}

// Dummy insights data - in production this would come from AI generation
const generateHcoInsights = (name: string) => ({
  summary: `${name} is a healthcare organization focusing on type 2 diabetes and obesity treatment. The latest meeting was on January 26, 2026 regarding Ozempic and Tresiba. 2 out of 3 HCPs have given consent, with Helle being the most digitally active. No scheduled meetings, but future conversations could focus on Ozempic and Wegovy. 51.6% of patients in the region receive organ-protective treatment.`,
  introduction: `${name} is a clinical practice that focuses on treating type 2 diabetes and obesity. The latest communication with the organization included a meeting on January 26, 2026 about products such as Ozempic and Tresiba. Digital engagement shows that 2 out of 3 HCPs have given marketing consent, with Helle being the most active. HCPs have shown interest in GLP-1 and obesity, and there are no scheduled meetings, but future conversations could focus on Ozempic and Wegovy. In the region, 51.6% of patients with type 2 diabetes receive organ-protective treatment, which is on par with the regional average.`,
  latestCommunication: `The most recent interaction with the organization took place on January 26, 2026, where a meeting was held focusing on products such as Ozempic and Tresiba. Discussions have over time covered new DES guidelines, combination therapy for type 2 diabetes, and optimization of patient guidance when using Wegovy. Emphasis has been placed on retaining patients in treatment for obesity and introduction of Sundvægt. Future goals include following up on feedback from physicians and preparing an experience meeting about guidelines.`,
  digitalEngagement: `2 out of 3 HCPs have given marketing consent. Helle Bruun has been the most active in terms of digital engagement. She has had several digital interactions via our web portal, including visits to pages and videos related to "Digital Engagement" and "Masterclass". On September 10, 2025, she visited several pages and watched videos related to "Digital Engagement" and "Masterclass". On August 11, 2025, she visited pages about "Masterclass" for nurses in Sønderborg, showing interest in our educational material. Anne Mette Brødbæk has been the least active, as there have been no digital interactions with the HCP within the last 6 months.`,
  hcpInsights: [
    {
      title: "Focus on GLP-1 and Obesity",
      content: "All HCPs have shown interest in GLP-1 and obesity, with Ozempic and Wegovy as central products. Discussions have often focused on intensification of T2D treatment and weight maintenance."
    },
    {
      title: "Interactions and Consent",
      content: "Michael Bruun has given marketing consent, while Helle Bruun has shown interest in educational material without consent. Anne Mette Brødbæk has also given consent and focuses on GLP-1 and obesity."
    },
    {
      title: "Future Meetings and Activities",
      content: "There are no scheduled meetings with the HCPs, but future conversations could focus on Ozempic and Wegovy. Michael Bruun should be reminded about the upcoming masterclass in Silkeborg."
    }
  ],
  diabetesStats: `In the region, 51.6% of patients with type 2 diabetes and cardiovascular disease receive organ-protective treatment with GLP-1 or SGLT-2, which is on par with the regional average. This proportion has increased from 45.3% over the past quarters. The proportion of patients with type 2 diabetes who achieve stable blood sugar control is 45.6%, which is above the regional level and has shown positive development from 40.9%. Recommend that the organization prioritize improved treatment approach to enhance patient outcomes and maintain good blood sugar control.`
});

const generateHcpInsights = (name: string) => ({
  summary: `${name} focuses on type 2 diabetes and metabolic diseases. Recent interactions have shown strong interest in GLP-1 therapies, particularly Ozempic for weight management. Digital engagement has increased by 34% this quarter, with particular interest in clinical guidelines and case studies. Next recommended action: Follow up on Wegovy dosing questions from last meeting.`,
  introduction: `${name} is a key healthcare professional specializing in endocrinology and diabetes care. Recent engagement patterns show a clear focus on GLP-1 agonists and their applications in type 2 diabetes management. The HCP has demonstrated receptiveness to new clinical data, particularly regarding cardiovascular outcomes in diabetes patients. Marketing consent has been obtained, enabling continued digital engagement.`,
  clinicalInterests: [
    {
      title: "GLP-1 Therapy Optimization",
      content: "Strong interest in optimizing GLP-1 therapy for patients with type 2 diabetes, particularly focusing on Ozempic titration protocols and managing patient expectations during the initiation phase."
    },
    {
      title: "Weight Management Integration",
      content: "Actively exploring the integration of weight management strategies with diabetes care, showing particular interest in Wegovy for patients with obesity and metabolic syndrome."
    },
    {
      title: "Cardiovascular Risk Reduction",
      content: "Recent discussions have emphasized the importance of cardiovascular risk reduction in diabetic patients, with questions about SGLT-2 inhibitor combinations."
    }
  ],
  engagementPattern: `This HCP shows high digital engagement with our content platform. Over the past 6 months, they have viewed 12 clinical articles, attended 3 virtual webinars, and downloaded 5 patient education materials. Peak engagement occurs mid-week, with preference for video content and interactive case studies. Email open rate is 78%, significantly above average.`,
  recommendations: [
    "Schedule follow-up meeting to discuss new Ozempic real-world evidence data",
    "Share updated patient initiation guide for GLP-1 therapies",
    "Invite to upcoming regional diabetes symposium",
    "Provide access to new weight management clinical decision tool"
  ],
  patientProfile: `Based on interaction history, this HCP manages approximately 200-250 patients with type 2 diabetes annually. Patient population skews toward those with multiple comorbidities including hypertension and dyslipidemia. Estimated 40% of patients could benefit from GLP-1 therapy optimization.`
});

export const AIInsightsSection = ({ entityType, entityName }: AIInsightsSectionProps) => {
  const insights = entityType === 'hco' 
    ? generateHcoInsights(entityName) 
    : generateHcpInsights(entityName);

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

            {/* Diabetes Stats */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <h4 className="font-medium text-card-foreground">Regional Diabetes Statistics</h4>
              </div>
              <p className="text-sm text-muted-foreground pl-8 leading-relaxed">
                {(insights as ReturnType<typeof generateHcoInsights>).diabetesStats}
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
