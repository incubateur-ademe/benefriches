import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { type DevelopmentPlanType } from "../../../reconversion-projects";
import { type AggregatedReconversionIndirectEconomicImpactsDataView } from "../../projectImpacts.types";
import { type LetterScore } from "../scoring.helpers";
import { getEcosystemServicesScore } from "./ecosystemServices.score";

const testCasesGradeA = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionIndirectEconomicImpacts: [
      { total: 5500, name: "nitrogenCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: 500, name: "pollination", detailsByYear: [], cumulativeByYear: [] },
      { total: 200, name: "soilErosion", detailsByYear: [], cumulativeByYear: [] },
      { total: 282, name: "newStoredCo2Eq", detailsByYear: [], cumulativeByYear: [] },
      { total: 800, name: "waterCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: 2000, name: "forestRelatedProduct", detailsByYear: [], cumulativeByYear: [] },
      { total: 852, name: "invasiveSpeciesRegulation", detailsByYear: [], cumulativeByYear: [] },
    ],
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionIndirectEconomicImpacts: [
      { total: 5500, name: "nitrogenCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: 500, name: "pollination", detailsByYear: [], cumulativeByYear: [] },
      { total: 200, name: "soilErosion", detailsByYear: [], cumulativeByYear: [] },
      { total: 282, name: "newStoredCo2Eq", detailsByYear: [], cumulativeByYear: [] },
      { total: 800, name: "waterCycle", detailsByYear: [], cumulativeByYear: [] },
    ],
  },
] satisfies TestData[];

const testCasesGradeB = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionIndirectEconomicImpacts: [
      { total: 5500, name: "nitrogenCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: 500, name: "pollination", detailsByYear: [], cumulativeByYear: [] },
      { total: -200, name: "soilErosion", detailsByYear: [], cumulativeByYear: [] },
      { total: 282, name: "newStoredCo2Eq", detailsByYear: [], cumulativeByYear: [] },
      { total: 800, name: "waterCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: 2000, name: "forestRelatedProduct", detailsByYear: [], cumulativeByYear: [] },
      { total: 852, name: "invasiveSpeciesRegulation", detailsByYear: [], cumulativeByYear: [] },
    ],
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionIndirectEconomicImpacts: [
      { total: 5500, name: "nitrogenCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: -500, name: "pollination", detailsByYear: [], cumulativeByYear: [] },
      { total: 200, name: "soilErosion", detailsByYear: [], cumulativeByYear: [] },
      { total: 282, name: "newStoredCo2Eq", detailsByYear: [], cumulativeByYear: [] },
      { total: 800, name: "waterCycle", detailsByYear: [], cumulativeByYear: [] },
    ],
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionIndirectEconomicImpacts: [
      { total: 5500, name: "nitrogenCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: -500, name: "pollination", detailsByYear: [], cumulativeByYear: [] },
      { total: 282, name: "newStoredCo2Eq", detailsByYear: [], cumulativeByYear: [] },
    ],
  },
] satisfies TestData[];

const testCasesGradeC = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionIndirectEconomicImpacts: [
      { total: 5500, name: "nitrogenCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: -500, name: "pollination", detailsByYear: [], cumulativeByYear: [] },
    ],
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionIndirectEconomicImpacts: [
      { total: 5500, name: "nitrogenCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: -500, name: "pollination", detailsByYear: [], cumulativeByYear: [] },
      { total: 200, name: "soilErosion", detailsByYear: [], cumulativeByYear: [] },
      { total: 282, name: "newStoredCo2Eq", detailsByYear: [], cumulativeByYear: [] },
      { total: -852, name: "invasiveSpeciesRegulation", detailsByYear: [], cumulativeByYear: [] },
      { total: 800, name: "waterCycle", detailsByYear: [], cumulativeByYear: [] },
    ],
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionIndirectEconomicImpacts: [
      { total: 5500, name: "nitrogenCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: -500, name: "pollination", detailsByYear: [], cumulativeByYear: [] },
      { total: 282, name: "newStoredCo2Eq", detailsByYear: [], cumulativeByYear: [] },
      { total: -852, name: "invasiveSpeciesRegulation", detailsByYear: [], cumulativeByYear: [] },
    ],
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionIndirectEconomicImpacts: [
      { total: 5500, name: "nitrogenCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: 500, name: "pollination", detailsByYear: [], cumulativeByYear: [] },
      { total: 200, name: "soilErosion", detailsByYear: [], cumulativeByYear: [] },
      { total: -282, name: "newStoredCo2Eq", detailsByYear: [], cumulativeByYear: [] },
      { total: -800, name: "waterCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: -2000, name: "forestRelatedProduct", detailsByYear: [], cumulativeByYear: [] },
      { total: -852, name: "invasiveSpeciesRegulation", detailsByYear: [], cumulativeByYear: [] },
    ],
  },
] satisfies TestData[];

const testCasesGradeD = [
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionIndirectEconomicImpacts: [
      { total: 5500, name: "nitrogenCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: 500, name: "pollination", detailsByYear: [], cumulativeByYear: [] },
      { total: -200, name: "soilErosion", detailsByYear: [], cumulativeByYear: [] },
      { total: -282, name: "newStoredCo2Eq", detailsByYear: [], cumulativeByYear: [] },
      { total: -800, name: "waterCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: -2000, name: "forestRelatedProduct", detailsByYear: [], cumulativeByYear: [] },
      { total: -852, name: "invasiveSpeciesRegulation", detailsByYear: [], cumulativeByYear: [] },
    ],
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionIndirectEconomicImpacts: [
      { total: 5500, name: "nitrogenCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: -500, name: "pollination", detailsByYear: [], cumulativeByYear: [] },
      { total: -200, name: "soilErosion", detailsByYear: [], cumulativeByYear: [] },
      { total: -282, name: "newStoredCo2Eq", detailsByYear: [], cumulativeByYear: [] },
      { total: -800, name: "waterCycle", detailsByYear: [], cumulativeByYear: [] },
    ],
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionIndirectEconomicImpacts: [
      { total: -5500, name: "nitrogenCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: -500, name: "pollination", detailsByYear: [], cumulativeByYear: [] },
      { total: -200, name: "soilErosion", detailsByYear: [], cumulativeByYear: [] },
      { total: -282, name: "newStoredCo2Eq", detailsByYear: [], cumulativeByYear: [] },
      { total: -800, name: "waterCycle", detailsByYear: [], cumulativeByYear: [] },
    ],
  },
] satisfies TestData[];

const testCasesGradeE = [
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    aggregatedReconversionIndirectEconomicImpacts: [
      { total: -5500, name: "nitrogenCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: -500, name: "pollination", detailsByYear: [], cumulativeByYear: [] },
      { total: -200, name: "soilErosion", detailsByYear: [], cumulativeByYear: [] },
      { total: -282, name: "newStoredCo2Eq", detailsByYear: [], cumulativeByYear: [] },
      { total: -800, name: "waterCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: -2000, name: "forestRelatedProduct", detailsByYear: [], cumulativeByYear: [] },
      { total: -852, name: "invasiveSpeciesRegulation", detailsByYear: [], cumulativeByYear: [] },
    ],
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    aggregatedReconversionIndirectEconomicImpacts: [
      { total: -5500, name: "nitrogenCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: -500, name: "pollination", detailsByYear: [], cumulativeByYear: [] },
      { total: -200, name: "soilErosion", detailsByYear: [], cumulativeByYear: [] },
      { total: -282, name: "newStoredCo2Eq", detailsByYear: [], cumulativeByYear: [] },
      { total: -800, name: "waterCycle", detailsByYear: [], cumulativeByYear: [] },
      { total: -852, name: "invasiveSpeciesRegulation", detailsByYear: [], cumulativeByYear: [] },
    ],
  },
] satisfies TestData[];

type TestData = {
  projectDevelopmentPlanType: DevelopmentPlanType;
  aggregatedReconversionIndirectEconomicImpacts: AggregatedReconversionIndirectEconomicImpactsDataView["details"];
};

const assertTestData = (testData: TestData, letterScore: LetterScore) => {
  const dataDesc =
    testData.aggregatedReconversionIndirectEconomicImpacts.length === 0
      ? "no impacts data"
      : `ecosystemServices ${testData.aggregatedReconversionIndirectEconomicImpacts.map((item) => `${item.name} -> ${item.total} t`).join(", ")}`;
  it(`returns ${letterScore} grade for ${testData.projectDevelopmentPlanType} with ${dataDesc}`, () => {
    const result = getEcosystemServicesScore(
      testData.aggregatedReconversionIndirectEconomicImpacts,
    );
    assert.strictEqual(result?.letterScore, letterScore);
    assert.strictEqual(
      result?.metrics.ecosystemicServices.length,
      testData.aggregatedReconversionIndirectEconomicImpacts.length,
    );
  });
};

describe("ecosystemServices score", () => {
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
