import { ReactNode, useState } from "react";

import { ViewMode } from "@/features/projects/application/project-impacts/projectImpacts.reducer";

import ImpactsActionBar from "./ActionBar";
import StickyActionBar from "./StickyActionBar";

type Props = {
  selectedViewMode: ViewMode;
  evaluationPeriod: number | undefined;
  onViewModeClick: (viewMode: ViewMode) => void;
  onEvaluationPeriodChange: (n: number) => void;
  header: ReactNode;
  disabledSegments?: ViewMode[];
};

function ProjectImpactsActionBar({
  onViewModeClick,
  selectedViewMode,
  evaluationPeriod,
  onEvaluationPeriodChange,
  header,
  disabledSegments,
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
          header={header}
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
        disabledSegments={disabledSegments}
      />
    </>
  );
}

export default ProjectImpactsActionBar;
