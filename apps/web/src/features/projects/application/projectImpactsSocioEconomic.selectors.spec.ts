import { createStore, RootState } from "@/app/application/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";

import { photovoltaicProjectImpactMock as projectImpactMock } from "./projectImpacts.mock";
import {
  selectDetailedSocioEconomicProjectImpacts,
  selectSocioEconomicProjectImpactsByActor,
} from "./projectImpactsSocioEconomic.selectors";

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

describe("projectImpactsSocioEconomic selectors", () => {
  describe("getDetailedSocioEconomicProjectImpacts", () => {
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
          name: "rental_income",
          actors: [{ name: "Current owner", value: -540000 }],
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

  describe("getSocioEconomicProjectImpactsByActor", () => {
    it("should return socio economic impacts formatted by actor", () => {
      const store = createStore(getTestAppDependencies(), MOCK_STATES);
      const rootState = store.getState();
      const byActor = selectSocioEconomicProjectImpactsByActor(rootState);

      expect(byActor.length).toEqual(4);

      expect(byActor).toContainEqual(
        expect.objectContaining({
          name: "Current owner",
          total: -540000,
          impacts: [{ name: "rental_income", value: -540000 }],
        }),
      );

      expect(byActor).toContainEqual(
        expect.objectContaining({
          name: "Current tenant",
          total: 131000,
          impacts: [{ name: "avoided_friche_costs", value: 131000 }],
        }),
      );

      expect(byActor).toContainEqual(
        expect.objectContaining({
          name: "human_society",
          total: 198264,
          impacts: [
            { name: "ecosystem_services", value: 29820 },
            { name: "avoided_co2_eq_emissions", value: 168444 },
          ],
        }),
      );

      expect(byActor).toContainEqual(
        expect.objectContaining({
          name: "community",
          total: 15152,
          impacts: [
            { name: "property_transfer_duties_income", value: 5432 },
            { name: "water_regulation", value: 4720 },
            { name: "taxes_income", value: 5000 },
          ],
        }),
      );
    });
  });
});
