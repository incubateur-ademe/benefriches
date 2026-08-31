import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import type { SiteCreationState } from "../createSite.reducer";
import { addressStepCompleted } from "../steps/address/address.actions";
import {
  fricheAccidentsIntroductionStepCompleted,
  fricheAccidentsStepCompleted,
  soilsContaminationIntroductionStepCompleted,
  soilsContaminationStepCompleted,
} from "../steps/contamination-and-accidents/contaminationAndAccidents.actions";
import {
  namingIntroductionStepCompleted,
  namingStepCompleted,
} from "../steps/naming/naming.actions";
import {
  agriculturalOperationActivityCompleted,
  fricheActivityStepCompleted,
  naturalAreaTypeCompleted,
} from "../steps/site-activity/siteActivity.actions";
import {
  isFricheLeasedStepCompleted,
  isSiteOperatedStepCompleted,
  managementIntroductionCompleted,
  operatorStepCompleted,
  ownerStepCompleted,
  tenantStepCompleted,
  yearlyExpensesAndIncomeIntroductionCompleted,
  yearlyExpensesStepCompleted,
  yearlyExpensesSummaryCompleted,
  yearlyIncomeStepCompleted,
} from "../steps/site-management/siteManagement.actions";
import {
  siteSurfaceAreaStepCompleted,
  soilsCarbonStorageStepCompleted,
  soilsDistributionStepCompleted,
  soilsIntroductionStepCompleted,
  soilsSelectionStepCompleted,
  soilsSummaryStepCompleted,
  spacesKnowledgeStepCompleted,
  spacesSurfaceAreaDistributionKnowledgeCompleted,
} from "../steps/spaces/spaces.actions";
import {
  urbanZoneLandParcelsIntroductionCompleted,
  urbanZoneTypeCompleted,
} from "../steps/urban-zone/urbanZone.actions";
import {
  advanceFromStep,
  completeCustomStep,
  CustomWizardFormDefinition,
} from "./customForm.reducer";

/**
 * Aliases every legacy per-step action (`fricheActivityStepCompleted`, `addressStepCompleted`,
 * ...) onto the same engine path `stepCompletionRequested`/`nextStepRequested` drive
 * (`completeCustomStep`/`advanceCustomStep` — see customForm.reducer.ts). These action creators
 * are no longer dispatched by any view (views dispatch the generic `customFormActions` instead —
 * see the step-container `index.tsx` files), but they are kept alive because the ticket-02
 * behaviour-net oracle (`core/__tests__/behaviour-net/*.spec.ts`) dispatches them directly and
 * must pass unmodified. There is still only one wizard engine underneath either call site.
 */
