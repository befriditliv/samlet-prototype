export type PeriodKey = "30d" | "90d" | "ytd" | "custom";
export type DemoScenario = "normal" | "loading" | "no-activity" | "error" | "not-assessed" | "partial" | "no-plan" | "imported-docs" | "unknown-meeting" | "missing-segment" | "old-training" | "incomplete" | "prep-error";

export const periodOptions = [
  { key: "30d" as PeriodKey, label: "Seneste 30 dage", range: "3. sep – 2. okt 2026" },
  { key: "90d" as PeriodKey, label: "90 dage", range: "5. jul – 2. okt 2026" },
  { key: "ytd" as PeriodKey, label: "År til dato", range: "1. jan – 2. okt 2026" },
  { key: "custom" as PeriodKey, label: "Tilpasset", range: "Vælg start- og slutdato" },
];

export const teamMembers = [
  { name: "Jonas Birk", initials: "JB", slug: "jonas-birk", role: "KAM", district: "Nordbro", contacts: 62, hcos: "34 / 71", documentation: "58 / 62", quality: "6,8", qualityN: 39, attention: "4 A-kunder uden kommende registreret møde", scenario: "normal" },
  { name: "Sara Lund", initials: "SL", slug: "sara-lund", role: "KAM", district: "Vestbro", contacts: 54, hcos: "31 / 68", documentation: "47 / 54", quality: "6,6", qualityN: 35, attention: "3 færdige debriefs er klar, men ikke sendt", scenario: "normal" },
  { name: "Mikkel Hauge", initials: "MH", slug: "mikkel-hauge", role: "KAM", district: "Søholm", contacts: 0, hcos: "0 / 55", documentation: "Ikke relevant", quality: "Ikke vurderet", qualityN: null, attention: "Ingen registrerede kontakter i perioden", scenario: "no-activity" },
  { name: "Nanna Riis", initials: "NR", slug: "nanna-riis", role: "MSL", district: "Nordbro", contacts: 49, hcos: "29 / 64", documentation: "41 / 49", quality: "Kunne ikke hente", qualityN: null, attention: "Kvalitetsdata kunne ikke hentes", scenario: "error" },
  { name: "Tobias Krogh", initials: "TK", slug: "tobias-krogh", role: "KAM", district: "Rønnevang", contacts: 45, hcos: "27 / 70", documentation: "38 / 45", quality: "6,1", qualityN: 31, attention: "Ingen kontaktplan tilgængelig", scenario: "no-plan" },
  { name: "Ida Mørk", initials: "IM", slug: "ida-mork", role: "MSL", district: "Vestbro", contacts: 48, hcos: "27 / 64", documentation: "14 / 48", quality: "6,0", qualityN: 27, attention: "Dokumentationen er importeret fra CRM", scenario: "imported-docs" },
] as const;

export const signals = [
  { id: "SIG-001", name: "Lægehuset Nordbro", type: "HCO", segment: "A", reason: "Ingen registreret kontakt i 6 måneder", reasons: ["Ingen registreret kontakt i 6 måneder"], horizon: "6 måneder", last: "14. apr · fysisk", meeting: "none", next: "Intet kommende registreret" },
  { id: "SIG-002", name: "Dr. Agnes Thorup", type: "HCP", segment: "B", reason: "Webinardeltagelse uden registreret opfølgning", reasons: ["Webinardeltagelse uden registreret opfølgning"], horizon: "30 dage", last: "11. sep · telefon", meeting: "own", next: "Du har møde 9. okt" },
  { id: "SIG-003", name: "Rønnevang Sundhedshus", type: "HCO", segment: "A", reason: "2 signaler", reasons: ["Ingen registreret kontakt i 3 måneder", "Nyt klinisk materiale er set uden efterfølgende kontakt"], horizon: "3 måneder / 30 dage", last: "2. jul · virtuelt", meeting: "colleague", next: "Sara Lund har møde 21. okt" },
  { id: "SIG-004", name: "Dr. Peter Vang", type: "HCP", segment: "C", reason: "Intet registreret samtykke", reasons: ["Intet registreret samtykke"], horizon: "Aktuelt snapshot", last: "Sidste kontakt ukendt", meeting: "unknown", next: "Mødedata utilgængelig" },
  { id: "SIG-005", name: "Klinik Vestbro", type: "HCO", segment: "Ukendt", reason: "Ingen registreret kontakt i 6 måneder", reasons: ["Ingen registreret kontakt i 6 måneder"], horizon: "6 måneder", last: "3. maj · fysisk", meeting: "outside", next: "3. dec · uden for 28 dage" },
] as const;

