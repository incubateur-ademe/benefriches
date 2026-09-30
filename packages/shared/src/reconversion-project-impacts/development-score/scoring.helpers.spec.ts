import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  convertLetterGradeToGradePoints,
  convertGradePointsToLetterGrade,
  LETTER_GRADE_THRESHOLDS,
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
