import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getBreakEvenHorizon } from "./breakEvenHorizon";

describe("getBreakEvenHorizon", () => {
  it("is positive from the first year when break-even is the first projection year", () => {
    const projectionYears = ["2026", "2027", "2028", "2029", "2030"];

    const horizon = getBreakEvenHorizon({ breakEvenYear: "2026", projectionYears });

    assert.deepStrictEqual(horizon, { status: "positiveFromFirstYear", breakEvenYear: "2026" });
  });

  it("counts the years until break-even", () => {
    const projectionYears = ["2026", "2027", "2028", "2029", "2030"];

    const horizon = getBreakEvenHorizon({ breakEvenYear: "2029", projectionYears });

    assert.deepStrictEqual(horizon, {
      status: "compensated",
      breakEvenYear: "2029",
      yearsToBreakEven: 3,
    });
  });

  it("counts the years until break-even when it is the last projection year", () => {
    const projectionYears = ["2026", "2027", "2028", "2029", "2030"];

    const horizon = getBreakEvenHorizon({ breakEvenYear: "2030", projectionYears });

    assert.deepStrictEqual(horizon, {
      status: "compensated",
      breakEvenYear: "2030",
      yearsToBreakEven: 4,
    });
  });

  it("is not compensated without a break-even year", () => {
    const projectionYears = ["2026", "2027", "2028", "2029", "2030"];

    const horizon = getBreakEvenHorizon({ breakEvenYear: undefined, projectionYears });

    assert.deepStrictEqual(horizon, {
      status: "notCompensatedWithinPeriod",
      breakEvenYear: undefined,
    });
  });

  it("is not compensated with an empty break-even year", () => {
    const projectionYears = ["", "2026", "2027"];

    const horizon = getBreakEvenHorizon({ breakEvenYear: "", projectionYears });

    assert.deepStrictEqual(horizon, { status: "notCompensatedWithinPeriod", breakEvenYear: "" });
  });

  it("is not compensated when break-even falls after the projection years", () => {
    const projectionYears = ["2026", "2027", "2028", "2029", "2030"];

    const horizon = getBreakEvenHorizon({ breakEvenYear: "2045", projectionYears });

    assert.deepStrictEqual(horizon, {
      status: "notCompensatedWithinPeriod",
      breakEvenYear: "2045",
    });
  });
});
