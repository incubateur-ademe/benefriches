import { ReconversionProjectImpactsBreakEvenLevel } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import classNames, { ClassValue } from "@/shared/views/clsx";

import { selectImpactsPageViewData } from "../../core/projectImpacts.selectors";

type Props = Pick<ReconversionProjectImpactsBreakEvenLevel, "breakEvenYear" | "projectionYears"> & {
  classes?: { title?: ClassValue };
};

export default function ProjectBreakEvenLevelSummary({
  projectionYears,
  breakEvenYear,
  classes,
}: Props) {
  const { evaluationPeriod = 50 } = useAppSelector(selectImpactsPageViewData);

  const breakEvenIndex = breakEvenYear ? projectionYears.indexOf(breakEvenYear) : undefined;

  if (breakEvenIndex && breakEvenIndex !== -1) {
    return (
      <>
        <span
          className={classNames(
            "bg-blue-ultralight dark:bg-blue-ultradark",
            `fr-badge`,
            "text-[32px]",
            "px-3",
            "py-4",
            "mb-4",
          )}
        >
          En {breakEvenIndex} {breakEvenIndex > 1 ? "ans" : "an"}
        </span>
        <h4 className={classNames("mb-4", classes?.title)}>Coût de l’opération compensé</h4>
        <p>Les impacts socio-économiques compenseront le coût de l’opération en {breakEvenYear}.</p>
      </>
    );
  }

  return (
    <>
      <span
        className={classNames(
          "bg-blue-ultralight",
          `fr-badge`,
          "text-[32px]",
          "px-3",
          "py-4",
          "mb-4",
        )}
      >
        Sur {evaluationPeriod} {evaluationPeriod > 1 ? "ans" : "an"}
      </span>
      <h4 className={classNames("mb-4", classes?.title)}>Coût de l’opération non compensé</h4>
      <p>
        {breakEvenYear
          ? `Les impacts socio-économiques compenseront le coût de l’opération en ${breakEvenYear}.`
          : "Les impacts socio-économiques ne compenseront pas le coût de l’opération."}
      </p>
    </>
  );
}
