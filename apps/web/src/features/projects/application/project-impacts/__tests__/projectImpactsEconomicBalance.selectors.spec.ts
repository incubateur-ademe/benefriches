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

      expect(economicBalance.bearerName).toEqual("Mairie de Blajan");
      expect(economicBalance.total).toEqual(-700000);
      expect(economicBalance.economicBalance).toContainEqual(
        expect.objectContaining({
          keyName: "projectOperatingExpenses",
          total: -110000,
          details: [
            { total: -10000, keyName: "projectOperatingExpenses.taxes", name: "taxes" },
            {
              total: -100000,
              keyName: "projectOperatingExpenses.maintenance",
              name: "maintenance",
            },
          ],
        }),
      );

      expect(economicBalance.economicBalance).toContainEqual(
        expect.objectContaining({
          keyName: "siteReinstatement",
          total: -500000,
          details: [
            { total: -500000, keyName: "siteReinstatement.demolition", name: "demolition" },
          ],
        }),
      );

      expect(economicBalance.economicBalance).toContainEqual(
        expect.objectContaining({
          keyName: "photovoltaicProjectInstallation",
          total: -200000,
          details: [
            {
              total: -200000,
              keyName: "photovoltaicProjectInstallation.installation_works",
              name: "installation_works",
            },
          ],
        }),
      );

      expect(economicBalance.economicBalance).toContainEqual(
        expect.objectContaining({
          keyName: "realEstateAcquisition",
          total: -150000,
          details: [
            { total: -150000, keyName: "realEstateAcquisition.sitePurchase", name: "sitePurchase" },
          ],
        }),
      );

      expect(economicBalance.economicBalance).toContainEqual(
        expect.objectContaining({
          keyName: "projectOperatingRevenues",
          total: 110000,
          details: [
            { total: 100000, keyName: "projectOperatingRevenues.rent", name: "rent" },
            { total: 10000, keyName: "projectOperatingRevenues.other", name: "other" },
          ],
        }),
      );

      expect(economicBalance.economicBalance).toContainEqual(
        expect.objectContaining({
          keyName: "financialAssistanceRevenues",
          total: 150000,
          details: [
            {
              total: 150000,
              keyName: "financialAssistanceRevenues.public_subsidies",
              name: "public_subsidies",
            },
          ],
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
          keyName: "urbanProjectInstallation",
          total: -200000,
          details: [
            {
              total: -200000,
              keyName: "urbanProjectInstallation.development_works",
              name: "development_works",
            },
          ],
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
          keyName: "projectBuildingsInstallation",
          total: -365000,
          details: [
            {
              total: -30000,
              name: "technical_studies_and_fees",
              keyName: "projectBuildingsInstallation.technical_studies_and_fees",
            },
            {
              total: -250000,
              name: "buildings_construction_works",
              keyName: "projectBuildingsInstallation.buildings_construction_works",
            },
            {
              total: -80000,
              name: "buildings_rehabilitation_works",
              keyName: "projectBuildingsInstallation.buildings_rehabilitation_works",
            },
            {
              total: -5000,
              name: "other_construction_expenses",
              keyName: "projectBuildingsInstallation.other_construction_expenses",
            },
          ],
        }),
      );
    });
  });
});
