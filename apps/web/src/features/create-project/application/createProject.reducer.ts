import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import { fetchRelatedSite } from "./fetchRelatedSite.action";
import { saveReconversionProject, Schedule } from "./saveReconversionProject.action";

import { RootState } from "@/app/application/store";
import {
  DevelopmentPlanCategory,
  PhotovoltaicKeyParameter,
  ProjectSite,
  ReconversionProjectCreationData,
  RenewableEnergyDevelopmentPlanType,
} from "@/features/create-project/domain/project.types";

type LoadingState = "idle" | "loading" | "success" | "error";

export type ProjectCreationState = {
  stepsHistory: ProjectCreationStep[];
  projectData: Partial<ReconversionProjectCreationData>;
  siteData?: ProjectSite;
  siteDataLoadingState: LoadingState;
  saveProjectLoadingState: LoadingState;
};

export type ProjectCreationStep =
  | "PROJECT_TYPES"
  | "RENEWABLE_ENERGY_TYPES"
  | "PHOTOVOLTAIC_KEY_PARAMETER"
  | "PHOTOVOLTAIC_POWER"
  | "PHOTOVOLTAIC_SURFACE"
  | "PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION"
  | "PHOTOVOLTAIC_CONTRACT_DURATION"
  | "SOILS_SURFACE_AREAS"
  | "SOILS_SUMMARY"
  | "SOILS_CARBON_STORAGE"
  | "STAKEHOLDERS_INTRODUCTION"
  | "STAKEHOLDERS_FUTURE_OPERATOR"
  | "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"
  | "STAKEHOLDERS_RECONVERSION_FULL_TIME_JOBS"
  | "STAKEHOLDERS_OPERATIONS_FULL_TIMES_JOBS"
  | "STAKEHOLDERS_FUTURE_SITE_OWNER"
  | "STAKEHOLDERS_HAS_REAL_ESTATE_TRANSACTION"
  | "COSTS_INTRODUCTION"
  | "COSTS_REAL_ESTATE_TRANSACTION_AMOUNT"
  | "COSTS_REINSTATEMENT"
  | "COSTS_PHOTOVOLTAIC_PANELS_INSTALLATION"
  | "COSTS_PROJECTED_YEARLY_COSTS"
  | "REVENUE_INTRODUCTION"
  | "REVENUE_PROJECTED_YEARLY_REVENUE"
  | "REVENUE_FINANCIAL_ASSISTANCE"
  | "SCHEDULE_INTRODUCTION"
  | "SCHEDULE_PROJECTION"
  | "NAMING"
  | "FINAL_SUMMARY"
  | "CREATION_CONFIRMATION";

export const getInitialState = (): ProjectCreationState => {
  return {
    stepsHistory: ["PROJECT_TYPES"],
    projectData: {
      id: uuid(),
      yearlyProjectedCosts: [],
      yearlyProjectedRevenues: [],
      developmentPlanCategories: [],
      renewableEnergyTypes: [],
    },
    siteData: undefined,
    siteDataLoadingState: "idle",
    saveProjectLoadingState: "idle",
  };
};

type ScheduleStrings = {
  startDate: string;
  endDate: string;
};

const scheduleStringToDates = (scheduleStrings: {
  startDate: string;
  endDate: string;
}): Schedule => {
  return {
    startDate: new Date(scheduleStrings.startDate),
    endDate: new Date(scheduleStrings.endDate),
  };
};

