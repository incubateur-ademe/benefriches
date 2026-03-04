import { createStore } from "@/app/store/store";
import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { getInitialState } from "../createProject.reducer";
import {
  selectCommonResultViewData,
  selectCustomCreationResultViewData,
  selectExpressCreationResultViewData,
  selectPVExpressCreationResultViewData,
  selectUrbanProjectCreationWizardViewData,
  selectUrbanProjectExpressSummaryViewData,
} from "../createProject.selectors";
import { relatedSiteData } from "./siteData.mock";

describe("createProject ViewData selectors", () => {
  describe("selectUrbanProjectExpressSummaryViewData", () => {
    it("returns idle loadingState and undefined data when step not yet loaded", () => {
      const store = createStore(getTestAppDependencies());

      const viewData = selectUrbanProjectExpressSummaryViewData(store.getState());

      expect(viewData).toEqual({
        loadingState: "idle",
        data: undefined,
        siteName: "",
      });
    });

    it("returns siteName from site data", () => {
      const store = createStore(getTestAppDependencies(), {
        projectCreation: {
          ...getInitialState(),
          siteData: relatedSiteData,
        },
        appSettings: DEFAULT_APP_SETTINGS,
      });

      const viewData = selectUrbanProjectExpressSummaryViewData(store.getState());

      expect(viewData).toEqual({
        loadingState: "idle",
        data: undefined,
        siteName: relatedSiteData.name,
      });
    });
  });

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

  describe("selectExpressCreationResultViewData", () => {
    it("returns default idle state when express summary step not yet loaded", () => {
      const store = createStore(getTestAppDependencies());

      const viewData = selectExpressCreationResultViewData(store.getState());

      expect(viewData).toEqual({
        projectId: expect.any(String),
        projectName: "",
        saveState: "idle",
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

  describe("selectPVExpressCreationResultViewData", () => {
    it("returns default idle state when express data not yet loaded", () => {
      const store = createStore(getTestAppDependencies());

      const viewData = selectPVExpressCreationResultViewData(store.getState());

      expect(viewData).toEqual({
        projectId: expect.any(String),
        projectName: "",
        saveState: "idle",
        shouldGoThroughOnboarding: true,
      });
    });
  });
});
