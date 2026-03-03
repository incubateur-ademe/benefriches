import { createSelector } from "@reduxjs/toolkit";

import { ReadStateHelper } from "../../helpers/readState";
import { selectSteps } from "../../selectors/renewableEnergy.selector";

export const selectSoilsTransformationProjectSelectionViewData = createSelector(
  selectSteps,
  (steps) => {
    const soilsTransformationProject = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
    )?.soilsTransformationProject;

    return {
      initialValues: soilsTransformationProject ? { soilsTransformationProject } : undefined,
    };
  },
);
