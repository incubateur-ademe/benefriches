import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import { saveSiteAction } from "./createSite.actions";

import { FricheActivity } from "@/features/create-site/domain/friche.types";
import {
  Address,
  Expense,
  Income,
  Owner,
  SiteDraft,
  SoilsSurfaceAreaDistribution,
  Tenant,
} from "@/features/create-site/domain/siteFoncier.types";
import { SoilType } from "@/shared/domain/soils";
import { splitEvenly } from "@/shared/services/split-number/splitNumber";

export type SiteCreationStep =
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
  | "TENANT"
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

function staticNextStep(nextStep: SiteCreationStep) {
  return { getNextStep: () => nextStep };
}

export type SiteCreationState = {
  step: SiteCreationStep;
  siteData: Partial<SiteDraft>;
  saveLoadingState: "idle" | "loading" | "success" | "error";
};

const siteCreationStepsConfig = {
  SITE_TYPE: staticNextStep("ADDRESS"),
  ADDRESS: staticNextStep("SOILS_INTRODUCTION"),
  SOILS_INTRODUCTION: staticNextStep("SURFACE_AREA"),
  SURFACE_AREA: staticNextStep("SOILS_SELECTION"),
  SOILS_SELECTION: staticNextStep("SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE"),
  SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE: {
    getNextStep: (siteData: Partial<SiteDraft>) => {
      return siteData.soilsDistributionEntryMode === "default_even_split"
        ? "SOILS_SUMMARY"
        : "SOILS_SURFACE_AREAS_DISTRIBUTION";
    },
  },
  SOILS_SURFACE_AREAS_DISTRIBUTION: staticNextStep("SOILS_SUMMARY"),
  SOILS_SUMMARY: staticNextStep("SOILS_CARBON_STORAGE"),
  SOILS_CARBON_STORAGE: {
    getNextStep: (siteData: SiteCreationState["siteData"]) => {
      return siteData.isFriche ? "SOILS_CONTAMINATION" : "MANAGEMENT_INTRODUCTION";
    },
  },
  SOILS_CONTAMINATION: staticNextStep("MANAGEMENT_INTRODUCTION"),
  MANAGEMENT_INTRODUCTION: staticNextStep("OWNER"),
  OWNER: staticNextStep("TENANT"),
  TENANT: staticNextStep("FULL_TIME_JOBS_INVOLVED"),
  FULL_TIME_JOBS_INVOLVED: {
    getNextStep: (siteData: SiteCreationState["siteData"]) => {
      return siteData.isFriche ? "FRICHE_RECENT_ACCIDENTS" : "YEARLY_EXPENSES";
    },
  },
  FRICHE_RECENT_ACCIDENTS: staticNextStep("YEARLY_EXPENSES"),
  YEARLY_EXPENSES: staticNextStep("YEARLY_EXPENSES_SUMMARY"),
  YEARLY_EXPENSES_SUMMARY: {
    getNextStep: (siteData: SiteCreationState["siteData"]) => {
      return siteData.isFriche ? "FRICHE_ACTIVITY" : "YEARLY_INCOME";
    },
  },
  YEARLY_INCOME: staticNextStep("NAMING"),
  FRICHE_ACTIVITY: staticNextStep("NAMING"),
  NAMING: staticNextStep("FINAL_SUMMARY"),
  FINAL_SUMMARY: staticNextStep("CREATION_CONFIRMATION"),
} as const;

export const getInitialState = (): SiteCreationState => {
  return {
    step: "SITE_TYPE",
    saveLoadingState: "idle",
    siteData: {
      id: uuid(),
      soils: [],
      yearlyExpenses: [],
      yearlyIncomes: [],
    },
  };
};

