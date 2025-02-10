import { generateSiteDesignation, generateSiteName } from "./name";

describe("siteName", () => {
  describe("generateSiteDesignation", () => {
    it("should generate 'friche' when no friche activity", () => {
      expect(
        generateSiteDesignation({
          isFriche: true,
          fricheActivity: undefined,
          soils: [],
          cityName: "Metz",
        }),
      ).toEqual("friche");
    });

    it("should generate 'friche d'habitat'", () => {
      expect(
        generateSiteDesignation({
          isFriche: true,
          fricheActivity: "HOUSING",
          soils: [],
          cityName: "Metz",
        }),
      ).toEqual("Ancienne zone d'habitation");
    });

    it("should generate 'prairie' when no friche and all soils are of type prairie", () => {
      expect(
        generateSiteDesignation({
          isFriche: false,
          fricheActivity: undefined,
          soils: ["PRAIRIE_BUSHES", "PRAIRIE_GRASS"],
          cityName: "Metz",
        }),
      ).toEqual("prairie");
    });

    it("should generate 'prairie' when no friche and non-artificial soils are of type prairie", () => {
      expect(
        generateSiteDesignation({
          isFriche: false,
          soils: ["PRAIRIE_BUSHES", "PRAIRIE_GRASS", "MINERAL_SOIL"],
          cityName: "Metz",
        }),
      ).toEqual("prairie");
    });

    it("should generate 'forêt' when no friche and all soils are of type forest", () => {
      expect(
        generateSiteDesignation({
          isFriche: false,
          soils: ["FOREST_CONIFER", "FOREST_MIXED"],
          cityName: "Metz",
        }),
      ).toEqual("forêt");
    });

    it("should generate 'forêt' when no friche and non-artificial soils are of type forest", () => {
      expect(
        generateSiteDesignation({
          isFriche: false,
          soils: ["FOREST_CONIFER", "FOREST_POPLAR", "MINERAL_SOIL"],
          cityName: "Metz",
        }),
      ).toEqual("forêt");
    });

    it("should generate 'espace agricole' when no friche and all soils are agricultural", () => {
      expect(
        generateSiteDesignation({
          isFriche: false,
          soils: ["CULTIVATION", "ORCHARD"],
          cityName: "Metz",
        }),
      ).toEqual("espace agricole");
    });

    it("should generate 'espace agricole' when no friche and non-artificial soils are agricultural", () => {
      expect(
        generateSiteDesignation({
          isFriche: false,
          soils: ["VINEYARD", "MINERAL_SOIL"],
          cityName: "Metz",
        }),
      ).toEqual("espace agricole");
    });

    it("should generate 'espace naturel' for a mix of prairie and forest", () => {
      expect(
        generateSiteDesignation({
          isFriche: false,
          soils: ["FOREST_CONIFER", "PRAIRIE_BUSHES", "PRAIRIE_GRASS"],
          cityName: "Metz",
        }),
      ).toEqual("espace naturel");
    });

    it("should generate 'espace naturel' for a mix of prairie, forest, wet land and water", () => {
      expect(
        generateSiteDesignation({
          isFriche: false,
          soils: ["FOREST_POPLAR", "PRAIRIE_TREES", "WATER", "WET_LAND"],
          cityName: "Metz",
        }),
      ).toEqual("espace naturel");
    });

    it("should generate 'espace naturel et agricole' for a mix of prairie, forest and cultivation", () => {
      expect(
        generateSiteDesignation({
          isFriche: false,
          soils: ["FOREST_POPLAR", "PRAIRIE_TREES", "WATER", "CULTIVATION"],
          cityName: "Metz",
        }),
      ).toEqual("espace naturel et agricole");
    });

    it("should generate 'espace' when no friche and all soils are artifical", () => {
      expect(
        generateSiteDesignation({
          isFriche: false,
          soils: ["ARTIFICIAL_GRASS_OR_BUSHES_FILLED", "MINERAL_SOIL"],
          cityName: "Metz",
        }),
      ).toEqual("espace");
    });
  });

  describe("generateSiteName", () => {
    it("should generate 'Espace naturel et agricole de Blajan'", () => {
      expect(
        generateSiteName({
          isFriche: false,
          soils: ["FOREST_POPLAR", "PRAIRIE_TREES", "WATER", "CULTIVATION"],
          cityName: "Blajan",
        }),
      ).toEqual("Espace naturel et agricole de Blajan");
    });

    it("should generate 'Friche industrielle de Blajan'", () => {
      expect(
        generateSiteName({
          isFriche: true,
          fricheActivity: "INDUSTRY",
          soils: ["BUILDINGS", "MINERAL_SOIL"],
          cityName: "Blajan",
        }),
      ).toEqual("Friche industrielle de Blajan");
    });

    it("should generate 'Friche industrielle d'Angers'", () => {
      expect(
        generateSiteName({
          isFriche: true,
          fricheActivity: "INDUSTRY",
          soils: ["BUILDINGS", "MINERAL_SOIL"],
          cityName: "Angers",
        }),
      ).toEqual("Friche industrielle d'Angers");
    });

    it("should generate 'Friche industrielle du Mans'", () => {
      expect(
        generateSiteName({
          isFriche: true,
          fricheActivity: "INDUSTRY",
          soils: ["BUILDINGS", "MINERAL_SOIL"],
          cityName: "Le Mans",
        }),
      ).toEqual("Friche industrielle du Mans");
    });
  });
});
