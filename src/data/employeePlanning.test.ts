import { describe, test } from "node:test";
import { deepStrictEqual } from "node:assert";
import { summarizePlan } from "./employeePlanning";
import { upcoming28, employeePlanGoals } from "./managerDemo";

describe("Contact plan and upcoming meetings", () => {
  test("the five upcoming week counts sum to the requested 27 meetings at 27 customers", () => {
    deepStrictEqual(upcoming28.weeks.map(([, count]) => count), [3, 5, 7, 9, 3]);
    deepStrictEqual([upcoming28.weeks.reduce((sum, [, count]) => sum + count, 0), upcoming28.meetings, upcoming28.customers], [27, 27, 27]);
  });
  test("the demo identifies six outstanding visits not yet booked", () => {
    deepStrictEqual(summarizePlan(employeePlanGoals), { remaining: 18, booked: 12, unbooked: 6 });
  });
  test("only physical bookings matching outstanding customer goals count toward the plan", () => {
    deepStrictEqual(summarizePlan([{ customer: "HCO 001", remaining: 1, bookedPhysical: 3 }, { customer: "HCO 002", remaining: 0, bookedPhysical: 2 }]), { remaining: 1, booked: 1, unbooked: 0 });
  });
  test("unbooked goals remain visible even when the calendar has other meetings", () => {
    deepStrictEqual(summarizePlan([{ customer: "HCO 001", remaining: 2, bookedPhysical: 1 }, { customer: "HCO 002", remaining: 3, bookedPhysical: 0 }]), { remaining: 5, booked: 1, unbooked: 4 });
  });
});