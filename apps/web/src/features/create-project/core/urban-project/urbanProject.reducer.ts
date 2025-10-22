import { createReducer, UnknownAction } from "@reduxjs/toolkit";

import { addUrbanProjectFormCasesToBuilder } from "@/shared/core/reducers/project-form/urban-project/urbanProject.reducer";

import { ProjectCreationState } from "../createProject.reducer";
import {
  requestStepCompletion,
  confirmStepCompletion,
  cancelStepCompletion,
  navigateToPrevious,
  navigateToNext,
  navigateToStep,
  fetchSoilsCarbonStorageDifference,
} from "./urbanProject.actions";
import { customUrbanProjectSaved } from "./urbanProjectCustomSaved.action";
import {
  expressUrbanProjectCreated,
  expressUrbanProjectSaved,
} from "./urbanProjectExpressSaved.action";

export const createUrbanProjectReducer = createReducer({} as ProjectCreationState, (builder) => {
  // Form actions
  addUrbanProjectFormCasesToBuilder(builder, {
    requestStepCompletion,
    cancelStepCompletion,
    confirmStepCompletion,
    navigateToNext,
    navigateToPrevious,
    navigateToStep,
    fetchSoilsCarbonStorageDifference,
  });

  // Custom create Save
  builder.addCase(customUrbanProjectSaved.pending, (state) => {
    state.urbanProject.saveState = "loading";
  });
  builder.addCase(customUrbanProjectSaved.fulfilled, (state) => {
    state.urbanProject.saveState = "success";
  });
  builder.addCase(customUrbanProjectSaved.rejected, (state) => {
    state.urbanProject.saveState = "error";
  });

  // Express create Get & Save
  builder.addCase(expressUrbanProjectSaved.pending, (state) => {
    state.urbanProject.saveState = "loading";
  });
  builder.addCase(expressUrbanProjectSaved.rejected, (state) => {
    state.urbanProject.saveState = "error";
  });
  builder.addCase(expressUrbanProjectSaved.fulfilled, (state) => {
    state.urbanProject.saveState = "success";
  });
  builder.addCase(expressUrbanProjectCreated.pending, (state) => {
    state.urbanProject.steps.URBAN_PROJECT_EXPRESS_SUMMARY = {
      completed: false,
      loadingState: "loading",
    };
  });
  builder.addCase(expressUrbanProjectCreated.rejected, (state) => {
    state.urbanProject.steps.URBAN_PROJECT_EXPRESS_SUMMARY = {
      completed: false,
      loadingState: "error",
    };
  });
  builder.addCase(expressUrbanProjectCreated.fulfilled, (state, action) => {
    state.urbanProject.steps.URBAN_PROJECT_EXPRESS_SUMMARY = {
      completed: false,
      loadingState: "success",
      data: action.payload,
    };
  });
});

export default (state: ProjectCreationState, action: UnknownAction): ProjectCreationState =>
  createUrbanProjectReducer(state, action);
