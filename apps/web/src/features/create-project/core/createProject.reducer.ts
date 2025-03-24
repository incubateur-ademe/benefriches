import { createReducer } from "@reduxjs/toolkit";
import reduceReducers from "reduce-reducers";
import { DevelopmentPlanCategory } from "shared";
import { v4 as uuid } from "uuid";

import { ProjectSite } from "@/features/create-project/core/project.types";

import { fetchSiteLocalAuthorities } from "./actions/getSiteLocalAuthorities.action";
import {
  developmentPlanCategoriesCompleted,
  introductionStepCompleted,
} from "./actions/introductionStep.actions";
import { reconversionProjectCreationInitiated } from "./actions/urbanProjectCreationInitiated.action";
import {
  RenewableEneryProjectState,
  INITIAL_STATE as renenewableEnergyProjectInitialState,
  renewableEnergyProjectReducer,
} from "./renewable-energy/renewableEnergy.reducer";
import { createModeStepReverted } from "./urban-project/actions/urbanProject.actions";
import urbanProjectReducer, {
  initialState as urbanProjectInitialState,
  UrbanProjectState,
} from "./urban-project/urbanProject.reducer";

type LoadingState = "idle" | "loading" | "success" | "error";

export type ProjectCreationState = {
  stepsHistory: ProjectCreationStep[];
  projectId: string;
  developmentPlanCategory?: DevelopmentPlanCategory;
  siteData?: ProjectSite;
  siteDataLoadingState: LoadingState;
  urbanProject: UrbanProjectState;
  renewableEnergyProject: RenewableEneryProjectState;
  siteRelatedLocalAuthorities: {
    loadingState: LoadingState;
    city?: {
      code: string;
      name: string;
    };
    epci?: {
      code: string;
      name: string;
    };
    department?: {
      code: string;
      name: string;
    };
    region?: {
      code: string;
      name: string;
    };
  };
};

export type ProjectCreationStep = "INTRODUCTION" | "PROJECT_TYPES";

export const getInitialState = (): ProjectCreationState => {
  return {
    stepsHistory: ["INTRODUCTION"],
    projectId: uuid(),
    developmentPlanCategory: undefined,
    siteData: undefined,
    siteDataLoadingState: "idle",
    siteRelatedLocalAuthorities: {
      loadingState: "idle",
    },
    renewableEnergyProject: renenewableEnergyProjectInitialState,
    urbanProject: urbanProjectInitialState,
  };
};

const projectCreationReducer = createReducer(getInitialState(), (builder) => {
  builder
    .addCase(introductionStepCompleted, (state) => {
      state.stepsHistory.push("PROJECT_TYPES");
    })
    .addCase(developmentPlanCategoriesCompleted, (state, action) => {
      state.developmentPlanCategory = action.payload;
    })
    .addCase(createModeStepReverted, (state) => {
      state.developmentPlanCategory = undefined;
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
    /* fetch site local authorities */
    .addCase(fetchSiteLocalAuthorities.pending, (state) => {
      state.siteRelatedLocalAuthorities.loadingState = "loading";
    })
    .addCase(fetchSiteLocalAuthorities.fulfilled, (state, action) => {
      state.siteRelatedLocalAuthorities = {
        loadingState: "success",
        ...action.payload,
      };
    })
    .addCase(fetchSiteLocalAuthorities.rejected, (state) => {
      state.siteRelatedLocalAuthorities.loadingState = "error";
    });
});

const projectCreationRootReducer = reduceReducers<ProjectCreationState>(
  getInitialState(),
  projectCreationReducer,
  urbanProjectReducer,
  renewableEnergyProjectReducer,
);

export default projectCreationRootReducer;
