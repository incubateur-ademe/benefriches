import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type {
  LetterGrade,
  LetterGradeWithModifier,
  ProjectDevelopmentScore,
} from "../development-score";
import { MAIN_GRADE_TEXT } from "../development-score/gradeText";
import { getLetterGradeFromLetterGradeWithModifiers } from "../development-score/scoring.helpers";
import type { LocalAuthorityIndirectEconomicImpactCategory } from "../group-impacts/groupImpacts.types";
import type { BreakEvenHorizon } from "./breakEvenHorizon";
import type { SummaryCardContent } from "./summaryCards";
import {
  getAvoidedCostsAnalysisCardContent,
  getBreakEvenCardContent,
  getDevelopmentScoreCardContent,
} from "./summaryCards";

// Intl's fr-FR output: U+202F groups thousands; a U+00A0 precedes a unit.
const NNBSP = " ";
const NBSP = " ";

type DevelopmentScoreKey = keyof ProjectDevelopmentScore["details"];

const buildDevelopmentScore = (
  detailsGrade: Partial<Record<DevelopmentScoreKey, LetterGrade>>,
  letterGradeWithModifiers: LetterGradeWithModifier = "B+",
) => ({
  letterGrade: getLetterGradeFromLetterGradeWithModifiers(letterGradeWithModifiers),
  letterGradeWithModifiers,
  ...detailsGrade,
});

describe("getDevelopmentScoreCardContent", () => {
  const cases: {
    letterGradeWithModifiers: LetterGradeWithModifier;
    label: string;
    detailsGrade: Partial<Record<DevelopmentScoreKey, LetterGrade>>;
    expectedBody: string;
  }[] = [
    {
      label: "a single positive highlighted element",
      letterGradeWithModifiers: "B+",
      detailsGrade: {
        localAuthorityEconomicScore: "A",
        fullTimeJobsScore: "D",
        localPeopleQualityOfLifeScore: "C",
        environmentScore: "C",
      },
      expectedBody: "Notamment sur les finances publiques.",
    },
    {
      label: "two positive highlighted elements",
      letterGradeWithModifiers: "B+",
      detailsGrade: {
        localAuthorityEconomicScore: "D",
        fullTimeJobsScore: "B",
        localPeopleQualityOfLifeScore: "D",
        environmentScore: "A",
      },
      expectedBody: "Notamment sur l'emploi et l'environnement.",
    },
    {
      label: "three positive highlighted elements",
      letterGradeWithModifiers: "B+",
      detailsGrade: {
        localAuthorityEconomicScore: "B",
        fullTimeJobsScore: "B",
        localPeopleQualityOfLifeScore: "D",
        environmentScore: "B",
      },
      expectedBody: "Notamment sur les finances publiques, l'emploi et l'environnement.",
    },
    {
      label: "all four positive elements",
      letterGradeWithModifiers: "A",

      detailsGrade: {
        localPeopleQualityOfLifeScore: "A",
        environmentScore: "A",
        localAuthorityEconomicScore: "A",
        fullTimeJobsScore: "A",
      },
      expectedBody:
        "Notamment sur les finances publiques, l'emploi, la qualité de vie des riverains et l'environnement.",
    },
    {
      label: "a single negative highlighted element",
      letterGradeWithModifiers: "D+",
      detailsGrade: {
        localAuthorityEconomicScore: "B",
        fullTimeJobsScore: "E",
        localPeopleQualityOfLifeScore: "B",
        environmentScore: "B",
      },
      expectedBody: "Notamment sur l'emploi.",
    },
    {
      label: "two negative highlighted elements",
      letterGradeWithModifiers: "D+",
      detailsGrade: {
        localAuthorityEconomicScore: "E",
        fullTimeJobsScore: "B",
        localPeopleQualityOfLifeScore: "D",
        environmentScore: "B",
      },
      expectedBody: "Notamment sur les finances publiques et la qualité de vie des riverains.",
    },
    {
      label: "three negative highlighted elements",
      letterGradeWithModifiers: "D+",
      detailsGrade: {
        localAuthorityEconomicScore: "C",
        fullTimeJobsScore: "E",
        localPeopleQualityOfLifeScore: "B",
        environmentScore: "E",
      },
      expectedBody: "Notamment sur les finances publiques, l'emploi et l'environnement.",
    },
    {
      label: "all four negative elements",
      letterGradeWithModifiers: "E+",

      detailsGrade: {
        localPeopleQualityOfLifeScore: "E",
        environmentScore: "E",
        localAuthorityEconomicScore: "E",
        fullTimeJobsScore: "C",
      },
      expectedBody:
        "Notamment sur les finances publiques, l'emploi, la qualité de vie des riverains et l'environnement.",
    },
    {
      label: "all four neutral elements",
      letterGradeWithModifiers: "C",
      detailsGrade: {
        localPeopleQualityOfLifeScore: "C",
        environmentScore: "C",
        localAuthorityEconomicScore: "C",
        fullTimeJobsScore: "C",
      },
      expectedBody:
        "Notamment sur les finances publiques, l'emploi, la qualité de vie des riverains et l'environnement.",
    },
    {
      label: "neutral score + with 2 positive and 2 negative",
      letterGradeWithModifiers: "C+",
      detailsGrade: {
        localPeopleQualityOfLifeScore: "B",
        environmentScore: "B",
        localAuthorityEconomicScore: "D",
        fullTimeJobsScore: "D",
      },
      expectedBody: "Notamment sur les finances publiques et l'emploi.",
    },
    {
      label: "neutral score - with 2 positive and 2 negative",
      letterGradeWithModifiers: "C-",
      detailsGrade: {
        localPeopleQualityOfLifeScore: "B",
        environmentScore: "B",
        localAuthorityEconomicScore: "D",
        fullTimeJobsScore: "D",
      },
      expectedBody: "Notamment sur les finances publiques et l'emploi.",
    },
    {
      label: "neutral score with 2 positive and 2 negative",
      letterGradeWithModifiers: "C",

      detailsGrade: {
        localPeopleQualityOfLifeScore: "B",
        environmentScore: "B",
        localAuthorityEconomicScore: "D",
        fullTimeJobsScore: "D",
      },
      expectedBody: "Notamment sur les finances publiques et l'emploi.",
    },
  ];

  for (const { label, detailsGrade, expectedBody, letterGradeWithModifiers } of cases) {
    it(`shows ${label}`, () => {
      const expected: SummaryCardContent = {
        title:
          MAIN_GRADE_TEXT[getLetterGradeFromLetterGradeWithModifiers(letterGradeWithModifiers)],
        headline: letterGradeWithModifiers,
        body: expectedBody,
      };
      assert.deepStrictEqual(
        getDevelopmentScoreCardContent(
          buildDevelopmentScore(detailsGrade, letterGradeWithModifiers),
        ),
        expected,
      );
    });
  }
});

