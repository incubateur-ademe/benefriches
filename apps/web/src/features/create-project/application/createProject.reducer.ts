import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchRelatedSiteAction } from "./createProject.actions";

import {
  PhotovoltaicKeyParameter,
  Project,
  ProjectSite,
  ProjectType,
  RenewableEnergyType,
} from "@/features/create-project/domain/project.types";
import { SoilType } from "@/features/create-site/domain/siteFoncier.types";

export type ProjectCreationState = {
  step: ProjectCreationStep;
  projectData: Partial<Project>;
  siteData: ProjectSite | null;
  siteDataLoadingState: "idle" | "loading" | "success" | "error";
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
  PHOTOVOLTAIC_INFRASTRUCTURES_SURFACE = "PHOTOVOLTAIC_INFRASTRUCTURES_SURFACE",
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
  REVENUE_FINANCIAL_ASSISTANCE = "REVENUE_FINANCIAL_ASSISTANCE",
  REVENUE_PROJECTED_YEARLY_REVENUE = "REVENUE_PROJECTED_YEARLY_REVENUE",
  // Naming
  NAMING = "NAMING",
  // Confirmation
  CREATION_CONFIRMATION = "CREATION_CONFIRMATION",
}

export const projectCreationInitialState: ProjectCreationState = {
  step: ProjectCreationStep.PROJECT_TYPES,
  projectData: {
    yearlyProjectedCosts: [],
    yearlyProjectedRevenue: [],
    types: [],
    renewableEnergyTypes: [],
  },
  siteData: {
    id: "id-site",
    isFriche: true,
    owner: {
      id: "owner-uuid",
      name: "SARL Propriétaire",
      structureType: "company",
    },
    surfaceArea: 150000,
    name: "Friche industrielle de Blajan",
    soilsSurfaceAreas: {
      [SoilType.CULTIVATION]: 18500,
      [SoilType.FOREST_DECIDUOUS]: 120000,
      [SoilType.PRAIRIE_GRASS]: 10000,
      [SoilType.MINERAL_SOIL]: 900,
      [SoilType.BUILDINGS]: 600,
    },
  },
  siteDataLoadingState: "idle",
};

export const projectCreationSlice = createSlice({
  name: "projectCreation",
  initialState: projectCreationInitialState,
  reducers: {
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
        fullTimeJobs: number;
      }>,
    ) => {
      state.projectData.conversionFullTimeJobsInvolved =
        action.payload.fullTimeJobs;
      if (action.payload.reinstatementFullTimeJobs !== undefined) {
        state.projectData.reinstatementFullTimeJobsInvolved =
          action.payload.reinstatementFullTimeJobs;
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
    setPhotovoltaicInfrastructureSurfaces: (
      state,
      action: PayloadAction<{
        photovoltaicAccessPathsSurface: number;
        photovoltaicFoundationsSurface: number;
      }>,
    ) => {
      state.projectData.photovoltaicAccessPathsSurface =
        action.payload.photovoltaicAccessPathsSurface;
      state.projectData.photovoltaicFoundationsSurface =
        action.payload.photovoltaicFoundationsSurface;
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
  },
});

export const {
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
  setPhotovoltaicInfrastructureSurfaces,
  setSoilsSurfaceAreas,
} = projectCreationSlice.actions;

export default projectCreationSlice.reducer;
