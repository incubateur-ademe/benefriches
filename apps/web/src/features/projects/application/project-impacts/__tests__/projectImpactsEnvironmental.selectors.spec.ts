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

      expect(impacts.soils).toContainEqual(
        expect.objectContaining({
          keyName: "nonContaminatedSurfaceArea",
          breakdown: {
            base: 70000,
            forecast: 90000,
          },
          total: 20000,
        }),
      );

      expect(impacts.co2eq).toContainEqual(
        expect.objectContaining({
          keyName: "avoidedCo2eqEmissions",
          breakdown: {
            base: 59,
            forecast: 171.3,
          },
          total: 112.3,
          details: [
            {
              total: 112.3,
              keyName: "avoidedCo2eqEmissions.avoidedCO2TonsWithEnergyProduction",
              name: "avoidedCO2TonsWithEnergyProduction",
            },
            {
              total: 0,
              breakdown: { base: 59, forecast: 59 },
              keyName: "avoidedCo2eqEmissions.newStoredCo2Eq",
              name: "newStoredCo2Eq",
            },
          ],
        }),
      );

      expect(impacts.soils).toContainEqual(
        expect.objectContaining({
          keyName: "newPermeableSurface",
          total: -10000,
          breakdown: {
            base: 60000,
            forecast: 50000,
          },
          details: [
            {
              total: -10000,
              breakdown: { base: 40000, forecast: 30000 },
              keyName: "newPermeableSurface.newPermeableGreenSurface",
              name: "newPermeableGreenSurface",
            },
          ],
        }),
      );
    });
  });
});
