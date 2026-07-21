import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";

type CreationResultViewData = {
  projectName: string;
  saveState: "idle" | "dirty" | "loading" | "success" | "error";
};

export const createSelectCreationResultViewData = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
  selectSaveState: Selector<RootState, CreationResultViewData["saveState"]>,
) =>
  createSelector(
    [selectSteps, selectSaveState],
    (steps, saveState): CreationResultViewData => ({
      projectName: ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_NAMING")?.name ?? "",
      saveState,
    }),
  );
