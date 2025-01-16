import {
  ActionReducerMapBuilder,
  createReducer,
  PayloadAction,
  UnknownAction,
} from "@reduxjs/toolkit";
import { SoilsDistribution, stripEmptySurfaces } from "shared";

import { ReconversionProjectCreationData } from "@/features/create-project/core/project.types";

import { ProjectCreationState } from "../createProject.reducer";
import { SoilsCarbonStorageResult } from "../soilsCarbonStorage.action";
import { fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation } from "./actions/getPhotovoltaicExpectedPerformance.action";
import {
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
  completeRenewableEnergyType,
  completeSoilsDecontaminationIntroduction,
  completeSoilsDecontaminationSelection,
  completeSoilsDecontaminationSurfaceArea,
  completeSoilsTransformationIntroductionStep,
  revertBiodiversityAndClimateImpactNoticeStep,
  revertCustomSoilsSelectionStep,
  revertCustomSoilsSurfaceAreaAllocationStep,
  revertExpensesIntroductionStep,
  revertFinalSummaryStep,
  revertFinancialAssistanceRevenues,
  revertFutureOperator,
  revertFutureSiteOwner,
  revertNaming,
  revertNonSuitableSoilsNoticeStep,
  revertNonSuitableSoilsSelectionStep,
  revertNonSuitableSoilsSurfaceStep,
  revertPhotovoltaicContractDuration,
  revertPhotovoltaicExpectedAnnualProduction,
  revertPhotovoltaicInstallationElectricalPower,
  revertPhotovoltaicInstallationSurface,
  revertPhotovoltaicKeyParameter,
  revertPhotovoltaicPanelsInstallationExpenses,
  revertProjectDeveloper,
  revertProjectPhaseStep,
  revertReinstatementContractOwner,
  revertReinstatementExpenses,
  revertRenewableEnergyType,
  revertResultStep,
  revertRevenuIntroductionStep,
  revertScheduleIntroductionStep,
  revertScheduleStep,
  revertSitePurchaseAmounts,
  revertSoilsCarbonStorageStep,
  revertSoilsDecontaminationSelectionStep,
  revertSoilsDecontaminationSurfaceAreaStep,
  revertSoilsSummaryStep,
  revertSoilsTransformationIntroductionStep,
  revertSoilsTransformationProjectSelectionStep,
  revertStakeholdersIntroductionStep,
  revertWillSiteBePurchased,
  revertYearlyProjectedExpenses,
  revertYearlyProjectedRevenue,
  revertSoilsDecontaminationIntroductionStep,
} from "./actions/renewableEnergy.actions";
import { saveReconversionProject } from "./actions/saveReconversionProject.action";
import { fetchCurrentAndProjectedSoilsCarbonStorage } from "./actions/soilsCarbonStorage.actions";
import {
  getRecommendedPhotovoltaicPanelsAccessPathSurfaceArea,
  getRecommendedPhotovoltaicPanelsFoundationsSurfaceArea,
} from "./photovoltaic";
import {
  canSiteAccomodatePhotovoltaicPanels,
  hasSiteSignificantBiodiversityAndClimateSensibleSoils,
  preserveCurrentSoils,
  transformNonSuitableSoils,
  transformSoilsForRenaturation,
} from "./soilsTransformation";

export type RenewableEneryProjectState = {
  saveState: "idle" | "loading" | "success" | "error";
  stepsHistory: PhotovoltaicProjectCreationStep[];
  creationData: Partial<ReconversionProjectCreationData>;
  soilsCarbonStorage:
    | {
        loadingState: "idle" | "loading" | "error";
        current: undefined;
        projected: undefined;
      }
    | {
        loadingState: "success";
        current: SoilsCarbonStorageResult;
        projected: SoilsCarbonStorageResult;
      };
  expectedPhotovoltaicPerformance: {
    loadingState: "idle" | "loading" | "success" | "error";
    expectedPerformanceMwhPerYear?: number;
  };
};

