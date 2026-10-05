// The three headline cards of the project impacts summary. Their copy mirrors the web Synthèse
// (ProjectSummaryImpactDetailsCard.tsx, ProjectBreakEvenLevelSummary.tsx,
// ProjectSummaryComparisonCard.tsx) for every variant, favourable and unfavourable, so the email
// and the app read the same (decisions.md, 2026-10-05). Where the mockup's favourable text differs
// from the app, the app wins. Two deliberate differences: curly apostrophes throughout, as in
// every lifecycle email, and three web typos fixed here only (plan D5):
// - "Le projet est imperméabilise des sols." → "Le projet imperméabilise des sols."
// - "La somme du bilan économiques …" → "La somme du bilan économique …"
// - "production photovoltaïque annelle" → "production photovoltaïque annuelle"
// TODO(product): proofread every card's copy; fix the three typos in the web too (plan P3).
import type { BreakEvenHorizon, KeyImpactIndicatorData, ZanComplianceIndicator } from "shared";

import type { EmailSection } from "src/notifications/core/templates/emailLayout";
import {
  formatCO2Impact,
  formatMonetaryImpact,
  formatNumberFr,
  formatPercentage,
  formatPerFrenchPersonAnnualEquivalent,
  formatSurfaceArea,
  getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson,
} from "src/notifications/core/templates/impactValueFormatters";
import { NBSP } from "src/notifications/core/templates/reminderGreeting";

type CardSection = Extract<EmailSection, { type: "card" }>;
type CardLink = CardSection["link"];

const pluralizeYears = (years: number): string => `${years} ${years > 1 ? "ans" : "an"}`;

// Card 1. No title: the web card has a heading and a sentence only.
export const buildZanComplianceCard = (
  zanCompliance: ZanComplianceIndicator,
  link: CardLink,
): CardSection => {
  if (zanCompliance.isSuccess) {
    return {
      type: "card",
      headline: "Projet favorable au ZAN",
      body: "Le projet reconvertit un site en friche et limite la consommation d’espaces naturels, agricoles ou forestiers.",
      link,
    };
  }

  const { isAgriculturalFriche, permeableSurfaceAreaDifference } = zanCompliance.value;
  const body = isAgriculturalFriche
    ? "Le projet imperméabilise des sols agricoles."
    : permeableSurfaceAreaDifference !== undefined && permeableSurfaceAreaDifference < 0
      ? "Le projet imperméabilise des sols."
      : "Le projet consomme des espaces naturels, agricoles ou forestiers.";
  return { type: "card", headline: "Projet défavorable au ZAN", body, link };
};

// Card 2. The web badge is the headline, its heading the title. "Sur <n> ans" names the
// evaluation period the impacts were cropped to (30 years for a photovoltaic plant).
export const buildBreakEvenCard = (
  breakEvenHorizon: BreakEvenHorizon,
  evaluationPeriodInYears: number,
  link: CardLink,
): CardSection => {
  switch (breakEvenHorizon.status) {
    case "positiveFromFirstYear":
      return {
        type: "card",
        headline: `En ${breakEvenHorizon.breakEvenYear}`,
        title: "Bilan de l’opération positif",
        body: `La somme du bilan économique et des impacts socio-économiques est positive dès ${breakEvenHorizon.breakEvenYear}.`,
        link,
      };
    case "compensated":
      // TODO(product): the mockup reads "Coûts de l’opération compensés"; the app's singular
      // wording wins (decisions.md).
      return {
        type: "card",
        headline: `En ${pluralizeYears(breakEvenHorizon.yearsToBreakEven)}`,
        title: "Coût de l’opération compensé",
        body: `Les impacts socio-économiques compenseront le coût de l’opération en ${breakEvenHorizon.breakEvenYear}.`,
        link,
      };
    case "notCompensatedWithinPeriod":
      return {
        type: "card",
        headline: `Sur ${pluralizeYears(evaluationPeriodInYears)}`,
        title: "Coût de l’opération non compensé",
        body: breakEvenHorizon.breakEvenYear
          ? `Les impacts socio-économiques compenseront le coût de l’opération en ${breakEvenHorizon.breakEvenYear}.`
          : "Les impacts socio-économiques ne compenseront pas le coût de l’opération.",
        link,
      };
  }
};

