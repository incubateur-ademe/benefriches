import { createReducer, createSelector } from "@reduxjs/toolkit";
import reduceReducers from "reduce-reducers";
import { v4 as uuid } from "uuid";

import { RootState } from "@/app/store/store";
import { SiteCreationData } from "@/features/create-site/core/siteFoncier.types";

import { stepReverted } from "./actions/revert.action";
import { revertAddressStep, registerAddressHandlers } from "./steps/address/address.handlers";
import {
  revertContaminationAndAccidentsStep,
  registerContaminationAndAccidentsHandlers,
} from "./steps/contamination-and-accidents/contaminationAndAccidents.handlers";
import { registerFinalHandlers } from "./steps/final/final.handlers";
import {
  revertIntroductionStep,
  registerIntroductionHandlers,
} from "./steps/introduction/introduction.handlers";
import { revertNamingStep, registerNamingHandlers } from "./steps/naming/naming.handlers";
import {
  revertSiteActivityStep,
  registerSiteActivityHandlers,
} from "./steps/site-activity/siteActivity.handlers";
import {
  revertSiteManagementStep,
  registerSiteManagementHandlers,
} from "./steps/site-management/siteManagement.handlers";
import { revertSpacesStep, registerSpacesHandlers } from "./steps/spaces/spaces.handlers";
import {
  revertUrbanZoneStep,
  registerUrbanZoneHandlers,
} from "./steps/urban-zone/urbanZone.handlers";
import { urbanZoneSiteCreationReducer } from "./urban-zone/urbanZone.reducer";
import {
  isUrbanZoneStepHandlerStep,
  type UrbanZoneSiteCreationStep,
  type UrbanZoneStepsState,
} from "./urban-zone/urbanZoneSteps";

export type SiteCreationCustomStep =
  | "FRICHE_ACTIVITY"
  | "AGRICULTURAL_OPERATION_ACTIVITY"
  | "NATURAL_AREA_TYPE"
  | "ADDRESS"
  // soils
  | "SPACES_INTRODUCTION"
  | "SURFACE_AREA"
  | "SPACES_KNOWLEDGE"
  | "SPACES_SELECTION"
  | "SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE"
  | "SPACES_SURFACE_AREA_DISTRIBUTION"
  | "SOILS_SUMMARY"
  | "SOILS_CARBON_STORAGE"
  // soils contamination and accidents
  | "SOILS_CONTAMINATION_INTRODUCTION"
  | "SOILS_CONTAMINATION"
  | "FRICHE_ACCIDENTS_INTRODUCTION"
  | "FRICHE_ACCIDENTS"
  // site management
  | "MANAGEMENT_INTRODUCTION"
  | "OWNER"
  | "IS_FRICHE_LEASED"
  | "IS_SITE_OPERATED"
  | "TENANT"
  | "OPERATOR"
  | "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION"
  | "YEARLY_EXPENSES"
  | "YEARLY_INCOME"
  | "YEARLY_EXPENSES_SUMMARY"
  // NAMING
  | "NAMING_INTRODUCTION"
  | "NAMING"
  // SUMARRY
  | "FINAL_SUMMARY"
  | "CREATION_RESULT"
  // urban zone (old-pattern steps, handled before step handler system)
  | "URBAN_ZONE_TYPE"
  | "URBAN_ZONE_LAND_PARCELS_INTRODUCTION";

export type SiteCreationExpressStep =
  | "FRICHE_ACTIVITY"
  | "AGRICULTURAL_OPERATION_ACTIVITY"
  | "NATURAL_AREA_TYPE"
  | "ADDRESS"
  | "SURFACE_AREA"
  | "CREATION_RESULT";

export type SiteCreationStep =
  | "INTRODUCTION"
  | "IS_FRICHE"
  | "USE_MUTABILITY"
  | "SITE_NATURE"
  | "CREATE_MODE_SELECTION"
  | SiteCreationExpressStep
  | SiteCreationCustomStep
  | UrbanZoneSiteCreationStep;

const FIRST_URBAN_ZONE_STEP: UrbanZoneSiteCreationStep = "URBAN_ZONE_LAND_PARCELS_SELECTION";

export type UrbanZoneSiteCreationState = {
  currentStep: UrbanZoneSiteCreationStep;
  stepsSequence: UrbanZoneSiteCreationStep[];
  firstSequenceStep: UrbanZoneSiteCreationStep;
  steps: UrbanZoneStepsState;
  saveState: "idle" | "loading" | "success" | "error";
};

const INITIAL_URBAN_ZONE_STATE: UrbanZoneSiteCreationState = {
  currentStep: FIRST_URBAN_ZONE_STEP,
  stepsSequence: [],
  firstSequenceStep: FIRST_URBAN_ZONE_STEP,
  steps: {},
  saveState: "idle",
};

export type SiteCreationState = {
  stepsHistory: SiteCreationStep[];
  siteData: SiteCreationData;
  createMode?: "express" | "custom";
  useMutability?: boolean;
  skipUseMutability: boolean;
  saveLoadingState: "idle" | "loading" | "success" | "error";
  surfaceAreaInputMode: "percentage" | "squareMeters";
  urbanZone: UrbanZoneSiteCreationState;
};

export const getInitialState = (props?: {
  initialStep?: SiteCreationStep;
  skipUseMutability?: boolean;
}): SiteCreationState => {
  return {
    stepsHistory: [props?.initialStep ?? "INTRODUCTION"],
    saveLoadingState: "idle",
    createMode: undefined,
    skipUseMutability: props?.skipUseMutability ? props?.skipUseMutability : false,
    siteData: {
      id: uuid(),
      soils: [],
      yearlyExpenses: [],
      yearlyIncomes: [],
    },
    surfaceAreaInputMode: "percentage",
    urbanZone: INITIAL_URBAN_ZONE_STATE,
  } as const;
};

const siteCreationReducer = createReducer(getInitialState(), (builder) => {
  registerIntroductionHandlers(builder);
  registerSiteActivityHandlers(builder);
  registerAddressHandlers(builder);
  registerSpacesHandlers(builder);
  registerContaminationAndAccidentsHandlers(builder);
  registerSiteManagementHandlers(builder);
  registerNamingHandlers(builder);
  registerFinalHandlers(builder);
  registerUrbanZoneHandlers(builder);

  builder.addCase(stepReverted, (state) => {
    revertIntroductionStep(state);
    revertSiteActivityStep(state);
    revertAddressStep(state);
    revertSpacesStep(state);
    revertContaminationAndAccidentsStep(state);
    revertSiteManagementStep(state);
    revertNamingStep(state);
    revertUrbanZoneStep(state);

    if (state.stepsHistory.length > 1) {
      state.stepsHistory = state.stepsHistory.slice(0, -1);
    }
  });
});

export const selectCurrentStep = createSelector(
  [(state: RootState) => state.siteCreation],
  (state): SiteCreationStep => {
    const lastStep = state.stepsHistory.at(-1) || "IS_FRICHE";
    // When the last old-pattern step is an urban zone step handler sentinel,
    // return the urban zone sub-state's current step instead
    if (isUrbanZoneStepHandlerStep(lastStep)) {
      return state.urbanZone.currentStep;
    }
    return lastStep;
  },
);

const siteCreationRootReducer = reduceReducers<SiteCreationState>(
  getInitialState(),
  siteCreationReducer,
  urbanZoneSiteCreationReducer,
);

export default siteCreationRootReducer;
