import { UseCase } from "../../../shared-kernel/usecase";
import { CarbonStorageRepository } from "../gateways/CarbonStorageRepository";
import { SoilCategory, SoilCategoryType } from "../models/soilCategory";
import { SurfaceArea, SurfaceAreaType } from "../models/surfaceArea";

type Request = {
  cityCode: string;
  soils: {
    surfaceArea: SurfaceArea;
    type: SoilCategory;
  }[];
};

type Response = {
  totalCarbonStorage: number;
  soilsCarbonStorage: {
    surfaceArea: SurfaceAreaType;
    carbonStorage: number; // m2
    type: SoilCategoryType;
  }[];
};

export class GetCityCarbonStoragePerSoilsCategoryUseCase implements UseCase<Request, Response> {
  constructor(private readonly carbonStorageRepository: CarbonStorageRepository) {}

  async execute({ cityCode, soils = [] }: Request): Promise<Response> {
    const carbonStorage = await this.carbonStorageRepository.getCarbonStorageForCity(
      cityCode,
      soils.map(({ type }) => type.getRepositorySoilCategory()),
    );

    const soilsCarbonStorage = soils.map(({ type, surfaceArea }) => {
      const entriesForCategory = carbonStorage.filter(
        ({ soilCategory }) => soilCategory === type.getRepositorySoilCategory(),
      );
      const totalForCategory = entriesForCategory.reduce(
        (total, { carbonStorageInTonByHectare }) =>
          total + carbonStorageInTonByHectare * surfaceArea.getInHectares(),
        0,
      );
      return {
        type: type.getValue(),
        surfaceArea: surfaceArea.getInSquareMeters(),
        carbonStorage: totalForCategory,
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
