import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { DevelopmentPlanType } from "../../../reconversion-projects";
import type { SoilEvolutionDetails } from "../readFeatures.helpers";
import type { LetterGrade } from "../scoring.helpers";
import { getSoilsQualityScore } from "./soilsQuality.score";

const testCasesGradeA = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 15000,
        percentVariation: 85,
      },
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 14999,
        percentVariation: (14999 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 15000,
        percentVariation: 85,
      },
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 15000,
        percentVariation: 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 15000,
        percentVariation: 85,
      },
      contamination: {
        siteContaminatedSurface: 0,
        difference: 0,
        percentVariation: 0,
      },
    },
  },
] satisfies TestData[];

const testCasesGradeB = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 10000,
        percentVariation: 80,
      },
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 12000,
        percentVariation: (12000 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 10000,
        percentVariation: 50,
      },
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 14000,
        percentVariation: (14000 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 10000,
        percentVariation: 32,
      },
      contamination: {
        siteContaminatedSurface: 0,
        difference: 0,
        percentVariation: 0,
      },
    },
  },
] satisfies TestData[];

const testCasesGradeC = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: -1000,
        percentVariation: -10,
      },
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 11250,
        percentVariation: (11250 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 1000,
        percentVariation: 30,
      },
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 8250,
        percentVariation: (8250 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 1000,
        percentVariation: 21,
      },
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 8250,
        percentVariation: (8250 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: 1000,
        percentVariation: 28,
      },
      contamination: {
        siteContaminatedSurface: 0,
        difference: 0,
        percentVariation: 0,
      },
    },
  },
] satisfies TestData[];

const testCasesGradeD = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: -1000,
        percentVariation: -12,
      },
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 7500,
        percentVariation: (7500 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: -1000,
        percentVariation: -12,
      },
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 6500,
        percentVariation: (6500 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: -2000,
        percentVariation: -30,
      },
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 6500,
        percentVariation: (6500 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: -2000,
        percentVariation: -30,
      },
      contamination: {
        siteContaminatedSurface: 0,
        difference: 0,
        percentVariation: 0,
      },
    },
  },
] satisfies TestData[];

const testCasesGradeE = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: -1000,
        percentVariation: -50,
      },
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 0,
        percentVariation: 0,
      },
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: -1000,
        percentVariation: -70,
      },
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 0,
        percentVariation: 0,
      },
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: -1000,
        percentVariation: -70,
      },
      contamination: {
        siteContaminatedSurface: 0,
        difference: 0,
        percentVariation: 0,
      },
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    soilsEvolutionDetails: {
      permeableSurfaceDifference: {
        difference: -2000,
        percentVariation: -30,
      },
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 0,
        percentVariation: 0,
      },
    },
  },
] satisfies TestData[];

type TestData = {
  projectDevelopmentPlanType: DevelopmentPlanType;
  soilsEvolutionDetails: Pick<SoilEvolutionDetails, "contamination" | "permeableSurfaceDifference">;
};

const assertTestData = (testData: TestData, letterGrade: LetterGrade) => {
  const dataDescList: string[] = [];

  if (testData.soilsEvolutionDetails.contamination.siteContaminatedSurface > 0) {
    dataDescList.push("with site contamination");
    dataDescList.push(
      `with site ${testData.soilsEvolutionDetails.contamination.percentVariation}% decontamination`,
    );
  }
  dataDescList.push(
    `with permeable surface variation ${testData.soilsEvolutionDetails.permeableSurfaceDifference.percentVariation}%`,
  );

  it(`returns ${letterGrade} grade for ${testData.projectDevelopmentPlanType} ${dataDescList.join(", ")}`, () => {
    const result = getSoilsQualityScore(testData.soilsEvolutionDetails);
    assert.strictEqual(result?.letterGrade, letterGrade);
    assert.strictEqual(
      result?.metrics.contamination.percentVariation,
      testData.soilsEvolutionDetails.contamination.percentVariation,
    );
    assert.strictEqual(
      result?.metrics.permeableSurfaceDifference.percentVariation,
      testData.soilsEvolutionDetails.permeableSurfaceDifference.percentVariation,
    );
  });
};

describe("soilsQualityScore score", () => {
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
