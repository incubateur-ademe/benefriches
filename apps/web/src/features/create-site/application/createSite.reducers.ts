import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  SiteFoncier,
  SiteFoncierType,
} from "@/features/create-site/domain/siteFoncier.types";

export enum CreationStep {
  TYPE_STEP = "TYPE_STEP",
  ADDRESS_STEP = "ADDRESS_STEP",
  FRICHE_CREATION = "FRICHE_CREATION",
  NATURAL_SPACE_CREATION = "NATURAL_SPACE_CREATION",
}

type SiteCreationState = {
  step: CreationStep;
  siteData: Partial<SiteFoncier>;
};

const initialState: SiteCreationState = {
  step: CreationStep.TYPE_STEP,
  siteData: {},
};

export const siteCreationSlice = createSlice({
  name: "siteCreation",
  initialState,
  reducers: {
    setSiteType: (state, action: PayloadAction<SiteFoncierType>) => {
      state.siteData.type = action.payload;
      state.step = CreationStep.ADDRESS_STEP;
    },
    setAddress: (state, action: PayloadAction<string>) => {
      state.siteData.address = action.payload;
      switch (state.siteData.type) {
        case SiteFoncierType.FRICHE:
          state.step = CreationStep.FRICHE_CREATION;
          break;
        case SiteFoncierType.NATURAL_AREA:
          state.step = CreationStep.NATURAL_SPACE_CREATION;
          break;
        default:
          break;
      }
    },
  },
});

export const fricheCreationSlice = createSlice;

export const { setSiteType, setAddress } = siteCreationSlice.actions;

export default siteCreationSlice.reducer;
