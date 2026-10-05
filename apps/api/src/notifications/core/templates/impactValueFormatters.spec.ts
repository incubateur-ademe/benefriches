import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatCO2Impact,
  formatMonetaryImpact,
  formatNumberFr,
  formatPercentage,
  formatPerFrenchPersonAnnualEquivalent,
  formatSurfaceArea,
} from "./impactValueFormatters";

// Expected strings are the web app's outputs: U+202F groups thousands, U+00A0 precedes a unit.
const NNBSP = " ";
const NBSP = " ";

describe("impact value formatters", () => {
  it("formats a monetary impact rounded to the euro, signed except for zero", () => {
    assert.deepStrictEqual([1087355, -45000, 0, 12.6].map(formatMonetaryImpact), [
      `+1${NNBSP}087${NNBSP}355${NBSP}€`,
      `-45${NNBSP}000${NBSP}€`,
      `0${NBSP}€`,
      `+13${NBSP}€`,
    ]);
  });

  it("formats a CO2 impact to one decimal, without a sign", () => {
    assert.deepStrictEqual([1234.56, -12].map(formatCO2Impact), [
      `1${NNBSP}234,6${NBSP}t`,
      `12${NBSP}t`,
    ]);
  });

  it("formats a surface area to two decimals in square metres", () => {
    assert.deepStrictEqual([20000, 1234.567].map(formatSurfaceArea), [
      `20${NNBSP}000 ㎡`,
      `1${NNBSP}234,57 ㎡`,
    ]);
  });

  it("formats a percentage rounded to an integer", () => {
    assert.deepStrictEqual([12.6, -4.4].map(formatPercentage), ["13%", "-4%"]);
  });

  it("formats a number of French people to one decimal under one, to an integer above", () => {
    assert.deepStrictEqual([0.45, 134.4].map(formatPerFrenchPersonAnnualEquivalent), [
      "0,5",
      "134",
    ]);
  });

  it("formats an invalid number as the web does", () => {
    assert.strictEqual(formatNumberFr(NaN), "Valeur invalide");
  });
});
