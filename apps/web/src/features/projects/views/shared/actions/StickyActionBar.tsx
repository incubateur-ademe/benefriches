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
        "bg-dsfr-grey",
        "shadow-md",
        "left-0",
        "z-30",
        "w-full",
        "fixed",
        "top-0",
        "py-4 md:p-4",
      )}
    >
      <div
        className={classNames(
          fr.cx("fr-container"),
          "flex",
          "flex-col",
          "md:flex-row",
          "justify-between",
          "items-end",
          "md:items-center",
        )}
      >
        {header}
        {!isSmScreen && evaluationPeriod !== undefined && (
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
