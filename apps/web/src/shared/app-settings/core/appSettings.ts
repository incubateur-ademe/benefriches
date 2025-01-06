import { createAction, createReducer } from "@reduxjs/toolkit";

import { RootState } from "@/app/application/store";

export type AppSettings = {
  shouldDisplayMyProjectTourGuide: boolean;
  shouldDisplayDemoMyProjectTourGuide: boolean;
  surfaceAreaInputMode: "percentage" | "squareMeters";
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  shouldDisplayMyProjectTourGuide: true,
  shouldDisplayDemoMyProjectTourGuide: true,
  surfaceAreaInputMode: "percentage",
};

export const selectAppSettings = (state: RootState) => state.appSettings;

const updateActionPrefix = "appSettings/changed/";
export const isAppSettingsUpdateAction = (actionName: string) =>
  actionName.startsWith(updateActionPrefix);

const createUpdateAction = <K extends keyof AppSettings>(key: K) =>
  createAction<AppSettings[K]>(`${updateActionPrefix}${key}`);

export const surfaceAreaInputModeChanged = createUpdateAction("surfaceAreaInputMode");
export const displayMyProjectTourGuideChanged = createUpdateAction(
  "shouldDisplayMyProjectTourGuide",
);
export const displayDemoMyProjectTourGuideChanged = createUpdateAction(
  "shouldDisplayDemoMyProjectTourGuide",
);

export const appSettingsReducer = createReducer(DEFAULT_APP_SETTINGS, (builder) => {
  builder.addCase(surfaceAreaInputModeChanged, (state, action) => {
    state.surfaceAreaInputMode = action.payload;
  });
  builder.addCase(displayMyProjectTourGuideChanged, (state, action) => {
    state.shouldDisplayMyProjectTourGuide = action.payload;
  });
  builder.addCase(displayDemoMyProjectTourGuideChanged, (state, action) => {
    state.shouldDisplayDemoMyProjectTourGuide = action.payload;
  });
});
