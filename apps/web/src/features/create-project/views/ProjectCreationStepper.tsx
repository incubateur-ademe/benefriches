import { useAppSelector } from "@/app/hooks/store.hooks";
import FormStepperWrapper from "@/shared/views/layout/WizardFormLayout/FormStepperWrapper";

import { selectMainStepperViewData } from "../core/createProject.selectors";
import DemoProjectCreationStepperSteps from "./demo/DemoProjectCreationStepperSteps";
import PhotovoltaicPowerPlantCreationStepperSteps from "./photovoltaic-power-station/PhotovoltaicPowerStationStepper";
import UrbanProjectCreationStepperSteps from "./urban-project/UrbanProjectCreationStepperSteps";
import UseCaseSelectionStepperSteps from "./usecase-selection/UseCaseSelectionStepperSteps";

function ProjectCreationStepper() {
  const { creationMode, developmentPlanType } = useAppSelector(selectMainStepperViewData);

  return (
    <FormStepperWrapper>
      <UseCaseSelectionStepperSteps />

      {creationMode === "express" && <DemoProjectCreationStepperSteps />}
      {creationMode === "custom" && developmentPlanType === "URBAN_PROJECT" && (
        <UrbanProjectCreationStepperSteps />
      )}
      {creationMode === "custom" && developmentPlanType === "PHOTOVOLTAIC_POWER_PLANT" && (
        <PhotovoltaicPowerPlantCreationStepperSteps />
      )}
    </FormStepperWrapper>
  );
}

export default ProjectCreationStepper;
