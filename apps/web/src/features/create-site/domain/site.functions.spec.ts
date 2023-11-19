import {
  hasBuildings,
  hasContaminatedSoils,
  hasImpermeableSoils,
  hasTenant,
} from "./site.functions";
import { OwnerType, SiteDraft, SoilType } from "./siteFoncier.types";

const buildSite = (siteProps: Partial<SiteDraft> = {}): SiteDraft => {
  return {
    name: "My site",
    owner: { type: OwnerType.MUNICIPALITY },
    tenantBusinessName: "Tenant SARL",
    soils: [],
    soilsSurfaceAreas: {},
    surfaceArea: 15000,
    yearlyExpenses: [],
    isFriche: false,
    hasRecentAccidents: false,
    fullTimeJobsInvolved: 0,
    address: {
      city: "Paris",
      cityCode: "75109",
      postCode: "75009",
      id: "123abc",
      lat: 48.876517,
      long: 2.330785,
      value: "1 rue de Londres, 75009 Paris",
      streetName: "rue de Londres",
    },
    ...siteProps,
  };
};

describe("Site functions", () => {
  describe("hasContaminatedSoils", () => {
    it("returns false when has no contaminated soils", () => {
      const site = buildSite({ contaminatedSoilSurface: undefined });
      expect(hasContaminatedSoils(site)).toEqual(false);
    });

    it("returns true when has contaminated soils with surface zero", () => {
      const site = buildSite({ contaminatedSoilSurface: 0 });
      expect(hasContaminatedSoils(site)).toEqual(false);
    });

    it("returns true when has contaminated soils with non-null surface", () => {
      const site = buildSite({ contaminatedSoilSurface: 1000 });
      expect(hasContaminatedSoils(site)).toEqual(true);
    });
  });

  describe("hasTenant", () => {
    it("returns false when no tenant", () => {
      const site = buildSite({ tenantBusinessName: undefined });
      expect(hasTenant(site)).toEqual(false);
    });

    it("returns true when tenant", () => {
      const site = buildSite({ tenantBusinessName: "A tenant business name" });
      expect(hasTenant(site)).toEqual(true);
    });
  });

  describe("hasBuilding", () => {
    it("returns false when no buildings", () => {
      const site = buildSite({
        soils: [
          SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
          SoilType.FOREST_DECIDUOUS,
          SoilType.MINERAL_SOIL,
        ],
      });
      expect(hasBuildings(site)).toEqual(false);
    });

    it("returns true when has buildings", () => {
      const site = buildSite({
        soils: [
          SoilType.BUILDINGS,
          SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
          SoilType.FOREST_DECIDUOUS,
          SoilType.MINERAL_SOIL,
        ],
      });
      expect(hasBuildings(site)).toEqual(true);
    });
  });

  describe("hasImpermeableSoils", () => {
    it("returns false when no impermeable soils", () => {
      const site = buildSite({
        soils: [
          SoilType.BUILDINGS,
          SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
          SoilType.FOREST_DECIDUOUS,
          SoilType.MINERAL_SOIL,
        ],
      });
      expect(hasImpermeableSoils(site)).toEqual(false);
    });

    it("returns true when has impermeable soils", () => {
      const site = buildSite({
        soils: [
          SoilType.BUILDINGS,
          SoilType.IMPERMEABLE_SOILS,
          SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
          SoilType.FOREST_DECIDUOUS,
          SoilType.MINERAL_SOIL,
        ],
      });
      expect(hasImpermeableSoils(site)).toEqual(true);
    });
  });
});
