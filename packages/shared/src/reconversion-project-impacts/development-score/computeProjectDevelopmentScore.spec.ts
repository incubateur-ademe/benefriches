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

    assert.deepStrictEqual(result?.details.localPeopleQualityOfLifeScore.score.gradePoints, 65);
    assert.deepStrictEqual(result?.details.localPeopleQualityOfLifeScore.score.letterGrade, "B");
    assert.deepStrictEqual(
      result?.details.localPeopleQualityOfLifeScore.score.letterGradeWithModifiers,
      "B-",
    );

    assert.ok(result?.details.environmentScore.details);
    assert.ok(result.details.localAuthorityEconomicScore.details);
    assert.ok(result?.details.fullTimeJobsScore.details);
    assert.ok(result?.details.localPeopleQualityOfLifeScore.details);

    assert.deepStrictEqual(result?.score.gradePoints, 63.75);
    assert.deepStrictEqual(result?.score.letterGradeWithModifiers, "B-");
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

    assert.deepStrictEqual(result.details.localPeopleQualityOfLifeScore.score.gradePoints, 80);
    assert.deepStrictEqual(result.details.localPeopleQualityOfLifeScore.score.letterGrade, "A");
    assert.deepStrictEqual(
      result.details.localPeopleQualityOfLifeScore.score.letterGradeWithModifiers,
      "A-",
    );

    assert.deepStrictEqual(Object.keys(result?.details.localPeopleQualityOfLifeScore.details), [
      "livingEnvironment",
      "fricheAccidents",
    ]);
  });

  it(`computes localPeopleQualityOfLifeScore with all sub indicators for urban project`, () => {
    const result = computeProjectDevelopmentScore(
      urbanProjectImpactMockMeta,
      urbanProjectImpactsResultDto,
    );
    assert.ok(result?.details.environmentScore);
    assert.ok(result.details.localAuthorityEconomicScore);
    assert.ok(result?.details.fullTimeJobsScore);
    assert.ok(result?.details.localPeopleQualityOfLifeScore);

    assert.deepStrictEqual(result?.details.localPeopleQualityOfLifeScore.score.gradePoints, 65);
    assert.deepStrictEqual(result?.details.localPeopleQualityOfLifeScore.score.letterGrade, "B");
    assert.deepStrictEqual(
      result?.details.localPeopleQualityOfLifeScore.score.letterGradeWithModifiers,
      "B-",
    );

    assert.deepStrictEqual(Object.keys(result?.details.localPeopleQualityOfLifeScore.details), [
      "livingEnvironment",
      "localHealthiness",
      "accessToLocalServices",
      "accessToHealthCare",
      "trafficSecurity",
      "fricheAccidents",
    ]);
  });
});
