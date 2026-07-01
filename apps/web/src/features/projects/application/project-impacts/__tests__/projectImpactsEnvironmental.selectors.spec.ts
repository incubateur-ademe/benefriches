import { createStore, RootState } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { selectEnvironmentalProjectImpacts } from "../selectors/projectImpacts.selectors";
import {
  photovoltaicProjectImpactMockMeta,
  photovoltaicProjectImpactsResultDto as projectImpactMock,
} from "./projectImpacts.mock";

const MOCK_STATES = {
  projectImpacts: {
    dataLoadingState: {
      impacts: "success",
      urbanSprawlSimulation: "idle",
    },
    evaluationPeriod: projectImpactMock.projectionYears.length,
    currentViewMode: "list",
    impacts: projectImpactMock,
    contextData: photovoltaicProjectImpactMockMeta,
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
          type: "surface_area",
          impact: {
            base: 70000,
            forecast: 90000,
            difference: 20000,
          },
        }),
      );

      expect(impacts).toContainEqual(
        expect.objectContaining({
          name: "co2_benefit",
          type: "co2",
          impact: {
            base: 59,
            details: [
              {
                impact: { base: 0, difference: 112.3, forecast: 112.3 },
                name: "avoided_co2_eq_emissions_with_production",
              },
              {
                impact: { base: 59, difference: 0, forecast: 59 },
                name: "stored_co2_eq",
              },
            ],
            difference: 112.3,
            forecast: 171.3,
          },
        }),
      );

      expect(impacts).toContainEqual(
        expect.objectContaining({
          name: "permeable_surface_area",
          type: "surface_area",
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
