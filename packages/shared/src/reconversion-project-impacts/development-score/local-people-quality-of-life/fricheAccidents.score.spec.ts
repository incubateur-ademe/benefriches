import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AggregatedProjectImpactMetric } from "../../projectImpacts.types";
import type { LetterGrade } from "../scoring.helpers";
import { getFricheAccidentsScore } from "./fricheAccidents.score";

const testCasesGradeA = [
  {
    aggregatedReconversionImpactMetrics: [
      { total: 1, name: "avoidedFricheAccidentsDeaths" },
      { total: 40, name: "avoidedFricheAccidentsMinorInjuries" },
      { total: 25, name: "avoidedFricheAccidentsSevereInjuries" },
    ],
    expectedMetrics: { avoidedFricheAccidents: 66 },
  },
  {
    aggregatedReconversionImpactMetrics: [
      { total: 25, name: "avoidedFricheAccidentsSevereInjuries" },
    ],
    expectedMetrics: { avoidedFricheAccidents: 25 },
  },
] satisfies TestData[];

const testCasesNoScore = [
  {
    aggregatedReconversionImpactMetrics: [],
    expectedMetrics: undefined,
  },
  {
    aggregatedReconversionImpactMetrics: [
      { total: 25000, name: "avoidedTrafficCo2EqEmissions" },
      { total: 3, name: "conversionFullTimeJobs" },
    ],
    expectedMetrics: undefined,
  },
] satisfies TestData[];

type TestData = {
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[];
  expectedMetrics: { avoidedFricheAccidents: number } | undefined;
};

const assertTestData = (testData: TestData, letterGrade: LetterGrade) => {
  const dataDesc =
    testData.aggregatedReconversionImpactMetrics.length === 0
      ? "no impacts data"
      : `impacts metrics ${testData.aggregatedReconversionImpactMetrics.map((item) => `${item.name} -> ${item.total} t`).join(", ")}`;

  it(`returns ${letterGrade} grade for ${dataDesc}`, () => {
    const result = getFricheAccidentsScore(testData.aggregatedReconversionImpactMetrics);
    assert.strictEqual(result?.letterGrade, letterGrade);
    assert.strictEqual(
      result?.metrics.avoidedFricheAccidents,
      testData.expectedMetrics?.avoidedFricheAccidents,
    );
  });
};

describe("fricheAccidents score", () => {
  for (const testData of testCasesGradeA) {
    assertTestData(testData, "A");
  }

  for (const testData of testCasesNoScore) {
    const dataDesc =
      testData.aggregatedReconversionImpactMetrics.length === 0
        ? "no impacts data"
        : `impacts metrics ${testData.aggregatedReconversionImpactMetrics.map((item) => `${item.name} -> ${item.total} t`).join(", ")}`;

    it(`returns undefined for ${dataDesc}`, () => {
      const result = getFricheAccidentsScore(testData.aggregatedReconversionImpactMetrics);
      assert.strictEqual(result, undefined);
    });
  }
});
