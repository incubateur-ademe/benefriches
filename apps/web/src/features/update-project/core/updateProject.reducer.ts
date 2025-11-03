import { createReducer } from "@reduxjs/toolkit";
import { DevelopmentPlanType } from "shared";

import {
  addProjectFormCasesToBuilder,
  getProjectFormInitialState,
  ProjectFormState,
} from "@/shared/core/reducers/project-form/projectForm.reducer";
import { computeProjectStepsSequence } from "@/shared/core/reducers/project-form/urban-project/helpers/stepsSequence";
import { addUrbanProjectFormCasesToBuilder } from "@/shared/core/reducers/project-form/urban-project/urbanProject.reducer";
import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { convertProjectDataToSteps } from "./helpers/convertProjectDataToSteps";
import {
  reconversionProjectUpdateInitiated,
  reconversionProjectUpdateSaved,
  updateProjectFormActions,
  updateProjectFormUrbanActions,
} from "./updateProject.actions";

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
    id?: string;
    loadingState: "idle" | "success" | "error" | "loading";
    updatedAt?: string;
    projectName?: string;
    isExpress?: boolean;
    projectType?: DevelopmentPlanType;
  };
};

export const getInitialState = (): ProjectUpdateState => {
  return {
    projectData: {
      loadingState: "idle",
    },
    ...getProjectFormInitialState<UrbanProjectUpdateStep>(
      "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
    ),
  };
};

const projectUpdateReducer = createReducer(getInitialState(), (builder) => {
  addProjectFormCasesToBuilder(builder, updateProjectFormActions);

  addUrbanProjectFormCasesToBuilder(builder, updateProjectFormUrbanActions, {
    stepChangesNextMode: "next_empty",
  });

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
        id: action.payload.projectData.id,
        loadingState: "success",
        updatedAt: action.payload.projectData.updatedAt,
        projectName: action.payload.projectData.name,
        isExpress: action.payload.projectData.creationMode === "express",
        projectType: action.payload.projectData.developmentPlan.type,
      };

      state.urbanProject.steps = convertProjectDataToSteps(action.payload);
      state.urbanProject.currentStep = "URBAN_PROJECT_FINAL_SUMMARY";
      // le projet affiché représente exactement ce qui se trouve en bdd
      state.urbanProject.saveState = "success";

      state.urbanProject.stepsSequence = computeProjectStepsSequence(
        { siteData: action.payload.siteData, stepsState: state.urbanProject.steps },
        state.urbanProject.firstSequenceStep,
      );
    })
    .addCase(reconversionProjectUpdateInitiated.rejected, (state) => {
      state.siteDataLoadingState = "error";
    });

  builder.addCase(reconversionProjectUpdateSaved.pending, (state) => {
    state.urbanProject.saveState = "loading";
  });
  builder.addCase(reconversionProjectUpdateSaved.fulfilled, (state) => {
    state.urbanProject.saveState = "success";
    state.projectData.projectName = state.urbanProject.steps.URBAN_PROJECT_NAMING?.payload?.name;
    state.projectData.updatedAt = new Date().toISOString();
  });
  builder.addCase(reconversionProjectUpdateSaved.rejected, (state) => {
    state.urbanProject.saveState = "error";
  });
});

export default projectUpdateReducer;
