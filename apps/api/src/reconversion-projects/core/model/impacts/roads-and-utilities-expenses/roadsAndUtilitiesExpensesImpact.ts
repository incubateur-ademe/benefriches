import { SumOnEvolutionPeriodService } from "../SumOnEvolutionPeriodService";

const ROAD_AND_UTILITIES_MAINTENANCE_EURO_PER_HECTARE_PER_YEAR = 8995;
export const computeYearlyRoadsAndUtilitiesMaintenanceExpenses = (surfaceArea: number) => {
  return (surfaceArea / 10000) * ROAD_AND_UTILITIES_MAINTENANCE_EURO_PER_HECTARE_PER_YEAR;
};

type Props = {
  isFriche: boolean;
  surfaceArea: number;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
};
export const getRoadsAndUtilitiesExpensesImpacts = ({
  isFriche,
  surfaceArea,
  sumOnEvolutionPeriodService,
}: Props): number | undefined => {
  if (isFriche) {
    const yearlyMaintenanceAmount = computeYearlyRoadsAndUtilitiesMaintenanceExpenses(surfaceArea);
    return sumOnEvolutionPeriodService.sumWithDiscountFactor(-1 * yearlyMaintenanceAmount, {
      startYearIndex: 1,
    });
  }
  return undefined;
};
