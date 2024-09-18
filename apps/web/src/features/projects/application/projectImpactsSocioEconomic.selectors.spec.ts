import { photovoltaicProjectImpactMock as projectImpactMock } from "./projectImpacts.mock";
import {
  getDetailedSocioEconomicProjectImpacts,
  getSocioEconomicProjectImpactsByActor,
} from "./projectImpactsSocioEconomic.selectors";

import { RootState } from "@/app/application/store";

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

describe("projectImpactsSocioEconomic selectors", () => {
  describe("getDetailedSocioEconomicProjectImpacts", () => {
    it("should return socio economic impacts formatted with details and total for filter `all`", () => {
      const { economicDirect, economicIndirect, environmentalMonetary } =
        getDetailedSocioEconomicProjectImpacts.resultFunc(
          "all",
          MOCK_STATES.projectImpacts["impactsData"],
        );

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
          actors: [{ name: "community", value: 5000 }],
        }),
      );

      expect(environmentalMonetary.impacts).toContainEqual(
        expect.objectContaining({
          name: "co2_benefit_monetary",
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

    it("should return socio economic impacts formatted with details and total for filter `economic`", () => {
      const { economicDirect, economicIndirect, environmentalMonetary } =
        getDetailedSocioEconomicProjectImpacts.resultFunc(
          "economic",
          MOCK_STATES.projectImpacts["impactsData"],
        );

      expect(environmentalMonetary.impacts.length).toEqual(0);
      expect(economicDirect.impacts.length).toEqual(3);
      expect(economicIndirect.impacts.length).toEqual(1);

      expect(economicDirect.total).toEqual(-403568);
      expect(economicIndirect.total).toEqual(5000);

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
          actors: [{ name: "community", value: 5000 }],
        }),
      );
    });

    it("should return socio economic impacts formatted with details and total for filter `environment`", () => {
      const { economicDirect, economicIndirect, environmentalMonetary } =
        getDetailedSocioEconomicProjectImpacts.resultFunc(
          "environment",
          MOCK_STATES.projectImpacts["impactsData"],
        );

      expect(environmentalMonetary.impacts.length).toEqual(3);
      expect(economicDirect.impacts.length).toEqual(0);
      expect(economicIndirect.impacts.length).toEqual(0);
      expect(environmentalMonetary.total).toEqual(202984);

      expect(environmentalMonetary.impacts).toContainEqual(
        expect.objectContaining({
          name: "co2_benefit_monetary",
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

    it("should return socio economic impacts formatted with details and total for filter `social`", () => {
      const { economicDirect, economicIndirect, environmentalMonetary, total } =
        getDetailedSocioEconomicProjectImpacts.resultFunc(
          "social",
          MOCK_STATES.projectImpacts["impactsData"],
        );

      expect(total).toEqual(0);

      expect(environmentalMonetary.impacts.length).toEqual(0);
      expect(economicDirect.impacts.length).toEqual(0);
      expect(economicIndirect.impacts.length).toEqual(0);
    });
  });

  describe("getSocioEconomicProjectImpactsByActor", () => {
    it("should return socio economic impacts formatted by actor for filter `all`", () => {
      const byActor = getSocioEconomicProjectImpactsByActor.resultFunc(
        "all",
        MOCK_STATES.projectImpacts["impactsData"],
      );

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
            { name: "avoided_co2_eq_with_enr", value: 168444 },
          ],
        }),
      );

      expect(byActor).toContainEqual(
        expect.objectContaining({
          name: "community",
          total: 15152,
          impacts: [
            { name: "taxes_income", value: 5000 },
            { name: "property_transfer_duties_income", value: 5432 },
            { name: "water_regulation", value: 4720 },
          ],
        }),
      );
    });

    it("should return socio economic impacts formatted by actor for filter `economic`", () => {
      const byActor = getSocioEconomicProjectImpactsByActor.resultFunc(
        "economic",
        MOCK_STATES.projectImpacts["impactsData"],
      );

      expect(byActor.length).toEqual(3);

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
          name: "community",
          total: 10432,
          impacts: [
            { name: "taxes_income", value: 5000 },
            { name: "property_transfer_duties_income", value: 5432 },
          ],
        }),
      );
    });

    it("should return socio economic impacts formatted by actor for filter `environment`", () => {
      const byActor = getSocioEconomicProjectImpactsByActor.resultFunc(
        "environment",
        MOCK_STATES.projectImpacts["impactsData"],
      );

      expect(byActor.length).toEqual(2);
      expect(byActor).toContainEqual(
        expect.objectContaining({
          name: "human_society",
          total: 198264,
          impacts: [
            { name: "ecosystem_services", value: 29820 },
            { name: "avoided_co2_eq_with_enr", value: 168444 },
          ],
        }),
      );

      expect(byActor).toContainEqual(
        expect.objectContaining({
          name: "community",
          total: 4720,
          impacts: [{ name: "water_regulation", value: 4720 }],
        }),
      );
    });

    it("should return socio economic impacts formatted by actor for filter `social`", () => {
      const byActor = getSocioEconomicProjectImpactsByActor.resultFunc(
        "social",
        MOCK_STATES.projectImpacts["impactsData"],
      );

      expect(byActor.length).toEqual(0);
    });
  });
});
