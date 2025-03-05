import { CityDataProvider } from "src/reconversion-projects/core/gateways/CityDataProvider";
import { City } from "src/reconversion-projects/core/usecases/quickComputeUrbanProjectImpactsOnFricheUseCase.usecase";

const SAMPLES = [
  {
    name: "Longlaville",
    surfaceArea: 118.3 * 10000,
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
    surfaceArea: 123.5 * 10000,
  },
  {
    name: "Paris",
    cityCode: "75056",
    population: 2145906,
    surfaceArea: 10540 * 10000,
  },
];

export class MockCityDataService implements CityDataProvider {
  private _shouldFail = false;

  shouldFail() {
    this._shouldFail = true;
  }

  getCitySurfaceAreaAndPopulation(cityCode: string): Promise<City> {
    if (this._shouldFail) throw new Error("Intended error");

    const result = SAMPLES.find((sample) => sample.cityCode === cityCode);

    if (!result?.population || !result.surfaceArea) {
      throw new Error("No data found for cityCode " + cityCode);
    }

    return Promise.resolve(result);
  }
}
