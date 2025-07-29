import { MockPhotovoltaicGeoInfoSystemApi } from "src/photovoltaic-performance/adapters/secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi.mock";

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
