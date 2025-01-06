import { SurfaceAreaDistribution } from "./surfaceArea";

describe("SurfaceAreaDistribution", () => {
  it("should ignore empty surfaces", () => {
    const surfaceAreaDistribution = new SurfaceAreaDistribution<"water" | "forest" | "prairie">();
    surfaceAreaDistribution.addSurface("water", 0);
    surfaceAreaDistribution.addSurface("forest", 100);
    expect(surfaceAreaDistribution.toJSON()).toEqual({ forest: 100 });
  });

  it("should ignore negative surface areas", () => {
    const surfaceAreaDistribution = new SurfaceAreaDistribution<"water" | "forest" | "prairie">();
    surfaceAreaDistribution.addSurface("prairie", 500);
    surfaceAreaDistribution.addSurface("forest", -100);
    expect(surfaceAreaDistribution.toJSON()).toEqual({ prairie: 500 });
  });

  it("should ignore empty surfaces when created from JSON", () => {
    const surfaceAreaDistribution = SurfaceAreaDistribution.fromJSON({ water: 0, forest: 100 });
    expect(surfaceAreaDistribution.toJSON()).toEqual({ forest: 100 });
  });

  it("should return empty object for empty surface area distribution", () => {
    const emptySurfaceAreaDistribution = new SurfaceAreaDistribution();
    expect(emptySurfaceAreaDistribution.toJSON()).toEqual({});
  });

  it("should return JSON representation for surface area distribution", () => {
    const soilsDistribution = new SurfaceAreaDistribution();
    soilsDistribution.addSurface("BUILDINGS", 500);
    soilsDistribution.addSurface("ARTIFICIAL_TREE_FILLED", 200);
    expect(soilsDistribution.toJSON()).toEqual({
      BUILDINGS: 500,
      ARTIFICIAL_TREE_FILLED: 200,
    });
  });

  describe("fromJSONPercentage", () => {
    it("should return empty surface area distribution for empty JSON", () => {
      const emptySurfaceAreaDistribution = SurfaceAreaDistribution.fromJSONPercentage({
        totalSurfaceArea: 500,
        percentageDistribution: {},
      });
      expect(emptySurfaceAreaDistribution.getTotalSurfaceArea()).toEqual(0);
      expect(emptySurfaceAreaDistribution.toJSON()).toEqual({});
    });

    it("should return surface area distribution for simple 50/50 distribution on a total surface area of 300 sqmt", () => {
      const surfaceAreaDistribution = SurfaceAreaDistribution.fromJSONPercentage({
        totalSurfaceArea: 300,
        percentageDistribution: {
          BUILDINGS: 50,
          ARTIFICIAL_TREE_FILLED: 50,
        },
      });
      expect(surfaceAreaDistribution.toJSON()).toEqual({
        BUILDINGS: 150,
        ARTIFICIAL_TREE_FILLED: 150,
      });
    });

    it("should return surface area distribution for 20/30/50 distribution on a total surface area of 301 sqmt", () => {
      const surfaceAreaDistribution = SurfaceAreaDistribution.fromJSONPercentage({
        totalSurfaceArea: 301,
        percentageDistribution: {
          BUILDINGS: 20,
          PRAIRIE_BUSHES: 30,
          ARTIFICIAL_TREE_FILLED: 50,
        },
      });
      expect(surfaceAreaDistribution.toJSON()).toEqual({
        BUILDINGS: 60.2,
        PRAIRIE_BUSHES: 90.3,
        ARTIFICIAL_TREE_FILLED: 150.5,
      });
    });
  });

  describe("getTotalSurfaceArea", () => {
    it("should return 0 for empty surface area distribution", () => {
      const emptySurfaceAreaDistribution = new SurfaceAreaDistribution();
      expect(emptySurfaceAreaDistribution.getTotalSurfaceArea()).toEqual(0);
    });

    it("should return total surface area", () => {
      const simpleSurfaceAreaDistribution = new SurfaceAreaDistribution();
      simpleSurfaceAreaDistribution.addSurface("ARTIFICIAL_GRASS_OR_BUSHES_FILLED", 200);
      simpleSurfaceAreaDistribution.addSurface("ARTIFICIAL_TREE_FILLED", 200);
      expect(simpleSurfaceAreaDistribution.getTotalSurfaceArea()).toEqual(400);
    });
  });

  describe("getDistributionInPercentage", () => {
    it("should return empty object for empty surface area distribution", () => {
      const emptySurfaceAreaDistribution = new SurfaceAreaDistribution();
      expect(emptySurfaceAreaDistribution.getDistributionInPercentage()).toEqual({});
    });

    it("should return surface area distribution in percentage for simple case, integer", () => {
      const simpleSurfaceAreaDistribution = new SurfaceAreaDistribution();
      simpleSurfaceAreaDistribution.addSurface("ARTIFICIAL_GRASS_OR_BUSHES_FILLED", 200);
      simpleSurfaceAreaDistribution.addSurface("ARTIFICIAL_TREE_FILLED", 200);
      expect(simpleSurfaceAreaDistribution.getDistributionInPercentage()).toEqual({
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 50,
        ARTIFICIAL_TREE_FILLED: 50,
      });
    });

    it("should return surface area distribution in percentage when exact decimals", () => {
      const decimalsSurfaceAreaDistribution = new SurfaceAreaDistribution();
      decimalsSurfaceAreaDistribution.addSurface("ARTIFICIAL_GRASS_OR_BUSHES_FILLED", 50);
      decimalsSurfaceAreaDistribution.addSurface("ARTIFICIAL_TREE_FILLED", 10);
      decimalsSurfaceAreaDistribution.addSurface("PRAIRIE_BUSHES", 5.5);
      decimalsSurfaceAreaDistribution.addSurface("WATER", 34.5);
      expect(decimalsSurfaceAreaDistribution.getDistributionInPercentage()).toEqual({
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 50,
        ARTIFICIAL_TREE_FILLED: 10,
        PRAIRIE_BUSHES: 5.5,
        WATER: 34.5,
      });
    });

    it("should return surface area distribution in percentage when 1 digit decimal", () => {
      const simpleSurfaceAreaDistribution = new SurfaceAreaDistribution();
      simpleSurfaceAreaDistribution.addSurface("ARTIFICIAL_GRASS_OR_BUSHES_FILLED", 10);
      simpleSurfaceAreaDistribution.addSurface("ARTIFICIAL_TREE_FILLED", 10);
      simpleSurfaceAreaDistribution.addSurface("BUILDINGS", 10);
      expect(simpleSurfaceAreaDistribution.getDistributionInPercentage()).toEqual({
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 33.3,
        ARTIFICIAL_TREE_FILLED: 33.3,
        BUILDINGS: 33.4,
      });
    });
    it("should return surface area distribution in percentage when lots of digits", () => {
      const decimalSurfaceAreaDistribution = new SurfaceAreaDistribution();
      decimalSurfaceAreaDistribution.addSurface("ARTIFICIAL_GRASS_OR_BUSHES_FILLED", 1000.3);
      decimalSurfaceAreaDistribution.addSurface("BUILDINGS", 1000.000004);
      expect(decimalSurfaceAreaDistribution.getDistributionInPercentage()).toEqual({
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 50,
        BUILDINGS: 50,
      });
    });
  });
});
