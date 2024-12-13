import { fr } from "@codegouvfr/react-dsfr";

import {
  ProjectDevelopmentPlanType,
  ProjectFeatures,
} from "@/features/projects/domain/projects.types";
import classNames from "@/shared/views/clsx";

import ImpactEvaluationPeriodSelect from "../../shared/actions/ImpactEvaluationPeriodSelect";
import ProjectsImpactsPageHeader from "./ProjectPageHeader";

type Props = {
  evaluationPeriod: number;
  onEvaluationPeriodChange: (n: number) => void;
  isSmScreen?: boolean;
  headerProps: {
    projectName: string;
    projectFeaturesData?: ProjectFeatures;
    onFetchProjectFeatures?: () => void;
    siteFeaturesHref: string;
    siteName: string;
    projectType?: ProjectDevelopmentPlanType;
    onGoToImpactsOnBoarding: () => void;
    isExpressProject: boolean;
    isSmall?: boolean;
  };
};

function ProjectImpactsStickyActionBar({
  evaluationPeriod,
  onEvaluationPeriodChange,
  isSmScreen,
  headerProps,
}: Props) {
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
        <ProjectsImpactsPageHeader {...headerProps} isSmall />
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
