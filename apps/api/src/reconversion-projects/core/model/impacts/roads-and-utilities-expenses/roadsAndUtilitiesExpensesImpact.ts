import { SocioEconomicImpact } from "shared";

const ROAD_AND_UTILITIES_MAINTENANCE_EURO_PER_HECTARE_PER_YEAR = 7520;
export const computeRoadsAndUtilitiesMaintenanceExpensesImpact = (
  isFriche: boolean,
  surfaceArea: number,
  evaluationPeriodInYears: number,
) => {
  if (isFriche) {
    return (
      -1 *
      (surfaceArea / 10000) *
      ROAD_AND_UTILITIES_MAINTENANCE_EURO_PER_HECTARE_PER_YEAR *
      evaluationPeriodInYears
    );
  }
  return undefined;
};

export const formatRoadsAndUtilitiesExpensesImpacts = (
  isFriche: boolean,
  surfaceArea: number,
  evaluationPeriodInYears: number,
): { socioeconomic: SocioEconomicImpact[] } => {
  const maintenanceAmount = computeRoadsAndUtilitiesMaintenanceExpensesImpact(
    isFriche,
    surfaceArea,
    evaluationPeriodInYears,
  );
  if (maintenanceAmount) {
    return {
      socioeconomic: [
        {
          impact: "roads_and_utilities_maintenance_expenses",
          amount: maintenanceAmount,
          actor: "community",
          impactCategory: "economic_direct",
        },
      ],
    };
  }
  return { socioeconomic: [] };
};
