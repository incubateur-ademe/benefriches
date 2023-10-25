import { Controller, Get, Query } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { SoilCategoryType } from "src/carbon-storage/domain/models/carbonStorage";
import { GetCityCarbonStoragePerSoilsCategoryUseCase } from "src/carbon-storage/domain/usecases/getCityCarbonStoragePerSoilsCategory";

const GetSoilsCarbonStorageDtoSchema = z.object({
  cityCode: z.string(),
  soils: z.array(
    z.object({
      surfaceArea: z.string().transform(Number),
      type: z.string().toLowerCase().pipe(z.nativeEnum(SoilCategoryType)),
    }),
  ),
});

class GetSoilsCarbonStorageDto extends createZodDto(
  GetSoilsCarbonStorageDtoSchema,
) {}

@Controller("site-soils-carbon-storage")
export class CarbonStorageController {
  constructor(
    private readonly getCityCarbonStoragePerSoilsCategory: GetCityCarbonStoragePerSoilsCategoryUseCase,
  ) {}

  @Get()
  async getSiteSoilsCarbonStorage(@Query() query: GetSoilsCarbonStorageDto) {
    const { cityCode, soils } = query;

    const { totalCarbonStorage, soilsCarbonStorage } =
      await this.getCityCarbonStoragePerSoilsCategory.execute({
        cityCode: cityCode,
        soils: soils.map(({ surfaceArea, type }) => ({
          surfaceArea: surfaceArea,
          type,
        })),
      });

    return {
      totalCarbonStorage,
      soilsStorage: soilsCarbonStorage.reduce(
        (soilsStorage, { type, carbonStorage }) => ({
          ...soilsStorage,
          [type.toUpperCase()]: carbonStorage,
        }),
        {},
      ),
    };
  }
}