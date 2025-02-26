import { createAction, createReducer, createSelector } from "@reduxjs/toolkit";
import { FricheActivity, SoilsDistribution, SoilType, SiteYearlyExpense } from "shared";
import { v4 as uuid } from "uuid";

import {
  Address,
  Income,
  Owner,
  SiteDraft,
  Tenant,
} from "@/features/create-site/core/siteFoncier.types";
import { splitEvenly } from "@/shared/core/split-number/splitNumber";
import { RootState } from "@/shared/core/store-config/store";

import { customSiteSaved, expressSiteSaved } from "./actions/siteSaved.actions";

export type SiteCreationCustomStep =
  | "SITE_NATURE"
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
  | "SITE_NATURE"
  | "ADDRESS"
  | "SURFACE_AREA"
  | "CREATION_RESULT";

export type SiteCreationStep =
  | "INTRODUCTION"
  | "CREATE_MODE_SELECTION"
  | SiteCreationExpressStep
  | SiteCreationCustomStep;

export type SiteCreationState = {
  stepsHistory: SiteCreationStep[];
  siteData: Partial<SiteDraft>;
  createMode?: "express" | "custom";
  saveLoadingState: "idle" | "loading" | "success" | "error";
};

export const getInitialState = (): SiteCreationState => {
  return {
    stepsHistory: ["INTRODUCTION"],
    saveLoadingState: "idle",
    createMode: undefined,
    siteData: {
      id: uuid(),
      soils: [],
      yearlyExpenses: [],
      yearlyIncomes: [],
    },
  } as const;
};

export const resetState = createAction("siteCreation/resetState");

export const introductionStepCompleted = createAction("siteCreation/introductionStepCompleted");

export const completeCreateModeSelectionStep = createAction<{ createMode: "express" | "custom" }>(
  "siteCreation/completeCreateModeSelectionStep",
);

export const siteNatureStepCompleted = createAction<{ isFriche: boolean }>(
  "siteCreation/siteNatureStepCompleted",
);

export const completeFricheActivity = createAction<FricheActivity>(
  "siteCreation/completeFricheActivity",
);

export const completeAddressStep = createAction<{ address: Address }>(
  "siteCreation/completeAddressStep",
);

export const completeSoilsIntroduction = createAction("siteCreation/completeSoilsIntroduction");

export const completeSiteSurfaceArea = createAction<{ surfaceArea: number }>(
  "siteCreation/completeSiteSurfaceArea",
);

export const completeSoils = createAction<{ soils: SoilType[] }>("siteCreation/completeSoils");

export const completeSoilsSurfaceAreaDistributionEntryMode = createAction<
  "default_even_split" | "total_surface_percentage" | "square_meters"
>("siteCreation/completeSoilsSurfaceAreaDistributionEntryMode");

export const completeSoilsDistribution = createAction<{ distribution: SoilsDistribution }>(
  "siteCreation/completeSoilsDistribution",
);

export const completeSoilsSummary = createAction("siteCreation/completeSoilsSummary");

export const completeSoilsCarbonStorage = createAction("siteCreation/completeSoilsCarbonStorage");

export const completeSoilsContaminationIntroductionStep = createAction(
  "siteCreation/completeSoilsContaminationIntroductionStep",
);

export const completeSoilsContamination = createAction<{
  hasContaminatedSoils: boolean;
  contaminatedSoilSurface?: number;
}>("siteCreation/completeSoilsContamination");

export const completeManagementIntroduction = createAction(
  "siteCreation/completeManagementIntroduction",
);

export const completeOwner = createAction<{ owner: Owner }>("siteCreation/completeOwner");

export const completeIsFricheLeased = createAction<{ isFricheLeased: boolean }>(
  "siteCreation/completeIsFricheLeased",
);

export const completeIsSiteOperated = createAction<{ isSiteOperated: boolean }>(
  "siteCreation/completeIsSiteOperated",
);

export const completeTenant = createAction<{ tenant: Tenant | undefined }>(
  "siteCreation/completeTenant",
);

export const completeOperator = createAction<{ tenant: Tenant | undefined }>(
  "siteCreation/completeOperator",
);

export const completeFricheAccidentsIntroduction = createAction(
  "siteCreation/completeFricheAccidentsIntroduction",
);

