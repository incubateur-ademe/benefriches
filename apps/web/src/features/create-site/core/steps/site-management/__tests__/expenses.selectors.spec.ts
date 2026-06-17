import {
  computeEstimatedPropertyTaxesAmount,
  computeIllegalDumpingDefaultCost,
  computeMaintenanceDefaultCost,
  computeSecurityDefaultCost,
} from "shared";

import { StoreBuilder } from "../../../__tests__/creation-steps/testUtils";
import { selectSiteYearlyExpensesViewData } from "../siteManagement.selectors";

describe("expenses ViewData selectors", () => {
  describe("selectSiteYearlyExpensesViewData estimated amounts", () => {
    it("estimates illegal dumping, security, maintenance and property taxes for a friche with buildings", () => {
      const surfaceArea = 10000;
      const buildingsSurface = 2000;
      const population = 15000;

      const state = new StoreBuilder()
        .withCreationData({
          nature: "FRICHE",
          surfaceArea,
          soilsDistribution: { BUILDINGS: buildingsSurface, IMPERMEABLE_SOILS: 8000 },
        })
        .withCityPopulation(population)
        .build()
        .getState();

      const { estimatedAmounts } = selectSiteYearlyExpensesViewData(state);

      expect(estimatedAmounts).toEqual({
        illegalDumpingCost: computeIllegalDumpingDefaultCost(population),
        security: computeSecurityDefaultCost(surfaceArea),
        maintenance: computeMaintenanceDefaultCost(buildingsSurface),
        propertyTaxes: computeEstimatedPropertyTaxesAmount(buildingsSurface),
      });
    });

    it("omits maintenance and property taxes for a friche without buildings", () => {
      const surfaceArea = 10000;
      const population = 15000;

      const state = new StoreBuilder()
        .withCreationData({ nature: "FRICHE", surfaceArea, soilsDistribution: {} })
        .withCityPopulation(population)
        .build()
        .getState();

      const { estimatedAmounts } = selectSiteYearlyExpensesViewData(state);

      expect(estimatedAmounts).toEqual({
        illegalDumpingCost: computeIllegalDumpingDefaultCost(population),
        security: computeSecurityDefaultCost(surfaceArea),
      });
    });
  });

  describe("selectSiteYearlyExpensesViewData", () => {
    it("returns view data with expenses in store for friche", () => {
      const state = new StoreBuilder()
        .withCreationData({
          nature: "FRICHE",
          surfaceArea: 10000,
          soilsDistribution: {
            BUILDINGS: 2000,
            IMPERMEABLE_SOILS: 8000,
          },
          tenant: {
            name: "Locataire",
            structureType: "company",
          },
          yearlyExpenses: [
            { purpose: "maintenance", amount: 5000, bearer: "tenant" },
            { purpose: "security", amount: 3000, bearer: "owner" },
          ],
        })
        .build()
        .getState();

      const viewData = selectSiteYearlyExpensesViewData(state);

      expect(viewData.siteNature).toBe("FRICHE");
      expect(viewData.hasTenant).toBe(true);
      expect(viewData.expensesInStore).toEqual([
        { purpose: "maintenance", amount: 5000, bearer: "tenant" },
        { purpose: "security", amount: 3000, bearer: "owner" },
      ]);
      expect(viewData.managementExpensesConfig.length).toBeGreaterThan(0);
      expect(viewData.securityExpensesConfig.length).toBeGreaterThan(0);
    });

    it("returns view data with empty security config for non-friche sites", () => {
      const state = new StoreBuilder()
        .withCreationData({
          nature: "AGRICULTURAL_OPERATION",
          agriculturalOperationActivity: "CEREALS_AND_OILSEEDS_CULTIVATION",
          surfaceArea: 50000,
          isSiteOperated: true,
          yearlyExpenses: [],
        })
        .build()
        .getState();

      const viewData = selectSiteYearlyExpensesViewData(state);

      expect(viewData.siteNature).toBe("AGRICULTURAL_OPERATION");
      expect(viewData.securityExpensesConfig).toEqual([]);
      expect(viewData.expensesInStore).toEqual([]);
    });
  });
});
