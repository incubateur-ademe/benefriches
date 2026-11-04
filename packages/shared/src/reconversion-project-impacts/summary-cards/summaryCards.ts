// The copy of the Synthèse tab's three headline cards, shared by the web app and the project
// impacts summary email so both read the same. Plain text only: the apps add layout, icons and
// links.
import { formatMonetaryImpact } from "../../format-number";
import { typedObjectEntries } from "../../object-entries";
import type { LetterGrade, ProjectDevelopmentScore } from "../development-score";
import { MAIN_GRADE_TEXT } from "../development-score/gradeText";
import type { AvoidedCostsAnalysisData } from "./avoidedCostsAnalysisData";
import type { BreakEvenHorizon } from "./breakEvenHorizon";

export type SummaryCardContent = { headline: string; title?: string; body: string };

const pluralizeYears = (years: number): string => `${years} ${years > 1 ? "ans" : "an"}`;

const HIGHLIGHT_ELEMENTS = {
  localAuthorityEconomicScore: { order: 1, text: "les finances publiques" },
  fullTimeJobsScore: { order: 2, text: "l'emploi" },
  localPeopleQualityOfLifeScore: { order: 3, text: "la qualité de vie des riverains" },
  environmentScore: { order: 4, text: "l'environnement" },
} as const;

const listFormatter = new Intl.ListFormat("fr");
const isPositiveGrade = (grade: LetterGrade) => grade === "A" || grade === "B";

export type DevelopmentScoreCardInput = Pick<
  ProjectDevelopmentScore["score"],
  "letterGrade" | "letterGradeWithModifiers"
> &
  Partial<Record<keyof ProjectDevelopmentScore["details"], LetterGrade>>;

export const getDevelopmentScoreCardContent = (
  developmentScore: DevelopmentScoreCardInput,
): Required<SummaryCardContent> => {
  const { letterGrade, letterGradeWithModifiers, ...gradeDetails } = developmentScore;
  const isPositive = isPositiveGrade(letterGrade);

  const labels = typedObjectEntries(gradeDetails)
    .filter(([, grade]) => grade && isPositiveGrade(grade) === isPositive)
    .toSorted(([a], [b]) => HIGHLIGHT_ELEMENTS[a].order - HIGHLIGHT_ELEMENTS[b].order)
    .map(([name]) => HIGHLIGHT_ELEMENTS[name].text);

  return {
    headline: letterGradeWithModifiers,
    title: MAIN_GRADE_TEXT[letterGrade],
    body: labels.length
      ? `Notamment sur ${listFormatter.format(labels)}.`
      : "sur différents critères.",
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
      // Singular on purpose: the email mockup's plural ("Coûts de l'opération compensés") was
      // not kept.
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

// The headline is the indicator's value; the body continues the title, hence its lower-case start
// (not the email mockup's capitalised sentence, "Grâce à la suppression de la friche…").
export const getAvoidedCostsAnalysisCardContent = (
  props: AvoidedCostsAnalysisData,
): Required<SummaryCardContent> => {
  if (!props.localAuthorityMainIndirectEconomicImpact) {
    return {
      headline: formatMonetaryImpact(props.indirectEconomicImpactsTotal),
      body: "pour la collectivité, les riverains ou l'humanité",
      title: "Total des impacts socio-économiques",
    };
  }

  const headline = formatMonetaryImpact(props.localAuthorityMainIndirectEconomicImpact.total);
  const title =
    props.localAuthorityMainIndirectEconomicImpact.total > 0
      ? "Gains pour la collectivité"
      : "Pertes pour la collectivité";

  const body = (() => {
    switch (props.localAuthorityMainIndirectEconomicImpact.name) {
      case "fricheCosts":
        return props.localAuthorityMainIndirectEconomicImpact.total > 0
          ? "grâce à la reconversion de la friche"
          : "à cause du maintien de la friche";
      case "taxesIncome":
        return props.localAuthorityMainIndirectEconomicImpact.total > 0
          ? "grâce aux recettes fiscales supplémentaires"
          : "à cause d'une perte de recettes fiscales";

      case "municipalityExpenses":
        return props.localAuthorityMainIndirectEconomicImpact.total > 0
          ? "grâce aux économies de dépenses municipales réalisées"
          : "à cause de dépenses municipales supplémentaires";
      case "operatingEconomicBalance":
        return props.localAuthorityMainIndirectEconomicImpact.total > 0
          ? "grâce aux recettes d'exploitation"
          : "à cause de dépenses d'exploitation";
      case "rentalIncome":
        return props.localAuthorityMainIndirectEconomicImpact.total > 0
          ? "grâce aux revenus locatifs supplémentaires"
          : "à cause d'une perte de revenus locatifs";
    }
  })();

  return {
    headline,
    body,
    title,
  };
};
