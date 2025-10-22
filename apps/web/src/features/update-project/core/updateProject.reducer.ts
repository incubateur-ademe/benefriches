import { createReducer } from "@reduxjs/toolkit";
import reduceReducers from "reduce-reducers";

import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import {
  addProjectFormCasesToBuilder,
  getProjectFormInitialState,
  ProjectFormState,
} from "@/shared/core/reducers/project-form/projectForm.reducer";
import { UrbanProjectCreationStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import {
  fetchSiteLocalAuthorities,
  reconversionProjectUpdateInitiated,
} from "./updateProject.actions";

type ProjectUpdateStep = Exclude<
  UrbanProjectCreationStep,
  | "URBAN_PROJECT_CREATION_RESULT"
  | "URBAN_PROJECT_EXPRESS_CREATION_RESULT"
  | "URBAN_PROJECT_EXPRESS_SUMMARY"
  | "URBAN_PROJECT_CREATE_MODE_SELECTION"
  | "URBAN_PROJECT_EXPRESS_CATEGORY_SELECTION"
>;
export type ProjectUpdateState = ProjectFormState<ProjectUpdateStep> & {
  projectData: {
    loadingState: "idle" | "success" | "error" | "loading";
    features?: ProjectFeatures;
  };
};

export const getInitialState = (): ProjectUpdateState => {
  return {
    projectData: {
      loadingState: "idle",
      features: undefined,
    },
    ...getProjectFormInitialState<ProjectUpdateStep>(
      "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
    ),
  };
};

const projectUpdateReducer = createReducer(getInitialState(), (builder) => {
  addProjectFormCasesToBuilder(builder, { fetchSiteLocalAuthorities: fetchSiteLocalAuthorities });

  builder
    .addCase(reconversionProjectUpdateInitiated.pending, () => {
      return {
        ...getInitialState(),
        siteDataLoadingState: "loading",
      };
    })
    .addCase(reconversionProjectUpdateInitiated.fulfilled, (state, action) => {
      state.siteDataLoadingState = "success";
      state.siteData = action.payload;
    })
    .addCase(reconversionProjectUpdateInitiated.rejected, (state) => {
      state.siteDataLoadingState = "error";
    });
});

const projectUpdateRootReducer = reduceReducers<ProjectUpdateState>(
  getInitialState(),
  projectUpdateReducer,
);

export default projectUpdateRootReducer;
