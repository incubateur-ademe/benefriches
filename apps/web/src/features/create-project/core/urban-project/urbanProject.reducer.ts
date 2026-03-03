import { createReducer, UnknownAction } from "@reduxjs/toolkit";

import { MutateStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/mutateState";
import { addUrbanProjectFormCasesToBuilder } from "@/shared/core/reducers/project-form/urban-project/urbanProject.reducer";

import { ProjectCreationState } from "../createProject.reducer";
import { fetchEstimatedSiteResalePrice } from "./fetchEstimatedSiteResalePrice.action";
import { creationProjectFormUrbanActions } from "./urbanProject.actions";
import { customUrbanProjectSaved } from "./urbanProjectCustomSaved.action";
import {
  expressUrbanProjectCreated,
  expressUrbanProjectSaved,
} from "./urbanProjectExpressSaved.action";

// Sub-reducer composed via reduce-reducers in createProject.reducer.ts.
// Initial state is always provided by the parent reducer; this placeholder is never used.
const createUrbanProjectReducer = createReducer({} as ProjectCreationState, (builder) => {
  // Form actions
  addUrbanProjectFormCasesToBuilder(builder, creationProjectFormUrbanActions);

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

  // Fetch estimated site resale price
  builder.addCase(fetchEstimatedSiteResalePrice.pending, (state) => {
    state.urbanProject.siteResaleEstimationLoadingState = "loading";
  });
  builder.addCase(fetchEstimatedSiteResalePrice.fulfilled, (state, action) => {
    state.urbanProject.siteResaleEstimationLoadingState = "success";
    MutateStateHelper.setDefaultValues(state, "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE", {
      siteResaleExpectedSellingPrice: action.payload.sellingPrice,
      siteResaleExpectedPropertyTransferDuties: action.payload.propertyTransferDuties,
    });
  });
  builder.addCase(fetchEstimatedSiteResalePrice.rejected, (state) => {
    state.urbanProject.siteResaleEstimationLoadingState = "error";
  });
});

export default (state: ProjectCreationState, action: UnknownAction): ProjectCreationState =>
  createUrbanProjectReducer(state, action);
