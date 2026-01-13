import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode, useState } from "react";

import { ViewMode } from "@/features/projects/application/project-impacts/projectImpacts.reducer";
import { ClassValue } from "@/shared/views/clsx";

import ImpactsActionBar, { ActionBarProps } from "./ActionBar";
import StickyActionBar from "./StickyActionBar";

type Props = {
  selectedViewMode: ViewMode;
  evaluationPeriod: number | undefined;
  onViewModeClick: (viewMode: ViewMode) => void;
  onEvaluationPeriodChange: (n: number) => void;
  onDownloadImpacts?: () => void;
  header: ReactNode;
  segments?: ActionBarProps["segments"];
  className?: ClassValue;
};

function ProjectImpactsActionBar({
  onViewModeClick,
  selectedViewMode,
  evaluationPeriod,
  onEvaluationPeriodChange,
  onDownloadImpacts,
  header,
  segments,
  className,
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
      <div className="flex flex-wrap gap-2 justify-between">
        <ImpactsActionBar
          ref={inlineActionBarRef}
          selectedViewMode={selectedViewMode}
          evaluationPeriod={evaluationPeriod}
          onViewModeClick={onViewModeClick}
          onEvaluationPeriodChange={onEvaluationPeriodChange}
          segments={segments}
          className={className}
        />
        {onDownloadImpacts && (
          <Button
            priority="primary"
            iconId="fr-icon-file-download-line"
            onClick={onDownloadImpacts}
          >
            Télécharger les impacts
          </Button>
        )}
      </div>
    </>
  );
}

export default ProjectImpactsActionBar;
