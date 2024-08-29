import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import reduceReducers from "reduce-reducers";
import {
  DevelopmentPlanCategory,
  FinancialAssistanceRevenue,
  PhotovoltaicInstallationExpense,
  ProjectPhase,
  ReinstatementExpense,
  SoilsDistribution,
  SoilType,
  stripEmptySurfaces,
} from "shared";
import { v4 as uuid } from "uuid";
import {
  getRecommendedPhotovoltaicPanelsAccessPathSurfaceArea,
  getRecommendedPhotovoltaicPanelsFoundationsSurfaceArea,
} from "../domain/photovoltaic";
import {
  canSiteAccomodatePhotovoltaicPanels,
  hasSiteSignificantBiodiversityAndClimateSensibleSoils,
  preserveCurrentSoils,
  SoilsTransformationProject,
  transformNonSuitableSoils,
  transformSoilsForRenaturation,
} from "../domain/soilsTransformation";
import { createModeStepReverted } from "./mixed-use-neighbourhood/mixedUseNeighbourhoodProject.actions";
import mixedUseNeighbourhoodReducer, {
  MixedUseNeighbourhoodState,
} from "./mixed-use-neighbourhood/mixedUseNeighbourhoodProject.reducer";
import { fetchRelatedSite } from "./fetchRelatedSite.action";
import { saveReconversionProject } from "./saveReconversionProject.action";

import { RootState } from "@/app/application/store";
import {
  PhotovoltaicKeyParameter,
  ProjectSite,
  ReconversionProjectCreationData,
} from "@/features/create-project/domain/project.types";
import { RenewableEnergyDevelopmentPlanType } from "@/shared/domain/reconversionProject";
import { WorksSchedule } from "@/shared/domain/reconversionProject";

type LoadingState = "idle" | "loading" | "success" | "error";

export type ProjectCreationState = {
  stepsHistory: ProjectCreationStep[];
  projectData: Partial<ReconversionProjectCreationData>;
  siteData?: ProjectSite;
  siteDataLoadingState: LoadingState;
  saveProjectLoadingState: LoadingState;
  mixedUseNeighbourhood: MixedUseNeighbourhoodState;
};

export type ProjectCreationStep =
  | "PROJECT_TYPES"
  | "RENEWABLE_ENERGY_TYPES"
  | "PHOTOVOLTAIC_KEY_PARAMETER"
  | "PHOTOVOLTAIC_POWER"
  | "PHOTOVOLTAIC_SURFACE"
  | "PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION"
  | "PHOTOVOLTAIC_CONTRACT_DURATION"
  | "SOILS_TRANSFORMATION_INTRODUCTION"
  | "NON_SUITABLE_SOILS_NOTICE"
  | "NON_SUITABLE_SOILS_SELECTION"
  | "NON_SUITABLE_SOILS_SURFACE"
  | "SOILS_TRANSFORMATION_PROJECT_SELECTION"
  | "SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION"
  | "SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION"
  | "SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE"
  | "SOILS_SUMMARY"
  | "SOILS_CARBON_STORAGE"
  | "STAKEHOLDERS_INTRODUCTION"
  | "STAKEHOLDERS_PROJECT_DEVELOPER"
  | "STAKEHOLDERS_FUTURE_OPERATOR"
  | "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"
  | "STAKEHOLDERS_FUTURE_SITE_OWNER"
  | "STAKEHOLDERS_SITE_PURCHASE"
  | "RECONVERSION_FULL_TIME_JOBS"
  | "OPERATIONS_FULL_TIMES_JOBS"
  | "EXPENSES_INTRODUCTION"
  | "EXPENSES_SITE_PURCHASE_AMOUNTS"
  | "EXPENSES_REINSTATEMENT"
  | "EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION"
  | "EXPENSES_PROJECTED_YEARLY_EXPENSES"
  | "REVENUE_INTRODUCTION"
  | "REVENUE_PROJECTED_YEARLY_REVENUE"
  | "REVENUE_FINANCIAL_ASSISTANCE"
  | "SCHEDULE_INTRODUCTION"
  | "SCHEDULE_PROJECTION"
  | "NAMING"
  | "PROJECT_PHASE"
  | "FINAL_SUMMARY"
  | "CREATION_RESULT";

