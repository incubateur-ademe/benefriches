import { addYears } from "date-fns";

import { Schedule } from "..";
import { IDateProvider } from "../../adapters/IDateProvider";

export const computeDefaultReinstatementSchedule = (dateProvider: IDateProvider): Schedule => {
  const startDate = addYears(dateProvider.now(), 1);
  const endDate = addYears(startDate, 1);
  return { startDate, endDate };
};

export const computeDefaultInstallationSchedule =
  (dateProvider: IDateProvider) =>
  (startFrom?: Date): Schedule => {
    const startDate = startFrom ?? dateProvider.now();
    const endDate = addYears(startDate, 1);
    return { startDate, endDate };
  };
