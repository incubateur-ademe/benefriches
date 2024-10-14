import {
  getSoilTypeForLivingAndActivitySpace,
  getSoilTypeForPublicSpace,
  getSoilTypeForUrbanGreenSpace,
  NewSoilsDistribution,
  typedObjectEntries,
  UrbanGreenSpace,
  UrbanLivingAndActivitySpace,
  UrbanPublicSpace,
} from "shared";

export type UrbanSpacesByCategory = (
  | {
      category: "URBAN_FARM";
      surfaceArea: number;
    }
  | {
      category: "URBAN_POND_OR_LAKE";
      surfaceArea: number;
    }
  | {
      category: "PUBLIC_SPACES";
      surfaceArea: number;
      spaces: Partial<Record<UrbanPublicSpace, number>>;
    }
  | {
      category: "GREEN_SPACES";
      surfaceArea: number;
      spaces: Partial<Record<UrbanGreenSpace, number>>;
    }
  | {
      category: "LIVING_AND_ACTIVITY_SPACES";
      surfaceArea: number;
      spaces: Partial<Record<UrbanLivingAndActivitySpace, number>>;
    }
)[];

export const getUrbanProjectSoilsDistributionFromSpaces = (
  spaces: UrbanSpacesByCategory,
): NewSoilsDistribution => {
  const soilsDistribution = new NewSoilsDistribution();

  spaces.forEach((spaceByCategory) => {
    switch (spaceByCategory.category) {
      case "LIVING_AND_ACTIVITY_SPACES":
        typedObjectEntries(spaceByCategory.spaces).forEach(([spaceName, surface]) => {
          soilsDistribution.addSurface(
            getSoilTypeForLivingAndActivitySpace(spaceName),
            surface as number,
          );
        });
        break;
      case "PUBLIC_SPACES":
        typedObjectEntries(spaceByCategory.spaces).forEach(([spaceName, surface]) => {
          soilsDistribution.addSurface(getSoilTypeForPublicSpace(spaceName), surface as number);
        });
        break;
      case "GREEN_SPACES":
        typedObjectEntries(spaceByCategory.spaces).forEach(([spaceName, surface]) => {
          soilsDistribution.addSurface(getSoilTypeForUrbanGreenSpace(spaceName), surface as number);
        });
        break;
      case "URBAN_POND_OR_LAKE":
        soilsDistribution.addSurface("WATER", spaceByCategory.surfaceArea);
        break;
    }
  });

  return soilsDistribution;
};
