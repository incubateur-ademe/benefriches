import { addDays, addYears, isValid } from "date-fns";

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

type Schedule = { startDate: Date; endDate: Date };

export type ProjectSchedule = {
  installation: { startDate: Date; endDate: Date };
  reinstatement?: { startDate: Date; endDate: Date };
  firstYearOfOperations: number;
};

type ScheduleDateStringInput = {
  startDate: string;
  endDate: string;
};
export class ProjectScheduleBuilder {
  private installationSchedule: Schedule | undefined = undefined;
  private reinstatementSchedule: Schedule | undefined = undefined;
  private firstYearOfOperations: number | undefined = undefined;

  withReinstatement(dateStrings: ScheduleDateStringInput | undefined): this {
    if (dateStrings) this.reinstatementSchedule = this.scheduleFromDateStrings(dateStrings);
    return this;
  }

  withInstallation({ startDate, endDate }: ScheduleDateStringInput): this {
    this.installationSchedule = this.scheduleFromDateStrings({ startDate, endDate });
    return this;
  }

  withFirstYearOfOperations(year: number): this {
    this.firstYearOfOperations = year;
    return this;
  }

  build(): ProjectSchedule {
    if (!this.installationSchedule) throw new Error("Installation schedule is required");
    if (!this.firstYearOfOperations) throw new Error("First year of operations is required");
    return {
      installation: this.installationSchedule,
      reinstatement: this.reinstatementSchedule,
      firstYearOfOperations: this.firstYearOfOperations,
    };
  }

  private scheduleFromDateStrings(dateStrings: ScheduleDateStringInput): Schedule | undefined {
    const startDate = new Date(dateStrings.startDate);
    const endDate = new Date(dateStrings.endDate);
    return isValid(startDate) && isValid(endDate) ? { startDate, endDate } : undefined;
  }
}

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
