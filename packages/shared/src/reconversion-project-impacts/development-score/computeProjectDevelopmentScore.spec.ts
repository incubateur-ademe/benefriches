import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { urbanProjectImpactMockMeta, urbanProjectImpactsResultDto } from "../mocks";
import { computeProjectDevelopmentScore } from "./computeProjectDevelopmentScore";

describe("computeProjectDevelopmentScore", () => {
  it(`returns letterScore, numericScore and details by section`, () => {
    const result = computeProjectDevelopmentScore(
      urbanProjectImpactMockMeta,
      urbanProjectImpactsResultDto,
    );
    assert.ok(result?.details.environmentScore);
    assert.ok(result.details.localAuthorityEconomicScore);
    assert.ok(result?.details.fullTimeJobsScore);
    assert.ok(result?.details.localPeopleQualityOfLifeScore);

    assert.deepStrictEqual(result?.details.environmentScore.numericScore, 66);
    assert.deepStrictEqual(result?.details.environmentScore.letterScore, "B-");

    assert.deepStrictEqual(result.details.localAuthorityEconomicScore.numericScore, 30);
    assert.deepStrictEqual(result.details.localAuthorityEconomicScore.letterScore, "D");

    assert.deepStrictEqual(result?.details.fullTimeJobsScore.numericScore, 70);
    assert.deepStrictEqual(result?.details.fullTimeJobsScore.letterScore, "B");

    assert.deepStrictEqual(result?.details.localPeopleQualityOfLifeScore.numericScore, 53.33);
    assert.deepStrictEqual(result?.details.localPeopleQualityOfLifeScore.letterScore, "C");

    assert.ok(result?.details.environmentScore.details);
    assert.ok(result.details.localAuthorityEconomicScore.details);
    assert.ok(result?.details.fullTimeJobsScore.details);
    assert.ok(result?.details.localPeopleQualityOfLifeScore.details);

    assert.deepStrictEqual(result?.numericScore, 54.83);
    assert.deepStrictEqual(result?.letterScore, "C+");
  });
});
