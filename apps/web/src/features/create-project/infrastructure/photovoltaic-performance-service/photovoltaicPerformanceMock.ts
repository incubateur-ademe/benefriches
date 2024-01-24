import {
  PhotovoltaicPerformanceApiResult,
  PhotovoltaicPerformanceGateway,
} from "../../application/pvExpectedPerformanceStorage.actions";

export const MOCK_RESULT = {
  computationContext: {
    location: { lat: 48.859, long: 2.347, elevation: 49 },
    dataSources: {
      radiation: "PVGIS-SARAH2",
      meteo: "ERA5",
      period: "2005 - 2020",
      horizon: "DEM-calculated",
    },
    pvInstallation: {
      technology: "c-Si",
      peakPower: 3,
      systemLoss: 14,
      slope: { value: 35, optimal: false },
      azimuth: { value: 0, optimal: false },
      type: "free-standing",
    },
  },
  expectedPerformance: {
    kwhPerDay: 9.43,
    kwhPerMonth: 286.91,
    kwhPerYear: 3442.92,
    lossPercents: {
      angleIncidence: -2.98,
      spectralIncidence: 1.65,
      tempAndIrradiance: -5.73,
      total: -20.05,
    },
  },
};

export class ExpectedPhotovoltaicPerformanceMock implements PhotovoltaicPerformanceGateway {
  constructor(
    private result: PhotovoltaicPerformanceApiResult,
    private shouldFail: boolean = false,
  ) {}

  async getExpectedPhotovoltaicPerformance() {
    if (this.shouldFail) {
      throw new Error("Intended error");
    }
    return Promise.resolve(this.result);
  }
}
