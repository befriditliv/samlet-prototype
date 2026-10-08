import { test } from "node:test";
import { deepStrictEqual } from "node:assert";
import { referenceSourceQuality } from "./managerReference";

test("homepage reference keeps IO Engage's 5.1 assessment separate from unavailable Jarvis scores", () => {
  deepStrictEqual(referenceSourceQuality.homepage.map(row => row.score), [null, 5.1, null]);
});
test("employee reference keeps the 7.6 IO Engage score and 78 assessed notes", () => {
  const ioEngage = referenceSourceQuality.employee.find(row => row.source === "IO Engage");
  deepStrictEqual([ioEngage?.score, ioEngage?.assessed], [7.6, 78]);
});