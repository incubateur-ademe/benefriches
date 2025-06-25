import { SumOnEvolutionPeriodService } from "../sum-on-evolution-period/SumOnEvolutionPeriodService";

const ROAD_AND_UTILITIES_MAINTENANCE_EURO_PER_HECTARE_PER_YEAR = 19952;
export const computeYearlyRoadsAndUtilitiesMaintenanceExpenses = (surfaceArea: number) => {
  return (surfaceArea / 10000) * ROAD_AND_UTILITIES_MAINTENANCE_EURO_PER_HECTARE_PER_YEAR;
};

type Props = {
  surfaceArea: number;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
};
// Représente les dépenses d'entretin des VRD évités dans le cas d'une comparaison projet sur friche par rapport à une extension urbaine
export const computeAvoidedRoadsAndUtilitiesExpenses = ({
  surfaceArea,
  sumOnEvolutionPeriodService,
}: Props): number => {
  const yearlyMaintenanceAmount = computeYearlyRoadsAndUtilitiesMaintenanceExpenses(surfaceArea);
  return sumOnEvolutionPeriodService.sumWithDiscountFactor(yearlyMaintenanceAmount, {
    startYearIndex: 1,
  });
};
