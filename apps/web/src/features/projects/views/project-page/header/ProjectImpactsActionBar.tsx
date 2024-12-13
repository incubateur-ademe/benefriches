import { useState } from "react";

import { ViewMode } from "@/features/projects/application/projectImpacts.reducer";
import {
  ProjectDevelopmentPlanType,
  ProjectFeatures,
} from "@/features/projects/domain/projects.types";

import ImpactsActionBar from "../../shared/actions/ActionBar";
import StickyActionBar from "./StickyActionBar";

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
  const [isActionBarInViewport, setIsActionBarInViewPort] = useState(false);

  const inlineActionBarRef = (node: HTMLElement) => {
    const observer = new IntersectionObserver(([entry]) => {
      const entryIntersecting = entry?.isIntersecting ?? false;
      setIsActionBarInViewPort(entryIntersecting);
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  };

  return (
    <>
      {!isActionBarInViewport && (
        <StickyActionBar
          headerProps={headerProps}
          evaluationPeriod={evaluationPeriod}
          onEvaluationPeriodChange={onEvaluationPeriodChange}
          isSmScreen={isSmScreen}
        />
      )}
      <ImpactsActionBar
        ref={inlineActionBarRef}
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
