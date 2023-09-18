import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  SiteFoncier,
  SiteFoncierType,
} from "@/components/pages/SiteFoncier/siteFoncier";

export enum CreationStep {
  TYPE_STEP = "TYPE_STEP",
  ADDRESS_STEP = "ADDRESS_STEP",
  FRICHE_CREATION = "FRICHE_CREATION",
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
      state.step = CreationStep.FRICHE_CREATION;
    },
  },
});

export const fricheCreationSlice = createSlice;

export const { setSiteType, setAddress } = siteCreationSlice.actions;

export default siteCreationSlice.reducer;
