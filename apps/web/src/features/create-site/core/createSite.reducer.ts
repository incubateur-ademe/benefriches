import { createReducer, createSelector } from "@reduxjs/toolkit";
import reduceReducers from "reduce-reducers";
import type { SiteNature } from "shared";
import { v4 as uuid } from "uuid";

import { RootState } from "@/app/store/store";
import { SiteCreationData } from "@/features/create-site/core/siteFoncier.types";
import { StepUpdateResult } from "@/shared/core/wizard-form/helpers/computeStepChanges";
import { WizardFormSubState } from "@/shared/core/wizard-form/wizardForm.reducer";

import { stepReverted } from "./actions/revert.action";
import { customSiteCreationReducer } from "./custom/custom.reducer";
import type {
  CustomAnswerStepId,
  CustomAnswersByStep,
  CustomStepsState,
  SiteCreationCustomStep,
} from "./custom/customSteps";
import { demoSiteCreationReducer } from "./demo/demoFactory";
import { AnswersByStep, DemoAnswerStepId, DemoSiteCreationStep } from "./demo/demoSteps";
import { DemoStepsState } from "./demo/stepHandlerRegistry";
import { registerFinalHandlers } from "./steps/final/final.handlers";
import { registerIntroductionHandlers } from "./steps/introduction/introduction.handlers";
import { surfaceAreaInputModeUpdated } from "./steps/spaces/spaces.actions";
import { urbanZoneSiteCreationReducer } from "./urban-zone/urbanZone.reducer";
import {
  type AnswersByStep as UrbanZoneAnswersByStep,
  type SchematizedAnswerStepId as UrbanZoneSchematizedAnswerStepId,
  type UrbanZoneSiteCreationStep,
  type UrbanZoneStepsState,
} from "./urban-zone/urbanZoneSteps";

export type { SiteCreationCustomStep } from "./custom/customSteps";

export type SiteCreationStep =
  | "INTRODUCTION"
  | "IS_FRICHE"
  | "USE_MUTABILITY"
  | "SITE_NATURE"
  | "CREATE_MODE_SELECTION"
  | SiteCreationCustomStep
  | UrbanZoneSiteCreationStep;

const FIRST_URBAN_ZONE_STEP: UrbanZoneSiteCreationStep = "URBAN_ZONE_LAND_PARCELS_SELECTION";

export type UrbanZoneSiteCreationState = WizardFormSubState<
  UrbanZoneSiteCreationStep,
  UrbanZoneStepsState,
  StepUpdateResult<
    UrbanZoneSiteCreationStep,
    UrbanZoneAnswersByStep,
    UrbanZoneSchematizedAnswerStepId
  >
>;

const INITIAL_URBAN_ZONE_STATE: UrbanZoneSiteCreationState = {
  currentStep: FIRST_URBAN_ZONE_STEP,
  stepsSequence: [],
  firstSequenceStep: FIRST_URBAN_ZONE_STEP,
  steps: {},
  pendingStepCompletion: undefined,
  saveState: "idle",
};

export type DemoSiteCreationState = WizardFormSubState<
  DemoSiteCreationStep,
  DemoStepsState,
  StepUpdateResult<DemoSiteCreationStep, AnswersByStep, DemoAnswerStepId>
>;

const FIRST_DEMO_STEP: DemoSiteCreationStep = "DEMO_INTRODUCTION";
const INITIAL_DEMO_STATE: DemoSiteCreationState = {
  currentStep: FIRST_DEMO_STEP,
  stepsSequence: [],
  firstSequenceStep: FIRST_DEMO_STEP,
  steps: {},
  pendingStepCompletion: undefined,
  saveState: "idle",
};

export type CustomSiteCreationState = WizardFormSubState<
  SiteCreationCustomStep,
  CustomStepsState,
  StepUpdateResult<SiteCreationCustomStep, CustomAnswersByStep, CustomAnswerStepId>
>;

// Arbitrary — the custom flow has four possible entry steps (one per nature); whichever one is
// actually chosen (see registerIntroductionHandlers) overwrites both currentStep and
// firstSequenceStep before the engine is ever read from (selectCurrentStep gates on
// `customFlowStarted`).
const FIRST_CUSTOM_STEP: SiteCreationCustomStep = "FRICHE_ACTIVITY";
const INITIAL_CUSTOM_STATE: CustomSiteCreationState = {
  currentStep: FIRST_CUSTOM_STEP,
  stepsSequence: [],
  firstSequenceStep: FIRST_CUSTOM_STEP,
  steps: {},
  pendingStepCompletion: undefined,
  saveState: "idle",
};

