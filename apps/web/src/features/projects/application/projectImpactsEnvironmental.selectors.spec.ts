import { createStore, RootState } from "@/app/application/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { photovoltaicProjectImpactMock as projectImpactMock } from "./projectImpacts.mock";
import { selectEnvironmentalProjectImpacts } from "./projectImpactsEnvironmental.selectors";

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

describe("projectImpactsEnvironmental selectors", () => {
  describe("getEnvironmentalProjectImpacts", () => {
    it("should return environment formatted with details and total", () => {
      const store = createStore(getTestAppDependencies(), MOCK_STATES);
      const rootState = store.getState();
      const impacts = selectEnvironmentalProjectImpacts(rootState);

      expect(impacts).toContainEqual(
        expect.objectContaining({
          name: "non_contaminated_surface_area",
          type: "surfaceArea",
          impact: {
            base: 30000,
            forecast: 50000,
            difference: 20000,
          },
        }),
      );

      expect(impacts).toContainEqual(
        expect.objectContaining({
          name: "co2_benefit",
          type: "co2",
          impact: {
            base: 73.33333333333334,
            details: [
              {
                impact: { base: 73.33333333333334, difference: 0, forecast: 73.33333333333334 },
                name: "stored_co2_eq",
              },
              {
                impact: { base: 0, difference: 112.29599999999999, forecast: 112.29599999999999 },
                name: "avoided_co2_eq_emissions_with_production",
              },
            ],
            difference: 112.29599999999999,
            forecast: 185.62933333333334,
          },
        }),
      );

      expect(impacts).toContainEqual(
        expect.objectContaining({
          name: "permeable_surface_area",
          type: "surfaceArea",
          impact: {
            base: 60000,
            forecast: 50000,
            difference: -10000,
            details: [
              {
                impact: { base: 20000, difference: 0, forecast: 20000 },
                name: "mineral_soil",
              },
              {
                impact: { base: 40000, difference: -10000, forecast: 30000 },
                name: "green_soil",
              },
            ],
          },
        }),
      );
    });
  });
});
