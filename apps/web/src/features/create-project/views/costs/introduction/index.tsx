import { goToStep, ProjectCreationStep } from "../../../application/createProject.reducer";
import ProjectCostsIntroduction from "./ProjectCostsIntroduction";

import { AppDispatch } from "@/app/application/store";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const getNextStep = (isFriche: boolean, hasRealEstateTransaction: boolean) => {
  if (hasRealEstateTransaction) {
    return ProjectCreationStep.COSTS_REAL_ESTATE_TRANSACTION_AMOUNT;
  }
  if (isFriche) {
    return ProjectCreationStep.COSTS_REINSTATEMENT;
  }
  return ProjectCreationStep.COSTS_PHOTOVOLTAIC_PANELS_INSTALLATION;
};

const mapProps = (dispatch: AppDispatch, isFriche: boolean, hasRealEstateTransaction: boolean) => {
  return {
    onNext: () => {
      dispatch(goToStep(getNextStep(isFriche, hasRealEstateTransaction)));
    },
  };
};

function ProjectCostsIntroductionContainer() {
  const dispatch = useAppDispatch();
  const isFriche = useAppSelector((state) => state.projectCreation.siteData?.isFriche ?? false);
  const hasRealEstateTransaction = useAppSelector(
    (state) => state.projectCreation.projectData.hasRealEstateTransaction ?? false,
  );

  return <ProjectCostsIntroduction {...mapProps(dispatch, isFriche, hasRealEstateTransaction)} />;
}

export default ProjectCostsIntroductionContainer;
