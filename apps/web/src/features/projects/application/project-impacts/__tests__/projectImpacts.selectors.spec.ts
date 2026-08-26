import { createStore, type RootState } from "@/app/store/store";
import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import {
  photovoltaicProjectImpactsResultDto as photovoltaicProjectImpactMock,
  photovoltaicProjectImpactMockMeta,
} from "@/features/projects/application/project-impacts/__tests__/projectImpacts.mock";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import {
  selectImpactsListViewData,
  selectImpactsPageViewData,
  selectImpactsSummaryViewData,
} from "../selectors/projectImpacts.selectors";

const MOCK_STATES = {
  projectImpacts: {
    dataLoadingState: {
      impacts: "idle",
      urbanSprawlSimulation: "idle",
    },
    evaluationPeriod: photovoltaicProjectImpactMock.projectionYears.length,
    currentViewMode: "list",
    impacts: photovoltaicProjectImpactMock,
    contextData: photovoltaicProjectImpactMockMeta,
  } satisfies RootState["projectImpacts"],
  appSettings: DEFAULT_APP_SETTINGS,
};

describe("projectImpacts ViewData selectors", () => {
  describe("selectImpactsListViewData", () => {
    it("returns composed view data from state", () => {
      const store = createStore(getTestAppDependencies(), MOCK_STATES);
      const rootState = store.getState();

      const viewData = selectImpactsListViewData(rootState);

      expect(viewData).toEqual({
        economicBalance: expect.objectContaining({
          total: -700000,
          bearerName: "Mairie de Blajan",
          economicBalance: expect.any(Array),
        }),
        socioEconomicImpacts: expect.objectContaining({
          total: expect.any(Number),
          humanity: expect.any(Object),
          localPeopleOrCompany: expect.any(Object),
          localAuthority: expect.any(Object),
        }),
        environmentImpacts: expect.objectContaining({
          soils: expect.any(Object),
          co2eq: expect.any(Object),
        }),
        socialImpacts: expect.objectContaining({
          humanity: expect.any(Object),
          localPeopleOrCompany: expect.any(Object),
          jobs: expect.any(Object),
        }),
      });
    });
  });

  describe("selectImpactsSummaryViewData", () => {
    it("returns composed view data from state", () => {
      const store = createStore(getTestAppDependencies(), MOCK_STATES);
      const rootState = store.getState();

      const viewData = selectImpactsSummaryViewData(rootState);

      expect(viewData).toEqual({
        keyImpactIndicatorsList: expect.any(Array),
      });

      // Verify key indicators are present
      expect(viewData.keyImpactIndicatorsList.length).toBeGreaterThan(0);
      expect(viewData.keyImpactIndicatorsList.map((i) => i.name)).toContain("zanCompliance");
    });
  });

  describe("selectImpactsPageViewData", () => {
    it("returns composed view data from state", () => {
      const store = createStore(getTestAppDependencies(), MOCK_STATES);
      const rootState = store.getState();

      const viewData = selectImpactsPageViewData(rootState);

      expect(viewData).toEqual({
        dataLoadingState: {
          impacts: "idle",
          urbanSprawlSimulation: "idle",
        },
        evaluationPeriod: 20,
        currentViewMode: "list",
        displayImpactsAccuracyDisclaimer: false,
        contextData: MOCK_STATES.projectImpacts.contextData,
        impactsData: MOCK_STATES.projectImpacts.impacts,
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
      expect(viewData.contextData?.isExpressProject).toBe(true);
    });
  });
});
