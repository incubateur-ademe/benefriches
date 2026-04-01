import { createReducer } from "@reduxjs/toolkit";
import reduceReducers from "reduce-reducers";
import { v4 as uuid } from "uuid";

import {
  addProjectFormCasesToBuilder,
  getProjectFormInitialState,
  ProjectFormState,
} from "@/shared/core/reducers/project-form/projectForm.reducer";
import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { fetchSiteRelatedLocalAuthorities } from "./actions/getSiteLocalAuthorities.action";
import { reconversionProjectCreationInitiated } from "./actions/reconversionProjectCreationInitiated.action";
import { surfaceAreaInputModeUpdated } from "./actions/surfaceAreaInputModeUpdated.action";
import {
  DEMO_INITIAL_STATE,
  demoProjectCreationReducer,
  DemoProjectCreationState,
} from "./demo/demoProject.reducer";
import { DemoProjectCreationStep } from "./demo/demoSteps.ts";
import {
  RenewableEnergyProjectState,
  INITIAL_STATE as renenewableEnergyProjectInitialState,
  renewableEnergyProjectReducer,
} from "./renewable-energy/renewableEnergy.reducer";
import type { AllRenewableEnergyStep } from "./renewable-energy/renewableEnergySteps";
import urbanProjectReducer from "./urban-project/urbanProject.reducer";
import {
  USE_CASE_SELECTION_INITIAL_STATE,
  useCaseSelectionProjectCreationReducer,
  UseCaseSelectionState,
  UseCaseSelectionStep,
} from "./usecase-selection/useCaseSelection.reducer";

export type ProjectCreationState = ProjectFormState & {
  projectId: string;
  currentStepGroup: "USE_CASE_SELECTION" | "DEMO" | "PHOTOVOLTAIC_POWER_PLANT" | "URBAN_PROJECT";
  useCaseSelection: UseCaseSelectionState;
  renewableEnergyProject: RenewableEnergyProjectState;
  demoProject: DemoProjectCreationState;
  surfaceAreaInputMode: "percentage" | "squareMeters";
};

export type ProjectCreationStep =
  | UseCaseSelectionStep
  | DemoProjectCreationStep
  | UrbanProjectCreationStep
  | AllRenewableEnergyStep;

export const getInitialState = (): ProjectCreationState => {
  return {
    projectId: uuid(),
    currentStepGroup: "USE_CASE_SELECTION",
    useCaseSelection: USE_CASE_SELECTION_INITIAL_STATE,
    demoProject: DEMO_INITIAL_STATE,
    renewableEnergyProject: renenewableEnergyProjectInitialState,
    surfaceAreaInputMode: "percentage",
    ...getProjectFormInitialState("URBAN_PROJECT_USES_INTRODUCTION"),
  };
};

const projectCreationReducer = createReducer(getInitialState(), (builder) => {
  addProjectFormCasesToBuilder(builder, { fetchSiteRelatedLocalAuthorities });

  builder
    .addCase(reconversionProjectCreationInitiated.pending, (_state, action) => {
      const { useCaseSelection, ...initialState } = getInitialState();
      return {
        ...initialState,
        siteDataLoadingState: "loading",
        useCaseSelection: {
          ...useCaseSelection,
          projectSuggestions: action.meta.arg.projectSuggestions,
        },
      };
    })
    .addCase(reconversionProjectCreationInitiated.fulfilled, (state, action) => {
      state.siteData = action.payload;

      // TODO : supprimer !state.useCaseSelection.projectSuggestions quand on pourra créer des sites custom post mutafriches
      if (action.payload.isExpressSite && !state.useCaseSelection.projectSuggestions) {
        state.useCaseSelection.stepsSequence = [];
        state.currentStepGroup = "DEMO";
        state.useCaseSelection.creationMode = "express";
      }

      state.siteDataLoadingState = "success";
    })
    .addCase(reconversionProjectCreationInitiated.rejected, (state) => {
      state.siteDataLoadingState = "error";
    })
    .addCase(surfaceAreaInputModeUpdated, (state, action) => {
      state.surfaceAreaInputMode = action.payload;
    });
});

const projectCreationRootReducer = reduceReducers<ProjectCreationState>(
  getInitialState(),
  projectCreationReducer,
  urbanProjectReducer,
  renewableEnergyProjectReducer,
  demoProjectCreationReducer,
  useCaseSelectionProjectCreationReducer,
);

export default projectCreationRootReducer;
