import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  FricheSite,
  FricheSpaceType,
} from "@/components/pages/SiteFoncier/friche";
import { SiteFoncierType } from "@/components/pages/SiteFoncier/siteFoncier";

export enum FricheCreationStep {
  LAST_ACTIVITY_STEP = "LAST_ACTIVITY_STEP",
  SPACES_STEP = "SPACES_STEP",
  SPACES_SURFACE_AREA_STEP = "SPACES_SURFACE_AREA_STEP",
}

type FricheCreationState = {
  step: FricheCreationStep;
  nextSteps: FricheCreationStep[];
  fricheData: Partial<FricheSite>;
};

const fricheInitialState: FricheCreationState = {
  step: FricheCreationStep.LAST_ACTIVITY_STEP,
  nextSteps: [
    FricheCreationStep.SPACES_STEP,
    FricheCreationStep.SPACES_SURFACE_AREA_STEP,
  ],
  fricheData: {
    type: SiteFoncierType.FRICHE,
  },
};

const getNextSteps = (steps: FricheCreationStep[]) => {
  const [nextStep, ...nextSteps] = steps;
  return { nextStep, nextSteps };
};

const fricheCreationSlice = createSlice({
  name: "fricheCreation",
  initialState: fricheInitialState,
  reducers: {
    setLastActivity: (
      state,
      action: PayloadAction<FricheSite["lastActivity"]>,
    ) => {
      state.fricheData.lastActivity = action.payload;

      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setSpacesTypes: (state, action: PayloadAction<FricheSpaceType[]>) => {
      const fricheSpaces = action.payload;
      state.fricheData.spaces = fricheSpaces.map((spaceType) => ({
        type: spaceType,
      }));

      const { nextStep, nextSteps } = getNextSteps(state.nextSteps);
      state.step = nextStep;
      state.nextSteps = nextSteps;
    },
    setSpacesSurfaceArea: (
      state,
      action: PayloadAction<FricheSite["spaces"]>,
    ) => {
      state.fricheData.spaces = action.payload;
    },
  },
});

export const { setLastActivity, setSpacesTypes, setSpacesSurfaceArea } =
  fricheCreationSlice.actions;

export default fricheCreationSlice.reducer;
