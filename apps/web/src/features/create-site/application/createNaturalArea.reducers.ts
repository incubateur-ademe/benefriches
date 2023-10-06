import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  Forest,
  NaturalArea,
  NaturalAreaSpaceType,
  OperationStatus,
  Prairie,
  TreeType,
  VegetationType,
} from "@/features/create-site/domain/naturalArea.types";
import { SiteFoncierType } from "@/features/create-site/domain/siteFoncier.types";

export enum NaturalAreaCreationStep {
  // spaces
  SPACES_STEP = "SPACES_STEP",
  SPACES_SURFACE_AREA_STEP = "SPACES_SURFACE_AREA_STEP",
  // prairie
  PRAIRIE_VEGETATION_STEP = "PRAIRIE_VEGETATION_STEP",
  PRAIRIE_VEGETATION_DISTRIBUTION_STEP = "PRAIRIE_VEGETATION_DISTRIBUTION_STEP",
  // forest
  FOREST_TREES_STEP = "FOREST_TREES_STEP",
  FOREST_TREES_DISTRIBUTION = "FOREST_TREES_DISTRIBUTION_STEP",
  // carbon summary
  SOIL_SUMMARY_STEP = "SOIL_SUMMARY_STEP",
  CARBON_SUMMARY_STEP = "CARBON_SUMMARY_STEP",
  // site management
  OWNER_STEP = "OWNER_STEP",
  OPERATION_STEP = "OPERATION_STEP",
  FULL_TIME_JOBS_INVOLVED_STEP = "FULL_TIME_JOBS_INVOLVED_STEP",
  YEARLY_EXPENSES_STEP = "YEARLY_EXPENSES_STEP",
  YEARLY_INCOME_STEP = "YEARLY_INCOME_STEP",
  // other
  NAMING_STEP = "NAMING",
  CONFIRMATION_STEP = "CONFIRMATION_STEP",
}

type NaturalAreaCreationState = {
  step: NaturalAreaCreationStep;
  nextSteps: NaturalAreaCreationStep[];
  naturalAreaData: Partial<NaturalArea>;
};

const naturalAreaInitialState: NaturalAreaCreationState = {
  step: NaturalAreaCreationStep.SPACES_STEP,
  nextSteps: [
    NaturalAreaCreationStep.SPACES_SURFACE_AREA_STEP,
    NaturalAreaCreationStep.SOIL_SUMMARY_STEP,
    NaturalAreaCreationStep.CARBON_SUMMARY_STEP,
    NaturalAreaCreationStep.OWNER_STEP,
    NaturalAreaCreationStep.OPERATION_STEP,
    NaturalAreaCreationStep.FULL_TIME_JOBS_INVOLVED_STEP,
    NaturalAreaCreationStep.YEARLY_EXPENSES_STEP,
    NaturalAreaCreationStep.YEARLY_INCOME_STEP,
    NaturalAreaCreationStep.NAMING_STEP,
    NaturalAreaCreationStep.CONFIRMATION_STEP,
  ],
  naturalAreaData: {
    type: SiteFoncierType.NATURAL_AREA,
  },
};

const getNextSteps = (steps: NaturalAreaCreationStep[]) => {
  const [nextStep, ...nextSteps] = steps;
  return { nextStep, nextSteps };
};