export const getInitialState = (): ProjectCreationState => {
  return {
    stepsHistory: ["PROJECT_TYPES"],
    projectData: {
      id: uuid(),
      yearlyProjectedExpenses: [],
      yearlyProjectedRevenues: [],
    },
    siteData: undefined,
    siteDataLoadingState: "idle",
    saveProjectLoadingState: "idle",
    mixedUseNeighbourhood: {
      createMode: undefined,
      saveState: "idle",
      stepsHistory: ["CREATE_MODE_SELECTION"],
    },
  };
};

export const projectCreationSlice = createSlice({
  name: "projectCreation",
  initialState: getInitialState(),
  reducers: {
    resetState: () => {
      return getInitialState();
    },
    completeDevelopmentPlanCategories: (state, action: PayloadAction<DevelopmentPlanCategory>) => {
      state.projectData.developmentPlanCategory = action.payload;
      if (action.payload === "RENEWABLE_ENERGY") state.stepsHistory.push("RENEWABLE_ENERGY_TYPES");
    },
    completeRenewableEnergyDevelopmentPlanType: (
      state,
      action: PayloadAction<RenewableEnergyDevelopmentPlanType>,
    ) => {
      state.projectData.renewableEnergyType = action.payload;
      state.stepsHistory.push("PHOTOVOLTAIC_KEY_PARAMETER");
    },
    completeSoilsTransformationIntroductionStep: (state) => {
      const nextStep = canSiteAccomodatePhotovoltaicPanels(
        state.siteData?.soilsDistribution ?? {},
        state.projectData.photovoltaicInstallationSurfaceSquareMeters ?? 0,
      )
        ? "SOILS_TRANSFORMATION_PROJECT_SELECTION"
        : "NON_SUITABLE_SOILS_NOTICE";
      state.stepsHistory.push(nextStep);
    },
    completeNonSuitableSoilsNoticeStep: (state) => {
      state.projectData.baseSoilsDistributionForTransformation =
        state.siteData?.soilsDistribution ?? {};
      state.stepsHistory.push("NON_SUITABLE_SOILS_SELECTION");
    },
    completeNonSuitableSoilsSelectionStep: (state, action: PayloadAction<SoilType[]>) => {
      state.projectData.nonSuitableSoilsToTransform = action.payload;
      state.stepsHistory.push("NON_SUITABLE_SOILS_SURFACE");
    },
    completeNonSuitableSoilsSurfaceStep: (state, action: PayloadAction<SoilsDistribution>) => {
      state.projectData.baseSoilsDistributionForTransformation = transformNonSuitableSoils(
        state.siteData?.soilsDistribution ?? {},
        action.payload,
      );

      state.stepsHistory.push("SOILS_TRANSFORMATION_PROJECT_SELECTION");
    },
    completeSoilsTransformationProjectSelectionStep: (
      state,
      action: PayloadAction<SoilsTransformationProject>,
    ) => {
      const transformationProject = action.payload;

      if (transformationProject === "custom") {
        state.stepsHistory.push("SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION");
        return;
      }

      // soils may have been transformed to suit photovaltaic panels installation
      const baseSoilsDistribution: SoilsDistribution =
        state.projectData.baseSoilsDistributionForTransformation ??
        state.siteData?.soilsDistribution ??
        {};

      const recommendedImpermeableSurfaceArea =
        getRecommendedPhotovoltaicPanelsFoundationsSurfaceArea(
          state.projectData.photovoltaicInstallationElectricalPowerKWc ?? 0,
        );
      const recommendedMineralSurfaceArea = getRecommendedPhotovoltaicPanelsAccessPathSurfaceArea(
        state.projectData.photovoltaicInstallationElectricalPowerKWc ?? 0,
      );
      const transformationFn =
        transformationProject === "renaturation"
          ? transformSoilsForRenaturation
          : preserveCurrentSoils;
      state.projectData.soilsDistribution = transformationFn(baseSoilsDistribution, {
        recommendedImpermeableSurfaceArea,
        recommendedMineralSurfaceArea,
      });

      const nextStep = hasSiteSignificantBiodiversityAndClimateSensibleSoils(
        state.siteData?.soilsDistribution ?? {},
      )
        ? "SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE"
        : "SOILS_SUMMARY";
      state.stepsHistory.push(nextStep);
    },
    completeCustomSoilsSelectionStep: (state, action: PayloadAction<SoilType[]>) => {
      state.projectData.futureSoilsSelection = action.payload;
      state.stepsHistory.push("SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION");
    },
    completeCustomSoilsSurfaceAreaAllocationStep: (
      state,
      action: PayloadAction<SoilsDistribution>,
    ) => {
      state.projectData.soilsDistribution = stripEmptySurfaces(action.payload);

      const nextStep = hasSiteSignificantBiodiversityAndClimateSensibleSoils(
        state.siteData?.soilsDistribution ?? {},
      )
        ? "SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE"
        : "SOILS_SUMMARY";
      state.stepsHistory.push(nextStep);
    },
    completeSoilsTransformationClimateAndBiodiversityImpactNoticeStep: (state) => {
      state.stepsHistory.push("SOILS_SUMMARY");
    },
    completeStakeholdersIntroductionStep: (state) => {
      state.stepsHistory.push("STAKEHOLDERS_PROJECT_DEVELOPER");
    },
    completeProjectDeveloper: (
      state,
      action: PayloadAction<ReconversionProjectCreationData["projectDeveloper"]>,
    ) => {
      state.projectData.projectDeveloper = action.payload;
      state.stepsHistory.push("STAKEHOLDERS_FUTURE_OPERATOR");
    },
    completeFutureOperator: (
      state,
      action: PayloadAction<ReconversionProjectCreationData["futureOperator"]>,
    ) => {
      state.projectData.futureOperator = action.payload;
      const nextStep = state.siteData?.isFriche
        ? "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"
        : "STAKEHOLDERS_SITE_PURCHASE";
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
      state.stepsHistory.push("OPERATIONS_FULL_TIMES_JOBS");
    },
    completeOperationsFullTimeJobsInvolved: (state, action: PayloadAction<number | undefined>) => {
      state.projectData.operationsFullTimeJobsInvolved = action.payload;
      state.stepsHistory.push("SCHEDULE_INTRODUCTION");
    },
    completeReinstatementContractOwner: (
      state,
      action: PayloadAction<ReconversionProjectCreationData["reinstatementContractOwner"]>,
    ) => {
      state.projectData.reinstatementContractOwner = action.payload;
      state.stepsHistory.push("STAKEHOLDERS_SITE_PURCHASE");
    },
    completeSitePurchase: (state, action: PayloadAction<boolean>) => {
      const willSiteBePurchased = action.payload;
      state.projectData.willSiteBePurchased = willSiteBePurchased;
      const nextStep = willSiteBePurchased
        ? "STAKEHOLDERS_FUTURE_SITE_OWNER"
        : "EXPENSES_INTRODUCTION";
      state.stepsHistory.push(nextStep);
    },
    completeFutureSiteOwner: (
      state,
      action: PayloadAction<ReconversionProjectCreationData["futureSiteOwner"]>,
    ) => {
      state.projectData.futureSiteOwner = action.payload;
      state.stepsHistory.push("EXPENSES_INTRODUCTION");
    },
    completeExpensesIntroductionStep: (state) => {
      if (state.projectData.willSiteBePurchased) {
        state.stepsHistory.push("EXPENSES_SITE_PURCHASE_AMOUNTS");
        return;
      }
      if (state.siteData?.isFriche) {
        state.stepsHistory.push("EXPENSES_REINSTATEMENT");
        return;
      }
      state.stepsHistory.push("EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION");
    },
    completeSitePurchaseAmounts: (
      state,
      action: PayloadAction<{ sellingPrice: number; propertyTransferDuties?: number }>,
    ) => {
      state.projectData.sitePurchaseSellingPrice = action.payload.sellingPrice;
      if (action.payload.propertyTransferDuties) {
        state.projectData.sitePurchasePropertyTransferDuties =
          action.payload.propertyTransferDuties;
      }
      if (state.siteData?.isFriche) {
        state.stepsHistory.push("EXPENSES_REINSTATEMENT");
        return;
      }
      state.stepsHistory.push("EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION");
    },
    completeReinstatementExpenses: (state, action: PayloadAction<ReinstatementExpense[]>) => {
      state.projectData.reinstatementExpenses = action.payload;
      state.stepsHistory.push("EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION");
    },
    completePhotovoltaicPanelsInstallationExpenses: (
      state,
      action: PayloadAction<PhotovoltaicInstallationExpense[]>,
    ) => {
      state.projectData.photovoltaicPanelsInstallationExpenses = action.payload;
      state.stepsHistory.push("EXPENSES_PROJECTED_YEARLY_EXPENSES");
    },
    completeYearlyProjectedExpenses: (
      state,
      action: PayloadAction<ReconversionProjectCreationData["yearlyProjectedExpenses"]>,
    ) => {
      state.projectData.yearlyProjectedExpenses = action.payload;
      state.stepsHistory.push("REVENUE_INTRODUCTION");
    },
    completeRevenuIntroductionStep: (state) => {
      state.stepsHistory.push("REVENUE_PROJECTED_YEARLY_REVENUE");
    },
    completeFinancialAssistanceRevenues: (
      state,
      action: PayloadAction<FinancialAssistanceRevenue[]>,
    ) => {
      state.projectData.financialAssistanceRevenues = action.payload;
      state.stepsHistory.push(
        state.siteData?.isFriche ? "RECONVERSION_FULL_TIME_JOBS" : "OPERATIONS_FULL_TIMES_JOBS",
      );
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
    completePhotovoltaicKeyParameter: (state, action: PayloadAction<PhotovoltaicKeyParameter>) => {
      state.projectData.photovoltaicKeyParameter = action.payload;

      const nextStep = action.payload === "POWER" ? "PHOTOVOLTAIC_POWER" : "PHOTOVOLTAIC_SURFACE";
      state.stepsHistory.push(nextStep);
    },
    completePhotovoltaicInstallationElectricalPower: (state, action: PayloadAction<number>) => {
      state.projectData.photovoltaicInstallationElectricalPowerKWc = action.payload;
      const nextStep =
        state.projectData.photovoltaicKeyParameter === "POWER"
          ? "PHOTOVOLTAIC_SURFACE"
          : "PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION";
      state.stepsHistory.push(nextStep);
    },
    completePhotovoltaicInstallationSurface: (state, action: PayloadAction<number>) => {
      state.projectData.photovoltaicInstallationSurfaceSquareMeters = action.payload;
      const nextStep =
        state.projectData.photovoltaicKeyParameter === "POWER"
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
      state.stepsHistory.push("SOILS_TRANSFORMATION_INTRODUCTION");
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
        firstYearOfOperation?: number;
        photovoltaicInstallationSchedule?: WorksSchedule;
        reinstatementSchedule?: WorksSchedule;
      }>,
    ) => {
      const { firstYearOfOperation, photovoltaicInstallationSchedule, reinstatementSchedule } =
        action.payload;
      if (firstYearOfOperation) state.projectData.firstYearOfOperation = firstYearOfOperation;
      if (reinstatementSchedule) state.projectData.reinstatementSchedule = reinstatementSchedule;
      if (photovoltaicInstallationSchedule) {
        state.projectData.photovoltaicInstallationSchedule = photovoltaicInstallationSchedule;
      }
      state.stepsHistory.push("PROJECT_PHASE");
    },
    completeProjectPhaseStep: (state, action: PayloadAction<{ phase: ProjectPhase }>) => {
      state.projectData.projectPhase = action.payload.phase;
      state.stepsHistory.push("NAMING");
    },
    revertStep: (
      state,
      action: PayloadAction<{ resetFields: (keyof ReconversionProjectCreationData)[] } | undefined>,
    ) => {
      const { projectData: initialData } = getInitialState();

      if (action.payload) {
        action.payload.resetFields.forEach(
          /* disable typescript-eslint rule: https://typescript-eslint.io/rules/no-unnecessary-type-parameters */
          /* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters */
          <K extends keyof ReconversionProjectCreationData>(field: K) => {
            state.projectData[field] = field in initialData ? initialData[field] : undefined;
          },
        );
      }

      if (state.stepsHistory.length > 1) {
        state.stepsHistory = state.stepsHistory.slice(0, -1);
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(createModeStepReverted, (state) => {
      state.projectData.developmentPlanCategory = undefined;
    });
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
      state.stepsHistory.push("CREATION_RESULT");
    });
    builder.addCase(saveReconversionProject.rejected, (state) => {
      state.saveProjectLoadingState = "error";
      state.stepsHistory.push("CREATION_RESULT");
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
  revertStep({ resetFields: ["developmentPlanCategory"] });
export const revertRenewableEnergyDevelopmentPlanType = () =>
  revertStep({ resetFields: ["renewableEnergyType"] });
export const revertSoilsTransformationIntroductionStep = () => revertStep();
export const revertNonSuitableSoilsNoticeStep = () => revertStep();
export const revertNonSuitableSoilsSelectionStep = () =>
  revertStep({ resetFields: ["nonSuitableSoilsToTransform"] });
export const revertNonSuitableSoilsSurfaceStep = () =>
  revertStep({ resetFields: ["baseSoilsDistributionForTransformation"] });
export const revertSoilsTransformationProjectSelectionStep = () => revertStep({ resetFields: [] });
export const revertCustomSoilsSelectionStep = () =>
  revertStep({ resetFields: ["futureSoilsSelection"] });
export const revertCustomSoilsSurfaceAreaAllocationStep = () =>
  revertStep({ resetFields: ["soilsDistribution"] });
export const revertBiodiversityAndClimateImpactNoticeStep = () => revertStep();
export const revertStakeholdersIntroductionStep = () => revertStep();
export const revertProjectDeveloper = () => revertStep({ resetFields: ["projectDeveloper"] });
export const revertFutureOperator = () => revertStep({ resetFields: ["futureOperator"] });
export const revertConversionFullTimeJobsInvolved = () =>
  revertStep({
    resetFields: ["reinstatementFullTimeJobsInvolved", "conversionFullTimeJobsInvolved"],
  });
export const revertOperationsFullTimeJobsInvolved = () =>
  revertStep({ resetFields: ["operationsFullTimeJobsInvolved"] });
export const revertReinstatementContractOwner = () =>
  revertStep({ resetFields: ["reinstatementContractOwner"] });
export const revertwillSiteBePurchased = () => revertStep({ resetFields: ["willSiteBePurchased"] });
export const revertFutureSiteOwner = () => revertStep({ resetFields: ["futureSiteOwner"] });
export const revertExpensesIntroductionStep = () => revertStep();
export const revertSitePurchaseAmounts = () =>
  revertStep({
    resetFields: ["sitePurchaseSellingPrice", "sitePurchasePropertyTransferDuties"],
  });
export const revertReinstatementExpenses = () =>
  revertStep({ resetFields: ["reinstatementExpenses"] });
export const revertPhotovoltaicPanelsInstallationExpenses = () =>
  revertStep({ resetFields: ["photovoltaicPanelsInstallationExpenses"] });
export const revertYearlyProjectedExpenses = () =>
  revertStep({ resetFields: ["yearlyProjectedExpenses"] });
export const revertRevenuIntroductionStep = () => revertStep();
export const revertFinancialAssistanceRevenues = () =>
  revertStep({ resetFields: ["financialAssistanceRevenues"] });
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
export const revertSoilsSummaryStep = () => revertStep();
export const revertSoilsCarbonStorageStep = () => revertStep();
export const revertScheduleIntroductionStep = () => revertStep();
export const revertProjectPhaseStep = () => revertStep({ resetFields: ["projectPhase"] });
export const revertScheduleStep = () =>
  revertStep({
    resetFields: [
      "firstYearOfOperation",
      "reinstatementSchedule",
      "photovoltaicInstallationSchedule",
    ],
  });
export const revertFinalSummaryStep = () => revertStep();
export const revertResultStep = () => revertStep();

export const {
  resetState,
  completeDevelopmentPlanCategories,
  completeRenewableEnergyDevelopmentPlanType,
  completeSoilsTransformationIntroductionStep,
  completeNonSuitableSoilsNoticeStep,
  completeNonSuitableSoilsSelectionStep,
  completeNonSuitableSoilsSurfaceStep,
  completeSoilsTransformationProjectSelectionStep,
  completeCustomSoilsSelectionStep,
  completeCustomSoilsSurfaceAreaAllocationStep,
  completeSoilsTransformationClimateAndBiodiversityImpactNoticeStep,
  completeStakeholdersIntroductionStep,
  completeFutureOperator,
  completeProjectDeveloper,
  completeReinstatementContractOwner,
  completeConversionFullTimeJobsInvolved,
  completeOperationsFullTimeJobsInvolved,
  completeExpensesIntroductionStep,
  completeReinstatementExpenses,
  completeRevenuIntroductionStep,
  completePhotovoltaicPanelsInstallationExpenses,
  completeYearlyProjectedExpenses,
  completeFinancialAssistanceRevenues,
  completeYearlyProjectedRevenue,
  completeNaming,
  completePhotovoltaicKeyParameter,
  completePhotovoltaicInstallationElectricalPower,
  completePhotovoltaicInstallationSurface,
  completePhotovoltaicExpectedAnnualProduction,
  completePhotovoltaicContractDuration,
  completeSoilsSummaryStep,
  completeSoilsCarbonStorageStep,
  completeScheduleIntroductionStep,
  completeScheduleStep,
  completeSitePurchase,
  completeFutureSiteOwner,
  completeSitePurchaseAmounts,
  completeProjectPhaseStep,
} = projectCreationSlice.actions;

const projectCreationReducer = reduceReducers<ProjectCreationState>(
  getInitialState(),
  projectCreationSlice.reducer,
  mixedUseNeighbourhoodReducer,
);

export default projectCreationReducer;
