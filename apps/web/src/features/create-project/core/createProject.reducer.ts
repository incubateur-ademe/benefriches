import { createReducer } from "@reduxjs/toolkit";
import reduceReducers from "reduce-reducers";
import { DevelopmentPlanCategory } from "shared";
import { v4 as uuid } from "uuid";

import {
  addProjectFormCasesToBuilder,
  getProjectFormInitialState,
  ProjectFormState,
} from "@/shared/core/reducers/project-form/projectForm.reducer";
import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import {
  stepRevertAttempted,
  stepRevertConfirmationResolved,
  stepRevertConfirmed,
} from "./actions/actionsUtils";
import { fetchSiteRelatedLocalAuthorities } from "./actions/getSiteLocalAuthorities.action";
import {
  developmentPlanCategoriesCompleted,
  introductionStepCompleted,
} from "./actions/introductionStep.actions";
import { reconversionProjectCreationInitiated } from "./actions/urbanProjectCreationInitiated.action";
import { RenewableEnergyCreationStep } from "./renewable-energy/creationSteps";
import {
  RenewableEnergyProjectState,
  INITIAL_STATE as renenewableEnergyProjectInitialState,
  renewableEnergyProjectReducer,
} from "./renewable-energy/renewableEnergy.reducer";
import urbanProjectReducer from "./urban-project/urbanProject.reducer";

export type ProjectCreationState = ProjectFormState & {
  stepsHistory: ProjectCreationStep[];
  projectId: string;
  developmentPlanCategory?: DevelopmentPlanCategory;
  renewableEnergyProject: RenewableEnergyProjectState;
  stepRevertAttempted: boolean;
};

export type ProjectCreationStep =
  | "INTRODUCTION"
  | "PROJECT_TYPES"
  | UrbanProjectCreationStep
  | RenewableEnergyCreationStep;

export const getInitialState = (): ProjectCreationState => {
  return {
    stepsHistory: ["INTRODUCTION"],
    projectId: uuid(),
    developmentPlanCategory: undefined,
    stepRevertAttempted: false,
    renewableEnergyProject: renenewableEnergyProjectInitialState,
    ...getProjectFormInitialState("URBAN_PROJECT_CREATE_MODE_SELECTION"),
  };
};

const projectCreationReducer = createReducer(getInitialState(), (builder) => {
  addProjectFormCasesToBuilder(builder, { fetchSiteRelatedLocalAuthorities });

  builder
    .addCase(introductionStepCompleted, (state) => {
      state.stepsHistory.push("PROJECT_TYPES");
    })
    .addCase(developmentPlanCategoriesCompleted, (state, action) => {
      state.developmentPlanCategory = action.payload;

      switch (action.payload) {
        case "URBAN_PROJECT":
          state.stepsHistory.push("URBAN_PROJECT_CREATE_MODE_SELECTION");
          break;
        case "RENEWABLE_ENERGY":
          state.stepsHistory.push("RENEWABLE_ENERGY_TYPES");
          break;
      }
    })
    .addCase(reconversionProjectCreationInitiated.pending, () => {
      return {
        ...getInitialState(),
        siteDataLoadingState: "loading",
      };
    })
    .addCase(reconversionProjectCreationInitiated.fulfilled, (state, action) => {
      state.siteDataLoadingState = "success";
      state.siteData = action.payload;
    })
    .addCase(reconversionProjectCreationInitiated.rejected, (state) => {
      state.siteDataLoadingState = "error";
    })

    .addCase(stepRevertAttempted, (state) => {
      state.stepRevertAttempted = true;
    })
    .addCase(stepRevertConfirmationResolved, (state) => {
      state.stepRevertAttempted = false;
    })
    .addCase(stepRevertConfirmed, (state) => {
      state.stepRevertAttempted = false;

      if (state.stepsHistory.length > 1) {
        state.stepsHistory = state.stepsHistory.slice(0, -1);
      }
    });
});

const projectCreationRootReducer = reduceReducers<ProjectCreationState>(
  getInitialState(),
  projectCreationReducer,
  urbanProjectReducer,
  renewableEnergyProjectReducer,
);

export default projectCreationRootReducer;
