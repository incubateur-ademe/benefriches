import { Controller, Get, Query } from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import {
  getCityRuralityRequestDtoSchema,
  type GetCityRuralityRequestDto,
  type GetCityRuralityResponseDto,
} from "shared";

import { GetCityRuralityUseCase } from "src/territory/core/usecases/getCityRurality.usecase";

@Controller("territory")
export class TerritoryController {
  private readonly getCityRuralityUseCase: GetCityRuralityUseCase;
  constructor(getCityRuralityUseCase: GetCityRuralityUseCase) {
    this.getCityRuralityUseCase = getCityRuralityUseCase;
  }

  @Get("city-rurality")
  async getCityRurality(
    @Query(new ZodValidationPipe(getCityRuralityRequestDtoSchema))
    query: GetCityRuralityRequestDto,
  ): Promise<GetCityRuralityResponseDto> {
    const result = await this.getCityRuralityUseCase.execute({ cityCode: query.cityCode });

    if (!result.isSuccess()) {
      throw new Error("Failed to determine city rurality");
    }

    return result.getData();
  }
}
