import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { generateRenewableEnergyProjectName } from "../../../../project-form/projectName";
import { ReadStateHelper } from "../../../helpers/readState";

export const createSelectNameAndDescriptionInitialValues = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
) =>
  createSelector([selectSteps], (steps) => {
    const naming = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_NAMING");
    if (naming?.name) {
      return { name: naming.name, description: naming.description };
    }
    return { name: generateRenewableEnergyProjectName("PHOTOVOLTAIC_POWER_PLANT") };
  });
