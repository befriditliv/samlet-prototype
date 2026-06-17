// Customer Compass — Novo DK segmentation add-on model.
// Categories are ranked 1 (healthiest) → 10 (lost). Movement toward a lower
// rank is a positive development, toward a higher rank is negative.

export interface CompassCategory {
  code: string; // "01" ... "10"
  rank: number; // 1 = healthiest
  name: string;
  color: string; // hex used for category swatches / charts
  /** Short description of what the category means. */
  meaning: string;
  /** Recommended action when an HCP currently sits in this category. */
  action: string;
}

export const COMPASS_CATEGORIES: CompassCategory[] = [
  {
    code: "01",
    rank: 1,
    name: "Stable",
    color: "#0F5E5A",
    meaning: "Reliable, well-served relationship with consistent engagement.",
    action: "Maintain cadence with light-touch value updates and protect the relationship.",
  },
  {
    code: "02",
    rank: 2,
    name: "Active",
    color: "#1A8C82",
    meaning: "Engaged and responsive, actively interacting with content and visits.",
    action: "Keep momentum — share relevant new data and reinforce key messages.",
  },
  {
    code: "03",
    rank: 3,
    name: "New customer",
    color: "#3FC9C0",
    meaning: "Recently onboarded, relationship is still forming.",
    action: "Onboard properly, map needs and establish a regular contact rhythm.",
  },
  {
    code: "04",
    rank: 4,
    name: "Reactivated customer",
    color: "#A7E8E0",
    meaning: "Re-engaged after a quiet period.",
    action: "Rebuild trust, confirm renewed needs and lock in a next step.",
  },
  {
    code: "05",
    rank: 5,
    name: "Unexplored potential",
    color: "#A9C7EB",
    meaning: "Promising but under-engaged — potential not yet realized.",
    action: "Book a discovery meeting to map potential and qualify interest.",
  },
  {
    code: "06",
    rank: 6,
    name: "Pending needs",
    color: "#E5A823",
    meaning: "Has open needs or commitments awaiting follow-up.",
    action: "Address the open needs and follow up on outstanding commitments.",
  },
  {
    code: "07",
    rank: 7,
    name: "Need's attention",
    color: "#E8654E",
    meaning: "Engagement is slipping and requires a deliberate check-in.",
    action: "Prioritize a check-in to understand friction before it escalates.",
  },
  {
    code: "08",
    rank: 8,
    name: "At risk",
    color: "#D6608E",
    meaning: "Clear signs of disengagement — relationship is in jeopardy.",
    action: "Urgent re-engagement: address concerns and objections directly.",
  },
  {
    code: "09",
    rank: 9,
    name: "Churned",
    color: "#9B1D54",
    meaning: "Effectively disengaged with little to no recent activity.",
    action: "Build a win-back plan and understand the root cause of the drop-off.",
  },
  {
    code: "10",
    rank: 10,
    name: "Lost customer",
    color: "#C81E1E",
    meaning: "No active relationship; treated as lost.",
    action: "Assess win-back viability — keep low priority unless new signals appear.",
  },
];

export type CompassTrend = "positive" | "negative" | "neutral";

export interface CompassMovement {
  from: CompassCategory;
  to: CompassCategory;
  trend: CompassTrend;
  /** Human-readable period of the change. */
  changedAt: string;
}

const byName = (name: string): CompassCategory => {
  const found = COMPASS_CATEGORIES.find(
    (c) => c.name.toLowerCase() === name.toLowerCase(),
  );
  return found ?? COMPASS_CATEGORIES[0];
};

export const getTrend = (from: CompassCategory, to: CompassCategory): CompassTrend => {
  if (to.rank < from.rank) return "positive";
  if (to.rank > from.rank) return "negative";
  return "neutral";
};

const makeMovement = (fromName: string, toName: string, changedAt: string): CompassMovement => {
  const from = byName(fromName);
  const to = byName(toName);
  return { from, to, trend: getTrend(from, to), changedAt };
};

// Mock per-HCP movements (keyed by HCP/doctor name). Falls back to a
// deterministic movement so every HCP shows a plausible Customer Compass label.
const NAMED_MOVEMENTS: Record<string, CompassMovement> = {
  "Dr. Sarah Johnson": makeMovement("Pending needs", "At risk", "This month"),
  "Dr. Michael Chen": makeMovement("Unexplored potential", "Active", "This month"),
  "Dr. Emily Rodriguez": makeMovement("Active", "Active", "This month"),
};

const FALLBACK_PAIRS: Array<[string, string]> = [
  ["At risk", "Need's attention"],
  ["Unexplored potential", "Active"],
  ["Pending needs", "At risk"],
  ["New customer", "Active"],
  ["Stable", "Stable"],
  ["Active", "Pending needs"],
];

export const getCompassMovement = (name: string): CompassMovement => {
  if (NAMED_MOVEMENTS[name]) return NAMED_MOVEMENTS[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const [from, to] = FALLBACK_PAIRS[hash % FALLBACK_PAIRS.length];
  return makeMovement(from, to, "This month");
};

export const trendLabel = (trend: CompassTrend): string =>
  trend === "positive" ? "Positive move" : trend === "negative" ? "Negative move" : "No change";

/** Action guidance for a from → to movement. */
export const getCompassGuidance = (m: CompassMovement): { whatHappened: string; whatToDo: string } => {
  if (m.trend === "neutral") {
    return {
      whatHappened: `Customer Compass is holding steady at “${m.to.name}”. ${m.to.meaning}`,
      whatToDo: m.to.action,
    };
  }
  const verb = m.trend === "positive" ? "improved" : "declined";
  return {
    whatHappened: `Customer Compass ${verb} from “${m.from.name}” to “${m.to.name}”. ${m.to.meaning}`,
    whatToDo: m.to.action,
  };
};
