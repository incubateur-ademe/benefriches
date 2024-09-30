import { ReinstatementExpense } from ".";
import { roundTo1Digit } from "../services";

export const REINSTATEMENT_JOBS_RATIOS_PER_EURO_PER_YEAR: Partial<
  Record<ReinstatementExpense["purpose"], number>
> = {
  sustainable_soils_reinstatement: 14 / 1000000,
  deimpermeabilization: 5.45 / 1000000,
  asbestos_removal: 6 / 1000000,
  demolition: 6 / 1000000,
  waste_collection: 5.7 / 1000000,
  remediation: 5 / 1000000,
};

export const computeReinstatementFullTimeJobs = (
  reinstatementCosts: ReinstatementExpense[] = [],
): number => {
  const reinstatementFullTimeJobs = reinstatementCosts.map(({ purpose, amount }) => {
    const ratio = REINSTATEMENT_JOBS_RATIOS_PER_EURO_PER_YEAR[purpose];
    return ratio ? amount * ratio : 0;
  }, 0);
  return roundTo1Digit(reinstatementFullTimeJobs.reduce((total, jobs) => total + jobs, 0));
};
