import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { saveReconversionProject } from "@/features/create-project/core/renewable-energy/actions/customProjectSaved.action";
import {
  previousStepRequested,
  stepNavigationRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { RenewableEnergyCreationStep } from "@/features/create-project/core/renewable-energy/renewableEnergySteps";
import { selectPhotovoltaicPowerPlantSummaryNavigationDataView } from "@/features/create-project/core/renewable-energy/selectors/stepper.selector";
import { selectPhotovoltaicFinalSummaryViewData } from "@/features/create-project/core/renewable-energy/step-handlers/summary/summary-final/summaryFinal.selector";

import ProjectionCreationDataSummary from "./ProjectCreationDataSummary";

function ProjectionCreationDataSummaryContainer() {
  const { projectData, siteData } = useAppSelector(selectPhotovoltaicFinalSummaryViewData);
  const { stepGroups } = useAppSelector(selectPhotovoltaicPowerPlantSummaryNavigationDataView);

  const dispatch = useAppDispatch();

  const onNext = () => {
    void dispatch(saveReconversionProject());
  };

  const onBack = () => {
    dispatch(previousStepRequested());
  };

  const onNavigateToStep = (stepId: RenewableEnergyCreationStep) => {
    dispatch(stepNavigationRequested({ stepId }));
  };

  return (
    <ProjectionCreationDataSummary
      onNext={onNext}
      onBack={onBack}
      projectData={projectData}
      siteData={siteData}
      stepperGroups={stepGroups}
      onNavigateToStep={onNavigateToStep}
    />
  );
}

export default ProjectionCreationDataSummaryContainer;
