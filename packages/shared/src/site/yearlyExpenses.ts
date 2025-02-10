export type SiteManagementYearlyExpensePurpose =
  | "rent"
  | "propertyTaxes"
  | "operationsTaxes"
  | "maintenance"
  | "otherManagementCosts";

export type SiteSecurityYearlyExpensePurpose =
  | "security"
  | "illegalDumpingCost"
  | "accidentsCost"
  | "otherSecuringCosts";

export type SiteYearlyExpensePurpose =
  | SiteManagementYearlyExpensePurpose
  | SiteSecurityYearlyExpensePurpose;

export type SiteYearlyExpense = {
  purpose: SiteYearlyExpensePurpose;
  amount: number;
  bearer: "owner" | "tenant";
};

const SECURITY_COST_BY_HECTARE_PER_YEAR = 22000;
const MAINTENANCE_COST_BY_BUILDING_SQUARE_METER_PER_YEAR = 7;
const ILLEGAL_DUMPING_COST_PER_TON = 900;
const ILLEGAL_DUMPING_TON_PER_INHABITANT_PER_YEAR = 0.0047;
const ILLEGAL_DUMPING_ESTIMATED_RATIO = 1 / 100;

export const computeIllegalDumpingDefaultCost = (population: number) => {
  return Math.round(
    ILLEGAL_DUMPING_TON_PER_INHABITANT_PER_YEAR *
      population *
      ILLEGAL_DUMPING_ESTIMATED_RATIO *
      ILLEGAL_DUMPING_COST_PER_TON,
  );
};

export const computeMaintenanceDefaultCost = (buildingsSurface: number) => {
  return Math.round(MAINTENANCE_COST_BY_BUILDING_SQUARE_METER_PER_YEAR * buildingsSurface);
};

export const computeSecurityDefaultCost = (surfaceArea: number) => {
  return Math.round(SECURITY_COST_BY_HECTARE_PER_YEAR * (surfaceArea / 10000));
};
