import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  convertLetterGradeToGradePoints,
  convertGradePointsToLetterGrade,
  LETTER_GRADE_THRESHOLDS,
  withFamilyScore,
  withNullableIndicatorScore,
  withRequiredIndicatorScore,
} from "./scoring.helpers";

describe("convertLetterGradeToGradePoints", () => {
  const EXPECTED: Record<string, number> = { A: 90, B: 70, C: 50, D: 30, E: 10 };

  for (const [letter, expected] of Object.entries(EXPECTED)) {
    it(`converts '${letter}' to ${expected}`, () => {
      assert.equal(convertLetterGradeToGradePoints(letter as never), expected);
    });
  }
});

describe("convertGradePointsToLetterGrade", () => {
  describe("spec sanity check", () => {
    const KNOWN_VALUES: [number, string][] = [
      [99.99, "A+"],
      [93.34, "A+"],
      [93.33, "A"],
      [86.67, "A"],
      [86.66, "A-"],
      [80, "A-"],
      [73.34, "B+"],
      [66.67, "B"],
      [60, "B-"],
      [53.34, "C+"],
      [50, "C"],
      [46.67, "C"],
      [40, "C-"],
      [33.34, "D+"],
      [30, "D"],
      [26.67, "D"],
      [20, "D-"],
      [13.34, "E+"],
      [10, "E"],
      [6.67, "E"],
      [6.66, "E-"],
      [0, "E-"],
    ];

    for (const [score, expectedGrade] of KNOWN_VALUES) {
      it(`${score} -> '${expectedGrade}'`, () => {
        assert.equal(convertGradePointsToLetterGrade(score), expectedGrade);
      });
    }
  });

  describe("boundary behaviour", () => {
    for (const { grade, minGradePoints } of LETTER_GRADE_THRESHOLDS) {
      it(`returns '${grade}' exactly at its minGradePoints (${minGradePoints})`, () => {
        assert.equal(convertGradePointsToLetterGrade(minGradePoints), grade);
      });

      it(`returns '${grade}' for a value well inside its range (minGradePoints + 1)`, () => {
        assert.equal(convertGradePointsToLetterGrade(minGradePoints + 1), grade);
      });
    }

    it("falls back to the lowest grade ('E-') for a NaN score", () => {
      assert.equal(convertGradePointsToLetterGrade(NaN), "E-");
    });

    it("returns the top grade for a score above 100", () => {
      const top = LETTER_GRADE_THRESHOLDS[0];
      assert.equal(convertGradePointsToLetterGrade(1000), top?.grade);
    });
  });
});

describe("withFamilyScore", () => {
  it("returns average score from indicators", () => {
    const { score } = withFamilyScore({
      livingEnvironment: {
        letterGrade: "B",
        role: "core",
        applies: true,
        gradePoints: 70,
        metrics: {
          siteNature: "FRICHE",
          projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
          siteReconversionType: "friche",
          soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
          buildingsFloorAreaDistribution: undefined,
        },
      },
      fricheAccidents: {
        letterGrade: "A",
        role: "core",
        applies: true,
        gradePoints: 90,

        metrics: {
          avoidedFricheAccidents: 2,
        },
      },
    });
    assert.equal(score.gradePoints, 80);
  });

  it("counts an undefined indicator as 0 point", () => {
    const { score } = withFamilyScore({
      livingEnvironment: {
        letterGrade: "A",
        role: "core",
        applies: true,
        gradePoints: 90,

        metrics: {
          siteNature: "FRICHE",
          projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
          siteReconversionType: "friche",
          soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
          buildingsFloorAreaDistribution: undefined,
        },
      },
      fricheAccidents: {
        role: "core",
        applies: true,
        gradePoints: 0,
      },
    });
    assert.equal(score.gradePoints, 45);
  });

  it("does not return NaN if there is no indicator defined", () => {
    const { score } = withFamilyScore({
      fullTimeJobs: { applies: false, gradePoints: 0 },
    });
    assert.equal(score.gradePoints, 0);
    assert.equal(score.letterGrade, "E");
  });
});

describe("withNullableIndicatorScore", () => {
  it("returns score object with core indicator gradePoints", () => {
    const result = withNullableIndicatorScore({
      applies: true,
      role: "core",
      getScore: () => ({
        letterGrade: "B",
        metrics: {
          siteNature: "FRICHE",
          projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
          siteReconversionType: "friche",
          soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
          buildingsFloorAreaDistribution: undefined,
        },
      }),
    });
    assert.equal(result.gradePoints, 70);
    assert.equal(result.applies, true);
    assert.equal(result.role, "core");
    assert.equal(result.metrics?.siteReconversionType, "friche");
    assert.equal(result.letterGrade, "B");
  });

  it("returns score object with bonus indicator gradePoints", () => {
    const result = withNullableIndicatorScore({
      applies: true,
      role: "bonus",
      getScore: () => ({
        letterGrade: "B",
        metrics: {
          matchingBuildingsUses: [{ buildingsUse: "HOSPITAL", surfaceArea: 10000 }],
        },
      }),
    });
    assert.equal(result.gradePoints, 3.33);
    assert.equal(result.applies, true);
    assert.equal(result.role, "bonus");
    assert.equal(result.metrics?.matchingBuildingsUses[0]?.buildingsUse, "HOSPITAL");
    assert.equal(result.letterGrade, "B");
  });

  it("returns score object with applicable boolean to false", () => {
    const result = withNullableIndicatorScore({
      applies: false,
      role: "core",
      getScore: () => ({
        letterGrade: "B",
        metrics: {
          siteNature: "FRICHE",
          projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
          siteReconversionType: "friche",
          soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
          buildingsFloorAreaDistribution: undefined,
        },
      }),
    });
    assert.equal(result.gradePoints, 0);
    assert.equal(result.applies, false);
    assert.equal(result.role, "core");
    assert.equal(result.metrics, undefined);
    assert.equal(result.letterGrade, undefined);
  });
});

describe("withRequiredIndicatorScore", () => {
  it("returns required score object with gradePoints", () => {
    const result = withRequiredIndicatorScore({
      letterGrade: "B",
      metrics: {
        siteNature: "FRICHE",
        projectDevelopmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
        siteReconversionType: "friche",
        soilEvolutionDetails: { newGreenSoilSurfaces: 0 },
        buildingsFloorAreaDistribution: undefined,
      },
    });
    assert.equal(result.gradePoints, 70);
    assert.equal(result.applies, true);
    assert.equal(result.role, "core");
    assert.equal(result.metrics.siteReconversionType, "friche");
    assert.equal(result.letterGrade, "B");
  });
});
