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

import { ReadStateHelper } from "./helpers/readState";
import { creationRenewableEnergyFormSelectors } from "./renewableEnergyProject.selectors";
import type {
  AnswersByStep,
  AnswerStepId,
  RenewableEnergyCreationStep,
} from "./renewableEnergySteps";
import type { RenewableEnergyStepsState } from "./step-handlers/stepHandler.type";

const makeRenewableEnergyFormActionType = (prefix: string, actionName: string) =>
  makeWizardFormActionType(prefix, `renewableEnergy/${actionName}`);

const createRenewableEnergyFormAction = <TPayload = void>(prefix: string, actionName: string) =>
  createAction<TPayload>(makeRenewableEnergyFormActionType(prefix, actionName));

// Kept for the creation-only "save" thunk, which is not part of the wizard-form
// step-completion/navigation contract and has no update-side counterpart.
export const makeRenewableEnergyProjectCreationActionType = (actionName: string) =>
  makeRenewableEnergyFormActionType("projectCreation", actionName);

export type StepCompletionPayload<K extends AnswerStepId = AnswerStepId> = {
  [P in K]: {
    stepId: P;
    answers: AnswersByStep[P];
  };
}[K];

export type PhotovoltaicPerformanceApiResult = {
  expectedPerformance: {
    kwhPerDay: number;
    kwhPerMonth: number;
    kwhPerYear: number;
    lossPercents: {
      angleIncidence: number;
      spectralIncidence: number;
      tempAndIrradiance: number;
      total: number;
    };
  };
};

export type PhotovoltaicPerformanceApiPayload = {
  lat: number;
  long: number;
  peakPower: number;
};

export interface PhotovoltaicPerformanceGateway {
  getExpectedPhotovoltaicPerformance(
    payload: PhotovoltaicPerformanceApiPayload,
  ): Promise<PhotovoltaicPerformanceApiResult>;
}

type FetchExpectedAnnualPowerPerformanceResult = {
  expectedPerformanceMwhPerYear: number;
};

// Pure, dependency-free navigation + step-completion action creators.
export type RenewableEnergyFormPureActions = {
  stepCompletionRequested: ActionCreatorWithPayload<StepCompletionPayload>;
  previousStepRequested: ActionCreatorWithPayload<void>;
  nextStepRequested: ActionCreatorWithPayload<void>;
  stepNavigationRequested: ActionCreatorWithPayload<{ stepId: RenewableEnergyCreationStep }>;
};

// Full action bag consumed by the reducer: pure actions plus the stateful thunks
// composed alongside them at the call site.
export type RenewableEnergyFormReducerActions = RenewableEnergyFormPureActions & {
  fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation: AsyncThunk<
    FetchExpectedAnnualPowerPerformanceResult,
    void,
    AsyncThunkConfig
  >;
  fetchCurrentAndProjectedSoilsCarbonStorage: AsyncThunk<
    CurrentAndProjectedSoilsCarbonStorageResult,
    void,
    AsyncThunkConfig
  >;
};

export type RenewableEnergyFormThunkSelectors = Pick<
  WizardFormSelectors,
  "selectSiteAddress" | "selectSiteSoilsDistribution"
> & {
  selectProjectSoilsDistribution: (state: RootState) => SoilsDistribution;
  selectSteps: (state: RootState) => RenewableEnergyStepsState;
};

// Factory kept prefix-parameterized (mirrors `createUrbanProjectFormActions`) so the update-side
// editing slice can instantiate a second, independently-namespaced instance from this same
// registry, exactly as urban does for creation vs update.
export const createRenewableEnergyFormActions = (
  prefix: string,
): RenewableEnergyFormPureActions => ({
  stepCompletionRequested: createRenewableEnergyFormAction<StepCompletionPayload>(
    prefix,
    "stepCompletionRequested",
  ),
  previousStepRequested: createRenewableEnergyFormAction(prefix, "previousStepRequested"),
  nextStepRequested: createRenewableEnergyFormAction(prefix, "nextStepRequested"),
  stepNavigationRequested: createRenewableEnergyFormAction<{
    stepId: RenewableEnergyCreationStep;
  }>(prefix, "stepNavigationRequested"),
});

// Stateful thunks are separate factories: selectors are injected by the caller (rather than
// imported here) to avoid a selectors <-> actions import cycle, and to keep the pure factory above
// dependency-free.
export const createFetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation = (
  prefix: string,
  selectors: RenewableEnergyFormThunkSelectors,
): RenewableEnergyFormReducerActions["fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation"] =>
  createAppAsyncThunk<FetchExpectedAnnualPowerPerformanceResult>(
    makeRenewableEnergyFormActionType(
      prefix,
      "fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation",
    ),
    async (_, { extra, getState }) => {
      const rootState = getState();
      const { lat, long } = selectors.selectSiteAddress(rootState) ?? {};
      const peakPower = ReadStateHelper.getStepAnswers(
        selectors.selectSteps(rootState),
        "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
      )?.photovoltaicInstallationElectricalPowerKWc;

      if (!lat || !long || !peakPower) {
        return Promise.reject(
          new Error(
            "fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation: Missing required parameters",
          ),
        );
      }

      const result = await extra.photovoltaicPerformanceService.getExpectedPhotovoltaicPerformance({
        lat,
        long,
        peakPower,
      });

      return {
        expectedPerformanceMwhPerYear: Math.round(result.expectedPerformance.kwhPerYear / 1000),
      };
    },
  );

export const createFetchCurrentAndProjectedSoilsCarbonStorage = (
  prefix: string,
  selectors: RenewableEnergyFormThunkSelectors,
): RenewableEnergyFormReducerActions["fetchCurrentAndProjectedSoilsCarbonStorage"] =>
  createAppAsyncThunk<CurrentAndProjectedSoilsCarbonStorageResult>(
    makeRenewableEnergyFormActionType(prefix, "fetchCurrentAndProjectedSoilsCarbonStorage"),
    async (_, { extra, getState }) => {
      const rootState = getState();
      const siteAddress = selectors.selectSiteAddress(rootState);
      const siteSoils = selectors.selectSiteSoilsDistribution(rootState);
      const projectSoils = selectors.selectProjectSoilsDistribution(rootState);

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

export const creationRenewableEnergyFormActions: RenewableEnergyFormReducerActions = {
  ...createRenewableEnergyFormActions("projectCreation"),
  fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation:
    createFetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation(
      "projectCreation",
      creationRenewableEnergyFormSelectors,
    ),
  fetchCurrentAndProjectedSoilsCarbonStorage: createFetchCurrentAndProjectedSoilsCarbonStorage(
    "projectCreation",
    creationRenewableEnergyFormSelectors,
  ),
};

export const stepCompletionRequested = creationRenewableEnergyFormActions.stepCompletionRequested;
export const previousStepRequested = creationRenewableEnergyFormActions.previousStepRequested;
export const nextStepRequested = creationRenewableEnergyFormActions.nextStepRequested;
export const stepNavigationRequested = creationRenewableEnergyFormActions.stepNavigationRequested;
export const fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation =
  creationRenewableEnergyFormActions.fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation;
export const fetchCurrentAndProjectedSoilsCarbonStorage =
  creationRenewableEnergyFormActions.fetchCurrentAndProjectedSoilsCarbonStorage;
