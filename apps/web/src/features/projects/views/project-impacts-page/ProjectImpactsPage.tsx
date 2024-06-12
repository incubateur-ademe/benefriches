import { useState } from "react";
import { SoilsDistribution } from "shared";
import { ViewMode } from "../../application/projectImpacts.reducer";
import {
  ImpactDescriptionModalCategory,
  ImpactDescriptionModalWizard,
} from "./modals/ImpactDescriptionModalWizard";
import AboutImpactsModal from "./AboutImpactsModal";
import ImpactsChartsView from "./charts-view";
import ImpactsListViewContainer from "./list-view";

type Props = {
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
};

const ProjectImpactsPage = ({ project, relatedSite, currentViewMode }: Props) => {
  const [modalCategoryOpened, setModalCategoryOpened] =
    useState<ImpactDescriptionModalCategory>(undefined);

  return (
    <>
      <ImpactDescriptionModalWizard
        modalCategory={modalCategoryOpened}
        onChangeModalCategoryOpened={setModalCategoryOpened}
        projectData={project}
        siteData={relatedSite}
      />
      {currentViewMode === "charts" && (
        <ImpactsChartsView openImpactDescriptionModal={setModalCategoryOpened} />
      )}
      {currentViewMode === "list" && (
        <ImpactsListViewContainer openImpactDescriptionModal={setModalCategoryOpened} />
      )}
      <AboutImpactsModal />
    </>
  );
};

export default ProjectImpactsPage;
