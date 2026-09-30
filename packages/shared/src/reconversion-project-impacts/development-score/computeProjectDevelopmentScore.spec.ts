import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { urbanProjectImpactMockMeta, urbanProjectImpactsResultDto } from "../mocks";
import { computeProjectDevelopmentScore } from "./computeProjectDevelopmentScore";

describe("computeProjectDevelopmentScore", () => {
  it(`returns letterGrade, gradePoints and details by section`, () => {
    const result = computeProjectDevelopmentScore(
      urbanProjectImpactMockMeta,
      urbanProjectImpactsResultDto,
      1500000,
    );
    assert.ok(result?.details.environmentScore);
    assert.ok(result.details.localAuthorityEconomicScore);
    assert.ok(result?.details.fullTimeJobsScore);
    assert.ok(result?.details.localPeopleQualityOfLifeScore);

    assert.deepStrictEqual(result?.details.environmentScore.score.gradePoints, 66);
    assert.deepStrictEqual(result?.details.environmentScore.score.letterGrade, "B");
    assert.deepStrictEqual(result?.details.environmentScore.score.letterGradeWithModifiers, "B-");

    assert.deepStrictEqual(result.details.localAuthorityEconomicScore.score.gradePoints, 30);
    assert.deepStrictEqual(result.details.localAuthorityEconomicScore.score.letterGrade, "D");
    assert.deepStrictEqual(
      result.details.localAuthorityEconomicScore.score.letterGradeWithModifiers,
      "D",
    );

    assert.deepStrictEqual(result?.details.fullTimeJobsScore.score.gradePoints, 70);
    assert.deepStrictEqual(result?.details.fullTimeJobsScore.score.letterGrade, "B");
    assert.deepStrictEqual(result?.details.fullTimeJobsScore.score.letterGradeWithModifiers, "B");

    assert.deepStrictEqual(result?.details.localPeopleQualityOfLifeScore.score.gradePoints, 53.33);
    assert.deepStrictEqual(result?.details.localPeopleQualityOfLifeScore.score.letterGrade, "C");
    assert.deepStrictEqual(
      result?.details.localPeopleQualityOfLifeScore.score.letterGradeWithModifiers,
      "C",
    );

    assert.ok(result?.details.environmentScore.details);
    assert.ok(result.details.localAuthorityEconomicScore.details);
    assert.ok(result?.details.fullTimeJobsScore.details);
    assert.ok(result?.details.localPeopleQualityOfLifeScore.details);

    assert.deepStrictEqual(result?.score.gradePoints, 54.83);
    assert.deepStrictEqual(result?.score.letterGradeWithModifiers, "C+");
    assert.deepStrictEqual(result?.score.letterGrade, "C");
  });
});
