import { lastValueFrom } from "rxjs";
import { UseCase } from "../../../shared-kernel/usecase";
import { CityDataProvider } from "../gateways/CityDataProvider";

type Request = {
  cityCode: string;
};

type Response = {
  squareMetersSurfaceArea: number;
  population: number;
};

const FRANCE_AVERAGE_CITY_POPULATION = 1800;
const FRANCE_AVERAGE_CITY_SQUARE_METERS_AREA = 14900000;

export class GetCityPopulationAndSurfaceAreaUseCase implements UseCase<Request, Response> {
  constructor(private readonly cityDataProvider: CityDataProvider) {}

  async execute({ cityCode }: Request): Promise<Response> {
    try {
      const city = await lastValueFrom(
        this.cityDataProvider.getCitySurfaceAreaAndPopulation(cityCode),
      );

      return {
        squareMetersSurfaceArea: city.area * 10000,
        population: city.population,
      };
    } catch (error) {
      console.warn("Cannot get city population and surface area: ", error);
      return {
        squareMetersSurfaceArea: FRANCE_AVERAGE_CITY_SQUARE_METERS_AREA,
        population: FRANCE_AVERAGE_CITY_POPULATION,
      };
    }
  }
}
