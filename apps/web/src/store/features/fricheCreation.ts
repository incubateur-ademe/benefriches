import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { FricheSite } from "@/components/pages/SiteFoncier/friche";
import { SiteFoncierType } from "@/components/pages/SiteFoncier/siteFoncier";

export enum FricheCreationStep {
  LAST_ACTIVITY_STEP = "LAST_ACTIVITY_STEP",
  SPACES_STEP = "SPACES_STEP",
  SPACES_SURFACE_AREA_STEP = "SPACES_SURFACE_AREA_STEP",
}

type FricheCreationState = {
  step: FricheCreationStep;
  fricheData: Partial<FricheSite>;
};

const fricheInitialState: FricheCreationState = {
  step: FricheCreationStep.LAST_ACTIVITY_STEP,
  fricheData: {
    type: SiteFoncierType.FRICHE,
  },
};

const fricheCreationSlice = createSlice({
  name: "fricheCreation",
  initialState: fricheInitialState,
  reducers: {
    setLastActivity: (
      state,
      action: PayloadAction<FricheSite["lastActivity"] | null>,
    ) => {
      if (action.payload) {
        state.fricheData.lastActivity = action.payload;
      }
      state.step = FricheCreationStep.SPACES_STEP;
    },
    setSpacesTypes: (state, action: PayloadAction<FricheSite["spaces"]>) => {
      state.fricheData.spaces = action.payload;
      state.step = FricheCreationStep.SPACES_SURFACE_AREA_STEP;
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
