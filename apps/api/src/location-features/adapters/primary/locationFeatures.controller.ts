import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { GetTownPopulationDensityUseCase } from "src/location-features/domain/usecases/getTownPopulationDensity.usecase";

@Controller("location-features")
export class LocationFeaturesController {
  constructor(private readonly getTownPopulationDensity: GetTownPopulationDensityUseCase) {}

  @Get()
  async getFeaturesFromLocation(@Query("cityCode") cityCode: string) {
    if (!cityCode) {
      throw new BadRequestException("City code is missing");
    }

    const density = await this.getTownPopulationDensity.execute({ cityCode });
    return {
      populationDensity: density,
      cityCode,
    };
  }
}