describe("getBreakEvenCardContent", () => {
  const cases: {
    label: string;
    breakEvenHorizon: BreakEvenHorizon;
    evaluationPeriodInYears: number;
    expected: SummaryCardContent;
  }[] = [
    {
      label: "a balance positive from the first year",
      breakEvenHorizon: { status: "positiveFromFirstYear", breakEvenYear: "2026" },
      evaluationPeriodInYears: 50,
      expected: {
        headline: "En 2026",
        title: "Bilan de l'opération positif",
        body: "La somme du bilan économique et des impacts socio-économiques est positive dès 2026.",
      },
    },
    {
      label: "a cost compensated after one year",
      breakEvenHorizon: { status: "compensated", breakEvenYear: "2027", yearsToBreakEven: 1 },
      evaluationPeriodInYears: 50,
      expected: {
        headline: "En 1 an",
        title: "Coût de l'opération compensé",
        body: "Les impacts socio-économiques compenseront le coût de l'opération en 2027.",
      },
    },
    {
      label: "a cost compensated after several years",
      breakEvenHorizon: { status: "compensated", breakEvenYear: "2058", yearsToBreakEven: 26 },
      evaluationPeriodInYears: 50,
      expected: {
        headline: "En 26 ans",
        title: "Coût de l'opération compensé",
        body: "Les impacts socio-économiques compenseront le coût de l'opération en 2058.",
      },
    },
    {
      label: "a break-even after the evaluation period",
      breakEvenHorizon: { status: "notCompensatedWithinPeriod", breakEvenYear: "2061" },
      evaluationPeriodInYears: 30,
      expected: {
        headline: "Sur 30 ans",
        title: "Coût de l'opération non compensé",
        body: "Les impacts socio-économiques compenseront le coût de l'opération en 2061.",
      },
    },
    {
      label: "no break-even at all",
      breakEvenHorizon: { status: "notCompensatedWithinPeriod", breakEvenYear: undefined },
      evaluationPeriodInYears: 50,
      expected: {
        headline: "Sur 50 ans",
        title: "Coût de l'opération non compensé",
        body: "Les impacts socio-économiques ne compenseront pas le coût de l'opération.",
      },
    },
  ];

  for (const { label, breakEvenHorizon, evaluationPeriodInYears, expected } of cases) {
    it(`shows ${label}`, () => {
      assert.deepStrictEqual(
        getBreakEvenCardContent(breakEvenHorizon, evaluationPeriodInYears),
        expected,
      );
    });
  }
});

