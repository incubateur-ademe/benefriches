import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../../helpers/readState";
import { selectSteps } from "../../../selectors/renewableEnergy.selector";

const selectSaveState = (state: RootState) =>
  state.projectCreation.renewableEnergyProject.saveState;

type CreationResultViewData = {
  projectName: string;
  saveState: "idle" | "loading" | "success" | "error";
};

export const selectCreationResultViewData = createSelector(
  [selectSteps, selectSaveState],
  (steps, saveState): CreationResultViewData => ({
    projectName: ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_NAMING")?.name ?? "",
    saveState,
  }),
);
