import { createReducer } from "@reduxjs/toolkit";
import reduceReducers from "reduce-reducers";
import { DevelopmentPlanCategory, isUrbanProjectTemplate } from "shared";
import { v4 as uuid } from "uuid";

import {
  addProjectFormCasesToBuilder,
  getProjectFormInitialState,
  ProjectFormState,
} from "@/shared/core/reducers/project-form/projectForm.reducer";
import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { stepReverted } from "./actions/actionsUtils";
import { fetchSiteRelatedLocalAuthorities } from "./actions/getSiteLocalAuthorities.action";
import {
  developmentPlanCategoriesCompleted,
  introductionStepCompleted,
} from "./actions/introductionStep.actions";
import { projectSuggestionsCompleted } from "./actions/projectSuggestionCompleted.action";
import { reconversionProjectCreationInitiated } from "./actions/reconversionProjectCreationInitiated.action";
import { surfaceAreaInputModeUpdated } from "./actions/surfaceAreaInputModeUpdated.action";
import { ProjectSuggestion } from "./project.types";
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
  projectSuggestions?: ProjectSuggestion[];
  surfaceAreaInputMode: "percentage" | "squareMeters";
};

export type ProjectCreationStep =
  | "INTRODUCTION"
  | "PROJECT_TYPE_SELECTION"
  | "PROJECT_SUGGESTIONS"
  | UrbanProjectCreationStep
  | RenewableEnergyCreationStep;

export const getInitialState = (): ProjectCreationState => {
  return {
    stepsHistory: ["INTRODUCTION"],
    projectId: uuid(),
    developmentPlanCategory: undefined,
    projectSuggestions: undefined,
    renewableEnergyProject: renenewableEnergyProjectInitialState,
    surfaceAreaInputMode: "percentage",
    ...getProjectFormInitialState("URBAN_PROJECT_CREATE_MODE_SELECTION"),
  };
};

const projectCreationReducer = createReducer(getInitialState(), (builder) => {
  addProjectFormCasesToBuilder(builder, { fetchSiteRelatedLocalAuthorities });

  builder
    .addCase(introductionStepCompleted, (state) => {
      state.stepsHistory.push("PROJECT_TYPE_SELECTION");
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
    .addCase(reconversionProjectCreationInitiated.pending, (_state, action) => {
      if (action.meta.arg?.projectSuggestions) {
        return {
          ...getInitialState(),
          stepsHistory: ["PROJECT_SUGGESTIONS"],
          projectSuggestions: action.meta.arg.projectSuggestions,
        };
      }

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
    .addCase(projectSuggestionsCompleted, (state, action) => {
      if (action.payload.selectedOption === "none") {
        state.stepsHistory.push("PROJECT_TYPE_SELECTION");
      }
      if (action.payload.selectedOption === "PHOTOVOLTAIC_POWER_PLANT") {
        state.developmentPlanCategory = "RENEWABLE_ENERGY";
      }
      if (isUrbanProjectTemplate(action.payload.selectedOption)) {
        state.developmentPlanCategory = "URBAN_PROJECT";
        state.stepsHistory.push("URBAN_PROJECT_EXPRESS_SUMMARY");
      }
    })
    .addCase(stepReverted, (state) => {
      if (state.stepsHistory.length > 1) {
        state.stepsHistory = state.stepsHistory.slice(0, -1);
      }
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
);

export default projectCreationRootReducer;
