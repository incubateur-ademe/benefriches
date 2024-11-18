import { fr } from "@codegouvfr/react-dsfr";
import { useEffect, useMemo, useRef, useState } from "react";

import { ViewMode } from "@/features/projects/application/projectImpacts.reducer";
import {
  ProjectDevelopmentPlanType,
  ProjectFeatures,
} from "@/features/projects/domain/projects.types";
import classNames from "@/shared/views/clsx";

import ImpactsActionBar from "../../shared/actions/ActionBar";
import ImpactEvaluationPeriodSelect from "../../shared/actions/ImpactEvaluationPeriodSelect";
import ProjectsImpactsPageHeader from "./ProjectPageHeader";

type Props = {
  selectedViewMode: ViewMode;
  evaluationPeriod: number;
  onViewModeClick: (viewMode: ViewMode) => void;
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

function ProjectImpactsActionBar({
  onViewModeClick,
  selectedViewMode,
  evaluationPeriod,
  onEvaluationPeriodChange,
  isSmScreen,
  headerProps,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(
    () =>
      new IntersectionObserver(([entry]) => {
        setIntersecting(!!entry?.isIntersecting);
      }),
    [],
  );

  useEffect(() => {
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [observer]);

  return (
    <>
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
          isIntersecting && "tw-hidden",
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
      <ImpactsActionBar
        ref={ref}
        selectedViewMode={selectedViewMode}
        evaluationPeriod={evaluationPeriod}
        onViewModeClick={onViewModeClick}
        onEvaluationPeriodChange={onEvaluationPeriodChange}
        small={isSmScreen}
      />
    </>
  );
}

export default ProjectImpactsActionBar;