export const completeFricheAccidents = createAction<
  | { hasRecentAccidents: false }
  | {
      hasRecentAccidents: true;
      accidentsMinorInjuries?: number;
      accidentsSevereInjuries?: number;
      accidentsDeaths?: number;
    }
>("siteCreation/completeFricheAccidents");

export const completeYearlyExpenses = createAction<SiteYearlyExpense[]>(
  "siteCreation/completeYearlyExpenses",
);

export const completeYearlyExpensesSummary = createAction(
  "siteCreation/completeYearlyExpensesSummary",
);

export const completeYearlyIncome = createAction<Income[]>("siteCreation/completeYearlyIncome");

export const namingIntroductionStepCompleted = createAction(
  "siteCreation/namingIntroductionStepCompleted",
);

export const completeNaming = createAction<{ name: string; description?: string }>(
  "siteCreation/completeNaming",
);

export const revertStep = createAction<{ resetFields: (keyof SiteDraft)[] } | undefined>(
  "siteCreation/revertStep",
);

export const siteCreationReducer = createReducer(getInitialState(), (builder) => {
  builder
    .addCase(resetState, () => getInitialState())
    .addCase(introductionStepCompleted, (state) => {
      state.stepsHistory.push("CREATE_MODE_SELECTION");
    })
    .addCase(completeCreateModeSelectionStep, (state, action) => {
      state.createMode = action.payload.createMode;
      state.stepsHistory.push("SITE_NATURE");
    })
    .addCase(siteNatureStepCompleted, (state, action) => {
      const { isFriche } = action.payload;
      state.siteData.isFriche = isFriche;
      const nextStep = isFriche && state.createMode !== "express" ? "FRICHE_ACTIVITY" : "ADDRESS";
      state.stepsHistory.push(nextStep);
    })
    .addCase(completeFricheActivity, (state, action) => {
      state.siteData.fricheActivity = action.payload;
      state.stepsHistory.push("ADDRESS");
    })
    .addCase(completeAddressStep, (state, action) => {
      state.siteData.address = action.payload.address;
      state.stepsHistory.push(
        state.createMode === "express" ? "SURFACE_AREA" : "SOILS_INTRODUCTION",
      );
    })
    .addCase(completeSoilsIntroduction, (state) => {
      state.stepsHistory.push("SURFACE_AREA");
    })
    .addCase(completeSiteSurfaceArea, (state, action) => {
      state.siteData.surfaceArea = action.payload.surfaceArea;
      if (state.createMode === "custom") {
        state.stepsHistory.push("SOILS_SELECTION");
      }
    })
    .addCase(completeSoils, (state, action) => {
      state.siteData.soils = action.payload.soils;
      state.stepsHistory.push("SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE");
    })
    .addCase(completeSoilsSurfaceAreaDistributionEntryMode, (state, action) => {
      const soilsDistributionEntryMode = action.payload;
      if (soilsDistributionEntryMode === "default_even_split") {
        const totalSurface = state.siteData.surfaceArea ?? 0;
        const soils = state.siteData.soils ?? [];
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
    .addCase(completeSoilsDistribution, (state, action) => {
      state.siteData.soilsDistribution = action.payload.distribution;
      state.stepsHistory.push("SOILS_SUMMARY");
    })
    .addCase(completeSoilsSummary, (state) => {
      state.stepsHistory.push("SOILS_CARBON_STORAGE");
    })
    .addCase(completeSoilsCarbonStorage, (state) => {
      const nextStep = state.siteData.isFriche
        ? "SOILS_CONTAMINATION_INTRODUCTION"
        : "MANAGEMENT_INTRODUCTION";
      state.stepsHistory.push(nextStep);
    })
    .addCase(completeSoilsContaminationIntroductionStep, (state) => {
      state.stepsHistory.push("SOILS_CONTAMINATION");
    })
    .addCase(completeSoilsContamination, (state, action) => {
      const { hasContaminatedSoils, contaminatedSoilSurface } = action.payload;
      state.siteData.hasContaminatedSoils = hasContaminatedSoils;

      if (hasContaminatedSoils && contaminatedSoilSurface) {
        state.siteData.contaminatedSoilSurface = contaminatedSoilSurface;
      }
      state.stepsHistory.push("FRICHE_ACCIDENTS_INTRODUCTION");
    })
    .addCase(completeManagementIntroduction, (state) => {
      state.stepsHistory.push("OWNER");
    })
    .addCase(completeOwner, (state, action) => {
      state.siteData.owner = action.payload.owner;
      state.stepsHistory.push(state.siteData.isFriche ? "IS_FRICHE_LEASED" : "IS_SITE_OPERATED");
    })
    .addCase(completeIsFricheLeased, (state, action) => {
      const { isFricheLeased } = action.payload;
      state.siteData.isFricheLeased = isFricheLeased;
      state.stepsHistory.push(isFricheLeased ? "TENANT" : "YEARLY_EXPENSES");
    })
    .addCase(completeIsSiteOperated, (state, action) => {
      const { isSiteOperated } = action.payload;
      state.siteData.isSiteOperated = isSiteOperated;
      state.stepsHistory.push(isSiteOperated ? "OPERATOR" : "YEARLY_EXPENSES");
    })
    .addCase(completeTenant, (state, action) => {
      state.siteData.tenant = action.payload.tenant;
      state.stepsHistory.push("YEARLY_EXPENSES");
    })
    .addCase(completeOperator, (state, action) => {
      const { tenant } = action.payload;
      if (tenant) {
        state.siteData.tenant = tenant;
      }
      state.stepsHistory.push("YEARLY_EXPENSES");
    })
    .addCase(completeFricheAccidentsIntroduction, (state) => {
      state.stepsHistory.push("FRICHE_ACCIDENTS");
    })
    .addCase(completeFricheAccidents, (state, action) => {
      const { hasRecentAccidents } = action.payload;
      state.siteData.hasRecentAccidents = hasRecentAccidents;

      if (hasRecentAccidents) {
        state.siteData.accidentsMinorInjuries = action.payload.accidentsMinorInjuries ?? 0;
        state.siteData.accidentsSevereInjuries = action.payload.accidentsSevereInjuries ?? 0;
        state.siteData.accidentsDeaths = action.payload.accidentsDeaths ?? 0;
      }
      state.stepsHistory.push("MANAGEMENT_INTRODUCTION");
    })
    .addCase(completeYearlyExpenses, (state, action) => {
      state.siteData.yearlyExpenses = action.payload;
      state.stepsHistory.push(
        state.siteData.isSiteOperated ? "YEARLY_INCOME" : "YEARLY_EXPENSES_SUMMARY",
      );
    })
    .addCase(completeYearlyExpensesSummary, (state) => {
      state.stepsHistory.push("NAMING_INTRODUCTION");
    })
    .addCase(completeYearlyIncome, (state, action) => {
      state.siteData.yearlyIncomes = action.payload;
      state.stepsHistory.push("YEARLY_EXPENSES_SUMMARY");
    })
    .addCase(namingIntroductionStepCompleted, (state) => {
      state.stepsHistory.push("NAMING");
    })
    .addCase(completeNaming, (state, action) => {
      state.siteData.name = action.payload.name;

      if (action.payload.description) state.siteData.description = action.payload.description;

      state.stepsHistory.push("FINAL_SUMMARY");
    })
    .addCase(revertStep, (state, action) => {
      const { siteData: initialSiteData } = getInitialState();
      if (action.payload) {
        /* disable typescript-eslint rule: https://typescript-eslint.io/rules/no-unnecessary-type-parameters */
        /* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters */
        action.payload.resetFields.forEach(<K extends keyof SiteDraft>(field: K) => {
          state.siteData[field] = field in initialSiteData ? initialSiteData[field] : undefined;
        });
      }

      if (state.stepsHistory.length > 1) {
        state.stepsHistory = state.stepsHistory.slice(0, -1);
      }
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
    .addCase(expressSiteSaved.fulfilled, (state, action) => {
      state.saveLoadingState = "success";
      state.siteData.name = action.payload.name;
    })
    .addCase(expressSiteSaved.rejected, (state) => {
      state.saveLoadingState = "error";
    });
});

export const selectCurrentStep = createSelector(
  [(state: RootState) => state.siteCreation],
  (state): SiteCreationStep => {
    return state.stepsHistory.at(-1) || "SITE_NATURE";
  },
);

export default siteCreationReducer;
