import { SoilType } from "src/soils/domain/soils";
import { UseCase } from "../../../shared-kernel/usecase";
import { CarbonStorageRepository } from "../gateways/CarbonStorageRepository";
import { mapSoilTypeToRepositorySoilCategory } from "../models/soilCategory";

type Request = {
  cityCode: string;
  soils: {
    surfaceArea: number;
    type: SoilType;
  }[];
};

export type Response = {
  totalCarbonStorage: number;
  soilsCarbonStorage: {
    surfaceArea: number; // m²
    carbonStorage: number;
    carbonStorageInTonPerSquareMeters: number;
    type: SoilType;
  }[];
};

export class GetCityCarbonStoragePerSoilsCategoryUseCase implements UseCase<Request, Response> {
  constructor(private readonly carbonStorageRepository: CarbonStorageRepository) {}

  async execute({ cityCode, soils = [] }: Request): Promise<Response> {
    const carbonStorage = await this.carbonStorageRepository.getCarbonStorageForCity(
      cityCode,
      soils.map(({ type }) => mapSoilTypeToRepositorySoilCategory(type)),
    );

    const soilsCarbonStorage = soils.map(({ type, surfaceArea }) => {
      const entriesForCategory = carbonStorage.filter(
        ({ soilCategory }) => soilCategory === mapSoilTypeToRepositorySoilCategory(type),
      );
      const totalCarbonStoragePerHectare = entriesForCategory.reduce(
        (total, { carbonStorageInTonByHectare }) => total + carbonStorageInTonByHectare,
        0,
      );
      const carbonStorageInTonPerSquareMeters = totalCarbonStoragePerHectare / 10000;
      const totalForCategory = carbonStorageInTonPerSquareMeters * surfaceArea;
      return {
        type,
        surfaceArea,
        carbonStorage: totalForCategory,
        carbonStorageInTonPerSquareMeters,
      };
    });

    const totalCarbonStorage = Object.values(soilsCarbonStorage).reduce(
      (total, { carbonStorage }) => total + carbonStorage,
      0,
    );

    return {
      totalCarbonStorage: Math.round(totalCarbonStorage * 100) / 100,
      soilsCarbonStorage,
    };
  }
}
