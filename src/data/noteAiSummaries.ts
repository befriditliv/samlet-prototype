export interface TranscriptLine {
  speaker: string;
  initial?: string;
  color?: string;
  start: string;
  end: string;
  text: string;
}

export interface NoteSummary {
  id: string;
  title: string;
  hcp: string;
  hco: string;
  date: string;
  time: string;
  duration: string;
  matchedMeeting: string;
  summary: string;
  keyPoints: string[];
  actions: string[];
  transcript: TranscriptLine[];
  submitted?: boolean;
}

export interface CalendarMeeting {
  id: string;
  time: string;
  hcp: string;
  hco: string;
}

// Mock calendar meetings the summary can be matched / rematched to
export const candidateMeetings: CalendarMeeting[] = [
  { id: "m1", time: "8:00 AM", hcp: "Dr. Michael Chen", hco: "Riverside Endocrinology" },
  { id: "m2", time: "9:30 AM", hcp: "Dr. Amanda Foster", hco: "City Medical Center" },
  { id: "m3", time: "11:00 AM", hcp: "Dr. James Park", hco: "Lakeview Family Practice" },
  { id: "m4", time: "1:45 PM", hcp: "Dr. Laura Martinez", hco: "Central Diabetes Institute" },
  { id: "m5", time: "2:30 PM", hcp: "Dr. Sarah Williams", hco: "Northside Cardiology" },
  { id: "m6", time: "4:00 PM", hcp: "Dr. Emily Roberts", hco: "Westend Weight Clinic" },
];

