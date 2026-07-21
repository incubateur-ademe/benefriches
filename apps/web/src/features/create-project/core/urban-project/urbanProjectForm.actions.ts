import {
  ActionCreatorWithPayload,
  AsyncThunk,
  AsyncThunkConfig,
  createAction,
} from "@reduxjs/toolkit";
import { SoilsDistribution } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import { RootState } from "@/app/store/store";
import { WizardFormSelectors } from "@/features/create-project/core/project-form/projectForm.selectors";
import { CurrentAndProjectedSoilsCarbonStorageResult } from "@/features/create-project/core/project-form/soilsCarbonStorage.types";
import { makeWizardFormActionType } from "@/shared/core/wizard-form/wizardForm.actions";

import { AnswersByStep, AnswerStepId, UrbanProjectCreationStep } from "./urbanProjectSteps";

const makeUrbanProjectFormActionType = (prefix: string, actionName: string) =>
  makeWizardFormActionType(prefix, `urbanProject/${actionName}`);

const createUrbanProjectFormAction = <TPayload = void>(prefix: string, actionName: string) =>
  createAction<TPayload>(makeUrbanProjectFormActionType(prefix, actionName));

export type StepCompletionPayload<K extends AnswerStepId = AnswerStepId> = {
  [P in K]: {
    stepId: P;
    answers: AnswersByStep[P];
  };
}[K];

// Pure, dependency-free navigation + step-completion action creators.
export type UrbanProjectFormPureActions = {
  stepCompletionRequested: ActionCreatorWithPayload<StepCompletionPayload>;
  stepCompletionConfirmed: ActionCreatorWithPayload<void>;
  stepCompletionCancelled: ActionCreatorWithPayload<void>;
  previousStepRequested: ActionCreatorWithPayload<void>;
  nextStepRequested: ActionCreatorWithPayload<void>;
  stepNavigationRequested: ActionCreatorWithPayload<{
    stepId: UrbanProjectCreationStep;
  }>;
};

// Full action bag consumed by the reducer: pure actions plus the stateful thunk
// composed alongside them at the call site.
export type UrbanProjectFormReducerActions = UrbanProjectFormPureActions & {
  fetchSoilsCarbonStorageDifference: AsyncThunk<
    CurrentAndProjectedSoilsCarbonStorageResult,
    void,
    AsyncThunkConfig
  >;
};

export type UrbanProjectFormThunkSelectors = Pick<
  WizardFormSelectors,
  "selectSiteAddress" | "selectSiteSoilsDistribution"
> & {
  selectProjectSoilsDistributionByType: (state: RootState) => SoilsDistribution;
};

export const createUrbanProjectFormActions = (
  prefix: "projectCreation" | "projectUpdate",
): UrbanProjectFormPureActions => {
  return {
    stepCompletionConfirmed: createUrbanProjectFormAction(prefix, "stepCompletionConfirmed"),
    stepCompletionCancelled: createUrbanProjectFormAction(prefix, "stepCompletionCancelled"),
    previousStepRequested: createUrbanProjectFormAction(prefix, "previousStepRequested"),
    nextStepRequested: createUrbanProjectFormAction(prefix, "nextStepRequested"),
    stepNavigationRequested: createUrbanProjectFormAction<{
      stepId: UrbanProjectCreationStep;
    }>(prefix, "stepNavigationRequested"),
    stepCompletionRequested: createUrbanProjectFormAction<StepCompletionPayload>(
      prefix,
      "stepCompletionRequested",
    ),
  };
};

export const createFetchSoilsCarbonStorageDifference = (
  prefix: "projectCreation" | "projectUpdate",
  selectors: UrbanProjectFormThunkSelectors,
): UrbanProjectFormReducerActions["fetchSoilsCarbonStorageDifference"] =>
  createAppAsyncThunk<CurrentAndProjectedSoilsCarbonStorageResult>(
    makeUrbanProjectFormActionType(prefix, "fetchCurrentAndProjectedSoilsCarbonStorage"),
    async (_, { extra, getState }) => {
      const rootState = getState();
      const siteAddress = selectors.selectSiteAddress(rootState);
      const siteSoils = selectors.selectSiteSoilsDistribution(rootState);
      const projectSoils = selectors.selectProjectSoilsDistributionByType(rootState);

      if (!siteAddress) throw new Error("Missing site address");

      const [current, projected] = await Promise.all([
        extra.soilsCarbonStorageService.getForCityCodeAndSoils({
          cityCode: siteAddress.cityCode,
          soils: siteSoils,
        }),
        extra.soilsCarbonStorageService.getForCityCodeAndSoils({
          soils: projectSoils,
          cityCode: siteAddress.cityCode,
        }),
      ]);

      return {
        current,
        projected,
      };
    },
  );
