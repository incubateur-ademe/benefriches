import { addYears } from "date-fns";

import { IDateProvider } from "../../adapters/IDateProvider";

export const computeDefaultReinstatementSchedule = (
  dateProvider: IDateProvider,
): { startDate: Date; endDate: Date } => {
  const startDate = addYears(dateProvider.now(), 1);
  const endDate = addYears(startDate, 1);
  return { startDate, endDate };
};

export const computeDefaultInstallationSchedule =
  (dateProvider: IDateProvider) =>
  (startFrom?: Date): { startDate: Date; endDate: Date } => {
    const startDate = startFrom ?? dateProvider.now();
    const endDate = addYears(startDate, 1);
    return { startDate, endDate };
  };
