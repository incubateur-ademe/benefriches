import { DEFAULT_APP_SETTINGS } from "@/features/app-settings/core/appSettings";
import type { UrbanSprawlImpactsComparisonState } from "@/features/projects/application/project-impacts-urban-sprawl-comparison/urbanSprawlComparison.reducer";
import type { ProjectImpactsState } from "@/features/projects/application/project-impacts/projectImpacts.reducer";
import { createStore } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import {
  selectUrbanSprawlComparisonViewData,
  selectUrbanSprawlSummaryViewData,
} from "../urbanSprawlComparison.selectors";

const MOCK_URBAN_SPRAWL_COMPARISON: UrbanSprawlImpactsComparisonState = {
  dataLoadingState: "success",
  evaluationPeriod: 30,
  currentViewMode: "summary",
  comparisonSiteNature: "AGRICULTURAL_OPERATION",
  projectData: undefined,
  baseCase: undefined,
  comparisonCase: undefined,
};

const MOCK_PROJECT_IMPACTS: ProjectImpactsState = {
  dataLoadingState: "success",
  evaluationPeriod: 10,
  currentViewMode: "list",
  projectData: {
    id: "project-1",
    name: "Projet test",
    soilsDistribution: { BUILDINGS: 5000 },
    contaminatedSoilSurface: 0,
    isExpressProject: false,
    developmentPlan: {
      type: "URBAN_PROJECT",
      buildingsFloorAreaDistribution: { RESIDENTIAL: 3000 },
    },
  },
  relatedSiteData: {
    id: "site-1",
    name: "Friche de test",
    isExpressSite: false,
    addressLabel: "1 rue de test",
    contaminatedSoilSurface: 0,
    soilsDistribution: { BUILDINGS: 5000 },
    surfaceArea: 10000,
    nature: "FRICHE",
    fricheActivity: "INDUSTRY",
    owner: { structureType: "municipality", name: "Mairie de Test" },
  },
};

describe("urbanSprawlComparison ViewData selectors", () => {
  describe("selectUrbanSprawlComparisonViewData", () => {
    it("returns composed view data from state", () => {
      const store = createStore(getTestAppDependencies(), {
        urbanSprawlComparison: MOCK_URBAN_SPRAWL_COMPARISON,
        projectImpacts: MOCK_PROJECT_IMPACTS,
        appSettings: DEFAULT_APP_SETTINGS,
      });
      const rootState = store.getState();

      const viewData = selectUrbanSprawlComparisonViewData(rootState);

      expect(viewData).toEqual({
        comparisonSiteNature: "AGRICULTURAL_OPERATION",
        evaluationPeriod: 30,
        dataLoadingState: "success",
        projectData: undefined,
        baseCase: undefined,
        comparisonCase: undefined,
        currentViewMode: "summary",
        projectImpactsEvaluationPeriod: 10,
        projectImpactsLoadingState: "success",
        projectName: "Projet test",
        relatedSiteNature: "FRICHE",
        shouldDisplayOnBoarding: true,
      });
    });

    it("handles missing projectImpacts data gracefully", () => {
      const store = createStore(getTestAppDependencies(), {
        urbanSprawlComparison: MOCK_URBAN_SPRAWL_COMPARISON,
        projectImpacts: {
          dataLoadingState: "idle",
          evaluationPeriod: undefined,
          currentViewMode: "summary",
        },
        appSettings: DEFAULT_APP_SETTINGS,
      });
      const rootState = store.getState();

      const viewData = selectUrbanSprawlComparisonViewData(rootState);

      expect(viewData.projectName).toBeUndefined();
      expect(viewData.relatedSiteNature).toBeUndefined();
      expect(viewData.projectImpactsEvaluationPeriod).toBeUndefined();
    });
  });

  describe("selectUrbanSprawlSummaryViewData", () => {
    it("returns default indicators when no comparison data is loaded", () => {
      const store = createStore(getTestAppDependencies(), {
        urbanSprawlComparison: MOCK_URBAN_SPRAWL_COMPARISON,
        appSettings: DEFAULT_APP_SETTINGS,
      });
      const rootState = store.getState();

      const viewData = selectUrbanSprawlSummaryViewData(rootState);

      expect(viewData).toEqual({
        baseCase: {
          siteNature: "FRICHE",
          indicators: [],
        },
        comparisonCase: {
          siteNature: "AGRICULTURAL_OPERATION",
          indicators: [],
        },
        modalData: {
          baseCase: undefined,
          comparisonCase: undefined,
          projectData: undefined,
        },
      });
    });
  });
});
