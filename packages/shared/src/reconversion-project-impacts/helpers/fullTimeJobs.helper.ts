import { differenceInDays } from "date-fns";

type SpreadTemporaryFullTimeJobsOverInput = {
  temporaryFullTimeJobs: number;
  currentDurationInYears: number;
  targetDurationInYears: number;
};

export type Schedule = {
  startDate: Date;
  endDate: Date;
};

export const spreadTemporaryFullTimeJobsOver = (input: SpreadTemporaryFullTimeJobsOverInput) => {
  return (input.temporaryFullTimeJobs * input.currentDurationInYears) / input.targetDurationInYears;
};

export const getDurationFromScheduleInYears = ({ startDate, endDate }: Schedule) => {
  const durationInDays = differenceInDays(endDate, startDate);

  return durationInDays / 365;
};
