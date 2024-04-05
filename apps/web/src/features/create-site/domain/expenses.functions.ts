import { Expense, ExpensePurpose } from "./siteFoncier.types";

type GroupedByExpensesKey = "bearer" | "purposeCategory";

const groupAndSumBy =
  <K extends GroupedByExpensesKey>(key: K) =>
  (expenses: Expense[]) => {
    return expenses.reduce<Record<Expense[K], number>>(
      (expensesByKey, expense) => {
        const group = expense[key];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const totalAmountForKey = expense.amount + (expensesByKey[group] ?? 0);
        return { ...expensesByKey, [group]: totalAmountForKey };
      },
      // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
      {} as Record<Expense[K], number>,
    );
  };

export const groupExpensesByBearer = (expenses: Expense[]) => {
  const expensesMapByCategory = groupAndSumBy("bearer")(expenses);

  return Object.entries(expensesMapByCategory).map(([bearer, amount]) => ({
    bearer: bearer as Expense["bearer"],
    amount,
  }));
};

export const groupExpensesByCategory = (expenses: Expense[]) => {
  const expensesMapByCategory = groupAndSumBy("purposeCategory")(expenses);

  return Object.entries(expensesMapByCategory).map(([category, amount]) => ({
    purposeCategory: category as Expense["purposeCategory"],
    amount,
  }));
};

export const getLabelForExpensePurpose = (expensePurpose: ExpensePurpose): string => {
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
