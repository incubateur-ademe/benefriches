type PerformanceParams = {
  lat: number;
  long: number;
  peakPower: number;
  loss?: number;
  angle?: number;
};

export type PerformanceResult = {
  context: {
    location: {
      lat: number;
      long: number;
      elevation: number;
    };
    meteoData: {
      radiationDb: "PVGIS-SARAH2";
      meteoDb: "ERA5";
      yearMin: number;
      yearMax: number;
      useHorizon: boolean;
      horizonDb: "DEM-calculated";
    };
    mountingSystem: {
      slope: { value: number; optimal: boolean };
      azimuth: { value: number; optimal: boolean };
      type: "free-standing";
    };
    pvModule: {
      technology: "c-Si";
      peakPower: number;
      systemLoss: number;
    };
  };
  expectedPerformance: {
    kwhPerDay: number;
    kwhPerMonth: number;
    kwhPerYear: number;
    lossPercents: {
      angleIncidence: number;
      spectralIncidence: number;
      tempAndIrradiance: number;
      total: number;
    };
  };
};

export interface PhotovoltaicDataProvider {
  getPhotovoltaicPerformance(params: PerformanceParams): Promise<PerformanceResult>;
}
