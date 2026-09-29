import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getPercentageDifference } from "./percentageDifference";

describe("getPercentageDifference", () => {
  const testCases = [
    { base: 200, evolution: 250, expected: 25 },
    { base: 200, evolution: 150, expected: -25 },
    { base: 0, evolution: 50, expected: 100 },
    { base: NaN, evolution: 10, expected: 0 },
    { base: 10, evolution: NaN, expected: 0 },
  ];

  for (const { base, evolution, expected } of testCases) {
    it(`returns ${expected} from ${base} to ${evolution}`, () => {
      assert.strictEqual(getPercentageDifference(base, evolution), expected);
    });
  }
});
