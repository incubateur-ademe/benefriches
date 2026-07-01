import { createStore, RootState } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { selectDetailedSocioEconomicProjectImpacts } from "../selectors/projectImpacts.selectors";
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
      const { economicDirect, economicIndirect, environmentalMonetary } =
        selectDetailedSocioEconomicProjectImpacts(rootState);

      expect(economicDirect.impacts.length).toEqual(3);
      expect(economicIndirect.impacts.length).toEqual(1);
      expect(environmentalMonetary.impacts.length).toEqual(3);

      expect(economicDirect.total).toEqual(-403568);
      expect(economicIndirect.total).toEqual(5000);
      expect(environmentalMonetary.total).toEqual(202984);

      expect(economicDirect.impacts).toContainEqual(
        expect.objectContaining({
          name: "avoided_friche_costs",
          actors: [
            {
              name: "Current tenant",
              value: 131000,
              details: [
                { value: 100000, name: "avoided_accidents_costs" },
                { value: 10000, name: "avoided_illegal_dumping_costs" },
                { value: 10000, name: "avoided_other_securing_costs" },
                { value: 1000, name: "avoided_maintenance_costs" },
                { value: 10000, name: "avoided_security_costs" },
              ],
            },
          ],
        }),
      );

      expect(economicDirect.impacts).toContainEqual(
        expect.objectContaining({
          name: "site_rental_income_loss",
          actors: [{ name: "Mairie de Blajan", value: -540000 }],
        }),
      );

      expect(economicDirect.impacts).toContainEqual(
        expect.objectContaining({
          name: "property_transfer_duties_income",
          actors: [{ name: "community", value: 5432 }],
        }),
      );

      expect(economicIndirect.impacts).toContainEqual(
        expect.objectContaining({
          name: "taxes_income",
          actors: [
            {
              name: "community",
              value: 5000,
              details: [
                {
                  name: "project_photovoltaic_taxes_income",
                  value: 5000,
                },
              ],
            },
          ],
        }),
      );

      expect(environmentalMonetary.impacts).toContainEqual(
        expect.objectContaining({
          name: "avoided_co2_eq_emissions",
          actors: [
            {
              name: "human_society",
              value: 168444,
              details: [{ name: "avoided_co2_eq_with_enr", value: 168444 }],
            },
          ],
        }),
      );

      expect(environmentalMonetary.impacts).toContainEqual(
        expect.objectContaining({
          name: "water_regulation",
          actors: [{ name: "community", value: 4720 }],
        }),
      );

      expect(environmentalMonetary.impacts).toContainEqual(
        expect.objectContaining({
          name: "ecosystem_services",
          actors: [
            {
              name: "human_society",
              value: 29820,
              details: [
                {
                  value: 1420,
                  name: "nature_related_wellness_and_leisure",
                },
                {
                  value: 1840,
                  name: "pollination",
                },
                {
                  value: 680,
                  name: "invasive_species_regulation",
                },
                {
                  value: 19500,
                  name: "water_cycle",
                },
                {
                  value: 1380,
                  name: "nitrogen_cycle",
                },
                {
                  value: 5000,
                  name: "soil_erosion",
                },
              ],
            },
          ],
        }),
      );
    });
  });
});
