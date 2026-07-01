import { createStore, RootState } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { selectEconomicBalanceProjectImpacts } from "../selectors/projectImpacts.selectors";
import {
  photovoltaicProjectImpactsResultDto,
  photovoltaicProjectImpactMockMeta,
  urbanProjectImpactMockMeta,
  urbanProjectImpactsResultDto,
} from "./projectImpacts.mock";

const MOCK_STATES = {
  projectImpacts: {
    dataLoadingState: {
      impacts: "success",
      urbanSprawlSimulation: "idle",
    },
    evaluationPeriod: photovoltaicProjectImpactsResultDto.projectionYears.length,
    currentViewMode: "list",
    impacts: photovoltaicProjectImpactsResultDto,
    contextData: photovoltaicProjectImpactMockMeta,
  } satisfies RootState["projectImpacts"],
};

describe("projectImpactsEconomicBalance selectors", () => {
  describe("getEconomicBalanceProjectImpacts", () => {
    it("should return economic balance formatted with details and total", () => {
      const store = createStore(getTestAppDependencies(), MOCK_STATES);
      const rootState = store.getState();
      const economicBalance = selectEconomicBalanceProjectImpacts(rootState);

      expect(economicBalance.bearer).toEqual("Mairie de Blajan");
      expect(economicBalance.total).toEqual(-700000);
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
          value: 110000,
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
          evaluationPeriod: urbanProjectImpactsResultDto.projectionYears.length,
          impacts: urbanProjectImpactsResultDto,
          contextData: urbanProjectImpactMockMeta,
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

    it("should expose buildings construction and rehabilitation costs as a dedicated group for urban projects", () => {
      const store = createStore(getTestAppDependencies(), {
        projectImpacts: {
          ...MOCK_STATES.projectImpacts,
          evaluationPeriod: urbanProjectImpactsResultDto.projectionYears.length,
          impacts: {
            ...urbanProjectImpactsResultDto,
            projectEconomicBalance: {
              total: urbanProjectImpactsResultDto.projectEconomicBalance.total - 365000,
              details: [
                ...urbanProjectImpactsResultDto.projectEconomicBalance.details,
                {
                  total: -30000,
                  name: "projectBuildingsInstallation",
                  details: "technical_studies_and_fees",
                },
                {
                  total: -250000,
                  name: "projectBuildingsInstallation",
                  details: "buildings_construction_works",
                },
                {
                  total: -80000,
                  name: "projectBuildingsInstallation",
                  details: "buildings_rehabilitation_works",
                },
                {
                  total: -5000,
                  name: "projectBuildingsInstallation",
                  details: "other_construction_expenses",
                },
              ],
            },
          },
        },
      });
      const rootState = store.getState();
      const economicBalance = selectEconomicBalanceProjectImpacts(rootState);

      expect(economicBalance.economicBalance).toContainEqual(
        expect.objectContaining({
          name: "urban_project_buildings_construction_and_rehabilitation",
          value: -365000,
          details: [
            { value: -30000, name: "technical_studies_and_fees" },
            { value: -250000, name: "buildings_construction_works" },
            { value: -80000, name: "buildings_rehabilitation_works" },
            { value: -5000, name: "other_construction_expenses" },
          ],
        }),
      );
    });
  });
});