export const projectCreationSlice = createSlice({
  name: "projectCreation",
  initialState: getInitialState(),
  reducers: {
    resetState: () => {
      return getInitialState();
    },
    completeDevelopmentPlanCategories: (
      state,
      action: PayloadAction<DevelopmentPlanCategory[]>,
    ) => {
      state.projectData.developmentPlanCategories = action.payload;
      state.stepsHistory.push("RENEWABLE_ENERGY_TYPES");
    },
    completeRenewableEnergyDevelopmentPlanType: (
      state,
      action: PayloadAction<RenewableEnergyDevelopmentPlanType[]>,
    ) => {
      state.projectData.renewableEnergyTypes = action.payload;
      state.stepsHistory.push("PHOTOVOLTAIC_KEY_PARAMETER");
    },
    completeStakeholdersIntroductionStep: (state) => {
      state.stepsHistory.push("STAKEHOLDERS_FUTURE_OPERATOR");
    },
    completeFutureOperator: (
      state,
      action: PayloadAction<ReconversionProjectCreationData["futureOperator"]>,
    ) => {
      state.projectData.futureOperator = action.payload;
      const nextStep = state.siteData?.isFriche
        ? "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"
        : "STAKEHOLDERS_OPERATIONS_FULL_TIMES_JOBS";
      state.stepsHistory.push(nextStep);
    },
    completeConversionFullTimeJobsInvolved: (
      state,
      action: PayloadAction<{
        reinstatementFullTimeJobs?: number;
        fullTimeJobs?: number;
      }>,
    ) => {
      const { fullTimeJobs, reinstatementFullTimeJobs } = action.payload;
      if (fullTimeJobs) {
        state.projectData.conversionFullTimeJobsInvolved = fullTimeJobs;
      }
      if (reinstatementFullTimeJobs !== undefined) {
        state.projectData.reinstatementFullTimeJobsInvolved = reinstatementFullTimeJobs;
      }
      state.stepsHistory.push("STAKEHOLDERS_OPERATIONS_FULL_TIMES_JOBS");
    },
    completeOperationsFullTimeJobsInvolved: (state, action: PayloadAction<number | undefined>) => {
      state.projectData.operationsFullTimeJobsInvolved = action.payload;
      state.stepsHistory.push("STAKEHOLDERS_HAS_REAL_ESTATE_TRANSACTION");
    },
    completeReinstatementContractOwner: (
      state,
      action: PayloadAction<ReconversionProjectCreationData["reinstatementContractOwner"]>,
    ) => {
      state.projectData.reinstatementContractOwner = action.payload;
      state.stepsHistory.push("STAKEHOLDERS_RECONVERSION_FULL_TIME_JOBS");
    },
    completeHasRealEstateTransaction: (state, action: PayloadAction<boolean>) => {
      const hasRealEstateTransaction = action.payload;
      state.projectData.hasRealEstateTransaction = hasRealEstateTransaction;
      const nextStep = hasRealEstateTransaction
        ? "STAKEHOLDERS_FUTURE_SITE_OWNER"
        : "COSTS_INTRODUCTION";
      state.stepsHistory.push(nextStep);
    },
    completeFutureSiteOwner: (
      state,
      action: PayloadAction<ReconversionProjectCreationData["futureSiteOwner"]>,
    ) => {
      state.projectData.futureSiteOwner = action.payload;
      state.stepsHistory.push("COSTS_INTRODUCTION");
    },
    completeCostsIntroductionStep: (state) => {
      if (state.projectData.hasRealEstateTransaction) {
        state.stepsHistory.push("COSTS_REAL_ESTATE_TRANSACTION_AMOUNT");
        return;
      }
      if (state.siteData?.isFriche) {
        state.stepsHistory.push("COSTS_REINSTATEMENT");
        return;
      }
      state.stepsHistory.push("COSTS_PHOTOVOLTAIC_PANELS_INSTALLATION");
    },
    completeRealEstateTransactionCost: (state, action: PayloadAction<number>) => {
      state.projectData.realEstateTransactionCost = action.payload;
      state.stepsHistory.push("COSTS_PHOTOVOLTAIC_PANELS_INSTALLATION");
    },
    completeReinstatementCost: (state, action: PayloadAction<number>) => {
      state.projectData.reinstatementCost = action.payload;
      state.stepsHistory.push("COSTS_PHOTOVOLTAIC_PANELS_INSTALLATION");
    },
    completePhotovoltaicPanelsInstallationCost: (state, action: PayloadAction<number>) => {
      state.projectData.photovoltaicPanelsInstallationCost = action.payload;
      state.stepsHistory.push("COSTS_PROJECTED_YEARLY_COSTS");
    },
    completeYearlyProjectedCosts: (
      state,
      action: PayloadAction<ReconversionProjectCreationData["yearlyProjectedCosts"]>,
    ) => {
      state.projectData.yearlyProjectedCosts = action.payload;
      state.stepsHistory.push("REVENUE_INTRODUCTION");
    },
    completeRevenuIntroductionStep: (state) => {
      state.stepsHistory.push("REVENUE_PROJECTED_YEARLY_REVENUE");
    },
    completeReinstatementFinancialAssistance: (state, action: PayloadAction<number>) => {
      state.projectData.reinstatementFinancialAssistanceAmount = action.payload;
      state.stepsHistory.push("SCHEDULE_INTRODUCTION");
    },
    completeYearlyProjectedRevenue: (
      state,
      action: PayloadAction<ReconversionProjectCreationData["yearlyProjectedRevenues"]>,
    ) => {
      state.projectData.yearlyProjectedRevenues = action.payload;
      state.stepsHistory.push("REVENUE_FINANCIAL_ASSISTANCE");
    },
    completeNaming: (state, action: PayloadAction<{ name: string; description?: string }>) => {
      const { name, description } = action.payload;
      state.projectData.name = name;
      if (description) state.projectData.description = description;

      state.stepsHistory.push("FINAL_SUMMARY");
    },
    completeFinalSummaryStep: (state) => {
      state.stepsHistory.push("CREATION_CONFIRMATION");
    },
    completePhotovoltaicKeyParameter: (state, action: PayloadAction<PhotovoltaicKeyParameter>) => {
      state.projectData.photovoltaicKeyParameter = action.payload;

      const nextStep =
        action.payload === PhotovoltaicKeyParameter.POWER
          ? "PHOTOVOLTAIC_POWER"
          : "PHOTOVOLTAIC_SURFACE";
      state.stepsHistory.push(nextStep);
    },
    completePhotovoltaicInstallationElectricalPower: (state, action: PayloadAction<number>) => {
      state.projectData.photovoltaicInstallationElectricalPowerKWc = action.payload;
      const nextStep =
        state.projectData.photovoltaicKeyParameter === PhotovoltaicKeyParameter.POWER
          ? "PHOTOVOLTAIC_SURFACE"
          : "PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION";
      state.stepsHistory.push(nextStep);
    },
    completePhotovoltaicInstallationSurface: (state, action: PayloadAction<number>) => {
      state.projectData.photovoltaicInstallationSurfaceSquareMeters = action.payload;
      const nextStep =
        state.projectData.photovoltaicKeyParameter === PhotovoltaicKeyParameter.POWER
          ? "PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION"
          : "PHOTOVOLTAIC_POWER";
      state.stepsHistory.push(nextStep);
    },
    completePhotovoltaicExpectedAnnualProduction: (state, action: PayloadAction<number>) => {
      state.projectData.photovoltaicExpectedAnnualProduction = action.payload;
      state.stepsHistory.push("PHOTOVOLTAIC_CONTRACT_DURATION");
    },
    completePhotovoltaicContractDuration: (state, action: PayloadAction<number>) => {
      state.projectData.photovoltaicContractDuration = action.payload;
      state.stepsHistory.push("SOILS_SURFACE_AREAS");
    },
    completeSoilsDistribution: (
      state,
      action: PayloadAction<ReconversionProjectCreationData["soilsDistribution"]>,
    ) => {
      state.projectData.soilsDistribution = action.payload;
      state.stepsHistory.push("SOILS_SUMMARY");
    },
    completeSoilsSummaryStep: (state) => {
      state.stepsHistory.push("SOILS_CARBON_STORAGE");
    },
    completeSoilsCarbonStorageStep: (state) => {
      state.stepsHistory.push("STAKEHOLDERS_INTRODUCTION");
    },
    completeScheduleIntroductionStep: (state) => {
      state.stepsHistory.push("SCHEDULE_PROJECTION");
    },
    completeScheduleStep: (
      state,
      action: PayloadAction<{
        firstYearOfOperation: number;
        photovoltaicInstallationSchedule?: ScheduleStrings;
        reinstatementSchedule?: ScheduleStrings;
      }>,
    ) => {
      const { firstYearOfOperation, photovoltaicInstallationSchedule, reinstatementSchedule } =
        action.payload;
      if (firstYearOfOperation) state.projectData.firstYearOfOperation = firstYearOfOperation;
      if (reinstatementSchedule)
        state.projectData.reinstatementSchedule = scheduleStringToDates(reinstatementSchedule);
      if (photovoltaicInstallationSchedule)
        state.projectData.photovoltaicInstallationSchedule = scheduleStringToDates(
          photovoltaicInstallationSchedule,
        );
      state.stepsHistory.push("NAMING");
    },
    revertStep: (
      state,
      action: PayloadAction<{ resetFields: (keyof ReconversionProjectCreationData)[] } | undefined>,
    ) => {
      const { projectData: initialData } = getInitialState();

      if (action.payload) {
        action.payload.resetFields.forEach(
          <K extends keyof ReconversionProjectCreationData>(field: K) => {
            state.projectData[field] =
              field in initialData
                ? (initialData[field] as ReconversionProjectCreationData[K])
                : undefined;
          },
        );
      }

      if (state.stepsHistory.length > 1) {
        state.stepsHistory = state.stepsHistory.slice(0, -1);
      }
    },
  },
  extraReducers(builder) {
    /* fetch related site */
    builder.addCase(fetchRelatedSite.pending, (state) => {
      state.siteDataLoadingState = "loading";
    });
    builder.addCase(fetchRelatedSite.fulfilled, (state, action) => {
      state.siteDataLoadingState = "success";
      state.siteData = action.payload;
    });
    builder.addCase(fetchRelatedSite.rejected, (state) => {
      state.siteDataLoadingState = "error";
    });
    /* save project */
    builder.addCase(saveReconversionProject.pending, (state) => {
      state.saveProjectLoadingState = "loading";
    });
    builder.addCase(saveReconversionProject.fulfilled, (state) => {
      state.saveProjectLoadingState = "success";
      state.stepsHistory.push("CREATION_CONFIRMATION");
    });
    builder.addCase(saveReconversionProject.rejected, (state) => {
      state.saveProjectLoadingState = "error";
      state.stepsHistory.push("CREATION_CONFIRMATION");
    });
  },
});

