import { createStore } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { InMemoryAppSettings } from "../infrastructure/InMemoryAppSettings";
import { appSettingUpdated, DEFAULT_APP_SETTINGS, selectAppSettings } from "./appSettings";

describe("App settings", () => {
  it("should get default app settings", () => {
    const store = createStore(getTestAppDependencies());
    const rootState = store.getState();
    expect(selectAppSettings(rootState)).toEqual(DEFAULT_APP_SETTINGS);
  });

  it("should get persisted app settings", () => {
    const appSettingsService = new InMemoryAppSettings();
    appSettingsService.persist({
      surfaceAreaInputMode: "squareMeters",
      askForConfirmationOnStepRevert: true,
    });
    const store = createStore(
      getTestAppDependencies({
        appSettingsService,
      }),
    );
    const rootState = store.getState();
    expect(selectAppSettings(rootState)).toEqual({
      surfaceAreaInputMode: "squareMeters",
      askForConfirmationOnStepRevert: true,
    });
  });

  it("should update given app setting and persist it", () => {
    const appSettingsService = new InMemoryAppSettings();
    appSettingsService.persist({
      ...DEFAULT_APP_SETTINGS,
      surfaceAreaInputMode: "percentage",
    });
    const store = createStore(
      getTestAppDependencies({
        appSettingsService,
      }),
    );
    store.dispatch(appSettingUpdated({ field: "surfaceAreaInputMode", value: "squareMeters" }));
    const rootState = store.getState();

    const expectedAppSettings = {
      ...DEFAULT_APP_SETTINGS,
      surfaceAreaInputMode: "squareMeters",
    };
    expect(selectAppSettings(rootState)).toEqual(expectedAppSettings);
    expect(appSettingsService.getAll()).toEqual(expectedAppSettings);
  });
});
