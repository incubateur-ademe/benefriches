import { createStore, RootState } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { photovoltaicProjectImpactMock as projectImpactMock } from "./projectImpacts.mock";
import { selectSocialProjectImpacts } from "./projectImpactsSocial.selectors";

const MOCK_STATES = {
  projectImpacts: {
    dataLoadingState: "success",
    evaluationPeriod: 10,
    currentViewMode: "list",
    impactsData: projectImpactMock.impacts,
    projectData: {
      id: projectImpactMock.id,
      name: projectImpactMock.name,
      ...projectImpactMock.projectData,
    },
    relatedSiteData: {
      id: projectImpactMock.relatedSiteId,
      name: projectImpactMock.relatedSiteName,
      isExpressSite: projectImpactMock.isExpressSite,
      ...projectImpactMock.siteData,
    },
  } satisfies RootState["projectImpacts"],
};

describe("projectImpactsSocial selectors", () => {
  describe("getSocialProjectImpacts", () => {
    it("should return social formatted with details and total", () => {
      const store = createStore(getTestAppDependencies(), MOCK_STATES);
      const rootState = store.getState();
      const impacts = selectSocialProjectImpacts(rootState);

      expect(impacts).toContainEqual(
        expect.objectContaining({
          name: "full_time_jobs",
          type: "etp",
          impact: {
            base: 1,
            forecast: 3.5,
            difference: 2.5,
            details: [
              {
                impact: { base: 0, difference: 3, forecast: 3 },
                name: "conversion_full_time_jobs",
              },
              {
                impact: { base: 1, difference: -0.5, forecast: 0.5 },
                name: "operations_full_time_jobs",
              },
            ],
          },
        }),
      );

      expect(impacts).toContainEqual(
        expect.objectContaining({
          name: "avoided_friche_accidents",
          type: "default",
          impact: {
            base: 0,
            difference: 3,
            forecast: 3,
            details: [
              {
                impact: { base: 0, difference: 1, forecast: 1 },
                name: "avoided_friche_minor_accidents",
              },
              {
                impact: { base: 0, difference: 2, forecast: 2 },
                name: "avoided_friche_severe_accidents",
              },
            ],
          },
        }),
      );

      expect(impacts).toContainEqual(
        expect.objectContaining({
          name: "households_powered_by_renewable_energy",
          type: "default",
          impact: {
            base: 0,
            difference: 1000,
            forecast: 1000,
          },
        }),
      );
    });
  });
});
