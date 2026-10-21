import { type ComponentProps } from "react";
import { type LetterGrade, type LetterGradeWithModifier, typedObjectKeys } from "shared";
import type { Link } from "type-route";

import type { DevelopmentScoreDataView } from "@/features/projects/application/project-impacts/selectors/projectDevelopmentScore.selectors";
import classNames from "@/shared/views/clsx";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { LETTER_GRADE_COLORS } from "../layout/colors";
import { DEVELOPMENT_SCORE_CONFIG_MODALS } from "./developmentScoreModalsConfig";
import { type DetailsName, serializeDetails } from "./useOpenDescriptionModalLink";

const getDetailsNameFromAnchor = (anchor: string): DetailsName | undefined => {
  switch (anchor) {
    case "#cadre-de-vie":
      return "localPeopleQualityOfLifeScore.livingEnvironment";
    case "#sante":
      return "localPeopleQualityOfLifeScore.localHealthiness";
    case "#acces-aux-soins":
      return "localPeopleQualityOfLifeScore.accessToHealthCare";
    case "#acces-aux-services-de-proximite":
      return "localPeopleQualityOfLifeScore.accessToLocalServices";
    case "#securite-routiere":
      return "localPeopleQualityOfLifeScore.trafficSecurity";
    case "#accidents-sur-friche":
      return "localPeopleQualityOfLifeScore.frichesAccidents";

    case "#emissions-de-co-eq":
      return "environmentScore.co2eqEmissionsVariation";
    case "#objectif-zan":
      return "environmentScore.zanCompliance";
    case "#qualite-de-l-eau":
      return "environmentScore.waterQuality";
    case "#qualite-des-sols":
      return "environmentScore.soilsQuality";
    case "#services-ecosystemiques":
      return "environmentScore.ecosystemServices";
    case "#table-de-correspondance-point-lettre":
      return "global";

    case "#finances-de-la-collectivite-locale":
      return "localAuthorityEconomicScore";
    case "#qualite-de-vie-des-riverains":
      return "localPeopleQualityOfLifeScore";
    case "#emplois":
      return "fullTimeJobsScore";
    case "#environnement":
      return "environmentScore";

    default:
      return undefined;
  }
};

const getLetterGrade = (
  detailsName: DetailsName,
  developmentScore: DevelopmentScoreDataView["developmentScore"],
): { letterGrade?: LetterGrade; letterGradeText?: LetterGradeWithModifier } => {
  const match = typedObjectKeys(developmentScore.details).find((key) => key === detailsName);
  if (match) {
    return {
      letterGrade: developmentScore.details[match].score.letterGrade,
      letterGradeText: developmentScore.details[match].score.letterGradeWithModifiers,
    };
  }
  return {
    letterGrade: DEVELOPMENT_SCORE_CONFIG_MODALS[detailsName].letterGrade?.(
      developmentScore.details,
    ),
    letterGradeText: undefined,
  };
};

export default ({
  href = "",
  children,
  developmentScore,
  getUpdateDetailsLink,
}: ComponentProps<"a"> & {
  getUpdateDetailsLink: (detailsName: string) => Link;
  developmentScore: DevelopmentScoreDataView["developmentScore"];
}) => {
  if (href.startsWith("http")) {
    return <ExternalLink href={href}>{children as string}</ExternalLink>;
  }

  const detailsNameMatch = getDetailsNameFromAnchor(href);
  if (!detailsNameMatch) {
    return <a href={href}>{children}</a>;
  }

  const { letterGrade, letterGradeText } = getLetterGrade(detailsNameMatch, developmentScore);

  return (
    <>
      {letterGrade && (
        <span
          className={classNames(
            "mr-4 text-sm w-6 h-6 p-0.5 inline-block text-center rounded-full shrink-0 font-bold",
            LETTER_GRADE_COLORS[letterGrade].bgColor,
            LETTER_GRADE_COLORS[letterGrade].textColor,
          )}
        >
          {letterGradeText ?? letterGrade}
        </span>
      )}
      <a {...getUpdateDetailsLink(serializeDetails(detailsNameMatch))}>{children}</a>
    </>
  );
};
