import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import { photovoltaicProjectImpactMock } from "@/features/projects/application/project-impacts/projectImpacts.mock";
import { createStore, type RootState } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import {
  selectImpactsChartsViewData,
  selectImpactsListViewData,
  selectImpactsPageViewData,
  selectImpactsSummaryViewData,
} from "../projectImpacts.selectors";

const MOCK_STATES = {
  projectImpacts: {
    dataLoadingState: "success",
    evaluationPeriod: 10,
    currentViewMode: "list",
    impactsData: photovoltaicProjectImpactMock.impacts,
    projectData: {
      id: photovoltaicProjectImpactMock.id,
      name: photovoltaicProjectImpactMock.name,
      ...photovoltaicProjectImpactMock.projectData,
    },
    relatedSiteData: {
      id: photovoltaicProjectImpactMock.relatedSiteId,
      name: photovoltaicProjectImpactMock.relatedSiteName,
      isExpressSite: photovoltaicProjectImpactMock.isExpressSite,
      ...photovoltaicProjectImpactMock.siteData,
    },
  } satisfies RootState["projectImpacts"],
  appSettings: DEFAULT_APP_SETTINGS,
};

describe("projectImpacts ViewData selectors", () => {
  describe("selectImpactsChartsViewData", () => {
    it("returns composed view data from state", () => {
      const store = createStore(getTestAppDependencies(), MOCK_STATES);
      const rootState = store.getState();

      const viewData = selectImpactsChartsViewData(rootState);

      expect(viewData).toEqual({
        projectName: "Project photovoltaïque",
        economicBalance: expect.objectContaining({
          total: -500000,
          bearer: "Mairie de Blajan",
        }),
        socioEconomicTotalImpact: expect.any(Number),
        socioEconomicImpactsByActor: expect.any(Array),
        socialAreaChartImpactsData: expect.objectContaining({
          fullTimeJobs: expect.any(Object),
          householdsPoweredByRenewableEnergy: expect.any(Object),
        }),
        environmentalAreaChartImpactsData: expect.objectContaining({
          permeableSurfaceArea: expect.any(Object),
          nonContaminatedSurfaceArea: expect.any(Object),
        }),
        modalData: expect.objectContaining({
          projectData: expect.any(Object),
          siteData: expect.any(Object),
          impactsData: expect.any(Object),
        }),
      });
    });
  });

  describe("selectImpactsListViewData", () => {
    it("returns composed view data from state", () => {
      const store = createStore(getTestAppDependencies(), MOCK_STATES);
      const rootState = store.getState();

      const viewData = selectImpactsListViewData(rootState);

      expect(viewData).toEqual({
        economicBalance: expect.objectContaining({
          total: -500000,
          bearer: "Mairie de Blajan",
          economicBalance: expect.any(Array),
        }),
        socioEconomicImpacts: expect.objectContaining({
          total: expect.any(Number),
          economicDirect: expect.any(Object),
          economicIndirect: expect.any(Object),
          socialMonetary: expect.any(Object),
          environmentalMonetary: expect.any(Object),
        }),
        environmentImpacts: expect.any(Array),
        socialImpacts: expect.any(Array),
        modalData: expect.objectContaining({
          projectData: expect.any(Object),
          siteData: expect.any(Object),
          impactsData: expect.any(Object),
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
        modalData: expect.objectContaining({
          projectData: expect.any(Object),
          siteData: expect.any(Object),
          impactsData: expect.any(Object),
        }),
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
        dataLoadingState: "success",
        evaluationPeriod: 10,
        currentViewMode: "list",
        projectName: "Project photovoltaïque",
        siteName: "Friche agricole de Blajan",
        siteId: photovoltaicProjectImpactMock.relatedSiteId,
        siteNature: "FRICHE",
        type: "PHOTOVOLTAIC_POWER_PLANT",
        isExpressProject: false,
        displayImpactsAccuracyDisclaimer: false,
      });
    });

    it("returns displayImpactsAccuracyDisclaimer true for express project when setting is enabled", () => {
      const store = createStore(getTestAppDependencies(), {
        ...MOCK_STATES,
        projectImpacts: {
          ...MOCK_STATES.projectImpacts,
          projectData: {
            ...MOCK_STATES.projectImpacts.projectData,
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
      expect(viewData.isExpressProject).toBe(true);
    });
  });
});
