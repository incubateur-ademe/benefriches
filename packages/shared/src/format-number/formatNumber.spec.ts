import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatNumberFr,
  formatPercentage,
  formatPerFrenchPersonAnnualEquivalent,
  formatSurfaceArea,
} from "./formatNumber";

// Intl's fr-FR output: U+202F groups thousands. It must read the same in Node and browsers.
const NNBSP = " ";

describe("formatNumberFr", () => {
  it("prints 'Valeur invalide' for a value that is not a number", () => {
    assert.strictEqual(formatNumberFr(NaN), "Valeur invalide");
  });

  const cases = [
    { input: 10, output: "10" },
    { input: 150, output: "150" },
    { input: 1590000, output: `1${NNBSP}590${NNBSP}000` },
    { input: 12.345, output: "12,35" },
  ];
  for (const { input, output } of cases) {
    it(`prints ${input} as ${output}`, () => {
      assert.strictEqual(formatNumberFr(input), output);
    });
  }
});

describe("formatSurfaceArea", () => {
  it("formats a surface area to two decimals in square metres, after a regular space", () => {
    assert.deepStrictEqual(
      [20000, 1234.567].map((value) => formatSurfaceArea(value)),
      [`20${NNBSP}000 ㎡`, `1${NNBSP}234,57 ㎡`],
    );
  });
});

describe("formatPercentage", () => {
  it("rounds a percentage to an integer", () => {
    assert.deepStrictEqual(
      [12.6, -4.4].map((value) => formatPercentage(value)),
      ["13%", "-4%"],
    );
  });
});

describe("formatPerFrenchPersonAnnualEquivalent", () => {
  it("rounds to one decimal up to one person", () => {
    assert.strictEqual(formatPerFrenchPersonAnnualEquivalent(0.45), "0,5");
  });

  it("rounds to an integer above one person", () => {
    assert.strictEqual(formatPerFrenchPersonAnnualEquivalent(134.4), "134");
  });
});
