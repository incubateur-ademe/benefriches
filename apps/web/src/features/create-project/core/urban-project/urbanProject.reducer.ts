import { createReducer, UnknownAction } from "@reduxjs/toolkit";

import { answerStepHandlers } from "@/features/create-project/core/urban-project/step-handlers/stepHandlerRegistry";
import { addUrbanProjectFormCasesToBuilder } from "@/features/create-project/core/urban-project/urbanProjectForm.reducer";
import { MutateStateHelper } from "@/shared/core/wizard-form/helpers/mutateState";

import { ProjectCreationState } from "../createProject.reducer";
import { fetchEstimatedSiteResalePrice } from "./fetchEstimatedSiteResalePrice.action";
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
    buildContext: (state) => ({ siteData: state.siteData }),
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
  // Fetch estimated site resale price
  builder.addCase(fetchEstimatedSiteResalePrice.pending, (state) => {
    state.urbanProject.siteResaleEstimationLoadingState = "loading";
  });
  builder.addCase(fetchEstimatedSiteResalePrice.fulfilled, (state, action) => {
    state.urbanProject.siteResaleEstimationLoadingState = "success";
    MutateStateHelper.setDefaultValues(
      state.urbanProject.form,
      "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
      {
        siteResaleExpectedSellingPrice: action.payload.sellingPrice,
        siteResaleExpectedPropertyTransferDuties: action.payload.propertyTransferDuties,
      },
    );
  });
  builder.addCase(fetchEstimatedSiteResalePrice.rejected, (state) => {
    state.urbanProject.siteResaleEstimationLoadingState = "error";
  });
});

export default (state: ProjectCreationState, action: UnknownAction): ProjectCreationState =>
  createUrbanProjectReducer(state, action);
