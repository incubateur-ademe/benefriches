import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
import {
  fetchRelatedSiteAction,
  saveProjectAction,
} from "./createProject.actions";

import {
  PhotovoltaicKeyParameter,
  Project,
  ProjectSite,
  ProjectType,
  RenewableEnergyType,
} from "@/features/create-project/domain/project.types";

type LoadingState = "idle" | "loading" | "success" | "error";

export type ProjectCreationState = {
  step: ProjectCreationStep;
  projectData: Partial<Project>;
  siteData?: ProjectSite;
  siteDataLoadingState: LoadingState;
  saveProjectLoadingState: LoadingState;
};

export enum ProjectCreationStep {
  PROJECT_TYPES = "PROJECT_TYPES",
  RENEWABLE_ENERGY_TYPES = "RENEWABLE_ENERGY_TYPES",
  // Photovoltaic
  PHOTOVOLTAIC_KEY_PARAMETER = "PHOTOVOLTAIC_KEY_PARAMETER",
  PHOTOVOLTAIC_POWER = "PHOTOVOLTAIC_POWER",
  PHOTOVOLTAIC_SURFACE = "PHOTOVOLTAIC_SURFACE",
  PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION = "PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
  PHOTOVOLTAIC_CONTRACT_DURATION = "PHOTOVOLTAIC_CONTRACT_DURATION",
  SOILS_SURFACE_AREAS = "SOILS_SURFACE_AREAS",

  // Acteurs
  STAKEHOLDERS_INTRODUCTION = "STAKEHOLDERS_INTRODUCTION",
  STAKEHOLDERS_FUTURE_OPERATOR = "STAKEHOLDERS_FUTURE_OPERATOR",
  STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER = "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
  STAKEHOLDERS_RECONVERSION_FULL_TIME_JOBS = "STAKEHOLDERS_RECONVERSION_FULL_TIME_JOBS",
  STAKEHOLDERS_OPERATIONS_FULL_TIMES_JOBS = "STAKEHOLDERS_OPERATIONS_FULL_TIMES_JOBS",
  STAKEHOLDERS_FUTURE_OWNERSHIP_CHANGE = "STAKEHOLDERS_FUTURE_OWNERSHIP_CHANGE",
  STAKEHOLDERS_FUTURE_OWNER = "STAKEHOLDERS_FUTURE_OWNER",
  // Coûts et recette
  COSTS_INTRODUCTION = "COST_INTRODUCTION",
  COSTS_REINSTATEMENT = "COSTS_REINSTATEMENT",
  COSTS_PHOTOVOLTAIC_PANELS_INSTALLATION = "COSTS_PHOTOVOLTAIC_PANELS_INSTALLATION",
  COSTS_PROJECTED_YEARLY_COSTS = "COSTS_PROJECTED_YEARLY_COSTS",
  REVENUE_INTRODUCTION = "REVENUE_INTRODUCTION",
  REVENUE_PROJECTED_YEARLY_REVENUE = "REVENUE_PROJECTED_YEARLY_REVENUE",
  REVENUE_FINANCIAL_ASSISTANCE = "REVENUE_FINANCIAL_ASSISTANCE",
  // Naming
  NAMING = "NAMING",
  // Confirmation
  CREATION_CONFIRMATION = "CREATION_CONFIRMATION",
}

export const getInitialState = (): ProjectCreationState => {
  return {
    step: ProjectCreationStep.PROJECT_TYPES,
    projectData: {
      id: uuid(),
      yearlyProjectedCosts: [],
      yearlyProjectedRevenue: [],
      types: [],
      renewableEnergyTypes: [],
    },
    siteData: undefined,
    siteDataLoadingState: "idle",
    saveProjectLoadingState: "idle",
  };
};

