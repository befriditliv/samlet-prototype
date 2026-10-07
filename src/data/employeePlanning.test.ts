import { describe, expect, test } from "bun:test";
import { summarizePlan } from "./employeePlanning";

describe("Contact plan and upcoming meetings", () => {
  test("only physical bookings matching outstanding customer goals count toward the plan", () => {
    expect(summarizePlan([{ customer: "HCO 001", remaining: 1, bookedPhysical: 3 }, { customer: "HCO 002", remaining: 0, bookedPhysical: 2 }])).toEqual({ remaining: 1, booked: 1, unbooked: 0 });
  });
  test("unbooked goals remain visible even when the calendar has other meetings", () => {
    expect(summarizePlan([{ customer: "HCO 001", remaining: 2, bookedPhysical: 1 }, { customer: "HCO 002", remaining: 3, bookedPhysical: 0 }])).toEqual({ remaining: 5, booked: 1, unbooked: 4 });
  });
});