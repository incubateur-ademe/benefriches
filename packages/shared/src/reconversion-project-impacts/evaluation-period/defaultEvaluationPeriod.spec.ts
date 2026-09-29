import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { DevelopmentPlanType } from "../../reconversion-projects";
import { getDefaultEvaluationPeriodInYears } from "./defaultEvaluationPeriod";

describe("getDefaultEvaluationPeriodInYears", () => {
  const testCases = [
    ["PHOTOVOLTAIC_POWER_PLANT", 30],
    ["URBAN_PROJECT", 50],
  ] satisfies [DevelopmentPlanType, number][];

  for (const [type, years] of testCases) {
    it(`opens a ${type} project on ${years} years`, () => {
      assert.strictEqual(getDefaultEvaluationPeriodInYears(type), years);
    });
  }
});