export type PhotovoltaicProjectCreationStep =
  | "RENEWABLE_ENERGY_TYPES"
  | "PHOTOVOLTAIC_KEY_PARAMETER"
  | "PHOTOVOLTAIC_POWER"
  | "PHOTOVOLTAIC_SURFACE"
  | "PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION"
  | "PHOTOVOLTAIC_CONTRACT_DURATION"
  | "SOILS_DECONTAMINATION_INTRODUCTION"
  | "SOILS_DECONTAMINATION_SELECTION"
  | "SOILS_DECONTAMINATION_SURFACE_AREA"
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

export const INITIAL_STATE: RenewableEneryProjectState = {
  stepsHistory: ["RENEWABLE_ENERGY_TYPES"],
  creationData: {
    yearlyProjectedExpenses: [],
    yearlyProjectedRevenues: [],
  },
  saveState: "idle",
  soilsCarbonStorage: {
    loadingState: "idle",
    current: undefined,
    projected: undefined,
  },
  expectedPhotovoltaicPerformance: {
    loadingState: "idle",
    expectedPerformanceMwhPerYear: undefined,
  },
};

const addCompleteStepActionCases = (builder: ActionReducerMapBuilder<ProjectCreationState>) => {
  builder.addCase(completeRenewableEnergyType, (state, action) => {
    state.renewableEnergyProject.creationData.renewableEnergyType = action.payload;
    state.renewableEnergyProject.stepsHistory.push("PHOTOVOLTAIC_KEY_PARAMETER");
  });
  builder.addCase(completeSoilsDecontaminationIntroduction, (state) => {
    state.renewableEnergyProject.stepsHistory.push("SOILS_DECONTAMINATION_SELECTION");
  });

  builder.addCase(completeSoilsDecontaminationSelection, (state, action) => {
    state.renewableEnergyProject.creationData.decontaminationPlan = action.payload;
    switch (action.payload) {
      case "none":
        state.renewableEnergyProject.creationData.decontaminatedSurfaceArea = 0;
        state.renewableEnergyProject.stepsHistory.push("SOILS_TRANSFORMATION_INTRODUCTION");
        break;
      case "unknown": {
        const contaminatedSoilSurface = state.siteData?.contaminatedSoilSurface ?? 0;
        state.renewableEnergyProject.creationData.decontaminatedSurfaceArea =
          contaminatedSoilSurface * 0.25;
        state.renewableEnergyProject.stepsHistory.push("SOILS_TRANSFORMATION_INTRODUCTION");
        break;
      }
      case "partial":
        state.renewableEnergyProject.stepsHistory.push("SOILS_DECONTAMINATION_SURFACE_AREA");
        break;
    }
  });
  builder.addCase(completeSoilsDecontaminationSurfaceArea, (state, action) => {
    state.renewableEnergyProject.creationData.decontaminatedSurfaceArea = action.payload;
    state.renewableEnergyProject.stepsHistory.push("SOILS_TRANSFORMATION_INTRODUCTION");
  });
  builder.addCase(completeSoilsTransformationIntroductionStep, (state) => {
    const nextStep = canSiteAccomodatePhotovoltaicPanels(
      state.siteData?.soilsDistribution ?? {},
      state.renewableEnergyProject.creationData.photovoltaicInstallationSurfaceSquareMeters ?? 0,
    )
      ? "SOILS_TRANSFORMATION_PROJECT_SELECTION"
      : "NON_SUITABLE_SOILS_NOTICE";
    state.renewableEnergyProject.stepsHistory.push(nextStep);
  });
  builder.addCase(completeNonSuitableSoilsNoticeStep, (state) => {
    state.renewableEnergyProject.creationData.baseSoilsDistributionForTransformation =
      state.siteData?.soilsDistribution ?? {};
    state.renewableEnergyProject.stepsHistory.push("NON_SUITABLE_SOILS_SELECTION");
  });
  builder.addCase(completeNonSuitableSoilsSelectionStep, (state, action) => {
    state.renewableEnergyProject.creationData.nonSuitableSoilsToTransform = action.payload;
    state.renewableEnergyProject.stepsHistory.push("NON_SUITABLE_SOILS_SURFACE");
  });
  builder.addCase(completeNonSuitableSoilsSurfaceStep, (state, action) => {
    state.renewableEnergyProject.creationData.nonSuitableSoilsSurfaceAreaToTransform =
      action.payload;
    state.renewableEnergyProject.creationData.baseSoilsDistributionForTransformation =
      transformNonSuitableSoils(state.siteData?.soilsDistribution ?? {}, action.payload);

    state.renewableEnergyProject.stepsHistory.push("SOILS_TRANSFORMATION_PROJECT_SELECTION");
  });
  builder.addCase(completeSoilsTransformationProjectSelectionStep, (state, action) => {
    const transformationProject = action.payload;

    if (transformationProject === "custom") {
      state.renewableEnergyProject.stepsHistory.push("SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION");
      return;
    }

    // soils may have been transformed to suit photovaltaic panels installation
    const baseSoilsDistribution: SoilsDistribution =
      state.renewableEnergyProject.creationData.baseSoilsDistributionForTransformation ??
      state.siteData?.soilsDistribution ??
      {};

    const recommendedImpermeableSurfaceArea =
      getRecommendedPhotovoltaicPanelsFoundationsSurfaceArea(
        state.renewableEnergyProject.creationData.photovoltaicInstallationElectricalPowerKWc ?? 0,
      );
    const recommendedMineralSurfaceArea = getRecommendedPhotovoltaicPanelsAccessPathSurfaceArea(
      state.renewableEnergyProject.creationData.photovoltaicInstallationElectricalPowerKWc ?? 0,
    );
    const transformationFn =
      transformationProject === "renaturation"
        ? transformSoilsForRenaturation
        : preserveCurrentSoils;
    state.renewableEnergyProject.creationData.soilsDistribution = transformationFn(
      baseSoilsDistribution,
      {
        recommendedImpermeableSurfaceArea,
        recommendedMineralSurfaceArea,
      },
    );

    const nextStep = hasSiteSignificantBiodiversityAndClimateSensibleSoils(
      state.siteData?.soilsDistribution ?? {},
    )
      ? "SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE"
      : "SOILS_SUMMARY";
    state.renewableEnergyProject.stepsHistory.push(nextStep);
  });
  builder.addCase(completeCustomSoilsSelectionStep, (state, action) => {
    state.renewableEnergyProject.creationData.futureSoilsSelection = action.payload;
    state.renewableEnergyProject.stepsHistory.push(
      "SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
    );
  });
  builder.addCase(completeCustomSoilsSurfaceAreaAllocationStep, (state, action) => {
    state.renewableEnergyProject.creationData.soilsDistribution = stripEmptySurfaces(
      action.payload,
    );

    const nextStep = hasSiteSignificantBiodiversityAndClimateSensibleSoils(
      state.siteData?.soilsDistribution ?? {},
    )
      ? "SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE"
      : "SOILS_SUMMARY";
    state.renewableEnergyProject.stepsHistory.push(nextStep);
  });
  builder.addCase(completeSoilsTransformationClimateAndBiodiversityImpactNoticeStep, (state) => {
    state.renewableEnergyProject.stepsHistory.push("SOILS_SUMMARY");
  });
  builder.addCase(completeStakeholdersIntroductionStep, (state) => {
    state.renewableEnergyProject.stepsHistory.push("STAKEHOLDERS_PROJECT_DEVELOPER");
  });
  builder.addCase(completeProjectDeveloper, (state, action) => {
    state.renewableEnergyProject.creationData.projectDeveloper = action.payload;
    state.renewableEnergyProject.stepsHistory.push("STAKEHOLDERS_FUTURE_OPERATOR");
  });
  builder.addCase(completeFutureOperator, (state, action) => {
    state.renewableEnergyProject.creationData.futureOperator = action.payload;
    const nextStep = state.siteData?.isFriche
      ? "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"
      : "STAKEHOLDERS_SITE_PURCHASE";
    state.renewableEnergyProject.stepsHistory.push(nextStep);
  });
  builder.addCase(
    completeReinstatementContractOwner,
    (
      state,
      action: PayloadAction<ReconversionProjectCreationData["reinstatementContractOwner"]>,
    ) => {
      state.renewableEnergyProject.creationData.reinstatementContractOwner = action.payload;
      state.renewableEnergyProject.stepsHistory.push("STAKEHOLDERS_SITE_PURCHASE");
    },
  );
  builder.addCase(completeSitePurchase, (state, action) => {
    const willSiteBePurchased = action.payload;
    state.renewableEnergyProject.creationData.willSiteBePurchased = willSiteBePurchased;
    const nextStep = willSiteBePurchased
      ? "STAKEHOLDERS_FUTURE_SITE_OWNER"
      : "EXPENSES_INTRODUCTION";
    state.renewableEnergyProject.stepsHistory.push(nextStep);
  });
  builder.addCase(completeFutureSiteOwner, (state, action) => {
    state.renewableEnergyProject.creationData.futureSiteOwner = action.payload;
    state.renewableEnergyProject.stepsHistory.push("EXPENSES_INTRODUCTION");
  });
  builder.addCase(completeExpensesIntroductionStep, (state) => {
    if (state.renewableEnergyProject.creationData.willSiteBePurchased) {
      state.renewableEnergyProject.stepsHistory.push("EXPENSES_SITE_PURCHASE_AMOUNTS");
      return;
    }
    if (state.siteData?.isFriche) {
      state.renewableEnergyProject.stepsHistory.push("EXPENSES_REINSTATEMENT");
      return;
    }
    state.renewableEnergyProject.stepsHistory.push("EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION");
  });
  builder.addCase(completeSitePurchaseAmounts, (state, action) => {
    state.renewableEnergyProject.creationData.sitePurchaseSellingPrice =
      action.payload.sellingPrice;
    if (action.payload.propertyTransferDuties) {
      state.renewableEnergyProject.creationData.sitePurchasePropertyTransferDuties =
        action.payload.propertyTransferDuties;
    }
    if (state.siteData?.isFriche) {
      state.renewableEnergyProject.stepsHistory.push("EXPENSES_REINSTATEMENT");
      return;
    }
    state.renewableEnergyProject.stepsHistory.push("EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION");
  });
  builder.addCase(completeReinstatementExpenses, (state, action) => {
    state.renewableEnergyProject.creationData.reinstatementExpenses = action.payload;
    state.renewableEnergyProject.stepsHistory.push("EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION");
  });
  builder.addCase(completePhotovoltaicPanelsInstallationExpenses, (state, action) => {
    state.renewableEnergyProject.creationData.photovoltaicPanelsInstallationExpenses =
      action.payload;
    state.renewableEnergyProject.stepsHistory.push("EXPENSES_PROJECTED_YEARLY_EXPENSES");
  });
  builder.addCase(completeYearlyProjectedExpenses, (state, action) => {
    state.renewableEnergyProject.creationData.yearlyProjectedExpenses = action.payload;
    state.renewableEnergyProject.stepsHistory.push("REVENUE_INTRODUCTION");
  });
  builder.addCase(completeRevenuIntroductionStep, (state) => {
    state.renewableEnergyProject.stepsHistory.push("REVENUE_PROJECTED_YEARLY_REVENUE");
  });
  builder.addCase(completeFinancialAssistanceRevenues, (state, action) => {
    state.renewableEnergyProject.creationData.financialAssistanceRevenues = action.payload;
    state.renewableEnergyProject.stepsHistory.push("SCHEDULE_INTRODUCTION");
  });
  builder.addCase(completeYearlyProjectedRevenue, (state, action) => {
    state.renewableEnergyProject.creationData.yearlyProjectedRevenues = action.payload;
    state.renewableEnergyProject.stepsHistory.push("REVENUE_FINANCIAL_ASSISTANCE");
  });

  builder.addCase(completeNaming, (state, action) => {
    const { name, description } = action.payload;
    state.renewableEnergyProject.creationData.name = name;
    if (description) state.renewableEnergyProject.creationData.description = description;

    state.renewableEnergyProject.stepsHistory.push("FINAL_SUMMARY");
  });
  builder.addCase(completePhotovoltaicKeyParameter, (state, action) => {
    state.renewableEnergyProject.creationData.photovoltaicKeyParameter = action.payload;

    const nextStep = action.payload === "POWER" ? "PHOTOVOLTAIC_POWER" : "PHOTOVOLTAIC_SURFACE";
    state.renewableEnergyProject.stepsHistory.push(nextStep);
  });
  builder.addCase(completePhotovoltaicInstallationElectricalPower, (state, action) => {
    state.renewableEnergyProject.creationData.photovoltaicInstallationElectricalPowerKWc =
      action.payload;
    const nextStep =
      state.renewableEnergyProject.creationData.photovoltaicKeyParameter === "POWER"
        ? "PHOTOVOLTAIC_SURFACE"
        : "PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION";
    state.renewableEnergyProject.stepsHistory.push(nextStep);
  });
  builder.addCase(completePhotovoltaicInstallationSurface, (state, action) => {
    state.renewableEnergyProject.creationData.photovoltaicInstallationSurfaceSquareMeters =
      action.payload;
    const nextStep =
      state.renewableEnergyProject.creationData.photovoltaicKeyParameter === "POWER"
        ? "PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION"
        : "PHOTOVOLTAIC_POWER";
    state.renewableEnergyProject.stepsHistory.push(nextStep);
  });
  builder.addCase(completePhotovoltaicExpectedAnnualProduction, (state, action) => {
    state.renewableEnergyProject.creationData.photovoltaicExpectedAnnualProduction = action.payload;
    state.renewableEnergyProject.stepsHistory.push("PHOTOVOLTAIC_CONTRACT_DURATION");
  });
  builder.addCase(completePhotovoltaicContractDuration, (state, action) => {
    state.renewableEnergyProject.creationData.photovoltaicContractDuration = action.payload;
    state.renewableEnergyProject.stepsHistory.push(
      state.siteData?.isFriche && state.siteData.contaminatedSoilSurface
        ? "SOILS_DECONTAMINATION_INTRODUCTION"
        : "SOILS_TRANSFORMATION_INTRODUCTION",
    );
  });
  builder.addCase(completeSoilsSummaryStep, (state) => {
    state.renewableEnergyProject.stepsHistory.push("SOILS_CARBON_STORAGE");
  });
  builder.addCase(completeSoilsCarbonStorageStep, (state) => {
    state.renewableEnergyProject.stepsHistory.push("STAKEHOLDERS_INTRODUCTION");
  });
  builder.addCase(completeScheduleIntroductionStep, (state) => {
    state.renewableEnergyProject.stepsHistory.push("SCHEDULE_PROJECTION");
  });
  builder.addCase(completeScheduleStep, (state, action) => {
    const { firstYearOfOperation, photovoltaicInstallationSchedule, reinstatementSchedule } =
      action.payload;
    if (firstYearOfOperation)
      state.renewableEnergyProject.creationData.firstYearOfOperation = firstYearOfOperation;
    if (reinstatementSchedule)
      state.renewableEnergyProject.creationData.reinstatementSchedule = reinstatementSchedule;
    if (photovoltaicInstallationSchedule) {
      state.renewableEnergyProject.creationData.photovoltaicInstallationSchedule =
        photovoltaicInstallationSchedule;
    }
    state.renewableEnergyProject.stepsHistory.push("PROJECT_PHASE");
  });
  builder.addCase(completeProjectPhaseStep, (state, action) => {
    state.renewableEnergyProject.creationData.projectPhase = action.payload.phase;
    state.renewableEnergyProject.stepsHistory.push("NAMING");
  });
};

