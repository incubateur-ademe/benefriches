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
          total: 131000,
          bearerName: "Current tenant",
          details: [
            {
              total: 100000,
              keyName: "avoidedFricheMaintenanceAndSecuringCostsForTenant.accidentsCost",
              name: "accidentsCost",
            },
            {
              total: 10000,
              keyName: "avoidedFricheMaintenanceAndSecuringCostsForTenant.illegalDumpingCost",
              name: "illegalDumpingCost",
            },
            {
              total: 10000,
              keyName: "avoidedFricheMaintenanceAndSecuringCostsForTenant.otherSecuringCosts",
              name: "otherSecuringCosts",
            },
            {
              total: 1000,
              keyName: "avoidedFricheMaintenanceAndSecuringCostsForTenant.maintenance",
              name: "maintenance",
            },
            {
              total: 10000,
              keyName: "avoidedFricheMaintenanceAndSecuringCostsForTenant.security",
              name: "security",
            },
          ],
          keyName: "avoidedFricheMaintenanceAndSecuringCostsForTenant",
        }),
      );

      expect(localAuthority.impacts).toContainEqual(
        expect.objectContaining({
          total: -540000,
          bearerName: "Mairie de Blajan",
          keyName: "oldRentalIncomeLoss",
        }),
      );

      expect(localAuthority.impacts).toContainEqual(
        expect.objectContaining({
          total: 5432,
          bearerName: undefined,
          keyName: "propertyTransferDutiesIncome",
        }),
      );

      expect(localAuthority.impacts).toContainEqual(
        expect.objectContaining({
          total: 5000,
          details: [
            {
              total: 5000,
              name: "projectPhotovoltaicTaxesIncome",
              keyName: "taxesIncome.projectPhotovoltaicTaxesIncome",
            },
          ],
          keyName: "taxesIncome",
        }),
      );

      expect(humanity.impacts).toContainEqual(
        expect.objectContaining({
          total: 168444,
          details: [
            {
              total: 168444,
              name: "avoidedCo2eqWithEnergyProduction",
              keyName: "avoidedCo2eqEmissions.avoidedCo2eqWithEnergyProduction",
            },
          ],
          keyName: "avoidedCo2eqEmissions",
        }),
      );

      expect(localAuthority.impacts).toContainEqual(
        expect.objectContaining({
          total: 4720,
          bearerName: undefined,
          keyName: "waterRegulation",
        }),
      );

      expect(humanity.impacts).toContainEqual(
        expect.objectContaining({
          total: 29820,
          details: [
            {
              total: 1420,
              name: "natureRelatedWelnessAndLeisure",
              keyName: "ecosystemServices.natureRelatedWelnessAndLeisure",
            },
            {
              total: 1840,
              name: "pollination",
              keyName: "ecosystemServices.pollination",
            },
            {
              total: 680,
              name: "invasiveSpeciesRegulation",
              keyName: "ecosystemServices.invasiveSpeciesRegulation",
            },
            {
              total: 19500,
              name: "waterCycle",
              keyName: "ecosystemServices.waterCycle",
            },
            {
              total: 1380,
              name: "nitrogenCycle",
              keyName: "ecosystemServices.nitrogenCycle",
            },
            {
              total: 5000,
              name: "soilErosion",
              keyName: "ecosystemServices.soilErosion",
            },
          ],
          keyName: "ecosystemServices",
        }),
      );
    });
  });
});
