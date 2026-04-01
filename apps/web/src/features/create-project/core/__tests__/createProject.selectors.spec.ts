import { createStore } from "@/app/store/store";
import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import {
  selectCommonResultViewData,
  selectCustomCreationResultViewData,
  selectUrbanProjectCreationWizardViewData,
} from "../createProject.selectors";

describe("createProject ViewData selectors", () => {
  describe("selectCommonResultViewData", () => {
    it("returns projectId and shouldGoThroughOnboarding from state", () => {
      const store = createStore(getTestAppDependencies(), {
        appSettings: {
          ...DEFAULT_APP_SETTINGS,
          impactsOnboardingLastSeenAt: null,
        },
      });

      const viewData = selectCommonResultViewData(store.getState());

      expect(viewData).toEqual({
        projectId: expect.any(String),
        shouldGoThroughOnboarding: true,
      });
    });
  });

  describe("selectCustomCreationResultViewData", () => {
    it("returns default idle state when naming step not yet completed", () => {
      const store = createStore(getTestAppDependencies());

      const viewData = selectCustomCreationResultViewData(store.getState());

      expect(viewData).toEqual({
        projectId: expect.any(String),
        projectName: "",
        saveState: "idle",
        shouldGoThroughOnboarding: true,
      });
    });
  });

  describe("selectUrbanProjectCreationWizardViewData", () => {
    it("returns current step and saveState from state", () => {
      const store = createStore(getTestAppDependencies());

      const viewData = selectUrbanProjectCreationWizardViewData(store.getState());

      expect(viewData).toEqual({
        currentStep: expect.any(String),
        saveState: "idle",
      });
    });
  });
});
