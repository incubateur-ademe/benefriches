import {
  PerformanceResult,
  PhotovoltaicDataProvider,
} from "src/location-features/core/gateways/PhotovoltaicDataProvider";

export class MockPhotovoltaicGeoInfoSystemApi implements PhotovoltaicDataProvider {
  getPhotovoltaicPerformance(): Promise<PerformanceResult> {
    return Promise.resolve({
      context: {
        location: { lat: 48.859, long: 2.347, elevation: 49 },
        meteoData: {
          radiationDb: "PVGIS-SARAH2",
          meteoDb: "ERA5",
          yearMin: 2005,
          yearMax: 2020,
          useHorizon: true,
          horizonDb: "DEM-calculated",
        },
        mountingSystem: {
          slope: { value: 35, optimal: false },
          azimuth: { value: 0, optimal: false },
          type: "free-standing",
        },
        pvModule: { technology: "c-Si", peakPower: 3, systemLoss: 14 },
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
  }
}