export const selectCurrentStep = createSelector(
  [(state: RootState) => state.projectCreation],
  (state): ProjectCreationStep => {
    return state.stepsHistory.at(-1) ?? "PROJECT_TYPES";
  },
);

const { revertStep } = projectCreationSlice.actions;
export const revertDevelopmentPlanCategories = () =>
  revertStep({ resetFields: ["developmentPlanCategories"] });
export const revertRenewableEnergyDevelopmentPlanType = () =>
  revertStep({ resetFields: ["renewableEnergyTypes"] });
export const revertStakeholdersIntroductionStep = () => revertStep({ resetFields: [] });
export const revertFutureOperator = () => revertStep({ resetFields: ["futureOperator"] });
export const revertConversionFullTimeJobsInvolved = () =>
  revertStep({
    resetFields: ["reinstatementFullTimeJobsInvolved", "conversionFullTimeJobsInvolved"],
  });
export const revertOperationsFullTimeJobsInvolved = () =>
  revertStep({ resetFields: ["operationsFullTimeJobsInvolved"] });
export const revertReinstatementContractOwner = () =>
  revertStep({ resetFields: ["reinstatementContractOwner"] });
export const revertHasRealEstateTransaction = () =>
  revertStep({ resetFields: ["hasRealEstateTransaction"] });
