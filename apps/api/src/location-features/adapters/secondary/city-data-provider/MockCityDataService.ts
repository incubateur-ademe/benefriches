import { Observable } from "rxjs";

import { CityDataProvider } from "src/location-features/core/gateways/CityDataProvider";
import { City } from "src/location-features/core/models/city";

const SAMPLES = [
  {
    name: "Longlaville",
    surfaceArea: 118.3,
    population: 471941,
    cityCode: "54321",
  },
  {
    name: "Béon",
    cityCode: "01039",
    population: undefined,
    surfaceArea: undefined,
  },
  {
    name: "Saint-Christophe-en-Oisans",
    cityCode: "38375",
    population: 106,
    surfaceArea: 123.5,
  },
  {
    name: "Paris",
    cityCode: "75056",
    population: 2145906,
    surfaceArea: 10540,
  },
];

export class MockCityDataService implements CityDataProvider {
  getCitySurfaceAreaAndPopulation(cityCode: string): Observable<City> {
    return new Observable((subscriber) => {
      const result = SAMPLES.find((sample) => sample.cityCode === cityCode);

      if (!result?.population || !result.surfaceArea) {
        throw new Error("No data found for cityCode " + cityCode);
      }

      subscriber.next(City.create(result));
      subscriber.complete();
    });
  }
}
