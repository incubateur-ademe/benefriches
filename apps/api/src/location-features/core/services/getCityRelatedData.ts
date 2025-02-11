import { lastValueFrom } from "rxjs";

import { CityDataProvider } from "../../../reconversion-projects/core/gateways/CityDataProvider";
import { CityPropertyValueProvider } from "../gateways/CityPropertyValueProvider";

const FRANCE_AVERAGE_CITY_POPULATION = 1800;
const FRANCE_AVERAGE_CITY_SQUARE_METERS_AREA = 14900000;

const FRANCE_AVERAGE_PROPERTY_VALUE_SQUARE_METER = 3064;
const FRANCE_AVERAGE_PROPERTY_VALUE_REFERENCE_YEAR = "2024";

export class GetCityRelatedDataService {
  constructor(
    private readonly cityDataProvider: CityDataProvider,
    private readonly cityPropertyValueProvider: CityPropertyValueProvider,
  ) {}

  async getPropertyValuePerSquareMeter(cityCode: string): Promise<{
    medianPricePerSquareMeters: number;
    referenceYear: string;
  }> {
    try {
      const { medianPricePerSquareMeters, referenceYear } = await lastValueFrom(
        this.cityPropertyValueProvider.getCityHousingPropertyValue(cityCode),
      );
      return {
        medianPricePerSquareMeters,
        referenceYear,
      };
    } catch (error) {
      console.warn("GetCityRelatedDataService: Cannot get city property value: ", error);
      return {
        medianPricePerSquareMeters: FRANCE_AVERAGE_PROPERTY_VALUE_SQUARE_METER,
        referenceYear: FRANCE_AVERAGE_PROPERTY_VALUE_REFERENCE_YEAR,
      };
    }
  }

  async getCityPopulationAndSurfaceArea(cityCode: string): Promise<{
    squareMetersSurfaceArea: number;
    population: number;
  }> {
    try {
      const city = await this.cityDataProvider.getCitySurfaceAreaAndPopulation(cityCode);

      return {
        squareMetersSurfaceArea: city.surfaceArea,
        population: city.population,
      };
    } catch (error) {
      console.warn(
        "GetCityRelatedDataService: Cannot get city population and surface area: ",
        error,
      );
      return {
        squareMetersSurfaceArea: FRANCE_AVERAGE_CITY_SQUARE_METERS_AREA,
        population: FRANCE_AVERAGE_CITY_POPULATION,
      };
    }
  }
}