const addSaveReconversionProjectActionCases = (
  builder: ActionReducerMapBuilder<ProjectCreationState>,
) => {
  builder.addCase(saveReconversionProject.pending, (state) => {
    state.renewableEnergyProject.saveState = "loading";
  });
  builder.addCase(saveReconversionProject.fulfilled, (state) => {
    state.renewableEnergyProject.saveState = "success";
    state.renewableEnergyProject.stepsHistory.push("CREATION_RESULT");
  });
  builder.addCase(saveReconversionProject.rejected, (state) => {
    state.renewableEnergyProject.saveState = "error";
    state.renewableEnergyProject.stepsHistory.push("CREATION_RESULT");
  });
};

const addFetchExpectedPhotovoltaicPerformanceActionCases = (
  builder: ActionReducerMapBuilder<ProjectCreationState>,
) => {
  builder.addCase(fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation.pending, (state) => {
    state.renewableEnergyProject.expectedPhotovoltaicPerformance.loadingState = "loading";
  });
  builder.addCase(
    fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation.fulfilled,
    (state, action) => {
      state.renewableEnergyProject.expectedPhotovoltaicPerformance.loadingState = "success";
      state.renewableEnergyProject.expectedPhotovoltaicPerformance.expectedPerformanceMwhPerYear =
        action.payload.expectedPerformanceMwhPerYear;
    },
  );
  builder.addCase(fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation.rejected, (state) => {
    state.renewableEnergyProject.expectedPhotovoltaicPerformance.loadingState = "error";
  });
};

