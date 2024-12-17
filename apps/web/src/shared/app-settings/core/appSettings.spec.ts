import { createStore } from "@/app/application/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { InMemoryAppSettings } from "../infrastructure/InMemoryAppSettings";
import { appSettingChanged, DEFAULT_APP_SETTINGS, selectAppSettings } from "./appSettings";

describe("App settings", () => {
  it("should get default app settings", () => {
    const store = createStore(getTestAppDependencies());
    const rootState = store.getState();
    expect(selectAppSettings(rootState)).toEqual(DEFAULT_APP_SETTINGS);
  });

  it("should get persisted app settings", () => {
    const appSettingsService = new InMemoryAppSettings();
    appSettingsService.persist({
      shouldDisplayMyProjectTourGuide: true,
      shouldDisplayDemoMyProjectTourGuide: false,
    });
    const store = createStore(
      getTestAppDependencies({
        appSettingsService,
      }),
    );
    const rootState = store.getState();
    expect(selectAppSettings(rootState)).toEqual({
      shouldDisplayMyProjectTourGuide: true,
      shouldDisplayDemoMyProjectTourGuide: false,
    });
  });

  it("should update given app setting and persist it", () => {
    const appSettingsService = new InMemoryAppSettings();
    appSettingsService.persist({
      ...DEFAULT_APP_SETTINGS,
      shouldDisplayMyProjectTourGuide: false,
    });
    const store = createStore(
      getTestAppDependencies({
        appSettingsService,
      }),
    );
    store.dispatch(appSettingChanged({ setting: "shouldDisplayMyProjectTourGuide", value: true }));
    const rootState = store.getState();

    const expectedAppSettings = {
      ...DEFAULT_APP_SETTINGS,
      shouldDisplayMyProjectTourGuide: true,
    };
    expect(selectAppSettings(rootState)).toEqual(expectedAppSettings);
    expect(appSettingsService.getAll()).toEqual(expectedAppSettings);
  });
});
