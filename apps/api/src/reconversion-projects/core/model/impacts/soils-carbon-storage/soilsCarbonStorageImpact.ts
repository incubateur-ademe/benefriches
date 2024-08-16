import { typedObjectEntries } from "shared";
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

export type SoilsCarbonStorageImpactResult = {
  current: {
    total: number;
    soils: {
      type: SoilType;
      surfaceArea: number;
      carbonStorage: number;
    }[];
  };
  forecast: {
    total: number;
    soils: {
      type: SoilType;
      surfaceArea: number;
      carbonStorage: number;
    }[];
  };
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
  const currentSoilsCarbonStorage = await input.getSoilsCarbonStorageService.execute({
    cityCode: input.siteCityCode,
    soils: soilsDistributionObjToArray(input.currentSoilsDistribution),
  });
  const forecastSoilsCarbonStorage = await input.getSoilsCarbonStorageService.execute({
    cityCode: input.siteCityCode,
    soils: soilsDistributionObjToArray(input.forecastSoilsDistribution),
  });

  return {
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
};
