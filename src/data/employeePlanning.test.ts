import { describe, test } from "node:test";
import { deepStrictEqual } from "node:assert";
import { summarizePlan } from "./employeePlanning";

describe("Contact plan and upcoming meetings", () => {
  test("only physical bookings matching outstanding customer goals count toward the plan", () => {
    deepStrictEqual(summarizePlan([{ customer: "HCO 001", remaining: 1, bookedPhysical: 3 }, { customer: "HCO 002", remaining: 0, bookedPhysical: 2 }]), { remaining: 1, booked: 1, unbooked: 0 });
  });
  test("unbooked goals remain visible even when the calendar has other meetings", () => {
    deepStrictEqual(summarizePlan([{ customer: "HCO 001", remaining: 2, bookedPhysical: 1 }, { customer: "HCO 002", remaining: 3, bookedPhysical: 0 }]), { remaining: 5, booked: 1, unbooked: 4 });
  });
});