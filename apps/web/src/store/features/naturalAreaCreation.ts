import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  NaturalArea,
  NaturalAreaSpaceType,
  SiteFoncierType,
} from "@/components/pages/SiteFoncier/siteFoncier";

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
  // site management
  OWNER_STEP = "OWNER_STEP",
  RUNNING_COMPANY_STEP = "RUNNING_COMPANY_STEP",
  FULL_TIME_JOBS_INVOLVED_STEP = "FULL_TIME_JOBS_INVOLVED_STEP",
  PROFIT_AND_RENT_PAID_STEP = "PROFIT_AND_RENT_PAID_STEP",
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
    NaturalAreaCreationStep.OWNER_STEP,
    NaturalAreaCreationStep.NAMING_STEP,
    NaturalAreaCreationStep.CONFIRMATION_STEP,
  ],
  naturalAreaData: {
    type: SiteFoncierType.NATURAL_AREA,
  },
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

      // setting next steps
      state.step = state.nextSteps[0];
      state.nextSteps.shift();
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
      state.naturalAreaData.spaces = state.naturalAreaData.spaces!.map(
        ({ type }) => {
          return { type, surface: action.payload[type] };
        },
      );
      state.step = state.nextSteps[0];
      state.nextSteps.shift();
    },
    setOwners: (state, action: PayloadAction<NaturalArea["owners"]>) => {
      state.naturalAreaData.owners = action.payload;
      state.step = NaturalAreaCreationStep.RUNNING_COMPANY_STEP;
    },
    setRunningCompany: (state, action: PayloadAction<string>) => {
      state.naturalAreaData.runningCompany = action.payload;
      state.step = NaturalAreaCreationStep.FULL_TIME_JOBS_INVOLVED_STEP;
    },
    setFullTimeJobsInvolved: (state, action: PayloadAction<number>) => {
      state.naturalAreaData.fullTimeJobsInvolvedCount = action.payload;
      state.step = NaturalAreaCreationStep.PROFIT_AND_RENT_PAID_STEP;
    },
    setProfitAndRentPaid: (
      state,
      action: PayloadAction<{ profit: number; rentPaid?: number }>,
    ) => {
      state.naturalAreaData.yearlyProfitAmount = action.payload.profit;
      if (action.payload.rentPaid)
        state.naturalAreaData.yearlyRentAmount = action.payload.rentPaid;
      state.step = NaturalAreaCreationStep.NAMING_STEP;
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
      state.step = state.nextSteps[0];
      state.nextSteps.shift();
    },
  },
});

export const {
  setSpacesTypes,
  setSpacesSurfaceArea,
  setOwners,
  setRunningCompany,
  setFullTimeJobsInvolved,
  setProfitAndRentPaid,
  setNameAndDescription,
} = naturalAreaCreationSlice.actions;

export default naturalAreaCreationSlice.reducer;