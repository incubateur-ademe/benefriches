import { ActionReducerMapBuilder, Draft } from "@reduxjs/toolkit";

import { applyStepChanges } from "@/shared/core/wizard-form/helpers/applyStepChanges";
import {
  computeStepChanges,
  StepUpdateResult,
} from "@/shared/core/wizard-form/helpers/computeStepChanges";
import { navigateToAndLoadStep } from "@/shared/core/wizard-form/helpers/navigateToStep";
import { WizardFormDefinition } from "@/shared/core/wizard-form/wizardForm.reducer";

import { SiteCreationState } from "../createSite.reducer";
import { CustomFormPureActions, StepCompletionPayload } from "./custom.actions";
import { CustomAnswerStepId, CustomAnswersByStep, SiteCreationCustomStep } from "./customSteps";
import {
  CustomStepHandlerContext,
  customAnswerStepHandlers,
  customStepHandlerRegistry,
} from "./stepHandlerRegistry";

// Generic over `S` (a structural superset of `SiteCreationState`, mirroring the project side's
// `S extends RenewableEnergyHostState`) so both creation (`SiteCreationState` itself) and the
// update flow (`SiteUpdateState`, features/update-site/core/updateSite.reducer.ts) can drive
// this case-adder against their own concrete state.
export type CustomWizardFormDefinition<S extends SiteCreationState = SiteCreationState> = Pick<
  WizardFormDefinition<
    SiteCreationCustomStep,
    CustomStepHandlerContext,
    Draft<S>["custom"]["steps"],
    Draft<S>,
    StepUpdateResult<SiteCreationCustomStep, CustomAnswersByStep, CustomAnswerStepId>
  >,
  "config" | "selectForm" | "buildContext"
>;

/**
 * The actual step-completion mechanism: compute + apply changes, then run the SURFACE_AREA ->
 * urban-zone cross-flow hand-off check. Exported so both `stepCompletionRequested` (dispatched
 * by every step-container view) and the legacy per-step actions kept for the ticket-02
 * behaviour-net oracle (see legacyActionsAdapter.ts) drive the exact same engine path — there is
 * only one wizard engine underneath either call site.
 */
export const completeCustomStep = <S extends SiteCreationState>(
  state: Draft<S>,
  definition: CustomWizardFormDefinition<S>,
  payload: StepCompletionPayload,
): void => {
  const { config, selectForm, buildContext } = definition;
  const context = buildContext(state);
  const changes = computeStepChanges<
    SiteCreationCustomStep,
    CustomStepHandlerContext,
    CustomAnswersByStep,
    CustomAnswerStepId
  >(customAnswerStepHandlers, context, selectForm(state).steps, payload);

  if (changes.cascadingChanges && changes.cascadingChanges.length > 0) {
    selectForm(state).pendingStepCompletion = {
      changes,
      showAlert: true,
    };
  } else {
    applyStepChanges(
      selectForm(state),
      context,
      changes,
      customStepHandlerRegistry,
      customAnswerStepHandlers,
      {
        nextMode: config.stepChangesNextMode,
        finalSummaryFallbackStep: config.finalSummaryFallbackStep,
        groupOf: config.groupOf,
      },
    );
  }

  // Cross-flow hand-off: an urban-zone site's SURFACE_AREA is the last step this registry
  // owns. Once it completes, control passes to the urban-zone sub-flow's own step handler
  // system (its own WizardFormSubState, under state.urbanZone) — both live on the same
  // SiteCreationState, so this is a plain, well-commented cross-sub-state assignment. The
  // `customHandedOffToUrbanZone` flag is what `selectCurrentStep` (createSite.reducer.ts)
  // reads to redirect to `state.urbanZone.currentStep` — the widening this needs (this
  // registry doesn't know urban-zone's own step ids) would otherwise have to leak into
  // `computeStepsSequence`'s registry lookups; SURFACE_AREA's own getNextStepId already stays
  // self-contained (self-targeting for URBAN_ZONE nature) precisely so that walk never needs
  // to leave this registry.
  if (payload.stepId === "SURFACE_AREA" && context.siteData.nature === "URBAN_ZONE") {
    state.urbanZone.currentStep = state.urbanZone.firstSequenceStep;
    state.customHandedOffToUrbanZone = true;
  }
};

