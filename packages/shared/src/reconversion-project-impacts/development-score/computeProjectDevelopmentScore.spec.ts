import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  photovoltaicProjectImpactMockMeta,
  photovoltaicProjectImpactsResultDto,
  urbanProjectImpactMockMeta,
  urbanProjectImpactsResultDto,
} from "../mocks";
import { computeProjectDevelopmentScore } from "./computeProjectDevelopmentScore";

describe("computeProjectDevelopmentScore", () => {
  it(`returns letterGrade, gradePoints and details by section`, () => {
    const result = computeProjectDevelopmentScore(
      urbanProjectImpactMockMeta,
      urbanProjectImpactsResultDto,
    );
    assert.ok(result?.details.environmentScore);
    assert.ok(result.details.localAuthorityEconomicScore);
    assert.ok(result?.details.fullTimeJobsScore);
    assert.ok(result?.details.localPeopleQualityOfLifeScore);

    assert.deepStrictEqual(result?.details.environmentScore.score.gradePoints, 90);
    assert.deepStrictEqual(result?.details.environmentScore.score.letterGrade, "A");
    assert.deepStrictEqual(result?.details.environmentScore.score.letterGradeWithModifiers, "A");

    assert.deepStrictEqual(result.details.localAuthorityEconomicScore.score.gradePoints, 30);
    assert.deepStrictEqual(result.details.localAuthorityEconomicScore.score.letterGrade, "D");
    assert.deepStrictEqual(
      result.details.localAuthorityEconomicScore.score.letterGradeWithModifiers,
      "D",
    );

    assert.deepStrictEqual(result?.details.fullTimeJobsScore.score.gradePoints, 70);
    assert.deepStrictEqual(result?.details.fullTimeJobsScore.score.letterGrade, "B");
    assert.deepStrictEqual(result?.details.fullTimeJobsScore.score.letterGradeWithModifiers, "B");

    assert.deepStrictEqual(result?.details.localPeopleQualityOfLifeScore.score.gradePoints, 86.67);
    assert.deepStrictEqual(result?.details.localPeopleQualityOfLifeScore.score.letterGrade, "A");
    assert.deepStrictEqual(
      result?.details.localPeopleQualityOfLifeScore.score.letterGradeWithModifiers,
      "A",
    );

    assert.ok(result?.details.environmentScore.indicators);
    assert.ok(result.details.localAuthorityEconomicScore.indicators);
    assert.ok(result?.details.fullTimeJobsScore.indicators);
    assert.ok(result?.details.localPeopleQualityOfLifeScore.indicators);

    assert.deepStrictEqual(result?.score.gradePoints, 69.17);
    assert.deepStrictEqual(result?.score.letterGradeWithModifiers, "B");
    assert.deepStrictEqual(result?.score.letterGrade, "B");
  });

  it(`computes localPeopleQualityOfLifeScore with only livingEnvironment and fricheAccidents for photovoltaic project`, () => {
    const result = computeProjectDevelopmentScore(
      photovoltaicProjectImpactMockMeta,
      photovoltaicProjectImpactsResultDto,
    );
    assert.ok(result?.details.environmentScore);
    assert.ok(result.details.localAuthorityEconomicScore);
    assert.ok(result?.details.fullTimeJobsScore);
    assert.ok(result?.details.localPeopleQualityOfLifeScore);

    assert.deepStrictEqual(result.details.localPeopleQualityOfLifeScore.score.gradePoints, 76.67);
    assert.deepStrictEqual(result.details.localPeopleQualityOfLifeScore.score.letterGrade, "B");
    assert.deepStrictEqual(
      result.details.localPeopleQualityOfLifeScore.score.letterGradeWithModifiers,
      "B+",
    );

    assert.deepStrictEqual(
      Object.entries(result?.details.localPeopleQualityOfLifeScore.indicators)
        .filter(([, value]) => value.applies)
        .map(([key]) => key),
      ["livingEnvironment", "fricheAccidents"],
    );
  });

  it(`computes localPeopleQualityOfLifeScore with all core and bonus indicators for urban project`, () => {
    const result = computeProjectDevelopmentScore(
      urbanProjectImpactMockMeta,
      urbanProjectImpactsResultDto,
    );
    assert.ok(result?.details.environmentScore);
    assert.ok(result.details.localAuthorityEconomicScore);
    assert.ok(result?.details.fullTimeJobsScore);
    assert.ok(result?.details.localPeopleQualityOfLifeScore);

    assert.deepStrictEqual(result?.details.localPeopleQualityOfLifeScore.score.gradePoints, 86.67);
    assert.deepStrictEqual(result?.details.localPeopleQualityOfLifeScore.score.letterGrade, "A");
    assert.deepStrictEqual(
      result?.details.localPeopleQualityOfLifeScore.score.letterGradeWithModifiers,
      "A",
    );

    assert.deepStrictEqual(Object.keys(result?.details.localPeopleQualityOfLifeScore.indicators), [
      "livingEnvironment", // A
      "localHealthiness", // B
      "accessToLocalServices", // B
      "accessToHealthCare", // 0
      "trafficSecurity", // B
      "fricheAccidents", // A
    ]);
  });
});
