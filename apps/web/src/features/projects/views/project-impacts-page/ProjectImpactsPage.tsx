import { useState } from "react";
import ProjectsComparisonActionBar from "../shared/actions/ActionBar";
import ImpactsChartsView from "./ImpactsChartsView";
import ProjectsImpactsPageHeader from "./ProjectImpactsPageHeader";

type Props = {
  project: {
    name: string;
    id: string;
    relatedSiteName: string;
  };
  impacts: {
    permeableSurfaceArea: {
      base: number;
      forecast: number;
      greenSoil: {
        base: number;
        forecast: number;
      };
      mineralSoil: {
        base: number;
        forecast: number;
      };
    };
    contaminatedSurfaceArea?: {
      base: number;
      forecast: number;
    };
  };
};

type ImpactCategory = "economic" | "environment" | "social";
export type ImpactCategoryFilter = ImpactCategory | "all";

export type ViewMode = "charts" | "list";

const NewProjectImpactsPage = ({ project, impacts }: Props) => {
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
        onFilterClick={setSelectedFilter}
        onViewModeClick={setViewMode}
      />
      {currentViewMode === "charts" && <ImpactsChartsView project={project} impacts={impacts} />}
    </div>
  );
};

export default NewProjectImpactsPage;
