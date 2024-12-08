import { SiteYearlyExpense } from "shared";

type GroupedByExpensesKey = "bearer";

const groupAndSumBy =
  <K extends GroupedByExpensesKey>(key: K) =>
  (expenses: SiteYearlyExpense[]) => {
    return expenses.reduce<Record<SiteYearlyExpense[K], number>>(
      (expensesByKey, expense) => {
        const group = expense[key];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const totalAmountForKey = expense.amount + (expensesByKey[group] ?? 0);
        return { ...expensesByKey, [group]: totalAmountForKey };
      },
      // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
      {} as Record<SiteYearlyExpense[K], number>,
    );
  };

export const groupExpensesByBearer = (expenses: SiteYearlyExpense[]) => {
  const expensesMapByCategory = groupAndSumBy("bearer")(expenses);

  return Object.entries(expensesMapByCategory).map(([bearer, amount]) => ({
    bearer: bearer as SiteYearlyExpense["bearer"],
    amount,
  }));
};

export const getLabelForExpensePurpose = (expensePurpose: SiteYearlyExpense["purpose"]): string => {
  switch (expensePurpose) {
    case "propertyTaxes":
      return "Taxe foncière";
    case "operationsTaxes":
      return "Charges fiscales d'exploitation";
    case "rent":
      return "Loyer";
    case "accidentsCost":
      return "Accidents";
    case "illegalDumpingCost":
      return "Débarras de dépôt sauvage";
    case "maintenance":
      return "Entretien du site";
    case "otherManagementCosts":
      return "Autre dépenses de gestion du site";
    case "security":
      return "Gardiennage";
    case "otherSecuringCosts":
      return "Autres frais de sécurisation";
  }
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

const AVERAGE_PROPERTY_TAXES_EURO_PER_BUILDINGS_SURFACE_SQUARE_METERS = 15;
export const computeEstimatedPropertyTaxesAmount = (buildingsSurfaceArea: number) => {
  return Math.round(
    AVERAGE_PROPERTY_TAXES_EURO_PER_BUILDINGS_SURFACE_SQUARE_METERS * buildingsSurfaceArea,
  );
};
