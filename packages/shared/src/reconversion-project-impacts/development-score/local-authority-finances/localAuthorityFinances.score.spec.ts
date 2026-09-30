import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { urbanProjectImpactsResultDto } from "../../mocks";
import type { LetterGrade } from "../scoring.helpers";
import { getLocalAuthorityFinancesScore } from "./localAuthorityFinances.score";

const MOCK_NEGATIVE_LOCAL_AUTHORITY_TOTAL = -356_404;
const MOCK_POSITIVE_LOCAL_AUTHORITY_TOTAL = 1_835_960;

const assertPositiveTestData = (
  municipalityYearlyCapitalExpenditures: number,
  letterGrade: LetterGrade,
) => {
  it(`returns ${letterGrade} grade for municipalityYearlyCapitalExpenditures ${municipalityYearlyCapitalExpenditures}€`, () => {
    const result = getLocalAuthorityFinancesScore({
      aggregatedReconversionEconomicImpacts:
        urbanProjectImpactsResultDto.aggregatedReconversionImpacts.indirectEconomicImpacts.details
          .filter((item) => item.name !== "oldRentalIncomeLoss")
          .map((item) => ({ ...item, total: item.total * 10 })),
      stakeholders: urbanProjectImpactsResultDto.stakeholders,
      municipalityYearlyCapitalExpenditures: municipalityYearlyCapitalExpenditures,
    });
    assert.ok(result?.metrics.percentage);
    assert.strictEqual(result?.metrics.localAuthorityTotal, MOCK_POSITIVE_LOCAL_AUTHORITY_TOTAL);
    assert.strictEqual(
      result?.metrics.municipalityYearlyCapitalExpenditures,
      municipalityYearlyCapitalExpenditures,
    );
    assert.strictEqual(result?.letterGrade, letterGrade);
  });
};

const assertNegativeTestData = (
  municipalityYearlyCapitalExpenditures: number,
  letterGrade: LetterGrade,
) => {
  it(`returns ${letterGrade} grade for municipalityYearlyCapitalExpenditures ${municipalityYearlyCapitalExpenditures}€`, () => {
    const result = getLocalAuthorityFinancesScore({
      aggregatedReconversionEconomicImpacts:
        urbanProjectImpactsResultDto.aggregatedReconversionImpacts.indirectEconomicImpacts.details,
      stakeholders: urbanProjectImpactsResultDto.stakeholders,
      municipalityYearlyCapitalExpenditures: municipalityYearlyCapitalExpenditures,
    });
    assert.strictEqual(result?.metrics.localAuthorityTotal, MOCK_NEGATIVE_LOCAL_AUTHORITY_TOTAL);
    assert.ok(result?.metrics.percentage);
    assert.strictEqual(
      result?.metrics.municipalityYearlyCapitalExpenditures,
      municipalityYearlyCapitalExpenditures,
    );
    assert.strictEqual(result?.letterGrade, letterGrade);
  });
};

describe("localAuthorityFinances score", () => {
  for (const municipalityYearlyCapitalExpenditures of [1_000_000, 500_000]) {
    assertPositiveTestData(municipalityYearlyCapitalExpenditures, "A");
  }

  for (const municipalityYearlyCapitalExpenditures of [
    1_500_000, 1_800_000, 8_000_000, 11_000_000,
  ]) {
    assertPositiveTestData(municipalityYearlyCapitalExpenditures, "B");
  }

  assertPositiveTestData(15_000_000, "C");
  assertNegativeTestData(12_000_000, "C");

  for (const municipalityYearlyCapitalExpenditures of [1_000_000, 2_000_000]) {
    assertNegativeTestData(municipalityYearlyCapitalExpenditures, "D");
  }

  for (const municipalityYearlyCapitalExpenditures of [500_000, 300_000]) {
    assertNegativeTestData(municipalityYearlyCapitalExpenditures, "E");
  }
});
