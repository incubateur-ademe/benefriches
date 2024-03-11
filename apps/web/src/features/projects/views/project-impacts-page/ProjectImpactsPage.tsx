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
      difference: number;
      greenSoil: {
        base: number;
        forecast: number;
        difference: number;
      };
      mineralSoil: {
        base: number;
        forecast: number;
        difference: number;
      };
    };
    contaminatedSurfaceArea?: {
      base: number;
      forecast: number;
      difference: number;
    };
  };
};

type ImpactCategory = "economic" | "environment" | "social";
export type ImpactCategoryFilter = ImpactCategory | "all";

const NewProjectImpactsPage = ({ project, impacts }: Props) => {
  const [selectedFilter, setSelectedFilter] = useState<ImpactCategoryFilter>("all");
  console.log(selectedFilter);

  return (
    <div>
      <ProjectsImpactsPageHeader
        projectId={project.id}
        projectName={project.name}
        siteName={project.relatedSiteName}
      />
      <ProjectsComparisonActionBar
        selectedFilter={selectedFilter}
        onFilterClick={(clickedFilter: ImpactCategoryFilter) => {
          const newFilter = selectedFilter === clickedFilter ? "all" : clickedFilter;
          setSelectedFilter(newFilter);
        }}
      />
      <ImpactsChartsView project={project} impacts={impacts} />
    </div>
  );
};

export default NewProjectImpactsPage;
