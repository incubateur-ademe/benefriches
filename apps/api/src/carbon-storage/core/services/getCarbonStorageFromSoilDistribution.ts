import { roundTo2Digits, SoilsDistribution, soilsDistributionObjToArray, sumList } from "shared";

import { CarbonStorageQuery } from "../gateways/CarbonStorageQuery";
import { mapSoilTypeToRepositorySoilCategory } from "../models/soilCategory";

type Request = {
  cityCode: string;
  soilsDistribution: Partial<SoilsDistribution>;
};

export class GetCarbonStorageFromSoilDistributionService {
  constructor(private readonly carbonStorageQuery: CarbonStorageQuery) {}

  async execute({ cityCode, soilsDistribution = {} }: Request): Promise<number | undefined> {
    try {
      const soils = soilsDistributionObjToArray(soilsDistribution);
      const carbonStorage = await this.carbonStorageQuery.getCarbonStorageForCity(
        cityCode,
        soils.map(({ type }) => mapSoilTypeToRepositorySoilCategory(type)),
      );

      const totalCarbonStorage = sumList(
        soils.map(({ type, surfaceArea }) => {
          const entriesForCategory = carbonStorage.filter(
            ({ soilCategory }) => soilCategory === mapSoilTypeToRepositorySoilCategory(type),
          );
          const totalCarbonStoragePerHectare = entriesForCategory.reduce(
            (total, { carbonStorageInTonByHectare }) => total + carbonStorageInTonByHectare,
            0,
          );
          const carbonStorageInTonPerSquareMeters = totalCarbonStoragePerHectare / 10000;
          const totalForCategory = carbonStorageInTonPerSquareMeters * surfaceArea;
          return totalForCategory;
        }),
      );

      return roundTo2Digits(totalCarbonStorage);
    } catch (err) {
      console.error("Failed to compute soils carbon storage impact", err);
      return undefined;
    }
  }
}
