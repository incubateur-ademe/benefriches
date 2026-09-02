import { createReducer, createSelector } from "@reduxjs/toolkit";
import type { SiteNotEditableReason } from "shared";
import { v4 as uuid } from "uuid";

import type { RootState } from "@/app/store/store";
import type {
  SiteCreationCustomStep,
  SiteCreationState,
} from "@/features/create-site/core/createSite.reducer";
import {
  addCustomFormCasesToBuilder,
  type CustomWizardFormDefinition,
} from "@/features/create-site/core/custom/customForm.reducer";
import { CUSTOM_STEP_TO_GROUP } from "@/features/create-site/core/custom/customStepperConfig";
import { isNavigableCustomStep } from "@/features/create-site/core/custom/customStepperConfig";
import { deriveSiteDataFromCustomSteps } from "@/features/create-site/core/custom/customSteps";
import { customStepHandlerRegistry } from "@/features/create-site/core/custom/stepHandlerRegistry";
import { surfaceAreaInputModeUpdated } from "@/features/create-site/core/steps/spaces/spaces.actions";
import { urbanZoneStepHandlerRegistry } from "@/features/create-site/core/urban-zone/stepHandlerRegistry";
import {
  addUrbanZoneFormCasesToBuilder,
  type UrbanZoneWizardFormDefinition,
} from "@/features/create-site/core/urban-zone/urbanZoneForm.reducer";
import { URBAN_ZONE_STEP_TO_GROUP } from "@/features/create-site/core/urban-zone/urbanZoneStepperConfig";
import { isNavigableUrbanZoneStep } from "@/features/create-site/core/urban-zone/urbanZoneStepperConfig";
import type { UrbanZoneSiteCreationStep } from "@/features/create-site/core/urban-zone/urbanZoneSteps";
import { computeStepsSequence } from "@/shared/core/wizard-form/helpers/stepsSequence";

import {
  convertSiteToCustomSteps,
  getFirstCustomStepForNature,
} from "./helpers/convertSiteToCustomSteps";
import { convertSiteToUrbanZoneSteps } from "./helpers/convertSiteToUrbanZoneSteps";
import {
  updateCustomFormActions,
  updateUrbanZoneFormActions,
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

// Urban zone's own sub-flow (state.urbanZone): the custom engine above only ever owns
// URBAN_ZONE_TYPE/ADDRESS/SURFACE_AREA for this nature (see convertSiteToCustomSteps.ts) — its
// derived siteData is what this definition's `buildContext` reads (same cross-sub-state pattern
// as creation's `completeCustomStep` hand-off, custom/customForm.reducer.ts).
const updateSiteUrbanZoneFormDefinition: UrbanZoneWizardFormDefinition<SiteUpdateState> = {
  config: {
    stepChangesNextMode: "next_empty",
    finalSummaryFallbackStep: "URBAN_ZONE_FINAL_SUMMARY",
    groupOf: (stepId) => URBAN_ZONE_STEP_TO_GROUP[stepId].groupId,
    // No `onPreviousStepFallback`: unlike creation, there is no custom-flow SURFACE_AREA step
    // to hand control back to from within the update wizard — "Précédent" on the urban-zone
    // sub-flow's own first step is a no-op here (there is nowhere earlier in this sub-flow to
    // go); ADDRESS/SURFACE_AREA/URBAN_ZONE_TYPE stay reachable from the sidebar instead.
  },
  selectForm: (state) => state.urbanZone,
  buildContext: (state) => ({
    siteData: deriveSiteDataFromCustomSteps(
      { ...state.initialSiteData, isFriche: state.isFriche, nature: state.nature },
      state.custom.steps,
    ),
  }),
};

const updateSiteReducer = createReducer(getInitialState(), (builder) => {
  addCustomFormCasesToBuilder(builder, updateCustomFormActions, updateSiteCustomFormDefinition);
  addUrbanZoneFormCasesToBuilder(
    builder,
    updateUrbanZoneFormActions,
    updateSiteUrbanZoneFormDefinition,
  );

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

      // Two-engine flow (ticket 11): a custom urban-zone site's ADDRESS/SURFACE_AREA/
      // URBAN_ZONE_TYPE live on the custom sub-state hydrated above; everything else — land
      // parcels, per-parcel soils/floor area, contamination, manager, expenses, naming — lives
      // on its own `state.urbanZone` sub-state, hydrated by `convertSiteToUrbanZoneSteps`
      // (mirrors creation's own `customHandedOffToUrbanZone` hand-off, custom/customForm
      // .reducer.ts). Both must be hydrated for the wizard's sidebar to be fully clickable.
      if (features.nature === "URBAN_ZONE") {
        state.customHandedOffToUrbanZone = true;

        const urbanZoneSteps = convertSiteToUrbanZoneSteps(features);
        const urbanZoneFirstSequenceStep = "URBAN_ZONE_LAND_PARCELS_SELECTION" as const;

        state.urbanZone.steps = urbanZoneSteps;
        state.urbanZone.firstSequenceStep = urbanZoneFirstSequenceStep;
        state.urbanZone.currentStep = "URBAN_ZONE_FINAL_SUMMARY";
        state.urbanZone.saveState = "idle";
        state.urbanZone.stepsSequence = computeStepsSequence(
          { context: { siteData: derivedSiteData }, answers: urbanZoneSteps },
          urbanZoneFirstSequenceStep,
          urbanZoneStepHandlerRegistry,
        );
      }
    })
    .addCase(siteUpdateInitiated.rejected, (state) => {
      state.loadingState = "error";
    });

  builder
    .addCase(siteUpdateSaved.pending, (state) => {
      state.custom.saveState = "loading";
      state.urbanZone.saveState = "loading";
    })
    .addCase(siteUpdateSaved.fulfilled, (state) => {
      state.custom.saveState = "success";
      state.urbanZone.saveState = "success";
    })
    .addCase(siteUpdateSaved.rejected, (state) => {
      state.custom.saveState = "error";
      state.urbanZone.saveState = "error";
    });
});

