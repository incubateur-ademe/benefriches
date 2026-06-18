import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { sumList, sumObjectValues } from "./sum.js";

describe("sum util", () => {
  describe("sumObjectValues", () => {
    const testCases = [
      { input: {}, output: 0 },
      { input: { a: 1, b: 2, c: 3 }, output: 6 },
      { input: { a: 10, b: 15, c: undefined }, output: 25 },
    ];

    for (const { input, output } of testCases) {
      it(`returns ${output} for ${JSON.stringify(input)}`, () => {
        // @ts-expect-error invalid input
        assert.strictEqual(sumObjectValues(input), output);
      });
    }
  });

  describe("sumList", () => {
    const testCases = [
      { input: [], output: 0 },
      { input: [10, 50, 100, 0], output: 160 },
    ];

    for (const { input, output } of testCases) {
      it(`returns ${output} for ${JSON.stringify(input)}`, () => {
        assert.strictEqual(sumList(input), output);
      });
    }
  });
});
