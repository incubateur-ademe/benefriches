import { useState } from "react";
import { SoilsDistribution } from "shared";
import { ImpactCategoryFilter, ViewMode } from "../../application/projectImpacts.reducer";
import { ReconversionProjectImpacts } from "../../domain/impacts.types";
import ImpactsChartsView from "./charts-view/ImpactsChartsView";
import ImpactsListView from "./list-view/ImpactsListView";
import {
  ImpactDescriptionModalCategory,
  ImpactDescriptionModalWizard,
} from "./modals/ImpactDescriptionModalWizard";
import AboutImpactsModal from "./AboutImpactsModal";

type Props = {
  currentFilter: ImpactCategoryFilter;
  currentViewMode: ViewMode;
  evaluationPeriod: number;
  project: {
    name: string;
    id: string;
    soilsDistribution: SoilsDistribution;
    contaminatedSoilSurface: 0;
    developmentPlan: {
      surfaceArea?: number;
      electricalPowerKWc?: number;
    };
  };
  relatedSite: {
    name: string;
    addressLabel: string;
    soilsDistribution: SoilsDistribution;
    contaminatedSoilSurface: number;
  };
  impacts: ReconversionProjectImpacts;
};

const ProjectImpactsPage = ({
  project,
  relatedSite,
  impacts,
  currentFilter,
  currentViewMode,
}: Props) => {
  const [modalCategoryOpened, setModalCategoryOpened] =
    useState<ImpactDescriptionModalCategory>(undefined);

  const displayAll = currentFilter === "all";
  const displayEconomicData = displayAll || currentFilter === "economic";
  const displayEnvironmentData = displayAll || currentFilter === "environment";
  const displaySocialData = displayAll || currentFilter === "social";

  return (
    <>
      <ImpactDescriptionModalWizard
        modalCategory={modalCategoryOpened}
        onChangeModalCategoryOpened={setModalCategoryOpened}
        projectData={project}
        siteData={relatedSite}
      />
      {currentViewMode === "charts" && (
        <ImpactsChartsView
          project={project}
          impacts={impacts}
          displayEconomicData={displayEconomicData}
          displayEnvironmentData={displayEnvironmentData}
          displaySocialData={displaySocialData}
          openImpactDescriptionModal={setModalCategoryOpened}
        />
      )}
      {currentViewMode === "list" && (
        <ImpactsListView
          displayEconomicData={displayEconomicData}
          displayEnvironmentData={displayEnvironmentData}
          displaySocialData={displaySocialData}
          project={project}
          impacts={impacts}
          openImpactDescriptionModal={setModalCategoryOpened}
        />
      )}
      <AboutImpactsModal />
    </>
  );
};

export default ProjectImpactsPage;
