import { roundTo1Digit } from "../../services";

const PHOTOVOLTAIC_OPERATIONS_FULL_TIME_JOBS_JOB_PER_KWC = 0.0002;
export const computeDefaultPhotovoltaicOperationsFullTimeJobs = (electricalPowerKWc: number) => {
  return roundTo1Digit(electricalPowerKWc * PHOTOVOLTAIC_OPERATIONS_FULL_TIME_JOBS_JOB_PER_KWC);
};

const PHOTOVOLTAIC_INSTALLATION_FULL_TIME_JOBS_JOB_PER_KWC = 0.0013;
export const computeDefaultPhotovoltaicConversionFullTimeJobs = (electricalPowerKWc: number) => {
  return roundTo1Digit(electricalPowerKWc * PHOTOVOLTAIC_INSTALLATION_FULL_TIME_JOBS_JOB_PER_KWC);
};
