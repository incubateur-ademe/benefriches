import { hasBuildings, hasImpermeableSoils, hasTenant } from "./site.functions";
import { SiteDraft } from "./siteFoncier.types";

const buildSite = (siteProps: Partial<SiteDraft> = {}): SiteDraft => {
  return {
    id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
    name: "My site",
    owner: { structureType: "department", name: "Le département Paris" },
    tenant: { structureType: "company", name: "Tenant SARL" },
    soils: [],
    soilsDistribution: {},
    soilsDistributionEntryMode: "square_meters",
    surfaceArea: 15000,
    yearlyExpenses: [],
    yearlyIncomes: [],
    isFriche: false,
    hasRecentAccidents: false,
    hasContaminatedSoils: false,
    address: {
      city: "Paris",
      cityCode: "75109",
      postCode: "75009",
      banId: "123abc",
      lat: 48.876517,
      long: 2.330785,
      value: "1 rue de Londres, 75009 Paris",
      streetName: "rue de Londres",
    },
    ...siteProps,
  };
};

describe("Site functions", () => {
  describe("hasTenant", () => {
    it("returns false when no tenant", () => {
      const site = buildSite({ tenant: undefined });
      expect(hasTenant(site)).toEqual(false);
    });

    it("returns true when tenant", () => {
      const site = buildSite({
        tenant: { structureType: "company", name: "A tenant business name" },
      });
      expect(hasTenant(site)).toEqual(true);
    });
  });

  describe("hasBuilding", () => {
    it("returns false when no buildings", () => {
      const site = buildSite({
        soils: ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "FOREST_DECIDUOUS", "MINERAL_SOIL"],
      });
      expect(hasBuildings(site)).toEqual(false);
    });

    it("returns true when has buildings", () => {
      const site = buildSite({
        soils: [
          "BUILDINGS",
          "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          "FOREST_DECIDUOUS",
          "MINERAL_SOIL",
        ],
      });
      expect(hasBuildings(site)).toEqual(true);
    });
  });

  describe("hasImpermeableSoils", () => {
    it("returns false when no impermeable soils", () => {
      const site = buildSite({
        soils: [
          "BUILDINGS",
          "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          "FOREST_DECIDUOUS",
          "MINERAL_SOIL",
        ],
      });
      expect(hasImpermeableSoils(site)).toEqual(false);
    });

    it("returns true when has impermeable soils", () => {
      const site = buildSite({
        soils: [
          "BUILDINGS",
          "IMPERMEABLE_SOILS",
          "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          "FOREST_DECIDUOUS",
          "MINERAL_SOIL",
        ],
      });
      expect(hasImpermeableSoils(site)).toEqual(true);
    });
  });
});
