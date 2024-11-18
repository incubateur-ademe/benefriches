import { addDays, addYears } from "date-fns";

import { IDateProvider } from "../../../adapters/IDateProvider";

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
    const startDate = startFrom ? addDays(startFrom, 1) : dateProvider.now();
    const endDate = addYears(startDate, 1);
    return { startDate, endDate };
  };

export type ProjectSchedule = {
  installation: { startDate: Date; endDate: Date };
  reinstatement?: { startDate: Date; endDate: Date };
  firstYearOfOperations: number;
};

export const getDefaultScheduleForProject =
  (dateProvider: IDateProvider) =>
  ({ hasReinstatement }: { hasReinstatement: boolean }): ProjectSchedule => {
    const reinstatement = hasReinstatement
      ? computeDefaultReinstatementSchedule(dateProvider)
      : undefined;
    const installation = computeDefaultInstallationSchedule(dateProvider)(reinstatement?.endDate);
    const firstYearOfOperations = installation.endDate.getFullYear();
    return {
      installation,
      reinstatement,
      firstYearOfOperations,
    };
  };
