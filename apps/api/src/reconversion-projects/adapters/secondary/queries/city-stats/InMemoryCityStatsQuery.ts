import {
  CityStats,
  CityStatsProvider,
} from "src/reconversion-projects/core/gateways/CityStatsProvider";

const SAMPLES = [
  {
    name: "Longlaville",
    surfaceArea: 118.3 * 10000,
    population: 471941,
    cityCode: "54321",
    propertyValueMedianPricePerSquareMeters: 2500,
  },
  {
    name: "Béon",
    cityCode: "01039",
    population: undefined,
    surfaceArea: undefined,
    propertyValueMedianPricePerSquareMeters: 2500,
  },
  {
    name: "Saint-Christophe-en-Oisans",
    cityCode: "38375",
    population: 106,
    surfaceArea: 123.5 * 10000,
    propertyValueMedianPricePerSquareMeters: undefined,
  },
  {
    name: "Paris",
    cityCode: "75056",
    population: 2145906,
    surfaceArea: 10540 * 10000,
    propertyValueMedianPricePerSquareMeters: 8000,
  },
];

export class InMemoryCityStatsQuery implements CityStatsProvider {
  private _shouldFail = false;

  shouldFail() {
    this._shouldFail = true;
  }

  getCityStats(cityCode: string): Promise<CityStats> {
    if (this._shouldFail) throw new Error("Intended error");

    const result = SAMPLES.find((sample) => sample.cityCode === cityCode);

    if (!result) {
      return Promise.resolve({
        name: "",
        surfaceAreaSquareMeters: 14900000,
        population: 1800,
        propertyValueMedianPricePerSquareMeters: 3064,
      });
    }

    return Promise.resolve({
      name: result.name,
      surfaceAreaSquareMeters: result.surfaceArea ?? 14900000,
      population: result.population ?? 1800,
      propertyValueMedianPricePerSquareMeters:
        result.propertyValueMedianPricePerSquareMeters ?? 3064,
    });
  }
}
