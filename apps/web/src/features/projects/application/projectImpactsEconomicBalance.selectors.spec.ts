import { createStore, RootState } from "@/shared/core/store-config/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { photovoltaicProjectImpactMock, urbanProjectImpactMock } from "./projectImpacts.mock";
import { selectEconomicBalanceProjectImpacts } from "./projectImpactsEconomicBalance.selectors";

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
};

describe("projectImpactsEconomicBalance selectors", () => {
  describe("getEconomicBalanceProjectImpacts", () => {
    it("should return economic balance formatted with details and total", () => {
      const store = createStore(getTestAppDependencies(), MOCK_STATES);
      const rootState = store.getState();
      const economicBalance = selectEconomicBalanceProjectImpacts(rootState);

      expect(economicBalance.bearer).toEqual("Mairie de Blajan");
      expect(economicBalance.total).toEqual(-500000);
      expect(economicBalance.economicBalance).toContainEqual(
        expect.objectContaining({
          name: "operations_costs",
          value: -110000,
          details: [
            { value: -10000, name: "taxes" },
            { value: -100000, name: "maintenance" },
          ],
        }),
      );

      expect(economicBalance.economicBalance).toContainEqual(
        expect.objectContaining({
          name: "site_reinstatement",
          value: -500000,
          details: [{ value: -500000, name: "demolition" }],
        }),
      );

      expect(economicBalance.economicBalance).toContainEqual(
        expect.objectContaining({
          name: "photovoltaic_development_plan_installation",
          value: -200000,
          details: [{ value: -200000, name: "photovoltaic_works" }],
        }),
      );

      expect(economicBalance.economicBalance).toContainEqual(
        expect.objectContaining({
          name: "site_purchase",
          value: -150000,
        }),
      );

      expect(economicBalance.economicBalance).toContainEqual(
        expect.objectContaining({
          name: "operations_revenues",
          value: 310000,
          details: [
            { value: 100000, name: "rent" },
            { value: 10000, name: "other" },
          ],
        }),
      );

      expect(economicBalance.economicBalance).toContainEqual(
        expect.objectContaining({
          name: "financial_assistance",
          value: 150000,
          details: [{ value: 150000, name: "public_subsidies" }],
        }),
      );
    });

    it("should the right impact key for urban project for installation costs", () => {
      const store = createStore(getTestAppDependencies(), {
        projectImpacts: {
          ...MOCK_STATES.projectImpacts,
          projectData: {
            name: "Urban project 1",
            id: "aaa-bbb-111",
            ...urbanProjectImpactMock.projectData,
          },
        },
      });
      const rootState = store.getState();
      const economicBalance = selectEconomicBalanceProjectImpacts(rootState);

      expect(economicBalance.economicBalance).toContainEqual(
        expect.objectContaining({
          name: "urban_project_development_plan_installation",
          value: -200000,
          details: [{ value: -200000, name: "urban_project_works" }],
        }),
      );
    });
  });
});
