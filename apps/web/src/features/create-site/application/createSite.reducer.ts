import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FricheActivity, SoilsDistribution, SoilType } from "shared";
import { v4 as uuid } from "uuid";
import { saveExpressSiteAction, saveSiteAction } from "./createSite.actions";

import { RootState } from "@/app/application/store";
import {
  Address,
  Expense,
  Income,
  Owner,
  SiteDraft,
  Tenant,
} from "@/features/create-site/domain/siteFoncier.types";
import { splitEvenly } from "@/shared/services/split-number/splitNumber";

export type SiteCreationCustomStep =
  | "SITE_TYPE"
  | "ADDRESS"
  // soils
  | "SOILS_INTRODUCTION"
  | "SURFACE_AREA"
  | "SOILS_SELECTION"
  | "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE"
  | "SOILS_SURFACE_AREAS_DISTRIBUTION"
  | "SOILS_SUMMARY"
  | "SOILS_CARBON_STORAGE"
  // contamination
  | "SOILS_CONTAMINATION"
  // site management
  | "MANAGEMENT_INTRODUCTION"
  | "OWNER"
  | "IS_FRICHE_LEASED"
  | "IS_SITE_OPERATED"
  | "TENANT"
  | "OPERATOR"
  | "FULL_TIME_JOBS_INVOLVED"
  | "FRICHE_RECENT_ACCIDENTS"
  | "YEARLY_EXPENSES"
  | "YEARLY_INCOME"
  | "YEARLY_EXPENSES_SUMMARY"
  // NAMING
  | "FRICHE_ACTIVITY"
  | "NAMING"
  // SUMARRY
  | "FINAL_SUMMARY"
  | "CREATION_CONFIRMATION";

export type SiteCreationExpressStep =
  | "SITE_TYPE"
  | "ADDRESS"
  | "SURFACE_AREA"
  | "CREATION_CONFIRMATION";

export type SiteCreationStep =
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
    stepsHistory: ["CREATE_MODE_SELECTION"],
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

