export type PeriodKey = "30d" | "90d" | "ytd" | "custom";
export type DemoScenario = "normal" | "no-activity" | "no-analysis" | "partial" | "api-error" | "historical-training" | "no-plan" | "with-plan" | "no-meeting" | "missing-segment" | "imported-docs";

export const defaultPeriod = { key: "30d" as PeriodKey, label: "Last 30 days", range: "Sep 3 – Oct 2, 2026" };
export const periodOptions = [
  { key: "30d" as PeriodKey, label: "30 days", range: "Sep 3 – Oct 2, 2026" },
  { key: "90d" as PeriodKey, label: "90 days", range: "Jul 5 – Oct 2, 2026" },
  { key: "ytd" as PeriodKey, label: "YTD", range: "Jan 1 – Oct 2, 2026" },
  { key: "custom" as PeriodKey, label: "Custom", range: "Select start and end date" },
];

export const teamMembers = [
  { name: "Christian", slug: "christian", role: "KAM", district: "Copenhagen East", contacts: 89, hcos: "40 / 90", documentation: "78 / 89", quality: "7.7", qualityN: 64, attention: "2 current customer signals have no upcoming registered meeting" },
  { name: "Sofie", slug: "sofie", role: "KAM", district: "Copenhagen West", contacts: 55, hcos: "30 / 80", documentation: "46 / 55", quality: "7.9", qualityN: 39, attention: "5 drafts and 4 contacts without documentation" },
  { name: "Jonas", slug: "jonas", role: "KAM", district: "Copenhagen North", contacts: 0, hcos: "0 / 75", documentation: "No relevant contacts", quality: "No assessed debriefs", qualityN: 0, attention: "No registered contacts in the selected period" },
];

export const signals = [
  { id: "SIG-004", name: "Demo HCO 04", segment: "B", reason: "A/B HCO without a registered meeting in six months", horizon: "6 months", last: "Jan 3, 2026", next: "Oct 9, 2026", owner: "Christian" },
  { id: "SIG-002", name: "Demo HCO 02", segment: "B", reason: "A/B HCO without a registered meeting in six months", horizon: "6 months", last: "Feb 20, 2026", next: null, owner: null },
  { id: "SIG-003", name: "Demo HCO 03", segment: "A", reason: "A/B HCO without a registered meeting in six months", horizon: "6 months", last: "Mar 6, 2026", next: "Oct 5, 2026", owner: "Sofie" },
  { id: "SIG-001", name: "Demo HCO 01", segment: "A", reason: "A/B HCO without a registered meeting in six months", horizon: "6 months", last: "Mar 15, 2026", next: "Oct 14, 2026", owner: "Christian" },
  { id: "SIG-005", name: "Demo HCO 05", segment: "A", reason: "A/B HCO without a registered meeting in six months", horizon: "6 months", last: "Mar 30, 2026", next: null, owner: null },
];

export const themes = [
  { id: "THEME-01", label: "Practical initiation", type: "QUESTION", count: 12, hcps: 9, hcos: 7, examples: ["How is Dose 1 initiated in the acute pathway?", "Which patients can start treatment without surgery?", "What should the first follow-up include?"] },
  { id: "THEME-02", label: "Material needs", type: "QUESTION", count: 9, hcps: 7, hcos: 6, examples: ["Is there a short guide for the care team?", "Can the patient pathway be shared as a one-pager?"] },
  { id: "THEME-03", label: "Time for patient dialogue", type: "CONCERN", count: 7, hcps: 5, hcos: 4, examples: ["The non-surgical option takes longer to explain.", "How can we make shared decision-making practical?"] },
  { id: "THEME-04", label: "Local organization", type: "CONCERN", count: 5, hcps: 4, hcos: 4, examples: ["Who owns follow-up across departments?", "Our local pathway is not aligned yet."] },
  { id: "THEME-05", label: "Existing workflow", type: "OBJECTION", count: 4, hcps: 3, hcos: 2, examples: ["Surgery remains our established default.", "The current pathway is familiar to the team."] },
];

export const oneToOnePoints = [
  { title: "Customer prioritization", observation: "Demo HCO 02 and 05 have current signals and no upcoming registered meeting.", question: "Which contact opportunities would be useful to discuss together?", sources: "SIG-002, SIG-005 and contact history" },
  { title: "Customer questions", observation: "Practical initiation appears in 12 of 60 analyzed debriefs.", question: "Which questions require shared support or materials?", sources: "THEME-01 and DEBRIEF-014, DEBRIEF-027, DEBRIEF-051" },
  { title: "Documentation", observation: "Six drafts and five contacts are missing documentation.", question: "Is there anything in the workflow that would make these easier to complete?", sources: "DOC-001–DOC-011" },
];
