import { ActionReducerMapBuilder, createReducer, PayloadAction } from "@reduxjs/toolkit";
import { SoilsDistribution, stripEmptySurfaces } from "shared";
import {
  getRecommendedPhotovoltaicPanelsAccessPathSurfaceArea,
  getRecommendedPhotovoltaicPanelsFoundationsSurfaceArea,
  canSiteAccomodatePhotovoltaicPanels,
  hasSiteSignificantBiodiversityAndClimateSensibleSoils,
  preserveCurrentSoils,
  transformNonSuitableSoils,
  transformSoilsForRenaturation,
} from "shared";

import { ReconversionProjectCreationData } from "@/features/create-project/core/project.types";

import { stepRevertConfirmed } from "../actions/actionsUtils";
import { ExpressReconversionProjectResult } from "../actions/expressProjectSavedGateway";
import { SoilsCarbonStorageResult } from "../actions/soilsCarbonStorage.action";
import { ProjectCreationState } from "../createProject.reducer";
import { saveReconversionProject } from "./actions/customProjectSaved.action";
import {
  expressPhotovoltaicProjectCreated,
  expressPhotovoltaicProjectSaved,
} from "./actions/expressProjectSaved.action";
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
  futureOperatorCompleted,
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
  customCreateModeSelected,
} from "./actions/renewableEnergy.actions";
import { fetchCurrentAndProjectedSoilsCarbonStorage } from "./actions/soilsCarbonStorage.actions";