describe("getAvoidedCostsAnalysisCardContent", () => {
  it("falls back on the total of the socio-economic impacts when there is no main local authority impact", () => {
    assert.deepStrictEqual(
      getAvoidedCostsAnalysisCardContent({
        localAuthorityMainIndirectEconomicImpact: undefined,
        indirectEconomicImpactsTotal: 1_250_000,
      }),
      {
        headline: `+1${NNBSP}250${NNBSP}000${NBSP}€`,
        title: "Total des impacts socio-économiques",
        body: "pour la collectivité, les riverains ou l'humanité",
      },
    );
  });

  it("falls back on a negative total of the socio-economic impacts", () => {
    assert.deepStrictEqual(
      getAvoidedCostsAnalysisCardContent({
        localAuthorityMainIndirectEconomicImpact: undefined,
        indirectEconomicImpactsTotal: -30_000,
      }),
      {
        headline: `-30${NNBSP}000${NBSP}€`,
        title: "Total des impacts socio-économiques",
        body: "pour la collectivité, les riverains ou l'humanité",
      },
    );
  });

  const cases: {
    name: LocalAuthorityIndirectEconomicImpactCategory;
    positiveBody: string;
    negativeBody: string;
  }[] = [
    {
      name: "fricheCosts",
      positiveBody: "grâce à la reconversion de la friche",
      negativeBody: "à cause du maintien de la friche",
    },
    {
      name: "taxesIncome",
      positiveBody: "grâce aux recettes fiscales supplémentaires",
      negativeBody: "à cause d'une perte de recettes fiscales",
    },
    {
      name: "municipalityExpenses",
      positiveBody: "grâce aux économies de dépenses municipales réalisées",
      negativeBody: "à cause de dépenses municipales supplémentaires",
    },
    {
      name: "operatingEconomicBalance",
      positiveBody: "grâce aux recettes d'exploitation",
      negativeBody: "à cause de dépenses d'exploitation",
    },
    {
      name: "rentalIncome",
      positiveBody: "grâce aux revenus locatifs supplémentaires",
      negativeBody: "à cause d'une perte de revenus locatifs",
    },
  ];

  for (const { name, positiveBody, negativeBody } of cases) {
    it(`shows the collectivité's gains for ${name}`, () => {
      assert.deepStrictEqual(
        getAvoidedCostsAnalysisCardContent({
          localAuthorityMainIndirectEconomicImpact: { name, total: 150_000 },
          indirectEconomicImpactsTotal: 999_999,
        }),
        {
          headline: `+150${NNBSP}000${NBSP}€`,
          title: "Gains pour la collectivité",
          body: positiveBody,
        },
      );
    });

    it(`shows the collectivité's losses for ${name}`, () => {
      assert.deepStrictEqual(
        getAvoidedCostsAnalysisCardContent({
          localAuthorityMainIndirectEconomicImpact: { name, total: -20_000 },
          indirectEconomicImpactsTotal: 999_999,
        }),
        {
          headline: `-20${NNBSP}000${NBSP}€`,
          title: "Pertes pour la collectivité",
          body: negativeBody,
        },
      );
    });
  }
});
