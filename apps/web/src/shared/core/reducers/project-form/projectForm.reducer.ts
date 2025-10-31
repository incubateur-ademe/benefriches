import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { ExpressReconversionProjectResult } from "@/features/create-project/core/actions/expressProjectSavedGateway";
import { CurrentAndProjectedSoilsCarbonStorageResult } from "@/shared/core/reducers/project-form/soilsCarbonStorage.action";

import { ProjectFormReducerActions } from "./projectForm.actions";
import { LocalAuthorities, ProjectSiteView } from "./projectForm.types";
import { StepUpdateResult } from "./urban-project/helpers/completeStep";
import {
  AnswersByStep,
  AnswerStepId,
  UrbanProjectCreationStep,
  IntroductionStep,
  SummaryStep,
} from "./urban-project/urbanProjectSteps";

type LoadingState = "idle" | "loading" | "success" | "error";

type SummaryStepState<T_Data> = {
  completed: boolean;
  loadingState?: "idle" | "loading" | "success" | "error";
  data?: T_Data;
};

type AnswerStepState<K extends AnswerStepId> = {
  completed: boolean;
  payload?: AnswersByStep[K];
  defaultValues?: AnswersByStep[K];
};

type InformationalStepState = {
  completed: boolean;
};

export interface ProjectFormState<T extends UrbanProjectCreationStep = UrbanProjectCreationStep> {
  siteData?: ProjectSiteView;
  siteDataLoadingState: LoadingState;
  siteRelatedLocalAuthorities: {
    loadingState: LoadingState;
  } & LocalAuthorities;
  urbanProject: {
    currentStep: T;
    saveState: "idle" | "loading" | "success" | "error";
    pendingStepCompletion?: {
      changes: StepUpdateResult<AnswerStepId>;
      showAlert: boolean;
    };
    steps: Partial<
      {
        URBAN_PROJECT_EXPRESS_SUMMARY?: SummaryStepState<ExpressReconversionProjectResult>;
        URBAN_PROJECT_SOILS_CARBON_SUMMARY?: SummaryStepState<CurrentAndProjectedSoilsCarbonStorageResult>;
      } & {
        [K in AnswerStepId]: AnswerStepState<K>;
      } & {
        [K in IntroductionStep | SummaryStep]: InformationalStepState;
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

export const addProjectFormCasesToBuilder = <
  T extends UrbanProjectCreationStep,
  S extends ProjectFormState<T>,
>(
  builder: ActionReducerMapBuilder<S>,
  actions: ProjectFormReducerActions,
) => {
  builder
    .addCase(actions.fetchSiteRelatedLocalAuthorities.pending, (state) => {
      state.siteRelatedLocalAuthorities.loadingState = "loading";
    })
    .addCase(actions.fetchSiteRelatedLocalAuthorities.fulfilled, (state, action) => {
      state.siteRelatedLocalAuthorities = {
        loadingState: "success",
        ...action.payload,
      };
    })
    .addCase(actions.fetchSiteRelatedLocalAuthorities.rejected, (state) => {
      state.siteRelatedLocalAuthorities.loadingState = "error";
    });
};
