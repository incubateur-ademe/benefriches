import { ReactNode } from "react";
import { ReconversionProjectImpactsBreakEvenLevel } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import classNames, { ClassValue } from "@/shared/views/clsx";

import { selectImpactsPageViewData } from "../../core/projectImpacts.selectors";

type Props = Pick<ReconversionProjectImpactsBreakEvenLevel, "breakEvenYear" | "projectionYears"> & {
  classes?: { title?: ClassValue };
  compact?: boolean;
};

const SuccessBadge = ({ children, compact }: { children: ReactNode; compact?: boolean }) => {
  return (
    <span
      className={classNames(
        "inline-flex",
        "flex-row-reverse",
        "gap-2",
        "text-[32px]/tight font-bold rounded-lg",
        "bg-blue-ultralight dark:bg-blue-ultradark",
        compact ? "p-2" : ["px-4", "py-3"],
        "mb-4",
        "fr-icon-checkbox-circle-fill fr-icon--right fr-icon before:[--icon-size:2.5rem] before:bg-[#22AFE5]",
      )}
    >
      {children}
    </span>
  );
};

const FailBadge = ({ children, compact }: { children: ReactNode; compact?: boolean }) => {
  return (
    <span
      className={classNames(
        "inline-flex",
        "flex-row-reverse",
        "gap-2",
        "text-[32px]/tight font-bold rounded-lg",
        "bg-blue-ultralight dark:bg-blue-ultradark",
        compact ? ["px-3", "py-2"] : ["px-4", "py-3"],
        "mb-4",
        "fr-icon-warning-fill fr-icon--right fr-icon before:[--icon-size:2.5rem] before:bg-[#22AFE5]",
      )}
    >
      {children}
    </span>
  );
};

export default function ProjectBreakEvenLevelSummary({
  projectionYears,
  breakEvenYear,
  compact = false,
  classes,
}: Props) {
  const { evaluationPeriod = 50 } = useAppSelector(selectImpactsPageViewData);

  const breakEvenIndex = breakEvenYear ? projectionYears.indexOf(breakEvenYear) : undefined;

  if (breakEvenIndex !== undefined && breakEvenIndex !== -1) {
    if (breakEvenIndex === 0) {
      return (
        <>
          <SuccessBadge compact={compact}>En {breakEvenYear}</SuccessBadge>
          <h4 className={classNames("mb-4", classes?.title)}>Bilan de l’opération positif</h4>
          <p>
            La somme du bilan économiques et des impacts socio-économiques est positive dès{" "}
            {breakEvenYear}.
          </p>
        </>
      );
    }
    return (
      <>
        <SuccessBadge compact={compact}>
          En {breakEvenIndex} {breakEvenIndex > 1 ? "ans" : "an"}
        </SuccessBadge>
        <h4 className={classNames("mb-4", classes?.title)}>Coût de l’opération compensé</h4>
        <p>Les impacts socio-économiques compenseront le coût de l’opération en {breakEvenYear}.</p>
      </>
    );
  }

  return (
    <>
      <FailBadge compact={compact}>
        Sur {evaluationPeriod} {evaluationPeriod > 1 ? "ans" : "an"}
      </FailBadge>
      <h4 className={classNames("mb-4", classes?.title)}>Coût de l’opération non compensé</h4>
      <p>
        {breakEvenYear
          ? `Les impacts socio-économiques compenseront le coût de l’opération en ${breakEvenYear}.`
          : "Les impacts socio-économiques ne compenseront pas le coût de l’opération."}
      </p>
    </>
  );
}
