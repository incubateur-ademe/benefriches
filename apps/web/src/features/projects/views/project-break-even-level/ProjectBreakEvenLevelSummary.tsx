import type { ReactNode } from "react";
import type { GetReconversionProjectImpactsResultDto } from "shared";
import { getBreakEvenCardContent, getBreakEvenHorizon } from "shared";

import { useAppSelector } from "@/app/hooks/store.hooks";
import type { ClassValue } from "@/shared/views/clsx";
import classNames from "@/shared/views/clsx";

import { selectImpactsPageViewData } from "../../application/project-impacts/selectors/projectImpacts.selectors";

type Props = {
  breakEvenYear: GetReconversionProjectImpactsResultDto["impacts"]["aggregatedReconversionImpacts"]["breakEvenYear"];
  projectionYears: GetReconversionProjectImpactsResultDto["impacts"]["projectionYears"];
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
        "fr-icon-checkbox-circle-fill fr-icon--right fr-icon before:[--icon-size:2.5rem] before:bg-blue-medium",
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
        "fr-icon-warning-fill fr-icon--right fr-icon before:[--icon-size:2.5rem] before:bg-blue-medium",
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

  const breakEvenHorizon = getBreakEvenHorizon({ breakEvenYear, projectionYears });
  const { headline, title, body } = getBreakEvenCardContent(breakEvenHorizon, evaluationPeriod);
  const Badge = breakEvenHorizon.status === "notCompensatedWithinPeriod" ? FailBadge : SuccessBadge;

  return (
    <>
      <Badge compact={compact}>{headline}</Badge>
      <h4 className={classNames("mb-4", classes?.title)}>{title}</h4>
      <p>{body}</p>
    </>
  );
}
