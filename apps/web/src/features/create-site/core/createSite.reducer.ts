import { createReducer, createSelector } from "@reduxjs/toolkit";
import { SoilsDistribution } from "shared";
import { v4 as uuid } from "uuid";

import { SiteCreationData } from "@/features/create-site/core/siteFoncier.types";
import { splitEvenly } from "@/shared/core/split-number/splitNumber";
import { RootState } from "@/shared/core/store-config/store";

import { customSiteSaved, expressSiteSaved } from "./actions/finalStep.actions";
import {
  addressStepCompleted,
  agriculturalOperationActivityCompleted,
  createModeSelectionCompleted,
  fricheActivityStepCompleted,
  introductionStepCompleted,
  isFricheCompleted,
  naturalAreaTypeCompleted,
  siteCreationInitiated,
  siteNatureCompleted,
} from "./actions/introduction.actions";
import { namingIntroductionStepCompleted, namingStepCompleted } from "./actions/naming.actions";
import {
  isStepRevertAttemptedAction,
  stepRevertCancelled,
  stepRevertConfirmed,
  stepReverted,
} from "./actions/revert.actions";
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
} from "./actions/siteManagement.actions";
import {
  fricheAccidentsIntroductionStepCompleted,
  fricheAccidentsStepCompleted,
  soilsContaminationIntroductionStepCompleted,
  soilsContaminationStepCompleted,
} from "./actions/soilsContaminationAndAccidents.actions";
import {
  siteSurfaceAreaStepCompleted,
  soilsCarbonStorageStepCompleted,
  soilsDistributionStepCompleted,
  soilsIntroductionStepCompleted,
  soilsSelectionStepCompleted,
  soilsSummaryStepCompleted,
  soilsSurfaceAreaDistributionEntryModeCompleted,
} from "./actions/spaces.actions";

export type SiteCreationCustomStep =
  | "FRICHE_ACTIVITY"
  | "ADDRESS"
  // soils
  | "SOILS_INTRODUCTION"
  | "SURFACE_AREA"
  | "SOILS_SELECTION"
  | "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE"
  | "SOILS_SURFACE_AREAS_DISTRIBUTION"
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
  | "AGRICULTURAL_OPERATION_ACTIVITY"
  | "NATURAL_AREA_TYPE"
  | "ADDRESS"
  | "SURFACE_AREA"
  | "CREATION_RESULT";

export type SiteCreationStep =
  | "INTRODUCTION"
  | "IS_FRICHE"
  | "SITE_NATURE"
  | "CREATE_MODE_SELECTION"
  | SiteCreationExpressStep
  | SiteCreationCustomStep;

export type SiteCreationState = {
  stepsHistory: SiteCreationStep[];
  siteData: SiteCreationData;
  stepRevertAttempted: boolean;
  createMode?: "express" | "custom";
  saveLoadingState: "idle" | "loading" | "success" | "error";
};

export const getInitialState = (): SiteCreationState => {
  return {
    stepsHistory: ["INTRODUCTION"],
    saveLoadingState: "idle",
    createMode: undefined,
    stepRevertAttempted: false,
    siteData: {
      id: uuid(),
      soils: [],
      yearlyExpenses: [],
      yearlyIncomes: [],
    },
  } as const;
};