export const addLegacyCustomActionsToBuilder = (
  builder: ActionReducerMapBuilder<SiteCreationState>,
  definition: CustomWizardFormDefinition,
) => {
  builder
    .addCase(fricheActivityStepCompleted, (state, action) => {
      completeCustomStep(state, definition, { stepId: "FRICHE_ACTIVITY", answers: action.payload });
    })
    .addCase(agriculturalOperationActivityCompleted, (state, action) => {
      completeCustomStep(state, definition, {
        stepId: "AGRICULTURAL_OPERATION_ACTIVITY",
        answers: action.payload,
      });
    })
    .addCase(naturalAreaTypeCompleted, (state, action) => {
      completeCustomStep(state, definition, {
        stepId: "NATURAL_AREA_TYPE",
        answers: action.payload,
      });
    })
    .addCase(urbanZoneTypeCompleted, (state, action) => {
      state.createMode = "custom";
      completeCustomStep(state, definition, { stepId: "URBAN_ZONE_TYPE", answers: action.payload });
    })
    .addCase(urbanZoneLandParcelsIntroductionCompleted, (state) => {
      advanceFromStep(state, definition, "URBAN_ZONE_LAND_PARCELS_INTRODUCTION");
    })
    .addCase(addressStepCompleted, (state, action) => {
      completeCustomStep(state, definition, { stepId: "ADDRESS", answers: action.payload });
    })
    .addCase(soilsIntroductionStepCompleted, (state) => {
      advanceFromStep(state, definition, "SPACES_INTRODUCTION");
    })
    .addCase(siteSurfaceAreaStepCompleted, (state, action) => {
      completeCustomStep(state, definition, { stepId: "SURFACE_AREA", answers: action.payload });
    })
    .addCase(spacesKnowledgeStepCompleted, (state, action) => {
      completeCustomStep(state, definition, {
        stepId: "SPACES_KNOWLEDGE",
        answers: action.payload,
      });
    })
    .addCase(soilsSelectionStepCompleted, (state, action) => {
      completeCustomStep(state, definition, {
        stepId: "SPACES_SELECTION",
        answers: action.payload,
      });
    })
    .addCase(spacesSurfaceAreaDistributionKnowledgeCompleted, (state, action) => {
      completeCustomStep(state, definition, {
        stepId: "SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE",
        answers: action.payload,
      });
    })
    .addCase(soilsDistributionStepCompleted, (state, action) => {
      completeCustomStep(state, definition, {
        stepId: "SPACES_SURFACE_AREA_DISTRIBUTION",
        answers: action.payload,
      });
    })
    .addCase(soilsSummaryStepCompleted, (state) => {
      advanceFromStep(state, definition, "SOILS_SUMMARY");
    })
    .addCase(soilsCarbonStorageStepCompleted, (state) => {
      advanceFromStep(state, definition, "SOILS_CARBON_STORAGE");
    })
    .addCase(soilsContaminationIntroductionStepCompleted, (state) => {
      advanceFromStep(state, definition, "SOILS_CONTAMINATION_INTRODUCTION");
    })
    .addCase(soilsContaminationStepCompleted, (state, action) => {
      completeCustomStep(state, definition, {
        stepId: "SOILS_CONTAMINATION",
        answers: action.payload,
      });
    })
    .addCase(fricheAccidentsIntroductionStepCompleted, (state) => {
      advanceFromStep(state, definition, "FRICHE_ACCIDENTS_INTRODUCTION");
    })
    .addCase(fricheAccidentsStepCompleted, (state, action) => {
      completeCustomStep(state, definition, {
        stepId: "FRICHE_ACCIDENTS",
        answers: action.payload,
      });
    })
    .addCase(managementIntroductionCompleted, (state) => {
      advanceFromStep(state, definition, "MANAGEMENT_INTRODUCTION");
    })
    .addCase(ownerStepCompleted, (state, action) => {
      completeCustomStep(state, definition, { stepId: "OWNER", answers: action.payload });
    })
    .addCase(isFricheLeasedStepCompleted, (state, action) => {
      completeCustomStep(state, definition, {
        stepId: "IS_FRICHE_LEASED",
        answers: action.payload,
      });
    })
    .addCase(isSiteOperatedStepCompleted, (state, action) => {
      completeCustomStep(state, definition, {
        stepId: "IS_SITE_OPERATED",
        answers: action.payload,
      });
    })
    .addCase(tenantStepCompleted, (state, action) => {
      completeCustomStep(state, definition, { stepId: "TENANT", answers: action.payload });
    })
    .addCase(operatorStepCompleted, (state, action) => {
      completeCustomStep(state, definition, { stepId: "OPERATOR", answers: action.payload });
    })
    .addCase(yearlyExpensesAndIncomeIntroductionCompleted, (state) => {
      advanceFromStep(state, definition, "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION");
    })
    .addCase(yearlyExpensesStepCompleted, (state, action) => {
      completeCustomStep(state, definition, { stepId: "YEARLY_EXPENSES", answers: action.payload });
    })
    .addCase(yearlyExpensesSummaryCompleted, (state) => {
      advanceFromStep(state, definition, "YEARLY_EXPENSES_SUMMARY");
    })
    .addCase(yearlyIncomeStepCompleted, (state, action) => {
      completeCustomStep(state, definition, { stepId: "YEARLY_INCOME", answers: action.payload });
    })
    .addCase(namingIntroductionStepCompleted, (state) => {
      advanceFromStep(state, definition, "NAMING_INTRODUCTION");
    })
    .addCase(namingStepCompleted, (state, action) => {
      completeCustomStep(state, definition, { stepId: "NAMING", answers: action.payload });
    });
};
