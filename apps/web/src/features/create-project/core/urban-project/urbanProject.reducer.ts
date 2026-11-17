import type { UnknownAction } from "@reduxjs/toolkit";
import { createReducer } from "@reduxjs/toolkit";

import { answerStepHandlers } from "@/features/create-project/core/urban-project/step-handlers/stepHandlerRegistry";
import { addUrbanProjectFormCasesToBuilder } from "@/features/create-project/core/urban-project/urbanProjectForm.reducer";

import type { ProjectCreationState } from "../createProject.reducer";
import { creationProjectFormUrbanActions } from "./urbanProject.actions";
import { customUrbanProjectSaved } from "./urbanProjectCustomSaved.action";

// Sub-reducer composed via reduce-reducers in createProject.reducer.ts.
// Initial state is always provided by the parent reducer; this placeholder is never used.
const createUrbanProjectReducer = createReducer({} as ProjectCreationState, (builder) => {
  // Form actions
  addUrbanProjectFormCasesToBuilder(builder, creationProjectFormUrbanActions, {
    config: {
      stepChangesNextMode: "step_order",
      finalSummaryFallbackStep: "URBAN_PROJECT_FINAL_SUMMARY",
      onPreviousStepFallback: (state) => {
        state.currentProjectFlow = "USE_CASE_SELECTION";
      },
    },
    registry: answerStepHandlers,
    selectForm: (state) => state.urbanProject.form,
    buildContext: (state) => ({
      siteData: state.siteData,
      siteCityReferenceData: state.siteCityReferenceData,
    }),
  });

  // Custom create Save
  builder.addCase(customUrbanProjectSaved.pending, (state) => {
    state.urbanProject.form.saveState = "loading";
  });
  builder.addCase(customUrbanProjectSaved.fulfilled, (state) => {
    state.urbanProject.form.saveState = "success";
  });
  builder.addCase(customUrbanProjectSaved.rejected, (state) => {
    state.urbanProject.form.saveState = "error";
  });
});

export default (state: ProjectCreationState, action: UnknownAction): ProjectCreationState =>
  createUrbanProjectReducer(state, action);
