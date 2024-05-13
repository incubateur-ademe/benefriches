import { FormValues } from "./SiteYearlyExpensesForm";

import { Expense } from "@/features/create-site/domain/siteFoncier.types";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";

const expensesConfig = [
  { purpose: "rent", purposeCategory: "rent", defaultBearer: "operator" },
  { purpose: "propertyTaxes", purposeCategory: "taxes", defaultBearer: "owner" },
  { purpose: "operationsTaxes", purposeCategory: "taxes", defaultBearer: "operator" },
  { purpose: "maintenance", purposeCategory: "site_management", defaultBearer: "operator" },
  {
    purpose: "otherManagementCosts",
    purposeCategory: "site_management",
    defaultBearer: "operator",
  },
  { purpose: "security", purposeCategory: "safety", defaultBearer: "operator" },
  { purpose: "illegalDumpingCost", purposeCategory: "safety", defaultBearer: "operator" },
  { purpose: "accidentsCost", purposeCategory: "safety", defaultBearer: "operator" },
  { purpose: "otherSecuringCosts", purposeCategory: "safety", defaultBearer: "operator" },
] as const;

const getDefaultBearerForExpense = (
  expenseConfig: (typeof expensesConfig)[number],
  siteHasOperator: boolean,
): Expense["bearer"] => {
  if (!siteHasOperator) return "owner";

  return expenseConfig.defaultBearer;
};

export const mapFormDataToExpenses = (
  formData: FormValues,
  { siteHasOperator }: { siteHasOperator: boolean },
): Expense[] => {
  return typedObjectKeys(formData).reduce<Expense[]>((acc, key) => {
    const formValue = formData[key];
    const expenseConfig = expensesConfig.find((e) => e.purpose === key);
    if (!formValue.amount || !expenseConfig) return acc;

    const expense: Expense = {
      amount: formValue.amount,
      bearer:
        "bearer" in formValue && formValue.bearer
          ? formValue.bearer
          : getDefaultBearerForExpense(expenseConfig, siteHasOperator),
      purpose: expenseConfig.purpose,
      purposeCategory: expenseConfig.purposeCategory,
    };
    return [...acc, expense];
  }, []);
};