const naturalAreaCreationSlice = createSlice({
  name: "naturalAreaCreation",
  initialState: naturalAreaInitialState,
  reducers: {
    setSpacesTypes: (state, action: PayloadAction<NaturalAreaSpaceType[]>) => {
      // setting spaces
      const naturalAreaSpaces = action.payload;
      state.naturalAreaData.spaces = naturalAreaSpaces.map((spaceType) => ({
        type: spaceType,
      }));

      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;

      if (naturalAreaSpaces.includes(NaturalAreaSpaceType.PRAIRIE)) {
        state.nextSteps = [
          NaturalAreaCreationStep.PRAIRIE_VEGETATION_STEP,
          ...state.nextSteps,
        ];
      }

      if (naturalAreaSpaces.includes(NaturalAreaSpaceType.FOREST)) {
        state.nextSteps = [
          NaturalAreaCreationStep.FOREST_TREES_STEP,
          ...state.nextSteps,
        ];
      }
    },
    setSpacesSurfaceArea: (
      state,
      action: PayloadAction<Partial<Record<NaturalAreaSpaceType, number>>>,
    ) => {
      state.naturalAreaData.spaces = Object.entries(action.payload).map(
        ([type, surface]) => {
          return { type, surface };
        },
      );
      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setForestTrees: (state, action: PayloadAction<TreeType[]>) => {
      const trees = action.payload;
      const forest = state.naturalAreaData.spaces?.find(
        (space) => space.type === NaturalAreaSpaceType.FOREST,
      ) as Forest | undefined;

      if (forest) {
        forest.trees = trees.map((treeType) => ({ type: treeType }));
      }

      if (trees.length > 1) {
        state.nextSteps = [
          NaturalAreaCreationStep.FOREST_TREES_DISTRIBUTION,
          ...state.nextSteps,
        ];
      }
      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setForestTreesSurfaces: (
      state,
      action: PayloadAction<Partial<Record<TreeType, number>>>,
    ) => {
      const treesSurfaces = action.payload;
      const forest = state.naturalAreaData.spaces?.find(
        (space) => space.type === NaturalAreaSpaceType.FOREST,
      ) as Forest;

      forest.trees = Object.entries(treesSurfaces).map(
        ([treeType, surface]) => {
          return { type: treeType as TreeType, surface };
        },
      );

      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setPrairieVegetation: (state, action: PayloadAction<VegetationType[]>) => {
      const vegetation = action.payload;
      const prairie = state.naturalAreaData.spaces?.find(
        (space) => space.type === NaturalAreaSpaceType.PRAIRIE,
      ) as Prairie | undefined;

      if (prairie) {
        prairie.vegetation = vegetation.map((vegetationType) => ({
          type: vegetationType,
        }));
      }

      if (vegetation.length > 1) {
        state.nextSteps = [
          NaturalAreaCreationStep.PRAIRIE_VEGETATION_DISTRIBUTION_STEP,
          ...state.nextSteps,
        ];
      }
      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setPrairieVegetationSurfaces: (
      state,
      action: PayloadAction<Partial<Record<VegetationType, number>>>,
    ) => {
      const vegetationSurfaces = action.payload;
      const prairie = state.naturalAreaData.spaces?.find(
        (space) => space.type === NaturalAreaSpaceType.PRAIRIE,
      ) as Prairie;

      prairie.vegetation = Object.entries(vegetationSurfaces).map(
        ([vegetationType, surface]) => {
          return { type: vegetationType as VegetationType, surface };
        },
      );

      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setOwners: (state, action: PayloadAction<NaturalArea["owners"]>) => {
      state.naturalAreaData.owners = action.payload;
      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setOperationData: (
      state,
      action: PayloadAction<{
        operationStatus: OperationStatus;
        operatingCompanyName?: string;
      }>,
    ) => {
      const { operationStatus, operatingCompanyName } = action.payload;
      state.naturalAreaData.operationStatus = operationStatus;
      if (operatingCompanyName) {
        state.naturalAreaData.operatingCompanyName = operatingCompanyName;
      }
      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setFullTimeJobsInvolved: (state, action: PayloadAction<number>) => {
      state.naturalAreaData.fullTimeJobsInvolvedCount = action.payload;
      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setYearlyOperationExpenses: (
      state,
      action: PayloadAction<{
        rent: number;
        taxes: number;
        otherExpenses: number;
      }>,
    ) => {
      state.naturalAreaData.yearlyOperationExpenses = action.payload;
      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setYearlyOperationIncome: (
      state,
      action: PayloadAction<{
        operations: number;
        other: number;
      }>,
    ) => {
      state.naturalAreaData.yearlyOperationIncome = action.payload;
      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setNameAndDescription: (
      state,
      action: PayloadAction<{ name: string; description?: string }>,
    ) => {
      state.naturalAreaData.name = action.payload.name;
      if (action.payload.description)
        state.naturalAreaData.description = action.payload.description;
      state.step = NaturalAreaCreationStep.CONFIRMATION_STEP;
    },
    goToNextStep: (state) => {
      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
  },
});

export const {
  setSpacesTypes,
  setSpacesSurfaceArea,
  setForestTrees,
  setForestTreesSurfaces,
  setPrairieVegetation,
  setPrairieVegetationSurfaces,
  setOwners,
  setOperationData,
  setFullTimeJobsInvolved,
  setYearlyOperationExpenses,
  setYearlyOperationIncome,
  setNameAndDescription,
  goToNextStep,
} = naturalAreaCreationSlice.actions;

export default naturalAreaCreationSlice.reducer;
