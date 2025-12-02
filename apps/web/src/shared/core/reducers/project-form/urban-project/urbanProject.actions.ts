import {
  ActionCreatorWithPayload,
  AsyncThunk,
  AsyncThunkConfig,
  createAction,
} from "@reduxjs/toolkit";
import { SoilsDistribution } from "shared";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";
import { RootState } from "@/shared/core/store-config/store";

import { makeProjectFormActionType } from "../projectForm.actions";
import { ProjectFormSelectors } from "../projectForm.selectors";
import { CurrentAndProjectedSoilsCarbonStorageResult } from "../soilsCarbonStorage.action";
import { AnswersByStep, AnswerStepId, UrbanProjectCreationStep } from "./urbanProjectSteps";

export const makeUrbanProjectFormActionType = (prefix: string, actionName: string) =>
  makeProjectFormActionType(prefix, `urbanProject/${actionName}`);

export const createUrbanProjectFormAction = <TPayload = void>(prefix: string, actionName: string) =>
  createAction<TPayload>(makeUrbanProjectFormActionType(prefix, actionName));

export type StepCompletionPayload<K extends AnswerStepId = AnswerStepId> = {
  [P in K]: {
    stepId: P;
    answers: AnswersByStep[P];
  };
}[K];

export type UrbanProjectFormReducerActions = {
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

type Selectors = Pick<ProjectFormSelectors, "selectSiteAddress" | "selectSiteSoilsDistribution"> & {
  selectProjectSoilsDistributionByType: (state: RootState) => SoilsDistribution;
};

export const createUrbanProjectFormActions = (
  prefix: "projectCreation" | "projectUpdate",
  selectors: Selectors,
): UrbanProjectFormReducerActions => {
  return {
    confirmStepCompletion: createUrbanProjectFormAction(prefix, "confirmStepCompletion"),
    cancelStepCompletion: createUrbanProjectFormAction(prefix, "cancelStepCompletion"),
    navigateToPrevious: createUrbanProjectFormAction(prefix, "navigateToPrevious"),
    navigateToNext: createUrbanProjectFormAction(prefix, "navigateToNext"),
    navigateToStep: createUrbanProjectFormAction<{
      stepId: UrbanProjectCreationStep;
    }>(prefix, "navigateToStep"),
    requestStepCompletion: createUrbanProjectFormAction<StepCompletionPayload>(
      prefix,
      "requestStepCompletion",
    ),
    fetchSoilsCarbonStorageDifference:
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
      ),
  };
};
