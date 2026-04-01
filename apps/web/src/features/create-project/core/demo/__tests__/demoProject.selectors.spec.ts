import { createStore } from "@/app/store/store";
import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { relatedSiteData } from "../../__tests__/siteData.mock";
import { getInitialState } from "../../createProject.reducer";
import {
  selectDemoCreationResultViewData,
  selectDemoProjectSummaryViewData,
} from "../demoProject.selectors";

describe("demoProject ViewData selectors", () => {
  describe("selectDemoProjectSummaryViewData", () => {
    it("returns idle loadingState and undefined data when step not yet loaded", () => {
      const store = createStore(getTestAppDependencies());

      const viewData = selectDemoProjectSummaryViewData(store.getState());

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

      const viewData = selectDemoProjectSummaryViewData(store.getState());

      expect(viewData).toEqual({
        loadingState: "idle",
        data: undefined,
        siteName: relatedSiteData.name,
      });
    });
  });

  describe("selectDemoCreationResultViewData", () => {
    it("returns default idle state when express summary step not yet loaded", () => {
      const store = createStore(getTestAppDependencies());

      const viewData = selectDemoCreationResultViewData(store.getState());

      expect(viewData).toEqual({
        projectId: expect.any(String),
        projectName: "",
        saveState: "idle",
        shouldGoThroughOnboarding: true,
      });
    });
  });
});
