import { fr } from "@codegouvfr/react-dsfr";

import classNames from "@/shared/views/clsx";
import { useIsSmallScreen } from "@/shared/views/hooks/useIsSmallScreen";

import ImpactEvaluationPeriodSelect from "../../shared/actions/ImpactEvaluationPeriodSelect";
import ProjectsImpactsPageHeader, { HeaderProps } from "./ProjectPageHeader";

type Props = {
  evaluationPeriod: number;
  onEvaluationPeriodChange: (n: number) => void;
  headerProps: HeaderProps;
};

function ProjectImpactsStickyActionBar({
  evaluationPeriod,
  onEvaluationPeriodChange,
  headerProps,
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
          fr.cx("fr-container-md"),
          "tw-flex",
          "tw-flex-col",
          "md:tw-flex-row",
          "tw-justify-between",
          "tw-items-center",
        )}
      >
        <ProjectsImpactsPageHeader size="small" {...headerProps} />
        {!isSmScreen && (
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
