import { SoilsCarbonStorageImpactResult, typedObjectEntries } from "shared";
import { SoilsDistribution, SoilType } from "shared";

import { Response as SoilsCarbonStorageResult } from "src/carbon-storage/core/usecases/getCityCarbonStoragePerSoilsCategory";

const soilsDistributionObjToArray = (
  soilsDistribution: SoilsDistribution,
): { type: SoilType; surfaceArea: number }[] => {
  return typedObjectEntries(soilsDistribution).map(([type, surfaceArea]) => ({
    type,
    surfaceArea: surfaceArea ?? 0,
  }));
};

export interface GetSoilsCarbonStoragePerSoilsService {
  execute(input: {
    cityCode: string;
    soils: {
      surfaceArea: number;
      type: SoilType;
    }[];
  }): Promise<SoilsCarbonStorageResult>;
}

type SoilsCarbonStorageImpactInput = {
  currentSoilsDistribution: SoilsDistribution;
  forecastSoilsDistribution: SoilsDistribution;
  siteCityCode: string;
  getSoilsCarbonStorageService: GetSoilsCarbonStoragePerSoilsService;
};

export const computeSoilsCarbonStorageImpact = async (
  input: SoilsCarbonStorageImpactInput,
): Promise<SoilsCarbonStorageImpactResult> => {
  try {
    const currentSoilsCarbonStorage = await input.getSoilsCarbonStorageService.execute({
      cityCode: input.siteCityCode,
      soils: soilsDistributionObjToArray(input.currentSoilsDistribution),
    });
    const forecastSoilsCarbonStorage = await input.getSoilsCarbonStorageService.execute({
      cityCode: input.siteCityCode,
      soils: soilsDistributionObjToArray(input.forecastSoilsDistribution),
    });

    return {
      isSuccess: true,
      current: {
        total: currentSoilsCarbonStorage.totalCarbonStorage,
        soils: currentSoilsCarbonStorage.soilsCarbonStorage.map((soil) => ({
          type: soil.type,
          surfaceArea: soil.surfaceArea,
          carbonStorage: soil.carbonStorage,
        })),
      },
      forecast: {
        total: forecastSoilsCarbonStorage.totalCarbonStorage,
        soils: forecastSoilsCarbonStorage.soilsCarbonStorage.map((soil) => ({
          type: soil.type,
          surfaceArea: soil.surfaceArea,
          carbonStorage: soil.carbonStorage,
        })),
      },
    };
  } catch (err) {
    console.error("Failed to compute soils carbon storage impact", err);
    return { isSuccess: false };
  }
};