export const noteAiSummaries: NoteSummary[] = [
  {
    id: "1",
    title: "Tresiba titration & patient adherence",
    hcp: "Dr. Amanda Foster",
    hco: "City Medical Center",
    date: "Mon, Jun 8 '26",
    time: "9:40 AM",
    duration: "18 min",
    matchedMeeting: "Matched to your 9:30 AM meeting",
    summary:
      "Conversation focused on optimizing basal insulin titration for patients struggling with morning hyperglycemia, and on practical tools to support adherence between visits.",
    keyPoints: [
      "Dr. Foster sees strong fasting glucose control with Tresiba but wants clearer titration guidance for elderly patients.",
      "Main barrier raised was patient confidence with self-titration; she requested a simple one-page patient leaflet.",
      "Interest in real-world adherence data for the once-daily regimen versus competitor basal options.",
    ],
    actions: [
      "Send the simplified titration leaflet for elderly patients.",
      "Share latest real-world adherence study summary.",
      "Book follow-up to review 3 starter patients in 6 weeks.",
    ],
    transcript: [
      { speaker: "KAM", start: "0:05", end: "0:19", text: "Thanks for making time today. I wanted to follow up on how the basal patients are doing since we last spoke." },
      { speaker: "Dr. Foster", initial: "A", color: "bg-amber-500", start: "0:20", end: "0:41", text: "Generally well. Fasting numbers look good, but a few of my older patients are nervous about adjusting the dose themselves." },
      { speaker: "KAM", start: "0:42", end: "0:55", text: "That's helpful. Would a simple one-page titration guide for patients help with that confidence?" },
      { speaker: "Dr. Foster", initial: "A", color: "bg-amber-500", start: "0:56", end: "1:14", text: "Yes, definitely. Something I can hand them in the room would save a lot of phone calls." },
      { speaker: "KAM", start: "1:15", end: "1:30", text: "I'll get that to you this week, and I can also share the latest adherence data you asked about." },
    ],
  },
  {
    id: "2",
    title: "Ozempic formulary access discussion",
    hcp: "Dr. Michael Chen",
    hco: "Riverside Endocrinology",
    date: "Mon, Jun 8 '26",
    time: "8:15 AM",
    duration: "12 min",
    matchedMeeting: "",
    summary:
      "Discussion centered on current formulary positioning and how prior-authorization friction is affecting new patient starts in the practice.",
    keyPoints: [
      "Prior-authorization delays are the biggest blocker to initiating eligible patients.",
      "Dr. Chen is supportive clinically but needs help streamlining the PA workflow for his nurses.",
      "Requested an overview of patient support program enrollment.",
    ],
    actions: [
      "Send PA workflow checklist for nursing staff.",
      "Arrange patient support program walkthrough.",
    ],
    transcript: [
      { speaker: "KAM", start: "0:03", end: "0:18", text: "How are the new starts going since the formulary update?" },
      { speaker: "Dr. Chen", initial: "M", color: "bg-blue-500", start: "0:19", end: "0:44", text: "The clinical side is fine, but prior auth is eating up my nurses' time. That's the real bottleneck." },
      { speaker: "KAM", start: "0:45", end: "1:02", text: "I can bring a checklist that's worked well for similar practices to speed that up." },
    ],
  },
  {
    id: "3",
    title: "Wegovy cardiovascular outcomes review",
    hcp: "Dr. Sarah Williams",
    hco: "Northside Cardiology",
    date: "Fri, Jun 5 '26",
    time: "2:30 PM",
    duration: "25 min",
    matchedMeeting: "Matched to your 2:30 PM meeting",
    summary:
      "A deeper clinical conversation on cardiovascular risk reduction data and how it fits into the practice's secondary prevention pathway.",
    keyPoints: [
      "Strong interest in the cardiovascular outcomes data for at-risk patients.",
      "Wants to align dosing escalation with the cardiology follow-up schedule.",
      "Asked about managing GI tolerability during titration.",
    ],
    actions: [
      "Share the cardiovascular outcomes one-pager.",
      "Provide GI tolerability management tips for staff.",
    ],
    transcript: [
      { speaker: "KAM", start: "0:04", end: "0:22", text: "I wanted to walk through the cardiovascular outcomes data with you given your patient mix." },
      { speaker: "Dr. Williams", initial: "S", color: "bg-emerald-500", start: "0:23", end: "0:51", text: "That's exactly what I care about. Most of my patients are secondary prevention, so that data is relevant." },
    ],
  },
  {
    id: "4",
    title: "Rybelsus onboarding for GP referrals",
    hcp: "Dr. James Park",
    hco: "Lakeview Family Practice",
    date: "Fri, Jun 5 '26",
    time: "11:00 AM",
    duration: "15 min",
    matchedMeeting: "Matched to your 11:00 AM meeting",
    summary:
      "Focused on supporting GP referrals and educating front-line staff on the oral GLP-1 option for treatment-naive patients.",
    keyPoints: [
      "Practice wants a short staff education session on the oral option.",
      "Interest in identifying suitable treatment-naive patients earlier.",
    ],
    actions: ["Schedule a 20-minute lunch-and-learn with the team."],
    transcript: [
      { speaker: "KAM", start: "0:02", end: "0:20", text: "Would a quick team session help your staff feel confident discussing the oral option?" },
      { speaker: "Dr. Park", initial: "J", color: "bg-violet-500", start: "0:21", end: "0:40", text: "Yes, a short lunch session would be perfect for the nurses." },
    ],
  },
  {
    id: "5",
    title: "Saxenda patient selection criteria",
    hcp: "Dr. Emily Roberts",
    hco: "Westend Weight Clinic",
    date: "Thu, Jun 4 '26",
    time: "4:15 PM",
    duration: "20 min",
    matchedMeeting: "Matched to your 4:00 PM meeting",
    summary:
      "Reviewed patient selection criteria and expectation-setting for weight management patients new to injectable therapy.",
    keyPoints: [
      "Clear interest in structured patient selection guidance.",
      "Wants resources to set realistic expectations early.",
    ],
    actions: ["Send patient selection and expectation-setting toolkit."],
    transcript: [
      { speaker: "KAM", start: "0:03", end: "0:21", text: "How are you currently selecting patients for injectable therapy?" },
      { speaker: "Dr. Roberts", initial: "E", color: "bg-pink-500", start: "0:22", end: "0:46", text: "It's a bit ad hoc. A clearer framework would really help my team." },
    ],
  },
  {
    id: "6",
    title: "Levemir pediatric dosing questions",
    hcp: "Dr. David Kim",
    hco: "Children's Health Partners",
    date: "Thu, Jun 4 '26",
    time: "10:30 AM",
    duration: "14 min",
    matchedMeeting: "Matched to your 10:30 AM meeting",
    summary:
      "Pediatric-focused discussion on flexible dosing and family education for younger patients managing type 1 diabetes.",
    keyPoints: [
      "Needs family-friendly education materials.",
      "Interest in flexible dosing schedules for school-age children.",
    ],
    actions: ["Provide family education pack for pediatric patients."],
    transcript: [
      { speaker: "KAM", start: "0:04", end: "0:23", text: "What would make the family conversations easier for your younger patients?" },
      { speaker: "Dr. Kim", initial: "D", color: "bg-cyan-500", start: "0:24", end: "0:45", text: "Simple visuals the parents can take home would be a huge help." },
    ],
  },
  {
    id: "7",
    title: "Victoza switch conversation",
    hcp: "Dr. Laura Martinez",
    hco: "Central Diabetes Institute",
    date: "Wed, Jun 3 '26",
    time: "1:45 PM",
    duration: "16 min",
    matchedMeeting: "Matched to your 1:45 PM meeting",
    summary:
      "Discussed switching considerations for patients not reaching targets on current therapy and how to manage the transition smoothly.",
    keyPoints: [
      "Open to switching stable-but-suboptimal patients.",
      "Wants a clear transition protocol to share with colleagues.",
    ],
    actions: ["Share switch transition protocol."],
    transcript: [
      { speaker: "KAM", start: "0:03", end: "0:22", text: "For patients plateauing on their current therapy, would a switch protocol be useful?" },
      { speaker: "Dr. Martinez", initial: "L", color: "bg-orange-500", start: "0:23", end: "0:47", text: "Yes, especially something I can standardize across the team." },
    ],
  },
  {
    id: "8",
    title: "NovoRapid mealtime flexibility",
    hcp: "Dr. Robert Taylor",
    hco: "Eastgate Internal Medicine",
    date: "Wed, Jun 3 '26",
    time: "9:00 AM",
    duration: "11 min",
    matchedMeeting: "Matched to your 9:00 AM meeting",
    summary:
      "Short, practical discussion on mealtime dosing flexibility for patients with irregular schedules.",
    keyPoints: ["Patients with shift work need flexible dosing guidance."],
    actions: ["Send mealtime flexibility guidance sheet."],
    transcript: [
      { speaker: "KAM", start: "0:02", end: "0:19", text: "Many of your patients work shifts — would flexible dosing guidance help?" },
      { speaker: "Dr. Taylor", initial: "R", color: "bg-teal-500", start: "0:20", end: "0:39", text: "Absolutely, that's a constant question in my clinic." },
    ],
  },
  {
    id: "9",
    title: "Fiasp post-meal control follow-up",
    hcp: "Dr. Nina Petrov",
    hco: "Harbor Endocrine Group",
    date: "Tue, Jun 2 '26",
    time: "3:30 PM",
    duration: "13 min",
    matchedMeeting: "Matched to your 3:30 PM meeting",
    summary:
      "Follow-up on post-meal glucose control improvements and next steps for a small cohort of patients.",
    keyPoints: [
      "Encouraging post-meal results in initial patients.",
      "Ready to expand to more patients with monitoring support.",
    ],
    actions: ["Provide monitoring template for the next cohort."],
    transcript: [
      { speaker: "KAM", start: "0:03", end: "0:21", text: "How are the post-meal numbers looking for the first few patients?" },
      { speaker: "Dr. Petrov", initial: "N", color: "bg-indigo-500", start: "0:22", end: "0:44", text: "Better than expected. I'd like to expand carefully with the right monitoring." },
    ],
  },
  {
    id: "10",
    title: "Xultophy combination therapy intro",
    hcp: "Dr. Thomas Lee",
    hco: "Summit Medical Group",
    date: "Tue, Jun 2 '26",
    time: "10:00 AM",
    duration: "17 min",
    matchedMeeting: "Matched to your 10:00 AM meeting",
    summary:
      "Introductory conversation on combination therapy for patients needing intensification beyond basal insulin alone.",
    keyPoints: [
      "Interested in simplifying regimens for complex patients.",
      "Wants clarity on titration when combining agents.",
    ],
    actions: ["Share combination therapy titration guide."],
    transcript: [
      { speaker: "KAM", start: "0:04", end: "0:23", text: "For patients needing more than basal alone, is regimen simplification a priority?" },
      { speaker: "Dr. Lee", initial: "T", color: "bg-rose-500", start: "0:24", end: "0:48", text: "Definitely. Fewer injections with good control is what my patients want." },
    ],
  },
];