export const siteCreationSlice = createSlice({
  name: "siteCreation",
  initialState: getInitialState(),
  reducers: {
    resetState: () => {
      return getInitialState();
    },
    completeSiteTypeStep: (state, action: PayloadAction<{ isFriche: boolean }>) => {
      state.siteData.isFriche = action.payload.isFriche;
      state.step = siteCreationStepsConfig["SITE_TYPE"].getNextStep();
    },
    completeAddressStep: (state, action: PayloadAction<{ address: Address }>) => {
      state.siteData.address = action.payload.address;
      state.step = siteCreationStepsConfig["ADDRESS"].getNextStep();
    },
    completeSoilsIntroduction: (state) => {
      state.step = siteCreationStepsConfig["SOILS_INTRODUCTION"].getNextStep();
    },
    completeSiteSurfaceArea: (state, action: PayloadAction<{ surfaceArea: number }>) => {
      state.siteData.surfaceArea = action.payload.surfaceArea;
      state.step = siteCreationStepsConfig["SURFACE_AREA"].getNextStep();
    },
    completeSoils: (state, action: PayloadAction<{ soils: SoilType[] }>) => {
      state.siteData.soils = action.payload.soils;
      state.step = siteCreationStepsConfig["SOILS_SELECTION"].getNextStep();
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
        const soilsDistribution: SoilsSurfaceAreaDistribution = {};
        soils.forEach((soilType, index) => {
          soilsDistribution[soilType] = surfaceSplit[index];
        });
        state.siteData.soilsDistribution = soilsDistribution;
      }

      state.siteData.soilsDistributionEntryMode = action.payload;
      state.step = siteCreationStepsConfig[
        "SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE"
      ].getNextStep(state.siteData);
    },
    completeSoilsDistribution: (
      state,
      action: PayloadAction<{ distribution: SoilsSurfaceAreaDistribution }>,
    ) => {
      state.siteData.soilsDistribution = action.payload.distribution;
      state.step = siteCreationStepsConfig["SOILS_SURFACE_AREAS_DISTRIBUTION"].getNextStep();
    },
    completeSoilsSummary: (state) => {
      state.step = siteCreationStepsConfig["SOILS_SUMMARY"].getNextStep();
    },
    completeSoilsCarbonStorage: (state) => {
      state.step = siteCreationStepsConfig["SOILS_CARBON_STORAGE"].getNextStep(state.siteData);
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

      state.step = siteCreationStepsConfig["SOILS_CONTAMINATION"].getNextStep();
    },
    completeManagementIntroduction: (state) => {
      state.step = siteCreationStepsConfig["MANAGEMENT_INTRODUCTION"].getNextStep();
    },
    completeOwner: (state, action: PayloadAction<{ owner: Owner }>) => {
      state.siteData.owner = action.payload.owner;
      state.step = siteCreationStepsConfig["OWNER"].getNextStep();
    },
    completeTenant: (state, action: PayloadAction<{ tenant: Tenant | undefined }>) => {
      state.siteData.tenant = action.payload.tenant;
      state.step = siteCreationStepsConfig["TENANT"].getNextStep();
    },
    completeFullTimeJobsInvolved: (state, action: PayloadAction<{ jobs?: number }>) => {
      if (action.payload.jobs) {
        state.siteData.fullTimeJobsInvolved = action.payload.jobs;
      }
      state.step = siteCreationStepsConfig["FULL_TIME_JOBS_INVOLVED"].getNextStep(state.siteData);
    },
    completeFricheRecentAccidents: (
      state,
      action: PayloadAction<
        | {
            hasRecentAccidents: false;
          }
        | {
            hasRecentAccidents: true;
            minorInjuriesPersons?: number;
            severeInjuriesPersons?: number;
            deaths?: number;
          }
      >,
    ) => {
      const { hasRecentAccidents } = action.payload;
      state.siteData.hasRecentAccidents = action.payload.hasRecentAccidents;

      if (hasRecentAccidents) {
        state.siteData.minorInjuriesPersons = action.payload.minorInjuriesPersons ?? 0;
        state.siteData.severeInjuriesPersons = action.payload.severeInjuriesPersons ?? 0;
        state.siteData.deaths = action.payload.deaths ?? 0;
      }

      state.step = siteCreationStepsConfig["FRICHE_RECENT_ACCIDENTS"].getNextStep();
    },
    completeYearlyExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.siteData.yearlyExpenses = action.payload;
      state.step = siteCreationStepsConfig["YEARLY_EXPENSES"].getNextStep();
    },
    completeYearlyExpensesSummary: (state) => {
      state.step = siteCreationStepsConfig["YEARLY_EXPENSES_SUMMARY"].getNextStep(state.siteData);
    },
    completeYearlyIncome: (state, action: PayloadAction<Income[]>) => {
      state.siteData.yearlyIncomes = action.payload;
      state.step = siteCreationStepsConfig["YEARLY_INCOME"].getNextStep();
    },
    completeFricheActivity: (state, action: PayloadAction<FricheActivity>) => {
      state.siteData.fricheActivity = action.payload;
      state.step = siteCreationStepsConfig["FRICHE_ACTIVITY"].getNextStep();
    },
    completeNaming: (state, action: PayloadAction<{ name: string; description?: string }>) => {
      state.siteData.name = action.payload.name;
      if (action.payload.description) state.siteData.description = action.payload.description;

      state.step = siteCreationStepsConfig["NAMING"].getNextStep();
    },
    completeSummary: (state) => {
      state.step = siteCreationStepsConfig["FINAL_SUMMARY"].getNextStep();
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
  },
});

export const {
  resetState,
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
  completeTenant,
  completeFricheRecentAccidents,
  completeYearlyExpenses,
  completeYearlyExpensesSummary,
  completeYearlyIncome,
  completeFricheActivity,
  completeNaming,
  completeSummary,
} = siteCreationSlice.actions;

export default siteCreationSlice.reducer;
