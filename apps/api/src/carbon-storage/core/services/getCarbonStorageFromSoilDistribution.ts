import { roundTo2Digits, SoilsDistribution, SoilType, sumObjectValues } from "shared";

import { CarbonStorageQuery } from "../gateways/CarbonStorageQuery";
import { mapSoilTypeToRepositorySoilCategory } from "../models/soilCategory";

type Request = {
  cityCode: string;
  soilsDistribution: Partial<SoilsDistribution>;
};

type Response = {
  total: number;
} & Partial<Record<SoilType, number>>;

export class GetCarbonStorageFromSoilDistributionService {
  constructor(private readonly carbonStorageQuery: CarbonStorageQuery) {}

  async execute({ cityCode, soilsDistribution = {} }: Request): Promise<Response | undefined> {
    try {
      const soilsTypes = Object.keys(soilsDistribution) as SoilType[];
      const carbonStorage = await this.carbonStorageQuery.getCarbonStorageForCity(
        cityCode,
        soilsTypes.map((type) => mapSoilTypeToRepositorySoilCategory(type)),
      );

      const soilsCarbonStorage = {};

      soilsTypes.forEach((type) => {
        const entriesForCategory = carbonStorage.filter(
          ({ soilCategory }) => soilCategory === mapSoilTypeToRepositorySoilCategory(type),
        );
        const totalCarbonStoragePerHectare = entriesForCategory.reduce(
          (total, { carbonStorageInTonByHectare }) => total + carbonStorageInTonByHectare,
          0,
        );
        const carbonStorageInTonPerSquareMeters = totalCarbonStoragePerHectare / 10000;
        const surfaceArea = soilsDistribution[type] ?? 0;
        const totalForCategory = carbonStorageInTonPerSquareMeters * surfaceArea;
        Object.assign(soilsCarbonStorage, { [type]: roundTo2Digits(totalForCategory) });
      });

      return {
        total: roundTo2Digits(sumObjectValues(soilsCarbonStorage)),
        ...soilsCarbonStorage,
      };
    } catch (err) {
      console.error("Failed to compute soils carbon storage impact", err);
      return undefined;
    }
  }
}
