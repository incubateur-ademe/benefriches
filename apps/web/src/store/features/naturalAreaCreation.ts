import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  NaturalArea,
  SiteFoncierType,
} from "@/components/pages/SiteFoncier/siteFoncier";

export enum NaturalAreaCreationStep {
  // spaces
  SPACES_STEP = "SPACES_STEP",
  SURFACE_STEP = "SURFACE_STEP",
  SPACES_SURFACE_AREA_STEP = "SPACES_SURFACE_AREA_STEP",
  // site management
  OWNER_STEP = "OWNER_STEP",
  RUNNING_COMPANY_STEP = "RUNNING_COMPANY_STEP",
  FULL_TIME_JOBS_INVOLVED_STEP = "FULL_TIME_JOBS_INVOLVED_STEP",
  PROFIT_AND_RENT_PAID_STEP = "PROFIT_AND_RENT_PAID_STEP",
  // other
  NAMING_STEP = "naming",
  CONFIRMATION_STEP = "CONFIRMATION_STEP",
}

type NaturalAreaCreationState = {
  step: NaturalAreaCreationStep;
  naturalAreaData: Partial<NaturalArea>;
};

const naturalAreaInitialState: NaturalAreaCreationState = {
  step: NaturalAreaCreationStep.SPACES_STEP,
  naturalAreaData: {
    type: SiteFoncierType.NATURAL_AREA,
  },
};

const naturalAreaCreationSlice = createSlice({
  name: "naturalAreaCreation",
  initialState: naturalAreaInitialState,
  reducers: {
    setSpacesTypes: (state, action: PayloadAction<NaturalArea["spaces"]>) => {
      state.naturalAreaData.spaces = action.payload;
      state.step = NaturalAreaCreationStep.SURFACE_STEP;
    },
    setSurface: (state, action: PayloadAction<NaturalArea["surface"]>) => {
      state.naturalAreaData.surface = action.payload;
      state.step = NaturalAreaCreationStep.OWNER_STEP;
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
    setSpacesSurfaceArea: (
      state,
      action: PayloadAction<NaturalArea["spaces"]>,
    ) => {
      state.naturalAreaData.spaces = action.payload;
    },
  },
});

export const {
  setSurface,
  setSpacesTypes,
  setSpacesSurfaceArea,
  setOwners,
  setRunningCompany,
  setFullTimeJobsInvolved,
  setProfitAndRentPaid,
  setNameAndDescription,
} = naturalAreaCreationSlice.actions;

export default naturalAreaCreationSlice.reducer;
