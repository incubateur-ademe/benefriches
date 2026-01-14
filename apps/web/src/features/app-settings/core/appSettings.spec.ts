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
      askForConfirmationOnStepRevert: true,
      displayExpressSiteDisclaimer: true,
      displayImpactsAccuracyDisclaimer: true,
      impactsOnboardingLastSeenAt: null,
      urbanSprawlComparisonOnboardingLastSeenAt: null,
    });
    const store = createStore(
      getTestAppDependencies({
        appSettingsService,
      }),
    );
    const rootState = store.getState();
    expect(selectAppSettings(rootState)).toEqual({
      askForConfirmationOnStepRevert: true,
      displayExpressSiteDisclaimer: true,
      displayImpactsAccuracyDisclaimer: true,
      impactsOnboardingLastSeenAt: null,
      urbanSprawlComparisonOnboardingLastSeenAt: null,
    });
  });

  it("should update given app setting and persist it", () => {
    const appSettingsService = new InMemoryAppSettings();
    appSettingsService.persist({
      ...DEFAULT_APP_SETTINGS,
      displayExpressSiteDisclaimer: false,
    });
    const store = createStore(
      getTestAppDependencies({
        appSettingsService,
      }),
    );
    store.dispatch(appSettingUpdated({ field: "displayExpressSiteDisclaimer", value: true }));
    const rootState = store.getState();

    const expectedAppSettings = {
      ...DEFAULT_APP_SETTINGS,
      displayExpressSiteDisclaimer: true,
    };
    expect(selectAppSettings(rootState)).toEqual(expectedAppSettings);
    expect(appSettingsService.getAll()).toEqual(expectedAppSettings);
  });

  it("should update impactsOnboardingLastSeenAt and persist it", () => {
    const appSettingsService = new InMemoryAppSettings();
    const store = createStore(
      getTestAppDependencies({
        appSettingsService,
      }),
    );
    const timestamp = "2025-01-15T12:00:00.000Z";

    store.dispatch(appSettingUpdated({ field: "impactsOnboardingLastSeenAt", value: timestamp }));
    const rootState = store.getState();

    expect(selectAppSettings(rootState).impactsOnboardingLastSeenAt).toBe(timestamp);
    expect(appSettingsService.getAll().impactsOnboardingLastSeenAt).toBe(timestamp);
  });
});
