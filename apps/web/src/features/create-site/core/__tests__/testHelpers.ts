import { RootState } from "@/shared/core/store-config/store";

import { SiteCreationStep } from "../createSite.reducer";

export const expectNewCurrentStep = (
  initialState: RootState,
  newState: RootState,
  expectedNewCurrentStep: SiteCreationStep,
) => {
  expect(newState.siteCreation.stepsHistory).toEqual([
    ...initialState.siteCreation.stepsHistory,
    expectedNewCurrentStep,
  ]);
};

export const expectStepReverted = (initialState: RootState, newState: RootState) => {
  expect(newState.siteCreation.stepsHistory).toEqual(
    initialState.siteCreation.stepsHistory.slice(0, -1),
  );
};

export const expectSiteDataDiff = (
  initialState: RootState,
  newState: RootState,
  siteDataDiff: Partial<RootState["siteCreation"]["siteData"]>,
) => {
  expect(newState.siteCreation.siteData).toEqual({
    ...initialState.siteCreation.siteData,
    ...siteDataDiff,
  });
};

export const expectSiteDataUnchanged = (initialState: RootState, newState: RootState) => {
  expect(newState.siteCreation.siteData).toEqual(initialState.siteCreation.siteData);
};
