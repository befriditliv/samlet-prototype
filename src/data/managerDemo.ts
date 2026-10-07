// Manager demo fixtures (rev 2). All figures are fictional and shared by team and employee views.
export type PeriodKey = "30d" | "90d" | "ytd" | "custom";
export type DemoScenario = "normal" | "no-activity" | "load-error" | "partial" | "no-plan" | "imported-docs" | "unfinished";

export const scenarioOptions: { value: DemoScenario; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "no-activity", label: "Ingen aktivitet" },
  { value: "load-error", label: "Indlæsningsfejl" },
  { value: "partial", label: "Delvis analyse" },
  { value: "no-plan", label: "Ingen kontaktplan" },
  { value: "imported-docs", label: "Kun importeret dokumentation" },
  { value: "unfinished", label: "Uafsluttet periode" },
];

export const periodOptions = [
  { key: "30d" as PeriodKey, label: "30 dage", range: "3. sep – 2. okt 2026" },
  { key: "90d" as PeriodKey, label: "90 dage", range: "5. jul – 2. okt 2026" },
  { key: "ytd" as PeriodKey, label: "År til dato", range: "1. jan – 2. okt 2026" },
  { key: "custom" as PeriodKey, label: "Brugerdefineret", range: "Vælg start- og slutdato" },
];

export const syncLine = "Data synkroniseret 2. okt 2026 kl. 10:45 · Brief beregnet kl. 10:48";

export type EmployeeState = "full" | "normal" | "no-plan" | "quality-error" | "imported" | "no-activity";

export type TeamMember = {
  name: string; first: string; slug: string; role: string; district: string; state: EmployeeState;
  contacts: number; phone: number; hcosContacted: number; hcosAssigned: number;
  documented: number; drafts: number; missing: number;
  quality: number | null; qualityN: number; completed: number; attention: string;
  plan: { done: number; planned: number; customers: number; excluded: number } | null;
  calendar: { deleted: number; cancelled: number; rebooked: number };
};

export const teamMembers: TeamMember[] = [
  { name: "Christian Dahl", first: "Christian", slug: "christian", role: "KAM", district: "København Øst", state: "full", contacts: 89, phone: 10, hcosContacted: 40, hcosAssigned: 90, documented: 78, drafts: 6, missing: 5, quality: 7.7, qualityN: 64, completed: 78, attention: "2 aktuelle kundesignaler uden kommende møde", plan: { done: 38, planned: 56, customers: 23, excluded: 4 }, calendar: { deleted: 14, cancelled: 6, rebooked: 3 } },
  { name: "Sofie Brandt", first: "Sofie", slug: "sofie", role: "KAM", district: "København Vest", state: "normal", contacts: 55, phone: 6, hcosContacted: 30, hcosAssigned: 80, documented: 46, drafts: 5, missing: 4, quality: 7.9, qualityN: 39, completed: 46, attention: "5 kladder og 4 kontakter uden dokumentation", plan: { done: 29, planned: 40, customers: 18, excluded: 2 }, calendar: { deleted: 7, cancelled: 4, rebooked: 2 } },
  { name: "Mikkel Hauge", first: "Mikkel", slug: "mikkel", role: "KAM", district: "København Syd", state: "no-plan", contacts: 34, phone: 4, hcosContacted: 18, hcosAssigned: 52, documented: 30, drafts: 2, missing: 2, quality: 6.9, qualityN: 22, completed: 30, attention: "Ingen kontaktplan tilgængelig", plan: null, calendar: { deleted: 5, cancelled: 2, rebooked: 1 } },
  { name: "Nanna Riis", first: "Nanna", slug: "nanna", role: "KAM", district: "København Øst", state: "quality-error", contacts: 41, phone: 3, hcosContacted: 22, hcosAssigned: 61, documented: 36, drafts: 3, missing: 2, quality: null, qualityN: 0, completed: 36, attention: "Kvalitetsdata kunne ikke hentes", plan: { done: 17, planned: 28, customers: 12, excluded: 1 }, calendar: { deleted: 4, cancelled: 3, rebooked: 2 } },
  { name: "Ida Mørk", first: "Ida", slug: "ida", role: "KAM", district: "København Vest", state: "imported", contacts: 27, phone: 2, hcosContacted: 15, hcosAssigned: 44, documented: 27, drafts: 0, missing: 0, quality: null, qualityN: 0, completed: 27, attention: "Al dokumentation er importeret fra CRM", plan: { done: 12, planned: 20, customers: 9, excluded: 0 }, calendar: { deleted: 2, cancelled: 1, rebooked: 0 } },
  { name: "Jonas Krag", first: "Jonas", slug: "jonas", role: "KAM", district: "København Nord", state: "no-activity", contacts: 0, phone: 0, hcosContacted: 0, hcosAssigned: 75, documented: 0, drafts: 0, missing: 0, quality: null, qualityN: 0, completed: 0, attention: "Ingen registrerede kontakter i den valgte periode", plan: { done: 0, planned: 30, customers: 14, excluded: 0 }, calendar: { deleted: 0, cancelled: 0, rebooked: 0 } },
];

