import { useState } from "react";
import { ViewMode } from "../../../application/projectImpacts.reducer";
import { ImpactDescriptionModalCategory } from "./impact-description-modals/ImpactDescriptionModalWizard";
import ImpactsChartsView from "./charts-view";
import ImpactDescriptionModalWizard from "./impact-description-modals";
import ImpactsListViewContainer from "./list-view";

type Props = {
  currentViewMode: ViewMode;
  evaluationPeriod: number;
};

const ProjectImpactsView = ({ currentViewMode }: Props) => {
  const [modalCategoryOpened, setModalCategoryOpened] =
    useState<ImpactDescriptionModalCategory>(undefined);

  return (
    <>
      <ImpactDescriptionModalWizard
        modalCategory={modalCategoryOpened}
        onChangeModalCategoryOpened={setModalCategoryOpened}
      />
      {currentViewMode === "list" && (
        <ImpactsListViewContainer openImpactDescriptionModal={setModalCategoryOpened} />
      )}
      {currentViewMode === "charts" && (
        <ImpactsChartsView openImpactDescriptionModal={setModalCategoryOpened} />
      )}
    </>
  );
};

export default ProjectImpactsView;
