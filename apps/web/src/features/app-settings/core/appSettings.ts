import { createAction, createReducer } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

export type AppSettings = {
  displayExpressSiteDisclaimer: boolean;
  displayImpactsAccuracyDisclaimer: boolean;
  askForConfirmationOnStepRevert: boolean;
  impactsOnboardingLastSeenAt: string | null;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  displayExpressSiteDisclaimer: true,
  displayImpactsAccuracyDisclaimer: true,
  askForConfirmationOnStepRevert: true,
  impactsOnboardingLastSeenAt: null,
};

export const selectAppSettings = (state: RootState) => state.appSettings;

type AppSettingUpdatedPayload = {
  [K in keyof AppSettings]: {
    field: K;
    value: AppSettings[K];
  };
}[keyof AppSettings];
export const appSettingUpdated = createAction<AppSettingUpdatedPayload>("appSettings/updated");

export const appSettingsReducer = createReducer(DEFAULT_APP_SETTINGS, (builder) => {
  builder.addCase(appSettingUpdated, (state, action) => {
    const setField = <K extends keyof AppSettings>(field: K, value: AppSettings[K]) => {
      state[field] = value;
    };
    setField(action.payload.field, action.payload.value);
  });
});
