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
  { id: "m1", time: "8:00 AM", hcp: "Dr. Michael Chen", hco: "Riverside Acute Surgery" },
  { id: "m2", time: "9:30 AM", hcp: "Dr. Amanda Foster", hco: "City Medical Center" },
  { id: "m3", time: "11:00 AM", hcp: "Dr. James Park", hco: "Lakeview Family Practice" },
  { id: "m4", time: "1:45 PM", hcp: "Dr. Laura Martinez", hco: "Central Abdominal Care Institute" },
  { id: "m5", time: "2:30 PM", hcp: "Dr. Sarah Williams", hco: "Northside Emergency Department" },
  { id: "m6", time: "4:00 PM", hcp: "Dr. Emily Roberts", hco: "Westend Day Surgery Clinic" },
];

export const noteAiSummaries: NoteSummary[] = [
  {
    id: "1",
    title: "Dose 1 initiation & patient counselling",
    hcp: "Dr. Amanda Foster",
    hco: "City Medical Center",
    date: "Mon, Jun 8 '26",
    time: "9:40 AM",
    duration: "18 min",
    matchedMeeting: "Matched to your 9:30 AM meeting",
    summary:
      "Conversation focused on how to start Dose 1 in confirmed uncomplicated appendicitis, and on counselling patients who arrive expecting surgery.",
    keyPoints: [
      "Dr. Foster sees fast symptom resolution with Dose 1 but wants clearer guidance for patients over 65.",
      "Main barrier raised was patient confidence in skipping surgery; she requested a simple one-page patient leaflet.",
      "Interest in real-world 12-month recurrence data versus immediate appendectomy.",
    ],
    actions: [
      "Send the simplified Dose 1 patient leaflet for older adults.",
      "Share latest real-world recurrence study summary.",
      "Book follow-up to review 3 starter patients in 6 weeks.",
    ],
    transcript: [
      { speaker: "KAM", start: "0:05", end: "0:19", text: "Thanks for making time today. I wanted to follow up on how the first Dose 1 patients have done since we last spoke." },
      { speaker: "Dr. Foster", initial: "A", color: "bg-amber-500", start: "0:20", end: "0:41", text: "Generally well. Pain settles within a day, but a few of my older patients are nervous about not having the appendix removed." },
      { speaker: "KAM", start: "0:42", end: "0:55", text: "That's helpful. Would a simple one-page explainer for patients help with that confidence?" },
      { speaker: "Dr. Foster", initial: "A", color: "bg-amber-500", start: "0:56", end: "1:14", text: "Yes, definitely. Something I can hand them in the room would save a lot of phone calls." },
      { speaker: "KAM", start: "1:15", end: "1:30", text: "I'll get that to you this week, and I can also share the recurrence data you asked about." },
    ],
  },
  {
    id: "2",
    title: "Dose 1 formulary access discussion",
    hcp: "Dr. Michael Chen",
    hco: "Riverside Acute Surgery",
    date: "Mon, Jun 8 '26",
    time: "8:15 AM",
    duration: "12 min",
    matchedMeeting: "",
    summary:
      "Discussion centered on current formulary positioning of Dose 1 and how approval friction is delaying treatment in the emergency pathway.",
    keyPoints: [
      "Approval delays are the biggest blocker to treating eligible patients within the 12-hour window.",
      "Dr. Chen is supportive clinically but needs help streamlining the request workflow for his nurses.",
      "Requested an overview of the hospital stocking and support program.",
    ],
    actions: [
      "Send approval workflow checklist for nursing staff.",
      "Arrange stocking and support program walkthrough.",
    ],
    transcript: [
      { speaker: "KAM", start: "0:03", end: "0:18", text: "How are the Dose 1 cases going since the formulary update?" },
      { speaker: "Dr. Chen", initial: "M", color: "bg-blue-500", start: "0:19", end: "0:44", text: "The clinical side is fine, but getting sign-off at night is eating my nurses' time. If it takes three hours, the team just books theatre instead." },
      { speaker: "KAM", start: "0:45", end: "1:02", text: "I can bring a checklist that's worked well for similar departments to speed that up." },
    ],
  },
  {
    id: "3",
    title: "ATLAS recurrence data review",
    hcp: "Dr. Sarah Williams",
    hco: "Northside Emergency Department",
    date: "Fri, Jun 5 '26",
    time: "2:30 PM",
    duration: "25 min",
    matchedMeeting: "Matched to your 2:30 PM meeting",
    summary:
      "A deeper clinical conversation on ATLAS 12-month recurrence data and how Dose 1 fits into the department's acute abdomen pathway.",
    keyPoints: [
      "Strong interest in the recurrence data for patients treated without surgery.",
      "Wants to align the observation window with the surgical on-call schedule.",
      "Asked about managing patients whose pain does not settle within 24 hours.",
    ],
    actions: [
      "Share the ATLAS recurrence one-pager.",
      "Provide escalation criteria card for triage staff.",
    ],
    transcript: [
      { speaker: "KAM", start: "0:04", end: "0:22", text: "I wanted to walk through the ATLAS recurrence data with you given your case mix." },
      { speaker: "Dr. Williams", initial: "S", color: "bg-emerald-500", start: "0:23", end: "0:51", text: "That's exactly what I care about. My surgeons will ask how many come back within a year, and I need a number I can defend." },
    ],
  },
  {
    id: "4",
    title: "Dose 1 onboarding for GP referrals",
    hcp: "Dr. James Park",
    hco: "Lakeview Family Practice",
    date: "Fri, Jun 5 '26",
    time: "11:00 AM",
    duration: "15 min",
    matchedMeeting: "Matched to your 11:00 AM meeting",
    summary:
      "Focused on supporting GP referrals and educating front-line staff on early recognition so patients reach hospital inside the Dose 1 window.",
    keyPoints: [
      "Practice wants a short staff session on which abdominal pain to refer urgently.",
      "Interest in identifying suitable patients earlier in the presentation.",
    ],
    actions: ["Schedule a 20-minute lunch-and-learn with the team."],
    transcript: [
      { speaker: "KAM", start: "0:02", end: "0:20", text: "Would a quick team session help your staff spot appendicitis early enough for Dose 1?" },
      { speaker: "Dr. Park", initial: "J", color: "bg-violet-500", start: "0:21", end: "0:40", text: "Yes, a short lunch session would be perfect for the nurses." },
    ],
  },
  {
    id: "5",
    title: "Dose 1 patient selection criteria",
    hcp: "Dr. Emily Roberts",
    hco: "Westend Day Surgery Clinic",
    date: "Thu, Jun 4 '26",
    time: "4:15 PM",
    duration: "20 min",
    matchedMeeting: "Matched to your 4:00 PM meeting",
    summary:
      "Reviewed selection criteria and expectation-setting for patients offered Dose 1 instead of appendectomy.",
    keyPoints: [
      "Clear interest in structured selection guidance, especially around appendicoliths.",
      "Wants resources to set realistic expectations about recurrence early.",
    ],
    actions: ["Send patient selection and expectation-setting toolkit."],
    transcript: [
      { speaker: "KAM", start: "0:03", end: "0:21", text: "How are you currently deciding who gets Dose 1 versus theatre?" },
      { speaker: "Dr. Roberts", initial: "E", color: "bg-pink-500", start: "0:22", end: "0:46", text: "It's a bit ad hoc, and honestly two of my surgeons still just operate. A clearer framework would really help." },
    ],
  },
  {
    id: "6",
    title: "Dose 1 in adolescent patients",
    hcp: "Dr. David Kim",
    hco: "Children's Health Partners",
    date: "Thu, Jun 4 '26",
    time: "10:30 AM",
    duration: "14 min",
    matchedMeeting: "",
    summary:
      "Pediatric-focused discussion on Dose 1 dosing in adolescents and how to explain the non-surgical option to worried families.",
    keyPoints: [
      "Needs family-friendly education materials explaining why surgery may not be required.",
      "Interest in the adolescent subgroup data and school return times.",
    ],
    actions: ["Provide family education pack for pediatric patients."],
    transcript: [
      { speaker: "KAM", start: "0:04", end: "0:23", text: "What would make the family conversations easier when you propose Dose 1?" },
      { speaker: "Dr. Kim", initial: "D", color: "bg-cyan-500", start: "0:24", end: "0:45", text: "Simple visuals the parents can take home. Most of them arrive assuming the appendix comes out today." },
    ],
  },
  {
    id: "7",
    title: "Switching from routine appendectomy",
    hcp: "Dr. Laura Martinez",
    hco: "Central Abdominal Care Institute",
    date: "Wed, Jun 3 '26",
    time: "1:45 PM",
    duration: "16 min",
    matchedMeeting: "Matched to your 1:45 PM meeting",
    summary:
      "Discussed moving uncomplicated cases from routine surgery to Dose 1 and how to manage the transition across the surgical team.",
    keyPoints: [
      "Open to Dose 1 for imaging-confirmed uncomplicated cases.",
      "Wants a clear written protocol to share with sceptical colleagues.",
    ],
    actions: ["Share Dose 1 pathway transition protocol."],
    transcript: [
      { speaker: "KAM", start: "0:03", end: "0:22", text: "For uncomplicated cases, would a written pathway make it easier to standardise?" },
      { speaker: "Dr. Martinez", initial: "L", color: "bg-orange-500", start: "0:23", end: "0:47", text: "Yes, especially something I can standardize across the team. Right now it depends entirely on who is on call." },
    ],
  },
  {
    id: "8",
    title: "Dose 1 timing on night shifts",
    hcp: "Dr. Robert Taylor",
    hco: "Eastgate Internal Medicine",
    date: "Wed, Jun 3 '26",
    time: "9:00 AM",
    duration: "11 min",
    matchedMeeting: "Matched to your 9:00 AM meeting",
    summary:
      "Short, practical discussion on administering Dose 1 out of hours when imaging and pharmacy access are limited.",
    keyPoints: ["Night admissions need a clear, low-friction protocol to avoid defaulting to surgery."],
    actions: ["Send out-of-hours Dose 1 protocol sheet."],
    transcript: [
      { speaker: "KAM", start: "0:02", end: "0:19", text: "Most of your appendicitis admissions arrive after 10 PM — would an out-of-hours protocol help?" },
      { speaker: "Dr. Taylor", initial: "R", color: "bg-teal-500", start: "0:20", end: "0:39", text: "Absolutely, that's a constant question in my department." },
    ],
  },
  {
    id: "9",
    title: "Dose 1 24-hour response follow-up",
    hcp: "Dr. Nina Petrov",
    hco: "Harbor Acute Care Group",
    date: "Tue, Jun 2 '26",
    time: "3:30 PM",
    duration: "13 min",
    matchedMeeting: "Matched to your 3:30 PM meeting",
    summary:
      "Follow-up on symptom resolution within 24 hours and next steps for a small cohort of Dose 1 patients.",
    keyPoints: [
      "Encouraging early results: 7 of 8 patients avoided surgery.",
      "Ready to expand with clear monitoring and escalation support.",
    ],
    actions: ["Provide monitoring template for the next cohort."],
    transcript: [
      { speaker: "KAM", start: "0:03", end: "0:21", text: "How did the first few patients respond in the first 24 hours?" },
      { speaker: "Dr. Petrov", initial: "N", color: "bg-indigo-500", start: "0:22", end: "0:44", text: "Better than expected. One needed theatre on day two, the rest went home. I'd like to expand carefully with the right monitoring." },
    ],
  },
  {
    id: "10",
    title: "Dose 1 versus surgery: objection handling",
    hcp: "Dr. Thomas Lee",
    hco: "Summit Medical Group",
    date: "Tue, Jun 2 '26",
    time: "10:00 AM",
    duration: "17 min",
    matchedMeeting: "Matched to your 10:00 AM meeting",
    summary:
      "Introductory conversation with a surgically inclined consultant who prefers appendectomy for the certainty it gives.",
    keyPoints: [
      "Objection raised: surgery removes the problem permanently, Dose 1 leaves recurrence risk.",
      "Wants clarity on how to identify the minority who fail treatment early.",
    ],
    actions: ["Share ATLAS recurrence data and early-failure predictors."],
    transcript: [
      { speaker: "KAM", start: "0:04", end: "0:23", text: "You mentioned you prefer to operate — what would need to be true for Dose 1 to be your first choice?" },
      { speaker: "Dr. Lee", initial: "T", color: "bg-rose-500", start: "0:24", end: "0:48", text: "If I take it out, it never comes back. Show me that fewer than one in five return within a year and I'll reconsider for the straightforward cases." },
    ],
  },
];