export const projectCreationSlice = createSlice({
  name: "projectCreation",
  initialState: getInitialState(),
  reducers: {
    resetState: () => {
      return getInitialState();
    },
    setTypes: (state, action: PayloadAction<ProjectType[]>) => {
      state.projectData.types = action.payload;
    },
    setRenewableEnergyTypes: (
      state,
      action: PayloadAction<RenewableEnergyType[]>,
    ) => {
      state.projectData.renewableEnergyTypes = action.payload;
    },
    setFutureOperator: (
      state,
      action: PayloadAction<Project["futureOperator"]>,
    ) => {
      state.projectData.futureOperator = action.payload;
    },
    setConversionFullTimeJobsInvolved: (
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
        state.projectData.reinstatementFullTimeJobsInvolved =
          reinstatementFullTimeJobs;
      }
    },
    setOperationsFullTimeJobsInvolved: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.projectData.operationsFullTimeJobsInvolved = action.payload;
    },
    setReinstatementContractOwner: (
      state,
      action: PayloadAction<Project["reinstatementContractOwner"]>,
    ) => {
      state.projectData.reinstatementContractOwner = action.payload;
    },
    setReinstatementCost: (state, action: PayloadAction<number>) => {
      state.projectData.reinstatementCost = action.payload;
    },
    setPhotovoltaicPanelsInstallationCost: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.projectData.photovoltaicPanelsInstallationCost = action.payload;
    },
    addYearlyProjectedCosts: (
      state,
      action: PayloadAction<Project["yearlyProjectedCosts"]>,
    ) => {
      state.projectData.yearlyProjectedCosts = [
        ...(state.projectData.yearlyProjectedCosts ?? []),
        ...action.payload,
      ];
    },
    setFinancialAssistanceRevenue: (state, action: PayloadAction<number>) => {
      state.projectData.financialAssistanceRevenue = action.payload;
    },
    addYearlyProjectedRevenue: (
      state,
      action: PayloadAction<Project["yearlyProjectedRevenue"]>,
    ) => {
      state.projectData.yearlyProjectedRevenue = [
        ...(state.projectData.yearlyProjectedRevenue ?? []),
        ...action.payload,
      ];
    },
    setNameAndDescription: (
      state,
      action: PayloadAction<{ name: string; description?: string }>,
    ) => {
      const { name, description } = action.payload;
      state.projectData.name = name;
      if (description) state.projectData.description = description;
    },
    setPhotovoltaicKeyParameter: (
      state,
      action: PayloadAction<PhotovoltaicKeyParameter>,
    ) => {
      state.projectData.photovoltaicKeyParameter = action.payload;
    },
    setPhotovoltaicInstallationElectricalPower: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.projectData.photovoltaicInstallationElectricalPowerKWc =
        action.payload;
    },
    setPhotovoltaicInstallationSurface: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.projectData.photovoltaicInstallationSurfaceSquareMeters =
        action.payload;
    },
    setPhotovoltaicExpectedAnnualProduction: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.projectData.photovoltaicExpectedAnnualProduction = action.payload;
    },
    setPhotovoltaicContractDuration: (state, action: PayloadAction<number>) => {
      state.projectData.photovoltaicContractDuration = action.payload;
    },
    setSoilsSurfaceAreas: (
      state,
      action: PayloadAction<Project["soilsSurfaceAreas"]>,
    ) => {
      state.projectData.soilsSurfaceAreas = action.payload;
    },
    goToStep: (state, action: PayloadAction<ProjectCreationStep>) => {
      state.step = action.payload;
    },
  },
  extraReducers(builder) {
    /* fetch related site */
    builder.addCase(fetchRelatedSiteAction.pending, (state) => {
      state.siteDataLoadingState = "loading";
    });
    builder.addCase(fetchRelatedSiteAction.fulfilled, (state, action) => {
      state.siteDataLoadingState = "success";
      state.siteData = action.payload;
    });
    builder.addCase(fetchRelatedSiteAction.rejected, (state) => {
      state.siteDataLoadingState = "error";
    });
    /* save project */
    builder.addCase(saveProjectAction.pending, (state) => {
      state.saveProjectLoadingState = "loading";
    });
    builder.addCase(saveProjectAction.fulfilled, (state) => {
      state.saveProjectLoadingState = "success";
    });
    builder.addCase(saveProjectAction.rejected, (state) => {
      state.saveProjectLoadingState = "error";
    });
  },
});

export const {
  resetState,
  setTypes,
  setRenewableEnergyTypes,
  setFutureOperator,
  setReinstatementContractOwner,
  setConversionFullTimeJobsInvolved,
  setOperationsFullTimeJobsInvolved,
  setReinstatementCost,
  setPhotovoltaicPanelsInstallationCost,
  addYearlyProjectedCosts,
  setFinancialAssistanceRevenue,
  addYearlyProjectedRevenue,
  setNameAndDescription,
  goToStep,
  setPhotovoltaicKeyParameter,
  setPhotovoltaicInstallationElectricalPower,
  setPhotovoltaicInstallationSurface,
  setPhotovoltaicExpectedAnnualProduction,
  setPhotovoltaicContractDuration,
  setSoilsSurfaceAreas,
} = projectCreationSlice.actions;

export default projectCreationSlice.reducer;