export type SiteCreationState = {
  // Pre-engine steps only from here on (INTRODUCTION/IS_FRICHE/USE_MUTABILITY/SITE_NATURE/
  // CREATE_MODE_SELECTION) — the legacy custom flow's own steps are driven by `custom` below.
  stepsHistory: SiteCreationStep[];
  /**
   * The custom flow's static base: an id generated once at flow start, plus the accumulator's
   * empty defaults. Combined with `isFriche`/`nature` and `custom.steps` via
   * `deriveSiteDataFromCustomSteps` (see core/custom/customSteps.ts) to get the full
   * `SiteCreationData` wherever it's needed (selectors, save thunks).
   */
  initialSiteData: SiteCreationData;
  isFriche?: boolean;
  nature?: SiteNature;
  createMode?: "express" | "custom";
  useMutability?: boolean;
  skipUseMutability: boolean;
  saveLoadingState: "idle" | "loading" | "success" | "error";
  surfaceAreaInputMode: "percentage" | "squareMeters";
  /** True once a pre-engine step has handed off into the custom wizard-form engine. */
  customFlowStarted: boolean;
  /** True once the custom engine has handed off to the urban-zone sub-flow (see SURFACE_AREA). */
  customHandedOffToUrbanZone: boolean;
  custom: CustomSiteCreationState;
  urbanZone: UrbanZoneSiteCreationState;
  demo: DemoSiteCreationState;
};

export const getInitialState = (props?: {
  createMode?: SiteCreationState["createMode"];
  skipUseMutability?: boolean;
}): SiteCreationState => {
  const initialStep: SiteCreationStep =
    props?.createMode === "custom" ? "INTRODUCTION" : "CREATE_MODE_SELECTION";
  return {
    stepsHistory: props?.createMode === "express" ? [] : [initialStep],
    saveLoadingState: "idle",
    createMode: props?.createMode,
    skipUseMutability: props?.skipUseMutability ? props?.skipUseMutability : false,
    initialSiteData: {
      id: uuid(),
      soils: [],
      yearlyExpenses: [],
      yearlyIncomes: [],
    },
    isFriche: undefined,
    nature: undefined,
    surfaceAreaInputMode: "percentage",
    customFlowStarted: false,
    customHandedOffToUrbanZone: false,
    custom: INITIAL_CUSTOM_STATE,
    urbanZone: INITIAL_URBAN_ZONE_STATE,
    demo: INITIAL_DEMO_STATE,
  } as const;
};

const siteCreationReducer = createReducer(getInitialState(), (builder) => {
  registerIntroductionHandlers(builder);
  registerFinalHandlers(builder);

  // Deviation from the ticket's plan: the plan called for deleting `stepReverted` outright, but
  // the 5 pre-engine steps (INTRODUCTION/IS_FRICHE/USE_MUTABILITY/SITE_NATURE/
  // CREATE_MODE_SELECTION) stay outside the wizard-form engine and still need *some* back-nav
  // mechanism over `stepsHistory` — the ticket itself describes them as unchanged. Kept here,
  // trimmed to just the history pop (the old per-step `revert*Step` field-clearing calls are
  // gone along with the accumulator they used to clear).
  builder.addCase(stepReverted, (state) => {
    if (state.stepsHistory.length > 1) {
      state.stepsHistory = state.stepsHistory.slice(0, -1);
    }
  });

  builder.addCase(surfaceAreaInputModeUpdated, (state, action) => {
    state.surfaceAreaInputMode = action.payload;
  });
});

export const selectCurrentStep = createSelector(
  [(state: RootState) => state.siteCreation],
  (state): SiteCreationStep => {
    if (state.createMode === "custom" && state.customFlowStarted) {
      if (state.customHandedOffToUrbanZone) {
        return state.urbanZone.currentStep;
      }
      return state.custom.currentStep;
    }
    return state.stepsHistory.at(-1) || "IS_FRICHE";
  },
);

const siteCreationRootReducer = reduceReducers<SiteCreationState>(
  getInitialState(),
  siteCreationReducer,
  customSiteCreationReducer,
  urbanZoneSiteCreationReducer,
  demoSiteCreationReducer,
);

export default siteCreationRootReducer;
