import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  Project,
  ProjectSite,
  ProjectType,
  RenewableEnergyType,
} from "@/features/create-project/domain/project.types";

export type ProjectCreationState = {
  step: ProjectCreationStep;
  projectData: Partial<Project>;
  siteData: ProjectSite | null;
};

export enum ProjectCreationStep {
  PROJECT_TYPES = "PROJECT_TYPES",
  RENEWABLE_ENERGY_TYPES = "RENEWABLE_ENERGY_TYPES",
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
  // Confirmation
  CREATION_CONFIRMATION = "CREATION_CONFIRMATION",
}

export const projectCreationInitialState: ProjectCreationState = {
  step: ProjectCreationStep.PROJECT_TYPES,
  projectData: {
    yearlyProjectedCosts: [],
  },
  siteData: null,
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
    goToStep: (state, action: PayloadAction<ProjectCreationStep>) => {
      state.step = action.payload;
    },
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
  goToStep,
} = projectCreationSlice.actions;

export default projectCreationSlice.reducer;