const addFetchCarbonStorageComparisonActionCases = (
  builder: ActionReducerMapBuilder<ProjectCreationState>,
) => {
  builder.addCase(fetchCurrentAndProjectedSoilsCarbonStorage.pending, (state) => {
    state.renewableEnergyProject.soilsCarbonStorage.loadingState = "loading";
  });
  builder.addCase(fetchCurrentAndProjectedSoilsCarbonStorage.fulfilled, (state, action) => {
    state.renewableEnergyProject.soilsCarbonStorage = {
      loadingState: "success",
      current: action.payload.current,
      projected: action.payload.projected,
    };
  });
  builder.addCase(fetchCurrentAndProjectedSoilsCarbonStorage.rejected, (state) => {
    state.renewableEnergyProject.soilsCarbonStorage.loadingState = "error";
  });
};

const revertStep = (
  state: ProjectCreationState,
  resetFields?: (keyof ReconversionProjectCreationData)[],
) => {
  const { creationData: initialData } = INITIAL_STATE;

  if (resetFields) {
    resetFields.forEach(
      /* disable typescript-eslint rule: https://typescript-eslint.io/rules/no-unnecessary-type-parameters */
      /* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters */
      <K extends keyof ReconversionProjectCreationData>(field: K) => {
        state.renewableEnergyProject.creationData[field] =
          field in initialData ? initialData[field] : undefined;
      },
    );
  }

  if (state.renewableEnergyProject.stepsHistory.length > 1) {
    state.renewableEnergyProject.stepsHistory = state.renewableEnergyProject.stepsHistory.slice(
      0,
      -1,
    );
  }
};