export const customers = [
  { name: "Lægehuset Nordbro", type: "HCO", segment: "A", last: "14. apr", contacts: 0, channel: "Fysisk", next: "Intet kommende registreret" },
  { name: "Rønnevang Sundhedshus", type: "HCO", segment: "A", last: "2. jul", contacts: 1, channel: "Virtuelt", next: "21. okt · Sara Lund" },
  { name: "Klinik Vestbro", type: "HCO", segment: "Ukendt", last: "3. maj", contacts: 0, channel: "Fysisk", next: "3. dec · uden for 28 dage" },
  { name: "Søholm Klinikhus", type: "HCO", segment: "B", last: "18. sep", contacts: 3, channel: "Fysisk", next: "9. okt · Jonas Birk" },
] as const;

export const districts = [
  { name: "Vestbro", coverage: "4 / 22", missing: 14 },
  { name: "Uden distrikt", coverage: "9 / 13", missing: 5 },
  { name: "Nordbro", coverage: "12 / 19", missing: 4 },
  { name: "Rønnevang", coverage: "9 / 14", missing: 3 },
  { name: "Søholm", coverage: "0 / 3", missing: 3 },
] as const;

export const themes = [
  { id: "TEMA-01", label: "Opstart af Dose 1 i praksis", product: "Dose 1", count: 14, share: "27 %", customers: 11, change: "+6 pp", examples: ["Hvordan indpasses Dose 1 i det akutte appendicitisforløb?", "Hvilke patienter kan vurderes til medicinsk behandling frem for kirurgi?"] },
  { id: "TEMA-02", label: "Patientudvælgelse", product: "Dose 1", count: 9, share: "18 %", customers: 8, change: "−2 pp", examples: ["Hvilke kliniske kriterier er vigtigst ved patientudvælgelsen?", "Hvornår er kirurgi fortsat det foretrukne valg?"] },
  { id: "TEMA-03", label: "Opfølgning efter behandling", product: "Dose 1", count: 7, share: "14 %", customers: 7, change: null, examples: ["Hvad skal den første opfølgning indeholde?", "Hvem har ansvaret mellem akutafdeling og klinik?"] },
  { id: "TEMA-04", label: "Kirurgisk behandlingspræference", product: "Dose 1", count: 5, share: "10 %", customers: 5, change: null, examples: ["Kirurgi er fortsat vores velkendte standardforløb.", "Teamet ønsker mere erfaring før arbejdsgangen ændres."] },
  { id: "TEMA-05", label: "Lokalt patientforløb", product: "Dose 1", count: 4, share: "8 %", customers: 4, change: "+1 pp", examples: ["Hvordan tilpasses det eksisterende appendicitisforløb?", "Hvilken afdeling ejer den efterfølgende kontrol?"] },
] as const;

export const oneToOnePoints = [
  { title: "Kundeprioritering", observation: "Lægehuset Nordbro og Klinik Vestbro har aktuelle signaler uden et kommende registreret møde inden for 28 dage.", question: "Hvilke kontaktmuligheder vil være mest relevante at drøfte sammen?", sources: "SIG-001, SIG-005 og kontakthistorik" },
  { title: "Kundernes spørgsmål", observation: "Opstart af Dose 1 i praksis optræder i 14 af 51 analyserede debriefs.", question: "Hvilke spørgsmål kræver fælles støtte eller materiale?", sources: "TEMA-01 og DEBRIEF-014, DEBRIEF-027, DEBRIEF-051" },
  { title: "Dokumentation", observation: "Tre debriefs er kladder, én kontakt er uden dokumentation, og to debriefs er klar, men ikke sendt.", question: "Er der noget i arbejdsgangen, som vil gøre dokumentationen lettere at afslutte?", sources: "DOC-001–DOC-006" },
] as const;

export const documentedStrength = "Jonas dokumenterer konsekvent kundens spørgsmål og næste kliniske afklaring i de vurderede debriefs.";