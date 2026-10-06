import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { DevelopmentPlanType } from "../../../reconversion-projects";
import type { SoilEvolutionDetails } from "../readFeatures.helpers";
import type { LetterGrade } from "../scoring.helpers";
import { getWaterQualityScore } from "./waterQuality.score";

const testCasesGradeA = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      soilsDistribution: [{ soilType: "PRAIRIE_BUSHES", total: 15000 }],
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
      soilsDistribution: [{ soilType: "PRAIRIE_BUSHES", total: 15000 }],
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 15000,
        percentVariation: 100,
      },
    },
  },
] satisfies TestData[];

const testCasesGradeB = [
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    soilsEvolutionDetails: {
      soilsDistribution: [{ soilType: "PRAIRIE_BUSHES", total: 15000 }],

      contamination: {
        siteContaminatedSurface: 15000,
        difference: 11250,
        percentVariation: (11250 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      soilsDistribution: [{ soilType: "PRAIRIE_BUSHES", total: 15000 }],

      contamination: {
        siteContaminatedSurface: 15000,
        difference: 11100,
        percentVariation: (11100 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    soilsEvolutionDetails: {
      soilsDistribution: [{ soilType: "PRAIRIE_BUSHES", total: 15000 }],

      contamination: {
        siteContaminatedSurface: 15000,
        difference: 1500,
        percentVariation: (1500 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      soilsDistribution: [{ soilType: "PRAIRIE_BUSHES", total: 15000 }],

      contamination: {
        siteContaminatedSurface: 15000,
        difference: 2000,
        percentVariation: (2000 / 15000) * 100,
      },
    },
  },
] satisfies TestData[];

const testCasesGradeC = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      soilsDistribution: [{ soilType: "PRAIRIE_BUSHES", total: 15000 }],
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 0,
        percentVariation: 0,
      },
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    soilsEvolutionDetails: {
      soilsDistribution: [{ soilType: "PRAIRIE_BUSHES", total: 15000 }],
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 1350,
        percentVariation: (1350 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    soilsEvolutionDetails: {
      soilsDistribution: [{ soilType: "PRAIRIE_BUSHES", total: 15000 }],
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 1000,
        percentVariation: (1000 / 15000) * 100,
      },
    },
  },
] satisfies TestData[];

const testCasesGradeD = [
  {
    projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
    soilsEvolutionDetails: {
      soilsDistribution: [
        { soilType: "CULTIVATION", total: -2000 },
        { soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", total: 2000 },
      ],
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
      soilsDistribution: [
        { soilType: "FOREST_MIXED", total: -2000 },
        { soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", total: 2000 },
      ],
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 0,
        percentVariation: 0,
      },
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    soilsEvolutionDetails: {
      soilsDistribution: [
        { soilType: "VINEYARD", total: -2000 },
        { soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", total: 2000 },
      ],
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 1350,
        percentVariation: (1350 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    soilsEvolutionDetails: {
      soilsDistribution: [
        { soilType: "FOREST_POPLAR", total: -2000 },
        { soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", total: 2000 },
      ],
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 1000,
        percentVariation: (1000 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    soilsEvolutionDetails: {
      soilsDistribution: [
        { soilType: "FOREST_POPLAR", total: -2000 },
        { soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", total: 2000 },
      ],
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
      soilsDistribution: [
        { soilType: "PRAIRIE_BUSHES", total: -2000 },
        { soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", total: 2000 },
      ],

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
      soilsDistribution: [
        { soilType: "WET_LAND", total: -2000 },
        { soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", total: 2000 },
      ],

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
      soilsDistribution: [
        { soilType: "PRAIRIE_TREES", total: -2000 },
        { soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", total: 2000 },
      ],
      contamination: {
        siteContaminatedSurface: 15000,
        difference: 7500,
        percentVariation: (7500 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    soilsEvolutionDetails: {
      soilsDistribution: [
        { soilType: "PRAIRIE_BUSHES", total: -2000 },
        { soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", total: 2000 },
      ],

      contamination: {
        siteContaminatedSurface: 15000,
        difference: 7500,
        percentVariation: (7500 / 15000) * 100,
      },
    },
  },
  {
    projectDevelopmentPlanType: "URBAN_PROJECT",
    soilsEvolutionDetails: {
      soilsDistribution: [
        { soilType: "PRAIRIE_BUSHES", total: -2000 },
        { soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED", total: 2000 },
      ],

      contamination: {
        siteContaminatedSurface: 0,
        difference: 0,
        percentVariation: 0,
      },
    },
  },
] satisfies TestData[];

type TestData = {
  projectDevelopmentPlanType: DevelopmentPlanType;
  soilsEvolutionDetails: Pick<SoilEvolutionDetails, "contamination" | "soilsDistribution">;
};

const assertTestData = (testData: TestData, letterGrade: LetterGrade) => {
  const dataDescList: string[] = [];

  if (testData.soilsEvolutionDetails.contamination.siteContaminatedSurface > 0) {
    dataDescList.push("with site contamination");
    dataDescList.push(
      `with soilsDistribution ${testData.soilsEvolutionDetails.contamination.percentVariation}% decontamination`,
    );
  }
  if (letterGrade === "D" || letterGrade === "E")
    dataDescList.push(
      `with soilsDistribution ${testData.soilsEvolutionDetails.soilsDistribution.map((item) => `${item.soilType} -> ${item.total} m²`).join(", ")}`,
    );

  it(`returns ${letterGrade} grade for ${testData.projectDevelopmentPlanType} ${dataDescList.join(", ")}`, () => {
    const result = getWaterQualityScore(testData.soilsEvolutionDetails);
    assert.strictEqual(result?.letterGrade, letterGrade);
    assert.strictEqual(
      result?.metrics.contamination.percentVariation,
      testData.soilsEvolutionDetails.contamination.percentVariation,
    );
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
