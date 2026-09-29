import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { typedObjectEntries } from "../../../object-entries";
import type { BuildingsUseDistribution } from "../../../reconversion-projects";
import type { SiteReconversionType, SoilEvolutionDetails } from "../readFeatures.helpers";
import type { LetterScore } from "../scoring.helpers";
import { getLocalHealthinessScore } from "./localHealthiness.score";

const testCasesGradeA = [
  {
    buildingsFloorAreaDistribution: {
      LOCAL_STORE: 5000,
      SPORTS_FACILITIES: 2000,
      HOSPITAL: 8000,
      RESIDENTIAL: 2000,
    },
    siteReconversionType: "friche",
    soilEvolutionDetails: { newGreenSoilSurfaces: 5000 },
  },
  {
    buildingsFloorAreaDistribution: {
      LOCAL_STORE: 5000,
      SPORTS_FACILITIES: 2000,
      HOSPITAL: 8000,
      RESIDENTIAL: 2000,
    },
    siteReconversionType: "friche",
    soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
  },
  {
    buildingsFloorAreaDistribution: {
      LOCAL_STORE: 5000,
      HOSPITAL: 8000,
      RESIDENTIAL: 2000,
    },
    siteReconversionType: "friche",
    soilEvolutionDetails: { newGreenSoilSurfaces: 5000 },
  },
] satisfies TestData[];

const testCasesGradeB = [
  {
    buildingsFloorAreaDistribution: {
      LOCAL_STORE: 5000,
      SPORTS_FACILITIES: 2000,
      HOSPITAL: 8000,
      RESIDENTIAL: 2000,
    },
    siteReconversionType: "enaf",
    soilEvolutionDetails: { newGreenSoilSurfaces: 5000 },
  },
  {
    buildingsFloorAreaDistribution: {},
    siteReconversionType: "friche",
    soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
  },
  {
    buildingsFloorAreaDistribution: {
      SPORTS_FACILITIES: 2000,
    },
    siteReconversionType: "friche_agricole",
    soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
  },
  {
    buildingsFloorAreaDistribution: {
      LOCAL_STORE: 5000,
      HOSPITAL: 8000,
      RESIDENTIAL: 2000,
    },
    siteReconversionType: "friche_agricole",
    soilEvolutionDetails: { newGreenSoilSurfaces: 5000 },
  },
] satisfies TestData[];

const testCasesNoScore = [
  {
    buildingsFloorAreaDistribution: {
      LOCAL_STORE: 5000,
      HOSPITAL: 8000,
      RESIDENTIAL: 2000,
    },
    siteReconversionType: "enaf",
    soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
  },
  {
    buildingsFloorAreaDistribution: {
      HOSPITAL: 8000,
    },
    siteReconversionType: "friche_agricole",
    soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
  },
] satisfies TestData[];

type TestData = {
  siteReconversionType: SiteReconversionType;
  buildingsFloorAreaDistribution?: BuildingsUseDistribution;
  soilEvolutionDetails: Pick<SoilEvolutionDetails, "newGreenSoilSurfaces">;
};

const assertTestData = (testData: TestData, letterScore: LetterScore) => {
  const dataDescList: string[] = [];
  dataDescList.push(`on ${testData.siteReconversionType}`);
  dataDescList.push(
    `with newGreenSoilSurfaces ${testData.soilEvolutionDetails.newGreenSoilSurfaces}m²`,
  );
  dataDescList.push(
    !testData.buildingsFloorAreaDistribution
      ? "no buildingsFloorAreaDistribution"
      : `impacts metrics ${typedObjectEntries(testData.buildingsFloorAreaDistribution)
          .map(([category, surface]) => `${category} -> ${surface} t`)
          .join(", ")}`,
  );

  it(`returns ${letterScore} grade ${dataDescList.join(", ")}`, () => {
    const result = getLocalHealthinessScore(testData);
    assert.strictEqual(result?.letterScore, letterScore);
    assert.strictEqual(result?.metrics.siteReconversionType, testData.siteReconversionType);
    assert.strictEqual(
      result?.metrics.newGreenSoilSurfaces,
      testData.soilEvolutionDetails.newGreenSoilSurfaces,
    );
    assert.strictEqual(
      result?.metrics.sportsFacilitiesFloorSurface,
      testData.buildingsFloorAreaDistribution?.SPORTS_FACILITIES ?? 0,
    );
  });
};

describe("localHealthiness score", () => {
  for (const testData of testCasesGradeA) {
    assertTestData(testData, "A");
  }

  for (const testData of testCasesGradeB) {
    assertTestData(testData, "B");
  }

  for (const testData of testCasesNoScore) {
    const dataDescList: string[] = [];
    dataDescList.push(`on ${testData.siteReconversionType}`);
    dataDescList.push(
      `with newGreenSoilSurfaces ${testData.soilEvolutionDetails.newGreenSoilSurfaces}m²`,
    );
    dataDescList.push(
      !testData.buildingsFloorAreaDistribution
        ? "no buildingsFloorAreaDistribution"
        : `impacts metrics ${typedObjectEntries(testData.buildingsFloorAreaDistribution)
            .map(([category, surface]) => `${category} -> ${surface} t`)
            .join(", ")}`,
    );

    it(`returns undefined for ${dataDescList.join(", ")}`, () => {
      const result = getLocalHealthinessScore(testData);
      assert.strictEqual(result, undefined);
    });
  }
});
