import {
  photovoltaicProjectImpactsResultDto as photovoltaicProjectImpactMock,
  photovoltaicProjectImpactMockMeta,
} from "shared";

import { createStore, type RootState } from "@/app/store/store";
import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { selectImpactsPageViewData } from "../selectors/projectImpacts.selectors";

const MOCK_STATES = {
  projectImpacts: {
    dataLoadingState: {
      impacts: "idle",
      urbanSprawlSimulation: "idle",
    },
    evaluationPeriod: photovoltaicProjectImpactMock.projectionYears.length,
    impacts: photovoltaicProjectImpactMock,
    contextData: photovoltaicProjectImpactMockMeta,
  } satisfies RootState["projectImpacts"],
  appSettings: DEFAULT_APP_SETTINGS,
};

describe("projectImpacts ViewData selectors", () => {
  describe("selectImpactsPageViewData", () => {
    it("returns composed view data from state", () => {
      const store = createStore(getTestAppDependencies(), MOCK_STATES);
      const rootState = store.getState();

      const viewData = selectImpactsPageViewData(rootState);

      expect(viewData).toEqual({
        dataLoadingState: "idle",
        evaluationPeriod: 20,
        displayImpactsAccuracyDisclaimer: false,
      });
    });

    it("returns displayImpactsAccuracyDisclaimer true for express project when setting is enabled", () => {
      const store = createStore(getTestAppDependencies(), {
        ...MOCK_STATES,
        projectImpacts: {
          ...MOCK_STATES.projectImpacts,
          contextData: {
            ...MOCK_STATES.projectImpacts.contextData,
            isExpressProject: true,
          },
        },
        appSettings: {
          ...DEFAULT_APP_SETTINGS,
          displayImpactsAccuracyDisclaimer: true,
        },
      });
      const rootState = store.getState();

      const viewData = selectImpactsPageViewData(rootState);

      expect(viewData.displayImpactsAccuracyDisclaimer).toBe(true);
    });
  });
});
