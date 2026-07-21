import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { RenewableEnergyCreationStep } from "@/features/create-project/core/renewable-energy/renewableEnergySteps";
import ProjectCreationDataSummary from "@/features/create-project/views/photovoltaic-power-station/summary/ProjectCreationDataSummary";

import { reconversionProjectUpdateSaved } from "../../../core/updateProject.actions";
import { updateProjectFormRenewableEnergyActions } from "../../../core/updateProject.actions";
import {
  selectPhotovoltaicFinalSummaryViewData,
  selectPhotovoltaicPowerPlantUpdateStepperDataView,
} from "../../../core/updateProjectRenewableEnergy.selectors";

function ProjectUpdateDataSummaryContainer() {
  const { projectData, siteData } = useAppSelector(selectPhotovoltaicFinalSummaryViewData);
  const { stepGroups } = useAppSelector(selectPhotovoltaicPowerPlantUpdateStepperDataView);

  const dispatch = useAppDispatch();

  const onNext = () => {
    void dispatch(reconversionProjectUpdateSaved());
  };

  const onBack = () => {
    dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
  };

  const onNavigateToStep = (stepId: RenewableEnergyCreationStep) => {
    dispatch(updateProjectFormRenewableEnergyActions.stepNavigationRequested({ stepId }));
  };

  return (
    <ProjectCreationDataSummary
      onNext={onNext}
      onBack={onBack}
      projectData={projectData}
      siteData={siteData}
      stepperGroups={stepGroups}
      onNavigateToStep={onNavigateToStep}
    />
  );
}

export default ProjectUpdateDataSummaryContainer;
