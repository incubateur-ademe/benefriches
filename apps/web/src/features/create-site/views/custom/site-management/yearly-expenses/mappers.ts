import { SiteYearlyExpense, SiteYearlyExpensePurpose } from "shared";

import { SiteYearlyExpensesBaseConfig } from "@/features/create-site/core/expenses.functions";

import { FormValues } from "./SiteYearlyExpensesForm";

export const mapFormDataToExpenses = (
  formData: FormValues,
  expensesBaseConfig: SiteYearlyExpensesBaseConfig,
): SiteYearlyExpense[] => {
  return expensesBaseConfig
    .map(({ purpose, fixedBearer }) => ({
      purpose,
      bearer: fixedBearer ?? formData[purpose]?.bearer ?? "tenant",
      amount: formData[purpose]?.amount,
    }))
    .filter(({ amount }) => !!amount) as SiteYearlyExpense[];
};

type SiteExpensesInitialValues = {
  purpose: SiteYearlyExpensePurpose;
  amount: number;
  bearer: "owner" | "tenant" | undefined;
}[];
const mapDefaultAndStoreExpensesToInitialValues = (
  expensesBaseConfig: SiteYearlyExpensesBaseConfig,
  predefinedExpenses: SiteYearlyExpense[],
  estimatedAmounts: Partial<Record<SiteYearlyExpensePurpose, number>>,
): SiteExpensesInitialValues => {
  const hasExpensesInStore = predefinedExpenses.length > 0;
  if (!hasExpensesInStore)
    return expensesBaseConfig.map((defaultExpense) => {
      return {
        purpose: defaultExpense.purpose,
        amount: estimatedAmounts[defaultExpense.purpose] ?? 0,
        bearer: defaultExpense.fixedBearer ?? undefined,
      };
    });

  // assign predefined amount and bearer to expenses, if it exists
  // otherwise, assign default with amount 0
  return expensesBaseConfig.map((defaultExpense) => {
    const expenseInStore = predefinedExpenses.find((e) => e.purpose === defaultExpense.purpose);
    return {
      purpose: defaultExpense.purpose,
      amount: expenseInStore?.amount ?? 0,
      bearer: expenseInStore?.bearer ?? defaultExpense.fixedBearer ?? undefined,
    };
  });
};
const mapExpensesListToFormValues = (expenses: SiteExpensesInitialValues): FormValues => {
  return expenses.reduce((acc, expense) => {
    return {
      ...acc,
      [expense.purpose]: {
        amount: expense.amount,
        bearer: expense.bearer,
      },
    };
  }, {});
};

// predefinedExpenses are from the store, when user has already entered expenses
export const getInitialValues = (
  expensesBaseConfig: SiteYearlyExpensesBaseConfig,
  predefinedExpenses: SiteYearlyExpense[],
  estimatedAmounts: Partial<Record<SiteYearlyExpensePurpose, number>>,
): FormValues => {
  return mapExpensesListToFormValues(
    mapDefaultAndStoreExpensesToInitialValues(
      expensesBaseConfig,
      predefinedExpenses,
      estimatedAmounts,
    ),
  );
};
