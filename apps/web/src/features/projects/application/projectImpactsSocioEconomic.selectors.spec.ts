import { photovoltaicProjectImpactMock as projectImpactMock } from "./projectImpacts.mock";
import {
  getDetailedSocioEconomicProjectImpacts,
  getSocioEconomicProjectImpactsByActorAndCategory,
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

      expect(economicDirect.impacts.length).toEqual(2);
      expect(economicIndirect.impacts.length).toEqual(2);
      expect(environmentalMonetary.impacts.length).toEqual(3);

      expect(economicDirect.total).toEqual(-409000);
      expect(economicIndirect.total).toEqual(10432);
      expect(environmentalMonetary.total).toEqual(202984);

      expect(economicDirect.impacts).toContainEqual(
        expect.objectContaining({
          name: "avoided_friche_costs",
          actors: [{ name: "Current tenant", value: 131000 }],
        }),
      );

      expect(economicDirect.impacts).toContainEqual(
        expect.objectContaining({
          name: "rental_income",
          actors: [{ name: "Current owner", value: -540000 }],
        }),
      );

      expect(economicIndirect.impacts).toContainEqual(
        expect.objectContaining({
          name: "taxes_income",
          actors: [{ name: "community", value: 5000 }],
        }),
      );

      expect(economicIndirect.impacts).toContainEqual(
        expect.objectContaining({
          name: "property_transfer_duties_income",
          actors: [{ name: "community", value: 5432 }],
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
      expect(economicDirect.impacts.length).toEqual(2);
      expect(economicIndirect.impacts.length).toEqual(2);

      expect(economicDirect.total).toEqual(-409000);
      expect(economicIndirect.total).toEqual(10432);

      expect(economicDirect.impacts).toContainEqual(
        expect.objectContaining({
          name: "avoided_friche_costs",
          actors: [{ name: "Current tenant", value: 131000 }],
        }),
      );

      expect(economicDirect.impacts).toContainEqual(
        expect.objectContaining({
          name: "rental_income",
          actors: [{ name: "Current owner", value: -540000 }],
        }),
      );

      expect(economicIndirect.impacts).toContainEqual(
        expect.objectContaining({
          name: "taxes_income",
          actors: [{ name: "community", value: 5000 }],
        }),
      );

      expect(economicIndirect.impacts).toContainEqual(
        expect.objectContaining({
          name: "property_transfer_duties_income",
          actors: [{ name: "community", value: 5432 }],
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

  describe("getSocioEconomicProjectImpactsByActorAndCategory", () => {
    it("should return socio economic impacts formatted by actor and category for filter `all`", () => {
      const { byActor, byCategory, total } =
        getSocioEconomicProjectImpactsByActorAndCategory.resultFunc(
          "all",
          MOCK_STATES.projectImpacts["impactsData"],
        );

      expect(total).toEqual(-195584);
      expect(byActor.length).toEqual(4);
      expect(byCategory.length).toEqual(3);

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

      expect(byCategory).toContainEqual(
        expect.objectContaining({
          name: "economic_direct",
          total: -409000,
          impacts: [
            { name: "rental_income", value: -540000 },
            { name: "avoided_friche_costs", value: 131000 },
          ],
        }),
      );

      expect(byCategory).toContainEqual(
        expect.objectContaining({
          name: "economic_indirect",
          total: 10432,
          impacts: [
            { name: "taxes_income", value: 5000 },
            { name: "property_transfer_duties_income", value: 5432 },
          ],
        }),
      );

      expect(byCategory).toContainEqual(
        expect.objectContaining({
          name: "environmental_monetary",
          total: 202984,
          impacts: [
            { name: "water_regulation", value: 4720 },
            { name: "ecosystem_services", value: 29820 },
            { name: "avoided_co2_eq_with_enr", value: 168444 },
          ],
        }),
      );
    });

    it("should return socio economic impacts formatted by actor and category for filter `economic`", () => {
      const { byActor, byCategory, total } =
        getSocioEconomicProjectImpactsByActorAndCategory.resultFunc(
          "economic",
          MOCK_STATES.projectImpacts["impactsData"],
        );

      expect(total).toEqual(-398568);
      expect(byActor.length).toEqual(3);
      expect(byCategory.length).toEqual(2);

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

      expect(byCategory).toContainEqual(
        expect.objectContaining({
          name: "economic_direct",
          total: -409000,
          impacts: [
            { name: "rental_income", value: -540000 },
            { name: "avoided_friche_costs", value: 131000 },
          ],
        }),
      );

      expect(byCategory).toContainEqual(
        expect.objectContaining({
          name: "economic_indirect",
          total: 10432,
          impacts: [
            { name: "taxes_income", value: 5000 },
            { name: "property_transfer_duties_income", value: 5432 },
          ],
        }),
      );
    });

    it("should return socio economic impacts formatted by actor and category for filter `environment`", () => {
      const { byActor, byCategory, total } =
        getSocioEconomicProjectImpactsByActorAndCategory.resultFunc(
          "environment",
          MOCK_STATES.projectImpacts["impactsData"],
        );

      expect(total).toEqual(202984);
      expect(byActor.length).toEqual(2);
      expect(byCategory.length).toEqual(1);
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

      expect(byCategory).toContainEqual(
        expect.objectContaining({
          name: "environmental_monetary",
          total: 202984,
          impacts: [
            { name: "water_regulation", value: 4720 },
            { name: "ecosystem_services", value: 29820 },
            { name: "avoided_co2_eq_with_enr", value: 168444 },
          ],
        }),
      );
    });

    it("should return socio economic impacts formatted by actor and category for filter `social`", () => {
      const { byActor, byCategory, total } =
        getSocioEconomicProjectImpactsByActorAndCategory.resultFunc(
          "social",
          MOCK_STATES.projectImpacts["impactsData"],
        );

      expect(total).toEqual(0);
      expect(byActor.length).toEqual(0);
      expect(byCategory.length).toEqual(0);
    });
  });
});