/**
 * The update wizard's combined current step, honouring the two-engine hand-off exactly like
 * creation's own `selectCurrentStep` (createSite.reducer.ts) — except the update flow is always
 * "started" (no pre-engine steps to gate on), so the only branch that matters is
 * `customHandedOffToUrbanZone`. `SiteUpdateView` reads this to decide which provider/stepper/
 * step-content to render (custom vs. urban-zone).
 */
export const selectSiteUpdateCurrentStep = createSelector(
  (state: RootState) => state.siteUpdate,
  (state): SiteCreationCustomStep | UrbanZoneSiteCreationStep =>
    state.customHandedOffToUrbanZone ? state.urbanZone.currentStep : state.custom.currentStep,
);

/**
 * The combined save state driving the wizard's persistent sidebar save button (ticket 16).
 * `siteUpdateSaved.pending/fulfilled/rejected` set BOTH `custom.saveState` and
 * `urbanZone.saveState` in lockstep, but `applyStepChanges` (shared/core/wizard-form/helpers/
 * applyStepChanges.ts) only marks the sub-form the edited step belongs to as "dirty" — a naive
 * read of `state.siteUpdate.custom.saveState` alone would miss an urban-zone-only edit. If
 * either sub-state is "loading", that takes priority (a save request always touches both, so they
 * only ever disagree on that value for transient in-between renders). Otherwise "dirty" from
 * either sub-state outranks "success"/"error" from the other: `applyStepChanges` only flips the
 * sub-state it's called against to "dirty", so a stale "success"/"error" left in the untouched
 * sub-state after a save must never mask a genuinely dirty edit made afterwards. Only when
 * neither is dirty do we fall back to "success"/"error"; otherwise "idle".
 */
export const selectSiteUpdateSaveState = createSelector(
  (state: RootState) => state.siteUpdate,
  (state): "idle" | "dirty" | "loading" | "success" | "error" => {
    const { saveState: customSaveState } = state.custom;
    const { saveState: urbanZoneSaveState } = state.urbanZone;

    if (customSaveState === "loading" || urbanZoneSaveState === "loading") {
      return "loading";
    }
    if (customSaveState === "dirty" || urbanZoneSaveState === "dirty") {
      return "dirty";
    }
    for (const priorityState of ["success", "error"] as const) {
      if (customSaveState === priorityState || urbanZoneSaveState === priorityState) {
        return priorityState;
      }
    }
    return "idle";
  },
);

/**
 * Whether every navigable (answer) step of the wizard is completed, gating the save button's
 * enabled state. Only `custom`'s navigable steps are considered unless the site has been handed
 * off to the urban-zone sub-flow (ticket 11), in which case `urbanZone`'s navigable steps are
 * considered too — mirroring `selectSiteUpdateCurrentStep`'s own hand-off branch.
 */
export const selectSiteUpdateIsFormValid = createSelector(
  (state: RootState) => state.siteUpdate,
  (state): boolean => {
    const customSteps = state.custom.steps as Record<string, { completed?: boolean } | undefined>;
    const customStepsValid = state.custom.stepsSequence
      .filter(isNavigableCustomStep)
      .every((stepId) => customSteps[stepId]?.completed);

    if (!state.customHandedOffToUrbanZone) {
      return customStepsValid;
    }

    const urbanZoneSteps = state.urbanZone.steps as Record<
      string,
      { completed?: boolean } | undefined
    >;
    const urbanZoneStepsValid = state.urbanZone.stepsSequence
      .filter(isNavigableUrbanZoneStep)
      .every((stepId) => urbanZoneSteps[stepId]?.completed);

    return customStepsValid && urbanZoneStepsValid;
  },
);

export default updateSiteReducer;
