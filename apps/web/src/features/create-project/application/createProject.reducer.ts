import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  ProjectType,
  RenewableEnergyType,
} from "@/features/create-project/domain/project.types";
import { SiteFoncier } from "@/features/create-site/domain/siteFoncier.types";

export type ProjectCreationState = {
  step: ProjectCreationStep;
  projectData: {
    types: ProjectType[];
    renewableEnergyTypes: RenewableEnergyType[];
    relatedSite: SiteFoncier | undefined;
  };
};

export enum ProjectCreationStep {
  PROJECT_TYPES = "PROJECT_TYPES",
  RENEWABLE_ENERGY_TYPES = "RENEWABLE_ENERGY_TYPES",
  CREATION_CONFIRMATION = "CREATION_CONFIRMATION",
  STAKEHOLDERS_INTRODUCTION = "STAKEHOLDERS_INTRODUCTION",
  STAKEHOLDERS_FUTURE_OPERATOR = "STAKEHOLDERS_FUTURE_OPERATOR",
  STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER = "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
  STAKEHOLDERS_REINSTATEMENT_FULL_TIME_JOBS = "STAKEHOLDERS_REINSTATEMENT_FULL_TIME_JOBS",
  STAKEHOLDERS_OPERATIONS_FULL_TIMES_JOBS = "STAKEHOLDERS_OPERATIONS_FULL_TIMES_JOBS",
  STAKEHOLDERS_FUTURE_OWNERSHIP_CHANGE = "STAKEHOLDERS_FUTURE_OWNERSHIP_CHANGE",
  STAKEHOLDERS_FUTURE_OWNER = "STAKEHOLDERS_FUTURE_OWNER",
}

export const projectCreationInitialState: ProjectCreationState = {
  step: ProjectCreationStep.PROJECT_TYPES,
  projectData: {
    types: [],
    renewableEnergyTypes: [],
    relatedSite: undefined,
  },
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
    setReinstatementContractOwner: (
      state,
      action: PayloadAction<Project["reinstatementContractOwner"]>,
    ) => {
      state.projectData.reinstatementContractOwner = action.payload;
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
  goToStep,
} = projectCreationSlice.actions;

export default projectCreationSlice.reducer;
