export type PlanGoal = { customer: string; remaining: number; bookedPhysical: number };

// Match bookings to remaining customer goals, never to the raw calendar total.
export const summarizePlan = (goals: PlanGoal[]) => {
  const remaining = goals.reduce((sum, goal) => sum + Math.max(0, goal.remaining), 0);
  const booked = goals.reduce((sum, goal) => sum + Math.min(Math.max(0, goal.remaining), Math.max(0, goal.bookedPhysical)), 0);
  return { remaining, booked, unbooked: remaining - booked };
};

// Calendar-day pace; this is conditional capacity, not future bookings or completed goals.
export function projectPlanPace(done: number, target: number, eligibleBookings: number, windowDays: number, remainingDays: number) {
  if (windowDays <= 0 || remainingDays < 0 || target <= 0) return null;
  const remaining = Math.max(0, target - done);
  const dailyPace = Math.max(0, eligibleBookings) / windowDays;
  const additionalCapacity = Math.floor(dailyPace * remainingDays);
  const projected = Math.min(target, done + additionalCapacity);
  return { dailyPace, additionalCapacity, projected, percent: Math.round(projected / target * 100), shortfall: Math.max(0, target - projected), daysToTarget: remaining === 0 ? 0 : dailyPace > 0 ? Math.ceil(remaining / dailyPace) : null };
}