export const siteCreationSlice = createSlice({
  name: "siteCreation",
  initialState: getInitialState(),
  reducers: {
    resetState: () => {
      return getInitialState();
    },
    completeCreateModeSelectionStep: (
      state,
      action: PayloadAction<{ createMode: "express" | "custom" }>,
    ) => {
      state.createMode = action.payload.createMode;
      state.stepsHistory.push("SITE_TYPE");
    },
    completeSiteTypeStep: (state, action: PayloadAction<{ isFriche: boolean }>) => {
      state.siteData.isFriche = action.payload.isFriche;
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
      state.stepsHistory.push(
        state.createMode === "express" ? "CREATION_CONFIRMATION" : "SOILS_SELECTION",
      );
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
      const nextStep = state.siteData.isFriche ? "SOILS_CONTAMINATION" : "MANAGEMENT_INTRODUCTION";
      state.stepsHistory.push(nextStep);
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

      state.stepsHistory.push("MANAGEMENT_INTRODUCTION");
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
      state.stepsHistory.push(isFricheLeased ? "TENANT" : "FULL_TIME_JOBS_INVOLVED");
    },
    completeIsSiteOperated: (state, action: PayloadAction<{ isSiteOperated: boolean }>) => {
      const { isSiteOperated } = action.payload;
      state.siteData.isSiteOperated = isSiteOperated;
      state.stepsHistory.push(isSiteOperated ? "OPERATOR" : "YEARLY_EXPENSES");
    },
    completeTenant: (state, action: PayloadAction<{ tenant: Tenant | undefined }>) => {
      state.siteData.tenant = action.payload.tenant;
      state.stepsHistory.push("FULL_TIME_JOBS_INVOLVED");
    },
    completeOperator: (state, action: PayloadAction<{ tenant: Tenant | undefined }>) => {
      const { tenant } = action.payload;
      if (tenant) {
        state.siteData.tenant = tenant;
      }
      state.stepsHistory.push("FULL_TIME_JOBS_INVOLVED");
    },
    completeFullTimeJobsInvolved: (state, action: PayloadAction<{ jobs?: number }>) => {
      if (action.payload.jobs) {
        state.siteData.fullTimeJobsInvolved = action.payload.jobs;
      }
      const nextStep = state.siteData.isFriche ? "FRICHE_RECENT_ACCIDENTS" : "YEARLY_EXPENSES";
      state.stepsHistory.push(nextStep);
    },
    completeFricheRecentAccidents: (
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

      state.stepsHistory.push("YEARLY_EXPENSES");
    },
    completeYearlyExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.siteData.yearlyExpenses = action.payload;
      state.stepsHistory.push(
        state.siteData.isSiteOperated ? "YEARLY_INCOME" : "YEARLY_EXPENSES_SUMMARY",
      );
    },
    completeYearlyExpensesSummary: (state) => {
      const nextStep = state.siteData.isFriche ? "FRICHE_ACTIVITY" : "NAMING";
      state.stepsHistory.push(nextStep);
    },
    completeYearlyIncome: (state, action: PayloadAction<Income[]>) => {
      state.siteData.yearlyIncomes = action.payload;
      state.stepsHistory.push("YEARLY_EXPENSES_SUMMARY");
    },
    completeFricheActivity: (state, action: PayloadAction<FricheActivity>) => {
      state.siteData.fricheActivity = action.payload;
      state.stepsHistory.push("NAMING");
    },
    completeNaming: (state, action: PayloadAction<{ name: string; description?: string }>) => {
      state.siteData.name = action.payload.name;
      if (action.payload.description) state.siteData.description = action.payload.description;

      state.stepsHistory.push("FINAL_SUMMARY");
    },
    completeSummary: (state) => {
      state.stepsHistory.push("CREATION_CONFIRMATION");
    },
    revertStep: (
      state,
      action: PayloadAction<{ resetFields: (keyof SiteDraft)[] } | undefined>,
    ) => {
      const { siteData: initialSiteData } = getInitialState();

      if (action.payload) {
        action.payload.resetFields.forEach(<K extends keyof SiteDraft>(field: K) => {
          state.siteData[field] =
            field in initialSiteData ? (initialSiteData[field] as SiteDraft[K]) : undefined;
        });
      }

      if (state.stepsHistory.length > 1) {
        state.stepsHistory = state.stepsHistory.slice(0, -1);
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(saveSiteAction.pending, (state) => {
      state.saveLoadingState = "loading";
    });
    builder.addCase(saveSiteAction.fulfilled, (state) => {
      state.saveLoadingState = "success";
    });
    builder.addCase(saveSiteAction.rejected, (state) => {
      state.saveLoadingState = "error";
    });
    builder.addCase(saveExpressSiteAction.pending, (state) => {
      state.saveLoadingState = "loading";
    });
    builder.addCase(saveExpressSiteAction.fulfilled, (state, action) => {
      state.saveLoadingState = "success";
      state.siteData.name = action.payload.name;
    });
    builder.addCase(saveExpressSiteAction.rejected, (state) => {
      state.saveLoadingState = "error";
    });
  },
});

export const selectCurrentStep = createSelector(
  [(state: RootState) => state.siteCreation],
  (state): SiteCreationStep => {
    return state.stepsHistory.at(-1) || "SITE_TYPE";
  },
);

export const {
  resetState,
  completeCreateModeSelectionStep,
  completeSiteTypeStep,
  completeAddressStep,
  completeSoilsIntroduction,
  completeSiteSurfaceArea,
  completeSoils,
  completeSoilsSurfaceAreaDistributionEntryMode,
  completeSoilsDistribution,
  completeSoilsSummary,
  completeSoilsCarbonStorage,
  completeSoilsContamination,
  completeManagementIntroduction,
  completeFullTimeJobsInvolved,
  completeOwner,
  completeIsFricheLeased,
  completeIsSiteOperated,
  completeTenant,
  completeOperator,
  completeFricheRecentAccidents,
  completeYearlyExpenses,
  completeYearlyExpensesSummary,
  completeYearlyIncome,
  completeFricheActivity,
  completeNaming,
  completeSummary,
  revertStep,
} = siteCreationSlice.actions;

export default siteCreationSlice.reducer;
