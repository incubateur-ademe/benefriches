import { lastValueFrom } from "rxjs";
import { roundTo2Digits } from "shared";

import { UseCase } from "../../../shared-kernel/usecase";
import { CityDataProvider } from "../gateways/CityDataProvider";

type Request = {
  cityCode: string;
};

type Response = {
  value: number;
  unit: "hab/km2";
  sources: {
    population: number;
    area: number;
  };
};

export class GetCityPopulationDensityUseCase implements UseCase<Request, Response> {
  constructor(private readonly cityDataProvider: CityDataProvider) {}

  async execute({ cityCode }: Request): Promise<Response> {
    const city = await lastValueFrom(
      this.cityDataProvider.getCitySurfaceAreaAndPopulation(cityCode),
    );

    const density = city.population / city.surfaceArea;
    const rounded = roundTo2Digits(density);

    return {
      value: rounded,
      unit: "hab/km2",
      sources: {
        population: city.population,
        area: city.surfaceArea,
      },
    };
  }
}
