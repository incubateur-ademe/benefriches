import { SoilType } from "../domain/siteFoncier.types";
import { getSiteTypeLabel } from "./createSite.reducer";

describe("Create site reducer", () => {
  describe("getSiteTypeLabel", () => {
    it("should return friche", () => {
      expect(getSiteTypeLabel({ isFriche: true })).toEqual("friche");
    });

    it("should return prairie when no friche and all soils are of type prairie", () => {
      expect(
        getSiteTypeLabel({
          isFriche: false,
          soils: [SoilType.PRAIRIE_BUSHES, SoilType.PRAIRIE_GRASS],
        }),
      ).toEqual("prairie");
    });

    it("should return prairie when no friche and non-artificial soils are of type prairie", () => {
      expect(
        getSiteTypeLabel({
          isFriche: false,
          soils: [
            SoilType.PRAIRIE_BUSHES,
            SoilType.PRAIRIE_GRASS,
            SoilType.MINERAL_SOIL,
          ],
        }),
      ).toEqual("prairie");
    });

    it("should return forêt when no friche and all soils are of type forest", () => {
      expect(
        getSiteTypeLabel({
          isFriche: false,
          soils: [SoilType.FOREST_CONIFER, SoilType.FOREST_MIXED],
        }),
      ).toEqual("forêt");
    });

    it("should return forêt when no friche and non-artificial soils are of type forest", () => {
      expect(
        getSiteTypeLabel({
          isFriche: false,
          soils: [
            SoilType.FOREST_CONIFER,
            SoilType.FOREST_POPLAR,
            SoilType.MINERAL_SOIL,
          ],
        }),
      ).toEqual("forêt");
    });

    it("should return espace agricole when no friche and all soils are agricultural", () => {
      expect(
        getSiteTypeLabel({
          isFriche: false,
          soils: [SoilType.CULTIVATION, SoilType.ORCHARD],
        }),
      ).toEqual("espace agricole");
    });

    it("should return espace agricole when no friche and non-artificial soils are agricultural", () => {
      expect(
        getSiteTypeLabel({
          isFriche: false,
          soils: [SoilType.VINEYARD, SoilType.MINERAL_SOIL],
        }),
      ).toEqual("espace agricole");
    });

    it("should return espace naturel for a mix of prairie and forest", () => {
      expect(
        getSiteTypeLabel({
          isFriche: false,
          soils: [
            SoilType.FOREST_CONIFER,
            SoilType.PRAIRIE_BUSHES,
            SoilType.PRAIRIE_GRASS,
          ],
        }),
      ).toEqual("espace naturel");
    });

    it("should return espace naturel for a mix of prairie, forest, wet land and water", () => {
      expect(
        getSiteTypeLabel({
          isFriche: false,
          soils: [
            SoilType.FOREST_POPLAR,
            SoilType.PRAIRIE_TREES,
            SoilType.WATER,
            SoilType.WET_LAND,
          ],
        }),
      ).toEqual("espace naturel");
    });

    it("should return espace naturel et agricole for a mix of prairie, forest and cultivation", () => {
      expect(
        getSiteTypeLabel({
          isFriche: false,
          soils: [
            SoilType.FOREST_POPLAR,
            SoilType.PRAIRIE_TREES,
            SoilType.WATER,
            SoilType.CULTIVATION,
          ],
        }),
      ).toEqual("espace naturel et agricole");
    });

    it("should return espace when no friche and all soils are artifical", () => {
      expect(
        getSiteTypeLabel({
          isFriche: false,
          soils: [
            SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
            SoilType.MINERAL_SOIL,
          ],
        }),
      ).toEqual("espace");
    });
  });
});
