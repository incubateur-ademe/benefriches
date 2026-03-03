import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import { ReadStateHelper } from "../helpers/readState";
import { makeRenewableEnergyProjectCreationActionType } from "../renewableEnergy.actions";

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

export const fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation =
  createAppAsyncThunk<FetchResult>(
    makeRenewableEnergyProjectCreationActionType(
      "fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation",
    ),
    async (_, { extra, getState }) => {
      const { projectCreation } = getState();
      const { lat, long } = projectCreation.siteData?.address ?? {};
      const peakPower = ReadStateHelper.getStepAnswers(
        projectCreation.renewableEnergyProject.steps,
        "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
      )?.photovoltaicInstallationElectricalPowerKWc;

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
