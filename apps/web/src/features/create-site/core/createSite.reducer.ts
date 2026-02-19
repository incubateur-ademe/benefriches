import { createReducer, createSelector } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

import { SiteCreationData } from "@/features/create-site/core/siteFoncier.types";
import { RootState } from "@/shared/core/store-config/store";

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
  | "CREATION_RESULT";

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
  | SiteCreationCustomStep;

export type SiteCreationState = {
  stepsHistory: SiteCreationStep[];
  siteData: SiteCreationData;
  createMode?: "express" | "custom";
  useMutability?: boolean;
  skipUseMutability: boolean;
  saveLoadingState: "idle" | "loading" | "success" | "error";
  surfaceAreaInputMode: "percentage" | "squareMeters";
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

  builder.addCase(stepReverted, (state) => {
    revertIntroductionStep(state);
    revertSiteActivityStep(state);
    revertAddressStep(state);
    revertSpacesStep(state);
    revertContaminationAndAccidentsStep(state);
    revertSiteManagementStep(state);
    revertNamingStep(state);

    if (state.stepsHistory.length > 1) {
      state.stepsHistory = state.stepsHistory.slice(0, -1);
    }
  });
});

export const selectCurrentStep = createSelector(
  [(state: RootState) => state.siteCreation],
  (state): SiteCreationStep => {
    return state.stepsHistory.at(-1) || "IS_FRICHE";
  },
);

export default siteCreationReducer;
