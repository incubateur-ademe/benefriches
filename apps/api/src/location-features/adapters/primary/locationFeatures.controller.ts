import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { GetTownCarbonStocksPerSoilsCategoryUseCase } from "src/location-features/domain/usecases/getTownCarbonStocksPerSoilsCategory";
import { GetTownPopulationDensityUseCase } from "src/location-features/domain/usecases/getTownPopulationDensity.usecase";

@Controller("location-features")
export class LocationFeaturesController {
  constructor(
    private readonly getTownPopulationDensity: GetTownPopulationDensityUseCase,
    private readonly getTownCarbonStocksPerSoilsCategory: GetTownCarbonStocksPerSoilsCategoryUseCase,
  ) {}

  @Get()
  async getFeaturesFromLocation(@Query("cityCode") cityCode: string) {
    if (!cityCode) {
      throw new BadRequestException("City code is missing");
    }

    const density = await this.getTownPopulationDensity.execute({ cityCode });
    const carbonStocks = await this.getTownCarbonStocksPerSoilsCategory.execute(
      { cityCode },
    );
    return {
      populationDensity: density,
      cityCode,
      carbonStocks,
    };
  }
}
