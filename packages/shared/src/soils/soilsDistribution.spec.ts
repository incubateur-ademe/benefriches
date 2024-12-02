import { NewSoilsDistribution } from "./soilDistribution";

describe("SoilsDistribution", () => {
  describe("getTotalSurfaceArea", () => {
    it("should return 0 for empty soils distribution", () => {
      const emptySoilsDistribution = new NewSoilsDistribution();
      expect(emptySoilsDistribution.getTotalSurfaceArea()).toEqual(0);
    });

    it("should return total surface area", () => {
      const simpleSoilsDistribution = new NewSoilsDistribution();
      simpleSoilsDistribution.addSurface("ARTIFICIAL_GRASS_OR_BUSHES_FILLED", 200);
      simpleSoilsDistribution.addSurface("ARTIFICIAL_TREE_FILLED", 200);
      expect(simpleSoilsDistribution.getTotalSurfaceArea()).toEqual(400);
    });
  });

  describe("getDistributionInPercentage", () => {
    it("should return empty object for empty soils distribution", () => {
      const emptySoilsDistribution = new NewSoilsDistribution();
      expect(emptySoilsDistribution.getDistributionInPercentage()).toEqual({});
    });

    it("should return soils distribution in percentage for simple case, integer", () => {
      const simpleSoilsDistribution = new NewSoilsDistribution();
      simpleSoilsDistribution.addSurface("ARTIFICIAL_GRASS_OR_BUSHES_FILLED", 200);
      simpleSoilsDistribution.addSurface("ARTIFICIAL_TREE_FILLED", 200);
      expect(simpleSoilsDistribution.getDistributionInPercentage()).toEqual({
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 50,
        ARTIFICIAL_TREE_FILLED: 50,
      });
    });

    it("should return soils distribution in percentage when exact decimals", () => {
      const decimalsSoilsDistribution = new NewSoilsDistribution();
      decimalsSoilsDistribution.addSurface("ARTIFICIAL_GRASS_OR_BUSHES_FILLED", 50);
      decimalsSoilsDistribution.addSurface("ARTIFICIAL_TREE_FILLED", 10);
      decimalsSoilsDistribution.addSurface("PRAIRIE_BUSHES", 5.5);
      decimalsSoilsDistribution.addSurface("WATER", 34.5);
      expect(decimalsSoilsDistribution.getDistributionInPercentage()).toEqual({
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 50,
        ARTIFICIAL_TREE_FILLED: 10,
        PRAIRIE_BUSHES: 5.5,
        WATER: 34.5,
      });
    });

    it("should return soils distribution in percentage when 1 digit decimal", () => {
      const simpleSoilsDistribution = new NewSoilsDistribution();
      simpleSoilsDistribution.addSurface("ARTIFICIAL_GRASS_OR_BUSHES_FILLED", 10);
      simpleSoilsDistribution.addSurface("ARTIFICIAL_TREE_FILLED", 10);
      simpleSoilsDistribution.addSurface("BUILDINGS", 10);
      expect(simpleSoilsDistribution.getDistributionInPercentage()).toEqual({
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 33.3,
        ARTIFICIAL_TREE_FILLED: 33.3,
        BUILDINGS: 33.4,
      });
    });
    it("should return soils distribution in percentage when lots of digits", () => {
      const decimalSoilsDistribution = new NewSoilsDistribution();
      decimalSoilsDistribution.addSurface("ARTIFICIAL_GRASS_OR_BUSHES_FILLED", 1000.3);
      decimalSoilsDistribution.addSurface("BUILDINGS", 1000.000004);
      expect(decimalSoilsDistribution.getDistributionInPercentage()).toEqual({
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 50,
        BUILDINGS: 50,
      });
    });
  });

  describe("toJSON", () => {
    it("should return empty object for empty soils distribution", () => {
      const emptySoilsDistribution = new NewSoilsDistribution();
      expect(emptySoilsDistribution.toJSON()).toEqual({});
    });

    it("should return JSON representation for soils distribution", () => {
      const soilsDistribution = new NewSoilsDistribution();
      soilsDistribution.addSurface("BUILDINGS", 500);
      soilsDistribution.addSurface("ARTIFICIAL_TREE_FILLED", 200);
      expect(soilsDistribution.toJSON()).toEqual({
        BUILDINGS: 500,
        ARTIFICIAL_TREE_FILLED: 200,
      });
    });
  });
});
