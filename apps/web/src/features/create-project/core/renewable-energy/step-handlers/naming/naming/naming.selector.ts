import { createSelector } from "@reduxjs/toolkit";

import { generateRenewableEnergyProjectName } from "../../../../../../../shared/core/reducers/project-form/helpers/projectName";
import { ReadStateHelper } from "../../../helpers/readState";
import {
  selectRenewableEnergyType,
  selectSteps,
} from "../../../selectors/renewableEnergy.selector";

export const selectNameAndDescriptionInitialValues = createSelector(
  [selectSteps, selectRenewableEnergyType],
  (steps, renewableEnergyType) => {
    const naming = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_NAMING");
    if (naming?.name) {
      return { name: naming.name, description: naming.description };
    }
    if (renewableEnergyType) {
      return { name: generateRenewableEnergyProjectName(renewableEnergyType) };
    }
    return undefined;
  },
);
