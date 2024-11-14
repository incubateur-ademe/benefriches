import { RootState } from "@/app/application/store";

import { photovoltaicProjectImpactMock as projectImpactMock } from "./projectImpacts.mock";
import { getEconomicBalanceProjectImpactsSelector } from "./projectImpactsEconomicBalance.selectors";

const MOCK_STATES = {
  projectImpacts: {
    dataLoadingState: "success",
    evaluationPeriod: 10,
    currentViewMode: "list",
    currentCategoryFilter: "all",
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
    it.each([{ filter: "all" }, { filter: "economic" }])(
      "should return economic balance formatted with details and total for filter $filter",
      ({ filter }) => {
        const economicBalance = getEconomicBalanceProjectImpactsSelector.resultFunc(
          filter as "economic" | "all",
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
      },
    );
    it.each([{ filter: "environment" }, { filter: "social" }])(
      "should return empty economic balance for filter $filter",
      ({ filter }) => {
        const economicBalance = getEconomicBalanceProjectImpactsSelector.resultFunc(
          filter as "environment" | "social",
          "PHOTOVOLTAIC_POWER_PLANT",
          MOCK_STATES.projectImpacts["impactsData"],
        );

        expect(economicBalance.total).toEqual(0);
        expect(economicBalance.economicBalance).toEqual([]);
      },
    );

    it("should the right impact key for mixed use neighbourhood project for installation costs", () => {
      const economicBalance = getEconomicBalanceProjectImpactsSelector.resultFunc(
        "all",
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
