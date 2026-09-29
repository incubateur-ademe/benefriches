import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { DevelopmentPlanType } from "../../../reconversion-projects";
import type { AggregatedProjectImpactMetric } from "../../projectImpacts.types";
import type { LetterScore } from "../scoring.helpers";
import { getAvoidedCo2EmissionsScore } from "./co2EqEmissions.score";

const testCasesGradeA = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [
      { total: 5500, name: "avoidedCO2TonsWithEnergyProduction" },
      { total: 2, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 5500, newStoredCo2Eq: 2 },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [
      { total: 4000, name: "avoidedCO2TonsWithEnergyProduction" },
      { total: 2, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 4000, newStoredCo2Eq: 2 },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionImpactMetrics: [
      { total: 4000, name: "avoidedAirConditioningCo2eqEmissions" },
      { total: 21, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 4000, newStoredCo2Eq: 21 },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionImpactMetrics: [
      { total: 450, name: "avoidedTrafficCo2EqEmissions" },
      { total: 15, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 450, newStoredCo2Eq: 15 },
  },
] satisfies TestData[];

const testCasesGradeB = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [
      { total: 5500, name: "avoidedCO2TonsWithEnergyProduction" },
      { total: -0.4, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 5500, newStoredCo2Eq: -0.4 },
  },

  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [
      { total: 4000, name: "avoidedCO2TonsWithEnergyProduction" },
      { total: -1, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 4000, newStoredCo2Eq: -1 },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [
      { total: 550, name: "avoidedCO2TonsWithEnergyProduction" },
      { total: -1, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 550, newStoredCo2Eq: -1 },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [
      { total: 550, name: "avoidedCO2TonsWithEnergyProduction" },
      { total: 0, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 550, newStoredCo2Eq: 0 },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionImpactMetrics: [
      { total: 3500, name: "avoidedTrafficCo2EqEmissions" },
      { total: 4, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 3500, newStoredCo2Eq: 4 },
  },
] satisfies TestData[];

const testCasesGradeC = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [
      { total: 5500, name: "avoidedCO2TonsWithEnergyProduction" },
      { total: -0.8, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 5500, newStoredCo2Eq: -0.8 },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [
      { total: 4000, name: "avoidedCO2TonsWithEnergyProduction" },
      { total: -1.5, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 4000, newStoredCo2Eq: -1.5 },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [
      { total: 450, name: "avoidedCO2TonsWithEnergyProduction" },
      { total: -0.5, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 450, newStoredCo2Eq: -0.5 },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [
      { total: 550, name: "avoidedCO2TonsWithEnergyProduction" },
      { total: -2, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 550, newStoredCo2Eq: -2 },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionImpactMetrics: [
      { total: 450, name: "avoidedTrafficCo2EqEmissions" },
      { total: -0.4, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 450, newStoredCo2Eq: -0.4 },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionImpactMetrics: [
      { total: 5500, name: "avoidedCO2TonsWithEnergyProduction" },
      { total: -0.4, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 5500, newStoredCo2Eq: -0.4 },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [],
    expectedMetrics: { avoidedCo2eqEmissions: 0, newStoredCo2Eq: 0 },
  },
] satisfies TestData[];

const testCasesGradeD = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [
      { total: 450, name: "avoidedCO2TonsWithEnergyProduction" },
      { total: -2, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 450, newStoredCo2Eq: -2 },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionImpactMetrics: [],
    expectedMetrics: { avoidedCo2eqEmissions: 0, newStoredCo2Eq: 0 },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionImpactMetrics: [
      { total: 3500, name: "avoidedTrafficCo2EqEmissions" },
      { total: -4, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 3500, newStoredCo2Eq: -4 },
  },
] satisfies TestData[];

const testCasesGradeE = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [
      { total: 0, name: "avoidedCO2TonsWithEnergyProduction" },
      { total: -2, name: "newStoredCo2Eq" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 0, newStoredCo2Eq: -2 },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionImpactMetrics: [
      { total: -2, name: "avoidedCO2TonsWithEnergyProduction" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: -2, newStoredCo2Eq: 0 },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionImpactMetrics: [{ total: -2, name: "newStoredCo2Eq" }],
    expectedMetrics: { avoidedCo2eqEmissions: 0, newStoredCo2Eq: -2 },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionImpactMetrics: [
      { total: -10, name: "newStoredCo2Eq" },
      { total: 5, name: "avoidedCO2TonsWithEnergyProduction" },
    ],
    expectedMetrics: { avoidedCo2eqEmissions: 5, newStoredCo2Eq: -10 },
  },
] satisfies TestData[];

type TestData = {
  projectDevelopmentPlanType: DevelopmentPlanType;
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[];
  expectedMetrics: { avoidedCo2eqEmissions: number; newStoredCo2Eq: number };
};

const assertTestData = (testData: TestData, letterScore: LetterScore) => {
  const dataDesc =
    testData.aggregatedReconversionImpactMetrics.length === 0
      ? "no impacts data"
      : `impacts metrics ${testData.aggregatedReconversionImpactMetrics.map((item) => `${item.name} -> ${item.total} t`).join(", ")}`;
  it(`returns ${letterScore} grade for ${testData.projectDevelopmentPlanType} with ${dataDesc}`, () => {
    const result = getAvoidedCo2EmissionsScore({
      projectDevelopmentPlanType: testData.projectDevelopmentPlanType,
      aggregatedReconversionImpactMetrics: testData.aggregatedReconversionImpactMetrics,
      siteStatuQuoImpactMetrics: [{ total: 10, name: "storedCo2Eq" }],
    });
    assert.strictEqual(result?.letterScore, letterScore);
    assert.strictEqual(
      result?.metrics.avoidedCo2eqEmissions,
      testData.expectedMetrics.avoidedCo2eqEmissions,
    );
    assert.strictEqual(result?.metrics.newStoredCo2Eq, testData.expectedMetrics.newStoredCo2Eq);
  });
};

describe("co2eqEmissions score", () => {
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

  for (const testData of testCasesGradeE) {
    assertTestData(testData, "E");
  }
});
