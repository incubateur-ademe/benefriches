import { fr } from "@codegouvfr/react-dsfr";
import { ReactNode } from "react";

import classNames from "@/shared/views/clsx";
import { useIsSmallScreen } from "@/shared/views/hooks/useIsSmallScreen";

import ImpactEvaluationPeriodSelect from "./ImpactEvaluationPeriodSelect";

type Props = {
  evaluationPeriod: number | undefined;
  onEvaluationPeriodChange: (n: number) => void;
  header: ReactNode;
};

function ProjectImpactsStickyActionBar({
  evaluationPeriod,
  onEvaluationPeriodChange,
  header,
}: Props) {
  const isSmScreen = useIsSmallScreen();

  return (
    <div
      className={classNames(
        "tw-bg-dsfr-grey",
        "tw-shadow-md",
        "tw-left-0",
        "tw-z-30",
        "tw-w-full",
        "tw-fixed",
        "tw-top-0",
        "tw-py-4 md:tw-p-4",
      )}
    >
      <div
        className={classNames(
          fr.cx("fr-container"),
          "tw-flex",
          "tw-flex-col",
          "md:tw-flex-row",
          "tw-justify-between",
          "tw-items-end",
          "md:tw-items-center",
        )}
      >
        {header}
        {!isSmScreen && evaluationPeriod !== undefined && && (
          <ImpactEvaluationPeriodSelect
            onChange={onEvaluationPeriodChange}
            value={evaluationPeriod}
          />
        )}
      </div>
    </div>
  );
}

export default ProjectImpactsStickyActionBar;