// Team totals are deduplicated: 4 meetings had two employees present; 6 HCOs sit in two portfolios (5 contacted).
export const teamTotals = { contacts: 242, rowSum: 246, hcosContacted: 120, hcosAssigned: 396, hcoRowSum: "125 / 402", documented: 213, quality: 7.6, qualityN: 125, digital: 410 };
// Classic homepage uses the same employee records as the detail views.
export const employeeListFixtures = teamMembers.map((member, index) => ({
  ...member,
  plannedMeetings: member.plan?.done ?? 0,
  canvasMeetings: member.contacts - (member.plan?.done ?? 0),
  upcoming: member.slug === "christian" ? [6, 5] : member.contacts ? [4 + index, 3] : [0, 0],
}));
export const activityStats = {
  meetings: { total: teamTotals.contacts, physical: employeeListFixtures.reduce((sum, m) => sum + m.plannedMeetings, 0), canvas: teamTotals.contacts - employeeListFixtures.reduce((sum, m) => sum + m.plannedMeetings, 0), virtual: 0, debriefed: teamTotals.documented, rate: Math.round(teamTotals.documented / teamTotals.contacts * 1000) / 10 },
  events: { total: 27, breakdown: { education: 15, event: 12 } },
  phoneCalls: { total: teamMembers.reduce((sum, m) => sum + m.phone, 0) },
  digital: { total: teamTotals.digital, breakdown: { email: 121, newsletter: 180, webPortal: 53, webinar: 56 } },
  totalInteractions: { total: teamTotals.contacts + 27 + teamMembers.reduce((sum, m) => sum + m.phone, 0) + teamTotals.digital },
};
export const previousPeriods = {
  prev30: { label: "Forrige 30 dage", meetings: 210, events: 19, phoneCalls: 29, digital: 327, totalInteractions: 585 },
  prevQuarter: { label: "Forrige kvartal", meetings: 630, events: 57, phoneCalls: 87, digital: 981, totalInteractions: 1755 },
  lastYear: { label: "Samme periode sidste år", meetings: 196, events: 11, phoneCalls: 31, digital: 298, totalInteractions: 536 },
};
export const pctChange = (current: number, previous: number) => previous ? Math.round((current - previous) / previous * 1000) / 10 : 0;
export const districtCoverage = [
  { district: "København Øst", value: "57 / 145" },
  { district: "København Vest", value: "45 / 124" },
  { district: "København Syd", value: "18 / 52" },
  { district: "København Nord", value: "0 / 75" },
];

export type MeetingState = { kind: "own"; date: string } | { kind: "colleague"; date: string; who: string } | { kind: "none" } | { kind: "unavailable" } | { kind: "outside"; date: string };

