import { RootState } from "@/app/application/store";

import { photovoltaicProjectImpactMock as projectImpactMock } from "./projectImpacts.mock";
import { getEconomicBalanceProjectImpactsSelector } from "./projectImpactsEconomicBalance.selectors";

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

describe("projectImpactsEconomicBalance selectors", () => {
  describe("getEconomicBalanceProjectImpacts", () => {
    it("should return economic balance formatted with details and total", () => {
      const economicBalance = getEconomicBalanceProjectImpactsSelector.resultFunc(
        "PHOTOVOLTAIC_POWER_PLANT",
        MOCK_STATES.projectImpacts["impactsData"],
      );

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

    it("should the right impact key for mixed use neighbourhood project for installation costs", () => {
      const economicBalance = getEconomicBalanceProjectImpactsSelector.resultFunc(
        "URBAN_PROJECT",
        MOCK_STATES.projectImpacts["impactsData"],
      );

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
