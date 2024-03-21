import { useState } from "react";
import { ReconversionProjectImpacts } from "../../domain/impacts.types";
import ProjectsComparisonActionBar from "../shared/actions/ActionBar";
import ImpactsListView from "./list-view/ImpactsListView";
import ImpactsChartsView from "./ImpactsChartsView";
import ProjectsImpactsPageHeader from "./ProjectImpactsPageHeader";

type Props = {
  onEvaluationPeriodChange: (n: number) => void;
  evaluationPeriod: number;
  project: {
    name: string;
    id: string;
    relatedSiteName: string;
  };
  impacts: ReconversionProjectImpacts;
};

type ImpactCategory = "economic" | "environment" | "social";
export type ImpactCategoryFilter = ImpactCategory | "all";

export type ViewMode = "charts" | "list";

const ProjectImpactsPage = ({
  project,
  impacts,
  onEvaluationPeriodChange,
  evaluationPeriod,
}: Props) => {
  const [currentFilter, setSelectedFilter] = useState<ImpactCategoryFilter>("all");
  const [currentViewMode, setViewMode] = useState<ViewMode>("charts");

  return (
    <div>
      <ProjectsImpactsPageHeader
        projectId={project.id}
        projectName={project.name}
        siteName={project.relatedSiteName}
      />
      <ProjectsComparisonActionBar
        selectedFilter={currentFilter}
        selectedViewMode={currentViewMode}
        evaluationPeriod={evaluationPeriod}
        onFilterClick={setSelectedFilter}
        onViewModeClick={setViewMode}
        onEvaluationPeriodChange={onEvaluationPeriodChange}
      />
      {currentViewMode === "charts" && <ImpactsChartsView project={project} impacts={impacts} />}
      {currentViewMode === "list" && <ImpactsListView project={project} impacts={impacts} />}
    </div>
  );
};

export default ProjectImpactsPage;
