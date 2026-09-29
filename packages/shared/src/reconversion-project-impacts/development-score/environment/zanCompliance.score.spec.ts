import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { DevelopmentPlanType } from "../../../reconversion-projects";
import type { SiteReconversionType, SoilEvolutionDetails } from "../readFeatures.helpers";
import type { LetterScore } from "../scoring.helpers";
import { getZanComplianceScore } from "./zanCompliance.score";

const testCasesGradeA = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    siteReconversionType: "friche",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 15000,
        percentVariation: 85,
      },
      newGreenSoilSurfaces: 0,
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    siteReconversionType: "friche",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 15000,
        percentVariation: 50,
      },
      newGreenSoilSurfaces: 20,
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    siteReconversionType: "friche",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 15000,
        percentVariation: 85,
      },
      newGreenSoilSurfaces: 20,
    },
  },
] satisfies TestData[];

const testCasesGradeB = [
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    siteReconversionType: "friche",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 15000,
        percentVariation: 80,
      },
      newGreenSoilSurfaces: 0,
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    siteReconversionType: "friche",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 15000,
        percentVariation: 75,
      },
      newGreenSoilSurfaces: 0,
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    siteReconversionType: "friche",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 15000,
        percentVariation: 30,
      },
      newGreenSoilSurfaces: 0,
    },
  },
] satisfies TestData[];

const testCasesGradeC = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    siteReconversionType: "friche",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 15000,
        percentVariation: 25,
      },
      newGreenSoilSurfaces: 0,
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    siteReconversionType: "friche",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 0,
        percentVariation: 0,
      },
      newGreenSoilSurfaces: 0,
    },
  },
] satisfies TestData[];

const testCasesGradeD = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    siteReconversionType: "friche_agricole",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: -5000,
        percentVariation: -15,
      },
      newGreenSoilSurfaces: 0,
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    siteReconversionType: "friche_agricole",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 0,
        percentVariation: 0,
      },
      newGreenSoilSurfaces: 0,
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    siteReconversionType: "friche_agricole",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: -1000,
        percentVariation: -10,
      },
      newGreenSoilSurfaces: 0,
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    siteReconversionType: "enaf",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 0,
        percentVariation: 0,
      },
      newGreenSoilSurfaces: 50,
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    siteReconversionType: "enaf",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 1000,
        percentVariation: 10,
      },
      newGreenSoilSurfaces: 0,
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    siteReconversionType: "enaf",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 1000,
        percentVariation: 10,
      },
      newGreenSoilSurfaces: -2000,
    },
  },
] satisfies TestData[];

const testCasesGradeE = [
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    siteReconversionType: "friche",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: -15000,
        percentVariation: -55,
      },
      newGreenSoilSurfaces: 0,
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    siteReconversionType: "enaf",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: -1000,
        percentVariation: -55,
      },
      newGreenSoilSurfaces: 0,
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    siteReconversionType: "friche_agricole",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: -1000,
        percentVariation: -50,
      },
      newGreenSoilSurfaces: 0,
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    siteReconversionType: "enaf",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: -1000,
        percentVariation: -100,
      },
      newGreenSoilSurfaces: 0,
    },
  },
] satisfies TestData[];

type TestData = {
  projectDevelopmentPlanType: DevelopmentPlanType;
  siteReconversionType: SiteReconversionType;
  soilsEvolutionDetails: Pick<
    SoilEvolutionDetails,
    "newGreenSoilSurfaces" | "permeableSurfaceDifference"
  >;
};

const assertTestData = (testData: TestData, letterScore: LetterScore) => {
  const dataDescList: string[] = [];
  dataDescList.push(`on ${testData.siteReconversionType}`);
  dataDescList.push(
    `with newGreenSoilSurfaces ${testData.soilsEvolutionDetails.newGreenSoilSurfaces}m²`,
  );
  dataDescList.push(
    `with permeable surface variation ${testData.soilsEvolutionDetails.permeableSurfaceDifference.percentVariation}%`,
  );

  it(`returns ${letterScore} grade for ${testData.projectDevelopmentPlanType} ${dataDescList.join(", ")}`, () => {
    const result = getZanComplianceScore(
      testData.siteReconversionType,
      testData.soilsEvolutionDetails,
    );
    assert.strictEqual(result?.letterScore, letterScore);
    assert.strictEqual(
      result?.metrics.newGreenSoilSurfaces,
      testData.soilsEvolutionDetails.newGreenSoilSurfaces,
    );
    assert.strictEqual(
      result?.metrics.permeableSurfaceDifference.difference,
      testData.soilsEvolutionDetails.permeableSurfaceDifference.difference,
    );
    assert.strictEqual(result?.metrics.siteReconversionType, testData.siteReconversionType);
  });
};

describe("waterQualityScore score", () => {
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