const siteCreationReducer = createReducer(getInitialState(), (builder) => {
  builder
    .addCase(siteCreationInitiated, () => getInitialState())
    .addCase(introductionStepCompleted, (state) => {
      state.stepsHistory.push("IS_FRICHE");
    })
    .addCase(isFricheCompleted, (state, action) => {
      const { isFriche } = action.payload;

      state.siteData.isFriche = isFriche;
      if (isFriche) {
        state.siteData.nature = "FRICHE";
        state.stepsHistory.push("CREATE_MODE_SELECTION");
      } else {
        state.stepsHistory.push("SITE_NATURE");
      }
    })
    .addCase(siteNatureCompleted, (state, action) => {
      state.siteData.nature = action.payload.nature;
      state.stepsHistory.push("CREATE_MODE_SELECTION");
    })
    .addCase(createModeSelectionCompleted, (state, action) => {
      const { createMode } = action.payload;
      state.createMode = createMode;

      switch (state.siteData.nature) {
        case "AGRICULTURAL_OPERATION":
          if (createMode === "express") {
            state.stepsHistory.push("AGRICULTURAL_OPERATION_ACTIVITY");
            break;
          }
          state.stepsHistory.push("ADDRESS");
          break;
        case "FRICHE":
          if (createMode === "express") {
            state.stepsHistory.push("ADDRESS");
            break;
          }
          state.stepsHistory.push("FRICHE_ACTIVITY");
          break;
        case "NATURAL_AREA":
          if (createMode === "express") {
            state.stepsHistory.push("NATURAL_AREA_TYPE");
            break;
          }
          state.stepsHistory.push("ADDRESS");
          break;
        default:
          state.stepsHistory.push("ADDRESS");
          break;
      }
    })
    .addCase(fricheActivityStepCompleted, (state, action) => {
      state.siteData.fricheActivity = action.payload;
      state.stepsHistory.push("ADDRESS");
    })
    .addCase(agriculturalOperationActivityCompleted, (state, action) => {
      state.siteData.agriculturalOperationActivity = action.payload.activity;
      state.stepsHistory.push("ADDRESS");
    })
    .addCase(naturalAreaTypeCompleted, (state, action) => {
      state.siteData.naturalAreaType = action.payload.naturalAreaType;
      state.stepsHistory.push("ADDRESS");
    })
    .addCase(addressStepCompleted, (state, action) => {
      state.siteData.address = action.payload.address;
      state.stepsHistory.push(
        state.createMode === "express" ? "SURFACE_AREA" : "SOILS_INTRODUCTION",
      );
    })
    .addCase(soilsIntroductionStepCompleted, (state) => {
      state.stepsHistory.push("SURFACE_AREA");
    })
    .addCase(siteSurfaceAreaStepCompleted, (state, action) => {
      state.siteData.surfaceArea = action.payload.surfaceArea;
      if (state.createMode === "custom") {
        state.stepsHistory.push("SOILS_SELECTION");
      }
    })
    .addCase(soilsSelectionStepCompleted, (state, action) => {
      state.siteData.soils = action.payload.soils;
      state.stepsHistory.push("SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE");
    })
    .addCase(soilsSurfaceAreaDistributionEntryModeCompleted, (state, action) => {
      const soilsDistributionEntryMode = action.payload;
      if (soilsDistributionEntryMode === "default_even_split") {
        const totalSurface = state.siteData.surfaceArea ?? 0;
        const soils = state.siteData.soils;
        const surfaceSplit = splitEvenly(totalSurface, soils.length);
        const soilsDistribution: SoilsDistribution = {};
        soils.forEach((soilType, index) => {
          soilsDistribution[soilType] = surfaceSplit[index];
        });
        state.siteData.soilsDistribution = soilsDistribution;
      }
      state.siteData.soilsDistributionEntryMode = soilsDistributionEntryMode;
      const nextStep =
        soilsDistributionEntryMode === "default_even_split"
          ? "SOILS_SUMMARY"
          : "SOILS_SURFACE_AREAS_DISTRIBUTION";
      state.stepsHistory.push(nextStep);
    })
    .addCase(soilsDistributionStepCompleted, (state, action) => {
      state.siteData.soilsDistribution = action.payload.distribution;
      state.stepsHistory.push("SOILS_SUMMARY");
    })
    .addCase(soilsSummaryStepCompleted, (state) => {
      state.stepsHistory.push("SOILS_CARBON_STORAGE");
    })
    .addCase(soilsCarbonStorageStepCompleted, (state) => {
      const nextStep = state.siteData.isFriche
        ? "SOILS_CONTAMINATION_INTRODUCTION"
        : "MANAGEMENT_INTRODUCTION";
      state.stepsHistory.push(nextStep);
    })
    .addCase(soilsContaminationIntroductionStepCompleted, (state) => {
      state.stepsHistory.push("SOILS_CONTAMINATION");
    })
    .addCase(soilsContaminationStepCompleted, (state, action) => {
      const { hasContaminatedSoils, contaminatedSoilSurface } = action.payload;
      state.siteData.hasContaminatedSoils = hasContaminatedSoils;

      if (hasContaminatedSoils && contaminatedSoilSurface) {
        state.siteData.contaminatedSoilSurface = contaminatedSoilSurface;
      }
      state.stepsHistory.push("FRICHE_ACCIDENTS_INTRODUCTION");
    })
    .addCase(managementIntroductionCompleted, (state) => {
      state.stepsHistory.push("OWNER");
    })
    .addCase(ownerStepCompleted, (state, action) => {
      state.siteData.owner = action.payload.owner;
      switch (state.siteData.nature) {
        case "FRICHE":
          state.stepsHistory.push("IS_FRICHE_LEASED");
          break;
        case "AGRICULTURAL_OPERATION":
          state.stepsHistory.push("IS_SITE_OPERATED");
          break;
        case "NATURAL_AREA":
          state.stepsHistory.push("NAMING_INTRODUCTION");
      }
    })
    .addCase(isFricheLeasedStepCompleted, (state, action) => {
      const { isFricheLeased } = action.payload;
      state.siteData.isFricheLeased = isFricheLeased;
      state.stepsHistory.push(
        isFricheLeased ? "TENANT" : "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
      );
    })
    .addCase(isSiteOperatedStepCompleted, (state, action) => {
      const { isSiteOperated } = action.payload;
      state.siteData.isSiteOperated = isSiteOperated;
      state.stepsHistory.push(
        isSiteOperated ? "OPERATOR" : "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
      );
    })
    .addCase(tenantStepCompleted, (state, action) => {
      state.siteData.tenant = action.payload.tenant;
      state.stepsHistory.push("YEARLY_EXPENSES_AND_INCOME_INTRODUCTION");
    })
    .addCase(operatorStepCompleted, (state, action) => {
      const { tenant } = action.payload;
      if (tenant) {
        state.siteData.tenant = tenant;
      }
      state.stepsHistory.push("YEARLY_EXPENSES_AND_INCOME_INTRODUCTION");
    })
    .addCase(fricheAccidentsIntroductionStepCompleted, (state) => {
      state.stepsHistory.push("FRICHE_ACCIDENTS");
    })
    .addCase(fricheAccidentsStepCompleted, (state, action) => {
      const { hasRecentAccidents } = action.payload;
      state.siteData.hasRecentAccidents = hasRecentAccidents;

      if (hasRecentAccidents) {
        state.siteData.accidentsMinorInjuries = action.payload.accidentsMinorInjuries ?? 0;
        state.siteData.accidentsSevereInjuries = action.payload.accidentsSevereInjuries ?? 0;
        state.siteData.accidentsDeaths = action.payload.accidentsDeaths ?? 0;
      }
      state.stepsHistory.push("MANAGEMENT_INTRODUCTION");
    })
    .addCase(yearlyExpensesAndIncomeIntroductionCompleted, (state) => {
      state.stepsHistory.push("YEARLY_EXPENSES");
    })
    .addCase(yearlyExpensesStepCompleted, (state, action) => {
      state.siteData.yearlyExpenses = action.payload;
      state.stepsHistory.push(
        state.siteData.isSiteOperated ? "YEARLY_INCOME" : "YEARLY_EXPENSES_SUMMARY",
      );
    })
    .addCase(yearlyExpensesSummaryCompleted, (state) => {
      state.stepsHistory.push("NAMING_INTRODUCTION");
    })
    .addCase(yearlyIncomeStepCompleted, (state, action) => {
      state.siteData.yearlyIncomes = action.payload;
      state.stepsHistory.push("YEARLY_EXPENSES_SUMMARY");
    })
    .addCase(namingIntroductionStepCompleted, (state) => {
      state.stepsHistory.push("NAMING");
    })
    .addCase(namingStepCompleted, (state, action) => {
      state.siteData.name = action.payload.name;

      if (action.payload.description) state.siteData.description = action.payload.description;

      state.stepsHistory.push("FINAL_SUMMARY");
    })
    .addCase(customSiteSaved.pending, (state) => {
      state.stepsHistory.push("CREATION_RESULT");
      state.saveLoadingState = "loading";
    })
    .addCase(customSiteSaved.fulfilled, (state) => {
      state.saveLoadingState = "success";
    })
    .addCase(customSiteSaved.rejected, (state) => {
      state.saveLoadingState = "error";
    })
    .addCase(expressSiteSaved.pending, (state) => {
      state.stepsHistory.push("CREATION_RESULT");
      state.saveLoadingState = "loading";
    })
    .addCase(expressSiteSaved.fulfilled, (state) => {
      state.saveLoadingState = "success";
    })
    .addCase(expressSiteSaved.rejected, (state) => {
      state.saveLoadingState = "error";
    })
    .addCase(stepReverted, (state, action) => {
      const { siteData: initialSiteData } = getInitialState();
      if (action.payload) {
        /* disable typescript-eslint rule: https://typescript-eslint.io/rules/no-unnecessary-type-parameters */
        /* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters */
        action.payload.resetFields.forEach(<K extends keyof SiteCreationData>(field: K) => {
          state.siteData[field] = initialSiteData[field];
        });
      }

      if (state.stepsHistory.length > 1) {
        state.stepsHistory = state.stepsHistory.slice(0, -1);
      }
    })
    .addCase(stepRevertConfirmed, (state) => {
      state.stepRevertAttempted = false;
    })
    .addCase(stepRevertCancelled, (state) => {
      state.stepRevertAttempted = false;
    })
    .addMatcher(isStepRevertAttemptedAction, (state) => {
      state.stepRevertAttempted = true;
    });
});

export const selectCurrentStep = createSelector(
  [(state: RootState) => state.siteCreation],
  (state): SiteCreationStep => {
    return state.stepsHistory.at(-1) || "IS_FRICHE";
  },
);

export default siteCreationReducer;
