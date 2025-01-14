import { useState } from "react";

import { ViewMode } from "@/features/projects/application/projectImpacts.reducer";

import ImpactsActionBar from "../../shared/actions/ActionBar";
import { HeaderProps } from "./ProjectPageHeader";
import StickyActionBar from "./StickyActionBar";

type Props = {
  selectedViewMode: ViewMode;
  evaluationPeriod: number;
  onViewModeClick: (viewMode: ViewMode) => void;
  onEvaluationPeriodChange: (n: number) => void;
  headerProps: HeaderProps;
};

function ProjectImpactsActionBar({
  onViewModeClick,
  selectedViewMode,
  evaluationPeriod,
  onEvaluationPeriodChange,
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
        />
      )}
      <ImpactsActionBar
        ref={inlineActionBarRef}
        selectedViewMode={selectedViewMode}
        evaluationPeriod={evaluationPeriod}
        onViewModeClick={onViewModeClick}
        onEvaluationPeriodChange={onEvaluationPeriodChange}
      />
    </>
  );
}

export default ProjectImpactsActionBar;
