import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { BreakEvenHorizon } from "../key-impact-indicators/breakEvenHorizon";
import type {
  KeyImpactIndicatorData,
  ZanComplianceIndicator,
} from "../key-impact-indicators/keyImpactIndicators";
import type { SummaryCardContent } from "./summaryCards";
import {
  getBreakEvenCardContent,
  getMainImpactIndicatorCardContent,
  getZanComplianceCardContent,
} from "./summaryCards";

// Intl's fr-FR output: U+202F groups thousands; a U+00A0 precedes a unit.
const NNBSP = " ";
const NBSP = " ";

describe("getZanComplianceCardContent", () => {
  const cases: {
    label: string;
    zanCompliance: ZanComplianceIndicator;
    expected: SummaryCardContent;
  }[] = [
    {
      label: "a friche reconversion as favourable",
      zanCompliance: {
        name: "zanCompliance",
        isSuccess: true,
        value: { isAgriculturalFriche: false, artificializedSurfaceArea: 0 },
      },
      expected: {
        headline: "Projet favorable au ZAN",
        body: "Le projet reconvertit un site en friche et limite la consommation d’espaces naturels, agricoles ou forestiers.",
      },
    },
    {
      label: "an agricultural friche as unfavourable",
      zanCompliance: {
        name: "zanCompliance",
        isSuccess: false,
        value: {
          isAgriculturalFriche: true,
          permeableSurfaceAreaDifference: -500,
          artificializedSurfaceArea: 500,
        },
      },
      expected: {
        headline: "Projet défavorable au ZAN",
        body: "Le projet imperméabilise des sols agricoles.",
      },
    },
    {
      label: "a permeability loss as unfavourable",
      zanCompliance: {
        name: "zanCompliance",
        isSuccess: false,
        value: {
          isAgriculturalFriche: false,
          permeableSurfaceAreaDifference: -1200,
          artificializedSurfaceArea: 1200,
        },
      },
      expected: {
        headline: "Projet défavorable au ZAN",
        body: "Le projet imperméabilise des sols.",
      },
    },
    {
      label: "a non-friche site without permeability loss as unfavourable",
      zanCompliance: {
        name: "zanCompliance",
        isSuccess: false,
        value: { permeableSurfaceAreaDifference: undefined, artificializedSurfaceArea: 0 },
      },
      expected: {
        headline: "Projet défavorable au ZAN",
        body: "Le projet consomme des espaces naturels, agricoles ou forestiers.",
      },
    },
  ];

  for (const { label, zanCompliance, expected } of cases) {
    it(`shows ${label}`, () => {
      assert.deepStrictEqual(getZanComplianceCardContent(zanCompliance), expected);
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
        title: "Bilan de l’opération positif",
        body: "La somme du bilan économique et des impacts socio-économiques est positive dès 2026.",
      },
    },
    {
      label: "a cost compensated after one year",
      breakEvenHorizon: { status: "compensated", breakEvenYear: "2027", yearsToBreakEven: 1 },
      evaluationPeriodInYears: 50,
      expected: {
        headline: "En 1 an",
        title: "Coût de l’opération compensé",
        body: "Les impacts socio-économiques compenseront le coût de l’opération en 2027.",
      },
    },
    {
      label: "a cost compensated after several years",
      breakEvenHorizon: { status: "compensated", breakEvenYear: "2058", yearsToBreakEven: 26 },
      evaluationPeriodInYears: 50,
      expected: {
        headline: "En 26 ans",
        title: "Coût de l’opération compensé",
        body: "Les impacts socio-économiques compenseront le coût de l’opération en 2058.",
      },
    },
    {
      label: "a break-even after the evaluation period",
      breakEvenHorizon: { status: "notCompensatedWithinPeriod", breakEvenYear: "2061" },
      evaluationPeriodInYears: 30,
      expected: {
        headline: "Sur 30 ans",
        title: "Coût de l’opération non compensé",
        body: "Les impacts socio-économiques compenseront le coût de l’opération en 2061.",
      },
    },
    {
      label: "no break-even at all",
      breakEvenHorizon: { status: "notCompensatedWithinPeriod", breakEvenYear: undefined },
      evaluationPeriodInYears: 50,
      expected: {
        headline: "Sur 50 ans",
        title: "Coût de l’opération non compensé",
        body: "Les impacts socio-économiques ne compenseront pas le coût de l’opération.",
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

describe("getMainImpactIndicatorCardContent", () => {
  const cases: {
    label: string;
    indicator: KeyImpactIndicatorData;
    expected: SummaryCardContent;
  }[] = [
    {
      label: "the collectivité's gains from the avoided friche costs",
      indicator: {
        name: "avoidedFricheCostsForLocalAuthority",
        isSuccess: true,
        value: {
          total: 150_000,
          details: [
            { impactName: "avoidedFricheMaintenanceAndSecuringCostsForOwner", amount: 150_000 },
          ],
        },
      },
      expected: {
        headline: `+150${NNBSP}000${NBSP}€`,
        title: "Gains pour la collectivité",
        body: "grâce à la reconversion de la friche",
      },
    },
    {
      label: "the collectivité's losses from keeping the friche",
      indicator: {
        name: "avoidedFricheCostsForLocalAuthority",
        isSuccess: false,
        value: {
          total: -20_000,
          details: [
            { impactName: "avoidedFricheMaintenanceAndSecuringCostsForTenant", amount: -20_000 },
          ],
        },
      },
      expected: {
        headline: `-20${NNBSP}000${NBSP}€`,
        title: "Pertes pour la collectivité",
        body: "à cause du maintien de la friche",
      },
    },
    {
      label: "the collectivité's gains from additional tax income",
      indicator: { name: "taxesIncomesImpact", isSuccess: true, value: 50_000 },
      expected: {
        headline: `+50${NNBSP}000${NBSP}€`,
        title: "Gains pour la collectivité",
        body: "grâce aux recettes fiscales supplémentaires",
      },
    },
    {
      label: "the collectivité's losses from lost tax income",
      indicator: { name: "taxesIncomesImpact", isSuccess: false, value: -5_000 },
      expected: {
        headline: `-5${NNBSP}000${NBSP}€`,
        title: "Pertes pour la collectivité",
        body: "à cause d’une perte de recettes fiscales",
      },
    },
    {
      label: "the residents' potential gains from the property value increase",
      indicator: { name: "localPropertyValueIncrease", isSuccess: true, value: 250_000 },
      expected: {
        headline: `+250${NNBSP}000${NBSP}€`,
        title: "Gains potentiels pour les riverains",
        body: "grâce à la hausse de valeur patrimoniale attendue par la reconversion de la friche",
      },
    },
    {
      label: "full-time jobs going up",
      indicator: {
        name: "fullTimeJobs",
        isSuccess: true,
        value: { difference: 12, percentageEvolution: 25.4 },
      },
      expected: {
        headline: "25%",
        title: "ETP en hausse",
        body: "12 emploi équivalent temps plein créé ou maintenu",
      },
    },
    {
      label: "full-time jobs going down",
      indicator: {
        name: "fullTimeJobs",
        isSuccess: false,
        value: { difference: -3.5, percentageEvolution: -40.2 },
      },
      expected: {
        headline: "-40%",
        title: "ETP en baisse",
        body: "-3,5 emploi équivalent temps plein perdu",
      },
    },
    {
      label: "the households powered by renewable energy",
      indicator: { name: "householdsPoweredByRenewableEnergy", isSuccess: true, value: 1500 },
      expected: {
        headline: `1${NNBSP}500`,
        title: "nouveaux foyers alimentés en EnR",
        body: "grâce à la production photovoltaïque annuelle",
      },
    },
    {
      label: "avoided CO2eq emissions",
      indicator: { name: "avoidedCo2eqEmissions", isSuccess: true, value: 920 },
      expected: {
        headline: `920${NBSP}t`,
        title: "Émissions de CO2eq évitées",
        body: "soit les émissions de 100 français pendant 1 an",
      },
    },
    {
      label: "CO2eq emissions, unsigned",
      indicator: { name: "avoidedCo2eqEmissions", isSuccess: false, value: -46 },
      expected: {
        headline: `46${NBSP}t`,
        title: "Émissions de CO2eq",
        body: "soit les émissions de 5 français pendant 1 an",
      },
    },
    {
      label: "more permeable soils",
      indicator: {
        name: "permeableSurfaceArea",
        isSuccess: true,
        value: { difference: 20_000, percentageEvolution: 82.4 },
      },
      expected: {
        headline: `20${NNBSP}000 ㎡`,
        title: "Augmentation des sols perméables",
        body: "82% de sols désimperméabilisés",
      },
    },
    {
      label: "fewer permeable soils",
      indicator: {
        name: "permeableSurfaceArea",
        isSuccess: false,
        value: { difference: -1200, percentageEvolution: -12.4 },
      },
      expected: {
        headline: `-1${NNBSP}200 ㎡`,
        title: "Diminution des sols perméables",
        body: "-12% de sols imperméabilisés",
      },
    },
    {
      label: "decontaminated soils",
      indicator: {
        name: "nonContaminatedSurfaceArea",
        isSuccess: true,
        value: {
          decontaminatedSurfaceArea: 3000,
          forecastContaminatedSurfaceArea: 1000,
          percentageEvolution: 30,
        },
      },
      expected: {
        headline: `3${NNBSP}000 ㎡`,
        title: "de sols dépollués",
        body: `Les risques sanitaires seront réduits${NBSP}☢️`,
      },
    },
    {
      label: "soils left contaminated",
      indicator: {
        name: "nonContaminatedSurfaceArea",
        isSuccess: false,
        value: {
          decontaminatedSurfaceArea: 0,
          forecastContaminatedSurfaceArea: 3000,
          percentageEvolution: 0,
        },
      },
      expected: {
        headline: `3${NNBSP}000 ㎡`,
        title: "de sols non dépollués",
        body: `Les risques sanitaires seront encore présents${NBSP}☢️`,
      },
    },
  ];

  for (const { label, indicator, expected } of cases) {
    it(`shows ${label}`, () => {
      assert.deepStrictEqual(getMainImpactIndicatorCardContent(indicator), expected);
    });
  }
});
