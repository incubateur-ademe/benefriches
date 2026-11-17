import { Controller, Get, Param } from "@nestjs/common";
import { cityCodeParamSchema, type GetCityReferenceDataResponseDto } from "shared";

import { GetCityReferenceDataUseCase } from "src/territory/core/usecases/getCityReferenceData.usecase";

@Controller("territory")
export class TerritoryController {
  private readonly getCityReferenceDataUseCase: GetCityReferenceDataUseCase;
  constructor(getCityReferenceDataUseCase: GetCityReferenceDataUseCase) {
    this.getCityReferenceDataUseCase = getCityReferenceDataUseCase;
  }

  @Get("city-reference-data/:cityCode")
  async getCityReferenceData(
    @Param("cityCode", { schema: cityCodeParamSchema }) cityCode: string,
  ): Promise<GetCityReferenceDataResponseDto> {
    const result = await this.getCityReferenceDataUseCase.execute({ cityCode: cityCode });

    if (!result.isSuccess()) {
      throw new Error("Failed to retrieve city reference data");
    }

    return result.getData();
  }
}
