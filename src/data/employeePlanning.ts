export type PlanGoal = { customer: string; remaining: number; bookedPhysical: number };

// Match bookings to remaining customer goals, never to the raw calendar total.
export const summarizePlan = (goals: PlanGoal[]) => {
  const remaining = goals.reduce((sum, goal) => sum + Math.max(0, goal.remaining), 0);
  const booked = goals.reduce((sum, goal) => sum + Math.min(Math.max(0, goal.remaining), Math.max(0, goal.bookedPhysical)), 0);
  return { remaining, booked, unbooked: remaining - booked };
};