// todo: fix typo
export type RenewableEnergyProjectState = {
  createMode: "express" | "custom" | undefined;
  saveState: "idle" | "loading" | "success" | "error";
  creationData: Partial<ReconversionProjectCreationData>;
  expressData: {
    loadingState: "idle" | "loading" | "success" | "error";
    projectData?: ExpressReconversionProjectResult;
  };
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

export const INITIAL_STATE: RenewableEnergyProjectState = {
  createMode: undefined,
  creationData: {
    yearlyProjectedExpenses: [],
    yearlyProjectedRevenues: [],
  },
  expressData: {
    loadingState: "idle",
    projectData: undefined,
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

const willSiteNeedReinstatement = (state: ProjectCreationState) => {
  return state.siteData?.nature === "FRICHE";
};

const addCompleteStepActionCases = (builder: ActionReducerMapBuilder<ProjectCreationState>) => {
  builder.addCase(expressPhotovoltaicProjectCreated.pending, (state) => {
    state.renewableEnergyProject.createMode = "express";
    state.renewableEnergyProject.expressData = { loadingState: "loading" };
    state.stepsHistory.push("RENEWABLE_ENERGY_EXPRESS_FINAL_SUMMARY");
  });
  builder.addCase(expressPhotovoltaicProjectCreated.rejected, (state) => {
    state.renewableEnergyProject.expressData = { loadingState: "error" };
    state.stepsHistory.push("RENEWABLE_ENERGY_EXPRESS_FINAL_SUMMARY");
  });
  builder.addCase(expressPhotovoltaicProjectCreated.fulfilled, (state, action) => {
    state.renewableEnergyProject.expressData = {
      projectData: action.payload,
      loadingState: "success",
    };
  });
  builder.addCase(expressPhotovoltaicProjectSaved.pending, (state) => {
    state.renewableEnergyProject.saveState = "loading";
    state.stepsHistory.push("RENEWABLE_ENERGY_CREATION_RESULT");
  });
  builder.addCase(expressPhotovoltaicProjectSaved.rejected, (state) => {
    state.renewableEnergyProject.saveState = "error";
  });
  builder.addCase(expressPhotovoltaicProjectSaved.fulfilled, (state) => {
    state.renewableEnergyProject.saveState = "success";
  });
  builder.addCase(completeRenewableEnergyType, (state, action) => {
    state.renewableEnergyProject.creationData.renewableEnergyType = action.payload;
    state.stepsHistory.push("RENEWABLE_ENERGY_CREATE_MODE_SELECTION");
  });
  builder.addCase(customCreateModeSelected, (state) => {
    state.renewableEnergyProject.createMode = "custom";
    state.stepsHistory.push("RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER");
  });
  builder.addCase(completeSoilsDecontaminationIntroduction, (state) => {
    state.stepsHistory.push("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION");
  });

  builder.addCase(completeSoilsDecontaminationSelection, (state, action) => {
    state.renewableEnergyProject.creationData.decontaminationPlan = action.payload;
    switch (action.payload) {
      case "none":
        state.renewableEnergyProject.creationData.decontaminatedSurfaceArea = 0;
        state.stepsHistory.push("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");
        break;
      case "unknown": {
        const contaminatedSoilSurface = state.siteData?.contaminatedSoilSurface ?? 0;
        state.renewableEnergyProject.creationData.decontaminatedSurfaceArea =
          contaminatedSoilSurface * 0.25;
        state.stepsHistory.push("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");
        break;
      }
      case "partial":
        state.stepsHistory.push("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA");
        break;
    }
  });
  builder.addCase(completeSoilsDecontaminationSurfaceArea, (state, action) => {
    state.renewableEnergyProject.creationData.decontaminatedSurfaceArea = action.payload;
    state.stepsHistory.push("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");
  });
  builder.addCase(completeSoilsTransformationIntroductionStep, (state) => {
    const nextStep = canSiteAccomodatePhotovoltaicPanels(
      state.siteData?.soilsDistribution ?? {},
      state.renewableEnergyProject.creationData.photovoltaicInstallationSurfaceSquareMeters ?? 0,
    )
      ? "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION"
      : "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE";
    state.stepsHistory.push(nextStep);
  });
  builder.addCase(completeNonSuitableSoilsNoticeStep, (state) => {
    state.renewableEnergyProject.creationData.baseSoilsDistributionForTransformation =
      state.siteData?.soilsDistribution ?? {};
    state.stepsHistory.push("RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION");
  });
  builder.addCase(completeNonSuitableSoilsSelectionStep, (state, action) => {
    state.renewableEnergyProject.creationData.nonSuitableSoilsToTransform = action.payload;
    state.stepsHistory.push("RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE");
  });
  builder.addCase(completeNonSuitableSoilsSurfaceStep, (state, action) => {
    state.renewableEnergyProject.creationData.nonSuitableSoilsSurfaceAreaToTransform =
      action.payload;
    state.renewableEnergyProject.creationData.baseSoilsDistributionForTransformation =
      transformNonSuitableSoils(state.siteData?.soilsDistribution ?? {}, action.payload);

    state.stepsHistory.push("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION");
  });
  builder.addCase(completeSoilsTransformationProjectSelectionStep, (state, action) => {
    const transformationProject = action.payload;
    state.renewableEnergyProject.creationData.soilsTransformationProject = transformationProject;

    if (transformationProject === "custom") {
      state.stepsHistory.push("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION");
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
      ? "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE"
      : "RENEWABLE_ENERGY_SOILS_SUMMARY";
    state.stepsHistory.push(nextStep);
  });
  builder.addCase(completeCustomSoilsSelectionStep, (state, action) => {
    state.renewableEnergyProject.creationData.futureSoilsSelection = action.payload;
    state.stepsHistory.push("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION");
  });
  builder.addCase(completeCustomSoilsSurfaceAreaAllocationStep, (state, action) => {
    state.renewableEnergyProject.creationData.soilsDistribution = stripEmptySurfaces(
      action.payload,
    );

    const nextStep = hasSiteSignificantBiodiversityAndClimateSensibleSoils(
      state.siteData?.soilsDistribution ?? {},
    )
      ? "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE"
      : "RENEWABLE_ENERGY_SOILS_SUMMARY";
    state.stepsHistory.push(nextStep);
  });
  builder.addCase(completeSoilsTransformationClimateAndBiodiversityImpactNoticeStep, (state) => {
    state.stepsHistory.push("RENEWABLE_ENERGY_SOILS_SUMMARY");
  });
  builder.addCase(completeStakeholdersIntroductionStep, (state) => {
    state.stepsHistory.push("RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER");
  });
  builder.addCase(completeProjectDeveloper, (state, action) => {
    state.renewableEnergyProject.creationData.projectDeveloper = action.payload;
    state.stepsHistory.push("RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR");
  });
  builder.addCase(futureOperatorCompleted, (state, action) => {
    state.renewableEnergyProject.creationData.futureOperator = action.payload;
    const nextStep = willSiteNeedReinstatement(state)
      ? "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"
      : "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE";
    state.stepsHistory.push(nextStep);
  });
  builder.addCase(
    completeReinstatementContractOwner,
    (
      state,
      action: PayloadAction<ReconversionProjectCreationData["reinstatementContractOwner"]>,
    ) => {
      state.renewableEnergyProject.creationData.reinstatementContractOwner = action.payload;
      state.stepsHistory.push("RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE");
    },
  );
  builder.addCase(completeSitePurchase, (state, action) => {
    const willSiteBePurchased = action.payload;
    state.renewableEnergyProject.creationData.willSiteBePurchased = willSiteBePurchased;
    const nextStep = willSiteBePurchased
      ? "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER"
      : "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION";
    state.stepsHistory.push(nextStep);
  });
  builder.addCase(completeFutureSiteOwner, (state, action) => {
    state.renewableEnergyProject.creationData.futureSiteOwner = action.payload;
    state.stepsHistory.push("RENEWABLE_ENERGY_EXPENSES_INTRODUCTION");
  });
  builder.addCase(completeExpensesIntroductionStep, (state) => {
    if (state.renewableEnergyProject.creationData.willSiteBePurchased) {
      state.stepsHistory.push("RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS");
      return;
    }
    if (willSiteNeedReinstatement(state)) {
      state.stepsHistory.push("RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT");
      return;
    }
    state.stepsHistory.push("RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION");
  });
  builder.addCase(completeSitePurchaseAmounts, (state, action) => {
    state.renewableEnergyProject.creationData.sitePurchaseSellingPrice =
      action.payload.sellingPrice;
    state.renewableEnergyProject.creationData.sitePurchasePropertyTransferDuties =
      action.payload.propertyTransferDuties ?? 0;
    if (willSiteNeedReinstatement(state)) {
      state.stepsHistory.push("RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT");
      return;
    }
    state.stepsHistory.push("RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION");
  });
  builder.addCase(completeReinstatementExpenses, (state, action) => {
    state.renewableEnergyProject.creationData.reinstatementExpenses = action.payload;
    state.stepsHistory.push("RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION");
  });
  builder.addCase(completePhotovoltaicPanelsInstallationExpenses, (state, action) => {
    state.renewableEnergyProject.creationData.photovoltaicPanelsInstallationExpenses =
      action.payload;
    state.stepsHistory.push("RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES");
  });
  builder.addCase(completeYearlyProjectedExpenses, (state, action) => {
    state.renewableEnergyProject.creationData.yearlyProjectedExpenses = action.payload;
    state.stepsHistory.push("RENEWABLE_ENERGY_REVENUE_INTRODUCTION");
  });
  builder.addCase(completeRevenuIntroductionStep, (state) => {
    state.stepsHistory.push("RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE");
  });
  builder.addCase(completeFinancialAssistanceRevenues, (state, action) => {
    state.renewableEnergyProject.creationData.financialAssistanceRevenues = action.payload;
    state.stepsHistory.push("RENEWABLE_ENERGY_SCHEDULE_INTRODUCTION");
  });
  builder.addCase(completeYearlyProjectedRevenue, (state, action) => {
    state.renewableEnergyProject.creationData.yearlyProjectedRevenues = action.payload;
    state.stepsHistory.push("RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE");
  });

  builder.addCase(completeNaming, (state, action) => {
    const { name, description } = action.payload;
    state.renewableEnergyProject.creationData.name = name;
    if (description) state.renewableEnergyProject.creationData.description = description;

    state.stepsHistory.push("RENEWABLE_ENERGY_FINAL_SUMMARY");
  });
  builder.addCase(completePhotovoltaicKeyParameter, (state, action) => {
    state.renewableEnergyProject.creationData.photovoltaicKeyParameter = action.payload;

    const nextStep =
      action.payload === "POWER"
        ? "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER"
        : "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE";
    state.stepsHistory.push(nextStep);
  });
  builder.addCase(completePhotovoltaicInstallationElectricalPower, (state, action) => {
    state.renewableEnergyProject.creationData.photovoltaicInstallationElectricalPowerKWc =
      action.payload;
    const nextStep =
      state.renewableEnergyProject.creationData.photovoltaicKeyParameter === "POWER"
        ? "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE"
        : "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION";
    state.stepsHistory.push(nextStep);
  });
  builder.addCase(completePhotovoltaicInstallationSurface, (state, action) => {
    state.renewableEnergyProject.creationData.photovoltaicInstallationSurfaceSquareMeters =
      action.payload;
    const nextStep =
      state.renewableEnergyProject.creationData.photovoltaicKeyParameter === "POWER"
        ? "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION"
        : "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER";
    state.stepsHistory.push(nextStep);
  });
  builder.addCase(completePhotovoltaicExpectedAnnualProduction, (state, action) => {
    state.renewableEnergyProject.creationData.photovoltaicExpectedAnnualProduction = action.payload;
    state.stepsHistory.push("RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION");
  });
  builder.addCase(completePhotovoltaicContractDuration, (state, action) => {
    state.renewableEnergyProject.creationData.photovoltaicContractDuration = action.payload;
    state.stepsHistory.push(
      state.siteData?.contaminatedSoilSurface
        ? "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION"
        : "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION",
    );
  });
  builder.addCase(completeSoilsSummaryStep, (state) => {
    state.stepsHistory.push("RENEWABLE_ENERGY_SOILS_CARBON_STORAGE");
  });
  builder.addCase(completeSoilsCarbonStorageStep, (state) => {
    state.stepsHistory.push("RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION");
  });
  builder.addCase(completeScheduleIntroductionStep, (state) => {
    state.stepsHistory.push("RENEWABLE_ENERGY_SCHEDULE_PROJECTION");
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
    state.stepsHistory.push("RENEWABLE_ENERGY_PROJECT_PHASE");
  });
  builder.addCase(completeProjectPhaseStep, (state, action) => {
    state.renewableEnergyProject.creationData.projectPhase = action.payload.phase;
    state.stepsHistory.push("RENEWABLE_ENERGY_NAMING");
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
    state.stepsHistory.push("RENEWABLE_ENERGY_CREATION_RESULT");
  });
  builder.addCase(saveReconversionProject.rejected, (state) => {
    state.renewableEnergyProject.saveState = "error";
    state.stepsHistory.push("RENEWABLE_ENERGY_CREATION_RESULT");
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

const addRevertStepActionCases = (builder: ActionReducerMapBuilder<ProjectCreationState>) => {
  builder.addCase(stepRevertConfirmed, (state, action) => {
    switch (action.payload.revertedStep) {
      case "RENEWABLE_ENERGY_TYPES":
        state.renewableEnergyProject.creationData.renewableEnergyType = undefined;
        break;
      case "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION":
        state.renewableEnergyProject.creationData.decontaminationPlan = undefined;
        state.renewableEnergyProject.creationData.decontaminatedSurfaceArea = undefined;
        break;
      case "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA":
        state.renewableEnergyProject.creationData.decontaminatedSurfaceArea = undefined;
        break;
      case "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION":
        state.renewableEnergyProject.creationData.nonSuitableSoilsToTransform = undefined;
        break;
      case "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE":
        state.renewableEnergyProject.creationData.nonSuitableSoilsSurfaceAreaToTransform =
          undefined;
        state.renewableEnergyProject.creationData.baseSoilsDistributionForTransformation =
          undefined;
        break;
      case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION":
        state.renewableEnergyProject.creationData.soilsTransformationProject = undefined;
        state.renewableEnergyProject.creationData.soilsDistribution = undefined;
        break;
      case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION":
        state.renewableEnergyProject.creationData.futureSoilsSelection = undefined;
        break;
      case "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION":
        state.renewableEnergyProject.creationData.soilsDistribution = undefined;
        break;
      case "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER":
        state.renewableEnergyProject.creationData.projectDeveloper = undefined;
        break;
      case "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR":
        state.renewableEnergyProject.creationData.futureOperator = undefined;
        break;
      case "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
        state.renewableEnergyProject.creationData.reinstatementContractOwner = undefined;
        break;
      case "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE":
        state.renewableEnergyProject.creationData.willSiteBePurchased = undefined;
        break;
      case "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER":
        state.renewableEnergyProject.creationData.futureSiteOwner = undefined;
        break;
      case "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS":
        state.renewableEnergyProject.creationData.sitePurchaseSellingPrice = undefined;
        state.renewableEnergyProject.creationData.sitePurchasePropertyTransferDuties = undefined;
        break;
      case "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT":
        state.renewableEnergyProject.creationData.reinstatementExpenses = undefined;
        break;
      case "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION":
        state.renewableEnergyProject.creationData.photovoltaicPanelsInstallationExpenses =
          undefined;
        break;
      case "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES":
        state.renewableEnergyProject.creationData.yearlyProjectedExpenses = [];
        break;
      case "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE":
        state.renewableEnergyProject.creationData.yearlyProjectedRevenues = [];
        break;
      case "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE":
        state.renewableEnergyProject.creationData.financialAssistanceRevenues = undefined;
        break;
      case "RENEWABLE_ENERGY_NAMING":
        state.renewableEnergyProject.creationData.name = undefined;
        state.renewableEnergyProject.creationData.description = undefined;
        break;
      case "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER":
        state.renewableEnergyProject.createMode = undefined;
        state.renewableEnergyProject.creationData.photovoltaicKeyParameter = undefined;
        break;
      case "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER":
        state.renewableEnergyProject.creationData.photovoltaicInstallationElectricalPowerKWc =
          undefined;
        break;
      case "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE":
        state.renewableEnergyProject.creationData.photovoltaicInstallationSurfaceSquareMeters =
          undefined;
        break;
      case "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION":
        state.renewableEnergyProject.creationData.photovoltaicExpectedAnnualProduction = undefined;
        break;
      case "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION":
        state.renewableEnergyProject.creationData.photovoltaicContractDuration = undefined;
        break;

      case "RENEWABLE_ENERGY_PROJECT_PHASE":
        state.renewableEnergyProject.creationData.projectPhase = undefined;
        break;
      case "RENEWABLE_ENERGY_SCHEDULE_PROJECTION":
        state.renewableEnergyProject.creationData.firstYearOfOperation = undefined;
        state.renewableEnergyProject.creationData.reinstatementSchedule = undefined;
        state.renewableEnergyProject.creationData.photovoltaicInstallationSchedule = undefined;
        break;
      case "RENEWABLE_ENERGY_EXPRESS_FINAL_SUMMARY":
        state.renewableEnergyProject.createMode = undefined;
        break;
    }
  });
};

export const renewableEnergyProjectReducer = createReducer(
  {} as ProjectCreationState,
  (builder) => {
    addCompleteStepActionCases(builder);
    addSaveReconversionProjectActionCases(builder);
    addFetchExpectedPhotovoltaicPerformanceActionCases(builder);
    addFetchCarbonStorageComparisonActionCases(builder);
    addRevertStepActionCases(builder);
  },
);
