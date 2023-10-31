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

@Controller("carbon-storage")
export class CarbonStorageController {
  constructor(
    private readonly getCityCarbonStoragePerSoilsCategory: GetCityCarbonStoragePerSoilsCategoryUseCase,
  ) {}

  @Get("site-soils")
  async getSiteSoilsCarbonStorage(@Query() query: GetSoilsCarbonStorageDto) {
    const { cityCode, soils } = query;
    const { totalCarbonStorage, soilsCarbonStorage } =
      await this.getCityCarbonStoragePerSoilsCategory.execute({
        cityCode,
        soils,
      });
    return {
      totalCarbonStorage,
      soilsStorage: soilsCarbonStorage.map((soilCarbonStorage) => ({
        ...soilCarbonStorage,
        type: soilCarbonStorage.type.toUpperCase(),
      })),
    };
  }
}
