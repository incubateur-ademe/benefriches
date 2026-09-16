import {
  CityImpactsData,
  CityImpactsDataProvider,
} from "src/territory/core/gateways/CityImpactsDataProvider";

const SAMPLES = [
  {
    name: "Longlaville",
    cityCode: "54321",
    mteZonageAbc: "B",
    isRural: false,
    stats: {
      accuracy: "city",
      surfaceAreaSquareMeters: 118.3 * 10000,
      population: 471941,
      propertyValueMedianPricePerSquareMeters: 2500,
      shareOfWorkTripsByPublicTransport: 13.7,
      annualRateOfPopulationChange: -0.79,
      landWithoutBuildingsMedianPricePerSquareMeters: 10,
    },
  },
  {
    name: "Béon",
    cityCode: "01039",
    mteZonageAbc: undefined,
    isRural: true,

    stats: {
      accuracy: "city",
      population: 1800,
      surfaceAreaSquareMeters: 15 * 10000,
      propertyValueMedianPricePerSquareMeters: 2500,
      shareOfWorkTripsByPublicTransport: undefined,
      annualRateOfPopulationChange: undefined,
      landWithoutBuildingsMedianPricePerSquareMeters: undefined,
    },
  },
  {
    name: "Saint-Christophe-en-Oisans",
    cityCode: "38375",
    mteZonageAbc: "C",
    isRural: true,

    stats: {
      accuracy: "city",

      population: 106,
      surfaceAreaSquareMeters: 123.5 * 10000,
      propertyValueMedianPricePerSquareMeters: 3064,
      shareOfWorkTripsByPublicTransport: 2.1,
      annualRateOfPopulationChange: -0.99,
      landWithoutBuildingsMedianPricePerSquareMeters: 10,
    },
  },
  {
    name: "Paris",
    cityCode: "75056",
    mteZonageAbc: "Abis",
    isRural: false,

    stats: {
      accuracy: "city",
      population: 2145906,
      surfaceAreaSquareMeters: 10540 * 10000,
      propertyValueMedianPricePerSquareMeters: 8000,
      shareOfWorkTripsByPublicTransport: 61.7,
      annualRateOfPopulationChange: -0.59,
      landWithoutBuildingsMedianPricePerSquareMeters: 10,
    },
  },
] as const satisfies Sample[];

type Sample = CityImpactsData & { cityCode: string };

export class InMemoryCityImpactsQuery implements CityImpactsDataProvider {
  private _shouldFail = false;
  private samples: Sample[] = SAMPLES;

  shouldFail() {
    this._shouldFail = true;
  }

  _setData(samples: Sample[]) {
    this.samples = samples;
  }

  getCityDataAndStats(cityCode: string): Promise<CityImpactsData> {
    if (this._shouldFail) throw new Error("Intended error");

    const result = this.samples.find((sample) => sample.cityCode === cityCode);

    if (!result) {
      return Promise.resolve({
        name: "",
        isRural: false,
        stats: {
          accuracy: "france",
          surfaceAreaSquareMeters: 14900000,
          population: 1800,
          propertyValueMedianPricePerSquareMeters: 3064,
          shareOfWorkTripsByPublicTransport: undefined,
          annualRateOfPopulationChange: undefined,
          landWithoutBuildingsMedianPricePerSquareMeters: undefined,
        },
      });
    }

    return Promise.resolve(result);
  }
}
