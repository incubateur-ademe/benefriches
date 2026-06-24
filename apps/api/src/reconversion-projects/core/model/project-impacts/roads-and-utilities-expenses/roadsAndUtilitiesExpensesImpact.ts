import type { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";

const FRICHE_ROAD_AND_UTILITIES_MAINTENANCE_EURO_PER_HECTARE_PER_YEAR = 8995;
export const computeFricheYearlyRoadsAndUtilitiesMaintenanceExpenses = (surfaceArea: number) => {
  return (surfaceArea / 10000) * FRICHE_ROAD_AND_UTILITIES_MAINTENANCE_EURO_PER_HECTARE_PER_YEAR;
};

type Props = {
  isFriche: boolean;
  surfaceArea: number;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
};
export const computeFricheRoadsAndUtilitiesExpensesImpacts = ({
  isFriche,
  surfaceArea,
  sumOnEvolutionPeriodService,
}: Props): number | undefined => {
  if (isFriche) {
    const yearlyMaintenanceAmount =
      computeFricheYearlyRoadsAndUtilitiesMaintenanceExpenses(surfaceArea);
    return sumOnEvolutionPeriodService.sumWithDiscountFactor(-1 * yearlyMaintenanceAmount, {
      startYearIndex: 1,
    });
  }
  return undefined;
};

const AVOIDED_ROAD_AND_UTILITIES_MAINTENANCE_WITH_FRICHE_EURO_PER_HECTARE_PER_YEAR = 19952;
export const computeAvoidedWithFricheYearlyRoadsAndUtilitiesMaintenanceExpenses = (
  surfaceArea: number,
) => {
  return (
    (surfaceArea / 10000) *
    AVOIDED_ROAD_AND_UTILITIES_MAINTENANCE_WITH_FRICHE_EURO_PER_HECTARE_PER_YEAR
  );
};
