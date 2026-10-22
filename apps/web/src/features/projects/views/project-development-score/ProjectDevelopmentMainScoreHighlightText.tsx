import { Fragment } from "react/jsx-runtime";
import { type ProjectDevelopmentScore, typedObjectEntries } from "shared";

import classNames, { type ClassValue } from "@/shared/views/clsx";

const HIGHLIGHT_ELEMENTS = {
  localAuthorityEconomicScore: (
    <>
      les <strong>finances publiques</strong>
    </>
  ),
  fullTimeJobsScore: (
    <>
      l'<strong>emploi</strong>
    </>
  ),
  localPeopleQualityOfLifeScore: (
    <>
      la <strong>qualité de vie des riverains</strong>
    </>
  ),
  environmentScore: (
    <>
      l'<strong>environnement</strong>
    </>
  ),
} as const;

export default function (props: {
  developmentScore: ProjectDevelopmentScore;
  className?: ClassValue;
}) {
  const labels = typedObjectEntries(props.developmentScore.details)
    .filter(([, item]) => item.score.gradePoints > 50)
    .map(([key]) => HIGHLIGHT_ELEMENTS[key]);

  if (labels.length === 0) return null;

  return (
    <p className={classNames(props.className)}>
      Notamment sur{" "}
      {labels.map((label, i) => (
        <Fragment key={i}>
          {i > 0 && (i === labels.length - 1 ? " et " : ", ")}
          {label}
        </Fragment>
      ))}
      .
    </p>
  );
}
