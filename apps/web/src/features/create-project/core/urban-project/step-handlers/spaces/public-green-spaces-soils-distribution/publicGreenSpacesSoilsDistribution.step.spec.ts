import { describe, expect, it } from "vitest";

import { mockSiteData } from "@/features/create-project/core/urban-project/__tests__/_siteData.mock";
import { StoreBuilder } from "@/features/create-project/core/urban-project/__tests__/_testStoreHelpers";
import { creationProjectFormSelectors } from "@/features/create-project/core/urban-project/urbanProject.selectors";

describe("selectPublicGreenSpacesSoilsDistributionViewData", () => {
  it("should include constrained soil types from default answers even when not present on site", () => {
    const store = new StoreBuilder()
      .withSiteData({
        ...mockSiteData,
        soilsDistribution: {
          BUILDINGS: 2250,
          CULTIVATION: 42750,
        },
      })
      .withSteps({
        URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            publicGreenSpacesSurfaceArea: 45000,
          },
        },
        URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION: {
          completed: true,
          defaultValues: {
            publicGreenSpacesSoilsDistribution: {
              ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 18000,
              ARTIFICIAL_TREE_FILLED: 22500,
              WATER: 4500,
            },
          },
        },
      })
      .build();

    const result = creationProjectFormSelectors.selectPublicGreenSpacesSoilsDistributionViewData(
      store.getState(),
    );

    [
      "IMPERMEABLE_SOILS",
      "MINERAL_SOIL",
      "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      "ARTIFICIAL_TREE_FILLED",
      "CULTIVATION",
      "WATER",
    ].forEach((soilType) => {
      expect(result.availableSoilTypes).toContain(soilType);
    });
    expect(result.publicGreenSpacesSoilsDistribution).toEqual({
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 18000,
      ARTIFICIAL_TREE_FILLED: 22500,
      WATER: 4500,
    });
  });

  it("should order soil types with trees and vegetated spaces before paths", () => {
    const store = new StoreBuilder()
      .withSiteData({
        ...mockSiteData,
        soilsDistribution: {
          BUILDINGS: 1000,
          IMPERMEABLE_SOILS: 1000,
          MINERAL_SOIL: 1000,
        },
      })
      .withSteps({
        URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { publicGreenSpacesSurfaceArea: 3000 },
        },
      })
      .build();

    const result = creationProjectFormSelectors.selectPublicGreenSpacesSoilsDistributionViewData(
      store.getState(),
    );

    expect(result.availableSoilTypes.slice(0, 4)).toEqual([
      "ARTIFICIAL_TREE_FILLED",
      "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      "MINERAL_SOIL",
      "IMPERMEABLE_SOILS",
    ]);
  });
});
