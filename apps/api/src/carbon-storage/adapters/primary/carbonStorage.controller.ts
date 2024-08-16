import { Controller, Get, Query } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { soilTypeSchema } from "shared";
import { GetCityCarbonStoragePerSoilsCategoryUseCase } from "src/carbon-storage/core/usecases/getCityCarbonStoragePerSoilsCategory";

const GetSoilsCarbonStorageDtoSchema = z.object({
  cityCode: z.string(),
  soils: z.array(
    z.object({
      surfaceArea: z.coerce.number().nonnegative(),
      type: soilTypeSchema,
    }),
  ),
});

class GetSoilsCarbonStorageDto extends createZodDto(GetSoilsCarbonStorageDtoSchema) {}

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
      soilsStorage: soilsCarbonStorage,
    };
  }
}
