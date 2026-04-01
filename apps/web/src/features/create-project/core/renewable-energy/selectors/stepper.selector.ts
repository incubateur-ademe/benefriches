import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";
import { StepVariant } from "@/shared/views/layout/WizardFormLayout/FormBaseStepperStep";

import {
  RENEWABLE_ENERGY_STEP_GROUP_IDS,
  RENEWABLE_ENERGY_STEP_GROUP_LABELS,
  RENEWABLE_ENERGY_STEP_TO_GROUP,
} from "../step-handlers/renewableEnergyStepperConfig";

type PhotovoltaicPowerPlantStepperDataView = {
  stepCategories: (StepVariant & { title: string })[];
};
export const selectPhotovoltaicPowerPlantStepperDataView = createSelector(
  (state: RootState) => state.projectCreation,
  (projectState): PhotovoltaicPowerPlantStepperDataView => {
    const currentStep = projectState.renewableEnergyProject.currentStep;
    const currentProjectFlow = projectState.currentProjectFlow;

    const { groupId } = RENEWABLE_ENERGY_STEP_TO_GROUP[currentStep];

    const currentStepIndex = RENEWABLE_ENERGY_STEP_GROUP_IDS.indexOf(groupId);
    const isDone = currentStep === "RENEWABLE_ENERGY_CREATION_RESULT";

    return {
      stepCategories: RENEWABLE_ENERGY_STEP_GROUP_IDS.map((id, index) => {
        const isPreviousStep = currentStepIndex > index;
        const isCurrent =
          currentProjectFlow === "PHOTOVOLTAIC_POWER_PLANT" && currentStepIndex === index;
        const isCompleted = isPreviousStep || (isCurrent && isDone);

        return {
          title: RENEWABLE_ENERGY_STEP_GROUP_LABELS[id],
          activity: isCurrent ? "current" : "inactive",
          validation: isCompleted ? "completed" : "empty",
        };
      }),
    };
  },
);