export const signals: { id: string; name: string; type: "HCO" | "HCP"; segment: string | null; rules: { text: string; horizon: string }[]; last: string | null; channel: string | null; contact: string | null; next: MeetingState }[] = [
  { id: "SIG-001", name: "Rønnevang Sundhedshus", type: "HCO", segment: "B", rules: [{ text: "A/B-HCO uden registreret møde i seks måneder", horizon: "6 måneder" }, { text: "Kun digital kontakt i 90 dage", horizon: "90 dage" }], last: "20. feb 2026", channel: "Fysisk", contact: "HCP", next: { kind: "none" } },
  { id: "SIG-002", name: "Lægehuset Nordbro", type: "HCO", segment: "A", rules: [{ text: "A/B-HCO uden registreret møde i seks måneder", horizon: "6 måneder" }], last: "30. mar 2026", channel: "Virtuelt", contact: "HCP", next: { kind: "own", date: "9. okt" } },
  { id: "SIG-003", name: "Klinik Vestbro", type: "HCO", segment: null, rules: [{ text: "A/B-HCO uden registreret møde i seks måneder", horizon: "6 måneder" }], last: "3. maj 2026", channel: "Fysisk", contact: "HCP", next: { kind: "outside", date: "3. dec" } },
  { id: "SIG-004", name: "Dr. Agnes Thorup", type: "HCP", segment: "B", rules: [{ text: "Webinardeltagelse uden opfølgning", horizon: "30 dage" }], last: null, channel: null, contact: null, next: { kind: "colleague", date: "5. okt", who: "Sofie" } },
  { id: "SIG-005", name: "Søholm Lægecenter", type: "HCO", segment: "A", rules: [{ text: "A/B-HCO uden registreret møde i seks måneder", horizon: "6 måneder" }], last: "15. mar 2026", channel: "Fysisk", contact: "HCP", next: { kind: "unavailable" } },
];

// Christian's full portfolio: 90 assigned HCOs. 40 contacted, 50 not. 22 booked, 31 A/B without upcoming meeting.
const prefixes = ["Lægehuset", "Klinik", "Sundhedshuset", "Lægecenter", "Lægerne i", "Praksis"];
const places = ["Amagerbro", "Islands Brygge", "Sundby", "Holmbladsgade", "Kastrup", "Tårnby", "Christianshavn", "Ørestad", "Sundholm", "Strandlodsvej", "Kløvermarken", "Dragør", "Englandsvej", "Øresund", "Femøren"];
const months = ["jul", "aug", "sep"];
export type CoverageRow = { name: string; segment: string; last: string | null; contacts: number; channel: string | null; next: string | null; contacted: boolean; booked: boolean; abNoMeeting: boolean; inSignals: boolean };
export const coverageRows: CoverageRow[] = (() => {
  const fixed: CoverageRow[] = [
    { name: "Lægehuset Amagerbro", segment: "A", last: "29. sep 2026", contacts: 4, channel: "Fysisk", next: "7. okt · Christian", contacted: true, booked: true, abNoMeeting: false, inSignals: false },
    { name: "Rønnevang Sundhedshus", segment: "B", last: "20. feb 2026", contacts: 0, channel: "Fysisk", next: null, contacted: false, booked: false, abNoMeeting: true, inSignals: true },
    { name: "Klinik Islands Brygge", segment: "B", last: "18. sep 2026", contacts: 2, channel: "Virtuelt", next: null, contacted: true, booked: false, abNoMeeting: true, inSignals: false },
    { name: "Lægehuset Nordbro", segment: "A", last: "30. mar 2026", contacts: 0, channel: "Virtuelt", next: "9. okt · Christian", contacted: false, booked: true, abNoMeeting: false, inSignals: true },
    { name: "Sundhedshuset Kastrup", segment: "C", last: "11. jun 2026", contacts: 0, channel: "Fysisk", next: null, contacted: false, booked: false, abNoMeeting: false, inSignals: false },
    { name: "Lægecenter Ørestad", segment: "A", last: "24. sep 2026", contacts: 3, channel: "Fysisk", next: "14. okt · Christian", contacted: true, booked: true, abNoMeeting: false, inSignals: false },
    { name: "Søholm Lægecenter", segment: "A", last: "15. mar 2026", contacts: 0, channel: "Fysisk", next: null, contacted: false, booked: false, abNoMeeting: true, inSignals: true },
    { name: "Praksis Christianshavn", segment: "B", last: null, contacts: 0, channel: null, next: null, contacted: false, booked: false, abNoMeeting: true, inSignals: false },
  ];
  // counts so far: contacted 3, booked 3, abNoMeeting 4
  const rows = [...fixed];
  let contacted = 3, booked = 3, ab = 4;
  for (let i = 0; rows.length < 90; i++) {
    const name = `${prefixes[i % prefixes.length]} ${places[(i * 7) % places.length]} ${Math.floor(i / places.length) + 2}`;
    const isContacted = contacted < 40;
    const isBooked = !isContacted ? booked < 22 && i % 3 === 0 : booked < 22 && i % 2 === 0;
    const segment = ["A", "B", "C"][i % 3];
    const isAb = !isBooked && segment !== "C" && ab < 31;
    if (isContacted) contacted++;
    if (isBooked) booked++;
    if (isAb) ab++;
    rows.push({ name, segment, last: isContacted ? `${(i % 27) + 2}. ${months[2]} 2026` : `${(i % 27) + 1}. ${months[i % 2]} 2026`, contacts: isContacted ? (i % 3) + 1 : 0, channel: i % 4 === 0 ? "Virtuelt" : "Fysisk", next: isBooked ? `${(i % 26) + 3}. okt · Christian` : null, contacted: isContacted, booked: isBooked, abNoMeeting: isAb, inSignals: false });
  }
  return rows;
})();
export const coverageCounts = { all: 90, noContact: 50, noMeeting: 31, booked: 22 };
export const upcoming28 = { meetings: 27, customers: 27, range: "7. okt – 4. nov 2026", weeks: [["Uge 41", 3], ["Uge 42", 5], ["Uge 43", 7], ["Uge 44", 9], ["Uge 45", 3]] as [string, number][] };

