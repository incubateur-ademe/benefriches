import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatCO2Impact, formatMonetaryImpact } from "./formatImpactValue";

// Intl's fr-FR output: U+202F groups thousands; a U+00A0 precedes the unit.
const NNBSP = " ";
const NBSP = " ";

describe("formatMonetaryImpact", () => {
  it("rounds to the euro and signs the value, except zero", () => {
    assert.deepStrictEqual(
      [123000.456, -345.67, 0].map((value) => formatMonetaryImpact(value)),
      [`+123${NNBSP}000${NBSP}€`, `-346${NBSP}€`, `0${NBSP}€`],
    );
  });

  it("drops the sign when asked to", () => {
    assert.deepStrictEqual(
      [789, -789].map((value) => formatMonetaryImpact(value, { withSignPrefix: false })),
      [`789${NBSP}€`, `789${NBSP}€`],
    );
  });
});

describe("formatCO2Impact", () => {
  it("rounds to one decimal in tons and signs the value", () => {
    assert.deepStrictEqual(
      [123000.456, -345.678].map((value) => formatCO2Impact(value)),
      [`+123${NNBSP}000,5${NBSP}t`, `-345,7${NBSP}t`],
    );
  });

  it("drops the sign when asked to", () => {
    assert.deepStrictEqual(
      [789, -12].map((value) => formatCO2Impact(value, { withSignPrefix: false })),
      [`789${NBSP}t`, `12${NBSP}t`],
    );
  });
});
