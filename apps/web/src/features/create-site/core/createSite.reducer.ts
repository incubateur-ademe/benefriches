import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
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

const siteCreationSlice = createSlice({
  name: "siteCreation",
  initialState: getInitialState(),
  reducers: {
    resetState: () => {
      return getInitialState();
    },
    introductionStepCompleted: (state) => {
      state.stepsHistory.push("CREATE_MODE_SELECTION");
    },
    completeCreateModeSelectionStep: (
      state,
      action: PayloadAction<{ createMode: "express" | "custom" }>,
    ) => {
      state.createMode = action.payload.createMode;
      state.stepsHistory.push("SITE_NATURE");
    },
    siteNatureStepCompleted: (state, action: PayloadAction<{ isFriche: boolean }>) => {
      const { isFriche } = action.payload;
      state.siteData.isFriche = isFriche;
      const nextStep = isFriche && state.createMode !== "express" ? "FRICHE_ACTIVITY" : "ADDRESS";
      state.stepsHistory.push(nextStep);
    },
    completeFricheActivity: (state, action: PayloadAction<FricheActivity>) => {
      state.siteData.fricheActivity = action.payload;
      state.stepsHistory.push("ADDRESS");
    },
    completeAddressStep: (state, action: PayloadAction<{ address: Address }>) => {
      state.siteData.address = action.payload.address;
      state.stepsHistory.push(
        state.createMode === "express" ? "SURFACE_AREA" : "SOILS_INTRODUCTION",
      );
    },
    completeSoilsIntroduction: (state) => {
      state.stepsHistory.push("SURFACE_AREA");
    },
    completeSiteSurfaceArea: (state, action: PayloadAction<{ surfaceArea: number }>) => {
      state.siteData.surfaceArea = action.payload.surfaceArea;
      if (state.createMode === "custom") {
        state.stepsHistory.push("SOILS_SELECTION");
      }
    },
    completeSoils: (state, action: PayloadAction<{ soils: SoilType[] }>) => {
      state.siteData.soils = action.payload.soils;
      state.stepsHistory.push("SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE");
    },
    completeSoilsSurfaceAreaDistributionEntryMode: (
      state,
      action: PayloadAction<"default_even_split" | "total_surface_percentage" | "square_meters">,
    ) => {
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

      state.siteData.soilsDistributionEntryMode = action.payload;
      const nextStep =
        soilsDistributionEntryMode === "default_even_split"
          ? "SOILS_SUMMARY"
          : "SOILS_SURFACE_AREAS_DISTRIBUTION";
      state.stepsHistory.push(nextStep);
    },
    completeSoilsDistribution: (
      state,
      action: PayloadAction<{ distribution: SoilsDistribution }>,
    ) => {
      state.siteData.soilsDistribution = action.payload.distribution;
      state.stepsHistory.push("SOILS_SUMMARY");
    },
    completeSoilsSummary: (state) => {
      state.stepsHistory.push("SOILS_CARBON_STORAGE");
    },
    completeSoilsCarbonStorage: (state) => {
      const nextStep = state.siteData.isFriche
        ? "SOILS_CONTAMINATION_INTRODUCTION"
        : "MANAGEMENT_INTRODUCTION";
      state.stepsHistory.push(nextStep);
    },
    completeSoilsContaminationIntroductionStep: (state) => {
      state.stepsHistory.push("SOILS_CONTAMINATION");
    },
    completeSoilsContamination: (
      state,
      action: PayloadAction<{
        hasContaminatedSoils: boolean;
        contaminatedSoilSurface?: number;
      }>,
    ) => {
      const { hasContaminatedSoils, contaminatedSoilSurface } = action.payload;
      state.siteData.hasContaminatedSoils = hasContaminatedSoils;

      if (hasContaminatedSoils && contaminatedSoilSurface) {
        state.siteData.contaminatedSoilSurface = contaminatedSoilSurface;
      }

      state.stepsHistory.push("FRICHE_ACCIDENTS_INTRODUCTION");
    },
    completeManagementIntroduction: (state) => {
      state.stepsHistory.push("OWNER");
    },
    completeOwner: (state, action: PayloadAction<{ owner: Owner }>) => {
      state.siteData.owner = action.payload.owner;
      state.stepsHistory.push(state.siteData.isFriche ? "IS_FRICHE_LEASED" : "IS_SITE_OPERATED");
    },
    completeIsFricheLeased: (state, action: PayloadAction<{ isFricheLeased: boolean }>) => {
      const { isFricheLeased } = action.payload;
      state.siteData.isFricheLeased = isFricheLeased;
      state.stepsHistory.push(isFricheLeased ? "TENANT" : "YEARLY_EXPENSES");
    },
    completeIsSiteOperated: (state, action: PayloadAction<{ isSiteOperated: boolean }>) => {
      const { isSiteOperated } = action.payload;
      state.siteData.isSiteOperated = isSiteOperated;
      state.stepsHistory.push(isSiteOperated ? "OPERATOR" : "YEARLY_EXPENSES");
    },
    completeTenant: (state, action: PayloadAction<{ tenant: Tenant | undefined }>) => {
      state.siteData.tenant = action.payload.tenant;
      state.stepsHistory.push("YEARLY_EXPENSES");
    },
    completeOperator: (state, action: PayloadAction<{ tenant: Tenant | undefined }>) => {
      const { tenant } = action.payload;
      if (tenant) {
        state.siteData.tenant = tenant;
      }
      state.stepsHistory.push("YEARLY_EXPENSES");
    },
    completeFricheAccidentsIntroduction: (state) => {
      state.stepsHistory.push("FRICHE_ACCIDENTS");
    },
    completeFricheAccidents: (
      state,
      action: PayloadAction<
        | {
            hasRecentAccidents: false;
          }
        | {
            hasRecentAccidents: true;
            accidentsMinorInjuries?: number;
            accidentsSevereInjuries?: number;
            accidentsDeaths?: number;
          }
      >,
    ) => {
      const { hasRecentAccidents } = action.payload;
      state.siteData.hasRecentAccidents = action.payload.hasRecentAccidents;

      if (hasRecentAccidents) {
        state.siteData.accidentsMinorInjuries = action.payload.accidentsMinorInjuries ?? 0;
        state.siteData.accidentsSevereInjuries = action.payload.accidentsSevereInjuries ?? 0;
        state.siteData.accidentsDeaths = action.payload.accidentsDeaths ?? 0;
      }

      state.stepsHistory.push("MANAGEMENT_INTRODUCTION");
    },
    completeYearlyExpenses: (state, action: PayloadAction<SiteYearlyExpense[]>) => {
      state.siteData.yearlyExpenses = action.payload;
      state.stepsHistory.push(
        state.siteData.isSiteOperated ? "YEARLY_INCOME" : "YEARLY_EXPENSES_SUMMARY",
      );
    },
    completeYearlyExpensesSummary: (state) => {
      state.stepsHistory.push("NAMING_INTRODUCTION");
    },
    completeYearlyIncome: (state, action: PayloadAction<Income[]>) => {
      state.siteData.yearlyIncomes = action.payload;
      state.stepsHistory.push("YEARLY_EXPENSES_SUMMARY");
    },
    namingIntroductionStepCompleted: (state) => {
      state.stepsHistory.push("NAMING");
    },
    completeNaming: (state, action: PayloadAction<{ name: string; description?: string }>) => {
      state.siteData.name = action.payload.name;
      if (action.payload.description) state.siteData.description = action.payload.description;

      state.stepsHistory.push("FINAL_SUMMARY");
    },
    revertStep: (
      state,
      action: PayloadAction<{ resetFields: (keyof SiteDraft)[] } | undefined>,
    ) => {
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
    },
  },
  extraReducers(builder) {
    builder.addCase(customSiteSaved.pending, (state) => {
      state.stepsHistory.push("CREATION_RESULT");
      state.saveLoadingState = "loading";
    });
    builder.addCase(customSiteSaved.fulfilled, (state) => {
      state.saveLoadingState = "success";
    });
    builder.addCase(customSiteSaved.rejected, (state) => {
      state.saveLoadingState = "error";
    });
    builder.addCase(expressSiteSaved.pending, (state) => {
      state.stepsHistory.push("CREATION_RESULT");
      state.saveLoadingState = "loading";
    });
    builder.addCase(expressSiteSaved.fulfilled, (state, action) => {
      state.saveLoadingState = "success";
      state.siteData.name = action.payload.name;
    });
    builder.addCase(expressSiteSaved.rejected, (state) => {
      state.saveLoadingState = "error";
    });
  },
});

export const selectCurrentStep = createSelector(
  [(state: RootState) => state.siteCreation],
  (state): SiteCreationStep => {
    return state.stepsHistory.at(-1) || "SITE_NATURE";
  },
);

export const {
  resetState,
  introductionStepCompleted,
  completeCreateModeSelectionStep,
  siteNatureStepCompleted,
  completeAddressStep,
  completeSoilsIntroduction,
  completeSiteSurfaceArea,
  completeSoils,
  completeSoilsSurfaceAreaDistributionEntryMode,
  completeSoilsDistribution,
  completeSoilsSummary,
  completeSoilsCarbonStorage,
  completeSoilsContaminationIntroductionStep,
  completeSoilsContamination,
  completeFricheAccidentsIntroduction,
  completeFricheAccidents,
  completeManagementIntroduction,
  completeOwner,
  completeIsFricheLeased,
  completeIsSiteOperated,
  completeTenant,
  completeOperator,
  completeYearlyExpenses,
  completeYearlyExpensesSummary,
  completeYearlyIncome,
  completeFricheActivity,
  namingIntroductionStepCompleted,
  completeNaming,
  revertStep,
} = siteCreationSlice.actions;

export default siteCreationSlice.reducer;
