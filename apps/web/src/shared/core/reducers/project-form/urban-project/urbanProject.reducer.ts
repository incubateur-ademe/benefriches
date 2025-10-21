import {
  ActionCreatorWithPayload,
  ActionReducerMapBuilder,
  AsyncThunk,
  AsyncThunkConfig,
} from "@reduxjs/toolkit";

import { ExpressReconversionProjectResult } from "@/features/create-project/core/actions/expressProjectSavedGateway";
import { CurrentAndProjectedSoilsCarbonStorageResult } from "@/features/create-project/core/actions/soilsCarbonStorage.action";
import { ProjectSite } from "@/features/create-project/core/project.types";
import { stepHandlerRegistry } from "@/features/create-project/core/urban-project/step-handlers/stepHandlerRegistry";

import { applyStepChanges, computeStepChanges, StepUpdateResult } from "./helpers/completeStep";
import { navigateToAndLoadStep } from "./helpers/navigateToStep";
import { StepCompletionPayload } from "./urbanProject.actions";
import {
  AnswersByStep,
  AnswerStepId,
  InformationalStep as InformationalStepId,
  UrbanProjectCreationStep,
} from "./urbanProjectSteps";

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

type UrbanProjectProjectReducerActions = {
  requestStepCompletion: ActionCreatorWithPayload<StepCompletionPayload>;
  confirmStepCompletion: ActionCreatorWithPayload<void>;
  cancelStepCompletion: ActionCreatorWithPayload<void>;
  navigateToPrevious: ActionCreatorWithPayload<void>;
  navigateToNext: ActionCreatorWithPayload<void>;
  navigateToStep: ActionCreatorWithPayload<{
    stepId: UrbanProjectCreationStep;
  }>;
  fetchSoilsCarbonStorageDifference: AsyncThunk<
    CurrentAndProjectedSoilsCarbonStorageResult,
    void,
    AsyncThunkConfig
  >;
};

export const addUrbanProjectFormCasesToBuilder = <
  T extends UrbanProjectCreationStep,
  S extends ProjectFormState<T>,
>(
  builder: ActionReducerMapBuilder<S>,
  actions: UrbanProjectProjectReducerActions,
) => {
  builder.addCase(actions.requestStepCompletion, (state, action) => {
    const changes = computeStepChanges(state, action.payload);

    if (changes.cascadingChanges && changes.cascadingChanges.length > 0) {
      state.urbanProject.pendingStepCompletion = {
        changes,
        showAlert: true,
      };
    } else {
      applyStepChanges(state, changes);
    }
  });

  builder.addCase(actions.confirmStepCompletion, (state) => {
    const pending = state.urbanProject.pendingStepCompletion;
    if (pending) {
      applyStepChanges(state, pending.changes);
      state.urbanProject.pendingStepCompletion = undefined;
    }
  });

  builder.addCase(actions.cancelStepCompletion, (state) => {
    state.urbanProject.pendingStepCompletion = undefined;
  });

  builder.addCase(actions.navigateToPrevious, (state) => {
    const stepId = state.urbanProject.currentStep;
    const handler = stepHandlerRegistry[stepId];

    if (handler.getPreviousStepId) {
      navigateToAndLoadStep(
        state,
        handler.getPreviousStepId({
          siteData: state.siteData,
          stepsState: state.urbanProject.steps,
        }),
      );
    }
  });

  builder.addCase(actions.navigateToNext, (state) => {
    const stepId = state.urbanProject.currentStep;
    const handler = stepHandlerRegistry[stepId];

    if (!state.urbanProject.steps[stepId]) {
      state.urbanProject.steps[stepId] = {
        completed: true,
      };
    } else {
      state.urbanProject.steps[stepId].completed = true;
    }

    if (handler.getNextStepId) {
      navigateToAndLoadStep(
        state,
        handler.getNextStepId({
          siteData: state.siteData,
          stepsState: state.urbanProject.steps,
        }),
      );
    }
  });

  builder.addCase(actions.navigateToStep, (state, action) => {
    navigateToAndLoadStep(state, action.payload.stepId);
  });

  builder.addCase(actions.fetchSoilsCarbonStorageDifference.pending, (state) => {
    if (!state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY) {
      state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY = { completed: false };
    }
    state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY.loadingState = "loading";
  });
  builder.addCase(actions.fetchSoilsCarbonStorageDifference.fulfilled, (state, action) => {
    if (!state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY) {
      state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY = { completed: false };
    }
    state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY.loadingState = "success";
    state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY.data = {
      current: action.payload.current,
      projected: action.payload.projected,
    };
  });
  builder.addCase(actions.fetchSoilsCarbonStorageDifference.rejected, (state) => {
    if (!state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY) {
      state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY = { completed: false };
    }
    state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY.loadingState = "error";
  });
};