export const revertFutureSiteOwner = () => revertStep({ resetFields: ["futureSiteOwner"] });
export const revertCostsIntroductionStep = () => revertStep();
export const revertRealEstateTransactionCost = () =>
  revertStep({ resetFields: ["realEstateTransactionCost"] });
export const revertReinstatementCost = () => revertStep({ resetFields: ["reinstatementCost"] });
export const revertPhotovoltaicPanelsInstallationCost = () =>
  revertStep({ resetFields: ["photovoltaicPanelsInstallationCost"] });
export const revertYearlyProjectedCosts = () =>
  revertStep({ resetFields: ["yearlyProjectedCosts"] });
export const revertRevenuIntroductionStep = () => revertStep();
export const revertReinstatementFinancialAssistance = () =>
  revertStep({ resetFields: ["reinstatementFinancialAssistanceAmount"] });
export const revertYearlyProjectedRevenue = () =>
  revertStep({ resetFields: ["yearlyProjectedRevenues"] });
export const revertNaming = () => revertStep({ resetFields: ["name", "description"] });
export const revertPhotovoltaicKeyParameter = () =>
  revertStep({ resetFields: ["photovoltaicKeyParameter"] });
export const revertPhotovoltaicInstallationElectricalPower = () =>
  revertStep({ resetFields: ["photovoltaicInstallationElectricalPowerKWc"] });
