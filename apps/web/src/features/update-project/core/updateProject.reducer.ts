import { createReducer } from "@reduxjs/toolkit";

import {
  addProjectFormCasesToBuilder,
  getProjectFormInitialState,
  ProjectFormState,
} from "@/shared/core/reducers/project-form/projectForm.reducer";
import { addUrbanProjectFormCasesToBuilder } from "@/shared/core/reducers/project-form/urban-project/urbanProject.reducer";
import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { convertProjectDataToSteps } from "./helpers/convertProjectDataToSteps";
import {
  reconversionProjectUpdateInitiated,
  updateProjectFormActions,
  updateProjectFormUrbanActions,
} from "./updateProject.actions";
import { UpdateProjectView } from "./updateProject.types";

export type UrbanProjectUpdateStep = Exclude<
  UrbanProjectCreationStep,
  | "URBAN_PROJECT_CREATION_RESULT"
  | "URBAN_PROJECT_EXPRESS_CREATION_RESULT"
  | "URBAN_PROJECT_EXPRESS_SUMMARY"
  | "URBAN_PROJECT_CREATE_MODE_SELECTION"
  | "URBAN_PROJECT_EXPRESS_CATEGORY_SELECTION"
>;
export type ProjectUpdateState = ProjectFormState<UrbanProjectUpdateStep> & {
  projectData: {
    loadingState: "idle" | "success" | "error" | "loading";
    features?: UpdateProjectView["projectData"];
  };
};

export const getInitialState = (): ProjectUpdateState => {
  return {
    projectData: {
      loadingState: "idle",
      features: undefined,
    },
    ...getProjectFormInitialState<UrbanProjectUpdateStep>(
      "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
    ),
  };
};

const projectUpdateReducer = createReducer(getInitialState(), (builder) => {
  addProjectFormCasesToBuilder(builder, updateProjectFormActions);

  addUrbanProjectFormCasesToBuilder(builder, updateProjectFormUrbanActions);

  builder
    .addCase(reconversionProjectUpdateInitiated.pending, () => {
      return {
        ...getInitialState(),
        siteDataLoadingState: "loading",
      };
    })
    .addCase(reconversionProjectUpdateInitiated.fulfilled, (state, action) => {
      state.siteDataLoadingState = "success";
      state.siteData = action.payload.siteData;
      state.projectData = {
        loadingState: "success",
        features: action.payload.projectData,
      };

      state.urbanProject.steps = convertProjectDataToSteps(action.payload);
      state.urbanProject.currentStep = "URBAN_PROJECT_FINAL_SUMMARY";
    })
    .addCase(reconversionProjectUpdateInitiated.rejected, (state) => {
      state.siteDataLoadingState = "error";
    });
});

export default projectUpdateReducer;
