import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

export type PhotovoltaicPerformanceApiResult = {
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

type FetchResult = {
  expectedPerformanceMwhPerYear: number;
};

export const fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation =
  createAppAsyncThunk<FetchResult>(
    "projectCreation/renewableEnergyProject/fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation",
    async (_, { extra, getState }) => {
      const { projectCreation } = getState();
      const { lat, long } = projectCreation.siteData?.address ?? {};
      const peakPower =
        projectCreation.renewableEnergyProject.creationData
          .photovoltaicInstallationElectricalPowerKWc;

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
        expectedPerformanceMwhPerYear: Math.round(result.expectedPerformance.kwhPerYear / 1000),
      };
    },
  );
