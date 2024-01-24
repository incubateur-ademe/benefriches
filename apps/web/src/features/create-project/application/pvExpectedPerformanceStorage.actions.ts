import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

export type PhotovoltaicPerformanceApiResult = {
  computationContext: {
    location: {
      lat: number;
      long: number;
      elevation: number;
    };
    dataSources: {
      radiation: string;
      meteo: string;
      period: string;
      horizon?: string;
    };
    pvInstallation: {
      slope: { value: number; optimal: boolean };
      azimuth: { value: number; optimal: boolean };
      type: string;
      technology: string;
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

export type PhotovoltaicPerformanceApiPayload = {
  lat: number;
  long: number;
  peakPower: number;
};

export interface PhotovoltaicPerformanceGateway {
  getExpectedPhotovoltaicPerformance(
    payload: PhotovoltaicPerformanceApiPayload,
  ): Promise<PhotovoltaicPerformanceApiResult>;
}

export type FetchResult = {
  computationContext: PhotovoltaicPerformanceApiResult["computationContext"];
  expectedPerformanceMwhPerYear: number;
};

export const fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation =
  createAppAsyncThunk<FetchResult>(
    "project/fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation",
    async (_, { extra, getState }) => {
      const { projectCreation } = getState();
      const { lat, long } = projectCreation.siteData?.address ?? {};
      const peakPower = projectCreation.projectData.photovoltaicInstallationElectricalPowerKWc;

      if (!lat || !long || !peakPower) {
        return Promise.reject(
          new Error(
            "fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation: Missing required parameters",
          ),
        );
      }

      const result = await extra.photovoltaicPerformanceService.getExpectedPhotovoltaicPerformance({
        lat,
        long,
        peakPower,
      });

      return {
        computationContext: result.computationContext,
        expectedPerformanceMwhPerYear: Math.round(result.expectedPerformance.kwhPerYear / 1000),
      };
    },
  );
