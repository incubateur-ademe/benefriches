import { useState } from "react";
import { ViewMode } from "../../application/projectImpacts.reducer";
import { ImpactDescriptionModalCategory } from "./modals/ImpactDescriptionModalWizard";
import AboutImpactsModal from "./AboutImpactsModal";
import ImpactsChartsView from "./charts-view";
import ImpactsListViewContainer from "./list-view";
import ImpactDescriptionModalWizard from "./modals";

type Props = {
  currentViewMode: ViewMode;
  evaluationPeriod: number;
};

const ProjectImpactsPage = ({ currentViewMode }: Props) => {
  const [modalCategoryOpened, setModalCategoryOpened] =
    useState<ImpactDescriptionModalCategory>(undefined);

  return (
    <>
      <ImpactDescriptionModalWizard
        modalCategory={modalCategoryOpened}
        onChangeModalCategoryOpened={setModalCategoryOpened}
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
