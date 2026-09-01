import { createReducer } from "@reduxjs/toolkit";
import type { SiteNotEditableReason } from "shared";
import { v4 as uuid } from "uuid";

import type { SiteCreationState } from "@/features/create-site/core/createSite.reducer";
import {
  addCustomFormCasesToBuilder,
  type CustomWizardFormDefinition,
} from "@/features/create-site/core/custom/customForm.reducer";
import { CUSTOM_STEP_TO_GROUP } from "@/features/create-site/core/custom/customStepperConfig";
import { deriveSiteDataFromCustomSteps } from "@/features/create-site/core/custom/customSteps";
import { customStepHandlerRegistry } from "@/features/create-site/core/custom/stepHandlerRegistry";
import { surfaceAreaInputModeUpdated } from "@/features/create-site/core/steps/spaces/spaces.actions";
import { computeStepsSequence } from "@/shared/core/wizard-form/helpers/stepsSequence";

import {
  convertSiteToCustomSteps,
  getFirstCustomStepForNature,
} from "./helpers/convertSiteToCustomSteps";
import {
  updateCustomFormActions,
  siteUpdateInitiated,
  siteUpdateSaved,
} from "./updateSite.actions";

// Structural superset of `SiteCreationState` (see siteForm.lens.ts) — accepted verbatim by
// `SiteFormLens`. Carries along a few creation-only fields (`demo`, `stepsHistory`,
// `createMode`, `skipUseMutability`) that are meaningless for the update flow; this is
// deliberate — do not "clean them up", they exist only so the shared engine/selectors keep
// working against one lens shape.
export type SiteUpdateState = SiteCreationState & {
  siteId?: string;
  loadingState: "idle" | "loading" | "success" | "error";
  isEditable?: boolean;
  notEditableReason: SiteNotEditableReason | null;
};

const getInitialState = (): SiteUpdateState => {
  const base = {
    stepsHistory: [],
    initialSiteData: { id: uuid(), soils: [], yearlyExpenses: [], yearlyIncomes: [] },
    isFriche: undefined,
    nature: undefined,
    createMode: undefined,
    useMutability: undefined,
    skipUseMutability: false,
    saveLoadingState: "idle" as const,
    surfaceAreaInputMode: "percentage" as const,
    customFlowStarted: true,
    customHandedOffToUrbanZone: false,
    custom: {
      currentStep: "FRICHE_ACTIVITY" as const,
      stepsSequence: [],
      firstSequenceStep: "FRICHE_ACTIVITY" as const,
      steps: {},
      pendingStepCompletion: undefined,
      saveState: "idle" as const,
    },
    urbanZone: {
      currentStep: "URBAN_ZONE_LAND_PARCELS_SELECTION" as const,
      stepsSequence: [],
      firstSequenceStep: "URBAN_ZONE_LAND_PARCELS_SELECTION" as const,
      steps: {},
      pendingStepCompletion: undefined,
      saveState: "idle" as const,
    },
    demo: {
      currentStep: "DEMO_INTRODUCTION" as const,
      stepsSequence: [],
      firstSequenceStep: "DEMO_INTRODUCTION" as const,
      steps: {},
      pendingStepCompletion: undefined,
      saveState: "idle" as const,
    },
  };

  return {
    ...base,
    loadingState: "idle",
    isEditable: undefined,
    notEditableReason: null,
  } as SiteUpdateState;
};

const updateSiteCustomFormDefinition: CustomWizardFormDefinition<SiteUpdateState> = {
  config: {
    // "next_empty" (not creation's "step_order"): editing one already-answered step returns to
    // the summary rather than re-walking every remaining step of the wizard. `groupOf` keeps a
    // sidebar-entered group walkable step-by-step (every step is marked completed post-hydration,
    // so without it "next_empty" would snap straight back to the summary after the group's first
    // step — see ticket 10's QA report, defect 3).
    stepChangesNextMode: "next_empty",
    finalSummaryFallbackStep: "FINAL_SUMMARY",
    groupOf: (stepId) => CUSTOM_STEP_TO_GROUP[stepId].groupId,
    // No `onPreviousStepFallback`: unlike creation, there are no pre-engine steps to fall back
    // to here — hitting "Précédent" on the wizard's very first step is handled at the route
    // level (a "back to the site" link), not by blanking the engine state.
  },
  selectForm: (state) => state.custom,
  buildContext: (state) => ({
    siteData: deriveSiteDataFromCustomSteps(
      { ...state.initialSiteData, isFriche: state.isFriche, nature: state.nature },
      state.custom.steps,
    ),
  }),
};

const updateSiteReducer = createReducer(getInitialState(), (builder) => {
  addCustomFormCasesToBuilder(builder, updateCustomFormActions, updateSiteCustomFormDefinition);

  builder.addCase(surfaceAreaInputModeUpdated, (state, action) => {
    state.surfaceAreaInputMode = action.payload;
  });

  builder
    .addCase(siteUpdateInitiated.pending, () => ({
      ...getInitialState(),
      loadingState: "loading" as const,
    }))
    .addCase(siteUpdateInitiated.fulfilled, (state, action) => {
      const { features, isEditable, notEditableReason } = action.payload;

      state.loadingState = "success";
      state.siteId = features.id;
      state.isEditable = isEditable;
      state.notEditableReason = notEditableReason;
      state.nature = features.nature;
      state.isFriche = features.nature === "FRICHE";
      state.initialSiteData = {
        id: features.id,
        soils: [],
        yearlyExpenses: [],
        yearlyIncomes: [],
      };
      state.customFlowStarted = true;

      const steps = convertSiteToCustomSteps(features);
      const firstSequenceStep = getFirstCustomStepForNature(features.nature);
      const derivedSiteData = deriveSiteDataFromCustomSteps(
        { ...state.initialSiteData, isFriche: state.isFriche, nature: state.nature },
        steps,
      );

      state.custom.steps = steps;
      state.custom.firstSequenceStep = firstSequenceStep;
      state.custom.currentStep = "FINAL_SUMMARY";
      state.custom.saveState = "idle";
      state.custom.stepsSequence = computeStepsSequence(
        { context: { siteData: derivedSiteData }, answers: steps },
        firstSequenceStep,
        customStepHandlerRegistry,
      );
    })
    .addCase(siteUpdateInitiated.rejected, (state) => {
      state.loadingState = "error";
    });

  builder
    .addCase(siteUpdateSaved.pending, (state) => {
      state.custom.saveState = "loading";
    })
    .addCase(siteUpdateSaved.fulfilled, (state) => {
      state.custom.saveState = "success";
    })
    .addCase(siteUpdateSaved.rejected, (state) => {
      state.custom.saveState = "error";
    });
});

export default updateSiteReducer;
