import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import { saveSiteAction } from "./createSite.actions";

import { RootState } from "@/app/application/store";
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
  stepsHistory: SiteCreationStep[];
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
    stepsHistory: ["SITE_TYPE"],
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
      state.stepsHistory.push(siteCreationStepsConfig["SITE_TYPE"].getNextStep());
    },
    completeAddressStep: (state, action: PayloadAction<{ address: Address }>) => {
      state.siteData.address = action.payload.address;
      state.stepsHistory.push(siteCreationStepsConfig["ADDRESS"].getNextStep());
    },
    completeSoilsIntroduction: (state) => {
      state.stepsHistory.push(siteCreationStepsConfig["SOILS_INTRODUCTION"].getNextStep());
    },
    completeSiteSurfaceArea: (state, action: PayloadAction<{ surfaceArea: number }>) => {
      state.siteData.surfaceArea = action.payload.surfaceArea;
      state.stepsHistory.push(siteCreationStepsConfig["SURFACE_AREA"].getNextStep());
    },
    completeSoils: (state, action: PayloadAction<{ soils: SoilType[] }>) => {
      state.siteData.soils = action.payload.soils;
      state.stepsHistory.push(siteCreationStepsConfig["SOILS_SELECTION"].getNextStep());
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
      state.stepsHistory.push(
        siteCreationStepsConfig["SOILS_SURFACE_AREAS_DISTRIBUTION_ENTRY_MODE"].getNextStep(
          state.siteData,
        ),
      );
    },
    completeSoilsDistribution: (
      state,
      action: PayloadAction<{ distribution: SoilsSurfaceAreaDistribution }>,
    ) => {
      state.siteData.soilsDistribution = action.payload.distribution;
      state.stepsHistory.push(
        siteCreationStepsConfig["SOILS_SURFACE_AREAS_DISTRIBUTION"].getNextStep(),
      );
    },
    completeSoilsSummary: (state) => {
      state.stepsHistory.push(siteCreationStepsConfig["SOILS_SUMMARY"].getNextStep());
    },
    completeSoilsCarbonStorage: (state) => {
      state.stepsHistory.push(
        siteCreationStepsConfig["SOILS_CARBON_STORAGE"].getNextStep(state.siteData),
      );
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

      state.stepsHistory.push(siteCreationStepsConfig["SOILS_CONTAMINATION"].getNextStep());
    },
    completeManagementIntroduction: (state) => {
      state.stepsHistory.push(siteCreationStepsConfig["MANAGEMENT_INTRODUCTION"].getNextStep());
    },
    completeOwner: (state, action: PayloadAction<{ owner: Owner }>) => {
      state.siteData.owner = action.payload.owner;
      state.stepsHistory.push(siteCreationStepsConfig["OWNER"].getNextStep());
    },
    completeTenant: (state, action: PayloadAction<{ tenant: Tenant | undefined }>) => {
      state.siteData.tenant = action.payload.tenant;
      state.stepsHistory.push(siteCreationStepsConfig["TENANT"].getNextStep());
    },
    completeFullTimeJobsInvolved: (state, action: PayloadAction<{ jobs?: number }>) => {
      if (action.payload.jobs) {
        state.siteData.fullTimeJobsInvolved = action.payload.jobs;
      }
      state.stepsHistory.push(
        siteCreationStepsConfig["FULL_TIME_JOBS_INVOLVED"].getNextStep(state.siteData),
      );
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

      state.stepsHistory.push(siteCreationStepsConfig["FRICHE_RECENT_ACCIDENTS"].getNextStep());
    },
    completeYearlyExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.siteData.yearlyExpenses = action.payload;
      state.stepsHistory.push(siteCreationStepsConfig["YEARLY_EXPENSES"].getNextStep());
    },
    completeYearlyExpensesSummary: (state) => {
      state.stepsHistory.push(
        siteCreationStepsConfig["YEARLY_EXPENSES_SUMMARY"].getNextStep(state.siteData),
      );
    },
    completeYearlyIncome: (state, action: PayloadAction<Income[]>) => {
      state.siteData.yearlyIncomes = action.payload;
      state.stepsHistory.push(siteCreationStepsConfig["YEARLY_INCOME"].getNextStep());
    },
    completeFricheActivity: (state, action: PayloadAction<FricheActivity>) => {
      state.siteData.fricheActivity = action.payload;
      state.stepsHistory.push(siteCreationStepsConfig["FRICHE_ACTIVITY"].getNextStep());
    },
    completeNaming: (state, action: PayloadAction<{ name: string; description?: string }>) => {
      state.siteData.name = action.payload.name;
      if (action.payload.description) state.siteData.description = action.payload.description;

      state.stepsHistory.push(siteCreationStepsConfig["NAMING"].getNextStep());
    },
    completeSummary: (state) => {
      state.stepsHistory.push(siteCreationStepsConfig["FINAL_SUMMARY"].getNextStep());
    },
    revertStep: (
      state,
      action: PayloadAction<{ resetFields: (keyof SiteDraft)[] } | undefined>,
    ) => {
      const { siteData: initialSiteData } = getInitialState();

      if (action.payload) {
        action.payload.resetFields.forEach((field) => {
          // @ts-expect-error to fix
          state.siteData[field] = initialSiteData[field] ?? undefined;
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
  revertStep,
} = siteCreationSlice.actions;

export default siteCreationSlice.reducer;
