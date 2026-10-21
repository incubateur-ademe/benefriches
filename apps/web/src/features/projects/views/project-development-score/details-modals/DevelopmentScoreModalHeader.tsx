import { fr } from "@codegouvfr/react-dsfr";
import type { ReactNode } from "react";
import type { LetterGrade } from "shared";
import type { Link } from "type-route";

import classNames from "@/shared/views/clsx";

import GradeTextBadge from "../layout/ProjectDevelopmentScoreGradeTextBadge";
import { getLetterGradeBadgeText } from "../layout/gradeLabels";
import type { DetailsName } from "./useOpenDescriptionModalLink";

export const DIALOG_TITLE_ID = "developmentScore-modal-description-title";

export default ({
  children,
  onCloseLink,
  detailsName,
  letterGrade,
}: {
  letterGrade?: LetterGrade;
  children?: ReactNode;
  onCloseLink: Link;
  detailsName: DetailsName;
}) => {
  const badgeKind = (() => {
    switch (detailsName) {
      case "environmentScore.co2eqEmissionsVariation":
      case "fullTimeJobsScore":
        return "evolution";
      case "localAuthorityEconomicScore":
        return "impact";
      case "environmentScore.zanCompliance":
        return "compliance";
      default:
        return "qualitative";
    }
  })();

  return (
    <>
      <div className="flex justify-around items-start w-full">
        <a className={fr.cx("fr-btn--close", "fr-btn")} {...onCloseLink} type="button">
          Fermer
        </a>
      </div>
      <div className="inline-flex justify-between items-center gap-4 mb-7">
        <h1 id={DIALOG_TITLE_ID} className={classNames(fr.cx("fr-modal__title"), "mb-0")}>
          {children}
        </h1>

        {letterGrade && (
          <GradeTextBadge
            letterGrade={letterGrade}
            badgeText={getLetterGradeBadgeText(badgeKind, letterGrade)}
          />
        )}
      </div>
    </>
  );
};