export const themeCoverage = { analyzed: 60, completed: 78, pending: 14, failed: 4, previous: "Forrige periode: 54 af 71 analyseret." };
export const themes = [
  { id: "THEME-01", label: "Praktisk opstart", type: "SPØRGSMÅL", count: 12, hcps: 9, hcos: 7, change: "+6 pp", examples: ["Hvordan opstartes Dose 1 i det akutte forløb?", "Hvilke patienter kan starte behandling uden operation?", "Hvad skal første opfølgning indeholde?"] },
  { id: "THEME-02", label: "Materialebehov", type: "SPØRGSMÅL", count: 9, hcps: 7, hcos: 6, change: "−2 pp", examples: ["Findes der en kort vejledning til plejepersonalet?", "Kan patientforløbet deles som én side?"] },
  { id: "THEME-03", label: "Tid til patientdialog", type: "BEKYMRING", count: 7, hcps: 5, hcos: 4, change: null, examples: ["Den ikke-kirurgiske mulighed tager længere tid at forklare.", "Hvordan gør vi fælles beslutningstagning praktisk?"] },
  { id: "THEME-04", label: "Lokal organisering", type: "BEKYMRING", count: 5, hcps: 4, hcos: 4, change: null, examples: ["Hvem ejer opfølgningen på tværs af afdelinger?", "Vores lokale forløb er ikke afstemt endnu."] },
  { id: "THEME-05", label: "Eksisterende arbejdsgang", type: "INDVENDING", count: 4, hcps: 3, hcos: 2, change: "+1 pp", examples: ["Operation er fortsat vores etablerede standard.", "Det nuværende forløb er velkendt for teamet."] },
];
export const themeChangeSuppressed = "Ikke sammenlignelig med forrige periode";

