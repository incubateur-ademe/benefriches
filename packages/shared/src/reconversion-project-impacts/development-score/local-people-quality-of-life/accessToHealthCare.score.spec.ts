import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { typedObjectEntries } from "../../../object-entries";
import type { BuildingsUseDistribution } from "../../../reconversion-projects";
import type { BuildingUseSurface } from "../readFeatures.helpers";
import type { LetterGrade } from "../scoring.helpers";
import { getAccessToHealthCareScore } from "./accessToHealthCare.score";

const testCasesGradeA = [
  {
    buildingsUseDistribution: {
      LOCAL_STORE: 5000,
      LOCAL_HEALTH_SERVICE: 5000,
      MEDICAL_SOCIAL_FACILITY: 2000,
      HOSPITAL: 8000,
      RECREATIONAL_FACILITY: 2000,
      RESIDENTIAL: 2000,
    },
    expectedMetrics: {
      matchingBuildingsUses: [
        { buildingUse: "MEDICAL_SOCIAL_FACILITY", floorSurfaceArea: 2000 },
        { buildingUse: "LOCAL_HEALTH_SERVICE", floorSurfaceArea: 5000 },
        { buildingUse: "HOSPITAL", floorSurfaceArea: 8000 },
      ],
    },
  },
  {
    buildingsUseDistribution: {
      LOCAL_STORE: 5000,
      LOCAL_HEALTH_SERVICE: 5000,
      MEDICAL_SOCIAL_FACILITY: 2000,
      RESIDENTIAL: 2000,
    },
    expectedMetrics: {
      matchingBuildingsUses: [
        { buildingUse: "MEDICAL_SOCIAL_FACILITY", floorSurfaceArea: 2000 },
        { buildingUse: "LOCAL_HEALTH_SERVICE", floorSurfaceArea: 5000 },
      ],
    },
  },
] satisfies TestData[];

const testCasesGradeB = [
  {
    buildingsUseDistribution: {
      LOCAL_STORE: 5000,
      HOSPITAL: 8000,
      RECREATIONAL_FACILITY: 2000,
      RESIDENTIAL: 2000,
    },
    expectedMetrics: {
      matchingBuildingsUses: [{ buildingUse: "HOSPITAL", floorSurfaceArea: 8000 }],
    },
  },
  {
    buildingsUseDistribution: { MEDICAL_SOCIAL_FACILITY: 2000, RESIDENTIAL: 2000 },
    expectedMetrics: {
      matchingBuildingsUses: [{ buildingUse: "MEDICAL_SOCIAL_FACILITY", floorSurfaceArea: 2000 }],
    },
  },
] satisfies TestData[];

const testCasesNoScore = [
  {
    buildingsUseDistribution: undefined,
  },
  {
    buildingsUseDistribution: {},
  },
  {
    buildingsUseDistribution: { LOCAL_STORE: 5000, RECREATIONAL_FACILITY: 2000, RESIDENTIAL: 2000 },
  },
] satisfies TestData[];

type TestData = {
  buildingsUseDistribution?: BuildingsUseDistribution;
  expectedMetrics?: { matchingBuildingsUses: BuildingUseSurface[] };
};

const assertTestData = (testData: TestData, letterGrade: LetterGrade) => {
  const dataDesc = !testData.buildingsUseDistribution
    ? "no buildingsUseDistribution"
    : `impacts metrics ${typedObjectEntries(testData.buildingsUseDistribution)
        .map(([category, surface]) => `${category} -> ${surface} t`)
        .join(", ")}`;

  it(`returns ${letterGrade} grade for ${dataDesc}`, () => {
    const result = getAccessToHealthCareScore(testData.buildingsUseDistribution);
    assert.strictEqual(result?.letterGrade, letterGrade);
    assert.strictEqual(
      result?.metrics.matchingBuildingsUses.length,
      testData.expectedMetrics?.matchingBuildingsUses.length,
    );
  });
};

describe("accessToHealthCare score", () => {
  for (const testData of testCasesGradeA) {
    assertTestData(testData, "A");
  }

  for (const testData of testCasesGradeB) {
    assertTestData(testData, "B");
  }

  for (const testData of testCasesNoScore) {
    const dataDesc = !testData.buildingsUseDistribution
      ? "no buildingsUseDistribution"
      : `impacts metrics ${typedObjectEntries(testData.buildingsUseDistribution)
          .map(([category, surface]) => `${category} -> ${surface} t`)
          .join(", ")}`;

    it(`returns undefined for ${dataDesc}`, () => {
      const result = getAccessToHealthCareScore(testData.buildingsUseDistribution);
      assert.strictEqual(result, undefined);
    });
  }
});
