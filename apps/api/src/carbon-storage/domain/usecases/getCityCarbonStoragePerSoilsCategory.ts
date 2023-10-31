import { UseCase } from "../../../shared-kernel/usecase";
import { CarbonStorageRepository } from "../gateways/CarbonStorageRepository";
import { SoilCategoryType } from "../models/carbonStorage";

type Request = {
  cityCode: string;
  soils: {
    surfaceArea: number; // m2
    type: SoilCategoryType;
  }[];
};

type Response = {
  totalCarbonStorage: number;
  soilsCarbonStorage: {
    surfaceArea: number;
    carbonStorage: number; // m2
    type: SoilCategoryType;
  }[];
};

// TODO: use a shared service with frontend
const convertSquareMetersToHectares = (surfaceAreaInSquareMeters: number) => {
  return surfaceAreaInSquareMeters / 10000;
};

export class GetCityCarbonStoragePerSoilsCategoryUseCase
  implements UseCase<Request, Response>
{
  constructor(
    private readonly carbonStorageRepository: CarbonStorageRepository,
  ) {}

  async execute({ cityCode, soils = [] }: Request): Promise<Response> {
    const carbonStorage =
      await this.carbonStorageRepository.getCarbonStorageForCity(
        cityCode,
        soils.map(({ type }) => type),
      );

    const soilsCarbonStorage = soils.map(({ type, surfaceArea }) => {
      const entriesForCategory = carbonStorage.filter(
        ({ soilCategory }) => soilCategory === type,
      );
      const totalForCategory = entriesForCategory.reduce(
        (total, { carbonStorageInTonByHectare }) =>
          total +
          carbonStorageInTonByHectare *
            convertSquareMetersToHectares(surfaceArea),
        0,
      );
      return { type, surfaceArea, carbonStorage: totalForCategory };
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
