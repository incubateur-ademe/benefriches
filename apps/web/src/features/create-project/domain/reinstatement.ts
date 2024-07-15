import { ReinstatementCost, ReinstatementCostsPurpose } from "@/shared/domain/reconversionProject";
import { roundTo1Digit } from "@/shared/services/round-numbers/roundNumbers";

const FULL_TIME_JOBS_RATIO_FOR_BUDGET_PER_EURO_PER_YEAR: Record<
  ReinstatementCostsPurpose,
  number | "unknown"
> = {
  sustainable_soils_reinstatement: 14 / 1000000,
  deimpermeabilization: 5.45 / 1000000,
  asbestos_removal: 6 / 1000000,
  demolition: 6 / 1000000,
  waste_collection: 5.7 / 1000000,
  remediation: 5 / 1000000,
  other_reinstatement: "unknown",
};

export const computeDefaultReinstatementFullTimeJobs = (
  reinstatementCosts: ReinstatementCost[],
) => {
  const reinstatementFullTimeJobs = reinstatementCosts.reduce((totalJobs, { purpose, amount }) => {
    const ratio = FULL_TIME_JOBS_RATIO_FOR_BUDGET_PER_EURO_PER_YEAR[purpose];
    return ratio === "unknown" ? totalJobs : totalJobs + amount * ratio;
  }, 0);
  return roundTo1Digit(reinstatementFullTimeJobs);
};
