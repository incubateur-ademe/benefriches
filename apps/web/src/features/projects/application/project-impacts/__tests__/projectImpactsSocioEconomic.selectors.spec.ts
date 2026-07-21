import { createStore, RootState } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { selectSocioEconomicProjectImpactsListView } from "../selectors/projectImpacts.selectors";
import { photovoltaicProjectImpactsResultDto as projectImpactMock } from "./projectImpacts.mock";

const MOCK_STATES = {
  projectImpacts: {
    dataLoadingState: {
      impacts: "idle",
      urbanSprawlSimulation: "idle",
    },
    evaluationPeriod: projectImpactMock.projectionYears.length,
    currentViewMode: "list",
    impacts: projectImpactMock,
  } satisfies RootState["projectImpacts"],
};

describe("projectImpactsSocioEconomic selectors", () => {
  describe("getSocioEconomicProjectImpactsGroupedByCategory", () => {
    it("should return socio economic impacts formatted with details and total", () => {
      const store = createStore(getTestAppDependencies(), MOCK_STATES);
      const rootState = store.getState();
      const { humanity, localAuthority, localPeopleOrCompany } =
        selectSocioEconomicProjectImpactsListView(rootState);

      expect(humanity.impacts.length).toEqual(2);
      expect(localAuthority.impacts.length).toEqual(4);
      expect(localPeopleOrCompany.impacts.length).toEqual(1);

      expect(humanity.total).toEqual(198264);
      expect(localAuthority.total).toEqual(-540000 + 5432 + 5000 + 4720);
      expect(localPeopleOrCompany.total).toEqual(131000);

      expect(localPeopleOrCompany.impacts).toContainEqual(
        expect.objectContaining({
          amount: 131000,
          bearerName: "Current tenant",
          details: [
            {
              amount: 100000,
              name: "avoidedFricheMaintenanceAndSecuringCostsForTenant.accidentsCost",
            },
            {
              amount: 10000,
              name: "avoidedFricheMaintenanceAndSecuringCostsForTenant.illegalDumpingCost",
            },
            {
              amount: 10000,
              name: "avoidedFricheMaintenanceAndSecuringCostsForTenant.otherSecuringCosts",
            },
            {
              amount: 1000,
              name: "avoidedFricheMaintenanceAndSecuringCostsForTenant.maintenance",
            },
            {
              amount: 10000,
              name: "avoidedFricheMaintenanceAndSecuringCostsForTenant.security",
            },
          ],
          name: "avoidedFricheMaintenanceAndSecuringCostsForTenant",
        }),
      );

      expect(localAuthority.impacts).toContainEqual(
        expect.objectContaining({
          amount: -540000,
          bearerName: "Mairie de Blajan",
          name: "oldRentalIncomeLoss",
        }),
      );

      expect(localAuthority.impacts).toContainEqual(
        expect.objectContaining({
          amount: 5432,
          bearerName: undefined,
          name: "propertyTransferDutiesIncome",
        }),
      );

      expect(localAuthority.impacts).toContainEqual(
        expect.objectContaining({
          amount: 5000,
          bearerName: undefined,
          details: [
            {
              amount: 5000,
              name: "projectPhotovoltaicTaxesIncome",
            },
          ],
          name: "taxesIncome",
        }),
      );

      expect(humanity.impacts).toContainEqual(
        expect.objectContaining({
          amount: 168444,
          bearerName: undefined,
          details: [
            {
              amount: 168444,
              name: "avoidedCo2eqWithEnergyProduction",
            },
          ],
          name: "avoidedCo2eqEmissions",
        }),
      );

      expect(localAuthority.impacts).toContainEqual(
        expect.objectContaining({
          amount: 4720,
          bearerName: undefined,
          name: "waterRegulation",
        }),
      );

      expect(humanity.impacts).toContainEqual(
        expect.objectContaining({
          amount: 29820,
          bearerName: undefined,
          details: [
            {
              amount: 1420,
              name: "natureRelatedWelnessAndLeisure",
            },
            {
              amount: 1840,
              name: "pollination",
            },
            {
              amount: 680,
              name: "invasiveSpeciesRegulation",
            },
            {
              amount: 19500,
              name: "waterCycle",
            },
            {
              amount: 1380,
              name: "nitrogenCycle",
            },
            {
              amount: 5000,
              name: "soilErosion",
            },
          ],
          name: "ecosystemServices",
        }),
      );
    });
  });
});
