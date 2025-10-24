import { Controller, Get, Query } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { soilTypeSchema } from "shared";
import { z } from "zod";

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
    const result = await this.getCityCarbonStoragePerSoilsCategory.execute({
      cityCode,
      soils,
    });

    if (!result.isSuccess()) {
      // This usecase always succeeds, so this should never happen
      throw new Error("Failed to compute carbon storage");
    }

    const { totalCarbonStorage, soilsCarbonStorage } = result.getData();
    return {
      totalCarbonStorage,
      soilsStorage: soilsCarbonStorage,
    };
  }
}
