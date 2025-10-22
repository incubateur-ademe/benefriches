import { ActionReducerMapBuilder, AsyncThunk, AsyncThunkConfig } from "@reduxjs/toolkit";

import { ExpressReconversionProjectResult } from "@/features/create-project/core/actions/expressProjectSavedGateway";
import { ProjectSite } from "@/features/create-project/core/project.types";
import { CurrentAndProjectedSoilsCarbonStorageResult } from "@/shared/core/reducers/project-form/soilsCarbonStorage.action";

import { GetMunicipalityDataResult } from "./getSiteLocalAuthorities.action";
import { StepUpdateResult } from "./urban-project/helpers/completeStep";
import {
  AnswersByStep,
  AnswerStepId,
  UrbanProjectCreationStep,
  InformationalStep as InformationalStepId,
} from "./urban-project/urbanProjectSteps";

type LoadingState = "idle" | "loading" | "success" | "error";

type LocalAuthorities = {
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

type SummaryStep<T_Data> = {
  completed: boolean;
  loadingState?: "idle" | "loading" | "success" | "error";
  data?: T_Data;
};

type AnswerStep<K extends AnswerStepId> = {
  completed: boolean;
  payload?: AnswersByStep[K];
  defaultValues?: AnswersByStep[K];
};

type InformationalStep = {
  completed: boolean;
};

export interface ProjectFormState<T extends UrbanProjectCreationStep = UrbanProjectCreationStep> {
  siteData?: ProjectSite;
  siteDataLoadingState: LoadingState;
  siteRelatedLocalAuthorities: LocalAuthorities;
  urbanProject: {
    currentStep: T;
    saveState: "idle" | "loading" | "success" | "error";
    pendingStepCompletion?: {
      changes: StepUpdateResult<AnswerStepId>;
      showAlert: boolean;
    };
    steps: Partial<
      {
        URBAN_PROJECT_EXPRESS_SUMMARY?: SummaryStep<ExpressReconversionProjectResult>;
        URBAN_PROJECT_SOILS_CARBON_SUMMARY?: SummaryStep<CurrentAndProjectedSoilsCarbonStorageResult>;
      } & {
        [K in AnswerStepId]: AnswerStep<K>;
      } & {
        [K in InformationalStepId]: InformationalStep;
      }
    >;
  };
}

export const getProjectFormInitialState = <
  T extends UrbanProjectCreationStep = UrbanProjectCreationStep,
>(
  initialStep: T,
): ProjectFormState<T> => {
  return {
    siteData: undefined,
    siteDataLoadingState: "idle",
    siteRelatedLocalAuthorities: {
      loadingState: "idle",
    },
    urbanProject: {
      currentStep: initialStep,
      saveState: "idle",
      steps: {},
      pendingStepCompletion: undefined,
    },
  };
};

type ProjectProjectReducerActions = {
  fetchSiteLocalAuthorities: AsyncThunk<
    GetMunicipalityDataResult["localAuthorities"],
    void,
    AsyncThunkConfig
  >;
};
export const addProjectFormCasesToBuilder = <
  T extends UrbanProjectCreationStep,
  S extends ProjectFormState<T>,
>(
  builder: ActionReducerMapBuilder<S>,
  actions: ProjectProjectReducerActions,
) => {
  /* fetch site local authorities */
  builder
    .addCase(actions.fetchSiteLocalAuthorities.pending, (state) => {
      state.siteRelatedLocalAuthorities.loadingState = "loading";
    })
    .addCase(actions.fetchSiteLocalAuthorities.fulfilled, (state, action) => {
      state.siteRelatedLocalAuthorities = {
        loadingState: "success",
        ...action.payload,
      };
    })
    .addCase(actions.fetchSiteLocalAuthorities.rejected, (state) => {
      state.siteRelatedLocalAuthorities.loadingState = "error";
    });
};
