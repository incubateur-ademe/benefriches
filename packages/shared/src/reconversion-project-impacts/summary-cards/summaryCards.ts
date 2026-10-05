// The copy of the Synthèse tab's three headline cards, shared by the web app and the project
// impacts summary email so both read the same. Plain text only: the apps add layout, icons and
// links.
// TODO(product): proofread the copy of every card.
import { getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson } from "../../co2eq";
import {
  formatCO2Impact,
  formatMonetaryImpact,
  formatNumberFr,
  formatPercentage,
  formatPerFrenchPersonAnnualEquivalent,
  formatSurfaceArea,
} from "../../format-number";
import type { BreakEvenHorizon } from "../key-impact-indicators/breakEvenHorizon";
import type {
  KeyImpactIndicatorData,
  ZanComplianceIndicator,
} from "../key-impact-indicators/keyImpactIndicators";

export type SummaryCardContent = { headline: string; title?: string; body: string };

const NO_BREAK_SPACE = " ";

const pluralizeYears = (years: number): string => `${years} ${years > 1 ? "ans" : "an"}`;

export const getZanComplianceCardContent = (
  zanCompliance: ZanComplianceIndicator,
): SummaryCardContent => {
  if (zanCompliance.isSuccess) {
    return {
      headline: "Projet favorable au ZAN",
      body: "Le projet reconvertit un site en friche et limite la consommation d'espaces naturels, agricoles ou forestiers.",
    };
  }

  const { isAgriculturalFriche, permeableSurfaceAreaDifference } = zanCompliance.value;
  return {
    headline: "Projet défavorable au ZAN",
    body: isAgriculturalFriche
      ? "Le projet imperméabilise des sols agricoles."
      : permeableSurfaceAreaDifference !== undefined && permeableSurfaceAreaDifference < 0
        ? "Le projet imperméabilise des sols."
        : "Le projet consomme des espaces naturels, agricoles ou forestiers.",
  };
};

// "Sur <n> ans" names the evaluation period the impacts were cropped to.
export const getBreakEvenCardContent = (
  breakEvenHorizon: BreakEvenHorizon,
  evaluationPeriodInYears: number,
): Required<SummaryCardContent> => {
  switch (breakEvenHorizon.status) {
    case "positiveFromFirstYear":
      return {
        headline: `En ${breakEvenHorizon.breakEvenYear}`,
        title: "Bilan de l'opération positif",
        body: `La somme du bilan économique et des impacts socio-économiques est positive dès ${breakEvenHorizon.breakEvenYear}.`,
      };
    case "compensated":
      // TODO(product): the email mockup reads "Coûts de l'opération compensés" (plural).
      return {
        headline: `En ${pluralizeYears(breakEvenHorizon.yearsToBreakEven)}`,
        title: "Coût de l'opération compensé",
        body: `Les impacts socio-économiques compenseront le coût de l'opération en ${breakEvenHorizon.breakEvenYear}.`,
      };
    case "notCompensatedWithinPeriod":
      return {
        headline: `Sur ${pluralizeYears(evaluationPeriodInYears)}`,
        title: "Coût de l'opération non compensé",
        body: breakEvenHorizon.breakEvenYear
          ? `Les impacts socio-économiques compenseront le coût de l'opération en ${breakEvenHorizon.breakEvenYear}.`
          : "Les impacts socio-économiques ne compenseront pas le coût de l'opération.",
      };
  }
};

// The headline is the indicator's value; the body continues the title, hence its lower-case start.
// TODO(product): the email mockup had a capitalised sentence as body ("Grâce à la suppression de
// la friche…").
export const getMainImpactIndicatorCardContent = (
  indicator: KeyImpactIndicatorData,
): Required<SummaryCardContent> | undefined => {
  switch (indicator.name) {
    case "avoidedFricheCostsForLocalAuthority":
      return indicator.isSuccess
        ? {
            headline: formatMonetaryImpact(indicator.value.total),
            title: "Gains pour la collectivité",
            body: "grâce à la reconversion de la friche",
          }
        : {
            headline: formatMonetaryImpact(indicator.value.total),
            title: "Pertes pour la collectivité",
            body: "à cause du maintien de la friche",
          };
    case "taxesIncomesImpact":
      return indicator.isSuccess
        ? {
            headline: formatMonetaryImpact(indicator.value),
            title: "Gains pour la collectivité",
            body: "grâce aux recettes fiscales supplémentaires",
          }
        : {
            headline: formatMonetaryImpact(indicator.value),
            title: "Pertes pour la collectivité",
            body: "à cause d'une perte de recettes fiscales",
          };
    case "localPropertyValueIncrease":
      return {
        headline: formatMonetaryImpact(indicator.value),
        title: "Gains potentiels pour les riverains",
        body: "grâce à la hausse de valeur patrimoniale attendue par la reconversion de la friche",
      };
    case "fullTimeJobs": {
      const { difference, percentageEvolution } = indicator.value;
      return indicator.isSuccess
        ? {
            headline: formatPercentage(percentageEvolution),
            title: "ETP en hausse",
            body: `${formatNumberFr(difference)} emploi équivalent temps plein créé ou maintenu`,
          }
        : {
            headline: formatPercentage(percentageEvolution),
            title: "ETP en baisse",
            body: `${formatNumberFr(difference)} emploi équivalent temps plein perdu`,
          };
    }
    case "householdsPoweredByRenewableEnergy":
      return {
        headline: formatNumberFr(indicator.value),
        title: "nouveaux foyers alimentés en EnR",
        body: "grâce à la production photovoltaïque annuelle",
      };
    case "avoidedCo2eqEmissions": {
      const co2eqTons = Math.abs(indicator.value);
      const frenchPersons = formatPerFrenchPersonAnnualEquivalent(
        getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson(co2eqTons),
      );
      return {
        headline: formatCO2Impact(co2eqTons, { withSignPrefix: false }),
        title: indicator.isSuccess ? "Émissions de CO2eq évitées" : "Émissions de CO2eq",
        body: `soit les émissions de ${frenchPersons} français pendant 1 an`,
      };
    }
    case "permeableSurfaceArea": {
      const { difference, percentageEvolution } = indicator.value;
      return indicator.isSuccess
        ? {
            headline: formatSurfaceArea(difference),
            title: "Augmentation des sols perméables",
            body: `${formatPercentage(percentageEvolution)} de sols désimperméabilisés`,
          }
        : {
            headline: formatSurfaceArea(difference),
            title: "Diminution des sols perméables",
            body: `${formatPercentage(percentageEvolution)} de sols imperméabilisés`,
          };
    }
    case "nonContaminatedSurfaceArea":
      return indicator.isSuccess
        ? {
            headline: formatSurfaceArea(indicator.value.decontaminatedSurfaceArea),
            title: "de sols dépollués",
            body: `Les risques sanitaires seront réduits${NO_BREAK_SPACE}☢️`,
          }
        : {
            headline: formatSurfaceArea(indicator.value.forecastContaminatedSurfaceArea),
            title: "de sols non dépollués",
            body: `Les risques sanitaires seront encore présents${NO_BREAK_SPACE}☢️`,
          };
    // Never a main indicator: getSummaryHeadlineIndicators excludes both.
    case "zanCompliance":
    case "projectImpactBalance":
      return undefined;
  }
};
