import { createAction, createReducer } from "@reduxjs/toolkit";

import { AppDependencies, AppDispatch, RootState } from "@/app/application/store";

export type AppSettings = {
  shouldDisplayMyProjectTourGuide: boolean;
  shouldDisplayDemoMyProjectTourGuide: boolean;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  shouldDisplayMyProjectTourGuide: true,
  shouldDisplayDemoMyProjectTourGuide: true,
};

export const selectAppSettings = (state: RootState) => state.appSettings;

type SetAppSettingPayload = {
  [K in keyof AppSettings]: { setting: K; value: AppSettings[K] };
}[keyof AppSettings];

const setAppSetting = createAction<SetAppSettingPayload>("appSettings/changed");

export const appSettingChanged = (payload: SetAppSettingPayload) => {
  return (dispatch: AppDispatch, getState: () => RootState, extra: AppDependencies) => {
    dispatch(setAppSetting(payload));

    extra.appSettingsService.persist(getState().appSettings);
  };
};

export const appSettingsReducer = createReducer(DEFAULT_APP_SETTINGS, (builder) => {
  builder.addCase(setAppSetting, (state, action) => {
    const { setting, value } = action.payload;
    state[setting] = value;
  });
});
