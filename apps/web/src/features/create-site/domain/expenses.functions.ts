import { Expense } from "./siteFoncier.types";

type GroupedByExpensesKey = "bearer" | "category";

const groupAndSumBy =
  <K extends GroupedByExpensesKey>(key: K) =>
  (expenses: Expense[]) => {
    return expenses.reduce(
      (expensesByKey, expense) => {
        const group = expense[key];
        const totalAmountForKey = expense.amount + (expensesByKey[group] ?? 0);
        return { ...expensesByKey, [group]: totalAmountForKey };
      },
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
  const expensesMapByCategory = groupAndSumBy("category")(expenses);

  return Object.entries(expensesMapByCategory).map(([category, amount]) => ({
    category: category as Expense["category"],
    amount,
  }));
};
