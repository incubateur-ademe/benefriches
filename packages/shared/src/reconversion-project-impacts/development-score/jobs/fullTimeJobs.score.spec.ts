import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { DevelopmentPlanType } from "../../../reconversion-projects";
import type { AggregatedProjectImpactMetric } from "../../projectImpacts.types";
import type { LetterScore } from "../scoring.helpers";
import { getFullTimeJobsScore } from "./fullTimeJobs.score";

const SITE_SURFACE_AREA = 10000;
const testCasesGradeA = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [
      { total: 5, name: "reinstatementFullTimeJobs" },
      { total: 10, name: "conversionFullTimeJobs" },
      { total: 40, name: "operationsFullTimeJobs" },
      { total: -1, name: "oldOperationsFullTimeJobsLoss" },
    ],
    expectedMetrics: {
      siteStatuQuoFullTimeJobs: 1,
      fullTimeJobsDifferenceByHectare: 54,
      difference: 54,
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionImpactMetrics: [
      { total: 5, name: "reinstatementFullTimeJobs" },
      { total: 20, name: "conversionFullTimeJobs" },
      { total: 40, name: "operationsFullTimeJobs" },
      { total: -5, name: "oldOperationsFullTimeJobsLoss" },
    ],
    expectedMetrics: {
      siteStatuQuoFullTimeJobs: 5,
      fullTimeJobsDifferenceByHectare: 60,
      difference: 60,
    },
  },
] satisfies TestData[];

const testCasesGradeB = [
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionImpactMetrics: [
      { total: 15, name: "conversionFullTimeJobs" },
      { total: 40, name: "operationsFullTimeJobs" },
      { total: -5, name: "oldOperationsFullTimeJobsLoss" },
    ],
    expectedMetrics: {
      siteStatuQuoFullTimeJobs: 5,
      fullTimeJobsDifferenceByHectare: 50,
      difference: 50,
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [
      { total: 5, name: "reinstatementFullTimeJobs" },
      { total: 10, name: "conversionFullTimeJobs" },
      { total: -1, name: "oldOperationsFullTimeJobsLoss" },
    ],
    expectedMetrics: {
      siteStatuQuoFullTimeJobs: 1,
      fullTimeJobsDifferenceByHectare: 14,
      difference: 14,
    },
  },
] satisfies TestData[];

const testCasesGradeC = [
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionImpactMetrics: [{ total: 0.15, name: "conversionFullTimeJobs" }],
    expectedMetrics: {
      siteStatuQuoFullTimeJobs: 0,
      fullTimeJobsDifferenceByHectare: 0.15,
      difference: 0.15,
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [],
    expectedMetrics: {
      siteStatuQuoFullTimeJobs: 0,
      fullTimeJobsDifferenceByHectare: 0,
      difference: 0,
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionImpactMetrics: [
      { total: 0.1, name: "conversionFullTimeJobs" },
      { total: -0.05, name: "oldOperationsFullTimeJobsLoss" },
    ],
    expectedMetrics: {
      siteStatuQuoFullTimeJobs: 0.05,
      fullTimeJobsDifferenceByHectare: 0.05,
      difference: 0.05,
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionImpactMetrics: [{ total: 0, name: "oldOperationsFullTimeJobsLoss" }],
    expectedMetrics: {
      siteStatuQuoFullTimeJobs: 0,
      fullTimeJobsDifferenceByHectare: 0,
      difference: 0,
    },
  },
] satisfies TestData[];

const testCasesGradeD = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [{ total: -1, name: "oldOperationsFullTimeJobsLoss" }],
    expectedMetrics: {
      siteStatuQuoFullTimeJobs: 1,
      fullTimeJobsDifferenceByHectare: -1,
      difference: -1,
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionImpactMetrics: [{ total: -5, name: "oldOperationsFullTimeJobsLoss" }],
    expectedMetrics: {
      siteStatuQuoFullTimeJobs: 5,
      fullTimeJobsDifferenceByHectare: -5,
      difference: -5,
    },
  },
] satisfies TestData[];

type TestData = {
  projectDevelopmentPlanType: DevelopmentPlanType;
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[];
  expectedMetrics: {
    fullTimeJobsDifferenceByHectare: number;
    difference: number;
    siteStatuQuoFullTimeJobs: number;
  };
};

const assertTestData = (testData: TestData, letterScore: LetterScore) => {
  const dataDesc =
    testData.aggregatedReconversionImpactMetrics.length === 0
      ? "no impacts data"
      : `impacts metrics ${testData.aggregatedReconversionImpactMetrics.map((item) => `${item.name} -> ${item.total} t`).join(", ")}`;

  it(`returns ${letterScore} grade for ${testData.projectDevelopmentPlanType} ${dataDesc}`, () => {
    const result = getFullTimeJobsScore({
      aggregatedReconversionImpactMetrics: testData.aggregatedReconversionImpactMetrics,
      siteSurfaceArea: SITE_SURFACE_AREA,
    });
    assert.strictEqual(result?.letterScore, letterScore);
    assert.strictEqual(
      result?.metrics.fullTimeJobsDifferenceByHectare,
      testData.expectedMetrics.fullTimeJobsDifferenceByHectare,
    );
    assert.strictEqual(result?.metrics.difference, testData.expectedMetrics.difference);
    assert.strictEqual(
      result?.metrics.siteStatuQuoFullTimeJobs,
      testData.expectedMetrics.siteStatuQuoFullTimeJobs,
    );
  });
};

describe("fullTimeJobs score", () => {
  for (const testData of testCasesGradeA) {
    assertTestData(testData, "A");
  }

  for (const testData of testCasesGradeB) {
    assertTestData(testData, "B");
  }

  for (const testData of testCasesGradeC) {
    assertTestData(testData, "C");
  }

  for (const testData of testCasesGradeD) {
    assertTestData(testData, "D");
  }
});