// Selected examples are not the complete set behind the aggregate theme counts.
export const employeeThemeDetails = [
  { themeId: "THEME-01", kind: "Afklaringsbehov", summary: "Kunderne efterspørger en tydelig arbejdsgang for et muligt Dose 1-forløb ved appendicitis.", implication: "Afklar spørgsmål om patientudvælgelse og opfølgning, før et nyt forløb drøftes." },
  { themeId: "THEME-02", kind: "Ny mulighed", summary: "Der er interesse for fælles, korte materialer til personale og patientdialog.", implication: "Et fælles materiale kan understøtte den videre dialog; interessen er ikke en aftale om behandling." },
  { themeId: "THEME-03", kind: "Udfordring", summary: "Dialog om et ikke-kirurgisk appendicitisforløb opleves som tidskrævende.", implication: "Undersøg, hvad der konkret tager tid, og hvilke spørgsmål kunderne mangler svar på." },
  { themeId: "THEME-04", kind: "Udfordring", summary: "Ansvar for opfølgning på tværs af afdelinger er ikke altid afklaret.", implication: "Følg op på organisering og ansvar uden at antage, at et Dose 1-forløb allerede er indført." },
  { themeId: "THEME-05", kind: "Indvending", summary: "Nogle læger foretrækker kirurgi som den etablerede behandling ved appendicitis.", implication: "Afdæk dokumentationsbehovet og respekter kundens nuværende behandlingspraksis." },
];
export const employeeThemeSources = themes.flatMap((theme, themeIndex) => theme.examples.map((quote, index) => ({
  id: `EMP-D${String(themeIndex * 3 + index + 1).padStart(3, "0")}`,
  themeId: theme.id, speaker: `HCP ${String(themeIndex * 3 + index + 1).padStart(3, "0")}`,
  organization: `Demo-klinik ${String(themeIndex * 3 + index + 1).padStart(3, "0")}`,
  employeeSlug: "christian", date: `2026-09-${String(28 - themeIndex * 2 - index).padStart(2, "0")}`, time: index % 2 ? "14:00" : "10:30", quote,
  note: `Kunden sagde: “${quote}” Dialogen handlede om det fiktive Dose 1-forløb ved appendicitis. Der blev ikke aftalt ændringer i behandling.`,
  next: "User samler kundens spørgsmål til en opfølgende dialog. Dato er ikke registreret.",
})));
export const employeeQualityReview = {
  employeeSlug: "christian", previous: { score: 7.2, assessed: 58, range: "4. aug – 2. sep 2026" },
  current: { score: 7.7, assessed: 64, range: "3. sep – 2. okt 2026" },
  strength: "Formålet med kontakten og det aftalte næste skridt fremgår tydeligt af de vurderede noter.",
  improvement: "Kundens konkrete indvending, ansvarlig for opfølgningen og opfølgningsdato mangler i nogle noter.",
  explanation: "Scoren opsummerer dokumentationens tydelighed og fuldstændighed. Formål og næste skridt trækker vurderingen op; manglende detaljer begrænser den. Der er ikke angivet en præcis pointvægt for hvert kriterium.",
  examples: [
    { id: "QUALITY-D001", date: "29. sep 2026", customer: "HCP 021 · Demo-klinik 021", note: "Formål: afklare kundens spørgsmål om Dose 1. Kunden ønsker en oversigt over opfølgningsansvar. User sender det aftalte demomateriale den 2. oktober.", assessment: "Formål, kundens behov, ansvarlig og dato er beskrevet." },
    { id: "QUALITY-D002", date: "24. sep 2026", customer: "HCP 022 · Demo-klinik 022", note: "Talte om Dose 1. Kunden var skeptisk. Vi følger op.", assessment: "Indvendingens begrundelse, ansvarlig og tidspunkt for opfølgning mangler." },
  ],
};
// Outstanding physical-visit goals for Christian; no future visit is counted as completed.
export const employeePlanGoals = Array.from({ length: 18 }, (_, index) => ({ customer: `Demo-kunde ${String(index + 1).padStart(3, "0")}`, remaining: 1, bookedPhysical: index < 12 ? 1 : 0 }));
export const employeeCalendarBreakdown = { matchingGoals: 12, physicalWithoutRemainingGoal: 8, virtual: 7 };
export const employeePlanSnapshot = { date: "2026-10-07", deadline: "2026-12-31", windowDays: 28, remainingDays: 85, done: 38, target: 56 };
// Physical visits only, each assigned HCO belongs to exactly one fictional brick.
export const employeeBrickCoverage = ["Demo-brick Nord", "Demo-brick Syd", "Demo-brick Øst", "Demo-brick Vest", "Demo-brick Centrum", "Demo-brick Kyst", "Uden brick"].map((name, index) => {
  const rows = coverageRows.filter((_, rowIndex) => Math.min(6, Math.floor(rowIndex / 13)) === index);
  return { name, assigned: rows.length, visited: rows.filter(row => row.contacted && row.channel === "Fysisk").length, unsegmented: rows.filter(row => !["A", "B", "C", "D"].includes(row.segment)).length };
});
export const employeeQualityNarrative = "De 64 vurderede debriefs har et gennemsnit på 7,7 ud af 10. Noterne beskriver typisk formålet med kontakten og det aftalte næste skridt, men enkelte nøjes med at skrive, at kunden er skeptisk, uden at beskrive kundens begrundelse. I nogle noter er det heller ikke tydeligt, hvem der følger op, eller hvornår. Det gør det sværere at genoptage dialogen ved næste besøg. Vurderingen handler om noternes indhold, ikke om kvaliteten af samtalen.";

