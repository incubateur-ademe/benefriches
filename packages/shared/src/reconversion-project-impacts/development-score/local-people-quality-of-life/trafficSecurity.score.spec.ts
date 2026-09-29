import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AggregatedProjectImpactMetric } from "../../projectImpacts.types";
import type { LetterScore } from "../scoring.helpers";
import { getTrafficSecurityScore } from "./trafficSecurity.score";

const testCasesGradeB = [
  {
    aggregatedReconversionImpactMetrics: [
      { total: 40, name: "avoidedTrafficAccidentsSevereInjuries" },
      { total: 4, name: "avoidedTrafficAccidentsDeaths" },
      { total: 25, name: "avoidedTrafficAccidentsMinorInjuries" },
    ],
    expectedMetrics: { avoidedTrafficAccidents: 69 },
  },
  {
    aggregatedReconversionImpactMetrics: [
      { total: 25, name: "avoidedTrafficAccidentsMinorInjuries" },
    ],
    expectedMetrics: { avoidedTrafficAccidents: 25 },
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
  expectedMetrics: { avoidedTrafficAccidents: number } | undefined;
};

const assertTestData = (testData: TestData, letterScore: LetterScore) => {
  const dataDesc =
    testData.aggregatedReconversionImpactMetrics.length === 0
      ? "no impacts data"
      : `impacts metrics ${testData.aggregatedReconversionImpactMetrics.map((item) => `${item.name} -> ${item.total} t`).join(", ")}`;

  it(`returns ${letterScore} grade for ${dataDesc}`, () => {
    const result = getTrafficSecurityScore(testData.aggregatedReconversionImpactMetrics);
    assert.strictEqual(result?.letterScore, letterScore);
    assert.strictEqual(
      result?.metrics.avoidedTrafficAccidents,
      testData.expectedMetrics?.avoidedTrafficAccidents,
    );
  });
};

describe("trafficSecurity score", () => {
  for (const testData of testCasesGradeB) {
    assertTestData(testData, "B");
  }

  for (const testData of testCasesNoScore) {
    const dataDesc =
      testData.aggregatedReconversionImpactMetrics.length === 0
        ? "no impacts data"
        : `impacts metrics ${testData.aggregatedReconversionImpactMetrics.map((item) => `${item.name} -> ${item.total} t`).join(", ")}`;

    it(`returns undefined for ${dataDesc}`, () => {
      const result = getTrafficSecurityScore(testData.aggregatedReconversionImpactMetrics);
      assert.strictEqual(result, undefined);
    });
  }
});
