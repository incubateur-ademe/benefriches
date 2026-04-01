import { createSelector } from "@reduxjs/toolkit";

import { generateRenewableEnergyProjectName } from "../../../../../../../shared/core/reducers/project-form/helpers/projectName";
import { ReadStateHelper } from "../../../helpers/readState";
import { selectSteps } from "../../../selectors/renewableEnergy.selector";

export const selectNameAndDescriptionInitialValues = createSelector([selectSteps], (steps) => {
  const naming = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_NAMING");
  if (naming?.name) {
    return { name: naming.name, description: naming.description };
  }
  return { name: generateRenewableEnergyProjectName("PHOTOVOLTAIC_POWER_PLANT") };
});
