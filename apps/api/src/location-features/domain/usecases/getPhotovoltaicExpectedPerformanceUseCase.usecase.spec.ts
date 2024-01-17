import { MockPhotovoltaicGeoInfoSystemApi } from "src/location-features/adapters/secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi.mock";
import { GetPhotovoltaicExpectedPerformanceUseCase } from "./getPhotovoltaicExpectedPerformanceUseCase";

describe("GetPhotovoltaicExpectedPerformanceUseCase use case", () => {
  let dataProvider: MockPhotovoltaicGeoInfoSystemApi;

  beforeEach(() => {
    dataProvider = new MockPhotovoltaicGeoInfoSystemApi();
  });

  test("it should format the service result", async () => {
    const usecase = new GetPhotovoltaicExpectedPerformanceUseCase(dataProvider);
    const result = await usecase.execute({ lat: 48.859, long: 2.347, peakPower: 3.1 });

    expect(result).toBeDefined();
    expect(result).toEqual({
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
    });
  });
});
