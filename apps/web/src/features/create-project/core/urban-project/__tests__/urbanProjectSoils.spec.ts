import { SoilsDistribution } from "shared";

import { getUrbanProjectSoilsDistributionFromSpaces } from "../urbanProjectSoils";

describe("Urban project soils", () => {
  describe("getUrbanProjectSoilsDistributionFromSpaces", () => {
    it("should return empty distribution when no space", () => {
      expect(getUrbanProjectSoilsDistributionFromSpaces([]).toJSON()).toEqual({});
    });

    it("should get soils distribution when only housing buildings", () => {
      const soilsDistribution = getUrbanProjectSoilsDistributionFromSpaces([
        {
          category: "LIVING_AND_ACTIVITY_SPACES",
          surfaceArea: 100,
          spaces: { BUILDINGS: 100 },
        },
      ]);
      expect(soilsDistribution.toJSON()).toEqual({ BUILDINGS: 100 });
    });

    it("should get soils distribution for projet with green spaces, public spaces and urban pond", () => {
      const soilsDistribution = getUrbanProjectSoilsDistributionFromSpaces([
        {
          category: "GREEN_SPACES",
          surfaceArea: 100,
          spaces: { LAWNS_AND_BUSHES: 30, GRAVEL_ALLEY: 70 },
        },
        {
          category: "PUBLIC_SPACES",
          surfaceArea: 200,
          spaces: { IMPERMEABLE_SURFACE: 150, GRASS_COVERED_SURFACE: 50 },
        },
        {
          category: "URBAN_POND_OR_LAKE",
          surfaceArea: 50,
        },
      ]);
      expect(soilsDistribution.toJSON()).toEqual<SoilsDistribution>({
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 80,
        WATER: 50,
        MINERAL_SOIL: 70,
        IMPERMEABLE_SOILS: 150,
      });
    });
  });
});
