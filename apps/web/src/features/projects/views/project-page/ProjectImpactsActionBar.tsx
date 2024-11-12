import { fr } from "@codegouvfr/react-dsfr";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  ImpactCategoryFilter,
  ViewMode,
} from "@/features/projects/application/projectImpacts.reducer";
import classNames from "@/shared/views/clsx";

import ImpactsActionBar from "../shared/actions/ActionBar";
import ImpactEvaluationPeriodSelect from "../shared/actions/ImpactEvaluationPeriodSelect";
import ProjectsImpactsPageHeader from "./ProjectPageHeader";

type Props = {
  selectedFilter: ImpactCategoryFilter;
  selectedViewMode: ViewMode;
  evaluationPeriod: number;
  onFilterClick: (filterValue: ImpactCategoryFilter) => void;
  onViewModeClick: (viewMode: ViewMode) => void;
  onEvaluationPeriodChange: (n: number) => void;
  projectName: string;
  projectId: string;
  siteName: string;
  siteId: string;
  isExpressProject: boolean;
  isSmScreen?: boolean;
};

function ProjectImpactsActionBar({
  onFilterClick,
  onViewModeClick,
  selectedFilter,
  selectedViewMode,
  evaluationPeriod,
  onEvaluationPeriodChange,
  projectName,
  projectId,
  siteName,
  siteId,
  isExpressProject,
  isSmScreen,
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
          "tw-p-4",
          isIntersecting && "tw-hidden",
        )}
      >
        <div
          className={classNames(
            fr.cx("fr-container"),
            "tw-flex",
            "tw-flex-col",
            "md:tw-flex-row",
            "tw-justify-between",
            "tw-items-center",
          )}
        >
          <ProjectsImpactsPageHeader
            projectName={projectName}
            projectId={projectId}
            siteName={siteName}
            siteId={siteId}
            isExpressProject={isExpressProject}
            isFloatingHeader
            isSmScreen={isSmScreen}
          />
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
        selectedFilter={selectedFilter}
        selectedViewMode={selectedViewMode}
        evaluationPeriod={evaluationPeriod}
        onFilterClick={onFilterClick}
        onViewModeClick={onViewModeClick}
        onEvaluationPeriodChange={onEvaluationPeriodChange}
      />
    </>
  );
}

export default ProjectImpactsActionBar;
