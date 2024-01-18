import { FormValues } from "./SiteYearlyExpensesForm";

import { Expense } from "@/features/create-site/domain/siteFoncier.types";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";

const expensesConfig = [
  { expenseItem: "rent", category: "rent", defaultBearer: "tenant" },
  { expenseItem: "propertyTaxes", category: "taxes", defaultBearer: "owner" },
  { expenseItem: "otherTaxes", category: "taxes", defaultBearer: "tenant" },
  { expenseItem: "otherManagementCosts", category: "site_management", defaultBearer: "tenant" },
  { expenseItem: "security", category: "safety", defaultBearer: "tenant" },
  { expenseItem: "illegalDumpingCost", category: "safety", defaultBearer: "tenant" },
  { expenseItem: "accidentsCost", category: "safety", defaultBearer: "tenant" },
  { expenseItem: "maintenance", category: "safety", defaultBearer: "tenant" },
  { expenseItem: "otherSecuringCosts", category: "safety", defaultBearer: "tenant" },
] as const;

const getDefaultBearerForExpense = (
  expenseConfig: (typeof expensesConfig)[number],
  siteHasTenant: boolean,
): Expense["bearer"] => {
  if (!siteHasTenant) return "owner";

  return expenseConfig.defaultBearer;
};

export const mapFormDataToExpenses = (
  formData: FormValues,
  { siteHasTenant }: { siteHasTenant: boolean },
): Expense[] => {
  return typedObjectKeys(formData).reduce<Expense[]>((acc, key) => {
    const formValue = formData[key];
    const expenseConfig = expensesConfig.find((e) => e.expenseItem === key);
    if (!formValue.amount || !expenseConfig) return acc;

    const expense: Expense = {
      amount: formValue.amount,
      bearer:
        "bearer" in formValue && formValue.bearer
          ? formValue.bearer
          : getDefaultBearerForExpense(expenseConfig, siteHasTenant),
      type: expenseConfig.expenseItem,
      category: expenseConfig.category,
    };
    return [...acc, expense];
  }, []);
};