// Card 3: the web card's value is the headline, its heading the title, its description the body
// (lower-case starts kept, as in the app).
// TODO(product): the mockup had a capitalised sentence as body ("Grâce à la suppression de la
// friche…"); the app's wording wins (decisions.md, plan P2). The ☢️ emoji is the app's (text,
// not an image).
export const buildMainImpactIndicatorCard = (
  indicator: KeyImpactIndicatorData,
  link: CardLink,
): CardSection | undefined => {
  const card = (headline: string, title: string, body: string): CardSection => ({
    type: "card",
    headline,
    title,
    body,
    link,
  });

  switch (indicator.name) {
    case "avoidedFricheCostsForLocalAuthority":
      return indicator.isSuccess
        ? card(
            formatMonetaryImpact(indicator.value.total),
            "Gains pour la collectivité",
            "grâce à la reconversion de la friche",
          )
        : card(
            formatMonetaryImpact(indicator.value.total),
            "Pertes pour la collectivité",
            "à cause du maintien de la friche",
          );
    case "taxesIncomesImpact":
      return indicator.isSuccess
        ? card(
            formatMonetaryImpact(indicator.value),
            "Gains pour la collectivité",
            "grâce aux recettes fiscales supplémentaires",
          )
        : card(
            formatMonetaryImpact(indicator.value),
            "Pertes pour la collectivité",
            "à cause d’une perte de recettes fiscales",
          );
    case "localPropertyValueIncrease":
      return card(
        formatMonetaryImpact(indicator.value),
        "Gains potentiels pour les riverains",
        "grâce à la hausse de valeur patrimoniale attendue par la reconversion de la friche",
      );
    case "fullTimeJobs": {
      const { difference, percentageEvolution } = indicator.value;
      return indicator.isSuccess
        ? card(
            formatPercentage(percentageEvolution),
            "ETP en hausse",
            `${formatNumberFr(difference)} emploi équivalent temps plein créé ou maintenu`,
          )
        : card(
            formatPercentage(percentageEvolution),
            "ETP en baisse",
            `${formatNumberFr(difference)} emploi équivalent temps plein perdu`,
          );
    }
    case "householdsPoweredByRenewableEnergy":
      return card(
        formatNumberFr(indicator.value),
        "nouveaux foyers alimentés en EnR",
        "grâce à la production photovoltaïque annuelle",
      );
    case "avoidedCo2eqEmissions": {
      const co2eqTons = Math.abs(indicator.value);
      const frenchPersons = formatPerFrenchPersonAnnualEquivalent(
        getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson(co2eqTons),
      );
      return card(
        formatCO2Impact(co2eqTons),
        indicator.isSuccess ? "Émissions de CO2eq évitées" : "Émissions de CO2eq",
        `soit les émissions de ${frenchPersons} français pendant 1 an`,
      );
    }
    case "permeableSurfaceArea": {
      const { difference, percentageEvolution } = indicator.value;
      return indicator.isSuccess
        ? card(
            formatSurfaceArea(difference),
            "Augmentation des sols perméables",
            `${formatPercentage(percentageEvolution)} de sols désimperméabilisés`,
          )
        : card(
            formatSurfaceArea(difference),
            "Diminution des sols perméables",
            `${formatPercentage(percentageEvolution)} de sols imperméabilisés`,
          );
    }
    case "nonContaminatedSurfaceArea":
      return indicator.isSuccess
        ? card(
            formatSurfaceArea(indicator.value.decontaminatedSurfaceArea),
            "de sols dépollués",
            `Les risques sanitaires seront réduits${NBSP}☢️`,
          )
        : card(
            formatSurfaceArea(indicator.value.forecastContaminatedSurfaceArea),
            "de sols non dépollués",
            `Les risques sanitaires seront encore présents${NBSP}☢️`,
          );
    // Never a main indicator: getSummaryHeadlineIndicators excludes both.
    case "zanCompliance":
    case "projectImpactBalance":
      return undefined;
  }
};