export const revertPhotovoltaicInstallationSurface = () =>
  revertStep({ resetFields: ["photovoltaicInstallationSurfaceSquareMeters"] });
export const revertPhotovoltaicExpectedAnnualProduction = () =>
  revertStep({ resetFields: ["photovoltaicExpectedAnnualProduction"] });
export const revertPhotovoltaicContractDuration = () =>
  revertStep({ resetFields: ["photovoltaicContractDuration"] });
export const revertSoilsDistribution = () => revertStep({ resetFields: ["soilsDistribution"] });
export const revertSoilsSummaryStep = () => revertStep();
export const revertSoilsCarbonStorageStep = () => revertStep();
export const revertScheduleIntroductionStep = () => revertStep();
export const revertScheduleStep = () =>
  revertStep({
    resetFields: [
      "firstYearOfOperation",
      "reinstatementSchedule",
      "photovoltaicInstallationSchedule",
    ],
  });
export const revertFinalSummaryStep = () => revertStep();

export const {
  resetState,
  completeDevelopmentPlanCategories,
  completeRenewableEnergyDevelopmentPlanType,
  completeStakeholdersIntroductionStep,
  completeFutureOperator,
  completeReinstatementContractOwner,
  completeConversionFullTimeJobsInvolved,
  completeOperationsFullTimeJobsInvolved,
  completeCostsIntroductionStep,
  completeReinstatementCost,
  completeRevenuIntroductionStep,
  completePhotovoltaicPanelsInstallationCost,
  completeYearlyProjectedCosts,
  completeReinstatementFinancialAssistance,
  completeYearlyProjectedRevenue,
  completeNaming,
  completePhotovoltaicKeyParameter,
  completePhotovoltaicInstallationElectricalPower,
  completePhotovoltaicInstallationSurface,
  completePhotovoltaicExpectedAnnualProduction,
  completePhotovoltaicContractDuration,
  completeSoilsSummaryStep,
  completeSoilsCarbonStorageStep,
  completeSoilsDistribution,
  completeScheduleIntroductionStep,
  completeScheduleStep,
  completeHasRealEstateTransaction,
  completeFutureSiteOwner,
  completeRealEstateTransactionCost,
} = projectCreationSlice.actions;

export default projectCreationSlice.reducer;
