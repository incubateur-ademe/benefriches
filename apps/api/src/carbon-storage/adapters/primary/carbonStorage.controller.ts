import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { SoilCategoryType } from "src/carbon-storage/domain/models/carbonStorage";
import { GetCityCarbonStoragePerSoilsCategoryUseCase } from "src/carbon-storage/domain/usecases/getCityCarbonStoragePerSoilsCategory";

type QueryPayload = {
  cityCode?: string;
  soils?: {
    surfaceArea: string;
    type: SoilCategoryType;
  }[];
};

@Controller("site-soils-carbon-sequestration")
export class CarbonStorageController {
  constructor(
    private readonly getCityCarbonStoragePerSoilsCategory: GetCityCarbonStoragePerSoilsCategoryUseCase,
  ) {}

  @Get()
  async getFeaturesFromLocation(@Query() query: QueryPayload) {
    const { cityCode, soils } = query;

    if (!cityCode) {
      throw new BadRequestException("City code is missing");
    }

    if (!soils || soils.length === 0) {
      throw new BadRequestException("Soils are missing");
    }

    const { totalCarbonStorage, soilsCarbonStorage } =
      await this.getCityCarbonStoragePerSoilsCategory.execute({
        cityCode: cityCode,
        soils: soils.map(({ surfaceArea, type }) => ({
          surfaceArea: parseFloat(surfaceArea),
          type: type.toLowerCase() as SoilCategoryType,
        })),
      });

    return {
      totalCarbonStorage,
      soilsCarbonStorage: soilsCarbonStorage.map(
        ({ type, surfaceArea, carbonStorage }) => ({
          type: type.toUpperCase(),
          surfaceArea,
          carbonStorage,
        }),
      ),
    };
  }
}