export const oneToOnePoints = [
  { title: "Kundeprioritering", observation: "Rønnevang Sundhedshus har to aktuelle signaler og intet kommende registreret møde. Mødedata for Søholm Lægecenter er utilgængelig.", question: "Hvilke kontaktmuligheder giver mening at drøfte sammen?", sources: "K6 · SIG-001, SIG-005" },
  { title: "Kundernes spørgsmål", observation: "Praktisk opstart optræder i 12 af 60 analyserede debriefs.", question: "Hvilke spørgsmål kræver fælles støtte eller materialer?", sources: "K5 · THEME-01, DEBRIEF-014, DEBRIEF-027, DEBRIEF-051" },
  { title: "Dokumentation", observation: "6 kladder og 5 kontakter mangler dokumentation.", question: "Er der noget i arbejdsgangen, der kan gøre dem lettere at afslutte?", sources: "K2 · DOC-001–DOC-011" },
];

export const fmt = (n: number) => n.toLocaleString("da-DK", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)} %` : "–");

// Homepage aggregates are fictional rule snapshots, not the five example cases above.
// HCO counts are deduplicated within each rule; different rules can overlap.
export const homepageSignals = [
  { id: "HOME-S01", label: "A/B-HCO'er uden møder", horizon: "Seneste 6 måneder", explanation: "HCO'er i kategori A eller B uden et registreret fysisk eller virtuelt møde i de seneste seks måneder.", icon: "building", unit: "HCO'er", counts: [34, 28, 18, 21, 14, 27] },
  { id: "HOME-S02", label: "A/B-HCO'er med nylige møder", horizon: "Seneste 30 dage", explanation: "Unikke HCO'er i kategori A eller B med mindst ét registreret møde i de seneste 30 dage.", icon: "building", unit: "HCO'er", counts: [26, 20, 12, 14, 10, 0] },
  { id: "HOME-S03", label: "A/B-HCO'er med kommende møder", horizon: "Næste 30 dage", explanation: "Unikke HCO'er i kategori A eller B med et kommende registreret møde i de næste 30 dage.", icon: "calendar", unit: "HCO'er", counts: [16, 13, 8, 10, 7, 6] },
  { id: "HOME-S04", label: "HCO'er med kun digital kontakt", horizon: "Seneste 90 dage · A/B/C/D", explanation: "HCO'er med digital kontakt, men uden fysiske eller virtuelle møder i de seneste 90 dage.", icon: "globe", unit: "HCO'er", counts: [20, 18, 12, 14, 9, 16] },
  { id: "HOME-S05", label: "HCO'er uden samtykke", horizon: "Pr. 2. oktober · A/B/C/D", explanation: "HCO'er, hvor ingen tilknyttet HCP har et registreret samtykke til digital kommunikation.", icon: "shield", unit: "HCO'er", counts: [24, 20, 14, 16, 10, 22] },
  { id: "HOME-S06", label: "HCO'er uden uddannelsesdeltagelse", horizon: "År til dato · A/B", explanation: "HCO'er i kategori A eller B, hvor ingen tilknyttet HCP har registreret deltagelse i uddannelse i 2026.", icon: "education", unit: "HCO'er", counts: [28, 23, 16, 18, 12, 25] },
  { id: "HOME-S07", label: "HCO'er med uddannelsesdeltagelse", horizon: "År til dato · A/B", explanation: "HCO'er i kategori A eller B med mindst én tilknyttet HCP, der har deltaget i uddannelse i 2026.", icon: "education", unit: "HCO'er", counts: [22, 18, 12, 14, 9, 0] },
  { id: "HOME-S08", label: "HCP'er tilmeldt uddannelse", horizon: "Kommende arrangementer", explanation: "Unikke HCP'er med en aktiv tilmelding til et fremtidigt uddannelsesarrangement.", icon: "education", unit: "HCP'er", counts: [18, 14, 9, 11, 7, 4] },
  { id: "HOME-S09", label: "HCP'er med webinardeltagelse", horizon: "År til dato", explanation: "Unikke HCP'er med registreret webinardeltagelse i 2026. Deltagelse er ikke det samme som tilmelding.", icon: "globe", unit: "HCP'er", counts: [32, 26, 17, 20, 14, 8] },
  { id: "HOME-S10", label: "KAM'er med mindst 60 % A/B-møder", horizon: "Seneste 30 dage", explanation: "Medarbejdere, hvor mindst 60 % af de registrerede møder vedrører HCO'er i kategori A eller B. Medarbejdere uden møder tælles ikke med.", icon: "calendar", unit: "KAM'er", counts: [1, 1, 0, 1, 0, 0] },
];
export const homepageSignalCount = (signal: typeof homepageSignals[number], employee = "all") => employee === "all" ? signal.counts.reduce((sum, n) => sum + n, 0) : signal.counts[teamMembers.findIndex(m => m.slug === employee)] ?? 0;

export const regionalThemeCoverage = { analyzed: 170, completed: teamTotals.documented, previousAnalyzed: 150 };
export const regionalThemes = [
  { id: "REG-T01", label: "Pris og økonomiske barrierer", description: "Spørgsmål om udgiften til Dose 1 og ressourcerne i et ikke-kirurgisk appendicitisforløb.", count: 32, previous: 14, examples: ["Hvordan sammenlignes udgifter til Dose 1 og operation i vores lokale forløb?", "Hvem betaler for den ekstra opfølgning efter medicinsk behandling?"] },
  { id: "REG-T02", label: "Samarbejde med industrien", description: "Ønske om gennemsigtige rammer for materialer og uddannelse fra OdaPharm.", count: 8, previous: 3, examples: ["Vi ønsker en tydelig adskillelse mellem uddannelse og produktpræsentation.", "Kan vi få dokumentationen uden at deltage i et sponsoreret arrangement?"] },
  { id: "REG-T03", label: "Behandlingseffekt og valg af forløb", description: "Nogle læger foretrækker operation og efterspørger mere dokumentation for Dose 1.", count: 17, previous: 5, examples: ["Operation er vores etablerede standard ved appendicitis.", "Hvilke kriterier afgør, om vi vælger Dose 1 eller kirurgisk behandling?"] },
  { id: "REG-T04", label: "Praktisk opstart og opfølgning", description: "Spørgsmål om arbejdsgange, patientdialog og ansvar for opfølgning.", count: 16, previous: 9, examples: ["Hvem har ansvaret, hvis symptomerne ikke aftager?", "Vi mangler en fælles vejledning til opstart af Dose 1."] },
];
// Explicit source examples, not a complete list of every counted debrief.
export const regionalThemeSources = [
  { id: "REG-D001", themeId: "REG-T01", speaker: "HCP 001", organization: "Demo-klinik 001", employeeSlug: "christian", date: "2026-09-29", time: "10:30", quote: regionalThemes[0].examples[0], note: "Mødet handlede om det fiktive Dose 1-forløb ved appendicitis. HCP 001 spurgte til sammenligningen af lokale omkostninger ved medicinsk behandling og operation. Der blev ikke aftalt ændringer i behandlingspraksis. Næste skridt: KAM sender det tilgængelige demomateriale om ressourceforbrug." },
  { id: "REG-D002", themeId: "REG-T01", speaker: "HCP 002", organization: "Demo-klinik 002", employeeSlug: "sofie", date: "2026-09-24", time: "14:00", quote: regionalThemes[0].examples[1], note: "HCP 002 efterspurgte afklaring af finansiering og ansvar for opfølgning i et muligt Dose 1-forløb. Udsagnet blev noteret som en økonomisk bekymring, ikke som en afvisning af behandling. Næste skridt: KAM samler spørgsmålene til en opfølgende dialog." },
  { id: "REG-D003", themeId: "REG-T02", speaker: "HCP 003", organization: "Demo-klinik 003", employeeSlug: "nanna", date: "2026-09-28", time: "09:15", quote: regionalThemes[1].examples[0], note: "I dialogen om OdaPharm-materialer ønskede HCP 003 gennemsigtige rammer for uddannelse. HCP'en understregede, at uddannelse og produktpræsentation skal holdes adskilt. Næste skridt: KAM afklarer rammerne før et nyt arrangement." },
  { id: "REG-D004", themeId: "REG-T02", speaker: "HCP 004", organization: "Demo-klinik 004", employeeSlug: "mikkel", date: "2026-09-18", time: "11:00", quote: regionalThemes[1].examples[1], note: "HCP 004 ønskede adgang til dokumentation om det fiktive Dose 1 uafhængigt af sponsorerede arrangementer. Der blev ikke registreret en tilmelding. Næste skridt: KAM sender en oversigt over tilgængeligt demomateriale." },
  { id: "REG-D005", themeId: "REG-T03", speaker: "HCP 005", organization: "Demo-klinik 005", employeeSlug: "christian", date: "2026-10-01", time: "13:30", quote: regionalThemes[2].examples[0], note: "HCP 005 beskrev operation som den etablerede lokale standard ved appendicitis. HCP'en efterspurgte mere dokumentation, før et medicinsk Dose 1-forløb kunne drøftes. Der blev ikke indgået en aftale om brug af Dose 1. Næste skridt: KAM følger op på dokumentationsbehovet." },
  { id: "REG-D006", themeId: "REG-T03", speaker: "HCP 006", organization: "Demo-klinik 006", employeeSlug: "sofie", date: "2026-09-22", time: "10:00", quote: regionalThemes[2].examples[1], note: "HCP 006 spurgte til kriterier for valg mellem det fiktive Dose 1 og kirurgisk behandling. Dialogen afdækkede et behov for en tydelig beskrivelse af patientudvælgelse. Næste skridt: KAM indsamler de konkrete spørgsmål til en faglig opfølgning." },
  { id: "REG-D007", themeId: "REG-T04", speaker: "HCP 007", organization: "Demo-klinik 007", employeeSlug: "mikkel", date: "2026-09-30", time: "15:00", quote: regionalThemes[3].examples[0], note: "HCP 007 rejste et spørgsmål om ansvar ved vedvarende symptomer i et muligt medicinsk appendicitisforløb. Der mangler lokal afklaring af opfølgning. Næste skridt: KAM aftaler en dialog om organisering uden at give patientrettet behandlingsvejledning." },
  { id: "REG-D008", themeId: "REG-T04", speaker: "HCP 008", organization: "Demo-klinik 008", employeeSlug: "nanna", date: "2026-09-16", time: "09:30", quote: regionalThemes[3].examples[1], note: "HCP 008 efterspurgte en fælles vejledning til det fiktive Dose 1-forløb. Dialogen handlede om koordinering, patientinformation og opfølgningsansvar. Næste skridt: KAM afklarer, hvilke materialer der er brug for." },
];
export const homepageQuality = {
  assessed: teamTotals.qualityN,
  weeks: [{ week: 37, score: 7.1 }, { week: 38, score: 7.3 }, { week: 39, score: 7.7 }, { week: 40, score: 7.6 }],
  reviews: [
    { week: 39, score: 7.7, highlight: "Formål og næste skridt er tydeligt beskrevet i de vurderede noter.", improvement: "Angiv, hvem der følger op, og hvornår opfølgningen forventes." },
    { week: 40, score: 7.6, highlight: "Noterne beskriver konkrete spørgsmål om Dose 1 og valg mellem medicinsk behandling og operation.", improvement: "Gør forskellen mellem kundens indvending og det aftalte næste skridt tydeligere." },
  ],
};
