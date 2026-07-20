import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import { ReadStateHelper } from "@/features/create-project/core/renewable-energy/helpers/readState";

const UPDATE_PROJECT_STORE_KEY = "projectUpdate";

type FetchResult = {
  expectedPerformanceMwhPerYear: number;
};

export const fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocationForUpdate =
  createAppAsyncThunk<FetchResult>(
    `${UPDATE_PROJECT_STORE_KEY}/fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation`,
    async (_, { extra, getState }) => {
      const { projectUpdate } = getState();
      const { lat, long } = projectUpdate.siteData?.address ?? {};
      const peakPower = ReadStateHelper.getStepAnswers(
        projectUpdate.renewableEnergyProject.steps,
        "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
      )?.photovoltaicInstallationElectricalPowerKWc;

      if (!lat || !long || !peakPower) {
        return Promise.reject(
          new Error(
            "fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocationForUpdate: Missing required parameters",
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
