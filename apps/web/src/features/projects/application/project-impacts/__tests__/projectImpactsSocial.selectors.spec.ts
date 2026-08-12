import { createStore, RootState } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { selectSocialProjectImpacts } from "../selectors/projectImpacts.selectors";
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

describe("projectImpactsSocial selectors", () => {
  describe("getSocialProjectImpacts", () => {
    it("should return social formatted with details and total", () => {
      const store = createStore(getTestAppDependencies(), MOCK_STATES);
      const rootState = store.getState();
      const impacts = selectSocialProjectImpacts(rootState);

      expect(impacts.jobs).toContainEqual(
        expect.objectContaining({
          keyName: "fullTimeJobs",
          total: 2.5,
          details: [
            {
              total: 3,
              keyName: "fullTimeJobs.conversionFullTimeJobs",
              details: expect.any(Object),
            },
            {
              total: -0.5,
              keyName: "fullTimeJobs.photovoltaicOperationsFullTimeJobs",
              details: expect.any(Object),
            },
          ],
        }),
      );

      expect(impacts.humanity).toContainEqual(
        expect.objectContaining({
          keyName: "avoidedFricheAccidents",
          total: 3,
          details: [
            {
              total: 2,
              keyName: "avoidedFricheAccidents.avoidedFricheAccidentsSevereInjuries",
              name: "avoidedFricheAccidentsSevereInjuries",
            },
            {
              total: 1,
              keyName: "avoidedFricheAccidents.avoidedFricheAccidentsMinorInjuries",
              name: "avoidedFricheAccidentsMinorInjuries",
            },
          ],
        }),
      );

      expect(impacts.humanity).toContainEqual(
        expect.objectContaining({
          keyName: "householdsPoweredByRenewableEnergy",
          name: "householdsPoweredByRenewableEnergy",
          total: 1000,
        }),
      );
    });
  });
});
