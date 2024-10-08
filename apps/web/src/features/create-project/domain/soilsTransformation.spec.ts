import { getTotalSurfaceArea, SoilsDistribution, SoilType } from "shared";

import {
  allocateRecommendedSoilSurfaceArea,
  canSiteAccomodatePhotovoltaicPanels,
  getNonSuitableSoilsForPhotovoltaicPanels,
  getSuitableSoilsForTransformation,
  transformNonSuitableSoils,
  transformSoilsForRenaturation,
  willTransformationNoticeablyImpactBiodiversityAndClimate,
} from "./soilsTransformation";

const assertSurfaceAreasEqual = (
  soilsDistribution1: SoilsDistribution,
  soilsDistribution2: SoilsDistribution,
) => {
  expect(getTotalSurfaceArea(soilsDistribution1)).toEqual(getTotalSurfaceArea(soilsDistribution2));
};

describe("Soils transformation", () => {
  describe("getNonSuitableSoilsForPhotovoltaicPanels", () => {
    it("should return empty object when all soils are suitable for photovoltaic panels", () => {
      const soilsDistribution: SoilsDistribution = {
        IMPERMEABLE_SOILS: 100,
        MINERAL_SOIL: 100,
        PRAIRIE_GRASS: 100,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
      };
      expect(getNonSuitableSoilsForPhotovoltaicPanels(soilsDistribution)).toEqual({});
    });

    it("should return non-suitable soils for site with buildings, water, forest, mineral soil and prairie", () => {
      const soilsDistribution: SoilsDistribution = {
        BUILDINGS: 100,
        WATER: 100,
        FOREST_MIXED: 100,
        MINERAL_SOIL: 100,
        PRAIRIE_GRASS: 100,
      };
      expect(getNonSuitableSoilsForPhotovoltaicPanels(soilsDistribution)).toEqual({
        BUILDINGS: 100,
        WATER: 100,
        FOREST_MIXED: 100,
      });
    });
  });

  describe("canSiteAccomodatePhotovoltaicPanels", () => {
    it("should return false when not enough flat soils", () => {
      const soilsDistribution: SoilsDistribution = {
        BUILDINGS: 100,
        FOREST_MIXED: 200,
        IMPERMEABLE_SOILS: 100,
        MINERAL_SOIL: 100,
      };
      const photovoltaicPanelsSurfaceArea = 300;
      expect(
        canSiteAccomodatePhotovoltaicPanels(soilsDistribution, photovoltaicPanelsSurfaceArea),
      ).toBe(false);
    });

    it("should return false when enough flat soils but some of it is water", () => {
      const soilsDistribution: SoilsDistribution = {
        BUILDINGS: 100,
        IMPERMEABLE_SOILS: 100,
        MINERAL_SOIL: 100,
        WATER: 400,
      };
      const photovoltaicPanelsSurfaceArea = 300;
      expect(
        canSiteAccomodatePhotovoltaicPanels(soilsDistribution, photovoltaicPanelsSurfaceArea),
      ).toBe(false);
    });

    it("should return true when enough suitable soils", () => {
      const soilsDistribution: SoilsDistribution = {
        BUILDINGS: 100,
        IMPERMEABLE_SOILS: 100,
        MINERAL_SOIL: 100,
        PRAIRIE_GRASS: 200,
        WATER: 200,
      };
      const photovoltaicPanelsSurfaceArea = 250;

      expect(
        canSiteAccomodatePhotovoltaicPanels(soilsDistribution, photovoltaicPanelsSurfaceArea),
      ).toBe(true);
    });

    it("should return true when there is the exact suitable soils surface area", () => {
      const soilsDistribution: SoilsDistribution = {
        BUILDINGS: 100,
        IMPERMEABLE_SOILS: 100,
        MINERAL_SOIL: 100,
        PRAIRIE_GRASS: 200,
        WATER: 200,
      };
      const photovoltaicPanelsSurfaceArea = 400;

      expect(
        canSiteAccomodatePhotovoltaicPanels(soilsDistribution, photovoltaicPanelsSurfaceArea),
      ).toBe(true);
    });
  });

  describe("transformNonSuitableSoils", () => {
    it("should return same soils distribution when nothing to transform", () => {
      const currentSoilsDistribution: SoilsDistribution = {
        BUILDINGS: 100,
        IMPERMEABLE_SOILS: 100,
        MINERAL_SOIL: 100,
        PRAIRIE_GRASS: 200,
        WATER: 200,
      };
      const nonSuitableSoilsToTransform: SoilsDistribution = {};

      expect(
        transformNonSuitableSoils(currentSoilsDistribution, nonSuitableSoilsToTransform),
      ).toEqual(currentSoilsDistribution);
    });

    it("should return same soils distribution when suitable soils passed", () => {
      const currentSoilsDistribution: SoilsDistribution = {
        BUILDINGS: 100,
        IMPERMEABLE_SOILS: 100,
        MINERAL_SOIL: 100,
        PRAIRIE_GRASS: 200,
        WATER: 200,
      };
      const nonSuitableSoilsToTransform: SoilsDistribution = {
        PRAIRIE_GRASS: 100,
        IMPERMEABLE_SOILS: 100,
        MINERAL_SOIL: 100,
      };

      const transformedSoils = transformNonSuitableSoils(
        currentSoilsDistribution,
        nonSuitableSoilsToTransform,
      );
      expect(transformedSoils).toEqual(currentSoilsDistribution);
    });

    it("should remove buildings soils and transform it to mineral soil", () => {
      const currentSoilsDistribution: SoilsDistribution = {
        BUILDINGS: 100,
        IMPERMEABLE_SOILS: 100,
        MINERAL_SOIL: 100,
        PRAIRIE_GRASS: 200,
        WATER: 200,
      };
      const nonSuitableSoilsToTransform: SoilsDistribution = {
        BUILDINGS: 100,
      };

      const transformedSoils = transformNonSuitableSoils(
        currentSoilsDistribution,
        nonSuitableSoilsToTransform,
      );
      expect(transformedSoils).toEqual({
        ...currentSoilsDistribution,
        BUILDINGS: undefined,
        MINERAL_SOIL: 200,
      });
      assertSurfaceAreasEqual(transformedSoils, currentSoilsDistribution);
    });

    it("should partially transform buildings soils given surface area to mineral soil", () => {
      const currentSoilsDistribution: SoilsDistribution = {
        BUILDINGS: 100,
        IMPERMEABLE_SOILS: 100,
        MINERAL_SOIL: 100,
        PRAIRIE_GRASS: 200,
        WATER: 200,
      };
      const nonSuitableSoilsToTransform: SoilsDistribution = {
        BUILDINGS: 50,
      };

      const transformedSoils = transformNonSuitableSoils(
        currentSoilsDistribution,
        nonSuitableSoilsToTransform,
      );
      expect(transformedSoils).toEqual({
        ...currentSoilsDistribution,
        BUILDINGS: 50,
        MINERAL_SOIL: 150,
      });
      assertSurfaceAreasEqual(transformedSoils, currentSoilsDistribution);
    });

    it("should partially transform artificial tree-filled soils given surface area to articial grass/bush soil", () => {
      const currentSoilsDistribution: SoilsDistribution = {
        ARTIFICIAL_TREE_FILLED: 100,
        PRAIRIE_GRASS: 200,
        WATER: 200,
      };
      const nonSuitableSoilsToTransform: SoilsDistribution = {
        ARTIFICIAL_TREE_FILLED: 50,
      };

      const transformedSoils = transformNonSuitableSoils(
        currentSoilsDistribution,
        nonSuitableSoilsToTransform,
      );
      expect(transformedSoils).toEqual({
        ...currentSoilsDistribution,
        ARTIFICIAL_TREE_FILLED: 50,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 50,
      });
      assertSurfaceAreasEqual(transformedSoils, currentSoilsDistribution);
    });

    it("should remove wet land and water soils given surface area to mineral soil", () => {
      const currentSoilsDistribution: SoilsDistribution = {
        ARTIFICIAL_TREE_FILLED: 100,
        PRAIRIE_GRASS: 200,
        WATER: 200,
        WET_LAND: 200,
      };
      const nonSuitableSoilsToTransform: SoilsDistribution = {
        WATER: 200,
        WET_LAND: 200,
      };

      const transformedSoils = transformNonSuitableSoils(
        currentSoilsDistribution,
        nonSuitableSoilsToTransform,
      );
      expect(transformedSoils).toEqual({
        ...currentSoilsDistribution,
        WATER: undefined,
        WET_LAND: undefined,
        MINERAL_SOIL: 400,
      });
      assertSurfaceAreasEqual(transformedSoils, currentSoilsDistribution);
    });

    it("should remove all forest soils surface area to grass prairie surface", () => {
      const currentSoilsDistribution: SoilsDistribution = {
        BUILDINGS: 100,
        IMPERMEABLE_SOILS: 100,
        MINERAL_SOIL: 100,
        PRAIRIE_GRASS: 200,
        FOREST_CONIFER: 50,
        FOREST_DECIDUOUS: 50,
        FOREST_MIXED: 100,
      };
      const nonSuitableSoilsToTransform: SoilsDistribution = {
        FOREST_CONIFER: 50,
        FOREST_DECIDUOUS: 50,
        FOREST_MIXED: 100,
      };

      const transformedSoils = transformNonSuitableSoils(
        currentSoilsDistribution,
        nonSuitableSoilsToTransform,
      );
      expect(transformedSoils).toEqual({
        ...currentSoilsDistribution,
        FOREST_CONIFER: undefined,
        FOREST_DECIDUOUS: undefined,
        FOREST_MIXED: undefined,
        PRAIRIE_GRASS: 400,
      });
      assertSurfaceAreasEqual(transformedSoils, currentSoilsDistribution);
    });
  });

  describe("Soils Transformation Projects", () => {
    describe("allocateRecommendedSoilSurfaceArea", () => {
      it("should return the same soils distribution when there is enough mineral soil", () => {
        const currentSoilsDistribution: SoilsDistribution = {
          PRAIRIE_BUSHES: 100,
          MINERAL_SOIL: 100,
        };

        const transformedSoils = allocateRecommendedSoilSurfaceArea("MINERAL_SOIL")(
          currentSoilsDistribution,
          100,
        );
        expect(transformedSoils).toEqual({
          PRAIRIE_BUSHES: 100,
          MINERAL_SOIL: 100,
        });
        assertSurfaceAreasEqual(transformedSoils, currentSoilsDistribution);
      });

      it("should transform other soil to reach minimal mineral soil surface area", () => {
        const currentSoilsDistribution: SoilsDistribution = {
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          MINERAL_SOIL: 100,
        };

        const transformedSoils = allocateRecommendedSoilSurfaceArea("MINERAL_SOIL")(
          currentSoilsDistribution,
          200,
        );
        expect(transformedSoils).toEqual({
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0,
          MINERAL_SOIL: 200,
        });
        assertSurfaceAreasEqual(transformedSoils, currentSoilsDistribution);
      });

      it("should not allocate more surface area than available", () => {
        const currentSoilsDistribution: SoilsDistribution = {
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          MINERAL_SOIL: 100,
        };

        const transformedSoils = allocateRecommendedSoilSurfaceArea("MINERAL_SOIL")(
          currentSoilsDistribution,
          500,
        );
        expect(transformedSoils).toEqual({
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0,
          MINERAL_SOIL: 200,
        });
        assertSurfaceAreasEqual(transformedSoils, currentSoilsDistribution);
      });

      it("should transform multiple soils to reach minimal mineral soil surface area", () => {
        const currentSoilsDistribution: SoilsDistribution = {
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 100,
          MINERAL_SOIL: 100,
        };

        const transformedSoils = allocateRecommendedSoilSurfaceArea("MINERAL_SOIL")(
          currentSoilsDistribution,
          250,
        );
        expect(transformedSoils).toEqual({
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0,
          PRAIRIE_GRASS: 50,
          MINERAL_SOIL: 250,
        });
        assertSurfaceAreasEqual(transformedSoils, currentSoilsDistribution);
      });

      it("should transform multiple soils to reach minimal mineral soil surface area and give priority to artificial soils over natural ones", () => {
        const currentSoilsDistribution: SoilsDistribution = {
          FOREST_CONIFER: 200,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          PRAIRIE_GRASS: 100,
          MINERAL_SOIL: 100,
          ARTIFICIAL_TREE_FILLED: 100,
        };

        const transformedSoils = allocateRecommendedSoilSurfaceArea("MINERAL_SOIL")(
          currentSoilsDistribution,
          400,
        );
        expect(transformedSoils).toEqual({
          FOREST_CONIFER: 200,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 0,
          PRAIRIE_GRASS: 0,
          MINERAL_SOIL: 400,
          ARTIFICIAL_TREE_FILLED: 0,
        });
        assertSurfaceAreasEqual(transformedSoils, currentSoilsDistribution);
      });

      it("should not transform non-eligible soils", () => {
        const currentSoilsDistribution: SoilsDistribution = {
          BUILDINGS: 50,
          WATER: 200,
          WET_LAND: 100,
          ORCHARD: 100,
          VINEYARD: 230,
          CULTIVATION: 100,
          MINERAL_SOIL: 100,
        };

        const transformedSoils = allocateRecommendedSoilSurfaceArea("MINERAL_SOIL")(
          currentSoilsDistribution,
          400,
        );
        expect(transformedSoils).toEqual(currentSoilsDistribution);
      });
    });

    describe("transformSoilsForRenaturation", () => {
      it("should transform buildings, mineral soil and impermeable soil to artificial grass soil when existing artificial grass soil", () => {
        const currentSoilsDistribution: SoilsDistribution = {
          PRAIRIE_BUSHES: 100,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
          BUILDINGS: 120,
          IMPERMEABLE_SOILS: 200,
          MINERAL_SOIL: 150,
        };

        const renaturedSoils = transformSoilsForRenaturation(currentSoilsDistribution, {
          recommendedImpermeableSurfaceArea: 0,
          recommendedMineralSurfaceArea: 0,
        });
        expect(renaturedSoils).toEqual({
          PRAIRIE_BUSHES: 100,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 570,
        });
        assertSurfaceAreasEqual(renaturedSoils, currentSoilsDistribution);
      });

      it("should transform buildings, mineral soil and impermeable soil to artificial grass soil when no existing artificial grass soil", () => {
        const currentSoilsDistribution: SoilsDistribution = {
          PRAIRIE_BUSHES: 100,
          BUILDINGS: 200,
          IMPERMEABLE_SOILS: 200,
          MINERAL_SOIL: 200,
        };

        const renaturedSoils = transformSoilsForRenaturation(currentSoilsDistribution, {
          recommendedImpermeableSurfaceArea: 0,
          recommendedMineralSurfaceArea: 0,
        });
        expect(renaturedSoils).toEqual({
          PRAIRIE_BUSHES: 100,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 600,
        });
        assertSurfaceAreasEqual(renaturedSoils, currentSoilsDistribution);
      });

      it("should transform mineral soil and impermeable soil to artificial grass soil within limits of required surface areas", () => {
        const currentSoilsDistribution: SoilsDistribution = {
          PRAIRIE_BUSHES: 100,
          BUILDINGS: 100,
          IMPERMEABLE_SOILS: 100,
          MINERAL_SOIL: 100,
        };

        const renaturedSoils = transformSoilsForRenaturation(currentSoilsDistribution, {
          recommendedImpermeableSurfaceArea: 20,
          recommendedMineralSurfaceArea: 50,
        });
        expect(renaturedSoils).toEqual({
          PRAIRIE_BUSHES: 100,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 230,
          IMPERMEABLE_SOILS: 20,
          MINERAL_SOIL: 50,
        });
        assertSurfaceAreasEqual(renaturedSoils, currentSoilsDistribution);
      });

      it("should transform mineral soil and buildings to artificial grass soil within limits of required surface areas and allocate impermeable soil", () => {
        const currentSoilsDistribution: SoilsDistribution = {
          WATER: 222,
          PRAIRIE_TREES: 300,
          MINERAL_SOIL: 2000,
          BUILDINGS: 200,
        };

        const renaturedSoils = transformSoilsForRenaturation(currentSoilsDistribution, {
          recommendedImpermeableSurfaceArea: 20,
          recommendedMineralSurfaceArea: 50,
        });
        expect(renaturedSoils).toEqual({
          WATER: 222,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 2130,
          PRAIRIE_TREES: 300,
          IMPERMEABLE_SOILS: 20,
          MINERAL_SOIL: 50,
        });
        assertSurfaceAreasEqual(renaturedSoils, currentSoilsDistribution);
      });
    });
  });
  describe("getSuitableSoilsForTransformation", () => {
    it("should always include buildings, artifical, mineral and impermeable soils with current soils when none of them exist", () => {
      const currentSoils: SoilType[] = [
        "PRAIRIE_BUSHES",
        "PRAIRIE_GRASS",
        "PRAIRIE_TREES",
        "WATER",
        "WET_LAND",
        "CULTIVATION",
      ];
      expect(getSuitableSoilsForTransformation(currentSoils)).toEqual([
        "BUILDINGS",
        "IMPERMEABLE_SOILS",
        "MINERAL_SOIL",
        "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
        "ARTIFICIAL_TREE_FILLED",
        "PRAIRIE_BUSHES",
        "PRAIRIE_GRASS",
        "PRAIRIE_TREES",
        "WATER",
        "WET_LAND",
        "CULTIVATION",
      ]);
    });

    it("should include artifical soils with current soils when does not exist", () => {
      const currentSoils: SoilType[] = ["BUILDINGS", "MINERAL_SOIL", "IMPERMEABLE_SOILS"];
      expect(getSuitableSoilsForTransformation(currentSoils)).toEqual([
        "BUILDINGS",
        "IMPERMEABLE_SOILS",
        "MINERAL_SOIL",
        "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
        "ARTIFICIAL_TREE_FILLED",
      ]);
    });

    it("should include mineral and impermeable soils with current soils when do not exist", () => {
      const currentSoils: SoilType[] = [
        "BUILDINGS",
        "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
        "ARTIFICIAL_TREE_FILLED",
      ];
      expect(getSuitableSoilsForTransformation(currentSoils)).toEqual([
        "BUILDINGS",
        "IMPERMEABLE_SOILS",
        "MINERAL_SOIL",
        "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
        "ARTIFICIAL_TREE_FILLED",
      ]);
    });

    it("should not add buildings, mineral, impermeable and artificial soils when already exist", () => {
      const currentSoils: SoilType[] = [
        "BUILDINGS",
        "IMPERMEABLE_SOILS",
        "MINERAL_SOIL",
        "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
        "ARTIFICIAL_TREE_FILLED",
      ];
      expect(getSuitableSoilsForTransformation(currentSoils)).toEqual(currentSoils);
    });
  });

  describe("willTransformationNoticeablyImpactBiodiversityAndClimate", () => {
    it("should return false when no forest or wet land on site", () => {
      const currentSoilsDistribution: SoilsDistribution = {
        MINERAL_SOIL: 100,
        PRAIRIE_GRASS: 100,
      };
      const futureSoilsDistribution: SoilsDistribution = {
        MINERAL_SOIL: 100,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
      };
      expect(
        willTransformationNoticeablyImpactBiodiversityAndClimate(
          currentSoilsDistribution,
          futureSoilsDistribution,
        ),
      ).toBe(false);
    });
    it("should return true when 20% of forest will be destroyed", () => {
      const currentSoilsDistribution: SoilsDistribution = {
        FOREST_CONIFER: 100,
        MINERAL_SOIL: 50,
      };
      const futureSoilsDistribution: SoilsDistribution = {
        FOREST_CONIFER: 80,
        MINERAL_SOIL: 50,
        PRAIRIE_GRASS: 20,
      };
      expect(
        willTransformationNoticeablyImpactBiodiversityAndClimate(
          currentSoilsDistribution,
          futureSoilsDistribution,
        ),
      ).toBe(true);
    });
    it("should return false when less than 10% of forest will be destroyed", () => {
      const currentSoilsDistribution: SoilsDistribution = {
        FOREST_CONIFER: 100,
        MINERAL_SOIL: 50,
      };
      const futureSoilsDistribution: SoilsDistribution = {
        FOREST_CONIFER: 91,
        MINERAL_SOIL: 50,
        PRAIRIE_GRASS: 9,
      };
      expect(
        willTransformationNoticeablyImpactBiodiversityAndClimate(
          currentSoilsDistribution,
          futureSoilsDistribution,
        ),
      ).toBe(false);
    });
    it("should return false when less than 10% of wet land will be destroyed", () => {
      const currentSoilsDistribution: SoilsDistribution = {
        WET_LAND: 100,
        MINERAL_SOIL: 50,
      };
      const futureSoilsDistribution: SoilsDistribution = {
        WET_LAND: 95,
        MINERAL_SOIL: 55,
      };
      expect(
        willTransformationNoticeablyImpactBiodiversityAndClimate(
          currentSoilsDistribution,
          futureSoilsDistribution,
        ),
      ).toBe(false);
    });
    it("should return true when more than 10% of wet land will be destroyed", () => {
      const currentSoilsDistribution: SoilsDistribution = {
        WET_LAND: 100,
        MINERAL_SOIL: 50,
      };
      const futureSoilsDistribution: SoilsDistribution = {
        WET_LAND: 50,
        MINERAL_SOIL: 100,
      };
      expect(
        willTransformationNoticeablyImpactBiodiversityAndClimate(
          currentSoilsDistribution,
          futureSoilsDistribution,
        ),
      ).toBe(true);
    });
    it("should return true when more than 10% of cumulated forest and wet land will be destroyed", () => {
      const currentSoilsDistribution: SoilsDistribution = {
        WET_LAND: 100,
        FOREST_DECIDUOUS: 100,
        MINERAL_SOIL: 50,
      };
      const futureSoilsDistribution: SoilsDistribution = {
        FOREST_DECIDUOUS: 100,
        MINERAL_SOIL: 150,
      };
      expect(
        willTransformationNoticeablyImpactBiodiversityAndClimate(
          currentSoilsDistribution,
          futureSoilsDistribution,
        ),
      ).toBe(true);
    });
    it("should return false when less than 10% of cumulated forest and wet land will be destroyed", () => {
      const currentSoilsDistribution: SoilsDistribution = {
        WET_LAND: 200,
        FOREST_DECIDUOUS: 100,
        MINERAL_SOIL: 50,
      };
      const futureSoilsDistribution: SoilsDistribution = {
        WET_LAND: 200,
        FOREST_DECIDUOUS: 75,
        MINERAL_SOIL: 50,
        PRAIRIE_GRASS: 25,
      };
      expect(
        willTransformationNoticeablyImpactBiodiversityAndClimate(
          currentSoilsDistribution,
          futureSoilsDistribution,
        ),
      ).toBe(false);
    });
  });
});
