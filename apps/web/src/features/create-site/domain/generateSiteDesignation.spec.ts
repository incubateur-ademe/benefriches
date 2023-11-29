import { generateSiteDesignation } from "./generateSiteDesignation";
import { SiteDraft, SoilType } from "./siteFoncier.types";

const buildSiteDraft = (siteData: Partial<SiteDraft>): SiteDraft => {
  return {
    id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
    name: "My site",
    owner: { structureType: "local_or_regional_authority", name: "department" },
    tenant: { structureType: "company", name: "Tenant SARL" },
    soils: [],
    soilsSurfaceAreas: {},
    surfaceArea: 15000,
    yearlyExpenses: [],
    isFriche: false,
    hasRecentAccidents: false,
    fullTimeJobsInvolved: 0,
    hasContaminatedSoils: false,
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
    ...siteData,
  };
};

describe("generateSiteName", () => {
  it("should generate 'friche'", () => {
    const site = buildSiteDraft({ isFriche: true });
    expect(generateSiteDesignation(site)).toEqual("friche");
  });

  it("should generate 'prairie' when no friche and all soils are of type prairie", () => {
    const site = buildSiteDraft({
      isFriche: false,
      soils: [SoilType.PRAIRIE_BUSHES, SoilType.PRAIRIE_GRASS],
    });
    expect(generateSiteDesignation(site)).toEqual("prairie");
  });

  it("should generate 'prairie' when no friche and non-artificial soils are of type prairie", () => {
    const site = buildSiteDraft({
      isFriche: false,
      soils: [
        SoilType.PRAIRIE_BUSHES,
        SoilType.PRAIRIE_GRASS,
        SoilType.MINERAL_SOIL,
      ],
    });
    expect(generateSiteDesignation(site)).toEqual("prairie");
  });

  it("should generate 'forêt' when no friche and all soils are of type forest", () => {
    const site = buildSiteDraft({
      isFriche: false,
      soils: [SoilType.FOREST_CONIFER, SoilType.FOREST_MIXED],
    });
    expect(generateSiteDesignation(site)).toEqual("forêt");
  });

  it("should generate 'forêt' when no friche and non-artificial soils are of type forest", () => {
    const site = buildSiteDraft({
      isFriche: false,
      soils: [
        SoilType.FOREST_CONIFER,
        SoilType.FOREST_POPLAR,
        SoilType.MINERAL_SOIL,
      ],
    });
    expect(generateSiteDesignation(site)).toEqual("forêt");
  });

  it("should generate 'espace agricole' when no friche and all soils are agricultural", () => {
    const site = buildSiteDraft({
      isFriche: false,
      soils: [SoilType.CULTIVATION, SoilType.ORCHARD],
    });
    expect(generateSiteDesignation(site)).toEqual("espace agricole");
  });

  it("should generate 'espace agricole' when no friche and non-artificial soils are agricultural", () => {
    const site = buildSiteDraft({
      isFriche: false,
      soils: [SoilType.VINEYARD, SoilType.MINERAL_SOIL],
    });
    expect(generateSiteDesignation(site)).toEqual("espace agricole");
  });

  it("should generate 'espace naturel' for a mix of prairie and forest", () => {
    const site = buildSiteDraft({
      isFriche: false,
      soils: [
        SoilType.FOREST_CONIFER,
        SoilType.PRAIRIE_BUSHES,
        SoilType.PRAIRIE_GRASS,
      ],
    });
    expect(generateSiteDesignation(site)).toEqual("espace naturel");
  });

  it("should generate 'espace naturel' for a mix of prairie, forest, wet land and water", () => {
    const site = buildSiteDraft({
      isFriche: false,
      soils: [
        SoilType.FOREST_POPLAR,
        SoilType.PRAIRIE_TREES,
        SoilType.WATER,
        SoilType.WET_LAND,
      ],
    });
    expect(generateSiteDesignation(site)).toEqual("espace naturel");
  });

  it("should generate 'espace naturel et agricole' for a mix of prairie, forest and cultivation", () => {
    const site = buildSiteDraft({
      isFriche: false,
      soils: [
        SoilType.FOREST_POPLAR,
        SoilType.PRAIRIE_TREES,
        SoilType.WATER,
        SoilType.CULTIVATION,
      ],
    });
    expect(generateSiteDesignation(site)).toEqual("espace naturel et agricole");
  });

  it("should generate 'espace' when no friche and all soils are artifical", () => {
    const site = buildSiteDraft({
      isFriche: false,
      soils: [
        SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
        SoilType.MINERAL_SOIL,
      ],
    });
    expect(generateSiteDesignation(site)).toEqual("espace");
  });
});