/** Advances from the current (info) step via its own `getNextStepId` — no answer to store. */
export const advanceCustomStep = <S extends SiteCreationState>(
  state: Draft<S>,
  definition: CustomWizardFormDefinition<S>,
): void => {
  advanceFromStep(state, definition, definition.selectForm(state).currentStep);
};

/**
 * Advances from the GIVEN (info) step's own `getNextStepId`, regardless of whatever the form's
 * `currentStep` actually is. Needed by the legacy per-step action adapter
 * (legacyActionsAdapter.ts): unlike `nextStepRequested` (always dispatched from the step the
 * user is actually looking at), the legacy per-step actions are action-identity-keyed, not
 * current-step-keyed — the ticket-02 behaviour-net oracle dispatches them for the step they name
 * even when a distinct-but-equivalent step (e.g. SOILS_SUMMARY vs SOILS_CARBON_STORAGE, both
 * skipped straight through for a not-yet-fully-known reason) is technically current.
 */
export const advanceFromStep = <S extends SiteCreationState>(
  state: Draft<S>,
  definition: CustomWizardFormDefinition<S>,
  stepId: SiteCreationCustomStep,
): void => {
  const { selectForm, buildContext } = definition;
  const form = selectForm(state);
  const context = buildContext(state);
  const handler = customStepHandlerRegistry[stepId];

  if (handler.getNextStepId) {
    navigateToAndLoadStep(
      form,
      context,
      handler.getNextStepId({ context, answers: form.steps }),
      customStepHandlerRegistry,
    );
  }
};

export const addCustomFormCasesToBuilder = <S extends SiteCreationState>(
  builder: ActionReducerMapBuilder<S>,
  actions: CustomFormPureActions,
  definition: CustomWizardFormDefinition<S>,
) => {
  const { config, selectForm, buildContext } = definition;

  builder.addCase(actions.stepCompletionRequested, (state, action) => {
    completeCustomStep(state, definition, action.payload);
  });

  builder.addCase(actions.stepCompletionConfirmed, (state) => {
    const pending = selectForm(state).pendingStepCompletion;
    if (pending) {
      applyStepChanges(
        selectForm(state),
        buildContext(state),
        pending.changes,
        customStepHandlerRegistry,
        customAnswerStepHandlers,
        {
          nextMode: config.stepChangesNextMode,
          finalSummaryFallbackStep: config.finalSummaryFallbackStep,
        },
      );
      selectForm(state).pendingStepCompletion = undefined;
    }
  });

  builder.addCase(actions.stepCompletionCancelled, (state) => {
    selectForm(state).pendingStepCompletion = undefined;
  });

  builder.addCase(actions.previousStepRequested, (state) => {
    const form = selectForm(state);
    const context = buildContext(state);
    const handler = customStepHandlerRegistry[form.currentStep];

    if (handler.getPreviousStepId) {
      navigateToAndLoadStep(
        form,
        context,
        handler.getPreviousStepId({ context, answers: form.steps }),
        customStepHandlerRegistry,
      );
      return;
    }

    const currentIndex = form.stepsSequence.indexOf(form.currentStep);
    const previousStep = currentIndex > 0 ? form.stepsSequence[currentIndex - 1] : undefined;
    if (previousStep) {
      navigateToAndLoadStep(form, context, previousStep, customStepHandlerRegistry);
    } else {
      config.onPreviousStepFallback?.(state);
    }
  });

  builder.addCase(actions.nextStepRequested, (state) => {
    advanceCustomStep(state, definition);
  });

  builder.addCase(actions.stepNavigationRequested, (state, action) => {
    navigateToAndLoadStep(
      selectForm(state),
      buildContext(state),
      action.payload.stepId,
      customStepHandlerRegistry,
    );
  });
};
