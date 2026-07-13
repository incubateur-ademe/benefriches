import {
  ActionCreatorWithPayload,
  AsyncThunk,
  AsyncThunkConfig,
  createAction,
} from "@reduxjs/toolkit";
import { SoilsDistribution } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import { RootState } from "@/app/store/store";

import { makeProjectFormActionType } from "../projectForm.actions";
import { ProjectFormSelectors } from "../projectForm.selectors";
import { CurrentAndProjectedSoilsCarbonStorageResult } from "../soilsCarbonStorage.action";
import { AnswersByStep, AnswerStepId, UrbanProjectCreationStep } from "./urbanProjectSteps";

const makeUrbanProjectFormActionType = (prefix: string, actionName: string) =>
  makeProjectFormActionType(prefix, `urbanProject/${actionName}`);

const createUrbanProjectFormAction = <TPayload = void>(prefix: string, actionName: string) =>
  createAction<TPayload>(makeUrbanProjectFormActionType(prefix, actionName));

export type StepCompletionPayload<K extends AnswerStepId = AnswerStepId> = {
  [P in K]: {
    stepId: P;
    answers: AnswersByStep[P];
  };
}[K];

export type UrbanProjectFormReducerActions = {
  stepCompletionRequested: ActionCreatorWithPayload<StepCompletionPayload>;
  stepCompletionConfirmed: ActionCreatorWithPayload<void>;
  stepCompletionCancelled: ActionCreatorWithPayload<void>;
  previousStepRequested: ActionCreatorWithPayload<void>;
  nextStepRequested: ActionCreatorWithPayload<void>;
  stepNavigationRequested: ActionCreatorWithPayload<{
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