const addRevertStepActionCases = (builder: ActionReducerMapBuilder<ProjectCreationState>) => {
  builder.addCase(revertRenewableEnergyType, (state) => {
    state.developmentPlanCategory = undefined;
    revertStep(state, ["renewableEnergyType"]);
  });
  builder.addCase(revertSoilsDecontaminationIntroductionStep, (state) => {
    revertStep(state);
  });
  builder.addCase(revertSoilsDecontaminationSelectionStep, (state) => {
    revertStep(state, ["decontaminatedSurfaceArea"]);
  });
  builder.addCase(revertSoilsDecontaminationSurfaceAreaStep, (state) => {
    revertStep(state, ["decontaminatedSurfaceArea"]);
  });
  builder.addCase(revertSoilsTransformationIntroductionStep, (state) => {
    revertStep(state);
  });
  builder.addCase(revertNonSuitableSoilsNoticeStep, (state) => {
    revertStep(state);
  });
  builder.addCase(revertNonSuitableSoilsSelectionStep, (state) => {
    revertStep(state, ["nonSuitableSoilsToTransform"]);
  });

  builder.addCase(revertNonSuitableSoilsSurfaceStep, (state) => {
    revertStep(state, ["baseSoilsDistributionForTransformation"]);
  });
  builder.addCase(revertSoilsTransformationProjectSelectionStep, (state) => {
    revertStep(state);
  });
  builder.addCase(revertCustomSoilsSelectionStep, (state) => {
    revertStep(state, ["futureSoilsSelection"]);
  });
  builder.addCase(revertCustomSoilsSurfaceAreaAllocationStep, (state) => {
    revertStep(state, ["soilsDistribution"]);
  });
  builder.addCase(revertBiodiversityAndClimateImpactNoticeStep, (state) => {
    revertStep(state);
  });
  builder.addCase(revertStakeholdersIntroductionStep, (state) => {
    revertStep(state);
  });
  builder.addCase(revertProjectDeveloper, (state) => {
    revertStep(state, ["projectDeveloper"]);
  });
  builder.addCase(revertFutureOperator, (state) => {
    revertStep(state, ["futureOperator"]);
  });
  builder.addCase(revertReinstatementContractOwner, (state) => {
    revertStep(state, ["reinstatementContractOwner"]);
  });
  builder.addCase(revertWillSiteBePurchased, (state) => {
    revertStep(state, ["willSiteBePurchased"]);
  });
  builder.addCase(revertFutureSiteOwner, (state) => {
    revertStep(state, ["futureSiteOwner"]);
  });
  builder.addCase(revertExpensesIntroductionStep, (state) => {
    revertStep(state);
  });
  builder.addCase(revertSitePurchaseAmounts, (state) => {
    revertStep(state, ["sitePurchaseSellingPrice", "sitePurchasePropertyTransferDuties"]);
  });

  builder.addCase(revertReinstatementExpenses, (state) => {
    revertStep(state, ["reinstatementExpenses"]);
  });
  builder.addCase(revertPhotovoltaicPanelsInstallationExpenses, (state) => {
    revertStep(state, ["photovoltaicPanelsInstallationExpenses"]);
  });
  builder.addCase(revertYearlyProjectedExpenses, (state) => {
    revertStep(state, ["yearlyProjectedExpenses"]);
  });
  builder.addCase(revertRevenuIntroductionStep, (state) => {
    revertStep(state);
  });
  builder.addCase(revertFinancialAssistanceRevenues, (state) => {
    revertStep(state, ["financialAssistanceRevenues"]);
  });
  builder.addCase(revertYearlyProjectedRevenue, (state) => {
    revertStep(state, ["yearlyProjectedRevenues"]);
  });
  builder.addCase(revertNaming, (state) => {
    revertStep(state, ["name", "description"]);
  });
  builder.addCase(revertPhotovoltaicKeyParameter, (state) => {
    revertStep(state, ["photovoltaicKeyParameter"]);
  });
  builder.addCase(revertPhotovoltaicInstallationElectricalPower, (state) => {
    revertStep(state, ["photovoltaicInstallationElectricalPowerKWc"]);
  });
  builder.addCase(revertPhotovoltaicInstallationSurface, (state) => {
    revertStep(state, ["photovoltaicInstallationSurfaceSquareMeters"]);
  });
  builder.addCase(revertPhotovoltaicExpectedAnnualProduction, (state) => {
    revertStep(state, ["photovoltaicExpectedAnnualProduction"]);
  });
  builder.addCase(revertPhotovoltaicContractDuration, (state) => {
    revertStep(state, ["photovoltaicContractDuration"]);
  });
  builder.addCase(revertSoilsSummaryStep, (state) => {
    revertStep(state);
  });
  builder.addCase(revertSoilsCarbonStorageStep, (state) => {
    revertStep(state);
  });
  builder.addCase(revertScheduleIntroductionStep, (state) => {
    revertStep(state);
  });
  builder.addCase(revertProjectPhaseStep, (state) => {
    revertStep(state, ["projectPhase"]);
  });
  builder.addCase(revertScheduleStep, (state) => {
    revertStep(state, [
      "firstYearOfOperation",
      "reinstatementSchedule",
      "photovoltaicInstallationSchedule",
    ]);
  });
  builder.addCase(revertFinalSummaryStep, (state) => {
    revertStep(state);
  });
  builder.addCase(revertResultStep, (state) => {
    revertStep(state);
  });
};

export const renewableEnergyProjectReducer = createReducer(
  {} as ProjectCreationState,
  (builder) => {
    addCompleteStepActionCases(builder);
    addRevertStepActionCases(builder);
    addSaveReconversionProjectActionCases(builder);
    addFetchExpectedPhotovoltaicPerformanceActionCases(builder);
    addFetchCarbonStorageComparisonActionCases(builder);
  },
);

export default (state: ProjectCreationState, action: UnknownAction): ProjectCreationState => {
  return renewableEnergyProjectReducer(state, action);
};
